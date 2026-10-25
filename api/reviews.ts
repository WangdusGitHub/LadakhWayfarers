import { connectToDatabase, Review } from './_db';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();
  } catch (err: any) {
    console.error('Database connection error in /api/reviews:', err.message);
  }

  // GET: Fetch Reviews from MongoDB
  if (req.method === 'GET') {
    try {
      const reviews = await Review.find().sort({ createdAt: -1 });
      return res.status(200).json(reviews);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST: Create New Review
  if (req.method === 'POST') {
    const data = req.body;
    if (!data || !data.name || !data.review) {
      return res.status(400).json({ error: 'Missing name or review text' });
    }

    if (!data.id) data.id = 'rev_' + Date.now();
    data.rating = Number(data.rating) || 5;
    data.verified = data.verified !== false;
    data.helpfulCount = Number(data.helpfulCount) || 1;

    try {
      const created = await Review.create(data);
      return res.status(201).json(created);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
