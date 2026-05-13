# ✦ AI DISTRIBUTION ENGINE — COMPLETE MIGRATION & BUILD DOCUMENT ✦
## Hand-Drawn Style · Full Stack · Backend Pipeline · UX/UI Spec
---

```
  ╔═══════════════════════════════════════════════════════════════════╗
  ║                                                                   ║
  ║    ░█████╗░██╗    ██████╗░██╗███████╗████████╗██████╗░██╗██████╗ ║
  ║    ██╔══██╗██║    ██╔══██╗██║██╔════╝╚══██╔══╝██╔══██╗██║██╔══██╗║
  ║    ███████║██║    ██║  ██║██║███████╗   ██║   ██████╔╝██║██████╔╝║
  ║    ██╔══██║██║    ██║  ██║██║╚════██║   ██║   ██╔══██╗██║██╔══██╗║
  ║    ██║  ██║██║    ██████╔╝██║███████║   ██║   ██║  ██║██║██████╔╝║
  ║    ╚═╝  ╚═╝╚═╝    ╚═════╝ ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═════╝ ║
  ║                                                                   ║
  ║         ENGINE  ——  MIGRATE + BUILD DOCUMENT  ——  v1.0            ║
  ╚═══════════════════════════════════════════════════════════════════╝
```

---

## TABLE OF CONTENTS

```
  ┌─────────────────────────────────────────────────────────┐
  │  PART A  ──  DESIGN SYSTEM & UI/UX SPEC                 │
  │                                                         │
  │    A1.  Brand Identity & Hand-Drawn Design Philosophy   │
  │    A2.  Color System                                    │
  │    A3.  Typography System                               │
  │    A4.  Component Library (Hand-Drawn Style)            │
  │    A5.  Landing Page — Full UX Spec                     │
  │    A6.  Auth Flow — UX Spec                             │
  │    A7.  Onboarding Flow — UX Spec                       │
  │    A8.  Dashboard — Full UX Spec                        │
  │    A9.  Opportunity Feed — UX Spec                      │
  │    A10. Report Output — UX Spec                         │
  │    A11. Pricing Page — UX Spec                          │
  │    A12. Mobile Responsiveness                           │
  │                                                         │
  │  PART B  ──  BACKEND PIPELINE & ARCHITECTURE            │
  │                                                         │
  │    B1.  Tech Stack Overview                             │
  │    B2.  Project Folder Structure                        │
  │    B3.  Database Schema (Supabase)                      │
  │    B4.  Onboarding → Pipeline Trigger                   │
  │    B5.  Stage 1 — Context Enrichment (Groq)             │
  │    B6.  Stage 2 — Tavily Search Strategy                │
  │    B7.  Stage 3 — Pain Point Analysis (Groq)            │
  │    B8.  Stage 4 — Competitor Intelligence               │
  │    B9.  Stage 5 — Master Report Generation              │
  │    B10. Stage 6 — Opportunity Feed Extraction           │
  │    B11. Stage 7 — Memory & Retention Engine             │
  │    B12. Background Jobs                                 │
  │    B13. Billing & Razorpay Integration                  │
  │    B14. Usage Limiter System                            │
  │    B15. Caching Strategy                                │
  │    B16. API Routes Reference                            │
  │    B17. Prompt Templates                                │
  │    B18. Error Handling                                  │
  │    B19. Deployment Guide                                │
  │    B20. Cost Estimates & Scaling                        │
  └─────────────────────────────────────────────────────────┘
```

---

# ╔══════════════════════════════════════╗
# ║   PART A — DESIGN SYSTEM & UI/UX    ║
# ╚══════════════════════════════════════╝

---

## A1. BRAND IDENTITY & HAND-DRAWN DESIGN PHILOSOPHY

```
  ╭─────────────────────────────────────────────────────────────╮
  │                                                             │
  │   THE CORE AESTHETIC:  Hand-Drawn, Sketchy, Alive           │
  │                                                             │
  │   This is NOT:  Another SaaS dashboard clone               │
  │   This IS:      A founder's notebook come to life          │
  │                                                             │
  │   Think:  Strategy whiteboard + sketchbook + war room      │
  │                                                             │
  ╰─────────────────────────────────────────────────────────────╯
```

### Design DNA

The entire visual language is built around the concept of a **founder's sketchbook** — the kind you'd find on a startup founder's desk, full of scrawled insights, circled ideas, arrows connecting thoughts, underlined discoveries.

Every element should feel like it was drawn by a smart, excited person who just had a breakthrough idea.

```
  KEY PRINCIPLES:
  ~~~~~~~~~~~~~~~

  ① Wobbly borders, not pixel-perfect lines
     → Use SVG stroke-dasharray for sketchy borders
     → Slight rotation on cards (-1deg to +1deg)
     → Border-radius that feels "hand-pressed"

  ② Ink textures everywhere
     → Paper grain background texture
     → Slight noise overlay on all surfaces
     → Ink-bleed effect on hover states

  ③ Hand-lettering for headings
     → Caveat / Patrick Hand / Kalam fonts
     → Slight letter-spacing irregularity
     → Mix of sizes like real hand-lettering

  ④ Doodle decorations
     → Stars, arrows, circles, underlines as SVG
     → Scattered around key content
     → Animate them subtly (wiggle on hover)

  ⑤ Color like highlighter on paper
     → Yellow highlight on key numbers
     → Pink/orange accent underlines
     → Faded ink feel (not pure black, use #1a1a2e)
```

---

## A2. COLOR SYSTEM

```css
  /* ════════════════════════════════════════
     HAND-DRAWN PALETTE — CSS VARIABLES
     ════════════════════════════════════════ */

  :root {
    /* Paper & Backgrounds */
    --paper-white:    #faf8f2;   /* warm off-white, like aged paper */
    --paper-cream:    #f5f0e8;   /* slightly darker cream */
    --paper-dark:     #1c1a14;   /* dark mode paper */
    --paper-mid:      #2d2a22;   /* dark mode card */

    /* Ink Colors */
    --ink-black:      #1a1a2e;   /* not pure black — deep navy-black */
    --ink-dark:       #2d2b3d;   /* secondary text */
    --ink-light:      #6b6880;   /* muted text */
    --ink-ghost:      #9996a8;   /* placeholder text */

    /* Highlighter Accents */
    --highlight-yellow:   #ffd60a;   /* marker highlight */
    --highlight-pink:     #ff6b9d;   /* excitement marker */
    --highlight-orange:   #ff8c42;   /* warning/action */
    --highlight-green:    #06d6a0;   /* success/opportunity */
    --highlight-blue:     #118ab2;   /* link/info */
    --highlight-purple:   #7b5ea7;   /* premium/pro */

    /* Sketch Borders */
    --sketch-border:  #1a1a2e;       /* main border color */
    --sketch-light:   #d4cfc7;       /* light dividers */

    /* Shadows — like ink pressed into paper */
    --shadow-sketch:  3px 3px 0px #1a1a2e;
    --shadow-sketch-lg: 5px 5px 0px #1a1a2e;
    --shadow-hover:   6px 6px 0px #1a1a2e;
  }
```

### Color Usage Rules

```
  BACKGROUNDS:
  ────────────
  Page background     →  var(--paper-white)  +  grain texture overlay
  Card background     →  #ffffff with 2px sketchy border
  Modal background    →  var(--paper-cream)
  Dark section        →  var(--paper-dark)

  TEXT HIERARCHY:
  ───────────────
  H1 / Hero           →  var(--ink-black)  +  Caveat font
  H2 / Section title  →  var(--ink-black)  +  highlight underline
  Body                →  var(--ink-dark)
  Caption / meta      →  var(--ink-light)
  Placeholder         →  var(--ink-ghost)

  ACCENTS:
  ────────
  CTA buttons         →  var(--highlight-yellow) bg + var(--ink-black) text
  Success states      →  var(--highlight-green)
  Opportunity HIGH    →  var(--highlight-orange)
  Competitor insight  →  var(--highlight-blue)
  Pro plan badge      →  var(--highlight-purple)
```

---

## A3. TYPOGRAPHY SYSTEM

```
  FONT STACK — HAND-LETTERING INSPIRED
  ══════════════════════════════════════

  Display / Headings:    "Caveat" (Google Fonts)
  ───────────────────    → Casual handwritten feel
                         → Best for H1, H2, big numbers
                         → Weight: 400–700

  Sub-headings:          "Patrick Hand" (Google Fonts)
  ─────────────          → Cleaner but still hand-feel
                         → Best for H3, card titles
                         → Weight: 400

  Body / UI:             "Nunito" (Google Fonts)
  ──────────             → Rounded, friendly, readable
                         → Best for paragraphs, labels
                         → Weight: 400, 600

  Monospace / Code:      "Fira Code" (Google Fonts)
  ─────────────────      → For code snippets, prompts
                         → Weight: 400, 500

  SCALE:
  ──────
  --text-xs:    12px / 1.4 line-height
  --text-sm:    14px / 1.5
  --text-base:  16px / 1.6
  --text-lg:    18px / 1.6
  --text-xl:    22px / 1.4
  --text-2xl:   28px / 1.3
  --text-3xl:   36px / 1.2
  --text-4xl:   48px / 1.1
  --text-hero:  64px / 1.0
  --text-giant: 80px / 0.95
```

### Typography Rules

```
  ✏  Hero headlines use Caveat at 64-80px
     → Slight negative letter-spacing (-0.02em)
     → Mix of normal and bold weight in same line

  ✏  Numbers/stats get extra-large Caveat
     → "78" in 80px, "/100" in 40px same line
     → Creates visual hierarchy like a notebook

  ✏  Section labels use ALL CAPS Nunito
     → 11-12px, letter-spacing: 0.15em
     → Color: var(--ink-light)
     → Acts like a handwritten label

  ✏  Card titles use Patrick Hand 18-22px
     → Not bold, just regular weight
     → Lets the content breathe

  ✏  Underline decoration on key phrases
     → SVG squiggly underline, not CSS underline
     → Color: var(--highlight-yellow) or --pink
```

---

## A4. COMPONENT LIBRARY (HAND-DRAWN STYLE)

### 4.1 Sketchy Card

```css
  /*
   ╭──────────────────────╮
   │                      │
   │   CARD COMPONENT     │ ← Patrick Hand 18px
   │   ──────────────     │ ← squiggly divider SVG
   │   Content here...    │ ← Nunito 15px
   │                      │
   ╰──────────────────────╯
   Shadow offset here →

  CSS:
  .sketch-card {
    background: #ffffff;
    border: 2px solid var(--sketch-border);
    border-radius: 4px 8px 6px 5px;   ← irregular radius
    box-shadow: var(--shadow-sketch);
    padding: 20px 24px;
    transform: rotate(-0.3deg);        ← very slight tilt
    transition: all 0.15s ease;
    position: relative;
  }

  .sketch-card:hover {
    transform: rotate(0deg) translateY(-2px);
    box-shadow: var(--shadow-hover);
  }

  .sketch-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,...");  ← paper texture
    opacity: 0.03;
    pointer-events: none;
  }
  */
```

### 4.2 Highlight Button (Primary CTA)

```css
  /*
   ╔══════════════════════════╗  ← thick sketchy border
   ║  ✦ Analyze My Business   ║  ← Caveat Bold 18px
   ╚══════════════════════════╝
        ▓▓▓▓▓▓▓▓▓▓▓▓▓▓          ← solid offset shadow

  .btn-primary {
    background: var(--highlight-yellow);
    color: var(--ink-black);
    font-family: 'Caveat', cursive;
    font-size: 18px;
    font-weight: 700;
    padding: 14px 32px;
    border: 2.5px solid var(--ink-black);
    border-radius: 3px 7px 4px 6px;   ← hand-drawn corners
    box-shadow: 4px 4px 0px var(--ink-black);
    cursor: pointer;
    transition: all 0.1s ease;
    letter-spacing: 0.01em;
  }

  .btn-primary:hover {
    box-shadow: 2px 2px 0px var(--ink-black);
    transform: translate(2px, 2px);    ← "pressing" effect
  }

  .btn-primary:active {
    box-shadow: 0px 0px 0px var(--ink-black);
    transform: translate(4px, 4px);
  }
  */
```

