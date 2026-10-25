/* ==========================================================
   About.tsx — Driver biography, safety features, vehicles,
   certifications, and local expertise section
   ========================================================== */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import { useData } from '../context/DataContext';

/* ---- Reusable fade-up animation ---- */
const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

/* Safety & Trust items */
const SAFETY_ITEMS = [
  { icon: '🫁', title: 'Medical O₂ Cylinder', desc: 'Grade-A portable oxygen on every trip. Altitude sickness response in minutes.' },
  { icon: '📊', title: 'Pulse-Oximeter', desc: 'Continuous SpO₂ monitoring for all passengers above 12,000 ft.' },
  { icon: '❄️', title: 'Snow Chains', desc: 'Heavy-duty chains pre-installed for Khardung La, Chang La, Umling La.' },
  { icon: '🔥', title: 'Dual Cabin Heat', desc: 'Independent rear passenger heating for subzero mountain mornings.' },
  { icon: '📜', title: 'Union Licensed', desc: 'Registered under All Ladakh Tour Operators Union. Govt. fair tariff.' },
  { icon: '🗺️', title: 'ILP Assistance', desc: 'Inner Line Permit and restricted area documentation handled for you.' },
];

/* Vehicle specs */
const VEHICLES = [
  {
    name: 'Toyota Innova Crysta 2.8 ZX',
    type: 'Primary · Luxury AC',
    specs: ['6+1 seating', 'Dual AC zones', 'Rear USB fast-charge', 'Premium suspension tuned for mountain roads'],
    icon: '🚙',
  },
  {
    name: 'Mahindra Scorpio 4WD N',
    type: 'Extreme Terrain',
    specs: ['Full-time 4WD with low-range', 'Ground clearance 210 mm', 'Zanskar river crossings ready', 'Reinforced underbody skid plates'],
    icon: '🚐',
  },
];

/* Timeline milestones */
const TIMELINE = [
  { year: '2012', title: 'First Licensed Drive', desc: 'Received All Ladakh Taxi Union license and completed first solo Manali–Leh expedition.' },
  { year: '2015', title: '100th Expedition', desc: 'Crossed the milestone of 100 successful trips covering Nubra, Pangong, and Zanskar.' },
  { year: '2018', title: 'First Umling La Descent', desc: "Completed one of Ladakh's first tourist drives to 19,024 ft immediately after road completion by BRO." },
  { year: '2022', title: 'Medical O₂ Initiative', desc: 'Self-funded onboard medical oxygen kit after witnessing a tourist altitude emergency at Chang La.' },
  { year: '2026', title: `650+ Safe Expeditions`, desc: 'Zero accidents, zero emergency evacuations. 4.9-star average across all platforms.' },
];

