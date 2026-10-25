/* ==========================================================
   Root entry point for Ladakh Wayfarers React app
   Sets up global CSS, React rendering, StrictMode
   ========================================================== */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
