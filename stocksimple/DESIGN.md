# StockSimple — Design System

## Brand

**Product name:** StockSimple  
**Tagline:** ניהול מלאי פשוט לעסקים קטנים  
**Language:** Hebrew (RTL, `dir="rtl"`, `lang="he"`)  
**Font:** Rubik (Google Fonts) — weights 300, 400, 500, 700, 900  
**Icons:** Material Symbols Outlined (Google Fonts)

---

## Color Palette

### Primary (Blue)
| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#003fad` | Main brand color, key CTAs |
| `--color-primary-container` | `#1a56d6` | Buttons, active states |
| `--color-on-primary` | `#ffffff` | Text on primary surfaces |
| `--color-on-primary-container` | `#d2daff` | Text on primary containers |
| `--color-inverse-primary` | `#b4c5ff` | Inverse / dark backgrounds |

### Secondary (Blue-Gray)
| Token | Value | Usage |
|---|---|---|
| `--color-secondary` | `#585f67` | Secondary actions, labels |
| `--color-secondary-container` | `#dce3ec` | Chips, tags |
| `--color-on-secondary` | `#ffffff` | Text on secondary |

### Tertiary (Orange-Red)
| Token | Value | Usage |
|---|---|---|
| `--color-tertiary` | `#822c00` | Warnings, stock value |
| `--color-tertiary-container` | `#a93c00` | Warning containers |
| `--color-on-tertiary` | `#ffffff` | Text on tertiary |

### Error
| Token | Value | Usage |
|---|---|---|
| `--color-error` | `#ba1a1a` | Errors, critical alerts |
| `--color-error-container` | `#ffdad6` | Error backgrounds |
| `--color-on-error` | `#ffffff` | Text on error |

### Neutral (Surface / Background)
| Token | Value | Usage |
|---|---|---|
| `--color-background` | `#faf8ff` | Page background |
| `--color-surface` | `#faf8ff` | Card surfaces |
| `--color-on-surface` | `#191b23` | Primary text |
| `--color-surface-variant` | `#e2e2ed` | Dividers, borders |
| `--color-on-surface-variant` | `#434654` | Secondary text |
| `--color-surface-container-lowest` | `#ffffff` | Pure white cards |
| `--color-surface-container` | `#ededf8` | Elevated containers |
| `--color-outline` | `#737686` | Borders |
| `--color-outline-variant` | `#c3c6d7` | Subtle borders |

---

## Typography

| Scale | Size | Weight | Usage |
|---|---|---|---|
| `--text-h1` | 24px | 900 | Page headings |
| `--text-h2` | 18px | 700 | Section headings |
| `--text-body` | 16px | 400 | Body text |
| `--text-caption` | 13px | 400–500 | Labels, captions |

All text uses `font-family: 'Rubik', sans-serif`.

---

## Border Radius

| Token | Value | Tailwind class | Usage |
|---|---|---|---|
| `--radius-DEFAULT` | 4px | `rounded` | Chips, badges |
| `--radius-lg` | 8px | `rounded-lg` | Input fields |
| `--radius-xl` | 12px | `rounded-xl` | Cards, buttons |
| `--radius-full` | 9999px | `rounded-full` | Avatars, pills |

---

## Elevation / Shadow

| Level | Usage |
|---|---|
| `shadow-sm` (`0 1px 4px rgba(0,0,0,0.06)`) | Cards, panels |
| `shadow-md` | Floating buttons, modals |
| `shadow-2xl` | Overlays, hero images |

---

## Layout

- **SideNavBar:** Fixed right, 240px wide, visible on `md+` breakpoints
- **TopAppBar:** Sticky top, 64px height, full width, padding-right 256px on desktop (to clear sidebar)
- **BottomNavBar:** Fixed bottom, mobile only (`md:hidden`), 64px height
- **Content area:** `md:pr-[240px]` to clear sidebar on desktop, `pb-24 md:pb-0` to clear bottom nav on mobile
- **Max content width:** `max-w-5xl` for dashboard/interior pages, `max-w-7xl` for landing

---

## Breakpoints

| Name | Min width | Usage |
|---|---|---|
| `sm` | 640px | Show/hide elements |
| `md` | 768px | Switch from mobile to desktop layout |
| `lg` | 1024px | Two-column layouts |

---

## Component Patterns

### Buttons
- **Primary:** `bg-blue-700 text-white font-bold rounded-xl h-12 px-6`
- **Secondary:** `border border-blue-700 text-blue-700 rounded-xl h-12 px-6`
- **Destructive:** `bg-red-600 text-white font-bold rounded-xl`

### Input Fields
- Height: 48px, border-radius: 12px
- Icon anchored to the right (RTL)
- Focus ring: `focus:border-blue-700 focus:ring-1 focus:ring-blue-700`

### Cards
- `bg-white border border-slate-200 rounded-xl shadow-sm`

### Badges / Status Chips
- `bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold` (critical)
- `bg-green-100 text-green-700 ...` (ok)
- `bg-yellow-100 text-yellow-700 ...` (warning)

---

## Icons

Use `<span className="material-symbols-outlined">icon_name</span>`.  
Default settings: `FILL=0, wght=400, GRAD=0, opsz=24`.  
Direction must always be `ltr` (set via CSS: `.material-symbols-outlined { direction: ltr; }`).
