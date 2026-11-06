# Retrivo — Smart Campus Lost & Found Platform

> **Find it. Verify it. Retrieve it.**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Storage](https://img.shields.io/badge/Storage-Browser%20localStorage-203B36)](#how-data-is-stored)
[![License: MIT](https://img.shields.io/badge/License-MIT-203B36.svg)](LICENSE)

Retrivo is a campus-focused lost-and-found web application for Indian colleges and universities. Students and campus staff can report lost or found belongings, discover possible matches, submit ownership claims, review claims and record safe handovers.

**Locale:** India (`en-IN`) · **Currency:** Indian Rupee (₹)

## Features

- Lost and found reports with category, description, date, campus location, distinguishing features and optional image.
- Explore and filter reports by keyword, type, category and status.
- Explainable smart matching using category, title, location, date and description signals.
- Ownership claims with private verification details and a guided review workflow.
- Claim review, approval/rejection and handover completion.
- In-app notifications and activity history.
- QR codes that link to item detail pages.
- Student dashboard and campus moderation workspace.
- Responsive interface and Indian campus sample data.

## Technology

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, JavaScript |
| Routing | React Router DOM |
| UI | Custom CSS design tokens, Lucide React |
| Data persistence | Browser `localStorage` only |
| Image persistence | Image data URLs in browser `localStorage` (1 MB upload limit) |
| QR codes | `qrcode` |
| Feedback | `canvas-confetti` |

**Retrivo does not connect to a database or external backend.** There is no Supabase, Firebase, PostgreSQL, API key, `.env` file or server setup required. All records are stored in the browser that is running the app.

## Design system

- Forest Ink `#203B36`
- Marigold `#E9A15B`
- Warm Ivory `#F5F0E6`
- Soft Sage `#DCE6D9`
- Muted Terracotta `#D97762`
- Headings: Space Grotesk · Body: Instrument Sans · Metadata: IBM Plex Mono

## How data is stored

Every functional module uses the same local browser storage layer (`src/services/storageService.js`). The application stores the following collections:

| Module | localStorage key | Stored data |
|---|---|---|
| Accounts and profiles | `retrivo_users` | Names, email, department and role |
| Login session | `retrivo_session` | Signed-in account for the current browser |
| Lost and found reports | `retrivo_items` | Item details, report type, location, status and image data URL |
| Smart match results | `retrivo_matches` | Matched item IDs, score, explanation and matched attributes |
| Ownership claims | `retrivo_claims` | Claimant, proof description, private verification details, review and handover status |
| Notifications | `retrivo_notifications` | Recipient, message, type, read state and related item/claim |
| Activity history | `retrivo_activity` | Actor, action, entity, timestamp and metadata |

QR codes, match calculations and dashboard statistics are generated in the frontend. Their related records, where needed, are saved in the local collections above; no separate database is used.

### Important limitations

- Data is local to one browser profile and device. Another user on another device will not see the same reports or claims.
- Clearing browser site data can erase locally stored accounts, reports and claims. Keep the same browser profile during a presentation.
- Browser-only login is not production-grade authentication. Do not enter real passwords, student IDs, phone numbers or sensitive claim evidence.
- This build is a self-contained hackathon prototype, not a production multi-user campus service.

## Run locally

**Requirements:** Node.js 18+ and npm.

```bash
git clone https://github.com/YOUR-USERNAME/retrivo.git
cd retrivo
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

### Getting started

You can create your own account from the registration page. Registration signs you in automatically.

For a quick guided walkthrough, open **Sign In** and select **Fill sample login details**. The fields will be populated for the sample student account:

- **Name:** Lalli
- **Email:** `lalli@campus.ac.in`
- **Password:** `password123`

Select **Sign In** yourself to continue. This is a convenience for judging and presentations; it does not automatically sign anyone in. The starter dataset includes example campus listings so the explore and matching flows are visible immediately.

## Project structure

```text
retrivo/
├── public/                    # Favicon and static assets
├── src/
│   ├── components/             # Claims, item cards, QR, navigation and shared UI
│   ├── context/                # Authentication and toast contexts
│   ├── lib/                    # Explicit database-disabled configuration
│   ├── pages/                  # Home, Explore, reports, dashboards and claims
│   ├── routes/                 # App routes and protected routes
│   ├── services/               # Local auth, items, claims, matching, notifications and storage
│   └── styles/                 # Design tokens and global styles
├── .github/workflows/ci.yml   # GitHub Actions test + build check
├── SECURITY.md
├── package.json
├── test-runner.js
└── README.md
```

## Hackathon presentation walkthrough

A clear judging flow can be completed in one browser because the prototype stores all records in that browser:

1. Register **Student A** and report a found item.
2. Sign out, register **Student B**, and explore the item listing.
3. Submit an ownership claim with distinguishing details.
4. Sign back in as Student A and review the incoming claim from the item details page.
5. Approve the claim and complete the handover workflow.
6. Show the notification, activity history and updated recovery status.

Use fictional names and item details during judging. The application does not synchronize data between separate browsers or devices.

## Smart matching model

```text
Total = Category (25) + Title similarity (30) + Location (20)
      + Date proximity (15) + Description/features (10)
```

A score is a lead for human review, not proof of ownership. Claim review and physical handover remain separate steps.

## Quality checks

```bash
npm test
npm run build
```

`npm test` runs the matching-engine and starter-data integrity checks. `npm run build` verifies the production frontend bundle.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import the repository into Vercel and select the Vite framework preset.
3. Deploy. No environment variables or database credentials are required.
4. `vercel.json` provides SPA route rewrites for direct links such as `/explore` and `/items/:id`.

**Deployment note:** a deployed static site still uses each visitor's own browser storage. Data is not shared between visitors or devices.

## Security reporting

See [SECURITY.md](SECURITY.md). This browser-only prototype is not intended for real personal or sensitive information.

## License

MIT — see [LICENSE](LICENSE).
