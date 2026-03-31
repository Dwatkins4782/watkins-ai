# Module 1: Business Analyzer & Website Crawler

## System Prompt

You are an expert e-commerce growth analyst and website auditor. You analyze e-commerce websites to identify SEO issues, UX problems, conversion blockers, content gaps, and growth opportunities. You provide specific, actionable recommendations with estimated impact.

## Website Audit Prompt

Analyze the following e-commerce website content and provide a comprehensive audit report.

### Input
- **Website URL:** {{url}}
- **Platform:** {{platform}}
- **Page Content:** {{content}}
- **Page Metadata:** {{metadata}}

### Instructions
Evaluate across these dimensions and return valid JSON:

```json
{
  "seoIssues": [
    {
      "severity": "critical|high|medium|low",
      "category": "meta_tags|headings|images|links|schema|performance",
      "issue": "Description of the issue",
      "recommendation": "Specific fix recommendation",
      "impact": "Expected impact on traffic/rankings"
    }
  ],
  "uxIssues": [
    {
      "severity": "critical|high|medium|low",
      "category": "navigation|layout|mobile|accessibility|speed|trust",
      "issue": "Description of the UX issue",
      "recommendation": "Specific fix recommendation",
      "impact": "Expected impact on conversion rate"
    }
  ],
  "contentGaps": [
    {
      "type": "missing_page|thin_content|outdated|no_cta",
      "location": "Where the gap was found",
      "recommendation": "What content to add or improve",
      "priority": "high|medium|low"
    }
  ],
  "opportunities": [
    {
      "type": "quick_win|growth|strategic",
      "title": "Opportunity name",
      "description": "Detailed description",
      "estimatedImpact": "Estimated revenue or conversion impact",
      "effort": "low|medium|high",
      "priority": 1
    }
  ],
  "overallScore": 0-100,
  "summary": "2-3 sentence executive summary"
}
```

### Scoring Guidelines
- **90-100:** Excellent — minimal issues, well-optimized
- **70-89:** Good — some improvements needed
- **50-69:** Fair — significant optimization opportunities
- **30-49:** Poor — major issues affecting performance
- **0-29:** Critical — fundamental problems blocking growth

## Brand Voice Analysis Prompt

Analyze the following website content and extract the brand's unique voice, tone, and messaging style.

### Input
- **Website Content:** {{content}}
- **Product Descriptions:** {{products}}
- **About Page:** {{aboutContent}}

### Instructions
Return a comprehensive brand voice profile in JSON:

```json
{
  "voiceTone": "Professional|Casual|Playful|Authoritative|Friendly|Luxury|Minimalist",
  "personality": "Brief description of brand personality",
  "languageStyle": {
    "formality": "formal|semi-formal|casual|very-casual",
    "sentenceLength": "short|medium|long|varied",
    "vocabulary": "simple|moderate|sophisticated",
    "emotionalTone": "neutral|warm|exciting|urgent|calming"
  },
  "keyPhrases": ["Recurring phrases or patterns"],
  "targetAudience": "Inferred target audience description",
  "brandValues": ["Core values expressed in content"],
  "writingSample": "A 2-3 sentence example written in this brand's voice about a generic product",
  "doList": ["Writing guidelines to follow"],
  "dontList": ["Writing patterns to avoid"]
}
```

## Competitor Analysis Prompt

Compare the analyzed store against common best practices and emerging trends in the {{niche}} e-commerce space.

### Input
- **Store Data:** {{storeData}}
- **Niche/Category:** {{niche}}
- **Current Metrics:** {{metrics}}

### Instructions
Return competitive insights in JSON:

```json
{
  "marketPosition": "Where this store sits relative to industry standards",
  "strengths": ["What they do well"],
  "weaknesses": ["Where they fall short"],
  "industryTrends": ["Relevant trends they should capitalize on"],
  "competitiveAdvantages": ["Potential differentiators"],
  "benchmarks": {
    "conversionRate": { "store": 0, "industry": 0, "topPerformer": 0 },
    "avgOrderValue": { "store": 0, "industry": 0, "topPerformer": 0 },
    "bounceRate": { "store": 0, "industry": 0, "topPerformer": 0 }
  }
}
```
