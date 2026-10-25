/**
 * ==============================================================================
 * LADAKH WAYFARERS - CORE BUSINESS CONFIGURATION
 * ==============================================================================
 * This file serves as the central source of truth for the chauffeur's business
 * identity, contact details, vehicle specifications, and safety equipment.
 *
 * HOW TO MAKE FUTURE CHANGES:
 * 1. Contact Numbers:
 *    - `whatsapp`: Numbers only with international country code (e.g. "919797887369")
 *      This generates direct WhatsApp click-to-chat booking links across the app.
 *    - `phone` / `displayPhone`: Formatted with spaces & country code for display.
 *
 * 2. Vehicles:
 *    - Update `primaryVehicle` and `secondaryVehicle` to reflect your current fleet.
 *
 * 3. Stats & Experience:
 *    - Increment `drivingExperienceYears` (e.g., "7+") and `safeExpeditionsCount`
 *      (e.g., "650+") as milestones are achieved.
 *
 * 4. Driver Profile Photo:
 *    - Set `profileImage` to a Cloudinary URL or local file path (e.g., "/images/driver.jpg").
 *
 * NOTE ON SECURITY:
 * Secret credentials (MONGODB_URI, CLOUDINARY_API_SECRET) are kept strictly in
 * environment variables (.env / Vercel Dashboard) and are NEVER exposed here.
 * ==============================================================================
 */

export const DRIVER_CONFIG = {
  // Brand & Driver Identity
  driverName: "Stanzin Jigmet",
  brandName: "Ladakh Wayfarers",
  tagline: "High-Altitude Chauffeur & Mountain Guide",

  // Contact Channels
  // NOTE: 'whatsapp' must be digits only (country code + number, NO '+' or spaces)
  phone: "+91 97978 87369",
  whatsapp: "919797887369",
  whatsappNumber: "919797887369",
  displayPhone: "+91 97978 87369",
  email: "stanzinjigmet33@gmail.com",
  baseLocation: "Leh, Ladakh (Main Taxi Stand & Airport Pickups)",

  // Union Licensing & Legal Accreditation
  taxiUnionReg: "JK-10-B-7890 (All Ladakh Tour Operators Union)",

  // Fleet Details
  primaryVehicle: "Toyota Innova Crysta 2.8 ZX (Luxury AC / Dual Heaters)",
  secondaryVehicle: "Mahindra Scorpio 4WD (Extreme Clearance)",

  // Trust Metrics
  drivingExperienceYears: "6+",
  safeExpeditionsCount: "650+",

  // Safety Equipment & Traveler Perks
  safetyFeatures: [
    "Medical Grade Portable Oxygen Cylinder (O2) on-board",
    "Digital Pulse-Oximeter for AMS monitoring",
    "Heavy-duty Snow Chains for Khardung La & Chang La",
    "Dual Heated Passenger Cabin & Fast USB Charging",
    "Inner Line Permit (ILP) & Protected Area assistance",
    "All Ladakh Taxi Union Official Fair Meter Tariff"
  ],

  // Profile Image URL (Cloudinary or local /images/driver.jpg)
  profileImage: "https://res.cloudinary.com/efv1qjok/image/upload/v1792648578/ladakh_wayfarers/lhrkqm33kmjiaitzzsaj.jpg",
  profileImagePublicId: "ladakh_wayfarers/lhrkqm33kmjiaitzzsaj"
};
