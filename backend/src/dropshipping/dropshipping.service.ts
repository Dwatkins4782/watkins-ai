import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';
import { EncryptionService } from '../common/services/encryption.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';

// Supplier catalog — curated list of top dropshipping companies by niche
const SUPPLIER_CATALOG = [
  {
    name: 'Spocket',
    slug: 'spocket',
    website: 'https://spocket.co',
    categories: ['fashion', 'accessories', 'home', 'beauty', 'electronics'],
    niches: ['general', 'fashion', 'home decor', 'beauty', 'tech accessories'],
    regions: ['US', 'EU', 'CA', 'AU'],
    avgShippingDays: 5,
    avgRating: 4.6,
    productCount: 100000,
    autoFulfillment: true,
    inventorySync: true,
    priceSync: true,
    trackingSync: true,
    monthlyFee: 39.99,
    transactionFee: 0,
    description: 'US & EU dropshipping with fast shipping. Premium suppliers vetted for quality.',
    pros: ['Fast US/EU shipping (2-5 days)', 'Branded invoicing', 'Auto order fulfillment', 'Real-time inventory sync'],
    cons: ['Higher product costs than AliExpress', 'Monthly subscription required'],
    featured: true,
  },
  {
    name: 'CJ Dropshipping',
    slug: 'cj-dropshipping',
    website: 'https://cjdropshipping.com',
    categories: ['fashion', 'electronics', 'home', 'beauty', 'sports', 'toys'],
    niches: ['general', 'fashion', 'electronics', 'home goods', 'fitness', 'pet supplies'],
    regions: ['Global', 'US', 'EU', 'CN'],
    avgShippingDays: 10,
    avgRating: 4.4,
    productCount: 400000,
    autoFulfillment: true,
    inventorySync: true,
    priceSync: true,
    trackingSync: true,
    monthlyFee: 0,
    transactionFee: 0,
    description: 'Free-to-use platform with warehouses worldwide. Great for custom products and print-on-demand.',
    pros: ['No monthly fees', 'Product sourcing service', 'US warehouses available', 'Custom packaging'],
    cons: ['Shipping can be slow from China', 'Quality varies by supplier'],
    featured: true,
  },
  {
    name: 'Zendrop',
    slug: 'zendrop',
    website: 'https://zendrop.com',
    categories: ['fashion', 'beauty', 'home', 'electronics', 'health'],
    niches: ['general', 'beauty', 'health & wellness', 'fashion', 'home'],
    regions: ['US', 'Global'],
    avgShippingDays: 7,
    avgRating: 4.3,
    productCount: 50000,
    autoFulfillment: true,
    inventorySync: true,
    priceSync: false,
    trackingSync: true,
    monthlyFee: 49,
    transactionFee: 0,
    description: 'US-based fulfillment with fast shipping. Built for Shopify stores with auto-fulfillment.',
    pros: ['Fast US fulfillment', 'Automated order processing', 'Subscription box support', 'Branded packaging'],
    cons: ['Limited free plan', 'Smaller catalog than competitors'],
    featured: false,
  },
  {
    name: 'Printful',
    slug: 'printful',
    website: 'https://printful.com',
    categories: ['fashion', 'accessories', 'home'],
    niches: ['print-on-demand', 'custom apparel', 'custom merchandise', 'art prints'],
    regions: ['US', 'EU', 'Global'],
    avgShippingDays: 5,
    avgRating: 4.5,
    productCount: 330,
    autoFulfillment: true,
    inventorySync: true,
    priceSync: false,
    trackingSync: true,
    monthlyFee: 0,
    transactionFee: 0,
    description: 'Premium print-on-demand. Design custom products with no inventory risk.',
    pros: ['No upfront costs', 'High quality printing', 'US & EU production', 'Branded inserts'],
    cons: ['Higher per-unit cost', 'Limited to POD products'],
    featured: true,
  },
  {
    name: 'SaleHoo',
    slug: 'salehoo',
    website: 'https://salehoo.com',
    categories: ['fashion', 'electronics', 'home', 'beauty', 'toys', 'sports'],
    niches: ['general', 'wholesale', 'electronics', 'fashion', 'home goods'],
    regions: ['US', 'Global'],
    avgShippingDays: 7,
    avgRating: 4.2,
    productCount: 2500000,
    autoFulfillment: false,
    inventorySync: false,
    priceSync: false,
    trackingSync: false,
    monthlyFee: 67,
    transactionFee: 0,
    description: 'Wholesale supplier directory with vetted dropshippers. Great for finding niche-specific suppliers.',
    pros: ['Huge supplier directory', 'Vetted for legitimacy', 'Market research tools', 'Low wholesale prices'],
    cons: ['Manual supplier contact required', 'No auto-fulfillment integration'],
    featured: false,
  },
  {
    name: 'Modalyst',
    slug: 'modalyst',
    website: 'https://modalyst.co',
    categories: ['fashion', 'accessories', 'beauty'],
    niches: ['luxury fashion', 'designer brands', 'independent brands', 'trendy fashion'],
    regions: ['US', 'EU'],
    avgShippingDays: 6,
    avgRating: 4.1,
    productCount: 35000,
    autoFulfillment: true,
    inventorySync: true,
    priceSync: true,
    trackingSync: true,
    monthlyFee: 35,
    transactionFee: 5,
    description: 'Premium and independent brand dropshipping. Ideal for fashion-focused stores.',
    pros: ['Brand-name products', 'US suppliers', 'Automatic pricing rules', 'Shopify integration'],
    cons: ['5% transaction fee', 'Fashion-focused only'],
    featured: false,
  },
  {
    name: 'Doba',
    slug: 'doba',
    website: 'https://doba.com',
    categories: ['electronics', 'home', 'fashion', 'health', 'automotive'],
    niches: ['electronics', 'home improvement', 'automotive parts', 'health products'],
    regions: ['US'],
    avgShippingDays: 5,
    avgRating: 3.9,
    productCount: 2000000,
    autoFulfillment: true,
    inventorySync: true,
    priceSync: true,
    trackingSync: true,
    monthlyFee: 24.99,
    transactionFee: 0,
    description: 'US-only supplier aggregator with millions of products from verified suppliers.',
    pros: ['US-only shipping (fast)', 'Large product catalog', 'Inventory monitoring', 'Push-to-store'],
    cons: ['US market only', 'Some product overlap between suppliers'],
    featured: false,
  },
  {
    name: 'Inventory Source',
    slug: 'inventory-source',
    website: 'https://inventorysource.com',
    categories: ['electronics', 'home', 'fashion', 'sports', 'toys', 'health'],
    niches: ['general', 'electronics', 'home goods', 'outdoor', 'pet supplies'],
    regions: ['US', 'CA'],
    avgShippingDays: 4,
    avgRating: 4.0,
    productCount: 1000000,
    autoFulfillment: true,
    inventorySync: true,
    priceSync: true,
    trackingSync: true,
    monthlyFee: 99,
    transactionFee: 0,
    description: 'Full automation platform connecting to 230+ pre-integrated suppliers with real-time sync.',
    pros: ['230+ integrated suppliers', 'Full automation', 'Real-time inventory', 'Multi-channel support'],
    cons: ['Higher monthly cost', 'Can be complex to set up'],
    featured: false,
  },
];

