import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    const model = "gemini-3-flash-preview";
    
    const systemInstruction = `You are "Sara", the AI assistant at DMS Pilot — an enterprise-grade automotive dealership management platform.
    
    You have access to the current application data provided in the context. 
    Use this data to answer user questions precisely.
    
    Context Data:
    - Deals: ${JSON.stringify(context.deals)}
    - Inventory: ${JSON.stringify(context.inventory)}
    - Customers: ${JSON.stringify(context.customers)}
    
    Guidelines:
    1. Be professional, concise, and helpful. You are Sara — smart, direct, and dealership-savvy.
    2. If asked about specific deals, look them up by ID or customer name.
    3. If asked about inventory, check availability and pricing.
    4. You can help with calculations (gross profit, PVR, etc.) if requested.
    5. Be proactive but don't hallucinate data that isn't there.
    6. Maintain a confident, knowledgeable, yet friendly persona. Sign off casually as Sara when appropriate.`;

    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction,
      },
      history: messages.slice(0, -1).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage({ message: lastMessage });

    return NextResponse.json({ text: result.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
