/**
 * ==============================================================================
 * LADAKH WAYFARERS - CLIENT API & RESILIENT STORAGE SERVICE
 * ==============================================================================
 * This service handles all data exchanges between the React frontend and
 * the serverless API (/api/*) or MongoDB Atlas database.
 *
 * RESILIENCY ARCHITECTURE (3-TIER FALLBACK):
 * 1. Live Serverless API (/api/*): Primary source connected to MongoDB Atlas.
 * 2. Browser LocalStorage: Cached copy for instant rendering and offline support.
 * 3. Static Datasets (src/data/*): Bulletproof fallback ensuring the website
 *    never renders blank screens even if the network or database is down.
 *
 * HOW TO CHANGE API BASE IN THE FUTURE:
 * - By default, calls use relative path '/api' (works on Vercel and local Vite dev).
 * - For a dedicated external backend, set `VITE_API_URL` in your deployment
 *   environment variables (e.g., VITE_API_URL=https://api.yourdomain.com/api).
 * ==============================================================================
 */

import { Review, ReviewFormData, TourPackage, GalleryItem, DriverConfig } from '../types';
import { INITIAL_REVIEWS } from '../data/initialReviews';
import { TOURS_DATA } from '../data/toursData';
import { GALLERY_DATA } from '../data/galleryData';
import { DRIVER_CONFIG } from '../data/config';

const LOCAL_STORAGE_REVIEWS = 'ladakh_taxi_reviews_v2';
const LOCAL_STORAGE_CONFIG = 'ladakh_taxi_driver_config_v2';
const LOCAL_STORAGE_TOURS = 'ladakh_taxi_tours_v2';
const LOCAL_STORAGE_GALLERY = 'ladakh_taxi_gallery_v2';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * -----------------------------------------------------------------------------
 * 1. DRIVER CONFIGURATION (MongoDB 'driverconfigs' collection)
 * -----------------------------------------------------------------------------
 */
export async function fetchDriverConfig(): Promise<DriverConfig> {
  try {
    const res = await fetch(`${API_BASE}/driver-config`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.driverName || data.brandName)) {
        try {
          localStorage.setItem(LOCAL_STORAGE_CONFIG, JSON.stringify(data));
        } catch (e) {}
        return data;
      }
    }
  } catch (err) {
    console.info('Using fallback driver configuration (API offline or unreachable).');
  }

  // Fallback: Check local cache or default config
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_CONFIG);
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  return DRIVER_CONFIG as DriverConfig;
}

/**
 * -----------------------------------------------------------------------------
 * 2. TOURS PACKAGES (MongoDB 'tours' collection)
 * -----------------------------------------------------------------------------
 */
export async function fetchTours(): Promise<TourPackage[]> {
  try {
    const res = await fetch(`${API_BASE}/tours`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        try {
          localStorage.setItem(LOCAL_STORAGE_TOURS, JSON.stringify(data));
        } catch (e) {}
        return data;
      }
    }
  } catch (err) {
    console.info('Using fallback tours dataset (API offline or unreachable).');
  }

  // Fallback: Check local cache or default static dataset
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_TOURS);
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  return TOURS_DATA;
}

/**
 * -----------------------------------------------------------------------------
 * 3. GALLERY (MongoDB 'galleries' collection with Cloudinary media)
 * -----------------------------------------------------------------------------
 */
export async function fetchGallery(): Promise<GalleryItem[]> {
  try {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        try {
          localStorage.setItem(LOCAL_STORAGE_GALLERY, JSON.stringify(data));
        } catch (e) {}
        return data;
      }
    }
  } catch (err) {
    console.info('Using fallback gallery dataset (API offline or unreachable).');
  }

  // Fallback: Check local cache or default static gallery
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_GALLERY);
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  return GALLERY_DATA;
}

/**
 * -----------------------------------------------------------------------------
 * 4. REVIEWS (MongoDB 'reviews' collection)
 * -----------------------------------------------------------------------------
 */
