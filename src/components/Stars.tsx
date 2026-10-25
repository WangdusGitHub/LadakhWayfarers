/* ==========================================================
   Stars.tsx — Star rating display component
   Used in review cards and trust scorecard
   ========================================================== */
import React from 'react';

interface StarsProps {
  rating: number;      /* 1 – 5, supports .5 halves */
  size?: 'sm' | 'md' | 'lg';
}

export default function Stars({ rating, size = 'md' }: StarsProps) {
  const sizePx = { sm: '0.8rem', md: '1rem', lg: '1.4rem' }[size];

  return (
    <div className="stars" style={{ fontSize: sizePx }} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => {
        let cls = 'star';
        if (rating >= n) cls += ' filled';
        else if (rating >= n - 0.5) cls += ' half';
        return (
          <span key={n} className={cls} aria-hidden="true">★</span>
        );
      })}
    </div>
  );
}
