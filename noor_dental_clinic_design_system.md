---
name: "Noor Dental Clinic — Design System"
description: "Calm, trustworthy, and modern Arabic RTL design system for Noor Dental Clinic, anchored in clinical teal, soft mint surfaces, and warm coral CTAs."
---

## Overview

Noor Dental Clinic (**عيادة نور لطب الأسنان**) is a modern, patient-first dental practice designed to replace clinical anxiety with warmth, clarity, and trust. The interface balances generous pure-white breathing room with soft mint containers, crisp slate typography, and high-visibility coral calls to action reserved strictly for appointment booking.

- **Brand Personality:** Calm, trustworthy, gentle, and clinically precise.
- **Target Audience:** Families, professionals, and cosmetic dental patients seeking transparent, pain-free dental care in an approachable Arabic-first digital experience.
- **Design Style:** Clean **Corporate / Modern** healthcare minimalism with soft 12px–20px rounded geometry, subtle ambient elevation, and strict right-to-left (`dir="rtl"`) reading flow.

## Colors

The palette centers on a calm **Clinical Teal** (`#0E7C7B`) brand primary paired with **Soft Mint** (`#E6F4F1` / `#F0FDFA`) for soothing card surfaces and **Warm Coral** (`#EA580C` / `#F97316`) reserved exclusively for primary booking CTAs.

- **Primary (`#0E7C7B`):** Conveys clinical trust, hygiene, and calm. Paired with pure white `#FFFFFF` text (passes WCAG AA at 5.14:1).
- **Secondary Accent (`#E6F4F1` / `#F0FDFA`):** Soft mint and gentle sky-mint backgrounds for feature cards, badges, and trust highlights.
- **CTA Coral (`#EA580C` / `#F97316`):** Strictly reserved for primary "احجز موعدك" (Book Appointment) buttons so the main conversion path stands out immediately without visual clutter.
- **Neutrals:** Pure white `#FFFFFF` and soft off-white `#F8FAFC` alternating section grounds, `#0F172A` deep slate for headings, and `#475569` muted slate for body copy.

```yaml
colors:
  clinical-teal: "#0E7C7B"
  teal-bright: "#0D9488"
  teal-deep: "#00504F"
  soft-mint: "#E6F4F1"
  mint-tint: "#F0FDFA"
  cta-coral: "#C2410C"
  cta-coral-bright: "#EA580C"
  cta-coral-hover: "#9A3412"
  surface: "#FFFFFF"
  surface-alt: "#F8FAFC"
  on-surface: "#0F172A"
  on-surface-muted: "#475569"
  on-primary: "#FFFFFF"
  on-mint: "#003736"
  outline: "#CBD5E1"
  outline-subtle: "#E2E8F0"
  star-amber: "#F59E0B"
  success: "#0D9488"
  error: "#BA1A1A"
```

## Typography

Arabic RTL typography requires generous line heights and open letterforms so diacritics and connected glyphs remain effortless to scan. **Cairo** anchors headlines, navigation, and button labels with clean geometric authority, while **Tajawal** delivers warm, highly legible body copy across desktop and mobile viewports.

```yaml
typography:
  display-lg:
    fontFamily: "Cairo"
    fontSize: 44px
    fontWeight: 800
    lineHeight: 58px
    letterSpacing: 0px
  display-lg-mobile:
    fontFamily: "Cairo"
    fontSize: 30px
    fontWeight: 800
    lineHeight: 42px
    letterSpacing: 0px
  headline-lg:
    fontFamily: "Cairo"
    fontSize: 34px
    fontWeight: 700
    lineHeight: 46px
    letterSpacing: 0px
  headline-lg-mobile:
    fontFamily: "Cairo"
    fontSize: 26px
    fontWeight: 700
    lineHeight: 36px
    letterSpacing: 0px
  headline-md:
    fontFamily: "Cairo"
    fontSize: 26px
    fontWeight: 700
    lineHeight: 36px
    letterSpacing: 0px
  headline-sm:
    fontFamily: "Cairo"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 30px
    letterSpacing: 0px
  title-lg:
    fontFamily: "Cairo"
    fontSize: 18px
    fontWeight: 700
    lineHeight: 28px
    letterSpacing: 0px
  title-md:
    fontFamily: "Cairo"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: 0px
  body-lg:
    fontFamily: "Tajawal"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 28px
    letterSpacing: 0px
  body-md:
    fontFamily: "Tajawal"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 25px
    letterSpacing: 0px
  body-sm:
    fontFamily: "Tajawal"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 22px
    letterSpacing: 0px
  label-lg:
    fontFamily: "Cairo"
    fontSize: 15px
    fontWeight: 700
    lineHeight: 22px
    letterSpacing: 0px
  label-md:
    fontFamily: "Cairo"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 18px
    letterSpacing: 0px
  label-sm:
    fontFamily: "Cairo"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0px
```

