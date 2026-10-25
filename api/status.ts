import { connectToDatabase } from './_db';
import mongoose from 'mongoose';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  let connected = false;
  let error = null;

  try {
    await connectToDatabase();
    connected = mongoose.connection.readyState === 1;
  } catch (err: any) {
    error = err.message;
  }

  return res.status(200).json({
    mongodb: {
      connected,
      error
    },
    cloudinary: {
      configured: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY),
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || null
    }
  });
}