// Setup package definitions
const SETUP_PACKAGES = {
  DIY: {
    name: 'DIY Setup',
    price: 0,
    description: 'Connect and configure suppliers yourself with our step-by-step guides',
    features: [
      'AI-matched supplier recommendations',
      'Step-by-step connection guides',
      'API key setup documentation',
      'Community support',
    ],
  },
  ASSISTED: {
    name: 'Assisted Setup',
    price: 199,
    description: 'Our team helps configure your supplier connections with guided onboarding',
    features: [
      'Everything in DIY',
      '1-on-1 onboarding call',
      'Supplier account setup help',
      'Product import assistance (up to 100 products)',
      'Markup strategy consultation',
      'Email support for 30 days',
    ],
  },
  FULL_AUTO: {
    name: 'Full Auto Setup',
    price: 499,
    description: 'We handle everything — supplier selection, product curation, pricing, and launch',
    features: [
      'Everything in Assisted',
      'AI-driven supplier matching for your niche',
      'Full product catalog import (up to 500 products)',
      'Automated pricing & markup rules',
      'Inventory sync configuration',
      'Auto-fulfillment setup',
      'Priority support for 90 days',
      'Monthly supplier performance review (3 months)',
    ],
  },
};

@Injectable()
export class DropshippingService {
  private readonly logger = new Logger(DropshippingService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private configService: ConfigService,
    private encryption: EncryptionService, // AUDIT #14
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // AUDIT #6
  ) {}

