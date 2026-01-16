import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WardrobeItem, OutfitRecommendation } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// ---------------------------------------------------------
// OUTFIT PLANNING (Text/JSON)
// ---------------------------------------------------------

export const generateOutfitPlan = async (
  inventory: WardrobeItem[],
  context: {
    schedule: string;
    mood: string;
    location: string;
    customRequest?: string;
  }
): Promise<OutfitRecommendation> => {
  
  const inventoryList = inventory.map(item => `- ID: ${item.id}, Name: ${item.name}, Color: ${item.color}, Category: ${item.category}, Tags: ${item.tags.join(', ')}`).join('\n');

  const prompt = `
    Act as a world-class fashion stylist.
    User Context:
    - Schedule/Events: ${context.schedule}
    - Mood/Feeling: ${context.mood} (Note: If mood implies comfort/bloated, prioritize non-restrictive clothing).
    - Location: ${context.location}
    - Specific Request: ${context.customRequest || 'None'}

    Available Wardrobe Inventory:
    ${inventoryList}

    Task:
    1. USE THE GOOGLE SEARCH TOOL to find the current weather for the specified location (${context.location}). This is CRITICAL.
    2. Analyze the user's schedule. If there are multiple events (e.g. Work then Dinner), suggest an outfit that transitions well or is versatile.
    3. Select the best combination of items from the inventory.
    4. Identify if any key piece is missing to complete the look (Gap Analysis) and recommend it.
    5. Provide a reasoning that ties the weather, the schedule, and the user's mood together.

    Return the result in JSON format.
  `;

  // Schema definition for structured output
  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Catchy name for the look" },
      description: { type: Type.STRING, description: "Short visual description of the outfit" },
      reasoning: { type: Type.STRING, description: "Why this works for the mood, weather, and schedule" },
      selectedItemIds: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of IDs from the inventory that are used"
      },
      missingItems: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            type: { type: Type.STRING },
            reason: { type: Type.STRING }
          }
        }
      },
      weatherNote: { type: Type.STRING, description: "Summary of weather influencing choice (e.g., 'Rainy 65°F')" },
      moodMatch: { type: Type.STRING, description: "How this addresses the specific mood (e.g. comfort for bloating)" }
    },
    required: ["title", "description", "reasoning", "selectedItemIds", "missingItems", "weatherNote", "moodMatch"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const json = JSON.parse(response.text || '{}');
    
    // Map IDs back to real objects
    const items = json.selectedItemIds.map((id: string) => inventory.find(i => i.id === id)).filter((i: WardrobeItem | undefined) => i !== undefined) as WardrobeItem[];

    return {
      id: Date.now().toString(),
      title: json.title,
      description: json.description,
      reasoning: json.reasoning,
      items: items,
      missingItems: json.missingItems,
      weatherNote: json.weatherNote,
      moodMatch: json.moodMatch
    };

  } catch (error) {
    console.error("Gemini Planning Error:", error);
    throw new Error("Failed to generate outfit plan.");
  }
};

// ---------------------------------------------------------
// OUTFIT VISUALIZATION (Image)
// ---------------------------------------------------------

export const generateOutfitVisual = async (description: string): Promise<string> => {
  try {
    const prompt = `
      High fashion photography, full body shot.
      A stylish person wearing: ${description}.
      The setting should be neutral and minimal studio lighting.
      Photorealistic, 8k resolution, cinematic lighting.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Using Flash Image for speed/efficiency
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4", 
        }
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    // Return a fallback placeholder if generation fails to avoid crashing UI
    return `https://picsum.photos/600/800?blur=5`; 
  }
};
