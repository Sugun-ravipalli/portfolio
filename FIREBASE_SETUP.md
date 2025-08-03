# 🔥 Firebase Setup Guide for Photography Portfolio

This guide will walk you through setting up Firebase for your photography portfolio web app step by step.

## 📋 Prerequisites

- A Google account
- Your photography portfolio app running locally
- Basic understanding of web development concepts

---

## 🚀 Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
1. Open your web browser and go to [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account
3. Click **"Create a project"** or **"Add project"**

### 1.2 Project Setup
1. **Project name**: Enter a name like `photography-portfolio` or `my-photo-gallery`
2. **Google Analytics**: 
   - ✅ Enable Google Analytics (recommended)
   - Choose "Default Account for Firebase"
3. Click **"Create project"**
4. Wait for project creation to complete
5. Click **"Continue"**

---

## 🔐 Step 2: Enable Authentication

### 2.1 Access Authentication
1. In your Firebase project dashboard, click **"Authentication"** in the left sidebar
2. Click **"Get started"**

### 2.2 Enable Email/Password Sign-in
1. Click on the **"Sign-in method"** tab
2. Click on **"Email/Password"**
3. Toggle **"Enable"** to turn it on
4. ✅ Check **"Email link (passwordless sign-in)"** (optional)
5. Click **"Save"**

### 2.3 Create Admin User
1. Go to the **"Users"** tab
2. Click **"Add user"**
3. Enter your admin credentials:
   - **Email**: `admin@yourdomain.com` (or any email you control)
   - **Password**: Create a strong password (at least 8 characters)
4. Click **"Add user"**
5. **Save these credentials** - you'll need them to log into your admin panel

---

## 🗄️ Step 3: Set Up Firestore Database

### 3.1 Create Firestore Database
1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll secure it later)
4. Click **"Next"**
5. Choose a location close to your users (e.g., `us-central1` for US)
6. Click **"Done"**

### 3.2 Set Up Security Rules
1. In Firestore Database, click the **"Rules"** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to images and genres
    match /images/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /genres/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow authenticated users to manage all collections
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

---

## 📁 Step 4: Set Up Storage

### 4.1 Create Storage Bucket
1. In the left sidebar, click **"Storage"**
2. Click **"Get started"**
3. Choose **"Start in test mode"** (we'll secure it later)
4. Click **"Next"**
5. Choose the same location as your Firestore database
6. Click **"Done"**

### 4.2 Set Up Storage Rules
1. In Storage, click the **"Rules"** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to all images
    match /gallery/{category}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow authenticated users to upload to any location
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

---

## ⚙️ Step 5: Get Firebase Configuration

### 5.1 Get Web App Config
1. In the Firebase dashboard, click the **gear icon** (⚙️) next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **"Web"** icon (</>)
5. Enter app nickname: `photography-portfolio-web`
6. ✅ Check **"Also set up Firebase Hosting"** (optional)
7. Click **"Register app"**

### 5.2 Copy Configuration
1. You'll see a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

2. **Copy this entire configuration** - you'll need it in the next step

---

## 🔧 Step 6: Configure Your App

### 6.1 Create Environment File
1. In your project root directory, create a new file called `.env.local`
2. Add your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
```

**Important**: Replace the values with your actual Firebase configuration from Step 5.2

### 6.2 Restart Your Development Server
1. Stop your current server (Ctrl+C in terminal)
2. Run `npm start` again
3. Your app should now connect to Firebase!

---

## 🧪 Step 7: Test Your Setup

### 7.1 Test Authentication
1. Go to `http://localhost:3000/admin`
2. Try logging in with the admin credentials you created in Step 2.3
3. You should see the admin dashboard

### 7.2 Test Upload
1. In the admin dashboard, go to the "Upload" tab
2. Try uploading a test image
3. Check if it appears in the gallery

### 7.3 Test Gallery
1. Go to `http://localhost:3000/gallery`
2. Your uploaded images should appear
3. Test the category filters

---

## 🔒 Step 8: Secure Your App (Production)

### 8.1 Update Firestore Rules
Replace the test rules with production rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to images and genres
    match /images/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == "admin@yourdomain.com";
    }
    
    match /genres/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == "admin@yourdomain.com";
    }
  }
}
```

### 8.2 Update Storage Rules
Replace the test rules with production rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to gallery images
    match /gallery/{category}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == "admin@yourdomain.com";
    }
  }
}
```

**Important**: Replace `admin@yourdomain.com` with your actual admin email from Step 2.3

---

## 🚀 Step 9: Deploy to Production

### 9.1 Prepare for Vercel Deployment
1. Create a `.env.production` file with the same Firebase config
2. Or set environment variables in Vercel dashboard

### 9.2 Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

---

## 🆘 Troubleshooting

### Common Issues:

**1. "Firebase Auth Error: API key not valid"**
- ✅ Check that all environment variables are correct
- ✅ Ensure `.env.local` file is in the project root
- ✅ Restart your development server after adding environment variables

**2. "Permission denied" errors**
- ✅ Check Firestore and Storage security rules
- ✅ Ensure you're logged in as admin
- ✅ Verify admin email in security rules

**3. Images not uploading**
- ✅ Check Storage rules allow write access
- ✅ Verify Firebase Storage is enabled
- ✅ Check browser console for errors

**4. Images not displaying**
- ✅ Check Storage rules allow read access
- ✅ Verify image URLs are correct
- ✅ Check browser network tab for failed requests

### Getting Help:
- Check the browser console for error messages
- Review Firebase console logs
- Ensure all environment variables are set correctly

---

## ✅ Setup Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Admin user created
- [ ] Firestore database created
- [ ] Firestore security rules configured
- [ ] Storage bucket created
- [ ] Storage security rules configured
- [ ] Web app registered
- [ ] Configuration copied
- [ ] `.env.local` file created
- [ ] Development server restarted
- [ ] Authentication tested
- [ ] Upload functionality tested
- [ ] Gallery display tested
- [ ] Production security rules configured

---

## 🎉 You're All Set!

Your photography portfolio app is now fully connected to Firebase and ready for production use. You can:

- ✅ Upload and manage images through the admin panel
- ✅ Display images in categorized galleries
- ✅ Secure your app with proper authentication
- ✅ Deploy to production with confidence

**Next Steps:**
1. Test all functionality thoroughly
2. Add more admin users if needed
3. Customize the design to match your brand
4. Deploy to Vercel or your preferred hosting platform

Happy coding! 🚀 