  /**
   * Seed the supplier catalog into the database (idempotent)
   */
  // AUDIT #5: parallel upserts (was sequential, ~50x slower)
  async seedSuppliers() {
    const CONCURRENCY = 10; // throttle to respect DB connection pool
    const batches: typeof SUPPLIER_CATALOG[] = [];
    for (let i = 0; i < SUPPLIER_CATALOG.length; i += CONCURRENCY) {
      batches.push(SUPPLIER_CATALOG.slice(i, i + CONCURRENCY));
    }
    for (const batch of batches) {
      await Promise.all(
        batch.map((supplier) =>
          this.prisma.dropshipSupplier.upsert({
            where: { slug: supplier.slug },
            update: {
              name: supplier.name,
              website: supplier.website,
              categories: supplier.categories,
              niches: supplier.niches,
              regions: supplier.regions,
              avgShippingDays: supplier.avgShippingDays,
              avgRating: supplier.avgRating,
              productCount: supplier.productCount,
              autoFulfillment: supplier.autoFulfillment,
              inventorySync: supplier.inventorySync,
              priceSync: supplier.priceSync,
              trackingSync: supplier.trackingSync,
              monthlyFee: supplier.monthlyFee,
              transactionFee: supplier.transactionFee,
              description: supplier.description,
              pros: supplier.pros,
              cons: supplier.cons,
              featured: supplier.featured,
            },
            create: supplier,
          })
        )
      );
    }
    // AUDIT #6: bust cache after seed
    await this.cacheManager.del('suppliers:all');
    this.logger.log(`Seeded ${SUPPLIER_CATALOG.length} dropship suppliers`);
    return { seeded: SUPPLIER_CATALOG.length };
  }

