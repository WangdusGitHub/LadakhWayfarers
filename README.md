# 🏔️ Ladakh Wayfarers — Stanzin Jigmet | High-Altitude Tourist Taxi Portfolio

An ultra-modern, high-converting React 19 + TypeScript + Vite web application built for **Stanzin Jigmet** — professional mountain guide and tourist taxi chauffeur in Leh, Ladakh.

Engineered for speed, unshakeable client trust, instant WhatsApp tour inquiries, verified traveler reviews, and automated high-altitude trip booking.

---

## 🌟 Key Features

1. **Client Trust & Review Hub**:
   - 4.9 / 5.0 aggregate rating with verified traveler breakdown bars.
   - Dynamic testimonials synced with **MongoDB Atlas** (`reviews` collection) with instant local cache fallback.
   - Verified traveler review submission form with live photo upload.
   - Thumbs-up helpful counter.

2. **Curated Himalayan Tour Packages**:
   - **5 Days**: Classic Leh & Sham Valley Explorer (Khardung La 17,982 ft).
   - **6-7 Days**: Nubra Valley & Pangong Lake Circuit (Hunder Dunes, Turtuk, Chang La).
   - **7 Days**: Umling La (19,024 ft) & Hanle International Dark Sky Reserve.
   - **9 Days**: Grand Zanskar Valley Wilderness Expedition (Phuktal Gompa & Gumbok Rangan).
   - Day-by-day modal itineraries with direct pre-filled WhatsApp booking links.

3. **High-Altitude Safety & Vehicle Showcase**:
   - On-board Grade-A Medical Portable Oxygen Cylinder (O₂).
   - Continuous digital pulse-oximeter AMS monitoring.
   - Heavy-duty snow chains for Khardung La & Chang La.
   - Fleet specs: **Toyota Innova Crysta 2.8 ZX** (Luxury AC/dual heaters) & **Mahindra Scorpio 4WD N** (High-clearance terrain).

4. **Photo & Video Gallery**:
   - Real high-resolution photography from Pangong, Khardung La, Umling La, Nubra, and Zanskar.
   - Interactive category filtering (High Passes, Lakes, Valleys, Culture, Vehicles).
   - Lightbox image viewer with keyboard navigation.

5. **Direct Chauffeur WhatsApp Integration**:
   - Floating WhatsApp button and quick-call button.
   - Interactive cab fare estimator calculating official Ladakh Taxi Union rates.

---

## 📂 Production Project Structure

```text
Ladakh Wayfarers/
├── .env                         # Server environment secrets (Never commit to Git!)
├── .gitignore                   # Ignores .env, node_modules, dist/
├── README.md                    # Project documentation & deployment guide
├── index.html                   # HTML entry point with OpenGraph & SEO tags
├── package.json                 # Dependencies and npm build/dev scripts
├── pnpm-lock.yaml               # Deterministic pnpm dependency lockfile
├── tsconfig.json                # TypeScript strict configuration
├── vite.config.ts               # Vite bundler configuration
├── devApiPlugin.ts              # Local development mock API plugin (Vite serve only)
├── api/                         # Vercel Serverless Functions (/api/*)
│   ├── _db.ts                   # MongoDB Atlas connection & Mongoose schemas
│   ├── driver-config.ts         # GET/PUT driver profile data
│   ├── gallery.ts               # GET/POST gallery items
│   ├── reviews.ts               # GET/POST verified traveler reviews
│   ├── status.ts                # Database & Cloudinary connectivity health check
│   ├── tours.ts                 # GET/POST tour packages
│   └── upload.ts                # Cloudinary upload credentials handler
├── public/                      # Static production assets
│   ├── assets/svg/              # SVG illustrations (prayer flags, landscape hero)
│   └── images/                  # Real photography & brand logo
│       ├── gallery/             # High-res tour photos (Pangong, Khardung La, Nubra, etc.)
│       ├── driver.jpg           # Chauffeur profile photo
│       ├── hero-bg.jpg          # High-altitude mountain hero banner
│       ├── logo.jpg             # Circular golden Himalayan brand badge
│       └── og-cover.jpg         # WhatsApp / social preview thumbnail
└── src/                         # React 19 + TypeScript application source
    ├── main.tsx                 # React DOM mount point
    ├── App.tsx                  # React Router routes (/ , /about, /tours, /reviews, etc.)
    ├── index.css                # Himalayan design system (variables, glassmorphism, responsive)
    ├── components/              # Reusable UI components (Nav, Fab, Stars, PageWrapper)
    ├── context/DataContext.tsx  # Centralized live data context provider
    ├── data/                    # Fallback / seed datasets (config, tours, reviews, gallery)
    │   ├── config.ts            # Chauffeur business info, phone, WhatsApp number
    │   ├── galleryData.ts       # Default photo gallery items
    │   ├── initialReviews.ts    # Seed testimonials with verified traveler badges
    │   └── toursData.ts         # Tour packages, pricing estimates, day itineraries
    ├── pages/                   # Application views
    │   ├── Home.tsx             # Landing hero, stats, tour cards, trust highlights
    │   ├── About.tsx            # Biography, safety checklist, fleet, milestones
    │   ├── Tours.tsx            # Tour cards, fare estimator, itinerary modals
    │   ├── Reviews.tsx          # Rating scorecard, filterable reviews, submission form
    │   ├── Gallery.tsx          # Media grid with category filter and lightbox
    │   └── Contact.tsx          # Quick inquiry form, FAQs, airport transfer info
    ├── services/apiService.ts   # Resilient 3-tier data service (API → Cache → Seed)
    └── types/index.ts           # TypeScript interfaces (TourPackage, Review, DriverConfig)
```

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
pnpm install
# or: npm install
```

### 2. Start Development Server
```bash
pnpm run dev
# or: npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The local development server automatically handles `/api/*` endpoints and connects to MongoDB Atlas.

