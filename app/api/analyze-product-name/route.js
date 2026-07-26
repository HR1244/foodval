import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { productName } = await req.json();

    if (!productName) {
      return NextResponse.json({ error: 'No product name provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured on the server.' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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
        "alternatives": [] 
      }

      Important Tagging Rules for the "tags" array:
      - If it has > 10g sugar per 100g, add "high_added_sugar", else if > 0 add "added_sugar".
      - If it has > 400mg sodium per 100g, add "high_sodium".
      - If ingredients contain Palm Oil, add "palm_oil".
      - If ingredients contain Maida or Refined Wheat Flour, add "refined_flour".
      - If ingredients contain Artificial Colors (like INS 102, INS 110), add "artificial_colors".
      - If ingredients contain Artificial Flavors, add "artificial_flavors".
      - If ingredients contain Preservatives (like INS 211, INS 202), add "preservatives".
      - If it has > 10g protein per 100g, add "high_protein".
      - If it has < 3g protein per 100g, add "low_protein".
      - If it has > 5g fiber per 100g, add "high_fiber".
      - If ingredients contain Whole Wheat or Millet as the primary ingredient, add "whole_grain".

      Respond ONLY with the JSON object. Do not wrap it in markdown block quotes (\`\`\`json). Just return the raw JSON.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
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
