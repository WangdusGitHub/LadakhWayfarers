/* ==========================================================
   Tours.tsx — Full tour packages page with itinerary modal,
   fare estimator, and WhatsApp booking integration
   — Data fetched live from MongoDB via DataContext
   ========================================================== */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import { TourPackage } from '../types';
import { useData } from '../context/DataContext';

/* ---- Difficulty config ---- */
const DIFF_CLASS: Record<string, string> = {
  Easy: 'tag-green',
  Moderate: 'tag-gold',
  Adventurous: 'tag-gold',
  Extreme: 'tag-muted',
};

/* ---- Category filter options ---- */
const CATEGORIES = ['All', 'Classic', 'High Passes', 'Expedition'] as const;

export default function Tours() {
  const { tours, driverConfig, isLoading } = useData();

  /* Category filter state */
  const [activeCategory, setActiveCategory] = useState<string>('All');
  /* Itinerary modal state */
  const [modalTour, setModalTour] = useState<TourPackage | null>(null);

  /* Fare estimator states */
  const [estTourId, setEstTourId] = useState<string>('');
  const [extraDays, setExtraDays] = useState(0);
  const [pax, setPax] = useState(2);

  /* Sync estimator tour when tours load */
  useEffect(() => {
    if (tours.length > 0 && !estTourId) {
      setEstTourId(tours[0].id);
    }
  }, [tours, estTourId]);

  /* Build estimator options from live data */
  const ESTIMATOR_TOURS = tours.map((t) => ({
    id: t.id,
    label: t.title,
    baseFare: parseInt(t.priceEstimate.replace(/[₹,\s]/g, '').split('-')[0], 10) || 18500,
  }));

  /* Filter tours by category */
  const filteredTours = activeCategory === 'All'
    ? tours
    : tours.filter((t) => t.category === activeCategory);

  /* Calculate fare estimate */
  const baseTour = ESTIMATOR_TOURS.find((t) => t.id === estTourId) || ESTIMATOR_TOURS[0];
  const estimatedFare = baseTour ? Math.round(baseTour.baseFare + extraDays * 4500) : 0;

  /* Build WhatsApp booking link for a specific tour */
  const buildBookingLink = (tour: TourPackage) =>
    `https://wa.me/${driverConfig.whatsapp}?text=${encodeURIComponent(
      `Hello! I am interested in booking the "${tour.title}" package. Please share your availability and detailed pricing.`
    )}`;

  return (
    <PageWrapper>
      {/* ===================== PAGE HERO ===================== */}
      <section className="section-py" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="section-eyebrow">Tour Packages</span>
            <h1 className="section-h2">Curated Ladakh<br />Adventures</h1>
            <p className="section-lead">
              Every itinerary is designed for genuine exploration — not rushed sightseeing.
              Flexible dates, transparent union-tariff pricing, zero hidden charges.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===================== CATEGORY FILTER ===================== */}
      <section className="section-py-sm" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="filter-chips">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-chip${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TOUR CARDS ===================== */}
      <section className="section-py">
        <div className="container">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>⛰️</div>
              Loading tour packages from database…
            </div>
          ) : (
            <div className="tours-grid">
              <AnimatePresence mode="wait">
                {filteredTours.map((tour, i) => (
                  <motion.div
                    key={tour.id}
                    className="tour-card"
                    layout
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Cover Image from Cloudinary (if available) */}
                    {tour.coverImage && (
                      <div style={{ width: '100%', height: 180, overflow: 'hidden', borderRadius: 'var(--radius) var(--radius) 0 0' }}>
                        <img
                          src={tour.coverImage}
                          alt={tour.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Card Header */}
                    <div className="tour-card-head">
                      <div className="tour-tags">
                        <span className="tag tag-gold">{tour.badge}</span>
                        <span className={`tag ${DIFF_CLASS[tour.difficulty] || 'tag-muted'}`}>{tour.difficulty}</span>
                        <span className="tag tag-muted">{tour.category}</span>
                      </div>
                      <div className="tour-title">{tour.title}</div>
                      <div className="tour-meta">
                        <span className="tour-meta-item">⏱ {tour.duration}</span>
                        <span className="tour-meta-item">⛰ {tour.maxAltitude}</span>
                        <span className="tour-meta-item">🌤 {tour.bestSeason}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="tour-card-body">
                      <p className="tour-overview">{tour.overview}</p>

                      {/* Highlights */}
                      <ul className="tour-highlights">
                        {tour.highlights.slice(0, 4).map((h) => (
                          <li key={h}>
                            <span className="icon-check">✦</span>
                            {h}
                          </li>
                        ))}
                        {tour.highlights.length > 4 && (
                          <li style={{ color: 'var(--gold)', cursor: 'pointer', fontSize: '0.82rem', marginTop: 2 }} onClick={() => setModalTour(tour)}>
                            +{tour.highlights.length - 4} more highlights…
                          </li>
                        )}
                      </ul>

                      {/* Vehicle + Price */}
                      <div className="tour-price-row">
                        <div>
                          <div className="tour-price">{tour.priceEstimate}</div>
                          <div className="tour-price-label">per vehicle · {tour.idealVehicle}</div>
                        </div>
                        <span className="tag tag-green">✓ Transparent Tariff</span>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="tour-card-foot">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setModalTour(tour)}
                      >
                        View Itinerary
                      </button>
                      <a
                        href={buildBookingLink(tour)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-gold btn-sm"
                      >
                        Book This Tour
                      </a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredTours.length === 0 && !isLoading && (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                  No tours found for this category.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ===================== FARE ESTIMATOR ===================== */}
      {ESTIMATOR_TOURS.length > 0 && (
        <section className="section-py" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="estimator-card">
                <span className="section-eyebrow">Quick Estimate</span>
                <h2 className="section-h2" style={{ fontSize: '2rem' }}>Fare Calculator</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: 4 }}>
                  All prices follow government-regulated All Ladakh Taxi Union tariffs.
                </p>

                <div className="estimator-form-grid">
                  {/* Tour selector */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="est-tour">Select Tour Package</label>
                    <select
                      id="est-tour"
                      className="form-control"
                      value={estTourId}
                      onChange={(e) => setEstTourId(e.target.value)}
                    >
                      {ESTIMATOR_TOURS.map((t) => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Extra days */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="est-extra">Extra Days</label>
                    <input
                      id="est-extra"
                      type="number"
                      min={0}
                      max={10}
                      value={extraDays}
                      onChange={(e) => setExtraDays(Number(e.target.value))}
                      className="form-control"
                    />
                  </div>

                  {/* Passengers */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="est-pax">Passengers</label>
                    <select
                      id="est-pax"
                      className="form-control"
                      value={pax}
                      onChange={(e) => setPax(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="estimator-result">
                  <div>
                    <div className="estimator-price">₹{estimatedFare.toLocaleString('en-IN')}</div>
                    <div className="estimator-price-label">Estimated Base Fare (per vehicle)</div>
                  </div>
                  <div className="estimator-note">
                    Final price confirmed via WhatsApp. Includes driver, fuel, vehicle charges.
                    Permits, accommodation, and meals are separate unless stated.
                  </div>
                  <a
                    href={`https://wa.me/${driverConfig.whatsapp}?text=${encodeURIComponent(
                      `Hi! I used your fare estimator and want to confirm pricing for ${baseTour?.label || 'a tour'} with ${pax} passengers (+${extraDays} extra days). My estimated fare shows ₹${estimatedFare.toLocaleString('en-IN')}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-wa"
                  >
                    Confirm via WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ===================== BOOKING NOTE ===================== */}
      <section className="section-py-sm" style={{ borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div className="container">
          <p style={{ color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto 24px' }}>
            Custom itineraries available. Pick-up from Leh Airport, Leh City, or any hotel.
            Solo, couple, family, and group packages all available.
          </p>
          <Link to="/contact" className="btn btn-gold btn-lg">Request Custom Tour</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          © {new Date().getFullYear()} Ladakh Wayfarers — {driverConfig.driverName}
        </div>
      </footer>

      {/* ===================== ITINERARY MODAL ===================== */}
      <AnimatePresence>
        {modalTour && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setModalTour(null); }}
          >
            <motion.div
              className="modal-box"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <button className="modal-close" onClick={() => setModalTour(null)} aria-label="Close itinerary">✕</button>

              <div style={{ clear: 'both' }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                  <span className="tag tag-gold">{modalTour.badge}</span>
                  <span className={`tag ${DIFF_CLASS[modalTour.difficulty] || 'tag-muted'}`}>{modalTour.difficulty}</span>
                </div>
                <div className="modal-title">{modalTour.title}</div>
                <div className="modal-meta">
                  <span>⏱ {modalTour.duration}</span>
                  <span>⛰ {modalTour.maxAltitude}</span>
                  <span>🚙 {modalTour.idealVehicle}</span>
                </div>

                {/* Full Highlights */}
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)' }}>ALL HIGHLIGHTS</h3>
                <ul className="tour-highlights" style={{ marginBottom: 28 }}>
                  {modalTour.highlights.map((h) => (
                    <li key={h}><span className="icon-check" style={{ color: 'var(--gold)' }}>✦</span>{h}</li>
                  ))}
                </ul>

                {/* Day-by-day Itinerary */}
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 20, color: 'var(--text-muted)' }}>DETAILED ITINERARY</h3>
                <div className="timeline">
                  {modalTour.itinerary.map((day, i) => (
                    <div key={day.day || i} className="timeline-item">
                      <div className="timeline-dot">{i + 1}</div>
                      <div className="timeline-day">{day.day}</div>
                      <div className="timeline-title">{day.title}</div>
                      <div className="timeline-desc">{day.desc}</div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="modal-actions-row">
                  <a
                    href={buildBookingLink(modalTour)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-gold modal-book-btn"
                  >
                    <span>💬</span> Book This Tour on WhatsApp
                  </a>
                  <button className="btn btn-ghost modal-dismiss-btn" onClick={() => setModalTour(null)}>Close</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
