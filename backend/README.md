# Watkins AI Backend

Production-ready NestJS backend for the Watkins AI e-commerce growth engine.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+

### Installation

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development server
npm run start:dev
```

The API will be available at `http://localhost:4000/api/v1`

## 📁 Project Structure

```
src/
├── ai/                 # Azure OpenAI integration
├── auth/              # Authentication & JWT
├── tenant/            # Multi-tenant management
├── store/             # Store management
├── crawler/           # Module 1: Website Crawler
├── email/             # Module 2: Email Engine
├── sms/               # Module 2: SMS Engine
├── analytics/         # Module 3: Analytics & Insights
├── recommendation/    # Module 4: Product Recommendations
├── support/           # Module 5: Customer Support AI
├── optimization/      # Module 6: Website Optimization
├── billing/           # Module 7: SaaS Billing
├── dfy/               # Module 8: DFY Store Builder
└── integration/       # Platform integrations (Shopify, WooCommerce)
```

## 🔑 Key Features

- **Multi-tenant SaaS architecture** with tenant isolation
- **8 AI-powered modules** for e-commerce growth
- **Background job processing** with BullMQ and Redis
- **Platform integrations** for Shopify and WooCommerce
- **Stripe billing** integration
- **Azure OpenAI** for AI capabilities
- **JWT authentication** with role-based access control

## 📊 Database

```bash
# View database in Prisma Studio
npm run prisma:studio

# Create new migration
npm run prisma:migrate

# Reset database (dev only)
npx prisma migrate reset
```

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🚢 Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

## 📝 API Documentation

### Authentication
- `POST /api/v1/auth/register` - Register new user & tenant
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Stores
- `POST /api/v1/stores` - Create store
- `GET /api/v1/stores` - List stores
- `GET /api/v1/stores/:id/analytics` - Get store analytics

### AI Modules
- `POST /api/v1/crawler/stores/:id/crawl` - Start website crawl
- `POST /api/v1/email/stores/:id/flows` - Create email flow
- `GET /api/v1/analytics/stores/:id/insights` - Get AI insights
- `POST /api/v1/recommendations/stores/:id/generate` - Generate product recommendations
- `POST /api/v1/support/stores/:id/tickets` - Create support ticket
- `POST /api/v1/dfy/projects` - Create DFY project

## 🔐 Environment Variables

See `.env.example` for all required environment variables.

## 📄 License

Proprietary - Watkins AI
