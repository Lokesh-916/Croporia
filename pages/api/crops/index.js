import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'crops.json');
  
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    const crops = JSON.parse(fileData);
    res.status(200).json(crops);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Error reading crop data' });
  }
}
