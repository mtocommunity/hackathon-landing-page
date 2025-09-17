type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    otherLocals: {
      TURSO_DATABASE_URL: string;
      TURSO_AUTH_TOKEN: string;
    };
  }
}
