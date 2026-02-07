import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

// Create connection pool with explicit connection string
const pool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:6432/extra_time_db",
})

// Create adapter
const adapter = new PrismaPg(pool)

// Create Prisma client with adapter
const prisma = new PrismaClient({ adapter })

async function seed() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: {email: 'admin@example.com'},
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin);
  await prisma.$disconnect();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error("❌ Erro no seed:", err);
  await prisma.$disconnect();
  process.exit(1);
});
