# ✈️ Tourmantri — Tour Designer & Travel Agency Web App

[![Website](https://img.shields.io/badge/Website-tourmantri.com-ff7200?style=for-the-badge&logo=google-chrome&logoColor=white)](https://tourmantri.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-tourmantri%2FTourmantri-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/tourmantri/Tourmantri)
[![Tech Stack](https://img.shields.io/badge/Stack-Vanilla%20HTML5%20%7C%20CSS3%20%7C%20ES6%2B%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#tech-stack)
[![Zero Dependency](https://img.shields.io/badge/Dependencies-Zero%20(Pure%20Vanilla)-28a745?style=for-the-badge)](#tech-stack)

> **Tourmantri** is a high-performance, modern, and responsive web application designed for a premier travel agency and tour designer. Built with pure vanilla technologies for instant load times, rich animations, and an intuitive booking experience.

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tour Packages & Pricing](#-tour-packages--pricing)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Project Structure](#-project-structure)
- [Brand Design Tokens & Theme](#-brand-design-tokens--theme)
- [Getting Started](#-getting-started)
- [Contact & Agency Information](#-contact--agency-information)

---

## 🌟 Project Overview

Tourmantri provides curated travel packages across India and top international destinations. The web application allows travelers to explore detailed itineraries, calculate transparent pricing, manage bookings, and access an interactive traveler dashboard without requiring server setups or heavy JavaScript frameworks.

---

## 🚀 Key Features

### 1. 🧭 Categorized Navigation & Dropdowns
- Multi-tier dropdown menus for **Domestic Tours**, **International Tours**, and **Day Trips**.
- Smooth filtering with seamless auto-scroll to package sections.

### 2. 🌄 Hero Screensaver Slideshow
- High-resolution background slideshow cycling every 5 seconds.
- Crossfading transitions with smooth Ken Burns zoom effect for a dynamic visual experience.

### 3. 🔍 Live Search & Filter Panel
- Real-time search by destination keyword, trip date, and traveler count.
- Filter by tour type, duration, and price range.

### 4. 💳 Dynamic Booking Engine & Price Calculator
- Live price recalculation based on number of guests and duration.
- Automated 8% tax calculation and confirmed booking generation.

### 5. 🎟️ Simulated E-Ticket & Boarding Pass Generator
- Generates printable boarding passes complete with scannable barcode simulation, booking reference ID, and Tourmantri branding.

### 6. 📊 Interactive Traveler Dashboard
- **Analytics**: Custom SVG spending chart visualizing expenditure by category.
- **Countdown Timer**: Real-time ticker for the next upcoming departure.
- **Wishlist Manager**: Save and manage dream destinations.
- **Interactive Itinerary Planner**: Collapsible day-by-day activity schedule.
- **Profile Settings**: Local client-side preference and contact management.

### 7. 🌗 Dark & Light Theme Switcher
- Curated dark and light palettes with smooth transitions.
- Intelligent logo filtering (`filter: invert(1) hue-rotate(180deg)`) preserving crisp white typography and brand orange/red colors in dark mode.

### 8. 💾 Persistent Client State & Cache Invalidation
- Browser `localStorage` persistence for bookings, wishlists, itineraries, and user preferences.
- Built-in cache invalidation safeguard ensuring new package updates display immediately across cached browsers.

---

## 🗺️ Tour Packages & Pricing

All prices are in Indian Rupees (**INR**) formatted with Indian numbering conventions (`₹`):

### 🇮🇳 Domestic Tours
| Package Name | Code | Duration | Price (INR) |
| :--- | :--- | :--- | :--- |
| **Rajasthan Heritage & Desert Safari** | `PKG-RAJASTHAN` | 6 Days | ₹8,999 |
| **Kashmir Paradise Valleys** | `PKG-KASHMIR` | 5 Days | ₹15,500 |
| **Kerala Backwaters & Hills** | `PKG-KERALA` | 6 Days | ₹15,000 |
| **Goa Beach Paradise Escapade** | `PKG-GOA` | 4 Days | ₹5,500 |
| **Maharashtra Forts & Caves** | `PKG-MAHARASHTRA` | 5 Days | ₹8,000 |
| **Sikkim Himalayan Valleys** | `PKG-SIKKIM` | 6 Days | ₹20,000 |
| **Himachal Snowy Escapes & Valleys** | `PKG-HIMACHAL` | 6 Days | ₹15,000 |
| **Vibrant Gujarat Culture & Heritage** | `PKG-GUJARAT` | 5 Days | ₹8,000 |

### ✈️ International Tours
| Package Name | Code | Duration | Price (INR) |
| :--- | :--- | :--- | :--- |
| **Dubai Luxury Wonders** | `PKG-DUBAI` | 5 Days | ₹59,999 |
| **Thailand Island Explorer** | `PKG-THAILAND` | 6 Days | ₹34,999 |
| **Maldives Bliss Villa** | `PKG-MALDIVES` | 4 Days | ₹79,999 |
| **Vietnam Halong Bay Cruise** | `PKG-VIETNAM` | 6 Days | ₹33,000 |

### 🏕️ Day Tours
| Package Name | Code | Duration | Price (INR) |
| :--- | :--- | :--- | :--- |
| **Polo Forest Heritage Day Hike** | `PKG-POLO-FOREST` | 1 Day | ₹1,100 |
| **Bakor Nature Camp Day Trip** | `PKG-BAKOR` | 1 Day | ₹900 |

---

## 🛠️ Tech Stack & Architecture

- **Core Structure**: HTML5 (Semantic elements, accessible landmarks)
- **Styling**: Vanilla CSS3 (CSS Custom Properties, Glassmorphism, CSS Grid, Flexbox, Keyframe animations)
- **Client Logic**: ES6+ JavaScript (DOM Manipulation, LocalStorage API, SVG Rendering, Event Delegation)
- **Typography**: Google Fonts ([Outfit](https://fonts.google.com/specimen/Outfit) for Headings, [Inter](https://fonts.google.com/specimen/Inter) for Body/UI)
- **Icons**: [Remix Icon](https://remixicon.com/) CDN
- **Build Step**: None required (100% Zero-Dependency)

---

## 📁 Project Structure

```text
tourmantri-app/
├── assets/                  # Images and brand assets
│   ├── logo.png             # Official Tourmantri logo
│   ├── hero-bg.jpg          # Hero section background
│   ├── rajasthan.jpg        # Tour destination imagery
│   ├── kashmir.jpg
│   ├── dubai.jpg
│   ├── maldives.jpg
│   └── ...                  # Additional tour visuals
├── styles/                  # Modular stylesheet architecture
│   ├── variables.css        # Design tokens, color palette, typography
│   ├── main.css             # Navigation, hero, cards, testimonials, footer
│   ├── dashboard.css        # Traveler dashboard, SVG spending chart
│   └── modal.css            # Glassmorphic modal, ticket pass, toasts
├── js/
│   └── app.js               # Application logic, data store, state management
├── .agents/                 # AI Assistant skills & guidelines
│   └── skills/
│       └── tourmantri-app/
│           └── SKILL.md     # Project knowledge base & runbook
├── .gitignore               # Ignored system and build artifacts
├── AGENTS.md                # Agent workspace instructions
├── index.html               # Main entry point HTML
└── README.md                # Project documentation
```

---

## 🎨 Brand Design Tokens & Theme

| Token | Light Theme | Dark Theme | Description |
| :--- | :--- | :--- | :--- |
| `--primary-color` | `#ff7200` | `#ff8522` | Tourmantri Brand Orange |
| `--secondary-color` | `#e53935` | `#e53935` | Warm Crimson Red (`rgb(229, 57, 53)`) |
| `--bg-primary` | `#faf8f5` | `#0f0d0b` | Main Page Background |
| `--bg-secondary` | `#ffffff` | `#171412` | Card & Container Background |
| `--bg-tertiary` | `#f5f1eb` | `#221f1c` | Hover / Muted Background |
| `--text-primary` | `#1a1614` | `#f5f1eb` | Primary Typography |

---

## 💻 Getting Started

Because Tourmantri is built with zero dependencies, you do not need Node.js or any build tools to run it.

### Option 1: Direct File Launch
Simply double-click `index.html` or open it with any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

### Option 2: Live Server (VS Code)
1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` and select **"Open with Live Server"**.

### Option 3: Python Simple Server
```bash
# Python 3
python -m http.server 8000
```
Visit `http://localhost:8000` in your browser.

---

## 📞 Contact & Agency Information

- **Brand**: Tourmantri (Tour Designer / Travel Agency)
- **Website**: [tourmantri.com](https://tourmantri.com)
- **Phone**: [+91 8200 453651](tel:+918200453651)
- **Email**: [infotourmantri@gmail.com](mailto:infotourmantri@gmail.com) / [info@tourmantri.com](mailto:info@tourmantri.com)
- **Headquarters**:  
  First Floor 106, Pavitra Enclave,  
  Opp Kataria Service Center, Mansarovar Road,  
  Tragad, Ahmedabad - 382424, Gujarat, India.

---

*© Tourmantri. All rights reserved.*
