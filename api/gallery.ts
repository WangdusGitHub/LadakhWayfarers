import { connectToDatabase, Gallery } from './_db';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await connectToDatabase();
  } catch (err: any) {
    console.error('Database connection error in /api/gallery:', err.message);
  }

  if (req.method === 'GET') {
    try {
      const items = await Gallery.find().sort({ createdAt: -1 });
      return res.status(200).json(items);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const data = req.body;
      if (!data.id) data.id = 'gal-' + Date.now();
      const created = await Gallery.create(data);
      return res.status(201).json(created);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
