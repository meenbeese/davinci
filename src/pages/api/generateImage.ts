import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";


const generateSystemPrompt = (scene: string, art_style: string, education_topic: string, lang: string, story_characters: string) => {
  const SYSTEM_PROMPT = `
  You are a talented and creative .png artist. You have been commissioned to create an engaging illustration for an educational ${lang} childrens book about ${education_topic}. The illustration will be used to help tell the story. You have been given a list of all the characters and their attributes. You have been given a summary of the scene. You have been given 1 art style to use for the illustration. The illustration should be colorful and engaging to help keep the children interested in the story. Keep the pictures simple and high quality. There should be NO text on the image. The illustration must clearly depict the characters, their attributes, and the scene description given, not changing any details. The illustration MUST keep the specified art style. The output MUST be a .png image and MUST have proper image data. Do NOT respond with anything except the valid .png image data. Do NOT respond with anything except the image data.
  
  Characters in Scene:
  ${story_characters}
  
  Scene Summary:
  ${scene}
  
  Art Style:
  ${art_style}
  `;
  return SYSTEM_PROMPT;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { scenes, art_style, education_topic, lang, story_characters } = req.body;

  console.log(story_characters);

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation",
    generationConfig: {
        responseModalities: ['Text', 'Image']
    },
  });

  const images = []
  for (let i = 0; i < scenes.length; i++) {
    try {
      const SYSTEM_PROMPT = generateSystemPrompt(scenes[i], art_style, education_topic, lang, story_characters[i]);
      const response = await model.generateContent(SYSTEM_PROMPT);
      if (response.response.candidates && response.response.candidates.length > 0) {
        for (const part of response.response.candidates[0].content.parts) {
          if (part.inlineData) {
            const imageData = part.inlineData.data;
            const buffer = Buffer.from(imageData, "base64");

            const uniqueFilename = `generated-image-${i}.png`;
            const filePath = path.join(process.cwd(), "public", uniqueFilename);

            fs.writeFileSync(filePath, buffer);
            images.push(`/${uniqueFilename}`);
          }
        }
      }
    } catch (error) {
      console.error("Error generating content:", error);
    }
  }
  return res.status(200).json({
    images: images
  });
}

//   for (let i; i < scenes; attempt++) {
//     try {
//       console.log(`Attempt ${attempt} - Generating image for prompt: ${prompt}`);

//       const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

//       const model = genAI.getGenerativeModel({
//         model: "gemini-2.0-flash-exp",
//         generationConfig: {
//           temperature: 0.9,
//           responseModalities: ["Text", "Image"],
//         },
//       });

//       const fullPrompt = `Generate a colorful and engaging children's book illustration based on this description: ${prompt}`;
//       const response = await model.generateContent(fullPrompt);

//       let hasImageData = false;
//       for (const part of response.response.candidates[0].content.parts) {
//         if (part.inlineData) {
//           hasImageData = true;
//           const imageData = part.inlineData.data;
//           const buffer = Buffer.from(imageData, "base64");

//           const uniqueFilename = `generated-image-${uuidv4()}.png`;
//           const filePath = path.join(process.cwd(), "public", uniqueFilename);

//           console.log(`Attempt ${attempt} - Generated image: ${uniqueFilename}`);

//           fs.writeFileSync(filePath, buffer);

//           return res.status(200).json({ 
//             imageUrl: `/${uniqueFilename}`,
//             prompt: prompt,
//             attempt: attempt
//           });
//         }
//       }

//       if (!hasImageData) {
//         lastError = "No image data in response";
//         console.log(`Attempt ${attempt} - No image data in response, retrying...`);
//         await delay(RETRY_DELAY);
//         continue;
//       }

//     } catch (error) {
//       lastError = error;
//       console.error(`Attempt ${attempt} - Error:`, error);
      
//       if (attempt < MAX_RETRIES) {
//         console.log(`Retrying after ${RETRY_DELAY}ms...`);
//         await delay(RETRY_DELAY);
//         continue;
//       }
//     }
//   }

//   console.error("All attempts failed. Last error:", lastError);
//   return res.status(500).json({ 
//     message: "Failed to generate image after all attempts",
//     error: lastError instanceof Error ? lastError.message : "Unknown error"
//   });
// }



// test variables
// const scenes = [
//   "A group of friends sitting around a campfire at night",
//   "A group of friends walking through a forest"
// ]
// const art_style = "cartoon"
// const education_topic = "history"
// const lang = "English"
// const story_characters = [
//     "A young boy",
//     "A tall boy",
//     "A short chubby blonde boy"
// ]