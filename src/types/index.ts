export interface TourHighlight {
  id: string;
  text: string;
}

export interface DayItinerary {
  _id?: string;
  day: string;
  title: string;
  desc: string;
}

export interface TourPackage {
  _id?: string;
  id: string;
  title: string;
  duration: string;
  maxAltitude: string;
  difficulty: 'Easy' | 'Moderate' | 'Adventurous' | 'Extreme' | string;
  bestSeason: string;
  idealVehicle: string;
  category: 'Classic' | 'High Passes' | 'Expedition' | string;
  badge: string;
  priceEstimate: string;
  overview: string;
  coverImage?: string;
  highlights: string[];
  itinerary: DayItinerary[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  _id?: string;
  id: string;
  name: string;
  email: string;
  origin: string;
  rating: number;
  date: string;
  route: string;
  vehicle: string;
  review: string;
  photoUrl?: string;
  verified: boolean;
  helpfulCount: number;
  driverReply?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryItem {
  _id?: string;
  id: string;
  title: string;
  category: 'passes' | 'lakes' | 'culture' | 'safety' | 'vehicles' | 'videos' | 'valleys' | string;
  caption: string;
  location: string;
  image: string; // Cloudinary secure URL
  publicId?: string; // Cloudinary publicId
  mediaType?: 'image' | 'video'; // image or video
  createdAt?: string;
  updatedAt?: string;
}

export interface DriverConfig {
  _id?: string;
  driverName: string;
  brandName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  whatsappNumber: string;
  displayPhone: string;
  email: string;
  baseLocation: string;
  taxiUnionReg: string;
  primaryVehicle: string;
  secondaryVehicle: string;
  drivingExperienceYears: string;
  safeExpeditionsCount: string;
  safetyFeatures: string[];
  profileImage?: string;
  profileImagePublicId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewFormData {
  name: string;
  email: string;
  origin: string;
  route: string;
  rating: number;
  date: string;
  review: string;
  photoUrl?: string;
}