### 4.3 Opportunity Card

```css
  /*
  ╭─────────────────────────────────────────────────────╮
  │  🔥 HIGH OPPORTUNITY              [Save] [Open →]   │
  │  ─────────────────────────────────────────────────  │
  │  "Creators frustrated with CapCut limitations"      │
  │                                                     │
  │  📍 r/videoediting    💬 128 comments   ⭐ 9.2/10   │
  │                                                     │
  │  ┌─────────────────────────────────────────────┐    │
  │  │ AI Insight ✏                                │    │
  │  │ "Users want easier subtitle workflows.       │    │
  │  │  High conversion potential."                │    │
  │  └─────────────────────────────────────────────┘    │
  │                                                     │
  │  → Suggested: Create comparison content            │
  ╰─────────────────────────────────────────────────────╯

  Score badge in corner:
  .score-badge {
    position: absolute;
    top: -10px;
    right: 16px;
    background: var(--highlight-orange);
    border: 2px solid var(--ink-black);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    font-family: 'Caveat';
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 2px 2px 0 var(--ink-black);
    transform: rotate(8deg);           ← like a sticker
  }
  */
```

### 4.4 Doodle Decorations (SVG Inline)

```
  ARROW DOODLE:
  ~~~~~~~~~~~~~
      ↗
     /
    ○ ─────────→

  Use for: pointing from headline to CTA

  STAR BURST:
  ~~~~~~~~~~~
      *
    * ✦ *       ← scattered around hero text
      *

  UNDERLINE SQUIGGLE:
  ~~~~~~~~~~~~~~~~~~~
  ~~~~~~~~~~~~~~~~~~~  ← SVG path under key phrases

  CIRCLE EMPHASIS:
  ~~~~~~~~~~~~~~~~
     ╭───╮
    (  X  )      ← circling important numbers
     ╰───╯

  BRACKET ANNOTATION:
  ~~~~~~~~~~~~~~~~~~~
  {  important  }  ← curly brace around key stat

  HOW TO USE:
  ── All decorations are absolutely positioned SVGs
  ── Opacity 0.6-0.8 so they don't overpower content
  ── Scale and rotate randomly (rotate: 5deg, -3deg, etc.)
  ── They appear in hero, section headers, and empty states
```

### 4.5 Progress/Loading State

```
  PIPELINE LOADING ANIMATION:
  ════════════════════════════

  ┌──────────────────────────────────────────┐
  │                                          │
  │   ⠋  Finding communities...             │
  │   ✓  Communities found!                  │
  │   ⠹  Analyzing competitors...           │
  │   ○  Detecting opportunities            │
  │   ○  Building growth strategy            │
  │                                          │
  │         ████████████░░░░░  65%           │
  │                                          │
  │   "Usually takes 20-35 seconds ☕"       │
  └──────────────────────────────────────────┘

  Each step animates in with:
  → checkmark draws itself (SVG stroke animation)
  → spinner is a hand-drawn circle SVG rotating
  → text typewriters in character by character
  → progress bar has hand-drawn strokes, not smooth
```

---

## A5. LANDING PAGE — FULL UX SPEC

### 5.1 Navbar

```
  ┌─────────────────────────────────────────────────────────────┐
  │                                                             │
  │  ✦ AI Distro Engine          Pricing    Demo    Login       │
  │                                              [Start Free →] │
  │                                                             │
  └─────────────────────────────────────────────────────────────┘

  STYLE NOTES:
  ─────────────
  · Logo: "AI Distro" in Caveat Bold 24px, "Engine" smaller 18px
  · Logo has a hand-drawn star/spark SVG next to it
  · Nav links: Nunito 14px, var(--ink-light)
  · CTA button: var(--highlight-yellow) sketchy btn
  · Navbar has NO shadow, NO border — just a subtle paper texture
  · On scroll: sticky, tiny paper crumple effect on top edge
  · Mobile: hamburger icon is 3 rough hand-drawn lines
```

### 5.2 Hero Section

```
  ┌──────────────────────────────────────────────────────────────────┐
  │                                                                  │
  │   BIG DOODLE ARROW →                                            │
  │                                                                  │
  │   Find where your                              ╭──────────────╮ │
  │   customers                              ~~~~ →│ LIVE EXAMPLE │ │
  │   ~~already hang out.~~               squiggly │ SIGNAL CARD  │ │
  │   ════════════════════ ← yellow highlight      │              │ │
  │                                                ╰──────────────╯ │
  │   Discover Reddit communities, growth                           │
  │   opportunities, competitor strategies,                         │
  │   and content ideas — automatically.                            │
  │                                                                  │
  │   ╔════════════════════════╗  ← sketchy border                 │
  │   ║ ✦ Analyze My Business  ║                                    │
  │   ╚════════════════════════╝   [View Demo Report →]            │
  │        Shadow block ↓                                           │
  │                                                                  │
  │   ── 340 founders using this week ── ← hand-drawn stat strip   │
  │                                                                  │
  └──────────────────────────────────────────────────────────────────┘

  HERO ANIMATIONS (on load):
  ──────────────────────────
  0ms:    paper texture fades in
  100ms:  headline letters drop in one by one (stagger 30ms)
  400ms:  squiggly underline draws itself (SVG stroke-dashoffset)
  600ms:  subtext fades up
  800ms:  CTA button bounces in (spring animation)
  1000ms: example card slides in from right
  1200ms: decorative doodles pop in (stars, arrows)
  1500ms: social proof strip slides up
```

### 5.3 Social Proof Cards (Animated ticker)

```
  ════════════════════════════════════════════════════════
  AUTO-SCROLLING TICKER — infinite loop, pauses on hover
  ════════════════════════════════════════════════════════

  ╭────────────────────────────────╮  ╭────────────────────────────────╮
  │ 🔥 Opportunity Found           │  │ 🎯 Competitor Insight          │
  │ ──────────────────────         │  │ ──────────────────────────     │
  │ "23 founders discussing AI     │  │ "F5bot users frustrated with   │
  │  video tools in r/SaaS"        │  │  no AI context — gap found"    │
  │                                │  │                                │
  │ r/SaaS · 89 comments          │  │ 47 complaints this week        │
  ╰────────────────────────────────╯  ╰────────────────────────────────╯

  STYLE:
  · Cards rotate between -1deg and +1.5deg randomly
  · Each card has different highlight color (orange, blue, green)
  · Ticker has no background — floats on paper texture
  · Fade-out gradient on left and right edges
  · Speed: 40px/second, eases on hover pause
```

### 5.4 How It Works Section

```
  ════════════════════════════════════════════════════════
  HOW IT WORKS — 3 STEP VISUAL
  ════════════════════════════════════════════════════════

  Section header: "How it works✨" in Caveat 48px
  Sub: "Three steps. Real intelligence." in Nunito

           ①                    ②                    ③
  ╭────────────────╮   ╭────────────────╮   ╭────────────────╮
  │                │   │                │   │                │
  │  📝 You Tell   │   │  🔍 We Hunt    │   │  ⚡ You Act    │
  │  Us Your Idea  │   │  The Internet  │   │  On Real Data  │
  │                │   │                │   │                │
  │  Business name │   │ Tavily searches│   │ PRD, roadmap,  │
  │  audience,     │   │ across Reddit, │   │ marketing plan,│
  │  competitors,  │ → │ HN, Quora,     │ → │ landing copy,  │
  │  goals, region │   │ IndieHackers   │   │ build stack,   │
  │                │   │ + Groq AI      │   │ Bolt prompts   │
  ╰────────────────╯   ╰────────────────╯   ╰────────────────╯
    rotate: -1deg         rotate: 0.5deg       rotate: -0.5deg
    shadow-offset: ↘      shadow-offset: ↘     shadow-offset: ↘

  Arrows between steps are hand-drawn SVG arrows
  Numbers ①②③ are Caveat 48px in circle outlines

  Animation: cards scroll-reveal with stagger
  → Each card fades + slides up when entering viewport
```

### 5.5 Output Preview Section (What You Get)

```
  ════════════════════════════════════════════════════════
  "HERE'S WHAT YOU GET" — TAB PREVIEW
  ════════════════════════════════════════════════════════

  Section in DARK BACKGROUND (var(--paper-dark))
  Header: "Everything your idea needs to survive." — Caveat white 52px

  Tab switcher (hand-drawn style — like folder tabs):

  [📋 PRD] [🗺️ Roadmap] [🚀 Marketing] [🛠️ Stack] [⚡ Prompts]

  Tab style:
  · Active tab: paper-white bg, 2px border, slightly raised
  · Inactive tabs: paper-mid bg, slightly lower z-index
  · Clicking tabs = smooth content crossfade (0.2s)

  Content area for each tab:
  · Looks like actual notebook paper
  · Horizontal ruled lines as background
  · Content typed in Caveat/Patrick Hand fonts
  · Red margin line on left side (like real notebook)

  PRD TAB EXAMPLE:
  ╭─────────────────────────────────────────────────────────────╮
  │ │                                                           │
  │ │  PRODUCT: SignalLoop                                      │
  │ │  ────────────────────────                                 │
  │ │                                                           │
  │ │  PROBLEM: Founders miss buying signals on Reddit          │
  │ │           because manual monitoring = exhausting          │
  │ │                                                           │
  │ │  SOLUTION: AI-powered signal detection that tells        │
  │ │            you what to do, not just what happened        │
  │ │                                                           │
  │ │  MVP FEATURES:                                            │
  │ │  ✅ Keyword monitoring (Reddit + HN)                      │
  │ │  ✅ AI signal scoring                                      │
  │ │  ✅ Reply templates                                        │
  │ │  ✅ Real-time alerts                                       │
  │ │                                                           │
  ╰─────────────────────────────────────────────────────────────╯
```

### 5.6 Pricing Preview Section

```
  Section header: "Simple pricing. No surprises." — Caveat 48px
  Tiny annotation below: "← seriously, no hidden fees" (hand-drawn arrow + text)

  ╭─────────────────╮   ╭─────────────────╮   ╭─────────────────╮
  │                 │   │  ★ POPULAR ★    │   │                 │
  │    FREE         │   │                 │   │     PRO         │
  │    ────         │   │    STARTER      │   │     ───         │
  │    ₹0           │   │    ────────     │   │    ₹999         │
  │    /month       │   │    ₹499/mo      │   │    /month       │
  │                 │   │                 │   │                 │
  │  1 report/mo    │   │  20 reports/mo  │   │  50 reports/mo  │
  │  1 competitor   │   │  5 competitors  │   │  Advanced AI    │
  │  Basic intel    │   │  Opp feed       │   │  Monitoring     │
  │                 │   │  Saved opps     │   │  Priority queue │
  │  [Start Free]   │   │  [Get Starter]  │   │   [Go Pro →]   │
  ╰─────────────────╯   ╰─────────────────╯   ╰─────────────────╯
  rotate: -0.5deg       rotate: 0deg          rotate: 0.5deg
  shadow: 3px 3px       shadow: 5px 5px       shadow: 3px 3px
                        scale: 1.03           (slightly larger)

  POPULAR badge:
  · "★ POPULAR ★" in Caveat, yellow bg, rotated 3deg
  · Positioned outside top edge of card
  · Hand-drawn star characters (not emojis)
```

---

## A6. AUTH FLOW — UX SPEC

