-- CreateEnum
CREATE TYPE "DropshipConnectionStatus" AS ENUM ('PENDING', 'CONNECTING', 'ACTIVE', 'PAUSED', 'FAILED', 'DISCONNECTED');

-- CreateEnum
CREATE TYPE "DropshipSetupType" AS ENUM ('DIY', 'ASSISTED', 'FULL_AUTO');

-- CreateTable
CREATE TABLE "DropshipSupplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "website" TEXT,
    "apiEndpoint" TEXT,
    "categories" TEXT[],
    "niches" TEXT[],
    "regions" TEXT[],
    "avgShippingDays" INTEGER,
    "avgRating" DOUBLE PRECISION,
    "productCount" INTEGER,
    "minOrderValue" DOUBLE PRECISION,
    "returnPolicy" TEXT,
    "autoFulfillment" BOOLEAN NOT NULL DEFAULT false,
    "inventorySync" BOOLEAN NOT NULL DEFAULT false,
    "priceSync" BOOLEAN NOT NULL DEFAULT false,
    "trackingSync" BOOLEAN NOT NULL DEFAULT false,
    "monthlyFee" DOUBLE PRECISION,
    "transactionFee" DOUBLE PRECISION,
    "logo" TEXT,
    "description" TEXT,
    "pros" TEXT[],
    "cons" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DropshipSupplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DropshipConnection" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "status" "DropshipConnectionStatus" NOT NULL DEFAULT 'PENDING',
    "setupType" "DropshipSetupType" NOT NULL DEFAULT 'DIY',
    "apiKey" TEXT,
    "apiSecret" TEXT,
    "autoImportProducts" BOOLEAN NOT NULL DEFAULT false,
    "autoFulfillOrders" BOOLEAN NOT NULL DEFAULT false,
    "markupType" TEXT,
    "markupValue" DOUBLE PRECISION,
    "productsImported" INTEGER NOT NULL DEFAULT 0,
    "ordersFulfilled" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "connectedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DropshipConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DropshipSupplier_slug_key" ON "DropshipSupplier"("slug");

-- CreateIndex
CREATE INDEX "DropshipSupplier_status_idx" ON "DropshipSupplier"("status");

-- CreateIndex
CREATE INDEX "DropshipConnection_storeId_idx" ON "DropshipConnection"("storeId");

-- CreateIndex
CREATE INDEX "DropshipConnection_supplierId_idx" ON "DropshipConnection"("supplierId");

-- CreateIndex
CREATE INDEX "DropshipConnection_status_idx" ON "DropshipConnection"("status");

-- CreateIndex
CREATE UNIQUE INDEX "DropshipConnection_storeId_supplierId_key" ON "DropshipConnection"("storeId", "supplierId");

-- AddForeignKey
ALTER TABLE "DropshipConnection" ADD CONSTRAINT "DropshipConnection_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DropshipConnection" ADD CONSTRAINT "DropshipConnection_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "DropshipSupplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