## Layout & Spacing

The landing page uses a **12-column Fixed-Max-Width Grid** (`max-w-7xl` / `1240px`) on desktop with generous `80px` vertical section rhythm and alternating `#FFFFFF` and `#F8FAFC` section backgrounds. On mobile, grids collapse cleanly to single-column stacks with `20px` horizontal page margins. All directional spacing, flex rows, and text alignments follow `dir="rtl"`.

```yaml
spacing:
  gutter-xs: 4px
  gutter-sm: 8px
  gutter-md: 16px
  gutter-lg: 24px
  gutter-xl: 32px
  section-sm: 48px
  section-lg: 80px
  page-margin: 24px
```

## Elevation & Depth

Hierarchy is established primarily through alternating neutral backgrounds (`surface` `#FFFFFF` vs. `surface-alt` `#F8FAFC`), soft mint containers (`soft-mint` `#E6F4F1`), and subtle `1px` `outline-subtle` (`#E2E8F0`) borders. Elevated cards (such as doctor profiles, booking form, and hovered service cards) use whisper-soft ambient shadows (`0 10px 30px -10px rgba(15, 23, 42, 0.08)`) rather than heavy drop shadows.

## Shapes

Cards, forms, and media containers use friendly, approachable rounded corners between `12px` and `20px`. Buttons and trust pills use `12px` or `full` pill geometry for tactile clarity.

```yaml
rounded:
  sm: 8px
  DEFAULT: 12px
  md: 16px
  lg: 20px
  xl: 24px
  full: 9999px
```

## Motion & Micro-interaction

Transitions are gentle, calm, and purposeful—never abrupt or bouncy. Interactive hover states on cards and CTA buttons respond within `150ms`–`200ms` using `transform`, `opacity`, and color changes only.

```yaml
motion:
  state-change:
    duration: 150ms
    delay: 0ms
    timingFunction: ease-out
  card-hover:
    duration: 200ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
```

## Voice & Content Strategy

- **Language & Direction:** All user-facing copy is written in clear, warm, modern Standard Arabic (`dir="rtl"`, `lang="ar"`).
- **Tone of Voice:** Reassuring, transparent, and welcoming. Avoid intimidating medical jargon; emphasize comfort, pain-free care, and clear next steps (e.g., "ابتسامة صحية تبدأ برعاية لطيفة" rather than overly technical phrasing).
- **Action Labels:** Use clear Arabic verb phrases: "احجز موعدك الآن" (Book Your Appointment Now), "استكشف العلاجات" (Explore Treatments), "احجز مع الطبيب" (Book with Doctor).
- **Numbers & Dates:** Use clear standard numerals (`tabular-nums`) for phone numbers, clinic hours, and ratings (e.g., `4.9`, `+12 عاماً`).

## Do's and Don'ts

- **Do** set `dir="rtl"` and `lang="ar"` on `<html>` on every screen and component.
- **Do** reserve `cta-coral` (`#EA580C` / `#F97316`) strictly for primary booking CTA buttons ("احجز موعدك") so they stand out without clutter.
- **Do** alternate `#FFFFFF` (`bg-surface`) and `#F8FAFC` (`bg-surface-alt`) across major sections.
- **Don't** use generic Tailwind colors (`bg-teal-600`, `text-slate-900`) or arbitrary hex values in HTML; use the semantic tokens in `tailwind.config.js`.
- **Don't** use harsh dark themes, neon glows, or emojis as icons—use Material Symbols Outlined with `snake_case` ligatures.

## Components

Component implementations live as individual HTML sticker sheet files in
`components/`. Each file contains the canonical, styled HTML components with
`<!-- COMPONENT: name -->` comment markers. Read each file before use.

- **Badge** → `@components/badge.html`: `badge-numeric`, `badge-dot`
- **Button** → `@components/button.html`: `button-primary`, `button-icon`, `button-with-icon`
- **Card** → `@components/card.html`: `card-elevated`, `card-action`, `card-interactive`, `card-interactive-2`
- **Input Field** → `@components/input-field.html`: `input-field-text`, `input-field-icon`