export async function fetchReviews(): Promise<Review[]> {
  try {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        try {
          localStorage.setItem(LOCAL_STORAGE_REVIEWS, JSON.stringify(data));
        } catch (e) {}
        return data;
      }
    }
  } catch (err) {
    console.info('Using fallback reviews cache (API offline or unreachable).');
  }

  // Fallback: Check local storage or seed
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_REVIEWS);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(LOCAL_STORAGE_REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    return INITIAL_REVIEWS;
  } catch (e) {
    return INITIAL_REVIEWS;
  }
}

/**
 * Submit a new review to MongoDB and update cache
 */
export async function submitReview(formData: ReviewFormData): Promise<Review> {
  const newReview: Review = {
    id: 'rev_' + Date.now(),
    name: formData.name.trim(),
    email: formData.email.trim(),
    origin: formData.origin.trim() || 'Traveler',
    rating: Number(formData.rating) || 5,
    date: formData.date || new Date().toISOString().split('T')[0],
    route: formData.route || 'Custom Ladakh Tour',
    vehicle: DRIVER_CONFIG.primaryVehicle,
    review: formData.review.trim(),
    photoUrl: formData.photoUrl || '',
    verified: true,
    helpfulCount: 1,
    createdAt: new Date().toISOString()
  };

  try {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview)
    });
    if (res.ok) {
      const saved = await res.json();
      if (saved && saved.id) {
        return saved;
      }
    }
  } catch (err) {
    console.info('Backend unreachable, saving review locally in browser cache.');
  }

  // Local storage persistence
  try {
    const existing = await fetchReviews();
    const updated = [newReview, ...existing.filter(r => r.id !== newReview.id)];
    localStorage.setItem(LOCAL_STORAGE_REVIEWS, JSON.stringify(updated));
  } catch (e) {}

  return newReview;
}

/**
 * -----------------------------------------------------------------------------
 * 5. CLOUDINARY UPLOAD (Images & Videos)
 * -----------------------------------------------------------------------------
 */
export interface UploadResult {
  url: string;
  publicId?: string;
  mediaType: 'image' | 'video';
  source?: 'cloudinary' | 'local';
}

export async function uploadMedia(file: File): Promise<UploadResult> {
  // Generate local data URI first
  const localDataUri = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });

  try {
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: localDataUri,
        name: file.name,
        type: file.type
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.url) {
        return {
          url: data.url,
          publicId: data.publicId,
          mediaType: data.mediaType || (file.type.startsWith('video/') ? 'video' : 'image'),
          source: data.source || 'cloudinary'
        };
      }
    }
  } catch (e) {
    console.info('Upload endpoint unreachable, using local photo preview.');
  }

  // Fallback to local Data URI
  return {
    url: localDataUri,
    mediaType: file.type.startsWith('video/') ? 'video' : 'image',
    source: 'local'
  };
}

/**
 * Backward compatibility alias for uploadPhoto
 */
export async function uploadPhoto(file: File): Promise<string> {
  const result = await uploadMedia(file);
  return result.url;
}

/**
 * -----------------------------------------------------------------------------
 * 6. HELPFUL COUNT INCREMENT
 * -----------------------------------------------------------------------------
 */
export function incrementHelpful(reviewId: string): number {
  try {
    // Try sending async update to backend
    fetch(`${API_BASE}/reviews/${reviewId}/helpful`, { method: 'POST' }).catch(() => {});

    const stored = localStorage.getItem(LOCAL_STORAGE_REVIEWS);
    if (stored) {
      const reviews: Review[] = JSON.parse(stored);
      const target = reviews.find(r => r.id === reviewId);
      if (target) {
        target.helpfulCount = (target.helpfulCount || 0) + 1;
        localStorage.setItem(LOCAL_STORAGE_REVIEWS, JSON.stringify(reviews));
        return target.helpfulCount;
      }
    }
  } catch (e) {}
  return 1;
}

/**
 * -----------------------------------------------------------------------------
 * 7. SYSTEM STATUS (MongoDB + Cloudinary Health)
 * -----------------------------------------------------------------------------
 */
export async function checkSystemStatus(): Promise<{
  mongodb: { connected: boolean; error?: string | null };
  cloudinary: { configured: boolean; cloudName?: string | null };
}> {
  try {
    const res = await fetch(`${API_BASE}/status`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}

  return {
    mongodb: { connected: false, error: 'API unreachable' },
    cloudinary: { configured: false }
  };
}
