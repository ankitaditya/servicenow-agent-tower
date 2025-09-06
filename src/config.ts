import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT ?? 3000,
  postgres: {
    host: process.env.PGHOST ?? "postgres",
    port: parseInt(process.env.PGPORT ?? "5432"),
    user: process.env.PGUSER ?? "itom_user",
    password: process.env.PGPASSWORD ?? "secret",
    database: process.env.PGDATABASE ?? "itom",
  },
  servicNow: {
    instance: process.env.SN_INSTANCE ?? "dev123",
    username: process.env.SN_USER ?? "admin",
    password: process.env.SN_PASSWORD ?? "pass",
  },
};