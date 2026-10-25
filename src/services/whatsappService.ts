import { DRIVER_CONFIG } from '../data/config';
import { ReviewFormData, DriverConfig } from '../types';

interface ConfigOverride {
  driverName?: string;
  whatsappNumber?: string;
  whatsapp?: string;
}

/**
 * Creates WhatsApp booking inquiry link
 */
export function createTourBookingWhatsApp(tourTitle: string, duration: string, customNotes?: string, config?: ConfigOverride | DriverConfig): string {
  const driverName = config?.driverName || DRIVER_CONFIG.driverName;
  const whatsappNumber = config?.whatsapp || (config as any)?.whatsappNumber || DRIVER_CONFIG.whatsappNumber;

  let msg = `*Julley ${driverName}! Booking Inquiry from Website*\n\n`;
  msg += `*Requested Tour:* ${tourTitle}\n`;
  msg += `*Duration:* ${duration}\n`;
  if (customNotes) {
    msg += `*Travel Dates / Group Details:* ${customNotes}\n`;
  }
  msg += `\nPlease let me know your availability, permit assistance, and best taxi union quote. Thank you!`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

/**
 * Creates WhatsApp fare estimator inquiry link
 */
export function createFareQuoteWhatsApp(
  tourTitle: string,
  vehicle: string,
  passengers: number,
  estimatedPrice: number,
  config?: ConfigOverride | DriverConfig
): string {
  const driverName = config?.driverName || DRIVER_CONFIG.driverName;
  const whatsappNumber = config?.whatsapp || (config as any)?.whatsappNumber || DRIVER_CONFIG.whatsappNumber;

  let msg = `*Julley ${driverName}! Fare Quote Inquiry*\n\n`;
  msg += `*Plan:* ${tourTitle}\n`;
  msg += `*Vehicle:* ${vehicle}\n`;
  msg += `*Passengers:* ${passengers}\n`;
  msg += `*Estimated Union Tariff:* ₹${estimatedPrice.toLocaleString('en-IN')}\n\n`;
  msg += `Please confirm availability for my dates and let me know how to book. Thank you!`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

/**
 * Formats review message to alert driver on WhatsApp immediately
 */
export function createReviewWhatsAppNotification(review: ReviewFormData, config?: ConfigOverride | DriverConfig): string {
  const driverName = config?.driverName || DRIVER_CONFIG.driverName;
  const whatsappNumber = config?.whatsapp || (config as any)?.whatsappNumber || DRIVER_CONFIG.whatsappNumber;

  const stars = "⭐".repeat(review.rating);
  let msg = `*Julley ${driverName}! New Traveler Review on Your Website*\n\n`;
  msg += `*Traveler:* ${review.name} (${review.origin || 'Traveler'})\n`;
  msg += `*Email:* ${review.email}\n`;
  msg += `*Rating:* ${stars} (${review.rating}/5)\n`;
  msg += `*Route:* ${review.route}\n`;
  msg += `*Date:* ${review.date || new Date().toLocaleDateString()}\n\n`;
  msg += `*Review Message:*\n"${review.review}"\n\n`;
  if (review.photoUrl && !review.photoUrl.startsWith('data:')) {
    msg += `*Attached Photo:* ${review.photoUrl}\n\n`;
  }
  msg += `_This review has been published with a Verified Traveler badge on your portfolio!_`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
}
