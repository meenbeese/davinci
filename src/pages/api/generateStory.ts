import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

const generateSystemPrompt = (user_prompt: string) => {
  return `You are an amazing educational childrens story writer. You have been provided with the following prompt from the user "${user_prompt}". Write a minimum 4 page and maximum 8 page page short story using the information from the user prompt. The story must be engaging and educational for children. Each page should be 2-3 sentences and delimited by "<scene>". The story should be suitable for 5-10 year olds.

  Example input: "A cat and an owl go on a treasure hunt"

  Example output: """Whiskers the cat stretched in the warm sunshine, her orange fur glowing like a tiny sunset. Her friend Hoot the owl was just waking up in the hollow oak tree nearby
  ruffling his speckled feathers as he blinked sleepily. "Whiskers, I found an old map in my tree today," Hoot called down excitedly, "and I think it leads to a hidden treasure!"<>
Whiskers climbed up the tree to look at the crinkled paper Hoot held carefully in his wing. The map showed their forest with a dotted line leading through the meadow, across the stream, and ending at a big X beneath the oldest pine tree in the woods. "Let's go on an adventure and find this treasure together," Whiskers suggested, her green eyes sparkling with excitement.
<scene>
The friends set off through the tall grass of the meadow, where butterflies danced above colorful wildflowers in the morning light. "These flowers are important for butterflies and bees," explained Hoot, who knew many facts because he listened to the forest ranger's nature talks. "They collect nectar from the flowers and help new plants grow by carrying pollen from flower to flower."
<scene>
Next, they reached the bubbling stream where silver fish darted beneath the crystal-clear water. Whiskers carefully hopped across using stepping stones, while Hoot flew overhead, watching how the sunlight made rainbow patterns on the water's surface. "Water is a home for fish, frogs, and many tiny creatures we can't even see," Hoot shared, "and all living things need water to survive, just like we do."
<scene>
As they traveled deeper into the forest, they noticed how the tall trees created cool shade that felt nice after their sunny walk. "Trees are like nature's umbrellas," Whiskers observed, noticing how different plants grew in the shadier spots. "And they're homes for many animals like squirrels, birds, and insects," added Hoot, pointing out a busy anthill near the path.
<scene>
Finally, they reached the oldest pine tree in the forest, its branches stretching toward the sky like giant arms. Following the map, they carefully dug beneath its roots where the soil was soft and dark. "This soil is full of nutrients that help plants grow strong," Whiskers explained, remembering what the gardener had taught her.
<scene>
Instead of gold or jewels, they discovered a small wooden box containing colorful seeds of many shapes and sizes. "These must be special seeds for plants that might disappear if we don't help them grow," Hoot said wisely. "The real treasure is helping nature!"
<scene>
Whiskers and Hoot carefully planted the seeds in perfect spots throughout the forest where each type would grow best. "Some seeds need lots of sun, while others prefer shade," Whiskers explained as they worked together. "Just like how you're awake at night and I'm awake during the day, different plants have different needs."
<scene>
When they finished planting the last seed, they found a note hidden at the bottom of the box. "Congratulations, nature helpers! The real treasure is watching these rare plants grow and helping our forest stay healthy for years to come." Whiskers and Hoot felt proud that they had found something even better than gold - a way to help their forest home.
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
    
    if (response.response && response.response.candidates && response.response.candidates.length > 0) {
      console.log(response.response.text());
      return res.status(200).json({ story: response.response.text() });
    } else {
      return res.status(500).json({ message: "Failed to generate a story." });
    }

  } catch (error) {
    console.error("Error generating content:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
