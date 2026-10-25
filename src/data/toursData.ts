/**
 * ==============================================================================
 * LADAKH WAYFARERS - TOUR PACKAGES & ITINERARIES
 * ==============================================================================
 * This file contains default tour packages and itineraries used across the app.
 * If MongoDB Atlas is connected, live packages from the 'tours' collection
 * are loaded; otherwise, this dataset serves as the fallback.
 *
 * HOW TO ADD OR EDIT TOURS IN THE FUTURE:
 * 1. Each tour is an object in TOURS_DATA:
 *    - `id`: Unique slug string (e.g., 'tour-5-days-leh')
 *    - `title`: Name of the tour displayed in cards & booking messages
 *    - `duration`: Formatted text (e.g., '5 Days / 4 Nights')
 *    - `maxAltitude`: Peak elevation with landmark (e.g., '17,982 ft (Khardung La)')
 *    - `difficulty`: 'Easy' | 'Moderate' | 'Adventurous' | 'Extreme'
 *    - `bestSeason`: Optimal travel months (e.g., 'May to October')
 *    - `idealVehicle`: Recommended vehicle type ('Toyota Innova Crysta' or 'Mahindra Scorpio 4WD')
 *    - `category`: Filter group: 'Classic' | 'High Passes' | 'Expedition'
 *    - `badge`: Special ribbon badge (e.g., 'Family Favorite', 'Bestseller', 'World Record Pass')
 *    - `priceEstimate`: Government Union rate estimate (e.g., '₹18,500 - ₹24,000')
 *    - `coverImage`: Image path (e.g. '/images/gallery/monastery.jpg' or Cloudinary URL)
 *    - `overview`: 1-2 sentence compelling summary of the journey
 *    - `highlights`: Array of bullet points shown in the card
 *    - `itinerary`: Array of { day: 'Day 1', title: '...', desc: '...' } for modal view
 * ==============================================================================
 */

import { TourPackage } from '../types';