  /**
   * Get all available suppliers, optionally filtered
   */
  // AUDIT #6: 5min cache. Read-heavy + supplier catalog rarely changes.
  async getSuppliers(filters?: { category?: string; niche?: string; region?: string }) {
    const cacheKey = `suppliers:${JSON.stringify(filters ?? {})}`;
    const cached = await this.cacheManager.get<any>(cacheKey);
    if (cached) return cached;

    const where: Record<string, unknown> = { status: 'active' };
    if (filters?.category) where.categories = { has: filters.category };
    if (filters?.niche) where.niches = { has: filters.niche };
    if (filters?.region) where.regions = { has: filters.region };

    const data = await this.prisma.dropshipSupplier.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { avgRating: 'desc' }],
    });
    await this.cacheManager.set(cacheKey, data, 300_000); // 5 min
    return data;
  }

  /**
   * Get a single supplier by ID
   */
  async getSupplier(supplierId: string) {
    const supplier = await this.prisma.dropshipSupplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return supplier;
  }

  /**
   * AI-powered supplier recommendations based on store niche and business profile
   */
  async getRecommendedSuppliers(storeId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      include: { products: { take: 20 } },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Build context for AI matching
    const storeContext = {
      name: store.name,
      url: store.url,
      platform: store.platform,
      brandVoice: store.brandVoice,
      targetAudience: store.targetAudience,
      uniqueSellingProp: store.uniqueSellingProp,
      productTypes: [...new Set(store.products.map((p) => p.productType).filter(Boolean))],
      productTags: [...new Set(store.products.flatMap((p) => p.tags))].slice(0, 30),
      avgPrice: store.products.length > 0
        ? store.products.reduce((sum, p) => sum + p.price, 0) / store.products.length
        : 0,
    };

    const allSuppliers = await this.prisma.dropshipSupplier.findMany({
      where: { status: 'active' },
    });

    // Use AI to rank and recommend suppliers
    try {
      const prompt = `You are a dropshipping expert. Analyze this store and recommend the best suppliers.

STORE PROFILE:
- Name: ${storeContext.name}
- Platform: ${storeContext.platform}
- Brand Voice: ${storeContext.brandVoice || 'Not set'}
- Target Audience: ${storeContext.targetAudience || 'Not set'}
- USP: ${storeContext.uniqueSellingProp || 'Not set'}
- Product Types: ${storeContext.productTypes.join(', ') || 'Unknown'}
- Product Tags: ${storeContext.productTags.join(', ') || 'Unknown'}
- Avg Product Price: $${storeContext.avgPrice.toFixed(2)}

AVAILABLE SUPPLIERS:
${allSuppliers.map((s, i) => `${i + 1}. ${s.name} (${s.slug})
   - Categories: ${s.categories.join(', ')}
   - Niches: ${s.niches.join(', ')}
   - Regions: ${s.regions.join(', ')}
   - Avg Shipping: ${s.avgShippingDays} days
   - Rating: ${s.avgRating}/5
   - Monthly Fee: $${s.monthlyFee || 0}
   - Auto-fulfill: ${s.autoFulfillment}
   - Description: ${s.description}`).join('\n\n')}

Return a JSON array of the top 4 recommended suppliers for this store. Each item should have:
- slug: the supplier slug
- matchScore: 0-100 how well it matches this store
- reason: 1-2 sentence explanation why this supplier is good for this store
- suggestedNiche: the specific niche focus within this supplier
- recommendedSetupType: "DIY", "ASSISTED", or "FULL_AUTO"

Only return valid JSON, nothing else.`;

      const aiResponse = await this.aiService.generateCompletion(prompt, 'module4_recommendations') as any;
      const responseText = typeof aiResponse === 'string' ? aiResponse : aiResponse?.content || JSON.stringify(aiResponse);
      
      // Parse AI response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const recommendations = JSON.parse(jsonMatch[0]);
        
        // Enrich with full supplier data
        const enriched = recommendations.map((rec: any) => {
          const supplier = allSuppliers.find((s) => s.slug === rec.slug);
          return {
            ...rec,
            supplier: supplier || null,
          };
        }).filter((r: any) => r.supplier);

        return {
          storeId,
          storeName: store.name,
          recommendations: enriched,
          setupPackages: SETUP_PACKAGES,
        };
      }
    } catch (error) {
      this.logger.warn('AI supplier matching failed, falling back to category match');
    }

    // Fallback: simple category/niche matching
    const tags = storeContext.productTags.map((t) => t.toLowerCase());
    const types = storeContext.productTypes.map((t) => t?.toLowerCase() || '');

    const scored = allSuppliers.map((supplier) => {
      let score = 0;
      supplier.niches.forEach((n) => {
        if (tags.some((t) => n.toLowerCase().includes(t) || t.includes(n.toLowerCase()))) score += 20;
      });
      supplier.categories.forEach((c) => {
        if (types.some((t) => c.toLowerCase().includes(t) || t.includes(c.toLowerCase()))) score += 15;
      });
      if (supplier.autoFulfillment) score += 10;
      if (supplier.featured) score += 10;
      score += (supplier.avgRating || 0) * 5;

      return {
        slug: supplier.slug,
        matchScore: Math.min(score, 100),
        reason: `Matches your store's product categories with ${supplier.avgShippingDays}-day avg shipping.`,
        suggestedNiche: supplier.niches[0],
        recommendedSetupType: score > 60 ? 'FULL_AUTO' : score > 30 ? 'ASSISTED' : 'DIY',
        supplier,
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);

    return {
      storeId,
      storeName: store.name,
      recommendations: scored.slice(0, 4),
      setupPackages: SETUP_PACKAGES,
    };
  }

  /**
   * Get setup packages with pricing
   */
  getSetupPackages() {
    return SETUP_PACKAGES;
  }

  /**
   * Connect a store to a supplier
   */
  async connectSupplier(storeId: string, data: {
    supplierId: string;
    setupType: 'DIY' | 'ASSISTED' | 'FULL_AUTO';
    apiKey?: string;
    apiSecret?: string;
    markupType?: string;
    markupValue?: number;
    autoImportProducts?: boolean;
    autoFulfillOrders?: boolean;
  }) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new NotFoundException('Store not found');

    const supplier = await this.prisma.dropshipSupplier.findUnique({
      where: { id: data.supplierId },
    });
    if (!supplier) throw new NotFoundException('Supplier not found');

    // Check for existing connection
    const existing = await this.prisma.dropshipConnection.findUnique({
      where: { storeId_supplierId: { storeId, supplierId: data.supplierId } },
    });

    if (existing && existing.status === 'ACTIVE') {
      throw new BadRequestException('Store is already connected to this supplier');
    }

    const connection = await this.prisma.dropshipConnection.upsert({
      where: { storeId_supplierId: { storeId, supplierId: data.supplierId } },
      update: {
        status: data.setupType === 'FULL_AUTO' ? 'CONNECTING' : 'PENDING',
        setupType: data.setupType,
        // AUDIT #14: encrypt at rest
        apiKey: this.encryption.encrypt(data.apiKey),
        apiSecret: this.encryption.encrypt(data.apiSecret),
        markupType: data.markupType,
        markupValue: data.markupValue,
        autoImportProducts: data.autoImportProducts ?? false,
        autoFulfillOrders: data.autoFulfillOrders ?? false,
      },
      create: {
        storeId,
        supplierId: data.supplierId,
        status: data.setupType === 'FULL_AUTO' ? 'CONNECTING' : 'PENDING',
        setupType: data.setupType,
        // AUDIT #14: encrypt at rest
        apiKey: this.encryption.encrypt(data.apiKey),
        apiSecret: this.encryption.encrypt(data.apiSecret),
        markupType: data.markupType,
        markupValue: data.markupValue,
        autoImportProducts: data.autoImportProducts ?? false,
        autoFulfillOrders: data.autoFulfillOrders ?? false,
      },
      include: { supplier: true },
    });

    this.logger.log(`Store ${storeId} connected to supplier ${supplier.name} (${data.setupType})`);

    return connection;
  }

  /**
   * Get all connections for a store
   */
  async getConnections(storeId: string) {
    return this.prisma.dropshipConnection.findMany({
      where: { storeId },
      include: { supplier: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get a single connection
   */
  async getConnection(connectionId: string) {
    const connection = await this.prisma.dropshipConnection.findUnique({
      where: { id: connectionId },
      include: { supplier: true },
    });

    if (!connection) throw new NotFoundException('Connection not found');

    return connection;
  }

  /**
   * Update connection status
   */
  async activateConnection(connectionId: string) {
    return this.prisma.dropshipConnection.update({
      where: { id: connectionId },
      data: { status: 'ACTIVE', connectedAt: new Date() },
      include: { supplier: true },
    });
  }

  async pauseConnection(connectionId: string) {
    return this.prisma.dropshipConnection.update({
      where: { id: connectionId },
      data: { status: 'PAUSED' },
      include: { supplier: true },
    });
  }

  async disconnectConnection(connectionId: string) {
    return this.prisma.dropshipConnection.update({
      where: { id: connectionId },
      data: { status: 'DISCONNECTED' },
      include: { supplier: true },
    });
  }
}
