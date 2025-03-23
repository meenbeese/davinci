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
      maxOutputTokens: 500, // Allow for longer output to handle multiple scenes
      temperature: 0.7,
      topP: 0.6,
      topK: 16,
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig,
    });

    // Construct the prompt with the provided instructions
    const ourPrompt = `You will receive information on a children's picture book where each page is separated by a "<scene>" delimiter. I need you to create a typescript 2D array that summarizes the setting and all of the characters in that scene.

    here is an example input:

    Barnaby the badger loved shiny things. He collected bottle caps, sparkly pebbles, and even the foil wrappers from his grandma's cookies. His burrow was filled with glittering treasures, but he never shared them. "They're mine," he'd grumble, clutching a handful of silver paper.
    <scene>
    One day, a big storm swept through the woods. The wind howled, and the rain poured down. Barnaby's burrow, usually so cozy, started to leak. He tried to plug the holes with his shiny things, but the water just flowed around them. He was cold and scared.
    <scene>
    Suddenly, he heard a knock. It was Rosie the rabbit, and her family. They were soaked and shivering. "We need shelter," she said, her ears drooping. Barnaby hesitated, then remembered his grandma's words: "Sharing makes things brighter." He opened his burrow wide.
    <scene>
    Together, they used Rosie's soft fur and some big leaves to patch the leaks. They shared warm berries and told stories until the storm passed. Barnaby realized that being with friends, even without his shiny things, was the best treasure of all. And when he offered Rosie a shiny bottle cap, she smiled and gave him a warm hug.

    and here is sample output:

    [
        ["A cozy, cluttered burrow filled with shiny objects", "Barnaby the badger, who loves shiny things and is possessive of them."],
        ["The woods during a big storm; Barnaby's leaking burrow", "Barnaby the badger, who is cold and scared."],
        ["Outside Barnaby's burrow during the storm", "Barnaby the badger, Rosie the rabbit, and her family, who are soaked and shivering."],
        ["Barnaby's burrow after the storm", "Barnaby the badger, Rosie the rabbit, and her family. Barnaby learns that friendship is the best treasure."]
    ]

    again please keep the output in the form of the 2D array above, the number of scenes can/will vary, and only return the array.

    here is the story I would like you to put into a 2D array:

    ${content}`;

    // Generate the 2D array summary
    const response = await model.generateContent(ourPrompt);
    let summaryArray = "";
    for (const part of response.response.candidates[0].content.parts) {
      summaryArray += part.text;
    }

    if (!summaryArray) {
      console.error("Failed to generate summary array. Response:", JSON.stringify(response, null, 2));
      return res.status(500).json({ message: "Failed to summarize content." });
    }

    return res.status(200).json({ summaryArray });
  } catch (error) {
    console.error("Error summarizing content:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
