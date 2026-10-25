import { connectToDatabase, DriverConfig } from './_db';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await connectToDatabase();
  } catch (err: any) {
    console.error('Database connection error in /api/driver-config:', err.message);
  }

  if (req.method === 'GET') {
    try {
      const config = await DriverConfig.findOne().sort({ updatedAt: -1 });
      return res.status(200).json(config || {});
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const updated = await DriverConfig.findOneAndUpdate({}, req.body, { new: true, upsert: true });
      return res.status(200).json(updated);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
