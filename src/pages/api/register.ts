import { createClient } from "@libsql/client";
import type { APIRoute } from "astro";

interface TeamData {
  name: string;
  amount: number;
  description: string;
}

interface MemberData {
  name: string;
  last_name: string;
  dni: string;
  utp_code: string;
  phone: string;
  email: string;
  degree: string;
}

interface RegistrationData {
  team: TeamData;
  members: MemberData[];
}

export const POST: APIRoute = async ({ request, locals }) => {
  const turso = createClient({
    url: locals.runtime.env.TURSO_DATABASE_URL,
    authToken: locals.runtime.env.TURSO_AUTH_TOKEN,
  });

  try {
    const data = request.body
      ? ((await request.json()) as RegistrationData)
      : null;

    // Validar que los datos existan
    if (!data || !data.team || !data.members) {
      return new Response(
        JSON.stringify({ error: "Datos incompletos" }),
        { status: 400 }
      );
    }

    // Validar equipo
    const { team, members } = data;
    
    if (!team.name || !team.description || !team.amount) {
      return new Response(
        JSON.stringify({ error: "Datos del equipo incompletos" }),
        { status: 400 }
      );
    }

    if (team.name.length > 100) {
      return new Response(
        JSON.stringify({ error: "El nombre del equipo no puede exceder 100 caracteres" }),
        { status: 400 }
      );
    }

    if (team.description.length > 200) {
      return new Response(
        JSON.stringify({ error: "La descripción del equipo no puede exceder 200 caracteres" }),
        { status: 400 }
      );
    }

    if (team.amount < 4 || team.amount > 6) {
      return new Response(
        JSON.stringify({ error: "El equipo debe tener entre 4 y 6 miembros" }),
        { status: 400 }
      );
    }

    if (members.length !== team.amount) {
      return new Response(
        JSON.stringify({ error: "El número de miembros no coincide con la cantidad especificada" }),
        { status: 400 }
      );
    }

    // Validar miembros
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      
      if (!member.name || !member.last_name || !member.dni || !member.utp_code || 
          !member.phone || !member.email || !member.degree) {
        return new Response(
          JSON.stringify({ error: `Datos incompletos para el miembro ${i + 1}` }),
          { status: 400 }
        );
      }

      // Validar formato de DNI
      if (!/^[0-9]{8}$/.test(member.dni)) {
        return new Response(
          JSON.stringify({ error: `DNI inválido para el miembro ${i + 1}. Debe tener 8 dígitos` }),
          { status: 400 }
        );
      }

      // Validar formato de teléfono
      if (!/^[0-9]{9}$/.test(member.phone)) {
        return new Response(
          JSON.stringify({ error: `Teléfono inválido para el miembro ${i + 1}. Debe tener 9 dígitos` }),
          { status: 400 }
        );
      }

      // Validar formato de email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
        return new Response(
          JSON.stringify({ error: `Email inválido para el miembro ${i + 1}` }),
          { status: 400 }
        );
      }
    }

    // Verificar si ya existe un equipo con el mismo nombre
    const existingTeam = await turso.execute(
      "SELECT * FROM teams WHERE name = ?",
      [team.name]
    );

    if (existingTeam.rows.length > 0) {
      return new Response(
        JSON.stringify({ error: "Ya existe un equipo registrado con ese nombre" }),
        { status: 409 }
      );
    }

    // Verificar si algún miembro ya está registrado (por DNI o email)
    for (const member of members) {
      const existingMember = await turso.execute(
        "SELECT * FROM team_members WHERE dni = ? OR email = ?",
        [member.dni, member.email]
      );

      if (existingMember.rows.length > 0) {
        return new Response(
          JSON.stringify({ 
            error: `El miembro con DNI ${member.dni} o email ${member.email} ya está registrado en otro equipo` 
          }),
          { status: 409 }
        );
      }
    }

    const timestamp = new Date().toISOString();

    // Insertar equipo
    const teamResult = await turso.execute(
      "INSERT INTO teams (name, amount, description, timestamp) VALUES (?, ?, ?, ?)",
      [team.name, team.amount, team.description, timestamp]
    );

    const teamId = teamResult.lastInsertRowid?.toString();

    if (!teamId) {
      return new Response(
        JSON.stringify({ error: "Error al crear el equipo" }),
        { status: 500 }
      );
    }

    // Insertar miembros
    for (const member of members) {
      await turso.execute(
        "INSERT INTO team_members (team_id, name, last_name, dni, utp_code, phone, email, degree, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          teamId,
          member.name,
          member.last_name,
          member.dni,
          member.utp_code,
          member.phone,
          member.email,
          member.degree,
          timestamp
        ]
      );
    }

    return new Response(
      JSON.stringify({
        message: "Equipo registrado exitosamente",
        teamId: teamId,
        teamName: team.name
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