```
  ════════════════════════════════════════════════════════
  /login — AUTH PAGE
  ════════════════════════════════════════════════════════

  Background: full-page paper texture with scattered
              light doodles (faint stars, arrows, circles)

  Center card (max-width 420px):
  ╭────────────────────────────────────────────────╮
  │                                                │
  │   ✦ AI Distro Engine                           │
  │   ─────────────────                            │
  │                                                │
  │   "Welcome back, founder."         ← Caveat    │
  │                                                │
  │   ┌──────────────────────────────────────┐     │
  │   │ 📧  your@email.com                   │     │
  │   └──────────────────────────────────────┘     │
  │                                                │
  │   ┌──────────────────────────────────────┐     │
  │   │ 🔒  ••••••••••                       │     │
  │   └──────────────────────────────────────┘     │
  │                                                │
  │   ╔══════════════════════════════════════╗     │
  │   ║       Sign In →                      ║     │
  │   ╚══════════════════════════════════════╝     │
  │                                                │
  │   ───── or ─────                              │
  │                                                │
  │   [  G  Continue with Google  ]                │
  │                                                │
  │   New here? Start free →                       │
  ╰────────────────────────────────────────────────╯

  STYLE NOTES:
  · Card has sketchy border, slight shadow
  · Input fields: bottom-border only (underline style), not box
  · Input underline draws to full width on focus (animated)
  · "or" divider: hand-drawn horizontal lines
  · Google button: white with hand-drawn border, Google colors
  · Error states: red squiggly underline on invalid fields
```

---

## A7. ONBOARDING FLOW — UX SPEC

```
  ════════════════════════════════════════════════════════
  /onboarding — 3 STEP WIZARD
  ════════════════════════════════════════════════════════

  PROGRESS INDICATOR (top):
  ○──────●──────○   ← hand-drawn dots + connecting lines
  1      2      3
  "Tell us"  "Competitors"  "Platforms"

  STEP 1 — BUSINESS INFO:
  ╭────────────────────────────────────────────────────────╮
  │                                                        │
  │   Step 1 of 3                                          │
  │                                                        │
  │   "Tell us about your                                  │
  │    ~~idea~~."          ← squiggly underline on "idea" │
  │   ═══════════════                                      │
  │                                                        │
  │   Business Name                                        │
  │   ─────────────────────────────────────────           │
  │   SignalLoop                                           │
  │                                                        │
  │   What does it do? (describe freely)                   │
  │   ┌────────────────────────────────────────────────┐   │
  │   │ AI tool that monitors Reddit for buying        │   │
  │   │ signals and alerts founders in real-time...    │   │
  │   └────────────────────────────────────────────────┘   │
  │   ↑ This is the key field — free text, Groq enriches  │
  │                                                        │
  │   Category         Target Audience                     │
  │   [SaaS ▼]         [SaaS founders, indie hackers    ]  │
  │                                                        │
  │   Primary Goal     Region                              │
  │   ○ Leads          [Global ▼]                          │
  │   ● Traffic                                            │
  │   ○ Brand                                              │
  │                                                        │
  │              [Continue →]                              │
  ╰────────────────────────────────────────────────────────╯

  STEP 2 — COMPETITORS:
  ╭────────────────────────────────────────────────────────╮
  │                                                        │
  │   "Who are you up against?"                            │
  │   ══════════════════════════                           │
  │                                                        │
  │   Add competitors or similar tools:                    │
  │                                                        │
  │   [F5bot          ] [×]                                │
  │   [Mention.com    ] [×]                                │
  │   [TrackReddit    ] [×]                                │
  │   [+ Add another  ]                                    │
  │                                                        │
  │   FREE: 1 competitor max                               │
  │   💡 Upgrade for 5 competitors                         │
  │                                                        │
  │   [← Back]                    [Continue →]            │
  ╰────────────────────────────────────────────────────────╯

  STEP 3 — PLATFORMS:
  ╭────────────────────────────────────────────────────────╮
  │                                                        │
  │   "Where should we look?"                              │
  │   ══════════════════════                               │
  │                                                        │
  │   ╔═══════════════╗  ○ LinkedIn                        │
  │   ║ [x] Reddit    ║  ○ X/Twitter                       │
  │   ╚═══════════════╝  ○ YouTube        ← grayed out    │
  │   "AI-powered ✓"     ○ IndieHackers   ← grayed out    │
  │                                                        │
  │   Note below grayed options:                           │
  │   "Coming soon — Reddit is the goldmine anyway 🎯"    │
  │                                                        │
  │   [← Back]     [🚀 Generate My Report]                │
  │                                                        │
  │   Tiny text: "Takes 20-35 seconds. We'll show progress"│
  ╰────────────────────────────────────────────────────────╯

  AFTER SUBMIT — PIPELINE LOADING SCREEN:
  Full-page with animated steps (see A4.5)
  Background: paper texture with animated doodles drawing themselves
  Center: progress steps + estimated time + fun copy
```

---

## A8. DASHBOARD — FULL UX SPEC

### 8.1 Sidebar Navigation

```
  ┌──────────────────────┐
  │  ✦ AI Distro         │  ← Logo, Caveat 20px
  │  ──────────────────  │
  │                      │
  │  ▸ Dashboard         │  ← active: yellow bg + left border
  │    Opportunities     │
  │    Competitors       │
  │    Reports           │
  │    Saved             │
  │  ──────────────────  │
  │    Billing           │
  │    Settings          │
  │                      │
  │  ──────────────────  │
  │  PLAN: Starter       │  ← plan badge
  │  Reports: 12/20      │  ← usage bar
  │  ████████░░ 60%      │
  │  [Upgrade →]         │
  └──────────────────────┘

  STYLE:
  · Sidebar width: 220px
  · Background: var(--paper-cream) with subtle left border
  · Active item: sketchy yellow highlight, slight rotation
  · Usage bar: hand-drawn progress bar (SVG rect, not CSS)
  · Upgrade button: tiny yellow sketchy button
```

### 8.2 Top Header Bar

```
  ┌─────────────────────────────────────────────────────────────┐
  │  SignalLoop  ▾                🔔   [Upgrade to Pro]  [😊]   │
  └─────────────────────────────────────────────────────────────┘

  · Business name dropdown (if multiple businesses)
  · Bell icon: hand-drawn, notification dot (orange)
  · Upgrade CTA: only shows if not Pro
  · Avatar: initials in sketchy circle
```

### 8.3 Main Dashboard — Content Layout

```
  ════════════════════════════════════════════════════════
  DASHBOARD HOME (/dashboard)
  ════════════════════════════════════════════════════════

  ROW 1 — GROWTH SCORE (full-width card):
  ╭────────────────────────────────────────────────────────╮
  │                                                        │
  │  "Your Growth Opportunity Score"  ← Patrick Hand       │
  │                                                        │
  │      ╭────────╮                                        │
  │     ( 78/100  ) ← big Caveat in sketchy circle        │
  │      ╰────────╯                                        │
  │       rotate(2deg), orange border                      │
  │                                                        │
  │   ✅ Strong Reddit demand detected                      │
  │   ✅ Competitor gap identified (F5bot weakness)         │
  │   ⚡ 2 high-priority opportunities waiting             │
  │                                                        │
  ╰────────────────────────────────────────────────────────╯

  ROW 2 — 3 STAT CARDS:
  ╭──────────────╮  ╭──────────────╮  ╭──────────────╮
  │  Pain Points │  │  Demand      │  │  Competitor  │
  │  Found       │  │  Signal      │  │  Gaps        │
  │              │  │              │  │              │
  │    "5"       │  │   "HIGH"     │  │    "3"       │
  │   ─────      │  │   ──────     │  │   ─────      │
  │  this week   │  │  strong ✅   │  │  identified  │
  ╰──────────────╯  ╰──────────────╯  ╰──────────────╯
  All three rotate slightly differently (-0.5, 0.3, -0.3 deg)

  ROW 3 — TABS (main content area):
  ┌─────────────────────────────────────────────────────────┐
  │  [🔍 Research]  [📋 PRD]  [🚀 Marketing]  [⚡ Prompts]  │
  └─────────────────────────────────────────────────────────┘

  Each tab renders its section (see earlier specs)
  Default open: Research tab (pain points + opportunities)

  ROW 4 — BEST COMMUNITIES (2-col grid):
  ╭──────────────────────────╮  ╭──────────────────────────╮
  │  r/SaaS                  │  │  r/indiehackers          │
  │  ──────                  │  │  ─────────────           │
  │  👥 1.2M members         │  │  👥 400K members         │
  │  📈 Activity: HIGH       │  │  📈 Activity: HIGH       │
  │                          │  │                          │
  │  Why: "Founders discuss  │  │  Why: "Bootstrapped      │
  │  AI tools daily..."      │  │  founders, your ICP"     │
  │                          │  │                          │
  │  Strategy:               │  │  Strategy:               │
  │  · Post case studies     │  │  · Milestone posts       │
  │  · Reply to pain threads │  │  · Show don't tell       │
  │                          │  │                          │
  │  [View Opportunities →]  │  │  [View Opportunities →]  │
  ╰──────────────────────────╯  ╰──────────────────────────╯
```

---

## A9. OPPORTUNITY FEED — UX SPEC

```
  ════════════════════════════════════════════════════════
  /dashboard/opportunities
  ════════════════════════════════════════════════════════

  TOP BAR:
  ┌───────────────────────────────────────────────────────────┐
  │  Opportunities            [Filter ▾]  [Sort ▾]  [🔄]     │
  │  ─────────────                                            │
  │  "18 new this week"  ← Caveat 20px, orange highlight      │
  └───────────────────────────────────────────────────────────┘

  FILTER CHIPS (hand-drawn pill style):
  [🔥 Buying Signal]  [😤 Pain Point]  [🎯 Comp Gap]  [✍️ Content]
  Active chip: filled yellow bg + ink border
  Inactive: outline only

  OPPORTUNITY CARDS (full list):

  ╭─────────────────────────────────────────────────────────────╮  ← score
  │  🔥 BUYING SIGNAL                               ┌──────┐   │  badge
  │                                                 │ 9.2  │   │  floats
  │  "Looking for F5bot alternative with AI"        │ /10  │   │  outside
  │  ─────────────────────────────────────          └──────┘   │  top-right
  │  📍 r/indiehackers  ·  💬 47 comments  ·  ⏰ 2h ago       │
  │                                                             │
  │  ┌─────────────────────────────────────────────────────┐   │
  │  │ ✏ AI Insight                                        │   │
  │  │ Direct competitor complaint thread. Users actively  │   │
  │  │ seeking paid alternative. High conversion potential. │   │
  │  └─────────────────────────────────────────────────────┘   │
  │  Insight box: ruled lines bg, red left border               │
  │                                                             │
  │  → Suggested Action: "Reply with SignalLoop waitlist link" │
  │                                                             │
  │  [💾 Save]      [↗ Open Thread]      [✉️ Get Template]     │
  ╰─────────────────────────────────────────────────────────────╯

  LOCKED CARD (Free plan user):
  ╭─────────────────────────────────────────────────────────────╮
  │  🔥 HIGH OPPORTUNITY                                        │
  │                                                             │
  │  ██████████████████████████████   ← blurred/masked         │
  │  ████████████████                                          │
  │                                                             │
  │        ╔═══════════════════════════╗                       │
  │        ║  🔒 Upgrade to see this   ║                       │
  │        ╚═══════════════════════════╝                       │
  │                                                             │
  ╰─────────────────────────────────────────────────────────────╯
```

---

## A10. REPORT OUTPUT — UX SPEC

```
  ════════════════════════════════════════════════════════
  /dashboard/reports/{id}
  ════════════════════════════════════════════════════════

  REPORT LAYOUT:

  Top: report header card
  ╭─────────────────────────────────────────────────────╮
  │  📋 SignalLoop — Growth Intelligence Report          │
  │  Generated: May 13, 2026                            │
  │  ─────────────────────────────────────────          │
  │  Overall Score: 78/100  ●  Market: STRONG           │
  │                                                     │
  │  [📥 Export PDF]  [🔗 Share]  [🔄 Regenerate]       │
  ╰─────────────────────────────────────────────────────╯

  SECTION TABS (like tabbed notebook):
  ════════════════════════════════════
  [📊 Research] [📋 PRD] [🗺️ Roadmap] [🚀 Marketing]
  [🛠️ Stack] [⚡ Prompts] [✅ Validation]

  Each section renders in notebook paper style:
  · Horizontal ruled lines as background image
  · Red margin line on left
  · Content in Patrick Hand / Caveat fonts
  · Headings circled or underlined with hand-drawn SVG
  · Key stats in large Caveat numbers

  PAIN POINTS SECTION EXAMPLE:
  ╭─────────────────────────────────────────────────────╮
  │ │                                                   │
  │ │  PAIN POINTS                                      │
  │ │  ════════════════════════════════════             │
  │ │                                                   │
  │ │  🔴 Manual monitoring = 2-3 hrs/day              │
  │ │     ─────────────────────────────                 │
  │ │     Evidence: "I spend my mornings ctrl+F-ing     │
  │ │     Reddit..." — r/SaaS (143 upvotes)             │
  │ │     Frequency: 23 threads mention this            │
  │ │     Severity: HIGH                                │
  │ │                                                   │
  │ │  🔴 Alert fatigue from F5bot                      │
  │ │     Evidence: "50 alerts a day, none useful"      │
  │ │     Severity: HIGH                                │
  │ │                                                   │
  │ │  🟡 Always late to the thread                     │
  │ │     Evidence: 8 threads, timing complaints        │
  │ │     Severity: MEDIUM                              │
  │ │                                                   │
  ╰─────────────────────────────────────────────────────╯
```

