import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Disable Next.js's default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable({});
  
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing the files' });
    }

    console.log('Parsed files:', files); // Log the files object

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded or incorrect input name' });
    }

    const uploadDir = path.join(process.cwd(), 'uploads'); // Directory to save files

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    // Move the file to the uploads directory
    const oldPath = file.filepath;
    const newPath = path.join(uploadDir, file.originalFilename || 'uploaded_file');

    fs.rename(oldPath, newPath, async (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving the file' });
      }
      console.log('File moved to:', newPath); // Log the new file path

      // Generate a description of the uploaded image
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const fileToGenerativePart = (path: string, mimeType: string) => ({
        inlineData: {
          data: Buffer.from(fs.readFileSync(path)).toString("base64"),
          mimeType,
        },
      });

      const prompt = "Describe this image in detail";
      const imagePart = fileToGenerativePart(newPath, file.mimetype || 'application/octet-stream'); // Use the uploaded file's mime type or a default
      const result = await model.generateContent([prompt, imagePart]);
      const description = result.response.text(); // Get the generated description

      res.status(200).json({ message: 'File uploaded successfully', filePath: newPath, description }); // Include description in the response
    });
  });
};

export default uploadHandler; 