/**
 * ==============================================================================
 * SERVERLESS API: /api/upload
 * ==============================================================================
 * This runs on the server. The CLOUDINARY_API_SECRET remains 100% hidden
 * and is NEVER bundled into or exposed to the client browser!
 * ==============================================================================
 */

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return res.status(503).json({ error: "Cloudinary credentials not configured in environment variables." });
  }

  // Cloudinary upload endpoint
  return res.status(200).json({
    cloudName,
    uploadPreset,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
  });
}