### 3. Build for Production
```bash
pnpm run build
# or: npm run build
```
Generates an optimized bundle in `dist/`.

### 4. Preview Production Build
```bash
pnpm run preview
# or: npm run preview
```

---

## 🌐 Deploying to Production (Ready to Go Live!)

### Recommended: Deploy on Vercel (1-Click)
1. Push this repository to GitHub or GitLab.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import this repository. Vercel automatically detects Vite + Serverless Functions in `api/`.
4. Under **Environment Variables**, add:
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@cluster0.tzuye2e.mongodb.net/test?retryWrites=true&w=majority`
   - `CLOUDINARY_CLOUD_NAME`: `efv1qjok`
   - `CLOUDINARY_API_KEY`: `494397772329212`
   - `CLOUDINARY_API_SECRET`: `your_cloudinary_secret`
5. Click **Deploy**. Your website will be live worldwide with SSL in under 60 seconds!

---

## ⚙️ How to Make Future Changes

| What to Update | Where to Edit | Instructions |
|---|---|---|
| **Driver Name, Phone, WhatsApp** | `src/data/config.ts` | Change `phone`, `whatsapp` (digits only with country code, e.g. `919797887369`), and `email`. |
| **Fleet & Safety Specs** | `src/data/config.ts` | Edit `primaryVehicle`, `secondaryVehicle`, or `safetyFeatures`. |
| **Tour Packages & Pricing** | `src/data/toursData.ts` | Add new tours or adjust `priceEstimate`, `duration`, `highlights`, or `itinerary`. |
| **Photo & Video Gallery** | `src/data/galleryData.ts` | Place photos in `public/images/gallery/` and add entries to `GALLERY_DATA`. |
| **Verified Seed Reviews** | `src/data/initialReviews.ts` | Add or update traveler reviews and driver replies. |
| **Theme Colors & Typography** | `src/index.css` | Edit `:root` design tokens at the top of the file (e.g. `--blue`, `--bg`). |
| **Page Titles & SEO Tags** | `index.html` | Update `<title>`, `<meta name="description">`, and OpenGraph tags. |
| **Header Navigation & Logo** | `src/components/Nav.tsx` | Modify navigation links or replace `/images/logo.jpg`. |

---

## 🔒 Security Best Practices
- **Never commit `.env` to Git.** Credentials and database passwords must remain in `.env` (local) or in your hosting provider's Environment Variables dashboard (production).
- `.gitignore` is already preconfigured to protect your secrets.
#   L a d a k h W a y f a r e r s  
 