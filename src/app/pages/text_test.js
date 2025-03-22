console.log("hello world")

const GeminiKey= "AIzaSyBm10CZuZl3221d9VO8sT1Zf0dFGU4C-xc"

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(GeminiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const prompt = "Tell me a story about a lion concisely";

async function run() {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
}

run();