export default function About() {
  const { driverConfig, reviews } = useData();

  /* Live computed average rating — stays in sync with the Reviews page */
  const avgRating = reviews.length
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—';
  return (
    <PageWrapper>
      {/* ===================== PAGE HERO ===================== */}
      <section className="section-py" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <FadeUp>
            <span className="section-eyebrow">About the Driver</span>
            <h1 className="section-h2">The Man Who Knows<br />Every Mountain Road</h1>
            <p className="section-lead">
              Born and raised in Leh, {driverConfig.driverName} has spent over a decade
              navigating Ladakh's extreme terrain — from flowering Sham Valley to the
              world's highest motorable pass at 19,024 ft.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ===================== DRIVER STORY ===================== */}
      <section className="section-py">
        <div className="container">
          <div className="about-grid">
            {/* Left — photo */}
            <FadeUp delay={0.1}>
              <div className="about-image-wrap">
                <img
                  src={driverConfig.profileImage || "/images/driver.jpg"}
                  alt={`${driverConfig.driverName} — Ladakh taxi driver`}
                  className="about-image-main"
                  onError={(e) => {
                    /* Replace with gradient placeholder if image not yet uploaded */
                    e.currentTarget.style.background = 'linear-gradient(135deg, var(--surface-2), var(--surface))';
                    e.currentTarget.removeAttribute('src');
                  }}
                />
                <div className="about-exp-badge">
                  <div className="about-exp-num">{driverConfig.drivingExperienceYears}</div>
                  <div className="about-exp-label">Years on<br />Ladakh Roads</div>
                </div>
              </div>
            </FadeUp>

            {/* Right — story text */}
            <FadeUp delay={0.15}>
              <div>
                <span className="section-eyebrow">His Story</span>
                <h2 className="about-h2">Born in the<br />Land of High Passes</h2>

                <p className="about-p">
                  {driverConfig.driverName} was born in Leh to a family of nomadic herders. Growing
                  up watching traders cross the Khardung La on horseback, he developed an intimate
                  relationship with Ladakh's high-altitude terrain before ever learning to drive.
                </p>
                <p className="about-p">
                  Since earning his professional license in 2012, he has completed over{' '}
                  {driverConfig.safeExpeditionsCount} expeditions without a single accident or
                  emergency evacuation — a record he attributes to methodical pre-trip vehicle
                  checks, conservative speed at passes, and carrying emergency medical equipment.
                </p>
                <p className="about-p">
                  He speaks Hindi, English, Ladakhi, and basic German — enough to make
                  international travellers feel genuinely at home across Himalayan wilderness.
                </p>

                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 28 }}>
                  <span className="tag tag-gold">✦ {driverConfig.taxiUnionReg}</span>
                  <span className="tag tag-green">✓ Mountain First Aid Trained</span>
                </div>

                {/* Key numbers */}
                <div className="about-stats-grid">
                  {[
                    { num: driverConfig.safeExpeditionsCount, label: 'Expeditions' },
                    { num: `${avgRating}★`, label: 'Avg. Rating' },
                    { num: '0', label: 'Accidents' },
                  ].map(({ num, label }) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', color: 'var(--gold)' }}>{num}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ===================== SAFETY GRID ===================== */}
      <section className="section-py" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <FadeUp>
            <span className="section-eyebrow">Safety First</span>
            <h2 className="section-h2">Why Passengers<br />Travel Worry-Free</h2>
          </FadeUp>

          <div className="about-safety-grid">
            {SAFETY_ITEMS.map((item, i) => (
              <motion.div
                key={item.title}
                className="about-safety-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
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

      {/* ===================== VEHICLES ===================== */}
      <section className="section-py">
        <div className="container">
          <FadeUp>
            <span className="section-eyebrow">Fleet</span>
            <h2 className="section-h2">Vehicles Built for<br />Himalayan Roads</h2>
          </FadeUp>

          <div className="vehicles-grid">
            {VEHICLES.map((v, i) => (
              <motion.div
                key={v.name}
                className="card card-hover vehicle-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.12 }}
              >
                <div className="vehicle-icon">{v.icon}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{v.type}</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', marginBottom: 20 }}>{v.name}</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {v.specs.map((s) => (
                    <li key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px', lineHeight: 1 }}>→</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== JOURNEY TIMELINE ===================== */}
      <section className="section-py" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <FadeUp>
            <span className="section-eyebrow">Career Journey</span>
            <h2 className="section-h2">Milestones on<br />the Mountain Road</h2>
          </FadeUp>

          <div className="timeline" style={{ maxWidth: 680, margin: '48px auto 0' }}>
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.year}
                className="timeline-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
              >
                <div className="timeline-dot">{i + 1}</div>
                <div className="timeline-day">{item.year}</div>
                <div className="timeline-title">{item.title}</div>
                <div className="timeline-desc">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="section-py-sm" style={{ borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div className="container">
          <FadeUp>
            <h2 className="section-h2" style={{ marginBottom: 16 }}>Ride with Confidence</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
              Join hundreds of travellers who've explored Ladakh safely with {driverConfig.driverName}.
            </p>
            <div className="cta-actions">
              <Link to="/tours" className="btn btn-gold btn-lg">Browse Tour Packages</Link>
              <Link to="/reviews" className="btn btn-outline btn-lg">Read Reviews</Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          © {new Date().getFullYear()} Ladakh Wayfarers — {driverConfig.driverName}
        </div>
      </footer>
    </PageWrapper>
  );
}
