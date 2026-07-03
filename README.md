# Checkout (Tez One-Click Checkout)

A React + TypeScript single-page checkout application designed to be embedded (typically as an iframe) into merchant storefronts. It drives the end-to-end purchase flow: phone/email identification with OTP verification, address and user detail capture, payment-method selection, card entry, order review, and success/failure handling. The app supports multiple payment rails and gateways, tokenizes card data through a secure vault, and streams analytics/events back to the platform.

## Tech Stack

- **Language:** TypeScript
- **Framework:** React 18 (Create React App / `react-scripts` 5)
- **Routing:** React Router DOM v5
- **UI:** Material UI (`@mui/material`, `@mui/icons-material`, `@mui/styles`), React-Bootstrap, React Toastify, React Notifications Component, SweetAlert2, React Loader Spinner / React JS Loader
- **State:** React Context + custom hooks (per-step hooks under `hooks/custom`)
- **HTTP:** Axios
- **Payments:** Stripe (`@stripe/stripe-js`, `@stripe/react-stripe-js`, `stripe`), Square (`@square/web-sdk`, `react-square-web-payments-sdk`), Skyflow (`skyflow-js`) for card tokenization/vaulting, plus Bank Alfalah and PayFast integrations
- **Analytics & monitoring:** Sentry (`@sentry/react`), Google Analytics (`react-ga`, `react-ga4`), RudderStack, Facebook Pixel/Events
- **Utilities:** Lodash, Moment, Math.js, crypto-js, DOMPurify, currency-formatter, js-base64, dotenv
- **Address/location:** `react-places-autocomplete`, `address`
- **OTP & timers:** `react-otp-input`, `react-timer-hook`, `react-countdown-circle-timer`

## Features

- **Multi-step checkout flow:** phone entry, phone OTP, user details, payment selection, email OTP, payment detail, order review, success, failure, and cancel pages.
- **OTP-based authentication** for phone and email via the authentication microservice.
- **Multiple payment methods:** saved cards, new card entry, wallet balance, Bank Alfalah, PayFast, Stripe, and Square.
- **Secure card handling** through the Skyflow vault (vault ID/URL configuration and client-side collection).
- **Address management** with places autocomplete, shipping location selection, and blocked-city checks.
- **Tax and shipping calculation** via merchant/web-external microservices.
- **Coupons/discounts** and BIN-based discount calculation.
- **Upsell** cards during checkout.
- **Post-purchase survey** modals.
- **Headless / embedded modes** with `postMessage` communication to the parent window (e.g. closing the checkout iframe).
- **Analytics & events:** RudderStack tracking, Google Analytics, and Facebook Pixel events; error reporting via Sentry and an in-app error boundary.
- **Lazy-loaded routes** for faster initial load.

## Project Structure

```
tez-checkout-rebuild/
├── public/
├── src/
│   ├── pages/              # Route-level screens (PhonePage, PaymentSelectionPage, OrderReviewPage, etc.)
│   ├── components/
│   │   ├── payment/        # Payment UI: cards, Alfalah, PayFast, shipping/address, upsell
│   │   └── modals/         # Survey and finish-survey modals
│   ├── hooks/
│   │   ├── context/        # Checkout context, initial state, actions, reducer
│   │   └── custom/         # Per-step logic hooks (usePhone, useEmailOtp, usePaymentSelection, ...)
│   ├── services/           # API clients (order, user, otp, address, location, merchant, skyflow, ...)
│   ├── interfaces/         # TypeScript interfaces (e.g. place-order API)
│   ├── utils/              # Helpers (token validation, currency symbol, loadable, blocked cities)
│   ├── router/routes.ts    # Route path definitions
│   ├── styles/             # Screen-specific CSS
│   ├── error/              # Error boundary
│   ├── App.tsx             # Root component: routing, analytics init, iframe messaging
│   └── index.tsx           # Application entry point
├── tsconfig.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (a recent LTS release; the scripts enable the OpenSSL legacy provider for Node 17+)
- npm or Yarn

### Installation

```bash
npm install
```

### Environment

Create a `.env` file in the project root and set the microservice base URLs and payment/vault configuration (see Environment Variables below). Example:

```bash
REACT_APP_ORDER_MS_API_KEY=<orders service base URL>
REACT_APP_AUTHENTICATION_MS_API_KEY=<auth service base URL>
REACT_APP_WEB_EXTERNAL_MS_API_KEY=<web-external service base URL>
REACT_APP_SKYFLOW_URL=<skyflow base URL>
```

### Running

```bash
npm start
```

## Available Scripts

- `npm start` - Start the development server.
- `npm run build` - Create a production build.
- `npm test` - Run tests.
- `npm run eject` - Eject Create React App configuration.

## Environment Variables

These are read via `process.env` in the services, hooks, and pages:

- `REACT_APP_ORDER_MS_API_KEY` - Base URL for the orders microservice (place order, gateway creds, discounts, PayFast, top-selling products).
- `REACT_APP_AUTHENTICATION_MS_API_KEY` - Base URL for the authentication/OTP microservice (sign-in, OTP).
- `REACT_APP_WEB_EXTERNAL_MS_API_KEY` - Base URL for the web-external microservice (taxes, location, general lookups).
- `REACT_APP_CUSTOMER_MS_API_KEY` - Base URL for the customer/address microservice.
- `REACT_APP_MERCHANT_SCRIPTS_API_KEY` - Base URL for merchant scripts / Facebook events.
- `REACT_APP_GET_USER_CARD` - Endpoint base for fetching/deleting saved user cards.
- `REACT_APP_GET_WALLET_BALANCE` - Endpoint for retrieving wallet balance.
- `REACT_APP_SKYFLOW_URL` - Skyflow service base URL.
- `REACT_APP_SKYFLOW_VAULT_ID` - Skyflow vault identifier.
- `REACT_APP_SKYFLOW_VAULT_URL` - Skyflow vault URL.
- `REACT_APP_ABANDONED_CART_URL` - Base URL for abandoned-cart session tracking.

Note: values are configuration/credentials and should be supplied via environment; never commit real secrets.

## Author

Author: Shehzad Asadullah — https://github.com/shehzadasad
