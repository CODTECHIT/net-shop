# F Mart Storefront Design System & Layout Specification

This document outlines the UI/UX design specifications to transform the Vayu's Networks products section into a dedicated, premium e-commerce hub named **F Mart**.

---

## 1. Design Aesthetic & Visual Identity

F Mart will have its own identity while remaining cohesive with the parent site's dark, premium typography. We will implement:
- **Premium Banner:** A gorgeous, glassmorphic hero block displaying the brand-new logo `/fmart.jpeg`.
- **Custom Slogans:**
  - *"Door Delivery With Lowest Cost"*
  - *"Offers Applicable For Next Orders"*
  - Both highlighted in modern, clean, high-contrast badges (e.g., custom gradient borders, dark glass backdrops, vibrant text colors).
- **Interactive Search:** A prominent floating search bar with a glassmorphism blur effect and clean icon guides.
- **Upgraded Card Design:**
  - Modern grid structure with border gradients.
  - Interactive click-feedback animations.
  - Custom "In Stock" pill indicators.

---

## 2. Component Layout & Structural Changes

```
+-------------------------------------------------------------+
|                          NAVBAR                             |
|                    [Home] [Services] [F Mart] [About]       |
+-------------------------------------------------------------+
|                                                             |
|   +-----------------------------------------------------+   |
|   |                  F MART HERO BANNER                 |   |
|   |                                                     |   |
|   |         [Logo: fmart.jpeg]   F Mart                 |   |
|   |                                                     |   |
|   |   (Door Delivery With Lowest Cost)                  |   |
|   |   (Offers Applicable For Next Orders)               |   |
|   +-----------------------------------------------------+   |
|                                                             |
|                   [ Search Products... ]                    |
|                                                             |
|   +------------------+ +------------------+ +-----------+   |
|   | Product Card     | | Product Card     | | ...       |   |
|   | [Image]          | | [Image]          | |           |   |
|   | Price: ₹X        | | Price: ₹Y        | |           |   |
|   | [Buy Now] [WA]   | | [Buy Now] [WA]   | |           |   |
|   +------------------+ +------------------+ +-----------+   |
+-------------------------------------------------------------+
```

---

## 3. Micro-Animations & Interactivity

1. **Card Hover:** Cards will lift slightly and expand glowing back-shadows.
2. **Search Focus:** The search bar expands its border color and glows softly.
3. **Logo Hover:** The F Mart logo gets a circular rotating gradient outline.
