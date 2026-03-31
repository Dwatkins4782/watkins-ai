-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER', 'VIEWER');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'STARTER', 'GROWTH', 'PROFESSIONAL', 'ENTERPRISE', 'DFY_BUILDER');

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'TRIAL', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StorePlatform" AS ENUM ('SHOPIFY', 'WOOCOMMERCE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "StoreStatus" AS ENUM ('ACTIVE', 'SYNCING', 'ERROR', 'PAUSED');

-- CreateEnum
CREATE TYPE "EmailFlowType" AS ENUM ('WELCOME_SERIES', 'ABANDONED_CART', 'POST_PURCHASE', 'WIN_BACK', 'BROWSE_ABANDONMENT', 'PRODUCT_LAUNCH', 'RESTOCK_ALERT', 'BIRTHDAY', 'REVIEW_REQUEST', 'CUSTOM');

-- CreateEnum
CREATE TYPE "FlowStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SmsFlowType" AS ENUM ('ABANDONED_CART', 'ORDER_CONFIRMATION', 'SHIPPING_UPDATE', 'DELIVERY_CONFIRMATION', 'FLASH_SALE', 'RESTOCK_ALERT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('EMAIL', 'SMS', 'PUSH');

-- CreateEnum
CREATE TYPE "InsightType" AS ENUM ('REVENUE_OPPORTUNITY', 'CONVERSION_ISSUE', 'PRODUCT_RECOMMENDATION', 'MARKETING_OPPORTUNITY', 'CUSTOMER_RETENTION', 'COST_REDUCTION', 'INVENTORY_ALERT', 'SEO_IMPROVEMENT', 'UX_ISSUE');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "InsightStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'COMPLETED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "RecommendationType" AS ENUM ('BUNDLE', 'UPSELL', 'CROSS_SELL', 'FREQUENTLY_BOUGHT_TOGETHER', 'PERSONALIZED');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "DfyStatus" AS ENUM ('PLANNING', 'GENERATING_BRAND', 'GENERATING_PRODUCTS', 'GENERATING_CONTENT', 'BUILDING_STORE', 'SETUP_MARKETING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
    "status" "TenantStatus" NOT NULL DEFAULT 'ACTIVE',
    "stripeCustomerId" TEXT,
    "billingEmail" TEXT,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "plan" "SubscriptionPlan" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "maxStores" INTEGER NOT NULL DEFAULT 1,
    "maxProducts" INTEGER NOT NULL DEFAULT 100,
    "maxEmailsPerMonth" INTEGER NOT NULL DEFAULT 1000,
    "maxSmsPerMonth" INTEGER NOT NULL DEFAULT 100,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageRecord" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "stripeInvoiceId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "platform" "StorePlatform" NOT NULL,
    "status" "StoreStatus" NOT NULL DEFAULT 'ACTIVE',
    "platformApiKey" TEXT,
    "platformApiSecret" TEXT,
    "platformShopDomain" TEXT,
    "brandVoice" TEXT,
    "targetAudience" TEXT,
    "uniqueSellingProp" TEXT,
    "lastCrawledAt" TIMESTAMP(3),
    "lastAnalyzedAt" TIMESTAMP(3),
    "profitScore" DOUBLE PRECISION,
    "conversionRate" DOUBLE PRECISION,
    "avgOrderValue" DOUBLE PRECISION,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "compareAtPrice" DOUBLE PRECISION,
    "sku" TEXT,
    "vendor" TEXT,
    "productType" TEXT,
    "tags" TEXT[],
    "images" TEXT[],
    "optimizedTitle" TEXT,
    "optimizedDescription" TEXT,
    "seoScore" DOUBLE PRECISION,
    "conversionScore" DOUBLE PRECISION,
    "inventory" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ordersCount" INTEGER NOT NULL DEFAULT 0,
    "avgOrderValue" DOUBLE PRECISION,
    "ltv" DOUBLE PRECISION,
    "tags" TEXT[],
    "segment" TEXT,
    "lastOrderAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "customerId" TEXT,
    "externalId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION,
    "shipping" DOUBLE PRECISION,
    "discount" DOUBLE PRECISION,
    "status" TEXT NOT NULL,
    "financialStatus" TEXT,
    "fulfillmentStatus" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "placedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT,
    "title" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "sku" TEXT,
    "variantTitle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawlReport" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "pagesScanned" INTEGER NOT NULL DEFAULT 0,
    "issuesFound" INTEGER NOT NULL DEFAULT 0,
    "seoIssues" JSONB NOT NULL DEFAULT '[]',
    "uxIssues" JSONB NOT NULL DEFAULT '[]',
    "contentGaps" JSONB NOT NULL DEFAULT '[]',
    "opportunities" JSONB NOT NULL DEFAULT '[]',
    "brandVoiceAnalysis" TEXT,
    "competitorInsights" JSONB NOT NULL DEFAULT '{}',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrawlReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditReport" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION,
    "findings" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "priorities" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailFlow" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "flowType" "EmailFlowType" NOT NULL,
    "status" "FlowStatus" NOT NULL DEFAULT 'DRAFT',
    "trigger" JSONB NOT NULL,
    "subject" TEXT,
    "preheader" TEXT,
    "content" TEXT,
    "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "prompt" TEXT,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "openRate" DOUBLE PRECISION,
    "clickRate" DOUBLE PRECISION,
    "conversionRate" DOUBLE PRECISION,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmsFlow" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "flowType" "SmsFlowType" NOT NULL,
    "status" "FlowStatus" NOT NULL DEFAULT 'DRAFT',
    "trigger" JSONB NOT NULL,
    "message" TEXT,
    "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "prompt" TEXT,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "clickRate" DOUBLE PRECISION,
    "conversionRate" DOUBLE PRECISION,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmsFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CampaignType" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "subject" TEXT,
    "preheader" TEXT,
    "content" TEXT,
    "segmentRules" JSONB NOT NULL DEFAULT '{}',
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "recipientCount" INTEGER,
    "openRate" DOUBLE PRECISION,
    "clickRate" DOUBLE PRECISION,
    "conversionRate" DOUBLE PRECISION,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insight" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "insightType" "InsightType" NOT NULL,
    "priority" "Priority" NOT NULL,
    "status" "InsightStatus" NOT NULL DEFAULT 'NEW',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "impact" TEXT,
    "effort" TEXT,
    "actionable" BOOLEAN NOT NULL DEFAULT false,
    "suggestedAction" TEXT,
    "metrics" JSONB NOT NULL DEFAULT '{}',
    "dismissedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Insight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "recommendationType" "RecommendationType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "productIds" TEXT[],
    "discountType" TEXT,
    "discountValue" DOUBLE PRECISION,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BundleItem" (
    "id" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "discountPercent" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BundleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "customerId" TEXT,
    "assignedToId" TEXT,
    "ticketNumber" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "channel" TEXT NOT NULL,
    "aiHandled" BOOLEAN NOT NULL DEFAULT false,
    "aiConfidence" DOUBLE PRECISION,
    "sentiment" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportMessage" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isCustomer" BOOLEAN NOT NULL DEFAULT true,
    "isAi" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DfyProject" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "status" "DfyStatus" NOT NULL DEFAULT 'PLANNING',
    "brandingComplete" BOOLEAN NOT NULL DEFAULT false,
    "productsComplete" BOOLEAN NOT NULL DEFAULT false,
    "contentComplete" BOOLEAN NOT NULL DEFAULT false,
    "designComplete" BOOLEAN NOT NULL DEFAULT false,
    "marketingComplete" BOOLEAN NOT NULL DEFAULT false,
    "brandName" TEXT,
    "tagline" TEXT,
    "logo" TEXT,
    "colorPalette" JSONB NOT NULL DEFAULT '{}',
    "typography" JSONB NOT NULL DEFAULT '{}',
    "productCatalog" JSONB NOT NULL DEFAULT '[]',
    "contentAssets" JSONB NOT NULL DEFAULT '{}',
    "marketingPlan" JSONB NOT NULL DEFAULT '{}',
    "generatedStoreUrl" TEXT,
    "platformUsed" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "DfyProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "permissions" TEXT[],
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT,
    "resourceId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobQueue" (
    "id" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "error" TEXT,
    "result" JSONB,
    "scheduledFor" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToRecommendation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_tenantId_idx" ON "User"("tenantId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_stripeCustomerId_key" ON "Tenant"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "Tenant_slug_idx" ON "Tenant"("slug");

-- CreateIndex
CREATE INDEX "Tenant_plan_idx" ON "Tenant"("plan");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_tenantId_idx" ON "Subscription"("tenantId");

-- CreateIndex
CREATE INDEX "Subscription_stripeSubscriptionId_idx" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "UsageRecord_tenantId_resourceType_recordedAt_idx" ON "UsageRecord"("tenantId", "resourceType", "recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_stripeInvoiceId_key" ON "Invoice"("stripeInvoiceId");

-- CreateIndex
CREATE INDEX "Invoice_tenantId_idx" ON "Invoice"("tenantId");

-- CreateIndex
CREATE INDEX "Invoice_stripeInvoiceId_idx" ON "Invoice"("stripeInvoiceId");

-- CreateIndex
CREATE INDEX "Store_tenantId_idx" ON "Store"("tenantId");

-- CreateIndex
CREATE INDEX "Store_platform_idx" ON "Store"("platform");

-- CreateIndex
CREATE INDEX "Store_url_idx" ON "Store"("url");

-- CreateIndex
CREATE INDEX "Product_storeId_idx" ON "Product"("storeId");

-- CreateIndex
CREATE INDEX "Product_externalId_idx" ON "Product"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_storeId_externalId_key" ON "Product"("storeId", "externalId");

-- CreateIndex
CREATE INDEX "Customer_storeId_idx" ON "Customer"("storeId");

-- CreateIndex
CREATE INDEX "Customer_email_idx" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_storeId_externalId_key" ON "Customer"("storeId", "externalId");

-- CreateIndex
CREATE INDEX "Order_storeId_idx" ON "Order"("storeId");

-- CreateIndex
CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");

-- CreateIndex
CREATE INDEX "Order_placedAt_idx" ON "Order"("placedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Order_storeId_externalId_key" ON "Order"("storeId", "externalId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE INDEX "CrawlReport_storeId_idx" ON "CrawlReport"("storeId");

-- CreateIndex
CREATE INDEX "CrawlReport_status_idx" ON "CrawlReport"("status");

-- CreateIndex
CREATE INDEX "AuditReport_storeId_idx" ON "AuditReport"("storeId");

-- CreateIndex
CREATE INDEX "AuditReport_reportType_idx" ON "AuditReport"("reportType");

-- CreateIndex
CREATE INDEX "EmailFlow_storeId_idx" ON "EmailFlow"("storeId");

-- CreateIndex
CREATE INDEX "EmailFlow_flowType_idx" ON "EmailFlow"("flowType");

-- CreateIndex
CREATE INDEX "EmailFlow_status_idx" ON "EmailFlow"("status");

-- CreateIndex
CREATE INDEX "SmsFlow_storeId_idx" ON "SmsFlow"("storeId");

-- CreateIndex
CREATE INDEX "SmsFlow_flowType_idx" ON "SmsFlow"("flowType");

-- CreateIndex
CREATE INDEX "SmsFlow_status_idx" ON "SmsFlow"("status");

-- CreateIndex
CREATE INDEX "Campaign_storeId_idx" ON "Campaign"("storeId");

-- CreateIndex
CREATE INDEX "Campaign_type_idx" ON "Campaign"("type");

-- CreateIndex
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");

-- CreateIndex
CREATE INDEX "Insight_storeId_idx" ON "Insight"("storeId");

-- CreateIndex
CREATE INDEX "Insight_insightType_idx" ON "Insight"("insightType");

-- CreateIndex
CREATE INDEX "Insight_priority_idx" ON "Insight"("priority");

-- CreateIndex
CREATE INDEX "Insight_status_idx" ON "Insight"("status");

-- CreateIndex
CREATE INDEX "Recommendation_storeId_idx" ON "Recommendation"("storeId");

-- CreateIndex
CREATE INDEX "Recommendation_recommendationType_idx" ON "Recommendation"("recommendationType");

-- CreateIndex
CREATE INDEX "BundleItem_recommendationId_idx" ON "BundleItem"("recommendationId");

-- CreateIndex
CREATE INDEX "BundleItem_productId_idx" ON "BundleItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "SupportTicket_ticketNumber_key" ON "SupportTicket"("ticketNumber");

-- CreateIndex
CREATE INDEX "SupportTicket_storeId_idx" ON "SupportTicket"("storeId");

-- CreateIndex
CREATE INDEX "SupportTicket_customerId_idx" ON "SupportTicket"("customerId");

-- CreateIndex
CREATE INDEX "SupportTicket_status_idx" ON "SupportTicket"("status");

-- CreateIndex
CREATE INDEX "SupportTicket_ticketNumber_idx" ON "SupportTicket"("ticketNumber");

-- CreateIndex
CREATE INDEX "SupportMessage_ticketId_idx" ON "SupportMessage"("ticketId");

-- CreateIndex
CREATE INDEX "DfyProject_tenantId_idx" ON "DfyProject"("tenantId");

-- CreateIndex
CREATE INDEX "DfyProject_status_idx" ON "DfyProject"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_token_idx" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");

-- CreateIndex
CREATE INDEX "ApiKey_userId_idx" ON "ApiKey"("userId");

-- CreateIndex
CREATE INDEX "ApiKey_key_idx" ON "ApiKey"("key");

-- CreateIndex
CREATE INDEX "UserActivity_userId_idx" ON "UserActivity"("userId");

-- CreateIndex
CREATE INDEX "UserActivity_action_idx" ON "UserActivity"("action");

-- CreateIndex
CREATE INDEX "UserActivity_createdAt_idx" ON "UserActivity"("createdAt");

-- CreateIndex
CREATE INDEX "JobQueue_status_idx" ON "JobQueue"("status");

-- CreateIndex
CREATE INDEX "JobQueue_jobType_idx" ON "JobQueue"("jobType");

-- CreateIndex
CREATE INDEX "JobQueue_scheduledFor_idx" ON "JobQueue"("scheduledFor");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToRecommendation_AB_unique" ON "_ProductToRecommendation"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToRecommendation_B_index" ON "_ProductToRecommendation"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageRecord" ADD CONSTRAINT "UsageRecord_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrawlReport" ADD CONSTRAINT "CrawlReport_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditReport" ADD CONSTRAINT "AuditReport_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailFlow" ADD CONSTRAINT "EmailFlow_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmsFlow" ADD CONSTRAINT "SmsFlow_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insight" ADD CONSTRAINT "Insight_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleItem" ADD CONSTRAINT "BundleItem_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "Recommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleItem" ADD CONSTRAINT "BundleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportMessage" ADD CONSTRAINT "SupportMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "SupportTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToRecommendation" ADD CONSTRAINT "_ProductToRecommendation_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToRecommendation" ADD CONSTRAINT "_ProductToRecommendation_B_fkey" FOREIGN KEY ("B") REFERENCES "Recommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
