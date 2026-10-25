/* ==========================================================
   Home.tsx — Landing page with hero, stats, quick tour
   preview, mini review highlights, and trust section
   — Data fetched live from MongoDB via DataContext
   ========================================================== */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import Stars from '../components/Stars';
import { useData } from '../context/DataContext';

/* ---- Animated counter with fade-up ---- */
const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

/* ---- Difficulty color badge ---- */
const diffColor: Record<string, string> = {
  Easy: 'tag-green',
  Moderate: 'tag-gold',
  Adventurous: 'tag-gold',
  Extreme: 'tag-muted',
};

export default function Home() {
  const { driverConfig, tours, reviews, isLoading } = useData();

  /* Live computed average rating — stays in sync with the Reviews page */
  const avgRating = reviews.length
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  /* Show first 3 tours as preview */
  const previewTours = tours.slice(0, 3);
  /* Show first 3 reviews */
  const previewReviews = reviews.slice(0, 3);

  /* WhatsApp booking link */
  const WA_LINK = `https://wa.me/${driverConfig.whatsapp}?text=${encodeURIComponent(
    'Hello! I want to book a Ladakh taxi tour. Please share availability and rates.'
  )}`;

  return (
    <PageWrapper>
      {/* ===================== HERO ===================== */}
      <section className="hero">
        {/* Real photo background with light overlay */}
        <div className="hero-bg-photo" aria-hidden="true" />

        <div className="container">
          <div className="hero-grid">
            {/* Left column — copy */}
            <div>
              <FadeUp delay={0.05}>
                <div className="hero-eyebrow-group">
                  <span className="tag tag-blue">✦ Leh, Ladakh</span>
                  <span className="tag tag-green">✓ {driverConfig.safeExpeditionsCount} Safe Expeditions</span>
                </div>
              </FadeUp>

              <FadeUp delay={0.12}>
                <h1 className="hero-h1">
                  Ladakh's Most<br />
                  <em>Trusted</em> High-<br />
                  Altitude Driver
                </h1>
              </FadeUp>

              <FadeUp delay={0.18}>
                <p className="hero-lead">
                  {driverConfig.drivingExperienceYears} years navigating Ladakh's legendary passes — Khardung La,
                  Umling La, Chang La. Your safety, comfort, and memories are our
                  only mission.
                </p>
              </FadeUp>

              <FadeUp delay={0.24}>
                <div className="hero-actions">
                  <Link to="/tours" className="btn btn-gold btn-lg">
                    Explore Tour Packages
                  </Link>
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg">
                    {/* WhatsApp icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.412A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.073-1.115l-.29-.174-3.012.854.853-2.936-.19-.302A8 8 0 1112 20z" />
                    </svg>
                    WhatsApp Us
                  </a>
                </div>
              </FadeUp>

              <FadeUp delay={0.3}>
                <div className="hero-stats-row">
                  {[
                    { num: driverConfig.drivingExperienceYears, label: 'Years Experience' },
                    { num: driverConfig.safeExpeditionsCount, label: 'Safe Expeditions' },
                    { num: `${avgRating}★`, label: 'Average Rating' },
                    { num: '19,024', label: "World's Highest Pass (ft)" },
                  ].map(({ num, label }) => (
                    <div key={label}>
                      <div className="hero-stat-num">{num}</div>
                      <div className="hero-stat-label">{label}</div>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>

            {/* Right column — driver card */}
            <FadeUp delay={0.2}>
              <div className="driver-card">
                {/* Driver avatar */}
                <div className="driver-avatar-wrap">
                  <img
                    src={driverConfig.profileImage || "/images/driver.jpg"}
                    alt={driverConfig.driverName}
                    className="driver-avatar"
                    onError={(e) => {
                      /* Fallback to initials if image not uploaded yet */
                      const t = e.currentTarget;
                      t.style.display = 'none';
                      const sib = t.nextElementSibling as HTMLElement;
                      if (sib) sib.style.display = 'flex';
                    }}
                  />
                  {/* Initials fallback — hidden by default */}
                  <div
                    style={{
                      display: 'none',
                      width: '100%', height: '100%',
                      borderRadius: '50%',
                      background: 'var(--surface-2)',
                      border: '2px solid var(--gold)',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '2rem', fontWeight: 700, color: 'var(--gold)'
                    }}
                  >
                    {driverConfig.driverName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="driver-verified-dot" title="Verified Driver">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>

                <div className="driver-name">{driverConfig.driverName}</div>
                <div className="driver-title">⛰️ {driverConfig.tagline}</div>

                {/* Feature checklist */}
                <ul className="driver-checklist">
                  {(driverConfig.safetyFeatures || []).map((item: string) => (
                    <li key={item}>
                      <span className="check-green">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* CTA buttons */}
                <div className="driver-card-actions">
                  <Link to="/reviews" className="btn btn-outline btn-sm">
                    Read Reviews
                  </Link>
                  <Link to="/contact" className="btn btn-gold btn-sm">
                    Book a Tour
                  </Link>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ===================== TOUR PREVIEW ===================== */}
      <section className="section-py section-bg-logo-watermark" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="container">
          <FadeUp>
            <span className="section-eyebrow">Popular Routes</span>
            <h2 className="section-h2">Curated Ladakh<br />Tour Packages</h2>
            <p className="section-lead" style={{ marginBottom: 48 }}>
              Every itinerary is crafted from {driverConfig.drivingExperienceYears} years of local expertise. Flexible
              dates, transparent pricing, zero hidden charges.
            </p>
          </FadeUp>

          <div className="tours-grid">
            {previewTours.map((tour, i) => (
              <motion.div
                key={tour.id}
                className="tour-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="tour-card-head">
                  <div className="tour-tags">
                    <span className="tag tag-gold">{tour.badge}</span>
                    <span className={`tag ${diffColor[tour.difficulty]}`}>{tour.difficulty}</span>
                  </div>
                  <div className="tour-title">{tour.title}</div>
                  <div className="tour-meta">
                    <span className="tour-meta-item">⏱ {tour.duration}</span>
                    <span className="tour-meta-item">⛰ {tour.maxAltitude}</span>
                  </div>
                </div>
                <div className="tour-card-body">
                  <p className="tour-overview">{tour.overview.slice(0, 160)}…</p>
                  <div className="tour-price-row">
                    <div>
                      <div className="tour-price">{tour.priceEstimate}</div>
                      <div className="tour-price-label">per vehicle (all-inclusive)</div>
                    </div>
                  </div>
                </div>
                <div className="tour-card-foot">
                  <Link to="/tours" className="btn btn-gold btn-sm">View Details</Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/tours" className="btn btn-outline">See All Tour Packages →</Link>
          </div>
        </div>
      </section>

      {/* ===================== MINI REVIEWS ===================== */}
      {/* Reviews section gets prayer flags background */}
      <section className="section-py section-bg-photo section-bg-flags" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <FadeUp>
            <span className="section-eyebrow">Client Stories</span>
            <h2 className="section-h2">What Travellers Say</h2>
          </FadeUp>

          <div className="reviews-grid-home">
            {previewReviews.map((r, i) => (
              <motion.div
                key={r.id}
                className="review-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="review-top">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">{r.name.charAt(0)}</div>
                    <div>
                      <div className="reviewer-name">{r.name} {r.verified && <span className="tag tag-green" style={{ fontSize: '0.65rem', padding: '2px 7px' }}>✓ Verified</span>}</div>
                      <div className="reviewer-meta">{r.origin}</div>
                    </div>
                  </div>
                  <div>
                    <Stars rating={r.rating} size="sm" />
                    <div className="rating-num">{r.rating}.0 / 5</div>
                  </div>
                </div>
                <p className="review-text">"{r.review.slice(0, 220)}…"</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  {new Date(r.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} · {r.route}
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/reviews" className="btn btn-gold">Read All Reviews & Share Yours →</Link>
          </div>
        </div>
      </section>

      {/* ===================== SAFETY TRUST STRIP ===================== */}
      <section className="section-py section-bg-logo-watermark">
        <div className="container">
          <FadeUp>
            <span className="section-eyebrow">Why Trust Us</span>
            <h2 className="section-h2">Safety Is Our<br />Sacred Commitment</h2>
          </FadeUp>

          <div className="safety-grid-home">
            {[
              { icon: '🫁', title: 'Medical O₂ On-Board', desc: 'Portable oxygen cylinder and pulse-oximeter for altitude sickness management.' },
              { icon: '🏔️', title: `${driverConfig.drivingExperienceYears} Years Local Expertise`, desc: 'Every road, every season — from June green valleys to February frozen Zanskar.' },
              { icon: '📜', title: 'Taxi Union Licensed', desc: 'Fully registered under All Ladakh Tour Operators Union. Fair govt. tariffs.' },
              { icon: '❄️', title: 'Snow Chain Equipped', desc: 'Heavy-duty chains for Khardung La, Chang La, and Umling La year-round.' },
              { icon: '🔐', title: 'ILP Permit Assistance', desc: 'We handle all Inner Line Permits and restricted area documentation.' },
              { icon: '🛡️', title: 'Mechanically Inspected', desc: 'Full service and mechanical check before every expedition departs.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="about-safety-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="about-safety-icon" style={{ fontSize: '1.4rem' }}>{item.icon}</div>
                <div>
                  <div className="about-safety-title">{item.title}</div>
                  <div className="about-safety-desc">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA FOOTER ===================== */}
      <section className="section-py-sm section-bg-logo-watermark" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-h2" style={{ marginBottom: 14 }}>
              Ready for Your<br /><em style={{ fontStyle: 'italic', color: 'var(--blue)' }}>Ladakh Adventure?</em>
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
              Contact us today to plan your custom itinerary. We reply within 2 hours on WhatsApp.
            </p>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-gold btn-lg">Book Your Tour</Link>
              <Link to="/gallery" className="btn btn-outline btn-lg">View Gallery</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          © {new Date().getFullYear()} Ladakh Wayfarers — {driverConfig.driverName} ·{' '}
          <a href={`tel:${driverConfig.phone}`} style={{ color: 'var(--text-muted)' }}>{driverConfig.phone}</a>
        </div>
      </footer>
    </PageWrapper>
  );
}
