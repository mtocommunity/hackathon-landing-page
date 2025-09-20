type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    otherLocals: {
      TURSO_DATABASE_URL: string;
      TURSO_AUTH_TOKEN: string;
      CLODUFLARE_TURNSTILE_SECRET: string;
      AWS_REGION: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
    };
  }
}
