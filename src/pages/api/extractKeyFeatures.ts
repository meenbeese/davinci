import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";


const getCharacters = async (story: string, model: GenerativeModel) => {
  const SYSTEM_PROMPT = `You must extract the story characters from each scene in the story. The scenes within the story are delimited by "<scene>". The characters are the main subjects of the story and are usually people, animals, or objects that can talk or interact with each other. Each character should have a name. You must output a list of characters in each scene seperated by "<scene>". The naming convention for the same character should be the same for all scenes. Example input 1: "Whiskers the Cat stretched out her paws hoping that Clark would high five her. <scene> Clark the Dog wagged his tail and barked at Whiskers. <scene> Whiskers was very sad and ran away." Example output 1: "Whiskers the Cat, Clark the Dog<scene>Whiskers the Cat, Clark the Dog<scene>Whiskers the Cat" Example input 2: "Noah noticed that the sun was shining brightly in the sky. <scene> The clouds were fluffy and white. <scene> The rain started to fall and hit Noah on the head." Example output 2: "Noah<scene> <scene>Noah". Input: "${story}"`;
  const response = await model.generateContent(SYSTEM_PROMPT);
  if (response.response && response.response.candidates && response.response.candidates.length > 0) {
    return response.response.text().split("<scene>");
  }
  return "";
};


const getTitle = async (story: string, model: GenerativeModel) => {
  const SYSTEM_PROMPT = `You are a specialized AI designed to create engaging, appropriate, and thematically relevant titles for children's stories. When given a children's story snippet, analyze its content, characters, plot points, emotional themes, and key events to generate a compelling title that captures the essence of the story. Guidelines: 1) If the story prominently features specific characters, incorporate the main character(s) into the title when appropriate. 2) Identify the primary emotional theme and reflect it in the title. 3) Capture the main action, conflict, or lesson in the title when relevant. 4) Use descriptive adjectives that reflect a character's key trait demonstrated in the story, especially if it relates to the story's message. 5) Keep titles concise (typically 2-7 words) and easy for children to understand. 6) Ensure titles are age-appropriate. 7) Create titles that spark curiosity and interest. 8) When appropriate, use alliteration to make titles more memorable. Provide the title only, without explanation or additional context. Examples: Input: "Whiskers the Cat stretched out her paws hoping that Clark would high five her. <scene> Clark the Dog wagged his tail and barked at Whiskers. <scene> Whiskers was very sad and ran away." Output: "Clark the Rude Dog" | Input: "Penny Penguin couldn't swim. All the other penguins laughed when she wobbled at the edge of the ice. <scene> One day, a baby seal got stuck on the ice during a storm. <scene> Penny waddled across the ice when others couldn't and saved the baby seal. Everyone cheered for Penny." Output: "Penny Penguin's Brave Rescue" | Input: "The little star hid behind the clouds every night. "I'm not bright enough," it whispered. <scene> One foggy night, a lost ship couldn't find its way home. <scene> The little star peeked out from the clouds, and though it wasn't the brightest, its light was just enough to guide the ship safely to shore." Output: "The Star That Saved the Ship". Input: "${story}"`;
  const response = await model.generateContent(SYSTEM_PROMPT);
  if (response.response && response.response.candidates && response.response.candidates.length > 0) {
    return response.response.text();
  }
  return "";
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { story } = req.body;

  if (!story || typeof story !== "string") {
    return res.status(400).json({ message: "Story invalid" });
  }

  try {
    // Initialize the Google Generative AI client
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "Google API key is not defined." });
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const characters = await getCharacters(story, model);
    const title = await getTitle(story, model);
    console.log(characters, title);

    return res.status(200).json({ characters: characters, title: title });
  } catch (error) {
    console.error("Error extracting key features:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
