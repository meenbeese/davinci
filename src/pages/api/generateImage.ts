import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const IMAGE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CLEANUP_INTERVAL = 60 * 60 * 1000; // Run cleanup every hour

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to clean up old images
const cleanupOldImages = () => {
  const publicDir = path.join(process.cwd(), "public");
  const now = Date.now();

  try {
    const files = fs.readdirSync(publicDir);
    
    files.forEach(file => {
      if (file.startsWith('generated-image-')) {
        const filePath = path.join(publicDir, file);
        const stats = fs.statSync(filePath);
        
        // Check if file is older than IMAGE_MAX_AGE
        if (now - stats.mtimeMs > IMAGE_MAX_AGE) {
          try {
            fs.unlinkSync(filePath);
            console.log(`Deleted old image: ${file}`);
          } catch (err) {
            console.error(`Error deleting file ${file}:`, err);
          }
        }
      }
    });
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
};

// Start periodic cleanup
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupOldImages, CLEANUP_INTERVAL);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Run cleanup before processing new request
  cleanupOldImages();

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