---

## A11. PRICING PAGE — UX SPEC

```
  ════════════════════════════════════════════════════════
  /pricing
  ════════════════════════════════════════════════════════

  HERO:
  "Simple, honest pricing."    ← Caveat 60px
  "Start free. Upgrade when you're ready." ← Nunito 18px

  Hand-drawn arrow pointing DOWN to cards from headline

  BILLING TOGGLE:
  [Monthly]  ○────●  [Yearly]   ← custom sketchy toggle
  "Save 20%" badge on Yearly, rotated 5deg, green

  CARDS (3 column):
  See pricing preview in A5.6 but more detailed here

  FAQ SECTION (below cards):
  Accordion style, hand-drawn chevron arrows
  Each Q/A pair in sketch card
  Questions like:
  · "Can I cancel anytime?" → Yes, no questions asked.
  · "Is there a free trial?" → Free plan forever.
  · "What if I exceed limits?" → We show upgrade modal, never surprise charge.

  BOTTOM CTA BANNER:
  ╭──────────────────────────────────────────────────────╮
  │                                                      │
  │  "Still thinking? Start free — no card needed."     │
  │                     Caveat 32px                      │
  │                                                      │
  │         [✦ Analyze My Business — Free →]            │
  │                                                      │
  ╰──────────────────────────────────────────────────────╯
  Dark background section, yellow CTA button
```

---

## A12. MOBILE RESPONSIVENESS

```
  BREAKPOINTS:
  ────────────
  Mobile:   < 640px
  Tablet:   640px – 1024px
  Desktop:  > 1024px

  MOBILE ADJUSTMENTS:
  · Sidebar collapses to bottom tab bar (5 icons max)
  · Cards go full-width, slight tilt removed on mobile
  · Hero text: 40px instead of 64px
  · Opportunity cards stack vertically
  · Report tabs become horizontal scroll
  · Doodle decorations: fewer, smaller
  · Sketchy shadows reduced (1px offset instead of 3px)

  BOTTOM TAB BAR (mobile):
  ┌──────────────────────────────────────────────────────┐
  │  🏠        🔥        📋        ⭐        ⚙️          │
  │ Home    Opps     Reports   Saved    Settings         │
  └──────────────────────────────────────────────────────┘
  Hand-drawn underline on active tab
```

---

# ╔══════════════════════════════════════════╗
# ║   PART B — BACKEND PIPELINE &           ║
# ║            ARCHITECTURE                 ║
# ╚══════════════════════════════════════════╝

---

## B1. TECH STACK OVERVIEW

```
  ╔══════════════════════════════════════════════════════════╗
  ║  TECHNOLOGY STACK — AI DISTRIBUTION ENGINE              ║
  ╠══════════════════════════════════════════════════════════╣
  ║                                                          ║
  ║  FRONTEND          Next.js 14 (App Router)               ║
  ║                    TailwindCSS                           ║
  ║                    shadcn/ui (customized sketchy)        ║
  ║                    React Query (data fetching)           ║
  ║                    Framer Motion (animations)            ║
  ║                    Hosting: Vercel                       ║
  ║                                                          ║
  ║  BACKEND           Flask (Python 3.11+)                  ║
  ║                    Gunicorn (WSGI server)                ║
  ║                    APScheduler (background jobs)         ║
  ║                    Hosting: Railway                      ║
  ║                                                          ║
  ║  DATABASE          Supabase (PostgreSQL)                 ║
  ║                    Supabase Auth (JWT)                   ║
  ║                    Supabase Realtime (polling fallback)  ║
  ║                                                          ║
  ║  AI                Groq API (llama-3.3-70b + 3.1-8b)    ║
  ║                                                          ║
  ║  SEARCH            Tavily API (Advanced + Basic mix)     ║
  ║                                                          ║
  ║  PAYMENTS          Razorpay                              ║
  ║                                                          ║
  ║  EMAIL             Resend API                            ║
  ║                                                          ║
  ╚══════════════════════════════════════════════════════════╝
```

---

## B2. PROJECT FOLDER STRUCTURE

```
  backend/
  │
  ├── app.py                     ← Flask app factory, register blueprints
  ├── config.py                  ← env vars, plan limits, constants
  ├── requirements.txt
  │
  ├── routes/
  │   ├── __init__.py
  │   ├── auth.py                ← /auth/verify-token
  │   ├── onboarding.py          ← /onboarding/submit (triggers pipeline)
  │   ├── pipeline.py            ← /pipeline/status/{job_id}
  │   ├── reports.py             ← /reports/list, /reports/{id}
  │   ├── opportunities.py       ← /opportunities/feed, /opportunities/save
  │   ├── competitors.py         ← /competitors/add, /competitors/insights
  │   ├── digest.py              ← /digest/latest
  │   ├── billing.py             ← /billing/create-order, /billing/webhook
  │   └── usage.py               ← /usage/current, /usage/check
  │
  ├── services/
  │   ├── __init__.py
  │   ├── groq_service.py        ← all Groq API calls
  │   ├── tavily_service.py      ← all Tavily search calls
  │   ├── report_service.py      ← orchestrates report generation
  │   ├── opportunity_service.py ← extracts + scores opportunities
  │   ├── competitor_service.py  ← competitor intelligence
  │   ├── digest_service.py      ← weekly digest generation
  │   ├── billing_service.py     ← Razorpay integration
  │   ├── email_service.py       ← Resend email triggers
  │   └── usage_service.py       ← plan enforcement
  │
  ├── pipeline/
  │   ├── __init__.py
  │   ├── orchestrator.py        ← main pipeline runner (async)
  │   ├── stage1_enrich.py       ← Context Enrichment
  │   ├── stage2_search.py       ← Tavily searches
  │   ├── stage3_analyze.py      ← Pain point analysis
  │   ├── stage4_competitors.py  ← Competitor intelligence
  │   ├── stage5_report.py       ← Master report generation
  │   ├── stage6_opportunities.py← Opportunity extraction
  │   └── stage7_memory.py       ← Memory update
  │
  ├── jobs/
  │   ├── __init__.py
  │   ├── weekly_digest.py       ← Runs every Monday 9 AM
  │   ├── opportunity_scanner.py ← Runs every 6 hours (Starter+Pro)
  │   └── competitor_monitor.py  ← Runs daily (Pro only)
  │
  ├── prompts/
  │   ├── enrich_context.txt     ← Stage 1 Groq prompt
  │   ├── pain_analysis.txt      ← Stage 3 Groq prompt
  │   ├── competitor_analysis.txt← Stage 4 Groq prompt
  │   ├── prd_generation.txt     ← Stage 5a Groq prompt
  │   ├── marketing_strategy.txt ← Stage 5b Groq prompt
  │   ├── build_stack.txt        ← Stage 5c Groq prompt
  │   ├── opportunity_extract.txt← Stage 6 Groq prompt
  │   └── weekly_digest.txt      ← Digest Groq prompt
  │
  ├── models/
  │   ├── __init__.py
  │   └── schemas.py             ← Pydantic models for validation
  │
  └── utils/
      ├── __init__.py
      ├── validators.py          ← Input validation
      ├── cache.py               ← In-memory TTL cache
      ├── limiter.py             ← Rate limiter
      ├── chunker.py             ← Text chunking for large Tavily results
      └── job_tracker.py         ← Pipeline job status tracking
```

---

## B3. DATABASE SCHEMA (SUPABASE)

```sql
  -- ═══════════════════════════════════════════════════════
  -- TABLE: users
  -- ═══════════════════════════════════════════════════════
  CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT UNIQUE NOT NULL,
    name          TEXT,
    plan          TEXT DEFAULT 'free'
                  CHECK (plan IN ('free', 'starter', 'pro')),
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at  TIMESTAMPTZ DEFAULT NOW()
  );

  -- ═══════════════════════════════════════════════════════
  -- TABLE: businesses
  -- ═══════════════════════════════════════════════════════
  CREATE TABLE businesses (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name    TEXT NOT NULL,
    website          TEXT,
    category         TEXT,
    description      TEXT,              -- free-text idea description (KEY FIELD)
    target_audience  TEXT,
    goal             TEXT,
    region           TEXT DEFAULT 'Global',
    enriched_context JSONB,            -- Groq Stage 1 output stored here
    created_at       TIMESTAMPTZ DEFAULT NOW()
  );

  -- ═══════════════════════════════════════════════════════
  -- TABLE: pipeline_jobs
  -- ═══════════════════════════════════════════════════════
  CREATE TABLE pipeline_jobs (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id    UUID REFERENCES businesses(id),
    user_id        UUID REFERENCES users(id),
    status         TEXT DEFAULT 'pending'
                   CHECK (status IN ('pending','running','completed','failed')),
    current_stage  TEXT,               -- "stage1", "stage2", etc.
    progress_pct   INTEGER DEFAULT 0,  -- 0-100
    error_message  TEXT,
    started_at     TIMESTAMPTZ DEFAULT NOW(),
    completed_at   TIMESTAMPTZ
  );

  -- ═══════════════════════════════════════════════════════
  -- TABLE: reports
  -- ═══════════════════════════════════════════════════════
  CREATE TABLE reports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id     UUID REFERENCES businesses(id),
    job_id          UUID REFERENCES pipeline_jobs(id),
    report_type     TEXT DEFAULT 'full_analysis',
    -- Sub-documents stored as JSONB fields:
    pain_points     JSONB,             -- array of pain point objects
    demand_signals  JSONB,             -- demand analysis object
    competitor_gaps JSONB,             -- competitor gap array
    prd             JSONB,             -- full PRD object
    roadmap         JSONB,             -- feature roadmap object
    marketing       JSONB,             -- marketing strategy object
    build_stack     JSONB,             -- recommended stack object
    prompts         JSONB,             -- cursor/v0/bolt prompts
    validation      JSONB,             -- validation checklist
    growth_score    INTEGER,           -- 0-100 score
    created_at      TIMESTAMPTZ DEFAULT NOW()
  );

  -- ═══════════════════════════════════════════════════════
  -- TABLE: opportunities
  -- ═══════════════════════════════════════════════════════
  CREATE TABLE opportunities (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id         UUID REFERENCES businesses(id),
    title               TEXT NOT NULL,
    source_url          TEXT,
    source_platform     TEXT DEFAULT 'reddit',
    subreddit           TEXT,
    engagement_count    INTEGER DEFAULT 0,
    opportunity_score   DECIMAL(3,1),  -- 0.0 to 10.0
    opportunity_type    TEXT
                        CHECK (opportunity_type IN (
                          'buying_signal','pain_point',
                          'competitor_gap','content_idea'
                        )),
    ai_insight          TEXT,          -- 1-2 sentence AI summary
    suggested_action    TEXT,          -- what to do
    raw_snippet         TEXT,          -- original text snippet from search
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMPTZ DEFAULT NOW()
  );

  -- ═══════════════════════════════════════════════════════
  -- TABLE: saved_opportunities
  -- ═══════════════════════════════════════════════════════
  CREATE TABLE saved_opportunities (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    opportunity_id  UUID REFERENCES opportunities(id),
    saved_at        TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, opportunity_id)
  );

  -- ═══════════════════════════════════════════════════════
  -- TABLE: competitors
  -- ═══════════════════════════════════════════════════════
  CREATE TABLE competitors (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id      UUID REFERENCES businesses(id),
    competitor_name  TEXT NOT NULL,
    website          TEXT,
    analysis         JSONB,            -- competitor intelligence object
    last_analyzed_at TIMESTAMPTZ,
    created_at       TIMESTAMPTZ DEFAULT NOW()
  );

  -- ═══════════════════════════════════════════════════════
  -- TABLE: usage_tracking
  -- ═══════════════════════════════════════════════════════
  CREATE TABLE usage_tracking (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID REFERENCES users(id) UNIQUE,
    reports_used        INTEGER DEFAULT 0,
    competitors_used    INTEGER DEFAULT 0,
    monthly_reset_date  DATE DEFAULT (date_trunc('month', NOW()) + INTERVAL '1 month')::DATE
  );

  -- ═══════════════════════════════════════════════════════
  -- TABLE: weekly_digests
  -- ═══════════════════════════════════════════════════════
  CREATE TABLE weekly_digests (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id  UUID REFERENCES businesses(id),
    new_opps     INTEGER DEFAULT 0,
    rising_keywords JSONB,
    competitor_trends JSONB,
    top_action   TEXT,
    digest_data  JSONB,               -- full digest object
    week_of      DATE,
    created_at   TIMESTAMPTZ DEFAULT NOW()
  );

  -- ═══════════════════════════════════════════════════════
  -- TABLE: business_memory
  -- ═══════════════════════════════════════════════════════
  CREATE TABLE business_memory (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id         UUID REFERENCES businesses(id) UNIQUE,
    keywords            JSONB,         -- expanded keyword list
    icp_description     TEXT,          -- ideal customer profile
    problem_hypotheses  JSONB,         -- top 3 hypotheses
    market_category     TEXT,
    tavily_cache        JSONB,         -- cached search results (TTL managed in app)
    cache_updated_at    TIMESTAMPTZ,
    updated_at          TIMESTAMPTZ DEFAULT NOW()
  );

  -- ═══════════════════════════════════════════════════════
  -- TABLE: subscriptions
  -- ═══════════════════════════════════════════════════════
  CREATE TABLE subscriptions (
    id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                    UUID REFERENCES users(id) UNIQUE,
    plan                       TEXT DEFAULT 'free',
    razorpay_customer_id       TEXT,
    razorpay_subscription_id   TEXT,
    razorpay_payment_id        TEXT,
    status                     TEXT DEFAULT 'active'
                               CHECK (status IN ('active','cancelled','past_due','trialing')),
    renewal_date               TIMESTAMPTZ,
    cancelled_at               TIMESTAMPTZ,
    created_at                 TIMESTAMPTZ DEFAULT NOW()
  );

  -- ═══════════════════════════════════════════════════════
  -- TABLE: action_log
  -- ═══════════════════════════════════════════════════════
  CREATE TABLE action_log (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID REFERENCES users(id),
    business_id  UUID REFERENCES businesses(id),
    action_type  TEXT,                 -- 'report_generated', 'opp_saved', etc.
    metadata     JSONB,
    created_at   TIMESTAMPTZ DEFAULT NOW()
  );

  -- Row Level Security
  ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
  ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
  ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
  -- (Add RLS policies for each table based on user_id)
```

