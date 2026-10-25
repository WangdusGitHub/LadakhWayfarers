/* ==========================================================
   App.tsx — Root router with page transitions using
   Framer Motion AnimatePresence and live DataProvider
   ========================================================== */
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { DataProvider } from './context/DataContext';

/* Layout */
import Nav from './components/Nav';
import Fab from './components/Fab';

/* Pages */
import Home from './pages/Home';
import About from './pages/About';
import Tours from './pages/Tours';
import Reviews from './pages/Reviews';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

/* AnimatePresence requires location key inside BrowserRouter */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"          element={<Home />} />
        <Route path="/about"     element={<About />} />
        <Route path="/tours"     element={<Tours />} />
        <Route path="/reviews"   element={<Reviews />} />
        <Route path="/gallery"   element={<Gallery />} />
        <Route path="/contact"   element={<Contact />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        {/* Persistent navigation across all pages */}
        <Nav />

        {/* Page content with transitions */}
        <AnimatedRoutes />

        {/* Floating WhatsApp / Call buttons */}
        <Fab />
      </BrowserRouter>
    </DataProvider>
  );
}
