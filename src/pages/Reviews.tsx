/* ==========================================================
   Reviews.tsx — Core trust page with:
   - Trust scorecard (aggregate rating + breakdown bars)
   - Filterable, searchable review grid with helpful votes
   - Review submission form → Direct save to MongoDB database
   — Data fetched live from MongoDB via DataContext
   ========================================================== */
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import Stars from '../components/Stars';
import { ReviewFormData, Review } from '../types';
import { uploadPhoto } from '../services/apiService';
import { useData } from '../context/DataContext';

/* ---- Star labels ---- */
const STAR_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

/* ---- Compute breakdown bars from reviews ---- */
function getRatingBreakdown(reviews: Review[]) {
  const counts = [0, 0, 0, 0, 0]; // index 0 = 1 star, index 4 = 5 stars
  reviews.forEach((r) => {
    const idx = Math.round(r.rating) - 1;
    if (idx >= 0 && idx < 5) counts[idx]++;
  });
  return counts.reverse(); // 5→1 for display
}

export default function Reviews() {
  /* Live data from DataContext (MongoDB) */
  const { reviews, setReviews: _setReviews, driverConfig, tours, isLoading: loading, addReview, upvoteReview } = useData() as any;

  const [newId, setNewId] = useState<string | null>(null);

  /* Filter / search */
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  /* Pagination — show 3 at a time, reset when filter/search changes */
  const [visibleCount, setVisibleCount] = useState(3);

  /* Scroll-to-form helper */
  const scrollToForm = () => {
    document.getElementById('write-review-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* Helpful votes (persisted per session) */
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  /* ---------- Form state ---------- */
  const [form, setForm] = useState<ReviewFormData>({
    name: '', email: '', origin: '', route: '',
    rating: 5, date: new Date().toISOString().split('T')[0], review: '', photoUrl: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hoverStar, setHoverStar] = useState(0);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  /* ---------- Aggregate stats ---------- */
  const totalReviews = reviews.length;
  const avgRating = reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / (totalReviews || 1);
  const breakdown = getRatingBreakdown(reviews);

  /* ---------- Filtered reviews (all matching) ---------- */
  const filteredReviews = reviews.filter((r: Review) => {
    const matchRating = filterRating === 'all' || Math.round(r.rating) === filterRating;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.review.toLowerCase().includes(q) || r.route.toLowerCase().includes(q);
    return matchRating && matchSearch;
  });

  /* Only show `visibleCount` reviews */
  const visibleReviews = filteredReviews.slice(0, visibleCount);
  const hasMore = visibleCount < filteredReviews.length;

  /* Reset to 3 whenever filter or search changes */
  const handleSetFilter = (val: number | 'all') => {
    setFilterRating(val);
    setVisibleCount(3);
  };
  const handleSetSearch = (val: string) => {
    setSearchQuery(val);
    setVisibleCount(3);
  };

  /* ---------- Helpful vote handler ---------- */
  const handleHelpful = (id: string) => {
    if (votedIds.has(id)) return;
    upvoteReview(id);
    setVotedIds((prev) => new Set(prev).add(id));
  };

  /* ---------- Photo upload handler ---------- */
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    /* Show local preview immediately */
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* ---------- Form submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate fields with clear user feedback
    const errs: { [key: string]: string } = {};
    if (!form.name.trim()) errs.name = 'Please enter your name.';
    if (!form.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Please enter a valid email address (e.g. yourname@example.com).';
    }
    if (!form.review.trim()) {
      errs.review = 'Please write a few words about your journey.';
    } else if (form.review.trim().length < 10) {
      errs.review = `Please write at least 10 characters (currently ${form.review.trim().length}).`;
    }
    if (form.rating < 1) {
      errs.rating = 'Please choose a star rating (1 to 5 stars).';
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setFormErrors({});
    setSubmitting(true);
    setUploadProgress(20);

    let photoUrl = '';
    /* Upload photo to Cloudinary via /api/upload if selected */
    if (photoFile) {
      setUploadProgress(40);
      try {
        photoUrl = await uploadPhoto(photoFile);
      } catch {
        console.warn('Photo upload failed, continuing without photo.');
      }
    }

    setUploadProgress(70);
    const fullForm: ReviewFormData = { ...form, photoUrl };

    try {
      /* Save review directly to MongoDB via DataContext → /api/reviews */
      const newReview = await addReview(fullForm);
      setUploadProgress(95);

      setNewId(newReview.id);

      setUploadProgress(100);
      setShowSuccess(true);

      /* Reset form */
      setForm({
        name: '', email: '', origin: '', route: '',
        rating: 5, date: new Date().toISOString().split('T')[0], review: '', photoUrl: '',
      });
      setPhotoFile(null);
      setPhotoPreview('');
      setUploadProgress(0);
      setHoverStar(0);
      setFormErrors({});
    } catch (err: any) {
      console.error('Failed to submit review:', err);
      setSubmitError(err?.message || 'Unable to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      {/* ===================== PAGE HERO ===================== */}
      <section className="section-py" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <span className="section-eyebrow">Verified Reviews</span>
                <h1 className="section-h2">Travellers Who Trusted<br />Their Journey With Us</h1>
                <p className="section-lead">
                  Every review is from a real traveller. Your safety and satisfaction is our
                  reputation — earned across {driverConfig.safeExpeditionsCount} expeditions.
                </p>
              </div>
              {/* Write a Review CTA — scrolls to the form below */}
              <div style={{ flexShrink: 0, paddingTop: 8 }}>
                <button
                  className="btn btn-gold btn-lg"
                  onClick={scrollToForm}
                  id="write-review-cta-btn"
                  aria-label="Scroll to review form"
                >
                  ✦ Write a Review
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== TRUST SCORECARD ===================== */}
      <section className="section-py-sm">
        <div className="container">
          <motion.div
            className="trust-scorecard"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            {/* Big average score */}
            <div className="trust-score-big">
              <div className="trust-num">{avgRating.toFixed(1)}</div>
              <div className="trust-stars-row">
                <Stars rating={avgRating} size="lg" />
              </div>
              <div className="trust-reviews-count">{totalReviews} verified reviews</div>
            </div>

            {/* Breakdown bars 5→1 */}
            <div className="breakdown-bars">
              {breakdown.map((count, i) => {
                const starLabel = 5 - i;
                const pct = totalReviews ? (count / totalReviews) * 100 : 0;
                return (
                  <div
                    className="bar-row"
                    key={starLabel}
                    onClick={() => setFilterRating(filterRating === starLabel ? 'all' : starLabel)}
                    style={{ cursor: 'pointer' }}
                    title={`Click to filter by ${starLabel}★ reviews`}
                  >
                    <span className="bar-label">{starLabel}★</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="bar-count">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* Trust badges */}
            <div className="trust-badges">
              {[
                { emoji: '🛡️', title: 'Verified Travellers', desc: 'All reviewers confirmed real bookings' },
                { emoji: '🌏', title: 'International Guests', desc: 'Germany, UK, USA, Australia & more' },
                { emoji: '0️⃣', title: 'Zero Disputes', desc: 'No refund or safety complaints ever' },
              ].map((b) => (
                <div key={b.title} className="trust-badge-item">
                  <span className="trust-badge-emoji">{b.emoji}</span>
                  <div>
                    <div className="trust-badge-title">{b.title}</div>
                    <div className="trust-badge-desc">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== REVIEWS GRID ===================== */}
      <section className="section-py">
        <div className="container">
          {/* Toolbar — filter chips + search */}
          <div className="reviews-toolbar">
            <div className="filter-chips">
              <button
                className={`filter-chip${filterRating === 'all' ? ' active' : ''}`}
                onClick={() => handleSetFilter('all')}
              >
                All Reviews
              </button>
              {[5, 4, 3, 2, 1].map((n) => (
                <button
                  key={n}
                  className={`filter-chip${filterRating === n ? ' active' : ''}`}
                  onClick={() => handleSetFilter(n === filterRating ? 'all' : n)}
                >
                  {n}★
                </button>
              ))}
            </div>
            <div className="search-wrap">
              <span className="search-icon" aria-hidden="true">🔍</span>
              <input
                className="search-input"
                type="search"
                placeholder="Search reviews…"
                value={searchQuery}
                onChange={(e) => handleSetSearch(e.target.value)}
                aria-label="Search reviews"
              />
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              Loading reviews…
            </div>
          ) : (
            <>
            <div className="reviews-grid">
              <AnimatePresence>
                {visibleReviews.map((r: Review, i: number) => (
                  <motion.div
                    key={r.id}
                    className={`review-card${r.id === newId ? ' new-highlight' : ''}`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.4) }}
                    layout
                  >
                    {/* Top row — reviewer info + stars */}
                    <div className="review-top">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">{r.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="reviewer-name">
                            {r.name}
                            {r.verified && (
                              <span className="tag tag-green" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>✓ Verified</span>
                            )}
                          </div>
                          <div className="reviewer-meta">{r.origin} · {new Date(r.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Stars rating={r.rating} size="sm" />
                        <div className="rating-num">{r.rating}.0 / 5</div>
                      </div>
                    </div>

                    {/* Route badge */}
                    <div className="route-badge">
                      📍 {r.route}
                    </div>

                    {/* Review text */}
                    <p className="review-text">"{r.review}"</p>

                    {/* Optional photo */}
                    {r.photoUrl && (
                      <div className="review-photo">
                        <img src={r.photoUrl} alt={`Photo by ${r.name}`} loading="lazy" />
                      </div>
                    )}

                    {/* Driver reply */}
                    {r.driverReply && (
                      <div className="driver-reply">
                        <div className="driver-reply-badge">🚗 Driver's Reply</div>
                        <div className="driver-reply-text">{r.driverReply}</div>
                      </div>
                    )}

                    {/* Footer — helpful vote + vehicle */}
                    <div className="review-footer">
                      <button
                        className={`helpful-btn${votedIds.has(r.id) ? ' voted' : ''}`}
                        onClick={() => handleHelpful(r.id)}
                        disabled={votedIds.has(r.id)}
                        aria-label={`Mark as helpful. ${r.helpfulCount} people found this helpful`}
                      >
                        👍 Helpful ({r.helpfulCount})
                      </button>
                      <span className="vehicle-tag">🚙 {r.vehicle}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredReviews.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  No reviews match your search or filter.{' '}
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ marginLeft: 8 }}
                    onClick={() => { handleSetFilter('all'); handleSetSearch(''); }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* Show More / count indicator */}
            {filteredReviews.length > 0 && (
              <div className="show-more-row">
                <span className="show-more-count">
                  Showing {Math.min(visibleCount, filteredReviews.length)} of {filteredReviews.length} reviews
                </span>
                {hasMore && (
                  <motion.button
                    className="btn-show-more"
                    onClick={() => setVisibleCount((v) => v + 3)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    id="show-more-reviews-btn"
                  >
                    Show More Reviews
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 6 }}>
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.button>
                )}
                {!hasMore && filteredReviews.length > 3 && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setVisibleCount(3)}
                  >
                    Show Less
                  </button>
                )}
              </div>
            )}
            </>
          )}
        </div>
      </section>

      {/* ===================== REVIEW FORM ===================== */}
      {/* id used by the Write a Review button above to smooth-scroll here */}
      <section id="write-review-section" className="section-py" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div ref={formRef}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <span className="section-eyebrow">Share Your Experience</span>
                <h2 className="section-h2" style={{ marginBottom: 12 }}>Travelled With Us?</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: 540, margin: '0 auto' }}>
                  Your review is saved directly to our system and published here with a verified badge.
                  It helps future travellers make the right choice for their Himalayan journey.
                </p>
              </div>

              <div className="review-form-wrap" style={{ maxWidth: 720, margin: '0 auto' }}>
                <form onSubmit={handleSubmit} noValidate>
                  {/* Global Submit Error Banner */}
                  {submitError && (
                    <div style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      color: '#ef4444',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 20,
                      fontSize: '0.88rem'
                    }}>
                      ⚠️ {submitError}
                    </div>
                  )}

                  {/* Star picker */}
                  <div style={{ textAlign: 'center', marginBottom: 12 }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: 8 }}>Your Rating</label>
                    <div className="star-picker">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          className={`star-pick-btn${form.rating >= n || hoverStar >= n ? ' active' : ''}`}
                          onMouseEnter={() => setHoverStar(n)}
                          onMouseLeave={() => setHoverStar(0)}
                          onClick={() => {
                            setForm((f) => ({ ...f, rating: n }));
                            setFormErrors((prev) => ({ ...prev, rating: '' }));
                          }}
                          aria-label={`Rate ${n} out of 5 — ${STAR_LABELS[n]}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    {(hoverStar || form.rating) > 0 && (
                      <div className="star-pick-label">{STAR_LABELS[hoverStar || form.rating]}</div>
                    )}
                    {formErrors.rating && <div className="field-error-msg">{formErrors.rating}</div>}
                  </div>

                  {/* Name + Email */}
                  <div className="form-2col" style={{ marginBottom: 16 }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="rev-name">Your Name *</label>
                      <input
                        id="rev-name"
                        className="form-control"
                        type="text"
                        placeholder="e.g. Priya Sharma"
                        required
                        value={form.name}
                        style={formErrors.name ? { borderColor: '#ef4444' } : undefined}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, name: e.target.value }));
                          if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: '' }));
                        }}
                      />
                      {formErrors.name && <div className="field-error-msg">{formErrors.name}</div>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="rev-email">Email Address *</label>
                      <input
                        id="rev-email"
                        className="form-control"
                        type="email"
                        placeholder="e.g. priya@example.com"
                        required
                        value={form.email}
                        style={formErrors.email ? { borderColor: '#ef4444' } : undefined}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, email: e.target.value }));
                          if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: '' }));
                        }}
                      />
                      {formErrors.email && <div className="field-error-msg">{formErrors.email}</div>}
                    </div>
                  </div>

                  {/* Origin + Route */}
                  <div className="form-2col" style={{ marginBottom: 16 }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="rev-origin">Where are you from?</label>
                      <input
                        id="rev-origin"
                        className="form-control"
                        type="text"
                        placeholder="e.g. Mumbai, Maharashtra"
                        value={form.origin}
                        onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="rev-route">Tour / Route Taken</label>
                      <select
                        id="rev-route"
                        className="form-control"
                        value={form.route}
                        onChange={(e) => setForm((f) => ({ ...f, route: e.target.value }))}
                      >
                        <option value="">— Select tour —</option>
                        {tours.map((t: any) => (
                          <option key={t.id} value={t.title}>{t.title}</option>
                        ))}
                        <option value="Custom Ladakh Tour">Custom / Other Tour</option>
                      </select>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="form-label" htmlFor="rev-date">Travel Date</label>
                    <input
                      id="rev-date"
                      className="form-control"
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      value={form.date}
                      onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    />
                  </div>

                  {/* Review text */}
                  <div className="form-group" style={{ marginBottom: 20 }}>
                    <label className="form-label" htmlFor="rev-text">Your Review *</label>
                    <textarea
                      id="rev-text"
                      className="form-control"
                      rows={5}
                      placeholder="Share your experience — what made this journey special? How was the safety, driving, and service?"
                      required
                      value={form.review}
                      style={{
                        resize: 'vertical',
                        ...(formErrors.review ? { borderColor: '#ef4444' } : {})
                      }}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, review: e.target.value }));
                        if (formErrors.review) setFormErrors((prev) => ({ ...prev, review: '' }));
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', marginTop: 4 }}>
                      <span style={{ color: form.review.trim().length >= 10 ? '#10b981' : 'var(--text-dim)' }}>
                        {form.review.trim().length >= 10
                          ? `✓ Ready to submit (${form.review.trim().length} characters)`
                          : `${form.review.trim().length} / 10 min characters`}
                      </span>
                      {formErrors.review && (
                        <span className="field-error-msg" style={{ marginTop: 0 }}>{formErrors.review}</span>
                      )}
                    </div>
                  </div>

                  {/* Photo upload */}
                  <div className="form-group" style={{ marginBottom: 28 }}>
                    <label className="form-label">Add a Travel Photo (optional)</label>
                    <div className="upload-box">
                      <input
                        type="file"
                        className="upload-input"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        aria-label="Upload travel photo"
                      />
                      <div className="upload-icon">📷</div>
                      <div className="upload-text">Click or drag a photo here</div>
                      <div className="upload-hint">JPEG, PNG, WebP · Max 5MB</div>
                    </div>

                    {/* Photo preview */}
                    {photoPreview && (
                      <div className="photo-preview-row">
                        <img src={photoPreview} alt="Preview" className="photo-thumb" />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{photoFile?.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            {photoFile ? (photoFile.size / 1024).toFixed(0) : '0'} KB
                          </div>
                        </div>
                        <button
                          type="button"
                          style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1.2rem' }}
                          onClick={() => { setPhotoFile(null); setPhotoPreview(''); }}
                          aria-label="Remove photo"
                        >×</button>
                      </div>
                    )}

                    {/* Upload progress bar */}
                    {submitting && uploadProgress > 0 && (
                      <div className="progress-bar-wrap">
                        <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="submit-row">
                    <button
                      type="submit"
                      className="btn btn-gold btn-lg"
                      disabled={submitting}
                      style={{ width: '100%', maxWidth: 360 }}
                      id="submit-review-btn"
                    >
                      {submitting ? 'Submitting Review…' : '✦ Submit Review'}
                    </button>
                    <p className="submit-note">
                      Your review will be saved directly and published with a verified badge. Email is never shown publicly.
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          © {new Date().getFullYear()} Ladakh Wayfarers — {driverConfig.driverName}
        </div>
      </footer>

      {/* ===================== SUCCESS MODAL ===================== */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              className="success-modal-box"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="success-icon">🎉</div>
              <div className="success-title">Julley! Review Published</div>
              <p className="success-desc">
                Your review has been saved successfully and is now live on the page
                with a <strong>Verified Traveller</strong> badge.
                Thank you for helping future adventurers!
              </p>
              <button className="btn btn-gold" onClick={() => setShowSuccess(false)}>
                View My Review
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
