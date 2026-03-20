import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Request validation types
interface GenerateDescriptionRequest {
  productTitle: string;
  category: string;
  keyFeatures: string[];
  tone: 'professional' | 'casual' | 'fun' | 'luxury';
}

// Response types
interface GenerateDescriptionResponse {
  description: string;
  seoTitle: string;
  seoMetaDescription: string;
}

// Tone prompts mapping
const TONE_PROMPTS: Record<string, string> = {
  professional: 'Write in a professional, authoritative tone that builds trust and credibility. Use clear, concise language appropriate for business contexts.',
  casual: 'Write in a friendly, conversational tone that feels approachable and relatable. Use everyday language that connects with the reader.',
  fun: 'Write in an energetic, playful tone that excites and entertains. Use creative language, enthusiasm, and a touch of humor.',
  luxury: 'Write in a sophisticated, premium tone that conveys exclusivity and high value. Use elegant language that appeals to discerning buyers.',
};

// Category context mapping
const CATEGORY_CONTEXT: Record<string, string> = {
  ebook: 'digital ebook guide',
  template: 'digital template resource',
  preset: 'digital preset pack',
  course: 'online course program',
  coaching: 'coaching service package',
  other: 'digital product',
};

export async function POST(request: NextRequest) {
  try {
    const body: GenerateDescriptionRequest = await request.json();
    const { productTitle, category, keyFeatures, tone } = body;

    // Validate required fields
    if (!productTitle || productTitle.trim().length === 0) {
      return NextResponse.json(
        { error: 'Product title is required' },
        { status: 400 }
      );
    }

    if (!tone || !['professional', 'casual', 'fun', 'luxury'].includes(tone)) {
      return NextResponse.json(
        { error: 'Valid tone is required (professional, casual, fun, or luxury)' },
        { status: 400 }
      );
    }

    // Build the prompt for the AI
    const featuresList = keyFeatures && keyFeatures.length > 0
      ? keyFeatures.map(f => `- ${f}`).join('\n')
      : 'No specific features provided';

    const categoryName = CATEGORY_CONTEXT[category] || 'digital product';
    const toneInstruction = TONE_PROMPTS[tone];

    const systemPrompt = `You are an expert copywriter specializing in creating compelling product descriptions for digital products and creator economy offerings. Your descriptions are known for:
- Being conversion-focused and action-oriented
- Highlighting unique value propositions
- Using emotional hooks that resonate with buyers
- Optimizing for search engines while remaining natural

${toneInstruction}`;

    const userPrompt = `Create a compelling product description for the following ${categoryName}:

**Product Title:** ${productTitle}

**Key Features:**
${featuresList}

Please provide:
1. A main product description (150-250 words) that:
   - Opens with an attention-grabbing hook
   - Highlights the key benefits and value
   - Addresses the target audience's pain points
   - Ends with a clear call to action

2. An SEO-optimized title (50-60 characters) that includes main keywords

3. An SEO meta description (150-160 characters) that summarizes the product with a call to action

Format your response as JSON with these exact keys:
{
  "description": "the main product description",
  "seoTitle": "the SEO title",
  "seoMetaDescription": "the meta description"
}`;

    // Initialize ZAI and make the API call
    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    let parsedResponse: GenerateDescriptionResponse;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      let jsonStr = responseContent;
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      parsedResponse = JSON.parse(jsonStr);
    } catch {
      // If parsing fails, create a structured response
      parsedResponse = {
        description: responseContent,
        seoTitle: productTitle.slice(0, 60),
        seoMetaDescription: `Discover ${productTitle}. ${responseContent.slice(0, 120)}...`,
      };
    }

    // Validate the response structure
    if (!parsedResponse.description || !parsedResponse.seoTitle || !parsedResponse.seoMetaDescription) {
      parsedResponse = {
        description: parsedResponse.description || responseContent,
        seoTitle: parsedResponse.seoTitle || productTitle.slice(0, 60),
        seoMetaDescription: parsedResponse.seoMetaDescription || `Discover ${productTitle}. Get yours today!`,
      };
    }

    return NextResponse.json({
      success: true,
      data: parsedResponse,
    });

  } catch (error) {
    console.error('Error generating description:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate description';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
