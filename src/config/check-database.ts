import { prisma } from "./database.js";

async function checkDatabase() {
  try {
    const result = await prisma.$queryRaw<
      Array<{
        database: string;
        username: string;
      }>
    >`
      SELECT
        current_database() AS database,
        current_user AS username
    `;

    console.log("Prisma connection successful:");
    console.log(result[0]);
  } catch (error) {
    console.error("Prisma connection failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
