/**
 * This file is used to generate images for the app.
 * 
 * Takes in charcaters, scenes, art style, and language to generate images for that page
 */
'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from 'fs';

const GeminiKey= "AIzaSyBm10CZuZl3221d9VO8sT1Zf0dFGU4C-xc"
const genAI = new GoogleGenerativeAI(GeminiKey);

// test variables
const scenes = [
  "A group of friends sitting around a campfire at night",
  "A group of friends walking through a forest"
]
const art_style = "cartoon"
const education_topic = "history"
const lang = "English"
const story_characters = [
    "A young boy",
    "A tall boy",
    "A short chubby blonde boy"
]


const SYSTEM_PROMPT = `
You are a talented and creative artist. You have been commissioned to create a series of engaging illustrations for an educational ${lang} childrens book about ${education_topic}. The illustrations will be used to help tell the story. You have been given a list of ${story_characters.length} story characters delimited by ", ", a list of ${scenes.length} scenes delimited by "<scene-delimiter>", and 1 art style to use for the illustrations. You will need to create a total of ${scenes.length} illustrations for the book, one for each scene. The illustrations should be colorful and engaging to help keep the children interested in the story. The characters must be consistent across each illustration, i.e. if a character is blonde and tall in one illustration then they must have the same characteristics for all the illustrations. The illustrations must clearly depict the characters and the scene description given, not changing any major details. The scenes must be understandable to someone who speaks ${lang}.

Characters:
${story_characters.join(", ")}

Scenes:
${scenes.join("<scene-delimiter>")}

Art Style:
${art_style}
`

export default async function generateImage() {
  // Set responseModalities to include "Image" so the model can generate  an image
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation",
    generationConfig: {
        responseModalities: ['Text', 'Image']
    },
  });

  try {
    const response = await model.generateContent(SYSTEM_PROMPT);
    let i = 0;
    if (response.response.candidates && response.response.candidates.length > 0) {
      for (const part of response.response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, 'base64');
          fs.writeFileSync(`gemini-native-image-${i}.png`, buffer);
          console.log(`Image saved as gemini-native-image-${i}.png`);
        } else {
          console.warn("inlineData is undefined for part:", part);
        }
        i += 1
      }
    }
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

export { generateImage };