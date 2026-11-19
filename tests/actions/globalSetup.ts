import { execSync } from "node:child_process";

/*
 * Runs once before the actions project: apply migrations to prisma/test.db.
 * Never points at dev.db.
 */
export default function setup() {
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: "file:./prisma/test.db" },
  });
}
