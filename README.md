<div align="center">

# 🌱 FarmerConnect

### Connecting farmers, wholesalers, and transport providers in one agricultural marketplace

**Full-stack web application · Role-based workflows · Digital payments · Logistics coordination**

[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-2F6B3D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-116149?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?logo=stripe&logoColor=white)](https://stripe.com/)

</div>

---

## Overview

**FarmerConnect** is a full-stack agricultural trading platform designed to connect produce sellers, wholesale buyers, and transport providers. Farmers manage produce listings, wholesalers discover and purchase products, transport providers handle delivery requests, and administrators review user registrations.

The project brings together marketplace operations, role-based authorization, email verification, payment handling, and delivery coordination in a single application.

## Key features

| Role | Available workflows |
|---|---|
| **Farmer** | Create, view, edit, and delete produce listings (with images); view farmer ranking information. |
| **Wholesaler** | Find produce by name or farmer; browse leading farmers; start checkout; review orders; request transport and manage transport payments. |
| **Transport provider** | Review incoming delivery offers, accept requests, see current deliveries, and update delivery progress. |
| **Administrator** | Review registrations and approve or reject user accounts. |

### Shared platform capabilities

- **Account onboarding:** email OTP verification, password setup, national-ID image upload, and administrator approval.
- **Authentication and authorization:** JWT-based protected API routes with checks for assigned user roles.
- **Produce marketplace:** listings associated with farmers, inventory quantities, and listing status.
- **Payments:** Stripe Checkout sessions for produce purchases; a webhook handler verifies completed checkouts, marks orders paid, and adjusts available inventory.
- **Transport coordination:** district-based delivery-fee calculation, transport requests and offers, and delivery-status updates.
- **Farmer statistics:** sales-related metrics and ranking views.

> **Project status:** This repository contains an implemented coursework/prototype application. Features are documented from source code; deployment, payment setup, and complete end-to-end workflows require configuration and testing in the target environment.

## Technology stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, DaisyUI, Axios, Lucide React |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs, email OTP via Nodemailer |
| Media | Multer, Cloudinary |
| Payments | Stripe Checkout and webhooks |
| Testing | Jest, Supertest (server tests) |

## Project structure

```text
FarmerConnect/
├── client/
│   ├── src/
│   │   ├── components/     # Role-specific interface components
│   │   ├── context/        # Authentication context
│   │   └── pages/          # Pages and workflows
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/             # Database, media, payment configuration
│   ├── controllers/        # Business logic
│   ├── middlewares/        # Authentication, roles, uploads
│   ├── models/             # MongoDB schemas
│   ├── routes/             # Express API routes
│   ├── tests/              # Jest/Supertest tests
│   ├── app.js
│   └── server.js
└── .env.example
```

## Run locally

**Requirements:** Node.js, npm, MongoDB (local or hosted), and credentials for the enabled email, image-upload and payment integrations.

1. Clone the repository:

   ```bash
   git clone https://github.com/ak-kamal/FarmerConnect.git
   cd FarmerConnect
   ```

2. Install dependencies in separate terminals:

   ```bash
   cd server
   npm install
   ```

   ```bash
   cd client
   npm install
   ```

3. Create `server/.env` and configure values for your environment:

   ```dotenv
   MONGO_URI=mongodb://127.0.0.1:27017/farmer_connect
   PORT=5000
   JWT_SECRET=replace_with_a_long_random_secret
   CLIENT_URL=http://localhost:5173

   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_app_password

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret

   STRIPE_SECRET_KEY=your_stripe_test_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_signing_secret
   ```

   The root `.env.example` documents part of the configuration; the variables above are the additional names referenced in the backend source. Use **test credentials**, never production keys, for local experiments.

4. Start the backend from `server/`:

   ```bash
   npm start
   ```

5. Start the frontend from `client/`:

   ```bash
   npm run dev
   ```

6. Open **http://localhost:5173**. The Vite development server proxies `/api` and `/uploads` to `http://localhost:5000`.

**Stripe testing:** Checkout completion relies on a webhook. Forward Stripe test webhook events to the backend endpoint corresponding to `/api/webhooks` and configure the matching webhook signing secret. Payment-dependent operations are not fully testable without this integration.

## Testing

From the `server/` directory:

```bash
npm test
```

The repository includes server-side test files for produce, transport, and orders. Passing results are not asserted here because the suite was not executed during this documentation review.

## API modules

The Express server mounts its main routes under:

- `/api/users` — signup, OTP verification, password setup, login, logout.
- `/api/farmer` — produce management and rankings.
- `/api/wholesaler` — produce/farmer discovery and wholesaler-specific operations.
- `/api/orders` — produce checkout session.
- `/api/transport` — transport requests, offers, and deliveries.
- `/api/admin` — account review.
- `/api/webhooks` — payment callbacks.

## Engineering notes and limitations

- The system uses **role-based routes** and separate domain models for users, produce, orders, and transport requests.
- Stripe's produce-payment webhook checks for already-paid orders before updating inventory, but inventory reservation and concurrency guarantees should be reviewed before production use.
- Some transport/payment flows involve related order fields and status transitions; validate the full workflow against the current schemas before deploying.
- Uploaded identity documents and account data are sensitive. Use appropriate access controls, secure media storage, and secret management in any public deployment.
- No deployed application URL or production-readiness claim is provided here.

## Future improvements

Potential next steps include stronger payment/stock transaction handling, expanded integration tests, improved operational monitoring, and deployment-specific configuration/documentation.

---

<div align="center">

**FarmerConnect** · An agricultural marketplace and logistics prototype

[Back to my GitHub profile](https://github.com/ak-kamal)

</div>
