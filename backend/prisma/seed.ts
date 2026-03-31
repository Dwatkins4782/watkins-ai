import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin tenant
  const adminTenant = await prisma.tenant.upsert({
    where: { slug: 'watkins-ai-admin' },
    update: {},
    create: {
      name: 'Watkins AI Admin',
      slug: 'watkins-ai-admin',
      plan: 'ENTERPRISE',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Admin tenant created:', adminTenant.id);

  // Create admin user
  const adminPass = process.env.SEED_ADMIN_PASSWORD || 'admin@WatkinsAI2024!';
  const hashedPassword = await bcrypt.hash(adminPass, 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@watkinsai.com' },
    update: {},
    create: {
      email: 'admin@watkinsai.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN',
      emailVerified: true,
      tenantId: adminTenant.id,
    },
  });
  console.log('✅ Admin user created:', adminUser.email);

  // Create default subscription for admin tenant
  await prisma.subscription.upsert({
    where: { id: `sub-${adminTenant.id}` },
    update: {},
    create: {
      id: `sub-${adminTenant.id}`,
      tenantId: adminTenant.id,
      plan: 'ENTERPRISE',
      status: 'active',
      maxStores: 999,
      maxProducts: 999999,
      maxEmailsPerMonth: 999999,
      maxSmsPerMonth: 999999,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });
  console.log('✅ Admin subscription created');

  // Create demo tenant for testing
  const demoTenant = await prisma.tenant.upsert({
    where: { slug: 'demo-store' },
    update: {},
    create: {
      name: 'Demo Store',
      slug: 'demo-store',
      plan: 'STARTER',
      status: 'TRIAL',
    },
  });

  const demoPass = process.env.SEED_DEMO_PASSWORD || 'demo@WatkinsAI2024!';
  const demoPassword = await bcrypt.hash(demoPass, 10);
  await prisma.user.upsert({
    where: { email: 'demo@watkinsai.com' },
    update: {},
    create: {
      email: 'demo@watkinsai.com',
      password: demoPassword,
      firstName: 'Demo',
      lastName: 'User',
      role: 'ADMIN',
      emailVerified: true,
      tenantId: demoTenant.id,
    },
  });

  await prisma.subscription.upsert({
    where: { id: `sub-${demoTenant.id}` },
    update: {},
    create: {
      id: `sub-${demoTenant.id}`,
      tenantId: demoTenant.id,
      plan: 'STARTER',
      status: 'active',
      maxStores: 1,
      maxProducts: 100,
      maxEmailsPerMonth: 5000,
      maxSmsPerMonth: 500,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });
  console.log('✅ Demo tenant & user created');

  console.log('\n🎉 Seed complete!');
  console.log('Admin login: admin@watkinsai.com / admin@WatkinsAI2024!');
  console.log('Demo login:  demo@watkinsai.com / demo@WatkinsAI2024!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
