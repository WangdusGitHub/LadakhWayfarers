import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// Cloudinary Setup
// ---------------------------------------------------------------------------
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

// ---------------------------------------------------------------------------
// Mongoose Models
// ---------------------------------------------------------------------------
const TourSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  duration: { type: String, default: '' },
  maxAltitude: { type: String, default: '' },
  difficulty: { type: String, default: 'Moderate' },
  bestSeason: { type: String, default: '' },
  idealVehicle: { type: String, default: 'Toyota Innova Crysta' },
  category: { type: String, default: 'Classic' },
  badge: { type: String, default: '' },
  priceEstimate: { type: String, default: '' },
  overview: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  highlights: [{ type: String }],
  itinerary: [{
    day: { type: String },
    title: { type: String },
    desc: { type: String }
  }]
}, { timestamps: true });

const ReviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, default: '' },
  origin: { type: String, default: '' },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  date: { type: String, default: '' },
  route: { type: String, default: '' },
  vehicle: { type: String, default: 'Toyota Innova Crysta' },
  review: { type: String, required: true },
  verified: { type: Boolean, default: true },
  helpfulCount: { type: Number, default: 0 },
  driverReply: { type: String, default: '' },
  photoUrl: { type: String, default: '' }
}, { timestamps: true });

const GallerySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, default: 'lakes' },
  caption: { type: String, default: '' },
  location: { type: String, default: '' },
  image: { type: String, required: true },
  publicId: { type: String, default: '' },
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' }
}, { timestamps: true });

const DriverConfigSchema = new mongoose.Schema({
  driverName: { type: String, default: 'Stanzin Jigmet' },
  brandName: { type: String, default: 'Ladakh Wayfarers' },
  tagline: { type: String, default: 'High-Altitude Chauffeur & Mountain Guide' },
  phone: { type: String, default: '+91 97978 87369' },
  whatsapp: { type: String, default: '919797887369' },
  whatsappNumber: { type: String, default: '919797887369' },
  displayPhone: { type: String, default: '+91 97978 87369' },
  email: { type: String, default: 'stanzinjigmet33@gmail.com' },
  baseLocation: { type: String, default: 'Leh, Ladakh (Main Taxi Stand & Airport Pickups)' },
  taxiUnionReg: { type: String, default: 'JK-10-B-7890 (All Ladakh Tour Operators Union)' },
  primaryVehicle: { type: String, default: 'Toyota Innova Crysta 2.8 ZX (Luxury AC / Dual Heaters)' },
  secondaryVehicle: { type: String, default: 'Mahindra Scorpio 4WD (Extreme Clearance)' },
  drivingExperienceYears: { type: String, default: '6+' },
  safeExpeditionsCount: { type: String, default: '650+' },
  safetyFeatures: [{ type: String }]
}, { timestamps: true });

const Tour = mongoose.models.Tour || mongoose.model('Tour', TourSchema, 'tours');
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema, 'reviews');
const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema, 'galleries');
const DriverConfig = mongoose.models.DriverConfig || mongoose.model('DriverConfig', DriverConfigSchema, 'driverconfigs');

let isConnected = false;
async function connectDb() {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ [MongoDB] MONGODB_URI environment variable not configured.');
    return;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    isConnected = true;
    console.log('⚡ [MongoDB Atlas] Connected successfully.');
  } catch (err) {
    console.warn('⚠️ [MongoDB] Connection error:', err.message);
  }
}

// Ensure DB connection middleware for /api routes
app.use('/api', async (req, res, next) => {
  await connectDb();
  next();
});

// ---------------------------------------------------------------------------
// API Endpoints
// ---------------------------------------------------------------------------

// Status & Health Check
app.get('/api/status', (req, res) => {
  res.json({
    mongodb: { connected: isConnected || mongoose.connection.readyState === 1 },
    cloudinary: {
      configured: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY),
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || null
    }
  });
});

// Driver Configuration
app.get('/api/driver-config', async (req, res) => {
  try {
    const config = await DriverConfig.findOne().sort({ updatedAt: -1 });
    res.json(config || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/driver-config', async (req, res) => {
  try {
    const updated = await DriverConfig.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tours
app.get('/api/tours', async (req, res) => {
  try {
    const tours = await Tour.find().sort({ createdAt: -1 });
    res.json(tours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tours', async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) data.id = 'tour-' + Date.now();
    const created = await Tour.create(data);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Gallery
app.get('/api/gallery', async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/gallery', async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) data.id = 'gal-' + Date.now();
    const created = await Gallery.create(data);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.name || !data.review) {
      return res.status(400).json({ error: 'Missing name or review text' });
    }
    if (!data.id) data.id = 'rev_' + Date.now();
    data.rating = Number(data.rating) || 5;
    data.verified = data.verified !== false;
    data.helpfulCount = Number(data.helpfulCount) || 1;
    const created = await Review.create(data);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Increment review helpful counter
app.post('/api/reviews/:id/helpful', async (req, res) => {
  try {
    const updated = await Review.findOneAndUpdate(
      { id: req.params.id },
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );
    res.json({ success: true, helpfulCount: updated?.helpfulCount || 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cloudinary client upload params
app.post('/api/upload', (req, res) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    return res.status(503).json({ error: 'Cloudinary credentials not configured.' });
  }
  res.json({
    cloudName,
    uploadPreset,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
  });
});

// ---------------------------------------------------------------------------
// Static Production Assets & SPA Fallback
// ---------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'dist')));

// Send index.html for any unhandled routes to support React Router client-side routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------
connectDb().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Ladakh Wayfarers server live on http://0.0.0.0:${PORT}`);
  });
});
