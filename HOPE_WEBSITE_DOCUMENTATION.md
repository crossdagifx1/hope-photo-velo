# HOPE Photo & Velo — Full Website Architecture & Section Prompts

> **Project:** HOPE Photo & Velo (Single-Page React App with Modal Overlay)  
> **Location:** Addis Ababa, Ethiopia (Tigat Building, Hayahulet)  
> **Languages Supported:** Amharic (አማርኛ), English (EN), Afaan Oromoo (OR)  
> **Assets Package:** [`hope-website-assets.zip`](file:///c:/Users/Cross/OneDrive/Documents/hope%20photo---/hope-website-assets.zip) (3.8 MB — Only the 23 assets actively used on the live site)

---

## 1. Page Structure & Layout Architecture

The website is engineered as a high-performance **Single Page Application (SPA)** with fluid scroll navigation, active section tracking, trilingual content switching, and an interactive **Booking Modal Panel**.

```
┌─────────────────────────────────────────────────────────────┐
│ 0. Page Loader (Logo Reveal + Loading Bar)                  │
├─────────────────────────────────────────────────────────────┤
│ 1. Announcement Bar (Top micro-header)                      │
│ 2. Sticky Glassmorphism Header & Navigation                 │
├─────────────────────────────────────────────────────────────┤
│ 3. Hero Section (Headline + Inline Avatar + 4 Floating      │
│    Pill Badges + 3 Connected Bottom Proof Cards)            │
├─────────────────────────────────────────────────────────────┤
│ 4. Story / About Us Section (The HOPE Journey + History)    │
├─────────────────────────────────────────────────────────────┤
│ 5. Services Overview (3 Emotive Pillars: Photo, Video, Film)│
├─────────────────────────────────────────────────────────────┤
│ 6. Work / Interactive Gallery (Dynamic viewer + thumbnails) │
├─────────────────────────────────────────────────────────────┤
│ 7. Craft & Technology (Equipment specs, 4K/8K, Drone stats) │
├─────────────────────────────────────────────────────────────┤
│ 8. Shooting Locations & Studios (Tabs + Interactive Map)    │
├─────────────────────────────────────────────────────────────┤
│ 9. Working Process (4-Step timeline from booking to album)  │
├─────────────────────────────────────────────────────────────┤
│ 10. Interactive Pricing Explorer & Custom Package Builder   │
│     (7 Category Tabs + Live Total Price Calculator)         │
├─────────────────────────────────────────────────────────────┤
│ 11. Client Testimonials (Real wedding reviews)              │
├─────────────────────────────────────────────────────────────┤
│ 12. FAQ Section (Accordion FAQ)                             │
├─────────────────────────────────────────────────────────────┤
│ 13. Closing Call-to-Action (Cinematic photo banner + star)   │
├─────────────────────────────────────────────────────────────┤
│ 14. Global Footer (Quick links + Maps badge + Telegram)     │
├─────────────────────────────────────────────────────────────┤
│ 15. [MODAL] Booking & Telegram Dispatch Engine              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Advanced Section-by-Section Feature Breakdown & Prompts

### Section 0: Page Loader
- **Features:** 
  - Brand reveal on initial load with 1.8s timeout and 2.4s exit fade.
  - Animated gold/crimson fill bar.
  - Hides scrollbar during loading.
- **Assets Used:** `/assets/hope-logo.png`
- **UI Prompt:**
  ```text
  Full-screen minimalist loading screen with obsidian dark background (#0d0d12), centered gold-accented HOPE Photo & Velo brand logo with smooth pulse effect, a refined horizontal animated loading progress bar with linear gradient glow, and smooth fade-out exit animation.
  ```

---

### Section 1: Announcement Bar
- **Features:**
  - Sticky micro-banner above navigation.
  - Dynamic localized copy with heart icon.
- **UI Prompt:**
  ```text
  Sleek dark red/burgundy top announcement strip with a subtle glowing heart icon, displaying localized tagline: "Addis Ababa • Built on Love Photography & Video" with letter-spaced typography and polished luxury styling.
  ```

---

### Section 2: Header & Navigation
- **Features:**
  - Frosted glassmorphism background (`backdrop-filter: blur(16px)`).
  - Brand logo with instant return to top.
  - Smooth-scrolling anchor links for all 6 core sections.
  - Interactive direct phone dialer button (`09 10 52 69 62`).
  - Trilingual switcher (AM ⇄ EN ⇄ OR) updating all strings in real-time.
  - "Book Your Date" primary CTA button with calendar icon.
  - Mobile hamburger toggle menu with animated icon.
- **Assets Used:** `/assets/hope-logo.png`
- **UI Prompt:**
  ```text
  Ultra-luxurious sticky header with dark frosted glassmorphism effect, sharp logo mark on left, clean navigation links with subtle hover underlines, phone dialer pill, interactive multilingual switch button (Amharic, English, Afaan Oromoo), and a vibrant burgundy-crimson booking CTA button.
  ```

---

### Section 3: Hero Section (`#home`)
- **Features:**
  - Responsive background image switching: Desktop (`weee.jpg`) vs Mobile viewport `<900px` (`hero_mobile_bg.jpg`).
  - Dark gradient text-protection overlay.
  - Eyebrow badge: "Addis Ababa • Founded in Love" with dark crimson pill.
  - Animated 3-line headline with **embedded circular avatar image** inside the typography.
  - Primary "Book Your Date Now" button + Secondary "About Us" button.
  - **4 Floating Frosted Badges** with colored glow icons:
    - *Real Moments* (Blue glow)
    - *Timeless Memories* (Lime glow)
    - *Creative Vision* (Green glow)
    - *Professional Quality* (Pink glow)
  - **3 Bottom Proof Cards** showing distinct wedding styles: Golden hour, Lush garden, and Evening dusk.
- **Assets Used:**
  - `assets/weee.jpg` (Desktop Hero background)
  - `assets/hero_mobile_bg.jpg` (Mobile Hero background)
  - `assets/hero-h1-avatar.jpg` (Inline typography avatar)
  - `assets/hero-card-1.jpg` (Proof tile 1)
  - `assets/hero-card-2.jpg` (Proof tile 2)
  - `assets/hero-card-3.jpg` (Proof tile 3)
- **Image Prompts for Generation:**
  - **Hero Desktop:** `"Cinematic Ethiopian wedding couple in golden hour sunset lighting, soft outdoor garden bokeh, bride in elegant white gown, groom in bespoke dark suit, warm emotional embrace, 8k resolution, luxury wedding photography --ar 16:9"`
  - **Hero Mobile:** `"Vertical portrait orientation of an Ethiopian bride and groom close embrace in warm golden sunlight, cinematic film color grading, luxury wedding portrait --ar 9:16"`
  - **Inline Avatar:** `"Macro circle portrait of a bride silhouetted against a vibrant golden sunset, warm amber tones, dreamlike --ar 1:1"`
  - **Card 1:** `"Ethiopian wedding couple walking during sunset golden hour, candid romance, cinematic warm glow --ar 4:3"`
  - **Card 2:** `"Wedding couple in a botanical garden surrounded by lush greenery, natural daylight, candid smiles --ar 4:3"`
  - **Card 3:** `"Evening dusk wedding portrait with atmospheric blue hour and warm candlelights, cinematic drama --ar 4:3"`

---

### Section 4: Story / About Us Section (`#story`)
- **Features:**
  - 2-Column asymmetric layout.
  - Left vertical line badge + cursive script intro ("Beyond the photo...").
  - Bold typography highlighting brand philosophy of candid moments.
  - Framed showcase portrait with "Since 2016" establishment badge.
  - Interactive "View Our Work" text CTA with arrow hover transition.
- **Assets Used:** `assets/gallery/photo_2026-07-03_20-35-00_7668161019770662912.jpg`
- **Image Prompt:**
  ```text
  Documentary style wedding photograph of an Ethiopian couple walking hand-in-hand through an outdoor trail surrounded by tall trees and natural soft light, candid and heartfelt --ar 4:5
  ```

---

### Section 5: Services Overview
- **Features:**
  - 3-Column service card deck with sequential stagger animations.
  - Numbered index headers (`01`, `02`, `03`).
  - Icons for Photography, Videography, and Fine-Art Tangible Keepsakes.
- **UI Prompt:**
  ```text
  Three luxury cards on deep dark background with subtle border glow, numbered indicators 01-03, clean iconography for Photography, Cinema Video, and Print Albums, with high-contrast elegant typography.
  ```

---

### Section 6: Work / Interactive Gallery (`#work`)
- **Features:**
  - Interactive large feature image with title caption and "Next Image" trigger.
  - 4-Thumbnail quick-switch navigation strip.
  - Full-width Instagram banner link with dynamic arrow icon.
- **Assets Used (9 Gallery Items):**
  - `photo_2026-07-03_20-31-22_7668160935271833600.jpg` (Golden Hour Love)
  - `photo_2026-07-03_20-34-45_7668160982247493632.jpg` (Garden Portrait)
  - `photo_2026-07-03_20-37-55_7668161085785812992.jpg` (Floral Archive)
  - `photo_2026-07-03_20-31-18_7668160944615066624.jpg` (Bridal Beauty)
  - `photo_2026-07-03_20-34-57_7668161010354493440.jpg` (Quiet Joy)
  - `photo_2026-07-03_20-37-48_7668161057622723584.jpg` (Evening Glamour)
  - `photo_2026-07-03_20-35-00_7668161019770662912.jpg` (Together in Nature)
  - `photo_2026-07-03_20-35-01_7668161048338929664.jpg` (First Glance)
  - `photo_2026-07-03_20-37-56_7668161066939796480.jpg` (Always Us)

---

### Section 7: Craft & Technology (`#craft`)
- **Features:**
  - 4 Key Metric Counters: `9+ Years Experience`, `500+ Weddings Captured`, `4K/8K Cinema Quality`, `100% Client Satisfaction`.
  - 4 Technical capability cards: 4K & 8K Cinema Cameras, Drone & Aerial Lighting, Color Grading Master, Fine-Art Laminated Albums.

---

### Section 8: Locations & Studio Map (`#locations`)
- **Features:**
  - 3-Tab selector for shooting environments: *Garden & Outdoor*, *Indoor Studio*, *Night & Editorial*.
  - Dedicated **Studio Map Card** with physical studio address at **Tigat Building, Hayahulet, Addis Ababa**.
  - Interactive Google Maps embedded iframe + direct Google Maps navigation button.

---

### Section 9: Working Process (`#process`)
- **Features:**
  - 4-Stage step-by-step workflow:
    - `01`: Initial Consultation & Booking
    - `02`: Pre-Wedding Shoot
    - `03`: Full Wedding Day Coverage
    - `04`: Albums, Editing & Delivery

---

### Section 10: Interactive Pricing Explorer & Package Builder (`#pricing`)
- **Features:**
  - **Left Sidebar:** 7 Category Presets (*Wedding, Outdoor Shoot, Indoor Shoot, Studio Shoot, Velo/Video, Makeup, Decor & Setup*).
  - **Center Showcase:** Dynamic photo background, active package name, live service pill tags, and instant booking button.
  - **Right Interactive Customizer (9 Service Tiles with live recalculation):**
    - `Photography` (15,000 ETB)
    - `Velo / Video` (15,000 ETB)
    - `Wedding Car` (5,000 ETB)
    - `Suit & Dress` (8,000 ETB)
    - `Studio Session` (8,000 ETB)
    - `Makeup` (5,000 ETB)
    - `Signing Board` (3,000 ETB)
    - `Photo Album` (7,000 ETB)
    - `Decor & Setup` (12,000 ETB)
- **Fixed Starting Packages:**
  - Studio Photography: 18,500 ETB
  - 2-Camera Wedding Photo & Video: 45,000 ETB
  - Wedding Photo, Video & Music Video: 50,000 ETB
  - 3-Camera Wedding Photo & Video: 60,000 ETB
  - 4-Camera Wedding Photo & Video: 70,000 ETB
  - 4-Camera Plus Comprehensive Story: 75,000 ETB

---

### Section 11: Testimonials (`#testimonials`)
- **Features:**
  - 3 Review cards with quote marks and couple names: *Yosef & Helen*, *Dawit & Solomon*, *Abel & Tigist*.

---

### Section 12: Frequently Asked Questions (`#faq`)
- **Features:**
  - Smooth accordion toggle system (`ChevronUp` / `ChevronDown`).
  - Covers advance booking windows, delivery timelines (3-5 days soft copies, 2-4 weeks albums), customization, and advance payment terms.

---

### Section 13: Closing Call-to-Action
- **Features:**
  - Romantic photo frame with decorative ✦ star badge (`Floral Archive` photo).
  - Persuasive closing headline with instant booking CTA.

---

### Section 14: Global Footer
- **Features:**
  - Brand identity with tagline and quick Google Maps location badge.
  - Direct navigation jump links to all sections.
  - Direct Telegram bot channel link (`https://t.me/HoopStudioSystemBot`).

---

### Section 15: Booking Panel & Telegram Automation Engine
- **Features:**
  - Accessible modal dialog with backdrop blur.
  - Displays currently selected package and calculated price.
  - Form Fields: `Full Name`, `Event Date`, `Phone Number`, `Celebration Notes`.
  - **Direct Telegram Integration:** Form submission asynchronously dispatches structured booking details to `Telegram Bot API` across registered admin chat IDs (`5563466567`, `5473210957`).
  - **Success Screen:** Displays verification checkmark and confirmation message.

---

## 3. All 23 Used Assets (Included in ZIP)

The ZIP archive **[`hope-website-assets.zip`](file:///c:/Users/Cross/OneDrive/Documents/hope%20photo---/hope-website-assets.zip)** (3.8 MB) contains only the 23 files actively referenced in the live application code:

| # | Asset Path | File Size | Description / Where Used |
|---|------------|-----------|--------------------------|
| 1 | `assets/hope-logo.png` | 286.6 KB | Primary brand logo (Loader, Header, Footer, Favicon) |
| 2 | `assets/weee.jpg` | 118.1 KB | Desktop Hero Background Image |
| 3 | `assets/hero_mobile_bg.jpg` | 1.86 MB | Mobile Hero Background Image (<900px) |
| 4 | `assets/hero-h1-avatar.jpg` | 6.2 KB | Inline circular avatar inside H1 headline |
| 5 | `assets/hero-card-1.jpg` | 119.0 KB | Hero proof card 1 (Golden hour) |
| 6 | `assets/hero-card-2.jpg` | 103.1 KB | Hero proof card 2 (Lush garden) |
| 7 | `assets/hero-card-3.jpg` | 100.3 KB | Hero proof card 3 (Evening dusk) |
| 8 | `assets/bg.jpg` | 113.1 KB | Global texture background |
| 9 | `assets/gallery/photo_2026-07-03_14-14-17_7668160799898782720.jpg` | 103.9 KB | 2-Camera Wedding package card |
| 10 | `assets/gallery/photo_2026-07-03_14-14-17_7668160832798825472.jpg` | 85.8 KB | Studio photography package card |
| 11 | `assets/gallery/photo_2026-07-03_14-14-18_7668160851399477248.jpg` | 88.8 KB | 4-Camera Wedding package card |
| 12 | `assets/gallery/photo_2026-07-03_14-14-18_7668160860798849024.jpg` | 75.3 KB | 4-Camera Plus package card |
| 13 | `assets/gallery/photo_2026-07-03_14-14-18_7668160879386824704.jpg` | 72.5 KB | 3-Camera Wedding package card |
| 14 | `assets/gallery/photo_2026-07-03_14-14-19_7668160870092520448.jpg` | 88.1 KB | Music Video wedding package card |
| 15 | `assets/gallery/photo_2026-07-03_20-31-18_7668160944615066624.jpg` | 43.1 KB | Bridal Beauty gallery & studio tab |
| 16 | `assets/gallery/photo_2026-07-03_20-31-22_7668160935271833600.jpg` | 36.6 KB | Golden Hour Love gallery featured image |
| 17 | `assets/gallery/photo_2026-07-03_20-34-45_7668160982247493632.jpg` | 105.3 KB | Garden Portrait gallery & garden tab |
| 18 | `assets/gallery/photo_2026-07-03_20-34-57_7668161010354493440.jpg` | 119.0 KB | Quiet Joy gallery image |
| 19 | `assets/gallery/photo_2026-07-03_20-35-00_7668161019770662912.jpg` | 103.1 KB | Story section main portrait |
| 20 | `assets/gallery/photo_2026-07-03_20-35-01_7668161048338929664.jpg` | 42.3 KB | First Glance gallery image |
| 21 | `assets/gallery/photo_2026-07-03_20-37-48_7668161057622723584.jpg` | 64.8 KB | Evening Glamour gallery & night tab |
| 22 | `assets/gallery/photo_2026-07-03_20-37-55_7668161085785812992.jpg` | 135.6 KB | Floral Archive gallery & closing CTA |
| 23 | `assets/gallery/photo_2026-07-03_20-37-56_7668161066939796480.jpg` | 63.6 KB | Always Us gallery image |
