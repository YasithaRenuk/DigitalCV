# API Documentation

This document lists the server API endpoints found under `src/app/api/`, their methods, required parameters, example requests and responses, and auth requirements as implemented in code.

Note: Where code checks session/auth, the document marks the endpoint as requiring authentication. If no session check is present the endpoint is listed as publicly callable (but protect sensitive endpoints in production).

---

- **POST** `/api/startpayment`
  - Purpose: Start a payment transaction (creates Payment, calls external Genie API) and returns a redirect `url` for the payment gateway.
  - Auth: none (code accepts `userId` in body)
  - Body (JSON): `{ userId: string, CVID: string }`
  - Response (200): `{ success: true, url: string }`
  - Errors: 404 if user or CV not found, 500 on server error
  - File: `src/app/api/startpayment/route.ts`

- **POST** `/api/savepayment`
  - Purpose: Webhook handler to update a Payment record after gateway callback. Updates Payment status and (if confirmed) sets related `UserCV` to `active`.
  - Auth: none (webhook)
  - Body (JSON): expected fields include `{ localId: string, state: string, transactionId?: string, ... }`
  - Response (200): `{ success: true }`
  - Errors: 404 if payment not found
  - File: `src/app/api/savepayment/route.ts`

- **GET** `/api/payment-details?transactionId=...`
  - Purpose: Retrieve login details (username + pin) for a CV by payment transaction id.
  - Auth: none
  - Query: `transactionId` (required)
  - Response (200): `{ success: true, username: string, pin: string }`
  - Errors: 400 missing, 404 not found
  - File: `src/app/api/payment-details/route.ts`

- **GET** `/api/payment`
  - Purpose: List payments with optional user meta included.
  - Auth: none enforced in code (consider restricting to admin)
  - Response (200): `{ success: true, payments: Array<...> }`
  - File: `src/app/api/payment/route.ts`

- **POST** `/api/serchCV`
  - Purpose: Verify username + PIN and return the CV _id.
  - Auth: none
  - Body (JSON): `{ username: string, pin: string }`
  - Response (200): `{ success: true, id: string }`
  - Errors: 400 missing, 401 invalid PIN, 404 not found or pending/deactive
  - File: `src/app/api/serchCV/route.ts`

- **POST** `/api/getCVWithId`
  - Purpose: Return parsed CV JSON for a given `id`.
  - Auth: none
  - Body (JSON): `{ id: string }`
  - Response (200): `{ success: true, data: <parsed CV object> }`
  - Errors: 404 not found, 400 if CV empty
  - File: `src/app/api/getCVWithId/route.ts`

- **POST / GET / DELETE / PUT** `/api/usercv` (main)
  - Purpose: Create UserCV (POST), list all (GET - admin only), delete (DELETE - admin), update (PUT - admin)
  - Auth: POST requires session; GET/DELETE/PUT require admin session (code checks `session.user.role === 'admin'` for admin actions)
  - POST (form-data): fields `username`, `password`, `cvFiles` (files), optional `userId` (admin only)
  - POST Response (201): `{ message, userCV: { id, username, states, start_date, end_date } }`
  - Errors: 409 username exists, 422/502 for OCR/AI service errors, 401 unauthorized
  - Post-creation flow: app calls external AI service at `AI_URL` for OCR + enhancement; these env keys are required.
  - Files: `src/app/api/usercv/route.ts`

- **GET** `/api/usercv/get-by-email`
  - Purpose: Return all UserCVs for the authenticated user (by session email)
  - Auth: session required
  - Response (200): `{ success: true, userCVs: [...] }`
  - File: `src/app/api/usercv/get-by-email/route.ts`

- **POST / DELETE** `/api/usercv/delete-own`
  - Purpose: Delete a CV owned by the authenticated user
  - Auth: session required (checks `session.user.email` and ownership)
  - Body (JSON): `{ id: string }`
  - Response: `{ success: true }`
  - File: `src/app/api/usercv/delete-own/route.ts`

- **POST** `/api/usercv/get-cv`
  - Purpose: Admin-only endpoint to fetch `cv` field for a UserCV
  - Auth: admin session required
  - Body (JSON): `{ id: string }`
  - Response (200): `{ success: true, cv: string }`
  - File: `src/app/api/usercv/get-cv/route.ts`

- **GET / DELETE / PUT** `/api/user`
  - Purpose: Manage users (list, delete, update role)
  - Auth: admin session required (all actions check for admin role)
  - GET Response: `{ success: true, users: [...] }`
  - DELETE Body: `{ id: string }` (deletes user & related UserCVs)
  - PUT Body: `{ id: string, role: 'user'|'admin' }` (update role)
  - File: `src/app/api/user/route.ts`

- **POST / GET / DELETE** `/api/reports` and `/api/report`
  - Purpose: Create and manage user-submitted reports/contacts
  - `/api/reports` POST: create report `{ firstName, lastName?, topic, message, email? }` -> 201
  - `/api/reports` GET: list reports
  - `/api/reports` DELETE: bulk delete `{ ids: string[] }`
  - `/api/report` POST: fetch a single report `{ id }`
  - `/api/report` DELETE: delete a single report `{ id }`
  - Auth: none enforced (consider gating admin actions)
  - Files: `src/app/api/reports/route.ts`, `src/app/api/report/route.ts`

- **GET** `/api/users/export`
  - Purpose: Export user list to Excel (XLSX) and return as file attachment
  - Auth: admin session required
  - File: `src/app/api/users/export/route.ts`

- **GET** `/api/admin/stats`
  - Purpose: Return admin statistics computed by `getAdminStats` action
  - Auth: not enforced in this route file (check `getAdminStats` for any auth checks)
  - File: `src/app/api/admin/stats/route.ts`

- **Auth** `/api/auth/[...nextauth]`
  - Purpose: NextAuth handlers (GET/POST exported by `src/lib/auth`)
  - File: `src/app/api/auth/[...nextauth]/route.ts` and `src/lib/auth.ts`

---

Guidance & notes
- Review endpoints marked as public — several admin or sensitive endpoints currently have no auth in the route file; consider adding server-side checks or middleware.
- For webhook endpoints (e.g., `/api/savepayment`) validate incoming requests (e.g., HMAC, IP allowlist) to prevent spoofing.
- External integrations: `/api/startpayment` uses `GENIE_API_URL` and `GENIE_API_KEY`; `/api/usercv` calls `AI_URL` for OCR/enhance. Ensure those env vars are set.
