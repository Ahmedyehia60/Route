# RouteFlow

RouteFlow is a smart logistics and delivery management system designed to help teams coordinate delivery operations and manage them through a central dashboard. This project combines a Next.js frontend with an Express API and PostgreSQL database.

## Authentication

The authentication system uses secure, cookie-based sessions for dashboard access.

## Features

- Email and password login with Argon2 password verification.
- Short-lived JWT access tokens and rotating refresh tokens. Refresh token hashes are stored in PostgreSQL.
- HTTP-only cookies with `SameSite=Strict`; cookies use `Secure` in production.
- Protected user endpoint and dashboard session check, with refresh and logout support.
- Email password reset using a single-use, eight-digit code that expires after 10 minutes.
- Rate limits on login and password reset endpoints, plus frontend form validation.

## Authentication API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Sign in and set authentication cookies. |
| `POST` | `/api/auth/refresh` | Rotate the refresh token and renew the access token. |
| `POST` | `/api/auth/logout` | Revoke the current refresh token and clear cookies. |
| `POST` | `/api/auth/password-reset/request` | Email a reset code. |
| `POST` | `/api/auth/password-reset/confirm` | Verify the code and update the password. |
| `GET` | `/api/users/user` | Return the signed-in user's details; requires a valid access token. |

## Configuration

Set `NEXT_PUBLIC_API_URL` in `next/.env`, for example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Configure `DATABASE_URL`, `JWT_SECRET`, `RESET_OTP_SECRET`, `EMAIL_USER`, `EMAIL_PASSWORD`, and `NODE_ENV` in `node/.env`. Keep secrets private and do not commit `.env` files.

## Run Locally

Run `npm run dev` in both the `node` and `next` directories, using separate terminals. The API runs on port `5000`; the frontend runs on port `3000` by default.