---

## B4. ONBOARDING → PIPELINE TRIGGER

```
  FLOW OVERVIEW:
  ══════════════

  Frontend (Next.js)            Backend (Flask)
  ──────────────────            ───────────────

  User clicks "Generate"
       │
       ▼
  POST /onboarding/submit
  {
    business_name: "SignalLoop",
    description: "AI tool that monitors...",
    category: "SaaS",
    target_audience: "SaaS founders",
    goal: "Leads",
    region: "Global",
    competitors: ["F5bot", "Mention.com"],
    platforms: ["reddit"]
  }
       │
       │ ─────────────────────────────────────────→
       │                                           │
       │                              1. Validate auth token
       │                              2. Check usage limits
       │                              3. Create business record
       │                              4. Create pipeline_job record
       │                              5. Spawn background thread
       │                              6. Return {job_id, status: "started"}
       │
       │ ←─────────────────────────────────────────
       │
  Frontend receives job_id
  Redirect to loading screen
  Begin polling:
  GET /pipeline/status/{job_id}
  every 2 seconds
       │
       │ ─── polls every 2s ────────────────────→
       │                           Returns:
       │                           {
       │                             status: "running",
       │                             stage: "stage3_analysis",
       │                             progress: 60,
       │                             message: "Analyzing pain points..."
       │                           }
       │ ←─────────────────────────────────────────
       │
  Frontend updates animated steps
  When status = "completed":
  Redirect to /dashboard
```

```python
  # routes/onboarding.py

  @onboarding_bp.route('/submit', methods=['POST'])
  @require_auth                        # Supabase JWT verification
  @check_usage_limit('reports')        # Decorator checks plan limits
  def submit_onboarding():

      data = request.json
      user_id = g.user_id              # Set by require_auth decorator

      # 1. Create business record
      business = create_business(user_id, data)

      # 2. Add competitors (respects plan limit)
      plan = get_user_plan(user_id)
      max_competitors = PLAN_LIMITS[plan]['competitors']
      competitors = data.get('competitors', [])[:max_competitors]
      create_competitors(business.id, competitors)

      # 3. Create pipeline job
      job = create_pipeline_job(business.id, user_id)

      # 4. Spawn background thread for pipeline
      thread = threading.Thread(
          target=run_pipeline,
          args=(job.id, business.id, user_id, data)
      )
      thread.daemon = True
      thread.start()

      # 5. Increment usage
      increment_usage(user_id, 'reports')

      return jsonify({
          'job_id': str(job.id),
          'status': 'started',
          'message': 'Pipeline started'
      }), 202
```

---

## B5. STAGE 1 — CONTEXT ENRICHMENT (GROQ)

```
  PURPOSE:
  ════════
  Transform raw onboarding data into structured intelligence
  that all subsequent stages use as their foundation.

  INPUT:  Raw user form data
  OUTPUT: Enriched context object (stored in business_memory table)

  MODEL: llama-3.3-70b (smart reasoning needed)
  TAVILY CREDITS: 0 (no search yet)
  GROQ TOKENS: ~800 input, ~600 output
  TIME: ~2-3 seconds
```

```python
  # pipeline/stage1_enrich.py

  def run_stage1_enrichment(business_data: dict, job_id: str) -> dict:
      """
      Takes raw onboarding data, returns enriched context.
      """
      update_job_status(job_id, 'stage1_enrich', 10,
                        'Understanding your business...')

      prompt = load_prompt('enrich_context.txt')
      user_message = f"""
      Business Name: {business_data['business_name']}
      Description: {business_data['description']}
      Category: {business_data['category']}
      Target Audience: {business_data['target_audience']}
      Goal: {business_data['goal']}
      Region: {business_data['region']}
      Competitors: {', '.join(business_data.get('competitors', []))}

      Return a JSON object with these exact keys:
      - expanded_keywords (list of 8-12 search keywords)
      - icp_description (2-3 sentence ideal customer profile)
      - problem_hypotheses (list of 3 specific problem statements)
      - market_category (e.g., "Social Listening SaaS")
      - business_model_guess (e.g., "B2B SaaS, monthly subscription")
      - search_angles (list of 5 angles for finding pain points online)
      - competitor_search_queries (list of 4 queries for finding competitor complaints)

      Respond ONLY with valid JSON. No markdown, no preamble.
      """

      response = call_groq(
          model='llama-3.3-70b-versatile',
          system_prompt=prompt,
          user_message=user_message,
          max_tokens=800,
          temperature=0.3    # Low temp for consistent structured output
      )

      enriched = parse_json_safely(response)

      # Store in business_memory table
      save_business_memory(business_data['business_id'], enriched)

      update_job_status(job_id, 'stage1_enrich', 20,
                        'Business context mapped ✓')

      return enriched
```

```
  PROMPT FILE: prompts/enrich_context.txt
  ════════════════════════════════════════

  You are an expert startup analyst and market researcher.
  Your job is to understand a startup idea and map out:
  1. Who the ideal customer is
  2. What specific problems they face
  3. What keywords they would use when complaining online
  4. How to find buying signals for this type of product

  Be specific. Avoid generic answers.
  Think like a founder who manually researches Reddit every day.
  Return ONLY valid JSON with no extra text.
```

---

## B6. STAGE 2 — TAVILY SEARCH STRATEGY

```
  PURPOSE:
  ════════
  Use enriched context to run targeted searches.
  Gather raw data from Reddit, HN, Quora, IndieHackers.

  INPUT:  Enriched context from Stage 1
  OUTPUT: Raw search results dict (cached in business_memory)

  SEARCH MIX:
  ───────────
  First report:   5 Advanced searches = 10 Tavily credits
  Weekly refresh: 4 Basic searches   =  4 Tavily credits

  TIME: ~8-15 seconds (parallel execution)
```

```python
  # pipeline/stage2_search.py

  import concurrent.futures

  def run_stage2_searches(enriched: dict, competitors: list,
                           job_id: str) -> dict:
      """
      Runs all Tavily searches in parallel for speed.
      Returns dict of search_type → results.
      """
      update_job_status(job_id, 'stage2_search', 25,
                        'Hunting across Reddit and forums...')

      keywords = enriched['expanded_keywords']
      search_angles = enriched['search_angles']
      competitor_queries = enriched['competitor_search_queries']

      # Build all 5 search queries
      queries = [
          # Query 1: Core pain point discovery (Advanced)
          {
              'query': f'site:reddit.com OR site:news.ycombinator.com '
                       f'{keywords[0]} {keywords[1]} problem frustration',
              'depth': 'advanced',
              'max_results': 10
          },
          # Query 2: Buying signals (Advanced)
          {
              'query': f'site:reddit.com {keywords[0]} alternative '
                       f'recommendation "looking for" OR "any tool"',
              'depth': 'advanced',
              'max_results': 8
          },
          # Query 3: Competitor complaints (Advanced)
          {
              'query': f'{competitors[0] if competitors else keywords[2]} '
                       f'problems limitations frustrated alternative 2024 2025',
              'depth': 'advanced',
              'max_results': 8
          },
          # Query 4: Market discussion (Basic — less critical)
          {
              'query': f'site:reddit.com {enriched["market_category"]} '
                       f'discussion community founders',
              'depth': 'basic',
              'max_results': 6
          },
          # Query 5: Indie hacker angle (Basic)
          {
              'query': f'site:indiehackers.com OR site:reddit.com/r/indiehackers '
                       f'{keywords[0]} {keywords[3]}',
              'depth': 'basic',
              'max_results': 6
          }
      ]

      # Run all searches in parallel (3 workers max to respect rate limits)
      results = {}
      with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
          futures = {
              executor.submit(call_tavily, q): f'search_{i}'
              for i, q in enumerate(queries)
          }
          for future, key in futures.items():
              try:
                  results[key] = future.result(timeout=15)
              except Exception as e:
                  results[key] = {'results': [], 'error': str(e)}

      # Flatten all results into single list
      all_results = []
      for key, data in results.items():
          for item in data.get('results', []):
              all_results.append({
                  'title': item.get('title', ''),
                  'url': item.get('url', ''),
                  'content': item.get('content', '')[:500],  # truncate
                  'score': item.get('score', 0),
                  'source_type': key
              })

      update_job_status(job_id, 'stage2_search', 45,
                        'Data collected ✓')

      return {
          'raw_results': all_results,
          'total_found': len(all_results),
          'queries_run': len(queries)
      }
```

