/* ==========================================================
   Contact.tsx — Contact page with all contact channels,
   quick enquiry form (sends via WhatsApp), and FAQ section
   ========================================================== */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import { useData } from '../context/DataContext';

/* ---- FAQ items ---- */
const FAQ_ITEMS = [
  {
    q: 'What is the best time to visit Ladakh?',
    a: 'June to September is ideal for most routes including Nubra, Pangong, and Zanskar. Khardung La and Umling La are typically open May to October. Winter (December–February) allows the frozen Zanskar Chadar trek but many passes close.',
  },
  {
    q: 'Do I need permits to visit Ladakh?',
    a: 'Indian nationals need a Permit for Nubra Valley, Pangong Lake, Tso Moriri, and Dah-Hanu. Foreign nationals need an Inner Line Permit (ILP). We handle all permit applications on your behalf as part of every tour package.',
  },
  {
    q: 'What about altitude sickness?',
    a: 'Altitude sickness (AMS) is common above 3,500m. We carry a medical-grade portable oxygen cylinder and a digital pulse-oximeter on every trip. We always recommend one full rest day on arrival in Leh before proceeding higher.',
  },
  {
    q: 'Are your prices fixed or negotiable?',
    a: 'All our rates follow the official All Ladakh Tour Operators Union government tariff — a fixed, regulated, and transparent schedule. There are no hidden charges, no commission detours, and no surprise surcharges.',
  },
  {
    q: 'Can you pick us up from the airport?',
    a: 'Yes, we offer airport transfers to/from Kushok Bakula Rimpochee Airport (IXL) at any time including early morning flights. Just share your flight details in advance.',
  },
  {
    q: 'What vehicles do you operate?',
    a: 'Our primary vehicle is a Toyota Innova Crysta 2.8 ZX (luxury AC, dual heating zones, up to 6+1 passengers). For extreme off-road terrain like Zanskar, we use a Mahindra Scorpio 4WD N with full-time four-wheel drive and high ground clearance.',
  },
  {
    q: 'Can I do a custom itinerary?',
    a: "Absolutely. Our listed packages are starting templates. We're happy to add/remove destinations, extend days, include photography stops, arrange camping, or design completely custom routes based on your interests and budget.",
  },
  {
    q: 'Do you accept solo female travellers?',
    a: 'Yes, and we take extra care. Many of our most celebrated reviews are from solo female travellers who found Ladakh completely safe and welcoming under our guidance. We maintain strict professional conduct at all times.',
  },
];

