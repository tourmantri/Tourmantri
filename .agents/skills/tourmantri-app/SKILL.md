---
name: tourmantri-app
description: Comprehensive knowledge base, design system tokens, branding rules, package catalog, architecture, and coding guidelines for the Tourmantri Travel Agency Web App.
---

# Tourmantri Travel Agency Web App Knowledge & Guidelines

This skill provides complete domain knowledge, brand rules, technical architecture, and implementation details for maintaining and enhancing the **Tourmantri** web application.

---

## 1. Project Overview & Brand Identity

- **Brand Name**: Tourmantri (Tour Designer / Travel Agency)
- **Domain**: [tourmantri.com](https://tourmantri.com)
- **GitHub Repository**: [github.com/tourmantri/Tourmantri](https://github.com/tourmantri/Tourmantri)
- **Contact Details**:
  - **Phone**: `+91 8200 453651`
  - **Email**: `infotourmantri@gmail.com` / `info@tourmantri.com`
  - **Address**: First Floor 106, Pavitra Enclave, Opp Kataria Service Center, Mansarovar Road, Tragad, Ahmedabad - 382424, Gujarat, India

---

## 2. Tech Stack & Architecture

- **Core**: Pure Vanilla HTML5, CSS3, ES6+ JavaScript.
- **Dependencies**: Zero-dependency architecture (no Node/Vite/Webpack build step needed; runs standalone by opening `index.html`).
- **File Structure**:
  - `index.html`: Main landing page containing hero slideshow, search bar, tour package cards, booking modal, dashboard section, and footer.
  - `styles/variables.css`: Global CSS custom properties (color tokens, typography, shadows, borders, transitions).
  - `styles/main.css`: Header, hero screensaver, dropdown navigation, package grid, testimonials, and footer styles.
  - `styles/dashboard.css`: Client-side traveler dashboard, SVG spending chart, itinerary day planner styles.
  - `styles/modal.css`: Glassmorphic booking modal, simulated e-ticket/boarding pass styles, toast notifications.
  - `js/app.js`: Application logic, package data catalog, search/filter algorithms, booking calculator, dynamic itinerary generator, local storage state manager, and theme switcher.
  - `assets/`: Image assets for destinations and brand logo.

---

## 3. Brand Colors & Theme Rules

### Color Palette Tokens
- **Primary Color**: Tourmantri Orange (`#ff7200`, dark mode: `#ff8522`)
- **Secondary Color**: Warm Crimson Red (`#e53935`, rgb: `229, 57, 53`) — *Note: Do not use pinkish tones in dark mode.*
- **Dark Theme Backgrounds**:
  - Primary: `#0f0d0b`
  - Secondary: `#171412`
  - Tertiary: `#221f1c`
- **Light Theme Backgrounds**:
  - Primary: `#faf8f5`
  - Secondary: `#ffffff`
  - Tertiary: `#f5f1eb`
- **Typography**:
  - Headings: `Outfit`, sans-serif
  - Body / UI: `Inter`, sans-serif

### Logo Presentation Rules
- **Header Default Height**: `104px`
- **Header Scrolled / Sticky Height**: `68px`
- **Footer Height**: `85px`
- **Aesthetic**: Clean and flat (no 3D shadows, bevels, or emboss filters).
- **Dark Mode Filter**: `filter: invert(1) hue-rotate(180deg)` — converts black text to crisp white while preserving the original orange/red brand colors without adding background badges.

---

## 4. Active Tour Packages (INR Pricing)

All pricing formatting uses Indian Rupee format (`.toLocaleString('en-IN')`):

### Domestic Tours
- **Rajasthan Heritage & Desert Safari** (`PKG-RAJASTHAN`): ₹8,999 (6 Days)
- **Kashmir Paradise Valleys** (`PKG-KASHMIR`): ₹15,500 (5 Days)
- **Kerala Backwaters & Hills** (`PKG-KERALA`): ₹15,000 (6 Days)
- **Goa Beach Paradise Escapade** (`PKG-GOA`): ₹5,500 (4 Days)
- **Maharashtra Forts & Caves** (`PKG-MAHARASHTRA`): ₹8,000 (5 Days)
- **Sikkim Himalayan Valleys** (`PKG-SIKKIM`): ₹20,000 (6 Days)
- **Himachal Snowy Escapes & Valleys** (`PKG-HIMACHAL`): ₹15,000 (6 Days)
- **Vibrant Gujarat Culture & Heritage** (`PKG-GUJARAT`): ₹8,000 (5 Days)

### International Tours
- **Dubai Luxury Wonders** (`PKG-DUBAI`): ₹59,999 (5 Days)
- **Thailand Island Explorer** (`PKG-THAILAND`): ₹34,999 (6 Days)
- **Maldives Bliss Villa** (`PKG-MALDIVES`): ₹79,999 (4 Days)
- **Vietnam Halong Bay Cruise** (`PKG-VIETNAM`): ₹33,000 (6 Days)

### Day Tours
- **Polo Forest Heritage Day Hike** (`PKG-POLO-FOREST`): ₹1,100 (1 Day)
- **Bakor Nature Camp Day Trip** (`PKG-BAKOR`): ₹900 (1 Day)

---

## 5. Key Implemented Features & Workflows

1. **Interactive Navigation Dropdowns**: Categorized dropdowns for Domestic, International, and Day Tours with smooth filtering and auto-scroll to package sections.
2. **Hero Screensaver Slideshow**: Auto-cycling 5-second crossfading slideshow with smooth Ken Burns zoom effect.
3. **Live Search Panel**: Search filter by destination keyword, trip date, and traveler count.
4. **Booking System & Price Calculator**: Dynamic recalculation based on guests and duration, with an 8% tax calculation and confirmed booking generation.
5. **Simulated E-Ticket Pass**: Printable/downloadable boarding passes with barcode, booking ID, and Tourmantri branding.
6. **Traveler Dashboard**: Interactive overview with SVG spending graph, upcoming trip countdown timer, wishlist manager, collapsible day-by-day itinerary planner, and profile settings.
7. **State Management**: Browser `localStorage` for bookings, wishlists, dynamic itinerary schedules, theme preferences, and traveler profile data.
8. **Cache Invalidation Safeguard**: In `js/app.js`, checks `existingPackages` IDs so newly added destinations display immediately without cached stale state.

---

## 6. Guidelines for Future Edits

- **Preserve Zero-Dependency Principle**: Keep the application runnable directly in any browser without requiring build or compilation steps.
- **Maintain Design System Tokens**: Use CSS variables in `styles/variables.css` rather than hardcoded colors or ad-hoc styles.
- **Currency & Formatting**: Always format monetary values in INR (`₹` + `toLocaleString('en-IN')`).
- **Responsive & Accessible**: Ensure mobile navigation, touch gestures, high contrast, and keyboard navigation remain intact.
- **Safe Package Updates**: When updating packages in `js/app.js`, ensure unique `id` values and update `PKG_*` references accordingly.
