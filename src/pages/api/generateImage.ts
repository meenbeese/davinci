import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ message: "Prompt is required and must be a string." });
  }

  try {
    // Call Google Gemini API for image generation
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini:generateImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GOOGLE_API_KEY}`,
      },
      body: JSON.stringify({
        prompt, // Text prompt for image generation
        n: 1, // Number of images to generate
        size: "512x512", // Image size (if supported by Gemini)
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ message: error.error.message || "Error from Google Gemini API" });
    }

    const data = await response.json();

    // Assuming the Gemini API returns an array of image URLs
    const imageUrl = data.images?.[0]?.url || null;

    if (!imageUrl) {
      return res.status(500).json({ message: "Failed to retrieve image URL from Gemini API response." });
    }

    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
