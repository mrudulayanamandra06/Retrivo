# Retrivo — Smart Campus Lost & Found Platform

> **Find it. Verify it. Retrieve it.**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7?logo=netlify&logoColor=white)](https://www.netlify.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-203B36.svg)](LICENSE)

**Live Application:** [retrivooo.netlify.app](https://retrivooo.netlify.app/)

## About

Retrivo is a smart campus lost-and-found platform designed for colleges and universities in India. It provides a centralised space for students and campus staff to report, discover and recover misplaced belongings.

The platform simplifies the recovery process through searchable listings, explainable smart matching and an ownership verification workflow.

## Features

- **Lost & Found Reporting:** Create reports with item details, descriptions, categories, locations and images.
- **Explore & Search:** Browse and filter lost and found listings.
- **Smart Matching:** Identify potentially related reports using category, title, location, date and description.
- **Ownership Claims:** Submit claims with distinguishing details and track their review status.
- **Claim Management:** Review, approve or reject claims and record item handovers.
- **Notifications:** Receive updates about claims and item activity.
- **QR Codes:** Generate QR codes linking to item detail pages.
- **User Dashboard:** Manage reports, claims and recovery progress.
- **Admin Workspace:** Review reports and manage platform activity.

## Technology Stack

| Category | Technology |
|---|---|
| Frontend | React 18, JavaScript |
| Build Tool | Vite 6 |
| Routing | React Router DOM |
| Styling | Custom CSS |
| Icons | Lucide React |
| Data Storage | Browser localStorage |
| QR Generation | qrcode |
| Deployment | Netlify |

## Smart Matching

Retrivo uses a weighted scoring model to identify potentially matching lost and found reports.

| Matching Criteria | Weight |
|---|---:|
| Category | 25% |
| Title similarity | 30% |
| Location | 20% |
| Date proximity | 15% |
| Description and features | 10% |

The system provides match scores and explanations to help users identify relevant reports. Matches are suggestions, not proof of ownership.

## Data Storage

Retrivo uses browser `localStorage` for application data. No external database or backend is required.

| Module | Storage Key |
|---|---|
| User accounts | `retrivo_users` |
| Login session | `retrivo_session` |
| Item reports | `retrivo_items` |
| Smart matches | `retrivo_matches` |
| Ownership claims | `retrivo_claims` |
| Notifications | `retrivo_notifications` |
| Activity history | `retrivo_activity` |

**Note:** Data is stored locally in the browser and is not synchronised between different devices or browsers. This implementation is intended as a functional prototype, not a production multi-user service. Avoid entering real personal or sensitive information.

## Getting Started

**Prerequisites:** Node.js 18+ and npm.

Clone the repository:

```bash
git clone https://github.com/nrudulayanamandra06/retrivo.git
cd retrivo
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL provided by Vite, normally `http://localhost:5173`.

## Sample Account

Use the **Fill sample login details** option on the Sign In page.

| Field | Value |
|---|---|
| Name | Lalli |
| Email | `lalli@campus.ac.in` |
| Password | `password123` |

The login details are populated automatically. Select Sign In to continue.

## Project Structure

```text
retrivo/
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   └── styles/
├── .github/
│   └── workflows/
├── LICENSE
├── SECURITY.md
├── package.json
└── README.md
```

## Testing

Run the test suite:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

## Deployment

Retrivo is deployed on Netlify.

**Live URL:** https://retrivooo.netlify.app/

| Configuration | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Environment variables | Not required |

For React Router direct navigation, include this in `public/_redirects`:

```text
/* /index.html 200
```

## Future Enhancements

- Shared cloud database and multi-device synchronisation.
- Secure authentication and role-based access control.
- Real-time notifications.
- Advanced matching techniques.
- Improved image storage.
- Campus-level analytics and moderation.

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">

**Retrivo — Find it. Verify it. Retrieve it.**

</p>
