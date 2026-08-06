const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.config.findFirst().then(console.log).finally(() => prisma.$disconnect());
