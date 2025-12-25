# Environment Variables (.env)

This file documents the environment variables used by the application. The canonical keys are defined in `src/config/server-env.ts` and the file below lists each key, purpose, type, whether it's required, and example values.

Important: Never commit real secret values to source control. Use your hosting secrets or a local `.env` file that is excluded from git.

- `MONGODB_URI` (string) — Required
  - Purpose: MongoDB connection string used by Mongoose and MongoDB client.
  - Example: `mongodb://localhost:27017/digitalcv` or `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

- `NEXTAUTH_URL` (string) — Required
  - Purpose: Public URL of your Next.js app (used by NextAuth for callbacks/redirects).
  - Example: `http://localhost:3000` or `https://your-app.example.com`

- `NEXTAUTH_SECRET` (string) — Required
  - Purpose: Secret used by NextAuth for encrypting tokens/sessions.
  - Example: a long random string (use `openssl rand -base64 32` or a secrets manager)

- `GOOGLE_CLIENT_ID` (string) — Required if using Google auth
  - Purpose: OAuth client id for Google provider in NextAuth.
  - Example: `123.apps.googleusercontent.com`

- `GOOGLE_CLIENT_SECRET` (string) — Required if using Google auth
  - Purpose: OAuth client secret for Google provider in NextAuth.
  - Example: `GOCSPX-...`

- `AI_URL` (string) — Required
  - Purpose: Base URL of the external AI service used by the CV upload flow for OCR and enhancement.
  - Example: `https://ai.example.com` (the code posts to `${AI_URL}/cv/ocr-and-structure` and `${AI_URL}/cv/enhance`)

- `GENIE_API_URL` (string) — Required for payment gateway
  - Purpose: Payment gateway endpoint used by `/api/startpayment`.
  - Example: `https://api.uat.geniebiz.lk/public/v2/transactions`

- `GENIE_API_KEY` (string) — Required for payment gateway
  - Purpose: Authorization key for the Genie payment API; passed in `Authorization` header.
  - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

Example `.env` (do not commit):

```
MONGODB_URI=mongodb://localhost:27017/digitalcv
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
AI_URL=https://ai.example.com
GENIE_API_URL=https://api.uat.geniebiz.lk/public/v2/transactions
GENIE_API_KEY=your-genie-api-key
```

If you add other environment variables in the codebase, please update this file accordingly.
