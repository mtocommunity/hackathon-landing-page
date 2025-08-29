import { createClient } from "@libsql/client";

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals }) => {
  const turso = createClient({
    url: locals.runtime.env.TURSO_DATABASE_URL,
    authToken: locals.runtime.env.TURSO_AUTH_TOKEN,
  });

  try {
    const data = request.body
      ? ((await request.json()) as { email: string })
      : null;

    if (data === null || !data.email) {
      throw new Error("Invalid JSON");
    }

    const query = await turso.execute(
      "SELECT * as count FROM emails_pre WHERE email = ?",
      [data.email]
    );
    const count = query.rows.length || 0;
    if (count > 0) {
      return new Response(
        JSON.stringify({ message: "El correo ya esta registrado" }),
        { status: 200 }
      );
    }

    const timestamp = new Date().toISOString();

    await turso.execute(
      "INSERT INTO emails_pre (email, timestamp) VALUES (?, ?)",
      [data.email, timestamp]
    );
    return new Response(
      JSON.stringify({
        message: "Correo registrado",
      })
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
    });
  }
};
