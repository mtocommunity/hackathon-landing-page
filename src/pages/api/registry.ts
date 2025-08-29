import { turso } from "../../backend/database-connection";

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  let data;
  try {
    data = request.body ? await request.json() : null;
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
    });
  }

  const timestamp = new Date().toISOString();

  try {
    const insert = await turso.execute(
      "INSERT INTO emails_pre (email, timestamp) VALUES (?, ?)",
      [data.email, timestamp]
    );
    return new Response(
      JSON.stringify({
        message: "Email registered successfully",
      })
    );
  } catch (error) {
    console.error("Error inserting data:", error);
    return new Response(JSON.stringify({ error: "Failed to insert data" }), {
      status: 500,
    });
  }
};
