# Data Engineering Portfolio - Firebase Setup Guide

## 🚀 Quick Setup Steps

### 1. Create New Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. **Project name**: `sai-sugun-data-engineering-portfolio`
4. **Project ID**: `sai-sugun-de-portfolio` (or similar)
5. Enable Google Analytics (optional)
6. Create project

### 2. Enable Required Services

#### Authentication
1. Go to "Authentication" → "Get started"
2. Go to "Sign-in method" tab
3. Enable "Email/Password"

#### Firestore Database
1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode"
3. Select location (choose closest to your users)

#### Storage (Optional)
1. Go to "Storage" → "Get started"
2. Choose "Start in test mode"

### 3. Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click "Web" icon (`</>`)
4. Register app:
   - App nickname: `Data Engineering Portfolio`
   - Check "Also set up Firebase Hosting" (optional)
5. Copy the config object

### 4. Update Local Configuration
Replace the placeholder values in `src/config/firebase-de.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.firebasestorage.app",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

### 5. Update Imports
In your components, change the import from:
```typescript
import { auth, db } from '../config/firebase';
```
to:
```typescript
import { auth, db } from '../config/firebase-de';
```

### 6. Set Up Firestore Security Rules

Go to Firestore → Rules and update with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all users for public content
    match /{document=**} {
      allow read: if true;
    }
    
    // Allow write access only to authenticated users
    match /settings/{document} {
      allow write: if request.auth != null;
    }
    
    match /images/{document} {
      allow write: if request.auth != null;
    }
  }
}
```

### 7. Create Initial Data Structure

You'll need to create these collections in Firestore:

#### settings/homepage
```json
{
  "heroTitle": "Sai Sugun Ravipalli",
  "heroSubtitle": "Senior Data Engineer | Delivering scalable data solutions...",
  "slideshowTitle": "Featured Data Engineering Projects",
  "slideshowSubtitle": "Real-world implementations showcasing...",
  "servicesTitle": "Core Technical Competencies",
  "servicesSubtitle": "Proven expertise in modern data engineering...",
  "statsTitle": "Professional Impact",
  "statsSubtitle": "Delivering measurable business value...",
  "whyChooseTitle": "Why Hire Me",
  "whyChooseSubtitle": "Combining deep technical expertise...",
  "ctaTitle": "Ready to Discuss Your Data Engineering Needs?",
  "ctaSubtitle": "Let's explore how my expertise..."
}
```

#### settings/contact
```json
{
  "contactInfo": [
    {
      "iconName": "Mail",
      "title": "Email",
      "value": "ravipallisugun@gmail.com",
      "link": "mailto:ravipallisugun@gmail.com"
    },
    {
      "iconName": "Phone",
      "title": "Phone",
      "value": "6823905902",
      "link": "tel:6823905902"
    },
    {
      "iconName": "MapPin",
      "title": "LinkedIn",
      "value": "linkedin.com/in/sai-sugun-ravipalli",
      "link": "https://www.linkedin.com/in/sai-sugun-ravipalli/"
    },
    {
      "iconName": "MapPin",
      "title": "Location",
      "value": "Dallas, Texas",
      "link": "#"
    }
  ],
  "availabilityTimings": {
    "weekdays": "9:00 AM - 6:00 PM CST",
    "weekends": "Available for urgent interviews",
    "events": "Immediate joining available"
  }
}
```

### 8. Deployment Options

#### Option A: Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

#### Option B: Vercel (Recommended)
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

#### Option C: Netlify
1. Build: `npm run build`
2. Drag and drop `build` folder to Netlify

### 9. Environment Variables (Optional)
Create `.env.local` for sensitive data:
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
```

## 🔧 Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure your domain is added to Firebase authorized domains
2. **Permission denied**: Check Firestore security rules
3. **Authentication issues**: Verify email/password is enabled
4. **Build errors**: Ensure all imports are updated to use `firebase-de`

### Testing:
1. Test authentication: Try logging in as admin
2. Test data loading: Check if homepage content loads
3. Test data saving: Try editing content as admin
4. Test contact form: Submit a test message

## 📝 Next Steps
1. Set up your new Firebase project
2. Update the configuration
3. Test locally
4. Deploy to your chosen platform
5. Update your domain/DNS settings

## 🎯 Benefits of Separate Firebase
- **Clean separation** between photography and professional portfolios
- **Independent scaling** and billing
- **Better security** with separate access controls
- **Professional branding** with dedicated project name
- **Easier maintenance** and updates
