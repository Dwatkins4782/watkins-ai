import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private client: OpenAIClient;
  private deploymentName: string;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get('azure.openai.endpoint');
    const apiKey = this.configService.get('azure.openai.apiKey');
    this.deploymentName = this.configService.get('azure.openai.deploymentName');

    if (endpoint && apiKey) {
      this.client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
      this.logger.log('✅ Azure OpenAI client initialized');
    } else {
      this.logger.warn('⚠️  Azure OpenAI credentials not found. AI features will be limited.');
    }
  }

  async generateCompletion(
    prompt: string,
    systemPrompt?: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
      topP?: number;
      frequencyPenalty?: number;
      presencePenalty?: number;
    },
  ): Promise<string> {
    if (!this.client) {
      throw new Error('Azure OpenAI client not initialized');
    }

    try {
      const messages = [];

      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }

      messages.push({ role: 'user', content: prompt });

      const result = await this.client.getChatCompletions(
        this.deploymentName,
        messages,
        {
          temperature: options?.temperature ?? 0.7,
          maxTokens: options?.maxTokens ?? 2000,
          topP: options?.topP ?? 0.95,
          frequencyPenalty: options?.frequencyPenalty ?? 0,
          presencePenalty: options?.presencePenalty ?? 0,
        },
      );

      return result.choices[0]?.message?.content || '';
    } catch (error) {
      this.logger.error('Failed to generate AI completion', error);
      throw error;
    }
  }

  async generateStructuredOutput<T>(
    prompt: string,
    systemPrompt: string,
    schema: any,
  ): Promise<T> {
    const completion = await this.generateCompletion(
      `${prompt}\n\nRespond with valid JSON matching this schema: ${JSON.stringify(schema)}`,
      systemPrompt,
      { temperature: 0.3 },
    );

    try {
      return JSON.parse(completion);
    } catch (error) {
      this.logger.error('Failed to parse AI response as JSON', error);
      throw new Error('Invalid JSON response from AI');
    }
  }

  async analyzeBrandVoice(websiteContent: string): Promise<string> {
    const systemPrompt = `You are a brand voice analyst. Analyze the provided website content and extract the brand's unique voice, tone, and messaging style.`;
    
    const prompt = `Analyze this website content and describe the brand voice in 2-3 paragraphs:\n\n${websiteContent}`;

    return this.generateCompletion(prompt, systemPrompt);
  }

  async generateEmailContent(params: {
    flowType: string;
    brandVoice: string;
    productContext?: string;
  }): Promise<{ subject: string; preheader: string; content: string }> {
    const systemPrompt = `You are an expert email marketer. Generate high-converting email content that matches the brand voice.`;
    
    const prompt = `
Generate a ${params.flowType} email with:
- Brand Voice: ${params.brandVoice}
${params.productContext ? `- Product Context: ${params.productContext}` : ''}

Return JSON with: subject, preheader, content (HTML)
`;

    return this.generateStructuredOutput(prompt, systemPrompt, {
      subject: 'string',
      preheader: 'string',
      content: 'string',
    });
  }

  async generateSmsContent(params: {
    flowType: string;
    brandVoice: string;
    maxLength?: number;
  }): Promise<string> {
    const systemPrompt = `You are an expert SMS marketer. Generate concise, engaging SMS messages that drive action.`;
    
    const prompt = `
Generate a ${params.flowType} SMS message (max ${params.maxLength || 160} characters):
- Brand Voice: ${params.brandVoice}
Keep it short, actionable, and on-brand.
`;

    return this.generateCompletion(prompt, systemPrompt, { temperature: 0.8 });
  }

  async generateProductRecommendations(params: {
    productData: any[];
    customerHistory?: any[];
  }): Promise<any[]> {
    const systemPrompt = `You are an e-commerce recommendation engine. Analyze products and suggest intelligent bundles, upsells, and cross-sells.`;
    
    const prompt = `
Analyze these products and generate recommendations:
Products: ${JSON.stringify(params.productData)}
${params.customerHistory ? `Customer History: ${JSON.stringify(params.customerHistory)}` : ''}

Return JSON array of recommendations with: type, productIds, reason, estimatedValue
`;

    return this.generateStructuredOutput(prompt, systemPrompt, []);
  }

  async analyzeSupportTicket(params: {
    subject: string;
    message: string;
    customerHistory?: any;
  }): Promise<{
    sentiment: string;
    priority: string;
    suggestedResponse: string;
    confidence: number;
  }> {
    const systemPrompt = `You are a customer support AI. Analyze support tickets and suggest appropriate responses.`;
    
    const prompt = `
Analyze this support ticket:
Subject: ${params.subject}
Message: ${params.message}
${params.customerHistory ? `Customer History: ${JSON.stringify(params.customerHistory)}` : ''}

Return JSON with: sentiment, priority, suggestedResponse, confidence (0-1)
`;

    return this.generateStructuredOutput(prompt, systemPrompt, {});
  }

  async optimizeProductPage(params: {
    title: string;
    description: string;
    brandVoice: string;
  }): Promise<{
    optimizedTitle: string;
    optimizedDescription: string;
    seoScore: number;
    suggestions: string[];
  }> {
    const systemPrompt = `You are an e-commerce conversion optimization expert. Rewrite product content for maximum conversion and SEO.`;
    
    const prompt = `
Optimize this product page:
Title: ${params.title}
Description: ${params.description}
Brand Voice: ${params.brandVoice}

Return JSON with: optimizedTitle, optimizedDescription, seoScore (0-100), suggestions array
`;

    return this.generateStructuredOutput(prompt, systemPrompt, {});
  }

  async generateDfyStoreBranding(niche: string): Promise<{
    brandName: string;
    tagline: string;
    colorPalette: any;
    typography: any;
    voiceDescription: string;
  }> {
    const systemPrompt = `You are a brand strategist. Create complete, professional branding for e-commerce stores.`;
    
    const prompt = `
Create complete branding for a ${niche} e-commerce store.
Return JSON with:
- brandName: unique, memorable name
- tagline: compelling tagline
- colorPalette: { primary, secondary, accent, background, text }
- typography: { heading, body }
- voiceDescription: brand voice and tone description
`;

    return this.generateStructuredOutput(prompt, systemPrompt, {});
  }

  async generateInsights(params: {
    storeData: any;
    analyticsData: any;
  }): Promise<any[]> {
    const systemPrompt = `You are a business growth analyst. Analyze e-commerce data and generate actionable insights.`;
    
    const prompt = `
Analyze this e-commerce store and generate growth insights:
Store Data: ${JSON.stringify(params.storeData)}
Analytics: ${JSON.stringify(params.analyticsData)}

Return JSON array with: insightType, priority, title, description, suggestedAction, estimatedImpact
`;

    return this.generateStructuredOutput(prompt, systemPrompt, []);
  }
}