export default function Contact() {
  /* FAQ open state */
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { driverConfig } = useData();

  /* Quick enquiry form */
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg]     = useState('');

  const sendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const waMsg = `*Julley! Website Enquiry*\n\n*Name:* ${name}\n*Email:* ${email}\n\n*Message:*\n${msg}`;
    window.open(
      `https://wa.me/${driverConfig.whatsapp}?text=${encodeURIComponent(waMsg)}`,
      '_blank', 'noopener,noreferrer'
    );
  };

  return (
    <PageWrapper>
      {/* ===================== PAGE HERO ===================== */}
      <section className="section-py" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="section-eyebrow">Get in Touch</span>
            <h1 className="section-h2">Ready to Plan Your<br />Ladakh Adventure?</h1>
            <p className="section-lead">
              Reach out on WhatsApp for the fastest response — usually within 2 hours.
              We're always happy to plan a custom itinerary just for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===================== CONTACT GRID ===================== */}
      <section className="section-py">
        <div className="container">
          <div className="contact-grid">
            {/* Left — contact info card */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="contact-card">
                {/* Driver */}
                <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%',
                      background: 'var(--gold-dim)', border: '1.5px solid var(--gold)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.3rem', fontWeight: 700, color: 'var(--gold)'
                    }}>{driverConfig.driverName.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
                    <div>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem' }}>{driverConfig.driverName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gold)', fontWeight: 600 }}>⛰️ {driverConfig.tagline}</div>
                    </div>
                  </div>
                </div>

                {/* Contact channels */}
                <ul className="contact-channel-list">
                  <li className="contact-channel">
                    <div className="channel-icon">📱</div>
                    <div>
                      <div className="channel-label">Phone / WhatsApp</div>
                      <div className="channel-value">
                        <a href={`tel:${driverConfig.phone}`} style={{ color: 'inherit' }}>{driverConfig.phone}</a>
                      </div>
                    </div>
                  </li>
                  <li className="contact-channel">
                    <div className="channel-icon">✉️</div>
                    <div>
                      <div className="channel-label">Email</div>
                      <div className="channel-value">
                        <a href={`mailto:${driverConfig.email}`} style={{ color: 'inherit' }}>{driverConfig.email}</a>
                      </div>
                    </div>
                  </li>
                  <li className="contact-channel">
                    <div className="channel-icon">📍</div>
                    <div>
                      <div className="channel-label">Base Location</div>
                      <div className="channel-value" style={{ fontSize: '0.9rem' }}>{driverConfig.baseLocation}</div>
                    </div>
                  </li>
                  <li className="contact-channel">
                    <div className="channel-icon">🪪</div>
                    <div>
                      <div className="channel-label">Registration</div>
                      <div className="channel-value" style={{ fontSize: '0.85rem' }}>{driverConfig.taxiUnionReg}</div>
                    </div>
                  </li>
                </ul>

                {/* Big WhatsApp CTA */}
                <a
                  href={`https://wa.me/${driverConfig.whatsapp}?text=${encodeURIComponent(
                    'Julley! I want to plan a Ladakh taxi tour. Please share your availability.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa"
                  style={{ width: '100%', justifyContent: 'center' }}
                  id="contact-whatsapp-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.412A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.073-1.115l-.29-.174-3.012.854.853-2.936-.19-.302A8 8 0 1112 20z" />
                  </svg>
                  Chat on WhatsApp Now
                </a>

                {/* Response time note */}
                <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: 12 }}>
                  ⚡ Average response time: under 2 hours
                </p>
              </div>
            </motion.div>

            {/* Right — quick enquiry form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="contact-card" style={{ padding: 32 }}>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', marginBottom: 8 }}>
                  Send a Quick Message
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 28 }}>
                  Fill in the form and we'll open WhatsApp with your message pre-filled.
                </p>

                <form onSubmit={sendEnquiry} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-name">Your Name *</label>
                    <input
                      id="contact-name"
                      className="form-control"
                      type="text"
                      required
                      placeholder="e.g. Rajesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-email">Email (for confirmation)</label>
                    <input
                      id="contact-email"
                      className="form-control"
                      type="email"
                      placeholder="e.g. rajesh@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-msg">Message / Tour Request *</label>
                    <textarea
                      id="contact-msg"
                      className="form-control"
                      rows={5}
                      required
                      placeholder="Tell us your tour dates, group size, interests, and any special requirements…"
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-gold" style={{ justifyContent: 'center' }} id="contact-send-btn">
                    Send via WhatsApp →
                  </button>
                </form>

                {/* Trust marks */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
                  {['✓ No spam', '✓ 2-hour reply', '✓ Free consultation'].map((t) => (
                    <span key={t} className="tag tag-green">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="section-py" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span className="section-eyebrow">FAQ</span>
              <h2 className="section-h2">Common Questions</h2>
            </div>
          </motion.div>

          <div className="faq-wrap">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                className={`faq-item${openFaq === i ? ' open' : ''}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  id={`faq-question-${i}`}
                >
                  {item.q}
                  <svg className="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                <div className="faq-answer" role="region" aria-labelledby={`faq-question-${i}`}>
                  <div className="faq-answer-inner">{item.a}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Still have questions? */}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
              Still have a question not covered above?
            </p>
            <a
              href={`https://wa.me/${driverConfig.whatsapp}?text=${encodeURIComponent('Hi! I have a question about booking a Ladakh taxi tour.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa"
            >
              Ask on WhatsApp
            </a>
          </div>
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
