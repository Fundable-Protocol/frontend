import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prismaClient = new PrismaClient({
  log: ["query"],
}).$extends(withAccelerate());

const globalForPrisma = global as unknown as { prisma: typeof prismaClient };

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient;
}

export default prismaClient;
