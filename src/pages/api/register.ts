import { createClient } from "@libsql/client";
import { z } from "astro/zod";
import type { APIRoute } from "astro";
import { sendRegisterEmail } from "../../core/email-sender";

// Schemas de validación con Zod
const TeamSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "El nombre del equipo es requerido" })
    .max(100, {
      message: "El nombre del equipo no puede exceder 100 caracteres",
    }),
  amount: z.coerce
    .number()
    .int({ message: "La cantidad de miembros debe ser un número entero" })
    .min(4, { message: "El equipo debe tener entre 4 y 6 miembros" })
    .max(6, { message: "El equipo debe tener entre 4 y 6 miembros" }),
  description: z
    .string()
    .trim()
    .min(1, { message: "La descripción del equipo es requerida" })
    .max(200, {
      message: "La descripción del equipo no puede exceder 200 caracteres",
    }),
});

const MemberSchema = z.object({
  name: z.string().trim().min(1, { message: "Nombre requerido" }),
  last_name: z.string().trim().min(1, { message: "Apellido requerido" }),
  dni: z
    .string()
    .trim()
    .regex(/^\d{8}$/, { message: "DNI inválido. Debe tener 8 dígitos" }),
  utp_code: z
    .string()
    .trim()
    .regex(/^U\d{8}$/, {
      message: "Código UTP inválido. Formato: U12345678",
    }),
  phone: z
    .string()
    .trim()
    .regex(/^\d{9}$/, { message: "Teléfono inválido. Debe tener 9 dígitos" }),
  email: z.string().trim().email({ message: "Email inválido" }),
  degree: z.string().trim().min(1, { message: "Carrera requerida" }),
});

const RegistrationSchema = z
  .object({
    team: TeamSchema,
    members: z
      .array(MemberSchema)
      .min(4, { message: "El equipo debe tener entre 4 y 6 miembros" })
      .max(6, { message: "El equipo debe tener entre 4 y 6 miembros" }),
  })
  .superRefine((data, ctx) => {
    // Validación cruzada: cantidad declarada vs. miembros enviados
    if (data.members.length !== data.team.amount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["members"],
        message:
          "El número de miembros no coincide con la cantidad especificada",
      });
    }

    // Evitar duplicados dentro del mismo equipo
    const dniSet = new Set<string>();
    const emailSet = new Set<string>();
    data.members.forEach((m, idx) => {
      if (dniSet.has(m.dni)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["members", idx, "dni"],
          message: "DNI duplicado dentro del equipo",
        });
      } else {
        dniSet.add(m.dni);
      }

      if (emailSet.has(m.email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["members", idx, "email"],
          message: "Email duplicado dentro del equipo",
        });
      } else {
        emailSet.add(m.email);
      }
    });
  });

export const POST: APIRoute = async ({ request, locals }) => {
  if (new Date().getTime() > new Date("2025-09-29T23:59:59-05:00").getTime()) {
    return new Response(
      JSON.stringify({
        error:
          "El periodo de registro ha finalizado. Puedes intentar contactarte por correo a contact@mtocommunity.com pero no garantizamos una respuesta positiva.",
      }),
      {
        status: 400,
      }
    );
  }

  let turnstileToken = request.headers.get("Authorization");
  if (!turnstileToken) {
    return new Response(
      JSON.stringify({ error: "Debes validar que no eres un robot" }),
      {
        status: 400,
      }
    );
  }

  // Verificar el token de Turnstile
  try {
    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: locals.runtime.env.CLODUFLARE_TURNSTILE_SECRET,
          response: turnstileToken,
        }),
      }
    );

    const verifyData: any = await verifyResponse.json();
    if (!(verifyData?.success as boolean)) {
      return new Response(
        JSON.stringify({ error: "No se pudo validar que no seas un robot" }),
        {
          status: 400,
        }
      );
    }
  } catch (e) {
    console.error("Error al verificar Turnstile:", e);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
    });
  }

  let turso;
  try {
    turso = createClient({
      url: locals.runtime.env.TURSO_DATABASE_URL,
      authToken: locals.runtime.env.TURSO_AUTH_TOKEN,
    });
  } catch (e) {
    console.error("Error al conectar con la base de datos:", e);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
    });
  }

  try {
    // Parseo seguro del JSON
    const json = await request.json().catch(() => null);
    if (!json) {
      return new Response(JSON.stringify({ error: "JSON inválido o vacío" }), {
        status: 400,
      });
    }

    // Validación con Zod
    const parsed = RegistrationSchema.safeParse(json);
    if (!parsed.success) {
      const { fieldErrors, formErrors } = parsed.error.flatten();
      return new Response(
        JSON.stringify({
          error: "Alguno de los datos proporcionados es inválido",
          fieldErrors,
          formErrors,
        }),
        { status: 400 }
      );
    }

    const { team, members } = parsed.data;

    // Verificar si ya existe un equipo con el mismo nombre
    const existingTeam = await turso.execute(
      "SELECT * FROM teams WHERE name = ?",
      [team.name]
    );

    if (existingTeam.rows.length > 0) {
      return new Response(
        JSON.stringify({
          error: "Ya existe un equipo registrado con ese nombre",
        }),
        { status: 409 }
      );
    }

    // Verificar si algún miembro ya está registrado (por DNI o email)
    for (const member of members) {
      const existingMember = await turso.execute(
        "SELECT * FROM members WHERE dni = ? OR email = ? OR utp_code = ?",
        [member.dni, member.email, member.utp_code]
      );

      if (existingMember.rows.length > 0) {
        return new Response(
          JSON.stringify({
            error: `El miembro con DNI ${member.dni}, email ${member.email} o codigo ${member.utp_code} ya está registrado en otro equipo`,
          }),
          { status: 409 }
        );
      }
    }

    const timestamp = new Date().toISOString();

    // Insert team
    const teamResult = await turso.execute(
      "INSERT INTO teams (name, members_amount, description, timestamp) VALUES (?, ?, ?, ?)",
      [team.name, team.amount, team.description, timestamp]
    );

    const teamId = teamResult.lastInsertRowid?.toString();

    if (!teamId) {
      return new Response(
        JSON.stringify({ error: "Error al crear el equipo" }),
        { status: 500 }
      );
    }

    // Insert members
    try {
      for (const member of members) {
        await turso.execute(
          "INSERT INTO members (team_id, name, last_name, dni, utp_code, phone, email, degree, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            teamId,
            member.name,
            member.last_name,
            member.dni,
            member.utp_code,
            member.phone,
            member.email,
            member.degree,
            timestamp,
          ]
        );
      }
    } catch (e) {
      // Delete the team if member insertion fails
      await turso.execute("DELETE FROM teams WHERE id = ?", [teamId]);
      throw e;
    }

    await sendRegisterEmail({
      AWS_REGION: (locals.runtime.env.AWS_REGION as string) || "",
      AWS_ACCESS_KEY_ID: (locals.runtime.env.AWS_ACCESS_KEY_ID as string) || "",
      AWS_SECRET_ACCESS_KEY:
        (locals.runtime.env.AWS_SECRET_ACCESS_KEY as string) || "",
      data: {
        teamName: team.name,
        members: members.map((x) => {
          return {
            name: `${x.name} ${x.last_name}`,
            email: x.email,
          };
        }),
      },
    });

    return new Response(
      JSON.stringify({
        message: "Equipo registrado exitosamente",
        teamId,
        teamName: team.name,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar equipo:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
};
