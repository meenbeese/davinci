import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

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
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: ["Text", "Image"],
      },
    });

    // Generate content
    const response = await model.generateContent(prompt);

    // Process the response
    for (const part of response.response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");

        // Save the image to the public directory
        const filePath = path.join(process.cwd(), "public", "generated-image.png");
        fs.writeFileSync(filePath, buffer);

        // Return the correct URL for the image
        return res.status(200).json({ imageUrl: "/generated-image.png" });
      }
    }

    // If no image is found in the response
    return res.status(500).json({ message: "Failed to generate an image." });
  } catch (error) {
    console.error("Error generating content:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
