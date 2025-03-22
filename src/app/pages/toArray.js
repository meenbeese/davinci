console.log("START");

const sampleDeliminatedInput = `Pip the penguin dreamed of flying. He watched the seagulls soar and swoop, and he'd flap his little wings with all his might, but he could only waddle. "I'll never fly," he sighed, feeling a bit blue.
<scene>
One day, a huge ice floe broke off from the shore. Pip was stranded, drifting further and further from his family. He tried to swim, but the current was too strong. He felt scared and alone.
<scene>
Suddenly, a group of humpback whales surfaced nearby. They saw Pip's distress and gently nudged the ice floe with their noses, pushing him towards the shore. Pip held on tight, his heart pounding.
<scene>
When they reached the shore, Pip's family was waiting, cheering and waving. He thanked the whales, who gave a friendly spout of water before diving back into the sea. Pip realized that even though he couldn't fly, he had friends who could help him reach his destination. And that was even better than flying alone.
`;

async function toArray(deliminatedInput) {
  const GeminiKey = "AIzaSyBm10CZuZl3221d9VO8sT1Zf0dFGU4C-xc"; // Replace with your actual Gemini API key

  const { GoogleGenerativeAI } = require("@google/generative-ai");

  const genAI = new GoogleGenerativeAI(GeminiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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

    `;
  const result = await model.generateContent(ourPrompt + deliminatedInput);
  const responseText = result.response.text();

  try {
    // Attempt to extract the JSON array from the response
    const jsonStartIndex = responseText.indexOf('[');
    const jsonEndIndex = responseText.lastIndexOf(']') + 1;
    const jsonString = responseText.substring(jsonStartIndex, jsonEndIndex);
    const jsonArray = JSON.parse(jsonString);
    return jsonArray;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}

async function main() {
  const result = await toArray(sampleDeliminatedInput);
  console.log(result);
  console.log("END");
}

main();