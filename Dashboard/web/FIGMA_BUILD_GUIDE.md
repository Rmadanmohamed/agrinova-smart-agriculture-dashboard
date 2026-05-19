# AgriNova Figma Build Guide

This guide is the required fallback because the available Figma automation runtime cannot import local PNG files programmatically. The MCP can create frames, but this environment does not support `fetch` or `createImageAsync`, so locked reference images must be placed manually in Figma.

Figma file created:

```text
https://www.figma.com/design/725YtcajqpnwaeYmryiBvz
```

## Current Figma State

The file contains one page:

```text
AgriNova Dashboard Frames
```

It contains 10 independent 1920x1080 frames:

1. `01 AgriNova Overview`
2. `02 Smart Farm Monitoring`
3. `03 Crop Health & Vision Intelligence`
4. `04 Robotics & Drone Operations`
5. `05 IoT Sensor Network`
6. `06 Price Prediction`
7. `07 Blockchain Security`
8. `08 AI Assistant`
9. `09 Sustainability & Energy`
10. `10 Alerts & Reports`

The account is on Figma Starter, which limits the file to 3 pages. For that reason, all 10 dashboard screens are placed as separate frames on one Figma page instead of 10 Figma pages.

## Manual Locked Reference Setup

For each frame:

1. Drag the matching PNG from `web/reference-images` into Figma.
2. Place it inside the matching 1920x1080 frame.
3. Set X `0`, Y `0`, W `1920`, H `1080`.
4. Send it to the back.
5. Name the layer:

```text
LOCKED_REFERENCE_<file name>
```

6. Lock the layer.
7. Set opacity to `45%` while recreating components.
8. Restore opacity to `100%` only for comparison screenshots.

## Required Figma Reconstruction Layers

Create real Figma layers above the locked reference:

- `Sidebar`
- `Header`
- `Page Number Badge`
- `KPI Strip`
- `Primary Content Panels`
- `Secondary Content Panels`
- `Tables`
- `Charts`
- `Status Pills`
- `Action Buttons`

Do not trace the screenshot as a flat image. Every visible UI section should be a Figma shape, text node, or reusable component.

## Global Measurements

Use these dimensions from the uploaded screenshots:

| Element | Size / Position |
| --- | --- |
| Frame | 1920 x 1080 |
| Sidebar width | 220 px |
| Content X | 240 px |
| Header height | 74 px |
| KPI strip top | 92 px |
| KPI card height | 108 px |
| Main grid gap | 14 px |
| Panel radius | 8 px |
| Small icon tile radius | 7 px |
| Status pill height | 32 px |

## Visual Tokens

Use the token file in the implementation as the visual contract:

```text
web/frontend/src/design/tokens.ts
```

## Component Rules

- Sidebar must match the images: dark left rail, AgriNova mark, vertical nav, active green route, lower status card.
- Header must match the images: page number badge, title/subtitle, date/time, system/security/mode pills, search/notification/profile icons.
- KPI strip must use 5 or 6 cards depending on the screenshot, but the coded app standardizes to the screenshot-dominant 6-card strip.
- Panels must use dark glass fills, cyan borders, subtle inner glow, and 8 px radius.
- Do not use marketing-style hero sections.
- Do not use mobile-first composition.
- Do not use generic SaaS card stacks.

## Export Back To Code

After matching the Figma frames:

1. Inspect each frame dimensions and component positions.
2. Update `referenceMap.ts` notes if any panel positions change.
3. Update `tokens.ts` for any measured colors/effects.
4. Implement React components from those tokens.
5. Validate in browser at desktop size against the screenshots.
