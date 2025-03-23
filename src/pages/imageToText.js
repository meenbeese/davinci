// import { GoogleGenerativeAI } from "@google/generative-ai";
// import * as fs from 'node:fs';
// import dotenv from 'dotenv';

// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// function fileToGenerativePart(path, mimeType) {
//   return {
//     inlineData: {
//       data: Buffer.from(fs.readFileSync(path)).toString("base64"),
//       mimeType,
//     },
//   };
// }

// const prompt = "Describe to me whats going on in this image.";
// const imagePart = fileToGenerativePart("/src/pages/walmarttest.png", "image/png");

// const result = await model.generateContent([prompt, imagePart]);
// console.log(result.response.text());