```python
  # services/tavily_service.py

  import requests

  TAVILY_API_KEY = os.environ['TAVILY_API_KEY']
  TAVILY_BASE_URL = 'https://api.tavily.com/search'

  def call_tavily(query_config: dict) -> dict:
      """
      Makes a single Tavily search call.
      query_config = {query, depth, max_results}
      """
      payload = {
          'api_key': TAVILY_API_KEY,
          'query': query_config['query'],
          'search_depth': query_config.get('depth', 'basic'),
          'max_results': query_config.get('max_results', 5),
          'include_answer': False,       # We want raw results, not Tavily's summary
          'include_raw_content': False,  # Snippets are enough for Groq
          'include_domains': [],
          'exclude_domains': ['wikipedia.org', 'youtube.com']
      }

      response = requests.post(TAVILY_BASE_URL, json=payload, timeout=15)
      response.raise_for_status()
      return response.json()
```

---

## B7. STAGE 3 — PAIN POINT ANALYSIS (GROQ)

```
  PURPOSE:
  ════════
  Feed all Tavily results to Groq in chunks.
  Extract structured pain points with evidence.
  Score market demand strength.

  INPUT:  Raw Tavily search results
  OUTPUT: Structured pain_analysis object

  MODEL: llama-3.3-70b (deep analysis needed)
  GROQ TOKENS: ~2000 input (chunked), ~800 output
  TIME: ~4-6 seconds (chunked calls)
  CHUNKING: 15 results per chunk → 2-3 Groq calls → merge results
```

```python
  # pipeline/stage3_analyze.py

  def run_stage3_pain_analysis(search_results: dict,
                                enriched: dict,
                                job_id: str) -> dict:
      """
      Analyzes raw search results for pain points and demand signals.
      Chunks results to handle large data volumes.
      """
      update_job_status(job_id, 'stage3_analysis', 50,
                        'Analyzing pain points and demand...')

      raw_results = search_results['raw_results']
      chunks = chunk_results(raw_results, chunk_size=15)

      all_pain_points = []
      demand_evidence = []

      # Analyze each chunk
      for i, chunk in enumerate(chunks):
          formatted = format_results_for_groq(chunk)

          prompt = load_prompt('pain_analysis.txt')
          user_message = f"""
          Business Context:
          ─────────────────
          Product: {enriched['market_category']}
          ICP: {enriched['icp_description']}
          Problem hypotheses: {enriched['problem_hypotheses']}

          Search Results to Analyze (chunk {i+1}/{len(chunks)}):
          ────────────────────────────────────────────────────────
          {formatted}

          Extract and return JSON with:
          - pain_points: array of objects with fields:
              * pain (specific problem statement)
              * evidence (direct quote or paraphrase from results)
              * source_url
              * severity (HIGH/MEDIUM/LOW)
              * frequency (how many sources mention this)
          - buying_signals: array of objects with:
              * signal (description of buying intent)
              * evidence
              * source_url
          - demand_score (0-100 integer based on discussion volume + intent)
          - market_size_signals (array of strings about market scale)

          Be specific. Use actual evidence from the results.
          Respond ONLY with valid JSON.
          """

          response = call_groq(
              model='llama-3.3-70b-versatile',
              system_prompt=prompt,
              user_message=user_message,
              max_tokens=1000,
              temperature=0.2
          )

          chunk_analysis = parse_json_safely(response)
          all_pain_points.extend(chunk_analysis.get('pain_points', []))
          demand_evidence.extend(chunk_analysis.get('buying_signals', []))

      # Deduplicate and rank pain points
      ranked_pain_points = deduplicate_and_rank(all_pain_points)

      # Calculate final demand score (average of chunks)
      final_demand_score = calculate_demand_score(ranked_pain_points,
                                                   demand_evidence)

      result = {
          'pain_points': ranked_pain_points[:8],    # Top 8 only
          'buying_signals': demand_evidence[:5],
          'demand_score': final_demand_score,
          'demand_label': score_to_label(final_demand_score),
          'total_sources_analyzed': len(raw_results)
      }

      update_job_status(job_id, 'stage3_analysis', 62,
                        'Pain points extracted ✓')

      return result
```

---

## B8. STAGE 4 — COMPETITOR INTELLIGENCE

```
  PURPOSE:
  ════════
  For each competitor, run targeted search.
  Identify their weaknesses, gaps, and opportunities.

  INPUT:  Competitor list + enriched context
  OUTPUT: Per-competitor analysis with gap insights

  SEARCHES: 1 Basic Tavily per competitor (from weekly budget)
  MODEL: llama-3.3-70b
  TIME: ~3-5 seconds per competitor (parallel)
```

```python
  # pipeline/stage4_competitors.py

  def run_stage4_competitor_analysis(competitors: list,
                                      enriched: dict,
                                      job_id: str) -> dict:
      """
      Analyzes each competitor individually.
      Returns aggregated competitive intelligence.
      """
      update_job_status(job_id, 'stage4_competitors', 65,
                        'Analyzing competitors...')

      competitor_analyses = []

      for competitor in competitors:
          # Search for competitor complaints/weaknesses
          search_result = call_tavily({
              'query': f'{competitor} problems limitations "wish it had" '
                       f'alternative frustrated 2024 2025',
              'depth': 'basic',     # Basic for competitors (lower stake)
              'max_results': 6
          })

          if not search_result.get('results'):
              continue

          formatted = format_results_for_groq(search_result['results'])

          user_message = f"""
          Competitor: {competitor}
          My Product Category: {enriched['market_category']}
          My ICP: {enriched['icp_description']}

          Search results about this competitor:
          {formatted}

          Return JSON with:
          - competitor_name
          - main_weaknesses (list of 3-4 specific weaknesses found)
          - user_complaints (list of 2-3 direct complaint patterns)
          - gap_opportunity (1-2 sentence gap our product can fill)
          - their_strengths (list of 2-3 actual strengths)
          - platform_presence (where they are active)
          - pricing_complaints (any pricing feedback)

          Respond ONLY with valid JSON.
          """

          response = call_groq(
              model='llama-3.3-70b-versatile',
              system_prompt=load_prompt('competitor_analysis.txt'),
              user_message=user_message,
              max_tokens=600,
              temperature=0.2
          )

          analysis = parse_json_safely(response)
          competitor_analyses.append(analysis)

          # Save to competitors table
          save_competitor_analysis(competitor, analysis)

      # Generate overall competitive landscape summary
      landscape_summary = summarize_competitive_landscape(
          competitor_analyses, enriched
      )

      update_job_status(job_id, 'stage4_competitors', 72,
                        'Competitor gaps identified ✓')

      return {
          'competitors': competitor_analyses,
          'landscape_summary': landscape_summary,
          'total_gaps_found': count_gaps(competitor_analyses)
      }
```

---

## B9. STAGE 5 — MASTER REPORT GENERATION

```
  PURPOSE:
  ════════
  Synthesize ALL previous stage outputs into the full report.
  This is split into 3 Groq calls to maintain quality.
  Each call focuses on a different output section.

  INPUT:  Everything from stages 1-4
  OUTPUT: Complete report stored in reports table

  CALL A: PRD + Roadmap + Build Stack (~1200 tokens output)
  CALL B: Marketing + Launch Strategy (~1000 tokens output)
  CALL C: Validation + Prompts + Growth Score (~800 tokens output)

  MODEL: llama-3.3-70b for all calls
  TIME: ~12-18 seconds total (sequential calls)
```

```python
  # pipeline/stage5_report.py

  def run_stage5_master_report(enriched: dict,
                                pain_analysis: dict,
                                competitor_data: dict,
                                business_data: dict,
                                job_id: str) -> dict:

      update_job_status(job_id, 'stage5_report', 75,
                        'Building your growth report...')

      context_block = build_context_block(enriched, pain_analysis,
                                           competitor_data, business_data)

      # ─────────────────────────────────────────────────────
      # CALL A: Product Intelligence (PRD + Roadmap + Stack)
      # ─────────────────────────────────────────────────────
      call_a_message = f"""
      {context_block}

      Generate a JSON object with these keys:

      "prd": {{
        "problem_statement": "...",
        "solution": "...",
        "mvp_features": ["...", "...", "..."],
        "non_features": ["...", "..."],
        "success_metric": "...",
        "unique_angle": "..."
      }},

      "roadmap": {{
        "phase1": {{
          "name": "...",
          "duration": "Week 1-2",
          "features": ["...", "..."],
          "goal": "..."
        }},
        "phase2": {{ ... }},
        "phase3": {{ ... }}
      }},

      "build_stack": {{
        "frontend": "...",
        "backend": "...",
        "database": "...",
        "ai": "...",
        "payments": "...",
        "hosting": "...",
        "why": "...",
        "estimated_cost_per_month": "..."
      }}
      """

      call_a_response = call_groq(
          model='llama-3.3-70b-versatile',
          system_prompt=load_prompt('prd_generation.txt'),
          user_message=call_a_message,
          max_tokens=1500,
          temperature=0.3
      )
      product_data = parse_json_safely(call_a_response)

      update_job_status(job_id, 'stage5_report', 82,
                        'PRD and roadmap ready ✓')

      # ─────────────────────────────────────────────────────
      # CALL B: Marketing & Growth Strategy
      # ─────────────────────────────────────────────────────
      call_b_message = f"""
      {context_block}
      Product PRD: {json.dumps(product_data.get('prd', {}))}

      Generate JSON with:

      "marketing": {{
        "best_channels": [
          {{
            "channel": "r/SaaS",
            "why": "...",
            "content_type": "...",
            "best_time": "...",
            "avoid": "..."
          }}
        ],
        "content_angles": ["...", "...", "..."],
        "hook_templates": ["...", "..."],
        "dms_strategy": "..."
      }},

      "launch_plan": {{
        "week1": ["...", "..."],
        "week2": ["...", "..."],
        "week3": ["...", "..."],
        "week4": ["...", "..."]
      }},

      "pricing_suggestion": {{
        "free_tier": "...",
        "paid_tier_1": {{ "price": "...", "features": ["..."] }},
        "paid_tier_2": {{ "price": "...", "features": ["..."] }},
        "reasoning": "..."
      }}
      """

      call_b_response = call_groq(
          model='llama-3.3-70b-versatile',
          system_prompt=load_prompt('marketing_strategy.txt'),
          user_message=call_b_message,
          max_tokens=1200,
          temperature=0.4    # Slightly higher for creative marketing ideas
      )
      marketing_data = parse_json_safely(call_b_response)

      update_job_status(job_id, 'stage5_report', 88,
                        'Marketing strategy ready ✓')

      # ─────────────────────────────────────────────────────
      # CALL C: Validation + Prompts + Score
      # ─────────────────────────────────────────────────────
      call_c_message = f"""
      {context_block}

      Generate JSON with:

      "validation_checklist": [
        {{
          "action": "...",
          "how_to": "...",
          "success_signal": "...",
          "priority": "HIGH/MEDIUM/LOW"
        }}
      ],

      "risk_flags": [
        {{
          "risk": "...",
          "mitigation": "..."
        }}
      ],

      "cursor_prompt": "...",         (ready-to-paste Cursor IDE prompt)
      "v0_prompt": "...",             (ready-to-paste v0.dev prompt)
      "bolt_prompt": "...",           (ready-to-paste bolt.new prompt)

      "growth_score": 78,             (integer 0-100 based on all data)
      "growth_score_reasoning": "..."
      """

      call_c_response = call_groq(
          model='llama-3.3-70b-versatile',
          system_prompt=load_prompt('build_stack.txt'),
          user_message=call_c_message,
          max_tokens=1000,
          temperature=0.3
      )
      action_data = parse_json_safely(call_c_response)

      update_job_status(job_id, 'stage5_report', 93,
                        'Full report assembled ✓')

      # Combine all outputs and save to reports table
      full_report = {
          **product_data,
          **marketing_data,
          **action_data,
          'pain_points': pain_analysis['pain_points'],
          'buying_signals': pain_analysis['buying_signals'],
          'competitor_gaps': competitor_data.get('competitors', []),
          'demand_label': pain_analysis['demand_label']
      }

      save_report(business_data['business_id'], job_id, full_report)

      return full_report
```

---

## B10. STAGE 6 — OPPORTUNITY FEED EXTRACTION

