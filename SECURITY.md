# Security Notes

Retrivo is a browser-only hackathon prototype. It does not use a backend database or server-side authentication.

## Important limitations

- Accounts, reports, claims, notifications and activity records are stored in the current browser using `localStorage`.
- Browser storage can be inspected or modified by the person using that browser.
- Client-side role checks are for prototype workflow access only; they are not a secure authorization boundary.
- Passwords stored in browser storage are not protected like passwords handled by a server-side authentication provider.
- Uploaded images are stored as data URLs in browser storage and are subject to browser storage limits.
- Data is not synchronized across users, browsers or devices.

## Safe use

- Use fictional information during judging and presentations.
- Do not store real identity documents, student IDs, private contact details or sensitive claim evidence.
- Meet in a public, well-lit campus location and use institution-approved staff or help desks for physical handovers.

## Before production

A production deployment needs a trusted backend, secure authentication, server-enforced role-based authorization, database policies, private object storage, input validation, rate limiting, audit logging and backup/recovery procedures.
