# Lakshna Associates — Firebase Static Website

This version replaces the React + Supabase implementation with a **plain HTML + CSS + JavaScript** site using Firebase's browser SDK.

## What is included

- Same core public website sections: Home, About, Services, Projects, Gallery, Why Choose Us, Contact, Location and Footer.
- Responsive navigation and mobile menu.
- Project category filtering.
- Gallery masonry-style layout + full-screen lightbox with previous/next controls.
- Scroll reveal animations.
- WhatsApp floating chat widget.
- Contact/consultation form stored in **Cloud Firestore**.
- Firebase Email/Password authentication.
- Persistent admin login across devices.
- Admin dashboard with enquiry counts, filters, details, status changes and reply history.
- Password reset.
- Firestore Security Rules so visitors cannot read enquiries and browser users cannot create/modify admin records.
- Firebase Hosting configuration.
- No React, no Supabase, no npm dependency is required.

## 5-minute Firebase setup

1. Open https://console.firebase.google.com/ and sign in with Google.
2. Create a new Firebase project.
3. Add a **Web App** from Project Overview.
4. Copy the web configuration into `firebase-config.js`.
5. Go to **Authentication → Sign-in method** and enable **Email/Password**.
6. Go to **Firestore Database → Create database**.
7. Publish `firestore.rules`.
8. Open the website locally through a web server, visit `#admin`, and choose **Create Account**.
9. After the account is created, copy its Firebase Auth **UID**.
10. In Firestore create:
   - collection: `admins`
   - document ID: `<that UID>`
   - fields: `role` = `admin`, `name` = your name
11. Sign in again through `#admin`. The dashboard should now load.

### Why the admin is secure

The browser contains only the Firebase Web App configuration, which is normal for Firebase web applications. **Private service-account keys are not used.**

Actual protection is provided by `firestore.rules`:

- Public users may create a consultation enquiry.
- Only a signed-in user whose UID exists in `admins/{UID}` can read/update/delete enquiries.
- No browser user can write an admin record.
- Authentication is handled by Firebase Auth, not by a custom password stored in JavaScript.

## Run locally

Because browser ES modules and Firebase should be served over HTTP, use any static server.

For example, with Python:

```bash
python -m http.server 5500
```

Then open:

`http://localhost:5500`

Do not open `index.html` directly with `file://`.

## Deploy to Firebase Hosting

Install the Firebase CLI if you do not already have it, sign in, select your project, then deploy:

```bash
firebase login
firebase use YOUR_PROJECT_ID
firebase deploy
```

The included `firebase.json` serves this folder as the hosting root.

## Important limitation: email replies

Firebase Authentication + Firestore on the free client SDK can authenticate admins and store enquiry/reply history, but it does **not** itself provide a secure SMTP/email-sending API.

The admin dashboard therefore provides **Open Email & Record Reply**:
- the reply is securely recorded in Firestore;
- the browser opens the administrator's default email client with the client email, subject and message pre-filled;
- the admin clicks Send in their email client.

If you later need automatic server-side email sending, add a Firebase/Cloud Function or a transactional email provider. Do not put SMTP passwords or private API keys in `app.js`.

## Files

- `index.html` — website shell
- `styles.css` — all styling/responsive design
- `app.js` — public UI, Firebase Auth, Firestore and admin dashboard
- `firebase-config.js` — your Firebase Web App config
- `firestore.rules` — database security rules
- `firebase.json` — Firebase Hosting config
- `assets/` — original project images

