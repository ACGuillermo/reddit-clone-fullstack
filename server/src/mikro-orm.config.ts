import { Options } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import type { PostgreSqlDriver } from "@mikro-orm/postgresql";

const config: Options<PostgreSqlDriver> = {
  type: "postgresql",
  entities: ["./dist/entities"],
  entitiesTs: ["./src/entities"],
  migrations: {
    path: "./dist/migrations",
    pathTs: "./src/migrations",
    glob: "!(*.d).{js,ts}", // how to match migration files (all .js and .ts files, but not .d.ts)
  },
  debug: !__prod__,
  dbName: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT || "")
    : 5432,
};

export default config;
