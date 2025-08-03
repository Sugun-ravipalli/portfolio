# Setup Guide for Photography Portfolio Admin System

## Quick Start

### 1. Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Enter project name (e.g., "photography-portfolio")
   - Enable Google Analytics (optional)
   - Click "Create project"

2. **Enable Services**:
   - **Authentication**: Go to Authentication > Sign-in method > Enable Email/Password
   - **Firestore**: Go to Firestore Database > Create database > Start in production mode
   - **Storage**: Go to Storage > Get started > Start in production mode

3. **Get Configuration**:
   - Go to Project Settings (gear icon) > General
   - Scroll down to "Your apps" section
   - Click "Add app" > Web app
   - Register app and copy the config

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### 3. Firebase Security Rules

**Firestore Rules** (Database > Rules):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /images/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /genres/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Storage Rules** (Storage > Rules):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /gallery/{category}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Create Admin User

1. Go to Authentication > Users
2. Click "Add user"
3. Enter email and password (e.g., admin@photography.com / admin123)
4. This user will have access to the admin dashboard

### 5. Install and Run

```bash
# Install dependencies
npm install

# Start development server
npm start
```

### 6. Access Admin Dashboard

1. Navigate to `http://localhost:3000/admin`
2. Login with your admin credentials
3. Start uploading and managing images!

## Features Overview

### Admin Dashboard (`/admin`)

**Upload Tab**:
- Drag & drop image upload
- Image cropping and rotation
- Genre/category management
- Title and description editing

**Gallery Tab**:
- View all uploaded images
- Search and filter functionality
- Download and delete images
- Image details and metadata

### Public Gallery (`/gallery`)

- Responsive image grid
- Category filtering
- Full-screen image viewer
- Download functionality

## Troubleshooting

### Common Issues

1. **"Firebase not initialized" error**:
   - Check environment variables are correct
   - Ensure `.env` file is in root directory
   - Restart development server

2. **Upload fails**:
   - Verify Firebase Storage rules
   - Check file size (max 10MB recommended)
   - Ensure admin is logged in

3. **Images not displaying**:
   - Check Firebase Storage URLs
   - Verify CORS settings
   - Check browser console for errors

4. **Authentication issues**:
   - Verify admin user exists in Firebase
   - Check email/password are correct
   - Clear browser cache and cookies

### Getting Help

1. Check browser console for error messages
2. Verify Firebase Console for service status
3. Ensure all environment variables are set correctly
4. Check Firebase project settings and rules

## Next Steps

1. **Customize Genres**: Add your own categories in the admin dashboard
2. **Upload Images**: Start building your portfolio
3. **Customize Styling**: Modify colors and layout in `tailwind.config.js`
4. **Deploy**: Deploy to Vercel, Netlify, or your preferred hosting platform

## Security Notes

- Keep your Firebase API keys secure
- Regularly update admin passwords
- Monitor Firebase usage and costs
- Consider implementing additional security measures for production

## Support

For additional help:
- Check Firebase documentation
- Review React and TypeScript documentation
- Contact for technical support 