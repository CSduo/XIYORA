import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

let dbInstance: any = null;
let poolInstance: any = null;

export function getDb() {
  if (dbInstance) return dbInstance;
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to configure the DATABASE_URL environment variable?",
    );
  }
  poolInstance = new Pool({ connectionString: dbUrl });
  dbInstance = drizzle(poolInstance, { schema });
  return dbInstance;
}

// Proxy db to lazily initialize on first access
export const db = new Proxy({} as any, {
  get(target, prop) {
    return getDb()[prop];
  },
  set(target, prop, value) {
    getDb()[prop] = value;
    return true;
  }
});

export * from "./schema";
