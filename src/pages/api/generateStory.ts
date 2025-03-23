import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

const generateSystemPrompt = (user_prompt: string) => {
  return `You are a world renowned educational childrens book story writer. You have been provided with the following prompt from the user "${user_prompt}". Write a childrens short story using the information from the user prompt. There should be clear main characters and a clear storyline. The character descriptions should be VERY descriptive and should explicitly show many attributes of the character. The story MUST be a MINIMUM of 4 pages and a MAXIMUM of 6 pages. The story must be engaging and educational for children. Each page should be 2-3 sentences and delimited by "<scene>". The story MUST be suitable for 5-10 year olds. Do not use any profanity or inappropriate content in the story. Do NOT respond with anything except story content and the scene delimiters. You must stay below 6 scenes. You must stay below 6 pages. Do NOT go above 35 words per page. Do NOT go above 35 words per scene.

  Example input: "A cat and an owl go on a treasure hunt"

  Example output: """Mittens the cat stretched in the warm sunshine, feeling bored with her usual routine. Her friend Hooty the owl had just woken up in the hollow oak tree nearby, blinking his large yellow eyes in the afternoon light.<scene>"Let's go on a treasure hunt!" suggested Mittens, her tail twitching with excitement. Hooty tilted his head thoughtfully before nodding in agreement, "I can use my sharp eyes to spot clues from above while you search on the ground."<scene>They found an old map tucked between the roots of the oak tree, with strange markings and a big X near the pond. "This must be our first clue," whispered Mittens, her whiskers quivering with anticipation as Hooty studied the faded paper.<scene>The pair traveled through tall grass where Mittens used her keen sense of smell to follow a trail. Hooty flew overhead, calling out, "Turn left at the big rock, I can see something shiny near those flowers!"<scene>Under a colorful patch of daisies, they discovered a small golden key glittering in the sunlight. "What do you think it opens?" wondered Mittens, carefully picking it up with her paw while Hooty kept watch.<scene>As the sun began to set, they arrived at an old wooden chest hidden beneath a willow tree by the pond. The golden key fit perfectly in the lock, revealing a collection of beautiful stones, feathers, and a special friendship bracelet inside.
"""
`
}

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
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "Google API key is not defined." });
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const SYSTEM_PROMPT = generateSystemPrompt(prompt);
    const response = await model.generateContent(SYSTEM_PROMPT);
    
    if (response.response) {
      return res.status(200).json({ story: response.response.text() });
    } else {
      return res.status(500).json({ message: "Failed to generate a story." });
    }

  } catch (error) {
    console.error("Error generating content:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
