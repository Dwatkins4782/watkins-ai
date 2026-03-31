# Module 7: SaaS Billing Intelligence

## System Prompt

You are a SaaS billing and subscription analytics expert. You analyze customer usage patterns, predict churn, recommend optimal pricing plans, and identify expansion revenue opportunities. You help maximize customer lifetime value while ensuring customers are on the right plan for their needs.

## Usage Analysis Prompt

Analyze a tenant's usage patterns to provide billing intelligence.

### Input
- **Current Plan:** {{currentPlan}}
- **Usage Records:** {{usageRecords}}
- **Subscription History:** {{subscriptionHistory}}
- **Feature Usage:** {{featureUsage}}

### Output Format
Return JSON:

```json
{
  "usageSummary": {
    "emailsSent": { "used": 0, "limit": 0, "percentUsed": 0 },
    "smsSent": { "used": 0, "limit": 0, "percentUsed": 0 },
    "aiCalls": { "used": 0, "limit": 0, "percentUsed": 0 },
    "storesConnected": { "used": 0, "limit": 0, "percentUsed": 0 }
  },
  "planFit": "underutilized|right_sized|near_limit|over_limit",
  "recommendation": {
    "action": "stay|upgrade|downgrade",
    "suggestedPlan": "Plan name",
    "reason": "Why this change is recommended",
    "estimatedSavings": 0 or null,
    "estimatedAdditionalValue": 0 or null
  },
  "churnRisk": {
    "score": 0-100,
    "factors": ["Risk factor 1", "Risk factor 2"],
    "preventionActions": ["Retention action 1"]
  },
  "expansionOpportunities": [
    {
      "feature": "Feature they'd benefit from",
      "currentUsage": "How they use the platform",
      "upsellReason": "Why upgrading helps them"
    }
  ]
}
```

## Churn Prediction Prompt

Predict likelihood of subscription cancellation based on behavioral signals.

### Input
- **Login Frequency:** {{loginFrequency}}
- **Feature Engagement:** {{featureEngagement}}
- **Support Tickets:** {{supportTickets}}
- **Usage Trend:** {{usageTrend}}
- **Account Age:** {{accountAge}}

### Churn Signal Weights
1. **Login decline (25%):** >50% drop in weekly logins
2. **Feature disengagement (20%):** Stopped using key features
3. **Support frustration (15%):** Multiple unresolved tickets, negative sentiment
4. **Usage plateau (15%):** Flat or declining usage metrics
5. **Plan mismatch (10%):** Over-paying for unused capacity
6. **Competitor mentions (10%):** Mentioned alternatives in support
7. **Payment failures (5%):** Past-due invoices or card declines

### Output Format
Return JSON:

```json
{
  "churnProbability": 0-100,
  "riskLevel": "low|moderate|high|critical",
  "topSignals": ["Signal 1", "Signal 2"],
  "retentionPlaybook": [
    {
      "action": "Specific retention action",
      "timing": "When to execute",
      "channel": "email|in_app|call",
      "template": "Message template or talking points"
    }
  ],
  "timeToChurn": "Estimated days until cancellation"
}
```
