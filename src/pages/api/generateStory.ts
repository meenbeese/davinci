import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ message: "Prompt is required and must be a string." });
  }

  try {
    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

    // Configure the model
    const generationConfig = {
      maxOutputTokens: 2500, // Works for now
      temperature: 0.7,
      topP: 0.6,
      topK: 16,
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig,
    });

    // Generate content
    const response = await model.generateContent(prompt);

    // Extract the generated text
    let story = "";
    for (const part of response.response.candidates[0].content.parts) {
        story += part.text;
    }

    if (!story) {
      return res.status(500).json({ message: "Failed to generate a story." });
    }

    return res.status(200).json({ story });
  } catch (error) {
    console.error("Error generating story:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
