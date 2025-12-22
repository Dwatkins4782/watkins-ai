# 🧠 Watkins AI Growth Engine

**Full-stack, production-ready AI SaaS platform for e-commerce growth**

Watkins AI is an enterprise-grade, multi-tenant platform that gives e-commerce businesses the power of an entire AI growth team. It automatically audits websites, generates content, manages email/SMS campaigns, optimizes conversion rates, handles customer support, and can even build complete stores from scratch.

---

## 🚀 Features

### 8 AI-Powered Modules

| Module | Description | Key Features |
|--------|-------------|--------------|
| **1. Website Crawler & Analyzer** | Automated site auditing | SEO analysis, brand voice extraction, UX auditing, competitor insights |
| **2. Email & SMS Engine** | Revenue-driving campaigns | AI-generated flows, automated sequences, performance tracking |
| **3. Analytics & Insights** | Profit optimization | Profit Score calculation, daily AI tasks, actionable insights |
| **4. Product Recommendations** | Smart upselling | Bundles, cross-sells, personalized recommendations |
| **5. Customer Support AI** | Automated support | Sentiment analysis, AI responses, ticket management |
| **6. Website Optimization** | Conversion optimization | Product page rewrites, SEO optimization, A/B testing |
| **7. SaaS Billing** | Multi-tenant management | Stripe integration, usage tracking, subscription tiers |
| **8. DFY Store Builder** | Complete store generation | Branding, products, content, marketing - all AI-generated |

---

## 🏗️ Architecture

### Technology Stack

**Backend:**
- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL with Prisma ORM
- **Cache/Queue:** Redis + BullMQ
- **AI:** Azure OpenAI (GPT-4o)
- **Auth:** JWT with Passport
- **Payment:** Stripe
- **Email:** SendGrid
- **SMS:** Twilio

**Frontend:**
- **Framework:** Next.js 14 (App Router)
- **UI:** TailwindCSS
- **State:** Zustand + React Query
- **Type Safety:** TypeScript

**Integrations:**
- Shopify API
- WooCommerce REST API
- Stripe API
- SendGrid API
- Twilio API

---

## 🚦 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Azure OpenAI account
- Stripe account (for billing)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/watkins-ai.git
cd watkins-ai

# Setup Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run prisma:generate
npm run prisma:migrate
npm run start:dev

# Setup Frontend (in new terminal)
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local
npm run dev
```

**Backend:** http://localhost:4000/api/v1  
**Frontend:** http://localhost:3000

---

## 📦 Project Structure

```
watkins-ai/
├── backend/                    # NestJS API
│   ├── prisma/
│   │   └── schema.prisma      # Complete database schema
│   └── src/
│       ├── ai/                # Azure OpenAI service
│       ├── auth/              # JWT authentication
│       ├── tenant/            # Multi-tenant management
│       ├── store/             # Store management
│       ├── crawler/           # Module 1: Crawler
│       ├── email/             # Module 2: Email
│       ├── sms/               # Module 2: SMS
│       ├── analytics/         # Module 3: Analytics
│       ├── recommendation/    # Module 4: Recommendations
│       ├── support/           # Module 5: Support
│       ├── optimization/      # Module 6: Optimization
│       ├── billing/           # Module 7: Billing
│       ├── dfy/               # Module 8: DFY Builder
│       └── integration/       # Shopify, WooCommerce
│
├── frontend/                  # Next.js Dashboard
│   └── src/
│       ├── app/
│       │   ├── auth/         # Login/Register
│       │   └── dashboard/    # Main dashboard & modules
│       ├── components/       # Reusable UI components
│       └── lib/              # API client, stores
│
├── docs/                      # Documentation
├── prompts/                   # AI prompt templates
└── README.md
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/watkins_ai
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
AZURE_OPENAI_API_KEY=your-azure-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG....
TWILIO_ACCOUNT_SID=AC...
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

---

## 🎯 Key Features

### Multi-Tenant Architecture
- Complete tenant isolation
- Per-tenant subscription management
- Usage tracking and limits
- White-label ready

### AI-Powered Automation
- Azure OpenAI GPT-4o integration
- Context-aware content generation
- Brand voice matching
- Automated decision-making

### Scalable Infrastructure
- Background job processing with BullMQ
- Redis caching for performance
- Prisma ORM for type-safe queries
- Modular, maintainable codebase

### Production-Ready
- JWT authentication with role-based access
- Stripe subscription billing
- Comprehensive error handling
- Logging and monitoring ready
- API documentation
- TypeScript throughout

---

## 📊 Database Schema

The application includes a comprehensive database schema with 30+ models:

- **Core:** User, Tenant, Subscription, Store
- **E-commerce:** Product, Order, Customer, OrderItem
- **Module 1:** CrawlReport, AuditReport
- **Module 2:** EmailFlow, SmsFlow, Campaign
- **Module 3:** Insight
- **Module 4:** Recommendation, BundleItem
- **Module 5:** SupportTicket, SupportMessage
- **Module 8:** DfyProject
- **System:** Session, ApiKey, UserActivity, JobQueue

---

## 🚀 Deployment

### Backend (Railway/Render/AWS)
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
```

### Docker
```bash
docker-compose up -d
```

---

## 📈 Subscription Tiers

| Tier | Price/mo | Stores | Products | Emails/mo | SMS/mo |
|------|----------|--------|----------|-----------|---------|
| **Free** | $0 | 1 | 100 | 1,000 | 100 |
| **Starter** | $49 | 2 | 500 | 10,000 | 500 |
| **Growth** | $149 | 5 | 2,000 | 50,000 | 2,000 |
| **Professional** | $299 | 10 | 10,000 | 100,000 | 5,000 |
| **Enterprise** | Custom | Unlimited | Unlimited | Unlimited | Unlimited |
| **DFY Builder** | $999 | - | - | - | - |

---

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting with ThrottlerGuard
- Input validation with class-validator
- SQL injection protection with Prisma
- XSS protection with Helmet
- CORS configuration

---

## 📝 API Documentation

### Authentication
```
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

### Stores
```
GET    /api/v1/stores
POST   /api/v1/stores
GET    /api/v1/stores/:id
POST   /api/v1/stores/:id/sync
```

### AI Modules
```
POST   /api/v1/crawler/stores/:id/crawl
POST   /api/v1/email/stores/:id/flows
GET    /api/v1/analytics/stores/:id/dashboard
POST   /api/v1/recommendations/stores/:id/generate
POST   /api/v1/support/stores/:id/tickets
POST   /api/v1/dfy/projects
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test
npm run test:e2e
npm run test:cov

# Frontend tests
cd frontend
npm test
```

---

## 🤝 Contributing

This is a proprietary project. For collaboration inquiries, please contact the development team.

---

## 📄 License

Proprietary - Watkins AI © 2024

All rights reserved. Unauthorized copying, distribution, or modification of this software is strictly prohibited.

---

## 🆘 Support

- **Documentation:** [docs/](./docs/)
- **Issues:** Contact development team
- **Email:** support@watkinsai.com

---

## 🎉 Credits

Built with ❤️ using:
- NestJS
- Next.js
- Prisma
- Azure OpenAI
- Stripe
- and many other amazing open-source tools

---

**Watkins AI** - Empowering e-commerce businesses with AI
