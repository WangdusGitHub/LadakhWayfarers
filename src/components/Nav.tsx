/* ==========================================================
   Nav.tsx — Sticky top navigation with scroll behaviour,
   active link detection, and mobile hamburger drawer
   ========================================================== */
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const LINKS = [
  { to: '/',        label: 'Home' },
  { to: '/about',   label: 'About' },
  { to: '/tours',   label: 'Tours' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reviews', label: 'Reviews' },
];

export default function Nav() {
  const { driverConfig } = useData();
  /* Track scroll position to add background blur */
  const [scrolled, setScrolled] = useState(false);
  /* Mobile drawer state */
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close drawer on route change */
  const closeDrawer = () => setOpen(false);

  return (
    <>
      {/* Prayer flags strip — decorative top border */}
      <div className="flags-strip" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>

      <header className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="container nav-inner">
          {/* Brand */}
          <Link to="/" className="nav-logo" onClick={closeDrawer}>
            <div className="nav-logo-icon" aria-hidden="true">
              <img 
                src="/images/logo.jpg" 
                alt="Ladakh Wayfarers Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14 6l-1-2H5v17h2v-7h5l1 2h7V6h-6zm4 8h-4l-1-2H7V6h5l1 2h5v6z"/></svg>';
                  e.currentTarget.parentElement!.style.background = 'var(--blue)';
                  e.currentTarget.parentElement!.style.color = '#fff';
                }}
              />
            </div>
            <div>
              <div className="nav-brand">{driverConfig.brandName}</div>
              <div className="nav-sub">Premium Taxi Service</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="nav-links">
            {LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  end={to === '/'}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link to="/contact" className="nav-cta">Book Now</Link>
            </li>
          </ul>

          {/* Hamburger — mobile only */}
          <button
            className="nav-hamburger"
            aria-label="Toggle menu"
            onClick={() => setOpen(o => !o)}
          >
            {open ? (
              /* X icon */
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            ) : (
              /* Hamburger icon */
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <nav className={`nav-drawer${open ? ' open' : ''}`}>
        {LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={closeDrawer}
            className={({ isActive }) => isActive ? 'active' : ''}
            end={to === '/'}
          >
            {label}
          </NavLink>
        ))}
        <Link to="/contact" className="btn btn-gold btn-sm" onClick={closeDrawer}>
          Book Now
        </Link>
      </nav>
    </>
  );
}
