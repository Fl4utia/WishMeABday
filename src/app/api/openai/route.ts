import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY, // Ensure you have this environment variable set
});

const systemPrompt = "Generate a birthday message for a friend.";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json(); // Expecting JSON body with a 'prompt' field

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }, // Using the prompt directly from the request
      ],
    });

    const messageContent = completion.choices[0].message.content;

    // Return the generated birthday message
    return NextResponse.json({ message: messageContent });
    
  } catch (error) {
    console.error("Failed to generate birthday message:", error);
    return NextResponse.json(
      { error: "Failed to generate birthday message." },
      { status: 500 }
    );
  }
}
