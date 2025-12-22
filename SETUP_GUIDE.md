# 🚀 Watkins AI - Complete Setup Guide

This guide will walk you through setting up the Watkins AI Growth Engine from scratch.

---

## 📋 Prerequisites

Before you begin, ensure you have:

✅ **Node.js 18+** installed ([Download](https://nodejs.org/))  
✅ **PostgreSQL 14+** installed ([Download](https://www.postgresql.org/download/))  
✅ **Redis 7+** installed ([Download](https://redis.io/download))  
✅ **Git** installed  
✅ **Azure OpenAI** account with API access  
✅ **Stripe** account (for billing features)  
✅ Optional: SendGrid, Twilio accounts (for email/SMS)

---

## 🔧 Step 1: Clone and Setup

### Clone the Repository
```bash
git clone https://github.com/yourusername/watkins-ai.git
cd watkins-ai
```

---

## 🗄️ Step 2: Database Setup

### Create Database
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE watkins_ai;

# Exit
\q
```

---

## ⚙️ Step 3: Backend Setup

### Navigate to Backend
```bash
cd backend
```

### Install Dependencies
```bash
npm install
```

### Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your actual credentials
```

**Required Environment Variables:**
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/watkins_ai"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Azure OpenAI (REQUIRED for AI features)
AZURE_OPENAI_API_KEY=your-azure-openai-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Stripe (REQUIRED for billing)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_STARTER=price_starter_id
STRIPE_PRICE_GROWTH=price_growth_id
STRIPE_PRICE_PROFESSIONAL=price_professional_id
STRIPE_PRICE_ENTERPRISE=price_enterprise_id
STRIPE_PRICE_DFY_BUILDER=price_dfy_builder_id

# Optional: Email
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@watkinsai.com

# Optional: SMS
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Optional: Platform Integrations
SHOPIFY_API_KEY=your-shopify-api-key
SHOPIFY_API_SECRET=your-shopify-api-secret
WOOCOMMERCE_CONSUMER_KEY=your-woocommerce-consumer-key
WOOCOMMERCE_CONSUMER_SECRET=your-woocommerce-consumer-secret
```

### Generate Prisma Client & Run Migrations
```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Optional: Seed database with sample data
npm run prisma:seed
```

### Start Backend Server
```bash
# Development mode
npm run start:dev

# The backend will be running at http://localhost:4000
```

**Verify Backend:**
- Open http://localhost:4000/api/v1/auth/me
- You should see a 401 Unauthorized response (this is expected without a token)

---

## 🎨 Step 4: Frontend Setup

### Open New Terminal
```bash
# Navigate to frontend from project root
cd frontend
```

### Install Dependencies
```bash
npm install
```

### Configure Environment
```bash
# Copy example environment file
cp .env.local.example .env.local

# Edit .env.local
```

**Frontend Environment:**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### Start Frontend Server
```bash
npm run dev

# The frontend will be running at http://localhost:3000
```

---

## 🎯 Step 5: Create Your First Account

1. **Open your browser** and navigate to http://localhost:3000
2. **Click "Sign up"** or go directly to http://localhost:3000/auth/register
3. **Fill in the registration form:**
   - First Name
   - Last Name
   - Email
   - Company Name
   - Password (min 8 characters)
4. **Click "Create Account"**
5. You'll be automatically logged in and redirected to the dashboard

---

## 🏪 Step 6: Add Your First Store

1. **Navigate to "Stores"** in the sidebar
2. **Click "Add Store"**
3. **Fill in store details:**
   - Store Name
   - Store URL
   - Platform (Shopify/WooCommerce/Custom)
   - API Credentials (if using Shopify/WooCommerce)
4. **Click "Create Store"**
5. The system will automatically sync your products

---

## 🤖 Step 7: Test AI Features

### 1. Website Crawler
- Go to your store
- Click "Crawl Website"
- Wait for the AI to analyze your site
- View SEO insights, UX issues, and brand voice analysis

### 2. Email Generation
- Navigate to "Email & SMS"
- Click "Create Email Flow"
- Select flow type (e.g., Abandoned Cart)
- Enable "AI Generate"
- Let the AI create your email content

### 3. Analytics Dashboard
- Go to "Analytics"
- Click "Generate Insights"
- View your Profit Score
- See AI-generated growth recommendations

### 4. Product Recommendations
- Navigate to "Recommendations"
- Click "Generate Recommendations"
- AI will suggest bundles, upsells, and cross-sells

### 5. Support AI
- Go to "Support"
- Create a test ticket
- Watch AI automatically analyze and respond

---

## 🐳 Step 8: Docker Deployment (Optional)

### Using Docker Compose
```bash
# From project root
cp .env.example .env
# Edit .env with your credentials

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Services will be available at:**
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

---

## 🔍 Step 9: Verify Everything Works

### Backend Health Check
```bash
curl http://localhost:4000/api/v1/auth/me
# Should return 401 (expected without token)
```

### Database Connection
```bash
cd backend
npm run prisma:studio
# Opens Prisma Studio at http://localhost:5555
```

### Redis Connection
```bash
redis-cli ping
# Should return PONG
```

---

## 🚨 Troubleshooting

### Backend won't start
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# Check if Redis is running
redis-cli ping

# Check database connection
cd backend
npm run prisma:studio
```

### Frontend shows API errors
```bash
# Verify backend is running
curl http://localhost:4000/api/v1/auth/me

# Check frontend .env.local
cat frontend/.env.local
# Should have: NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### AI features not working
```bash
# Verify Azure OpenAI credentials in backend/.env
# Test with:
curl https://your-resource.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview \
  -H "api-key: your-api-key" \
  -H "Content-Type: application/json"
```

### Database migration errors
```bash
cd backend
# Reset database (CAUTION: This deletes all data)
npm run prisma:migrate reset

# Or create new migration
npm run prisma:migrate dev --name init
```

---

## 📚 Next Steps

✅ **Configure Stripe Products:**
- Create products in Stripe Dashboard
- Update price IDs in backend/.env

✅ **Setup Email/SMS:**
- Configure SendGrid and Twilio
- Test email flows

✅ **Connect E-commerce Platforms:**
- Add Shopify/WooCommerce credentials
- Sync products

✅ **Customize Branding:**
- Update logo and colors in frontend
- Modify brand voice settings

✅ **Production Deployment:**
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
- Configure domain and SSL
- Set up monitoring

---

## 📖 Documentation

- **[Backend README](./backend/README.md)** - API documentation
- **[Frontend README](./frontend/README.md)** - UI documentation
- **[Architecture](./docs/ARCHITECTURE.md)** - System design
- **[API Reference](./docs/API_REFERENCE.md)** - Complete API docs

---

## 💡 Pro Tips

1. **Use Prisma Studio** for easy database management:
   ```bash
   cd backend && npm run prisma:studio
   ```

2. **Monitor background jobs** in Redis:
   ```bash
   redis-cli
   KEYS bull:*
   ```

3. **View backend logs** in real-time:
   ```bash
   cd backend && npm run start:dev
   ```

4. **Hot reload** for both frontend and backend during development

5. **Test API endpoints** with the included Postman collection (coming soon)

---

## 🆘 Getting Help

- **Documentation:** Check `/docs` folder
- **Issues:** Create a GitHub issue
- **Email:** support@watkinsai.com

---

## 🎉 You're All Set!

Your Watkins AI Growth Engine is now running! 

**Login at:** http://localhost:3000  
**API at:** http://localhost:4000/api/v1

Start by:
1. Creating your first store
2. Running the website crawler
3. Generating AI-powered email flows
4. Checking your analytics dashboard

**Happy growing! 🚀**

---

## 📝 Quick Reference

```bash
# Backend
cd backend
npm run start:dev           # Start development
npm run build              # Build for production
npm run start:prod         # Start production
npm run prisma:studio      # Open database GUI

# Frontend
cd frontend
npm run dev                # Start development
npm run build              # Build for production
npm start                  # Start production

# Docker
docker-compose up -d       # Start all services
docker-compose down        # Stop all services
docker-compose logs -f     # View logs
```

---

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Watkins AI** - E-commerce Growth Engine
