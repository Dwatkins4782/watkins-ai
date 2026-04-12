"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
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
//# sourceMappingURL=seed.js.map