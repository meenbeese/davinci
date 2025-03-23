import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable Next.js's default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable({});
  
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing the files' });
    }

    console.log('Parsed files:', files); // Log the files object

    const file = files.file[0]; // Access the first file in the array
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

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving the file' });
      }
      console.log('File moved to:', newPath); // Log the new file path
      res.status(200).json({ message: 'File uploaded successfully', filePath: newPath });
    });
  });
};

export default uploadHandler; 