export const TOURS_DATA: TourPackage[] = [
  {
    id: "tour-5-days-leh",
    title: "5 Days Classic Leh & Sham Valley Explorer",
    duration: "5 Days / 4 Nights",
    maxAltitude: "17,982 ft (Khardung La)",
    difficulty: "Easy",
    bestSeason: "May to October (Available Year-Round)",
    idealVehicle: "Toyota Innova Crysta",
    category: "Classic",
    badge: "Family Favorite",
    priceEstimate: "₹18,500 - ₹24,000",
    coverImage: "/images/gallery/monastery.jpg",
    overview: "A leisurely mountain journey designed for effortless acclimatization. Covers historical palaces, ancient Tibetan monasteries, the gravity-defying Magnetic Hill, and an exhilarating ride to Khardung La.",
    highlights: [
      "Acclimatization day with Shanti Stupa sunset & Leh Palace",
      "Hall of Fame War Memorial & Gurudwara Pathar Sahib",
      "Magnetic Hill & Sangam (Indus and Zanskar rivers confluence)",
      "Ascend to Khardung La Pass (17,982 ft) snow panoramic ridge",
      "Thiksey Monastery (Mini Potala) & Shey Palace",
      "Relaxed pacing with medical oxygen monitoring"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Leh (3,500m) & Sacred Acclimatization",
        desc: "Airport pickup with traditional Ladakhi Khatag blessing. Transfer to your hotel for mandatory complete rest to acclimatize. Evening gentle walk in Leh Bazaar and sunset at Shanti Stupa."
      },
      {
        day: "Day 2",
        title: "Sham Valley Cultural & Geological Wonders",
        desc: "Scenic drive along the Indus River. Test gravity at Magnetic Hill, visit Gurudwara Pathar Sahib, and watch the confluence of Indus and Zanskar rivers at Nimmu."
      },
      {
        day: "Day 3",
        title: "Summiting Khardung La Pass (17,982 ft)",
        desc: "Morning ascent up the legendary switchbacks to Khardung La. Sip butter tea and enjoy mountain views before returning to visit the 12-storey Thiksey Monastery."
      },
      {
        day: "Day 4",
        title: "Indus Valley Monasteries & Sindhu Ghat",
        desc: "Explore Hemis Gompa nestled in a sacred gorge, Stok Palace royal museum, and peaceful reflection at Sindhu Ghat."
      },
      {
        day: "Day 5",
        title: "Airport Farewell",
        desc: "Timely airport transfer with warm mountain wishes and blessings."
      }
    ]
  },
  {
    id: "tour-6-days-nubra-pangong",
    title: "6-7 Days Nubra Valley & Pangong Lake Circuit",
    duration: "7 Days / 6 Nights",
    maxAltitude: "17,982 ft (Khardung La) & 17,590 ft (Chang La)",
    difficulty: "Moderate",
    bestSeason: "May to October",
    idealVehicle: "Toyota Innova Crysta",
    category: "Classic",
    badge: "Bestseller",
    priceEstimate: "₹28,000 - ₹36,000",
    coverImage: "/images/gallery/pangong-flags.jpg",
    overview: "Ladakh's most famous circuit. Traverse high mountain passes, ride double-humped camels among desert dunes in Nubra, explore the Indo-Pak border village of Turtuk, and sleep beneath millions of stars along turquoise Pangong Tso.",
    highlights: [
      "Drive across Khardung La (17,982 ft)",
      "Giant 108-ft Maitreya Buddha statue at Diskit Gompa",
      "Bactrian Camel safari on Hunder White Sand Dunes",
      "Excursion to Turtuk (historic Baltistan heritage village)",
      "Adventurous off-road Shayok River route direct to Pangong",
      "Overnight lakeside stargazing at Pangong Lake (14,270 ft)",
      "Return over Chang La Pass (17,590 ft)"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Leh Arrival & Acclimatization",
        desc: "Airport transfer, complete hydration and rest. Evening stroll at Shanti Stupa."
      },
      {
        day: "Day 2",
        title: "Leh to Nubra Valley via Khardung La",
        desc: "Climb the world's most iconic pass and descend into the fertile valleys of Nubra. Visit Diskit Monastery and sunset camel safari at Hunder dunes."
      },
      {
        day: "Day 3",
        title: "Turtuk Village & Balti Cultural Excursion",
        desc: "Drive alongside the Shyok river to Turtuk on the border of Baltistan. Taste organic apricots and visit the old royal residence."
      },
      {
        day: "Day 4",
        title: "Nubra to Pangong Tso via Shyok River Canyon",
        desc: "Direct scenic wilderness drive along the riverbed to the shimmering turquoise waters of Pangong Tso Lake."
      },
      {
        day: "Day 5",
        title: "Pangong Sunrise & Return via Chang La",
        desc: "Watch morning light dance over the lake. Ascend Chang La Pass and return to Leh with a stop at Thiksey Monastery."
      },
      {
        day: "Day 6",
        title: "Sham Valley Sightseeing & Souvenirs",
        desc: "Visit Sangam, Magnetic Hill, and shop for authentic Pashmina shawls in Leh."
      },
      {
        day: "Day 7",
        title: "Departure Transfer",
        desc: "Drop off at Leh airport."
      }
    ]
  },
  {
    id: "tour-umling-la-hanle",
    title: "7 Days Umling La (19,024 ft) & Hanle Dark Sky Reserve",
    duration: "7 Days / 6 Nights",
    maxAltitude: "19,024 ft (World's Highest Motorable Pass)",
    difficulty: "Extreme",
    bestSeason: "Late May to Mid October",
    idealVehicle: "Toyota Innova Crysta / 4x4 Scorpio",
    category: "High Passes",
    badge: "World Record Pass",
    priceEstimate: "₹38,000 - ₹48,000",
    coverImage: "/images/gallery/umlingla.jpg",
    overview: "For true adventurers. Drive to 19,024 ft on the world's highest motorable pass road. Experience the world-famous International Dark Sky Reserve in Hanle, pay homage at the Rezang La War Memorial, and explore tranquil Tso Moriri Lake.",
    highlights: [
      "Official 19,024 ft BRO milestone photo atop Umling La",
      "Hanle Dark Sky Reserve: Naked-eye Milky Way observation",
      "Rezang La 1962 Battle Memorial (Chushul)",
      "High altitude wildlife: Tibetan Wild Ass (Kiang) & Cranes",
      "Remote Changthang plateau & Tso Moriri lake (14,836 ft)",
      "Dedicated medical oxygen tank & pulse-oximeter continuously monitored"
    ],
    itinerary: [
      {
        day: "Day 1-2",
        title: "Leh Arrival & Deep Acclimatization",
        desc: "Strict acclimatization in Leh. Local monastery tours to adapt your body for 19,000+ feet."
      },
      {
        day: "Day 3",
        title: "Leh to Pangong Lake (Merak)",
        desc: "Cross Chang La pass and drive to the quiet southern shores of Pangong Lake."
      },
      {
        day: "Day 4",
        title: "Merak to Hanle via Chushul & Rezang La",
        desc: "Drive through raw border country. Visit the sacred Rezang La War Memorial and reach Hanle village for astronomical night skies."
      },
      {
        day: "Day 5",
        title: "The Summit: Hanle to Umling La (19,024 ft)",
        desc: "Ascend the BRO blacktop marvel to the highest pass on earth. Celebrate at the summit before returning to Hanle."
      },
      {
        day: "Day 6",
        title: "Hanle to Tso Moriri Lake (Karzok)",
        desc: "Cross Changthang plateau to the deep cobalt waters of Tso Moriri. Visit Karzok Gompa."
      },
      {
        day: "Day 7",
        title: "Tso Moriri to Leh via Tsokar & Tanglang La",
        desc: "Drive past the salt crusts of Tsokar Lake, conquer Tanglang La pass, and return safely to Leh."
      }
    ]
  },
  {
    id: "tour-zanskar-expedition",
    title: "9 Days Grand Zanskar Valley Wilderness Expedition",
    duration: "9 Days / 8 Nights",
    maxAltitude: "16,600 ft (Shinku La / Singge La)",
    difficulty: "Adventurous",
    bestSeason: "June to September",
    idealVehicle: "Mahindra Scorpio 4WD / Innova",
    category: "Expedition",
    badge: "Wild Frontier",
    priceEstimate: "₹48,000 - ₹62,000",
    coverImage: "/images/gallery/zanskar.jpg",
    overview: "Journey into the untouched heart of the Zanskar range. Marvel at the sheer rock wall of Mount Gumbok Rangan, traverse glacial canyons, hike to the cave-monastery of Phuktal, and experience living Tibetan culture.",
    highlights: [
      "Twin snow peaks of Nun & Kun (7,135m) in Suru Valley",
      "Pensi La pass overlooking the gigantic Drang-Drung Glacier",
      "Padum - ancient heartland of Zanskar",
      "Hike to the honeycomb cliff cave of Phuktal Gompa",
      "Sacred monolithic mountain of Gumbok Rangan",
      "Rugged 4WD navigation through high passes and glacial streams"
    ],
    itinerary: [
      {
        day: "Day 1-2",
        title: "Acclimatize in Leh & Drive to Kargil",
        desc: "Travel past Lamayuru moonscape and Mulbekh rock carving, overnight in Kargil."
      },
      {
        day: "Day 3",
        title: "Kargil to Padum via Suru Valley & Pensi La",
        desc: "Drive beneath towering glaciers and cross Pensi La with views of Drang-Drung Glacier."
      },
      {
        day: "Day 4",
        title: "Padum Cultural Circuit",
        desc: "Visit Karsha Gompa and the cliff-hanging Stongde Monastery."
      },
      {
        day: "Day 5",
        title: "Day Hike to Phuktal Cave Monastery",
        desc: "Hike along the Tsarap Chu river gorge to visit the 12th-century cave monastery."
      },
      {
        day: "Day 6",
        title: "Padum to Kurgiakh & Gumbok Rangan",
        desc: "Camp beneath the revered monolithic sacred peak."
      },
      {
        day: "Day 7",
        title: "Return via the new Singge La Mountain Pass",
        desc: "Traverse high altitude rock canyons connecting back to the Indus Valley."
      },
      {
        day: "Day 8-9",
        title: "Celebration in Leh & Airport Transfer",
        desc: "Relax in Leh market and farewell transfer to the airport."
      }
    ]
  }
];
