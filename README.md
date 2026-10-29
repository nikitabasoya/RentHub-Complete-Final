# RentHub — Angular Apartment Rental Platform

A responsive apartment rental marketplace built with Angular standalone components. This project implements the requirements in the supplied **Angular Assignment — Rent-hub** PDF, including the bonus preview-and-submit flow.

## Features

- **Registration and login** with basic form validation, renter/landlord roles, logout, and route guards.
- **Home page** with a featured-listing carousel, listing cards, favourites, pagination, sorting, search, and filters for property type, maximum rent, furnished status, and lease duration.
- **Create and edit property listings** with property type, building, shared-property selection, location, area, beds/baths, rent, price mode, lease type, furnished status, negotiability, vegetarian preference, amenities checkboxes, description, photo URLs, and contact details.
- **Preview and submit** step before publishing a listing.
- **Listing details** with photos, property terms, amenities, contact information, mail-to enquiry, comments, and replies.
- **Profile** with the current user's listings and saved favourites.
- **Browser persistence** using localStorage. Demo listings are pre-seeded on first launch.
- Responsive layouts, keyboard-friendly controls, labels, empty states, and reduced-motion support.
- Unit tests for the application component, storage service, and route configuration.

## Requirements

- Node.js 22 or a compatible supported LTS version
- npm
- Angular CLI 21 (installed through the project dependencies)

Check your versions:

```bash
node -v
npm -v
```

## Run locally

1. Extract the ZIP file.
2. Open a terminal in the `renthub-angular` folder (the folder containing `package.json`).
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open `http://localhost:4200`.

Build the production version:

```bash
npm run build
```

Run unit tests:

```bash
npm test
```

## Demo use

There are seeded sample properties. Register an account to save favourites, add comments/replies, and create your own listings. Choose **Listing a property** during registration if you intend to host a property. No pre-created login credentials are required.

**Important:** This is an assignment/demo implementation. Authentication and data are stored in the browser's localStorage, and passwords are not securely hashed. Do not use real personal information or deploy this as a production authentication system. A production version should use a secure backend, hashed passwords, server-side authorization, validated uploads, and a database.

## Deployment

A live URL and GitHub repository URL must be added by the student after publishing the project. They cannot be truthfully supplied before deployment/push.

### GitHub

Create a repository, then from this folder run:

```bash
git init
git add .
git commit -m "Build RentHub Angular rental marketplace"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Do **not** commit `node_modules`.

### Free frontend hosting

Build with `npm run build`. The production output is under `dist/renthub-angular/browser` for the Angular application builder. Deploy that directory to a static hosting provider such as Netlify, Vercel, or Cloudflare Pages. Set the build command to `npm run build`, publish directory to `dist/renthub-angular/browser`, and enable SPA fallback/rewrites to `index.html` so Angular routes load on refresh.

After deployment, replace the placeholders below with your real links:

- GitHub repository: `ADD_YOUR_GITHUB_REPOSITORY_URL`
- Deployed application: `ADD_YOUR_DEPLOYED_APPLICATION_URL`

## Assignment checklist

| PDF requirement | Implementation |
|---|---|
| Registration and authentication | `AuthService`, `AuthComponent` |
| Auth guards | `auth.guard.ts` protects profile and listing create/edit routes |
| Routing | `app.routes.ts`, standalone Angular routes |
| Create/manage listings | `ListingFormComponent`, `ListingService` |
| Search and filtering | Home page keyword/location, type, budget, furnished, lease filters |
| Featured carousel | Previous/next controls on featured listing |
| Sorting and pagination | Newest, rent ascending/descending, area; paginated grid |
| Favourites / express interest | Save and remove favourites; mail-to enquiry |
| Comments and replies | Listing details page |
| Required property form controls | Selects, checkboxes, radio-equivalent preference selector, validation |
| Preview and submit bonus | Three-step form with review screen |
| Unit tests | App component, storage service, route configuration specs |
| Responsive UI | `src/styles.css` |
| README | This file; deployment links are placeholders until actually published |

## Notes

- This project deliberately avoids a backend so it can be run and evaluated locally with minimal setup.
- Listing photos use remote Unsplash URLs; internet access is needed to load them. New listings accept image URLs.
- localStorage is browser-specific; data is not shared across devices or browsers.