```
  PURPOSE:
  ════════
  From all search results and analysis, extract individual
  opportunity cards that populate the Opportunity Feed tab.

  INPUT:  Raw search results + pain analysis + competitor data
  OUTPUT: 10-20 opportunity objects saved to opportunities table

  MODEL: llama-3.1-8b (bulk processing, lower cost)
  TIME: ~3-4 seconds
```

```python
  # pipeline/stage6_opportunities.py

  def run_stage6_opportunity_extraction(search_results: dict,
                                         pain_analysis: dict,
                                         competitor_data: dict,
                                         business_id: str,
                                         job_id: str) -> list:

      update_job_status(job_id, 'stage6_opportunities', 95,
                        'Extracting opportunity cards...')

      raw_results = search_results['raw_results']

      # Score and classify each result
      user_message = f"""
      Analyze these search results and extract opportunity cards.
      Return a JSON array of opportunity objects.

      Pain points we're solving: {json.dumps(pain_analysis['pain_points'][:3])}
      Competitor weaknesses: {json.dumps(competitor_data.get('competitors', [])[:2])}

      Results to analyze:
      {format_results_for_groq(raw_results[:20])}

      For each relevant result, create an object with:
      - title (compelling 6-10 word description of the opportunity)
      - opportunity_type: one of:
          "buying_signal" | "pain_point" | "competitor_gap" | "content_idea"
      - source_url
      - subreddit (extract from URL if reddit, else null)
      - engagement_count (estimate from context, or 0)
      - opportunity_score (1.0 to 10.0)
      - ai_insight (1 sentence: why this matters)
      - suggested_action (1 sentence: what to do)
      - raw_snippet (the relevant text from the result)

      Only include opportunities with score >= 5.0.
      Return ONLY a valid JSON array. No extra text.
      """

      response = call_groq(
          model='llama-3.1-8b-instant',   # Cheaper model for bulk extraction
          system_prompt=load_prompt('opportunity_extract.txt'),
          user_message=user_message,
          max_tokens=2000,
          temperature=0.2
      )

      opportunities = parse_json_safely(response)

      if not isinstance(opportunities, list):
          opportunities = opportunities.get('opportunities', [])

      # Save each to database
      saved_count = 0
      for opp in opportunities:
          if opp.get('opportunity_score', 0) >= 5.0:
              save_opportunity(business_id, opp)
              saved_count += 1

      update_job_status(job_id, 'stage6_opportunities', 98,
                        f'{saved_count} opportunities extracted ✓')

      return opportunities
```

---

## B11. STAGE 7 — MEMORY & RETENTION ENGINE

```
  PURPOSE:
  ════════
  Update business memory with new findings.
  Mark pipeline as complete.
  Trigger welcome email.
  Set up future job schedules.

  INPUT:  Everything from previous stages
  OUTPUT: Updated memory, completed job, scheduled jobs
```

```python
  # pipeline/stage7_memory.py

  def run_stage7_memory_update(business_id: str,
                                user_id: str,
                                job_id: str,
                                full_report: dict,
                                enriched: dict) -> None:

      # 1. Update business_memory with final enriched data
      update_business_memory(business_id, {
          'keywords': enriched['expanded_keywords'],
          'icp_description': enriched['icp_description'],
          'problem_hypotheses': enriched['problem_hypotheses'],
          'market_category': enriched['market_category'],
          'cache_updated_at': datetime.utcnow().isoformat()
      })

      # 2. Log the action
      log_action(user_id, business_id, 'report_generated', {
          'report_pain_points': len(full_report.get('pain_points', [])),
          'report_opportunities': full_report.get('total_opportunities', 0),
          'growth_score': full_report.get('growth_score')
      })

      # 3. Mark job as complete
      complete_pipeline_job(job_id, success=True)

      # 4. Send welcome/report-ready email via Resend
      user = get_user(user_id)
      send_report_ready_email(
          to=user['email'],
          name=user['name'],
          business_name=get_business(business_id)['business_name'],
          growth_score=full_report.get('growth_score', 0)
      )

      # 5. Schedule future scans based on plan
      plan = get_user_plan(user_id)
      if plan in ('starter', 'pro'):
          schedule_opportunity_scan(business_id, interval_hours=6)
      if plan == 'pro':
          schedule_competitor_monitor(business_id, interval_hours=24)
```

---

## B12. BACKGROUND JOBS

```
  JOB 1: WEEKLY DIGEST
  ═════════════════════
  Schedule: Every Monday 9:00 AM IST
  Users:    ALL plans
  Credits:  4 Basic Tavily per user

  Flow:
  ──────
  1. Get all active businesses
  2. For each business, run 4 Basic Tavily searches
     using their stored keywords
  3. Compare with previous week's opportunities
  4. Groq (llama-3.1-8b) generates digest summary
  5. Save to weekly_digests table
  6. Send email digest via Resend
  7. Update opportunity feed in DB
```

```python
  # jobs/weekly_digest.py

  def run_weekly_digest():
      """Runs every Monday morning."""
      all_businesses = get_all_active_businesses()

      for business in all_businesses:
          try:
              memory = get_business_memory(business['id'])
              if not memory:
                  continue

              keywords = memory.get('keywords', [])[:4]

              # 4 Basic searches (one per keyword)
              new_results = []
              for keyword in keywords:
                  result = call_tavily({
                      'query': f'site:reddit.com {keyword} '
                               f'discussion 2025 2026',
                      'depth': 'basic',
                      'max_results': 5
                  })
                  new_results.extend(result.get('results', []))

              # Generate digest with cheap model
              digest = generate_weekly_digest(
                  business, new_results, memory
              )

              # Save and email
              save_weekly_digest(business['id'], digest)
              send_weekly_digest_email(business['user_id'], digest)

          except Exception as e:
              log_error(f'Weekly digest failed for {business["id"]}: {e}')
              continue
```

```
  JOB 2: OPPORTUNITY SCANNER
  ════════════════════════════
  Schedule: Every 6 hours
  Users:    Starter + Pro only
  Credits:  3 Basic Tavily per user per run

  Flow:
  ──────
  1. Get Starter + Pro businesses
  2. Check if last scan was > 6 hours ago
  3. Run 3 Basic searches on top keywords
  4. Extract new opportunities (compare with existing)
  5. Save new opportunities to DB
  6. Send notification if high-score opportunity found

  JOB 3: COMPETITOR MONITOR
  ═══════════════════════════
  Schedule: Every 24 hours
  Users:    Pro only
  Credits:  1 Basic per competitor per user

  Flow:
  ──────
  1. Get Pro businesses with competitors
  2. For each competitor, run 1 Basic search
  3. Groq analyzes for new patterns/changes
  4. Update competitor analysis in DB
  5. Alert user if significant competitor activity detected
```

---

## B13. BILLING & RAZORPAY INTEGRATION

```
  PAYMENT FLOW:
  ══════════════

  Frontend            Backend             Razorpay
  ────────            ───────             ────────

  User clicks
  "Upgrade to Starter"
       │
       ▼
  POST /billing/create-order
  {plan: "starter"}
       │ ──────────────────→
       │                  1. Create Razorpay order
       │                     amount: 49900 (₹499 in paise)
       │                     currency: "INR"
       │ ←──────────────────
  Receive {order_id, amount}
       │
       ▼
  Open Razorpay checkout
  (client-side JS)
       │ ──────────────────────────────────────────→
       │                                           User pays
       │ ←─────────────────────────────────────────
  Payment success
  {payment_id, order_id, signature}
       │
       ▼
  POST /billing/verify
  {payment_id, order_id, signature}
       │ ──────────────────→
       │                  1. Verify HMAC signature
       │                  2. Update subscriptions table
       │                  3. Update users.plan
       │                  4. Send confirmation email
       │ ←──────────────────
  Redirect to dashboard
  with upgraded features
```

```python
  # services/billing_service.py

  import razorpay
  import hmac, hashlib

  PLAN_PRICES = {
      'starter': 49900,   # ₹499 in paise
      'pro': 99900        # ₹999 in paise
  }

  client = razorpay.Client(
      auth=(os.environ['RAZORPAY_KEY_ID'],
            os.environ['RAZORPAY_KEY_SECRET'])
  )

  def create_order(user_id: str, plan: str) -> dict:
      order = client.order.create({
          'amount': PLAN_PRICES[plan],
          'currency': 'INR',
          'payment_capture': 1,
          'notes': {
              'user_id': user_id,
              'plan': plan
          }
      })
      return order

  def verify_payment(payment_id: str,
                     order_id: str,
                     signature: str) -> bool:
      """Verify Razorpay HMAC signature."""
      msg = f'{order_id}|{payment_id}'
      expected = hmac.new(
          os.environ['RAZORPAY_KEY_SECRET'].encode(),
          msg.encode(),
          hashlib.sha256
      ).hexdigest()
      return hmac.compare_digest(expected, signature)

  def upgrade_user_plan(user_id: str, plan: str,
                         payment_id: str, order_id: str):
      """Upgrade user plan after verified payment."""
      # Update users table
      supabase.table('users').update(
          {'plan': plan}
      ).eq('id', user_id).execute()

      # Update or create subscription record
      supabase.table('subscriptions').upsert({
          'user_id': user_id,
          'plan': plan,
          'razorpay_payment_id': payment_id,
          'status': 'active',
          'renewal_date': (datetime.utcnow()
                          + timedelta(days=30)).isoformat()
      }).execute()

      # Reset usage counters for new billing cycle
      reset_usage_counters(user_id)
```

---

## B14. USAGE LIMITER SYSTEM

```python
  # config.py

  PLAN_LIMITS = {
      'free': {
          'reports_per_month': 1,
          'competitors': 1,
          'opportunity_feed': 'basic',
          'saved_opportunities': 3,
          'priority_queue': False,
          'weekly_digest': True,
          'opportunity_scan_interval': None   # No scanning for free
      },
      'starter': {
          'reports_per_month': 20,
          'competitors': 5,
          'opportunity_feed': 'advanced',
          'saved_opportunities': -1,          # unlimited
          'priority_queue': False,
          'weekly_digest': True,
          'opportunity_scan_interval': 6      # hours
      },
      'pro': {
          'reports_per_month': 50,
          'competitors': -1,                  # unlimited
          'opportunity_feed': 'premium',
          'saved_opportunities': -1,
          'priority_queue': True,
          'weekly_digest': True,
          'opportunity_scan_interval': 6,
          'competitor_monitor': True
      }
  }
```

```python
  # utils/limiter.py

  from functools import wraps

  def check_usage_limit(resource: str):
      """
      Decorator factory for usage limit checks.
      Usage: @check_usage_limit('reports')
      """
      def decorator(f):
          @wraps(f)
          def decorated(*args, **kwargs):
              user_id = g.user_id
              plan = get_user_plan(user_id)
              limits = PLAN_LIMITS[plan]

              if resource == 'reports':
                  max_allowed = limits['reports_per_month']
                  usage = get_reports_used(user_id)

                  if usage >= max_allowed:
                      return jsonify({
                          'error': 'limit_exceeded',
                          'message': f'You have used all {max_allowed} '
                                     f'reports this month.',
                          'current_plan': plan,
                          'upgrade_url': '/pricing'
                      }), 402

              elif resource == 'competitors':
                  max_allowed = limits['competitors']
                  if max_allowed == -1:
                      pass   # unlimited
                  else:
                      current = get_competitors_count(user_id)
                      if current >= max_allowed:
                          return jsonify({
                              'error': 'competitor_limit',
                              'message': f'Max {max_allowed} competitors '
                                         f'on your plan.',
                              'upgrade_url': '/pricing'
                          }), 402

              return f(*args, **kwargs)
          return decorated
      return decorator
```

---

## B15. CACHING STRATEGY

