/* ==========================================================
   Fab.tsx — Floating action buttons (WhatsApp + Call)
   Fixed to bottom-right on all pages
   ========================================================== */
import React from 'react';
import { useData } from '../context/DataContext';

export default function Fab() {
  const { driverConfig } = useData();
  const { phone, whatsapp } = driverConfig;

  /* Build WhatsApp deep link with a greeting */
  const waLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    'Hello! I found your website and I\'m interested in booking a taxi tour in Ladakh. Could you please share more details?'
  )}`;

  return (
    <div className="fab-group" aria-label="Quick contact buttons">
      {/* WhatsApp */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fab fab-wa"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        {/* WhatsApp icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.412A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.073-1.115l-.29-.174-3.012.854.853-2.936-.19-.302A8 8 0 1112 20z"/>
        </svg>
      </a>

      {/* Phone call */}
      <a
        href={`tel:${phone}`}
        className="fab fab-call"
        aria-label={`Call ${phone}`}
        title="Call now"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
      </a>
    </div>
  );
}
