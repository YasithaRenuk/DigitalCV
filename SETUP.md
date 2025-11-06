# Setup Instructions

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection URL
MONGODB_URI=mongodb://localhost:27017/digitalcv

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production

# Google OAuth Credentials
# Get these from https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env` file

## Generate NextAuth Secret

You can generate a secure secret using:
```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

## MongoDB Setup

Make sure MongoDB is running on your system. You can:
- Install MongoDB locally
- Use MongoDB Atlas (cloud) and update the `MONGODB_URI` accordingly

## Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

