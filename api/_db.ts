/**
 * ==============================================================================
 * LADAKH WAYFARERS - SERVERLESS DATABASE & CLOUDINARY CONNECTOR
 * ==============================================================================
 * This module connects serverless API endpoints (/api/*) to MongoDB Atlas
 * and initializes Cloudinary SDK for secure media management.
 *
 * HOW IT WORKS IN SERVERLESS / PRODUCTION:
 * - Vercel / Netlify / Node executes these functions on demand.
 * - `connectToDatabase()` caches the connection across invocations to avoid
 *   socket exhaustion.
 * - Collections:
 *   - 'tours'        -> TourPackage records
 *   - 'reviews'      -> Verified traveler testimonials
 *   - 'galleries'    -> Cloudinary photos/reels
 *   - 'driverconfigs'-> Dynamic chauffeur business details
 *
 * HOW TO CONFIGURE IN PRODUCTION (e.g., Vercel Project Settings > Environment Variables):
 * - MONGODB_URI: Full connection string with user, password, and database name
 * - CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name
 * - CLOUDINARY_API_KEY: Your Cloudinary API key
 * - CLOUDINARY_API_SECRET: Your Cloudinary API secret (server only, never leaked)
 * ==============================================================================
 */

import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary if credentials are present
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

export const Tour = mongoose.models.Tour || mongoose.model('Tour', TourSchema, 'tours');
export const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema, 'reviews');
export const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema, 'galleries');
export const DriverConfig = mongoose.models.DriverConfig || mongoose.model('DriverConfig', DriverConfigSchema, 'driverconfigs');

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not configured');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
}
