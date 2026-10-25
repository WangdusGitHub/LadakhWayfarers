/* ==========================================================
   Gallery.tsx — Images & Videos from Cloudinary via MongoDB
   Category filter + lightbox. Data from DataContext.
   ========================================================== */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import { useData } from '../context/DataContext';
import { GalleryItem } from '../types';

const CATEGORIES = [
  { key: 'all',      label: 'All Media' },
  { key: 'passes',   label: '⛰ High Passes & Roads' },
  { key: 'lakes',    label: '🏞 Alpine Lakes' },
  { key: 'valleys',  label: '🌄 Valleys' },
  { key: 'culture',  label: '🏯 Culture & Monasteries' },
  { key: 'vehicles', label: '🚙 Our Vehicles' },
  { key: 'videos',   label: '🎬 Videos' },
] as const;

export default function Gallery() {
  const { gallery, driverConfig, isLoading } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filteredItems = activeCategory === 'all'
    ? gallery
    : gallery.filter((item) => item.category === activeCategory);

  return (
    <PageWrapper>
      {/* ---- PAGE HERO with highway background ---- */}
      <section
        className="section-py"
        style={{
          borderBottom: '1px solid var(--border)',
          position: 'relative',
          backgroundImage: 'url(/images/gallery/highway2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* light overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(250,250,248,0.82)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="section-eyebrow">Photo & Video Gallery</span>
            <h1 className="section-h2">Ladakh Through<br />the Driver's Lens</h1>
            <p className="section-lead">
              Real landscapes from real expeditions — no stock photos.
              Every image and video was captured during an actual client tour.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ---- FILTERS ---- */}
      <section className="section-py-sm" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="gallery-filters">
            {CATEGORIES.map(({ key, label }) => (
              <button
                key={key}
                className={`filter-chip${activeCategory === key ? ' active' : ''}`}
                onClick={() => setActiveCategory(key)}
                aria-pressed={activeCategory === key}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---- GALLERY GRID ---- */}
      <section className="section-py">
        <div className="container">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>📸</div>
              Loading gallery from Cloudinary…
            </div>
          ) : (
            <div className="gallery-grid">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    className="gallery-item"
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    onClick={() => setLightboxItem(item)}
                    role="button" tabIndex={0} aria-label={`Open ${item.title}`}
                    onKeyDown={(e) => e.key === 'Enter' && setLightboxItem(item)}
                  >
                    {/* Render video thumbnail or image */}
                    {item.mediaType === 'video' ? (
                      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <video
                          src={item.image}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        />
                        {/* Video badge */}
                        <div style={{
                          position: 'absolute', top: 8, right: 8,
                          background: 'rgba(0,0,0,0.7)', borderRadius: 4,
                          padding: '2px 7px', fontSize: '0.72rem', color: '#fff', fontWeight: 600
                        }}>▶ VIDEO</div>
                      </div>
                    ) : (
                      <img src={item.image} alt={item.title} loading="lazy" />
                    )}
                    <div className="gallery-overlay">
                      <div className="gallery-item-loc">📍 {item.location}</div>
                      <div className="gallery-item-title">{item.title}</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredItems.length === 0 && !isLoading && (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                  No items found in this category.
                </div>
              )}
            </div>
          )}

          {/* Share CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginTop: 60, padding: '40px', background: 'var(--blue-dim)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(26,109,181,0.18)' }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📸</div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', marginBottom: 10, color: 'var(--text)' }}>
              Travelled With Us? Share Your Photos!
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>
              Your best shots may be featured in this gallery. Send them to {driverConfig.driverName} on WhatsApp.
            </p>
            <a
              href={`https://wa.me/${driverConfig.whatsapp}?text=${encodeURIComponent('Hi! I want to share my Ladakh trip photos from our tour.')}`}
              target="_blank" rel="noopener noreferrer"
              className="btn btn-wa"
            >
              Share Photos via WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">© {new Date().getFullYear()} Ladakh Wayfarers — {driverConfig.driverName}</div>
      </footer>

      {/* ---- LIGHTBOX ---- */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            className="lightbox-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightboxItem(null)}
          >
            <motion.div
              className="lightbox-box"
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxItem.mediaType === 'video' ? (
                <video
                  src={lightboxItem.image}
                  className="lightbox-img"
                  controls
                  autoPlay
                  style={{ maxHeight: '70vh', borderRadius: 'var(--radius)' }}
                />
              ) : (
                <img src={lightboxItem.image} alt={lightboxItem.title} className="lightbox-img" />
              )}
              <div className="lightbox-meta">
                <div style={{ fontSize: '0.72rem', color: 'var(--blue)', fontWeight: 700, marginBottom: 4 }}>
                  📍 {lightboxItem.location}
                </div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: 'var(--text)' }}>
                  {lightboxItem.title}
                </div>
                {lightboxItem.caption && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6 }}>
                    {lightboxItem.caption}
                  </div>
                )}
                <button
                  onClick={() => setLightboxItem(null)}
                  className="btn btn-ghost btn-sm"
                  style={{ marginTop: 12 }}
                >
                  Close ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
