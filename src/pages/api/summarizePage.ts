import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { content } = req.body;

  if (!content || typeof content !== "string") {
    return res.status(400).json({ message: "Content is required and must be a string." });
  }

  try {
    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

    // Configure the model
    const generationConfig = {
      maxOutputTokens: 100, // Limit the summary length
      temperature: 0.7,
      topP: 0.6,
      topK: 16,
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig,
    });

    // Generate a summary for the given content
    const response = await model.generateContent(`Summarize this: ${content}`);
    let summary = "";
    for (const part of response.response.candidates[0].content.parts) {
      summary += part.text;
    }

    if (!summary) {
      console.error("Failed to generate summary. Response:", JSON.stringify(response, null, 2));
      return res.status(500).json({ message: "Failed to summarize content." });
    }

    // Normalize the summary into an image generation prompt
    const imagePrompt = `Create an illustration based on the following description: ${summary}`;

    return res.status(200).json({ summary, imagePrompt });
  } catch (error) {
    console.error("Error summarizing content:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}