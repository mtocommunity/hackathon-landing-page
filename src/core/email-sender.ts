import { AwsClient } from "aws4fetch";

export async function sendRegisterEmail({
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  data,
  ttl = 3,
}: {
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  data: {
    teamName: string;
    members: {
      name: string;
      email: string;
    }[];
  };
  ttl?: number;
}) {
  if (ttl <= 0) {
    console.error("Max retries reached. Could not send email.");
    return;
  }

  const aws = new AwsClient({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    service: "ses",
    region: AWS_REGION,
  });

  console.log("Sending email to:", data.members.map((x) => x.email).join(", "));

  for (const member of data.members) {
    console.log("Preparing email for:", member.email);
    try {
      await aws.fetch(
        "https://email." +
          AWS_REGION +
          ".amazonaws.com/v2/email/outbound-emails",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            FromEmailAddress: "Hackathon 2025 <hackathon@mtocommunity.com>",
            Destination: {
              ToAddresses: [member.email],
            },
            Content: {
              Simple: {
                Subject: {
                  Data: "Bienvenido al Hackathon 2025",
                },

                Body: {
                  Html: {
                    Data: `
<html>
  <body
    style="
      font-family: monospace;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 1rem;
    "
  >
    <div style="font-weight: bold; font-size: large">Bienvenid@ a la</div>
    <div style="font-weight: bold; font-size: xx-large">Hackathon 2025</div>
    <br />
    <div
      style="
        display: block;
        height: 2px;
        width: 100%;
        background: linear-gradient(to right, #02c8ed, #101b37, #e41476);
      "
    ></div>
    <br />
    <p>Hola, {{user}}</p>
    <p>
      Con este correo confirmamos tu registro,<br />
      en el equipo: {{team}}<br />
      <br />
      Gracias por registrarte en la Hackathon 2025.<br />
      Estamos emocionados de tenerte con nosotros.<br />
      Pronto recibirás más información sobre el evento.<br />
    </p>
    <br />
    <span style="font-weight: lighter; font-size: small"
      >Este es un correo automático, no es necesario que respondas.</span
    >
    <p style="color: #02c8ed">Contáctanos: contact@mtocommunity.com</p>
    <p style="color: #02c8ed">MTO Community x Mantaro</p>
  </body>
</html>
            `
                      .replace("{{team}}", data.teamName)
                      .replace("{{user}}", member.name),
                  },
                },
              },
            },
          }),
        }
      );
    } catch (e) {
      console.log(`Email sent to ${member.email}`);
    }
  }

  // Notification email to admin
  try {
    await aws.fetch(
      "https://email." + AWS_REGION + ".amazonaws.com/v2/email/outbound-emails",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          FromEmailAddress: "Hackathon 2025 <hackathon@mtocommunity.com>",
          Destination: {
            ToAddresses: ["contact@mtocommunity.com"],
          },
          Content: {
            Simple: {
              Subject: {
                Data: "Bienvenido al Hackathon 2025",
              },

              Body: {
                Text: {
                  Data: `Nuevo equipo registrado: ${
                    data.teamName
                  }\n\nMiembros:\n${data.members
                    .map((m) => `- ${m.name} (${m.email})`)
                    .join("\n")}`,
                },
              },
            },
          },
        }),
      }
    );
  } catch (e) {
    console.error("Error sending admin notification email:", e);
  }
}
