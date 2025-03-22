import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ message: "Prompt is required and must be a string." });
  }

  try {
    // Add logging to track requests
    console.log(`Generating image for prompt: ${prompt}`);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.9, // Add some randomness
        responseModalities: ["Text", "Image"],
      },
    });

    // Add the instruction to generate an image explicitly
    const fullPrompt = `Generate an image based on this description: ${prompt}`;
    const response = await model.generateContent(fullPrompt);

    // Process the response
    for (const part of response.response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");

        // Generate a unique filename for the image
        const uniqueFilename = `generated-image-${uuidv4()}.png`;
        const filePath = path.join(process.cwd(), "public", uniqueFilename);

        // Add logging for successful image generation
        console.log(`Generated image: ${uniqueFilename}`);

        // Save the image to the public directory
        fs.writeFileSync(filePath, buffer);

        // Return the correct URL for the image
        return res.status(200).json({ 
          imageUrl: `/${uniqueFilename}`,
          prompt: prompt // Return the prompt for debugging
        });
      }
    }

    // If no image is found in the response
    console.error("No image data in response");
    return res.status(500).json({ message: "Failed to generate an image." });
  } catch (error) {
    console.error("Error generating image:", error);
    return res.status(500).json({ 
      message: "Failed to generate image",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
