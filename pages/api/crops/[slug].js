import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { slug } = req.query;
  const filePath = path.join(process.cwd(), 'data', 'crops.json');
  
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    const crops = JSON.parse(fileData);
    const crop = crops.find(c => c.slug === slug);

    if (crop) {
      res.status(200).json(crop);
    } else {
      res.status(404).json({ message: 'Crop not found' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Error reading crop data' });
  }
}
