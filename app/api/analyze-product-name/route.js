import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { productName } = await req.json();

    if (!productName) {
      return NextResponse.json({ error: 'No product name provided' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY is not configured on the server.' }, { status: 500 });
    }

    const groq = new Groq({ apiKey });

    const prompt = `
      You are an expert food nutritionist. I will provide you with the name of a product (usually Indian).
      
      CRITICAL RULE: First, determine if the product is an EDIBLE food or beverage meant for human consumption. 
      If it is a non-food item (like toothpaste, shampoo, electronics, poison, etc.), you MUST return exactly this JSON:
      { "error": "This item does not appear to be a food or beverage product." }

      If it IS a food product, generate its typical ingredients and nutritional information to the best of your knowledge and format it into the exact JSON structure provided below.
      If you are unsure of exact values, provide a highly educated estimate for a typical serving size.
      
      Product Name: "${productName}"
      
      JSON Schema:
      {
        "id": "generated-unique-id",
        "barcode": "", 
        "name": "Full Product Name",
        "brand": "Brand Name (if known)",
        "image": "", 
        "ingredients": ["ingredient 1", "ingredient 2"],
        "nutrition": {
          "servingSize": "e.g., 100g or 1 serving",
          "calories": number,
          "protein": "e.g., 5g",
          "fat": "e.g., 10g",
          "carbs": "e.g., 20g",
          "sodium": "e.g., 100mg",
          "sugar": "e.g., 15g"
        },
        "tags": ["array of tags"],
        "healthAssessment": {
          "score": number, // Health score from 0 (very unhealthy) to 100 (very healthy)
          "summary": "Short 1-line summary (e.g., 'Occasional treat only' or 'Empty calories')",
          "reasons": [
            { "type": "positive", "text": "High in protein", "impact": 10 },
            { "type": "negative", "text": "Extremely high added sugar", "impact": -30 }
          ]
        },
        "alternatives": [] 
      }

      Important Assessment Rules:
      - Act as a strict, expert nutritionist.
      - Heavily penalize ultra-processed foods, high added sugars, artificial sweeteners, harmful emulsifiers, palm oil, and refined flours (Maida).
      - Ensure the "score" realistically reflects the healthiness (e.g., Coca Cola should be < 30).
      - In the "reasons" array, include specific contextual positive and negative reasons for your score (minimum 1, maximum 5 total reasons). The "impact" is just an indicative number (-50 to +50) showing how heavily it affected your score.

      Respond ONLY with the JSON object. Do not wrap it in markdown block quotes (\`\`\`json). Just return the raw JSON.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
    });
    const responseText = chatCompletion.choices[0].message.content;
    
    // Parse the JSON from the response
    let productData;
    try {
      const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      productData = JSON.parse(cleanText);
      
      if (productData.error) {
        return NextResponse.json({ error: productData.error }, { status: 400 });
      }

      // Ensure we have a placeholder image since we can't extract one
      productData.image = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop'; 
      
    } catch (e) {
      console.error("Failed to parse Gemini response:", responseText);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json(productData);
  } catch (error) {
    console.error('Error analyzing product name:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
