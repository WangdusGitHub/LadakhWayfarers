/**
 * ==============================================================================
 * LADAKH WAYFARERS - GALLERY DATASET
 * ==============================================================================
 * This file contains default/fallback photos and videos for the gallery.
 * When MongoDB is connected, the app fetches items dynamically from the
 * 'galleries' collection; if the database is unreachable, this dataset
 * is automatically used as an instant, reliable fallback.
 *
 * HOW TO ADD OR MODIFY GALLERY MEDIA IN THE FUTURE:
 * 1. Place your image/video inside the 'public/images/gallery/' directory
 *    or upload it directly via Cloudinary / MongoDB.
 * 2. Add a new object to GALLERY_DATA below with:
 *    - id: Unique string identifier (e.g., 'gal-11')
 *    - title: Catchy title of the location or vehicle
 *    - category: One of 'passes' | 'lakes' | 'valleys' | 'culture' | 'vehicles' | 'videos'
 *    - caption: 1-2 sentence description highlighting route experience or safety
 *    - location: Specific landmark in Ladakh (e.g., 'Pangong Tso Lake')
 *    - image: Relative path (e.g., '/images/gallery/filename.jpg') or Cloudinary URL
 *    - mediaType: 'image' (default) or 'video'
 * ==============================================================================
 */

import { GalleryItem } from '../types';

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: "gal-01",
    title: "Toyota Innova Crysta at Pangong Tso",
    category: "lakes",
    caption: "Our tourist cab parked beside the pristine turquoise waters of Pangong Tso at 14,270 ft elevation.",
    location: "Pangong Tso Lake, Changthang",
    image: "/images/gallery/pangong-flags.jpg",
    mediaType: "image"
  },
  {
    id: "gal-02",
    title: "Khardung La Pass Summit (17,982 ft)",
    category: "passes",
    caption: "Winter snowdrifts and prayer flags fluttering at the classic gateway pass to Nubra Valley.",
    location: "Khardung La Pass",
    image: "/images/gallery/khardungla.jpg",
    mediaType: "image"
  },
  {
    id: "gal-03",
    title: "Umling La Pass (19,024 ft) - Highest Road",
    category: "passes",
    caption: "World record milestone signboard at 19,024 ft elevation with our 4x4 cab on the BRO pass.",
    location: "Umling La, Eastern Ladakh",
    image: "/images/gallery/umlingla.jpg",
    mediaType: "image"
  },
  {
    id: "gal-04",
    title: "Hunder Sand Dunes & Nubra Valley Oasis",
    category: "valleys",
    caption: "Double-humped Bactrian camels wandering across the high-altitude cold desert dunes at sunset.",
    location: "Hunder, Nubra Valley",
    image: "/images/gallery/nubra.jpg",
    mediaType: "image"
  },
  {
    id: "gal-05",
    title: "Grand Zanskar Valley Wilderness",
    category: "valleys",
    caption: "Expeditions through the rugged river gorges, glaciers, and remote passes of Zanskar.",
    location: "Zanskar Valley",
    image: "/images/gallery/zanskar.jpg",
    mediaType: "image"
  },
  {
    id: "gal-06",
    title: "Thiksey Monastery (Mini Potala)",
    category: "culture",
    caption: "Perched majestically atop a hill overlooking the sacred Indus river valley.",
    location: "Thiksey, Indus Valley",
    image: "/images/gallery/monastery.jpg",
    mediaType: "image"
  },
  {
    id: "gal-07",
    title: "Fluttering Prayer Flags on Mountain Passes",
    category: "culture",
    caption: "Five sacred colors blessing the high winds across Chang La and Khardung La ridges.",
    location: "Himalayan Ridge",
    image: "/images/gallery/prayer-flags.jpg",
    mediaType: "image"
  },
  {
    id: "gal-08",
    title: "Spiritual Prayer Wheels of Leh",
    category: "culture",
    caption: "Carved wooden and brass wheels spun by pilgrims and travelers for safe mountain passage.",
    location: "Leh Old Town",
    image: "/images/gallery/prayer-wheels.jpg",
    mediaType: "image"
  },
  {
    id: "gal-09",
    title: "Srinagar-Leh & Manali-Leh National Highway",
    category: "passes",
    caption: "Smooth cruising through barren canyons, dramatic switchbacks, and high-altitude asphalt.",
    location: "Ladakh National Highway",
    image: "/images/gallery/highway.jpg",
    mediaType: "image"
  },
  {
    id: "gal-10",
    title: "Endless Horizons of the Changthang Plateau",
    category: "valleys",
    caption: "Panoramic vistas stretching towards the Tibetan border on the expedition route to Hanle.",
    location: "Changthang, Eastern Ladakh",
    image: "/images/gallery/highway2.jpg",
    mediaType: "image"
  }
];