```python
  # utils/cache.py

  import time
  from typing import Any, Optional

  class TTLCache:
      """
      Simple in-memory cache with TTL expiry.
      Used for: Tavily results, Groq summaries, subreddit data.
      """

      def __init__(self):
          self._cache = {}

      def set(self, key: str, value: Any, ttl_seconds: int):
          self._cache[key] = {
              'value': value,
              'expires_at': time.time() + ttl_seconds
          }

      def get(self, key: str) -> Optional[Any]:
          item = self._cache.get(key)
          if not item:
              return None
          if time.time() > item['expires_at']:
              del self._cache[key]
              return None
          return item['value']

      def delete(self, key: str):
          self._cache.pop(key, None)

  # Global cache instance
  cache = TTLCache()

  # Cache TTLs
  CACHE_TTLS = {
      'tavily_results':    6 * 3600,    # 6 hours
      'groq_summaries':   12 * 3600,    # 12 hours
      'subreddit_data':   24 * 3600,    # 24 hours
      'competitor_data':  24 * 3600,    # 24 hours
      'user_plan':         1 * 3600,    # 1 hour
  }

  # Usage: Before Tavily call, check cache
  def cached_tavily_call(query: str, depth: str) -> dict:
      cache_key = f'tavily_{hash(query)}_{depth}'
      cached = cache.get(cache_key)
      if cached:
          return cached
      result = call_tavily({'query': query, 'depth': depth})
      cache.set(cache_key, result, CACHE_TTLS['tavily_results'])
      return result
```

---

## B16. API ROUTES REFERENCE

```
  ALL ROUTES — FLASK BACKEND
  ══════════════════════════════════════════════════════

  AUTH
  ────
  POST  /auth/verify-token              Verify Supabase JWT

  ONBOARDING
  ──────────
  POST  /onboarding/submit              Submit onboarding form
                                        → triggers pipeline

  PIPELINE
  ────────
  GET   /pipeline/status/{job_id}       Poll pipeline progress

  REPORTS
  ───────
  GET   /reports/list                   List user's reports
  GET   /reports/{id}                   Get full report
  DELETE /reports/{id}                  Delete report

  OPPORTUNITIES
  ─────────────
  GET   /opportunities/feed             Get opportunity feed
        ?type=buying_signal             Filter by type
        ?sort=score                     Sort options
        ?page=1                         Pagination
  POST  /opportunities/{id}/save        Save opportunity
  DELETE /opportunities/{id}/save       Unsave opportunity
  GET   /opportunities/saved            Get saved opportunities

  COMPETITORS
  ───────────
  GET   /competitors/list               List user's competitors
  POST  /competitors/add                Add competitor
  DELETE /competitors/{id}              Remove competitor
  GET   /competitors/{id}/insights      Get competitor analysis

  DIGEST
  ──────
  GET   /digest/latest                  Get latest weekly digest
  GET   /digest/history                 Get past digests

  BILLING
  ───────
  POST  /billing/create-order           Create Razorpay order
  POST  /billing/verify                 Verify payment + upgrade
  POST  /billing/webhook                Razorpay webhook handler
  GET   /billing/subscription           Get subscription status
  POST  /billing/cancel                 Cancel subscription

  USAGE
  ─────
  GET   /usage/current                  Get current usage stats
  POST  /usage/reset                    Admin: reset monthly usage
```

---

## B17. PROMPT TEMPLATES

```
  prompts/enrich_context.txt
  ══════════════════════════
  You are an expert startup analyst with 10 years of experience
  helping founders validate ideas. You understand online communities,
  Reddit culture, and founder psychology deeply.

  Your task: analyze raw startup idea information and extract
  structured intelligence for a research pipeline.

  Be specific. Avoid generic answers. Think about:
  - What would a frustrated user ACTUALLY type on Reddit?
  - Which specific subreddits would these people hang out in?
  - What exact product names would they compare or complain about?
  - What's the most likely ICP for this exact product?

  Return ONLY valid JSON. No preamble, no explanation, no markdown.

  ──────────────────────────────────────────────────────────────────

  prompts/pain_analysis.txt
  ═════════════════════════
  You are a market research expert who specializes in finding
  real user pain points from online discussions.

  Your job: analyze raw search result snippets and extract
  SPECIFIC, EVIDENCE-BASED pain points.

  Rules:
  - Only extract pain points with actual evidence from the results
  - Quote or closely paraphrase actual user language
  - Be specific about what breaks, what frustrates, what's missing
  - Do not invent pain points not present in the data
  - Rate severity honestly (not everything is HIGH)

  Return ONLY valid JSON.

  ──────────────────────────────────────────────────────────────────

  prompts/marketing_strategy.txt
  ═══════════════════════════════
  You are a growth hacker and content strategist who helps B2B SaaS
  founders grow through organic channels, especially Reddit.

  You understand:
  - Reddit culture and what gets upvoted vs. downvoted
  - What kind of content founders engage with
  - The difference between self-promotion and value-first content
  - Launch strategies for zero-budget indie makers

  Generate ACTIONABLE, SPECIFIC strategies. Not generic advice.
  Give real content ideas, real hooks, real timing suggestions.

  Return ONLY valid JSON.
```

---

## B18. ERROR HANDLING

```python
  # app.py — Global error handlers

  @app.errorhandler(404)
  def not_found(e):
      return jsonify({'error': 'not_found', 'message': str(e)}), 404

  @app.errorhandler(429)
  def rate_limited(e):
      return jsonify({
          'error': 'rate_limited',
          'message': 'Too many requests. Try again in a minute.'
      }), 429

  @app.errorhandler(500)
  def server_error(e):
      log_error(str(e))
      return jsonify({
          'error': 'server_error',
          'message': 'Something went wrong. We have been notified.'
      }), 500

  # Pipeline error handling
  def handle_pipeline_failure(job_id: str, stage: str, error: str):
      """
      When any stage fails:
      1. Mark job as failed with error message
      2. Save partial results (don't lose what we have)
      3. Notify user with partial results if available
      4. Log for debugging
      """
      update_pipeline_job(job_id, {
          'status': 'failed',
          'error_message': f'Failed at {stage}: {error}',
          'completed_at': datetime.utcnow().isoformat()
      })

      # Send email: "partial results available"
      # Frontend will show whatever was completed before failure
      log_pipeline_error(job_id, stage, error)

  # Groq retry logic
  def call_groq_with_retry(model, system_prompt, user_message,
                            max_tokens, temperature,
                            max_retries=3) -> str:
      for attempt in range(max_retries):
          try:
              return call_groq(model, system_prompt,
                               user_message, max_tokens, temperature)
          except Exception as e:
              if attempt == max_retries - 1:
                  raise e
              wait_time = 2 ** attempt          # exponential backoff
              time.sleep(wait_time)
      return ''
```

---

## B19. DEPLOYMENT GUIDE

```
  ENVIRONMENT VARIABLES
  ══════════════════════

  # Flask
  FLASK_ENV=production
  SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_hex(32))">
  ALLOWED_ORIGINS=https://yourapp.vercel.app

  # Supabase
  SUPABASE_URL=https://xxxx.supabase.co
  SUPABASE_SERVICE_KEY=<service role key (NOT anon key)>

  # AI
  GROQ_API_KEY=gsk_xxxxxxxxxxxx

  # Search
  TAVILY_API_KEY=tvly-xxxxxxxxxxxx

  # Payments
  RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
  RAZORPAY_KEY_SECRET=xxxxxxxxxxxx

  # Email
  RESEND_API_KEY=re_xxxxxxxxxxxx
  FROM_EMAIL=hello@yourdomain.com

  # APScheduler
  SCHEDULER_TIMEZONE=Asia/Kolkata

  ──────────────────────────────────────────────────────────────────

  RAILWAY DEPLOYMENT
  ══════════════════

  1. Connect GitHub repo to Railway
  2. Set all environment variables in Railway dashboard
  3. Set start command: gunicorn app:app --workers 2 --timeout 120
  4. Set health check: GET /health
  5. Deploy → Railway auto-handles SSL

  Procfile:
  web: gunicorn app:app --workers 2 --timeout 120 --bind 0.0.0.0:$PORT
  worker: python jobs/scheduler.py

  requirements.txt (key packages):
  flask==3.0.0
  flask-cors==4.0.0
  gunicorn==21.2.0
  supabase==2.3.0
  groq==0.11.0
  requests==2.31.0
  apscheduler==3.10.4
  python-dotenv==1.0.0
  pydantic==2.5.0
  razorpay==1.4.1
  resend==2.0.0

  ──────────────────────────────────────────────────────────────────

  VERCEL DEPLOYMENT (Frontend)
  ═════════════════════════════

  .env.local:
  NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
  NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
  NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxx

  Deploy: vercel --prod
```

---

## B20. COST ESTIMATES & SCALING

```
  ╔══════════════════════════════════════════════════════════════╗
  ║  COST ESTIMATE — 0 TO 100 USERS                             ║
  ╠══════════════════════════════════════════════════════════════╣
  ║                                                              ║
  ║  Service          Free Tier      At 100 users/mo            ║
  ║  ─────────────────────────────────────────────────────       ║
  ║  Vercel           Free           Free (hobby plan)           ║
  ║  Railway          Free trial     ₹500-1500/mo               ║
  ║  Supabase         Free (500MB)   Free (< 500MB at 100 users) ║
  ║  Groq API         $0.06/1M tok   ~₹300-800/mo               ║
  ║  Tavily           1000 credits   ~₹1200-2000/mo             ║
  ║  Resend           3000 emails    Free                        ║
  ║  Razorpay         2% per txn     % of revenue                ║
  ║  ─────────────────────────────────────────────────────       ║
  ║  TOTAL INFRA                     ~₹2000-4300/mo             ║
  ║                                                              ║
  ║  With 10 Starter users (₹499):   ₹4,990 MRR                ║
  ║  Infra cost:                     ₹4,300/mo                  ║
  ║  → Break even at 9 Starter users                            ║
  ║                                                              ║
  ╠══════════════════════════════════════════════════════════════╣
  ║  SCALING TO 500 USERS                                        ║
  ╠══════════════════════════════════════════════════════════════╣
  ║                                                              ║
  ║  Upgrade:                                                    ║
  ║  · Railway: Pro plan (₹3000/mo, more compute)               ║
  ║  · Supabase: Pro (₹2000/mo, more DB + bandwidth)            ║
  ║  · Tavily: Paid plan ($20/mo = ₹1700)                       ║
  ║  · Groq: Still cheap (~₹2000/mo at 500 users)              ║
  ║  · Add Redis for proper caching (Railway addon, ₹500)       ║
  ║                                                              ║
  ║  Total infra at 500 users:  ~₹12,000/mo                    ║
  ║  With 50 Starter + 20 Pro:  ₹44,930 MRR                    ║
  ║  → 3.7x revenue/cost ratio. Healthy.                        ║
  ║                                                              ║
  ╚══════════════════════════════════════════════════════════════╝
```

---

```
  ╔═══════════════════════════════════════════════════════════════╗
  ║                                                               ║
  ║   DOCUMENT COMPLETE                                           ║
  ║   ─────────────────                                           ║
  ║                                                               ║
  ║   This migrate.md covers:                                     ║
  ║                                                               ║
  ║   DESIGN    Hand-drawn aesthetic system                       ║
  ║             Colors, fonts, components                         ║
  ║             All pages: landing → dashboard → report           ║
  ║                                                               ║
  ║   BACKEND   7-stage intelligence pipeline                     ║
  ║             Groq + Tavily integration                         ║
  ║             Database schema (12 tables)                       ║
  ║             Background jobs (3 jobs)                          ║
  ║             Billing (Razorpay)                                ║
  ║             Error handling + caching                          ║
  ║             Deployment (Railway + Vercel)                     ║
  ║             Cost estimates (0 → 500 users)                    ║
  ║                                                               ║
  ║   BUILD ORDER:                                                ║
  ║   ① Set up Flask + Supabase + auth                           ║
  ║   ② Build Groq + Tavily services                             ║
  ║   ③ Build pipeline (stages 1-7)                              ║
  ║   ④ Build all API routes                                      ║
  ║   ⑤ Build Next.js frontend (hand-drawn design)               ║
  ║   ⑥ Integrate Razorpay billing                               ║
  ║   ⑦ Deploy + launch                                          ║
  ║                                                               ║
  ╚═══════════════════════════════════════════════════════════════╝

  ✦  AI Distribution Engine  ·  MIGRATE.md  ·  v1.0  ✦
```