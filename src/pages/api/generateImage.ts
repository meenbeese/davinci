import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ message: "Prompt is required and must be a string." });
  }

  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt} - Generating image for prompt: ${prompt}`);

      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.9,
          responseModalities: ["Text", "Image"],
        },
      });

      const fullPrompt = `Generate a colorful and engaging children's book illustration based on this description: ${prompt}`;
      const response = await model.generateContent(fullPrompt);

      let hasImageData = false;
      for (const part of response.response.candidates[0].content.parts) {
        if (part.inlineData) {
          hasImageData = true;
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");

          const uniqueFilename = `generated-image-${uuidv4()}.png`;
          const filePath = path.join(process.cwd(), "public", uniqueFilename);

          console.log(`Attempt ${attempt} - Generated image: ${uniqueFilename}`);

          fs.writeFileSync(filePath, buffer);

          return res.status(200).json({ 
            imageUrl: `/${uniqueFilename}`,
            prompt: prompt,
            attempt: attempt
          });
        }
      }

      if (!hasImageData) {
        lastError = "No image data in response";
        console.log(`Attempt ${attempt} - No image data in response, retrying...`);
        await delay(RETRY_DELAY);
        continue;
      }

    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} - Error:`, error);
      
      if (attempt < MAX_RETRIES) {
        console.log(`Retrying after ${RETRY_DELAY}ms...`);
        await delay(RETRY_DELAY);
        continue;
      }
    }
  }

  console.error("All attempts failed. Last error:", lastError);
  return res.status(500).json({ 
    message: "Failed to generate image after all attempts",
    error: lastError instanceof Error ? lastError.message : "Unknown error"
  });
}
