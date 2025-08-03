# Photography Portfolio with Admin System

A modern photography portfolio website with a comprehensive admin system for managing images, genres, and gallery content.

## Features

### Public Features
- **Responsive Gallery**: Beautiful grid layout with category filtering
- **Image Modal**: Full-screen image viewing with download functionality
- **Category Filtering**: Filter images by genres (Birthdays, Pre-Wedding, Housewarming, etc.)
- **Modern UI**: Clean, professional design with smooth animations

### Admin Features
- **Secure Authentication**: Firebase Authentication for admin access
- **Image Upload**: Drag & drop multiple image upload with preview
- **Image Cropping**: Built-in image cropper with rotation and aspect ratio control
- **Genre Management**: Create, edit, and delete custom genres/categories
- **Gallery Management**: View, search, and delete uploaded images
- **Real-time Updates**: Instant updates across the application

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Storage, Authentication)
- **Image Processing**: react-image-crop
- **UI Components**: Lucide React Icons
- **Notifications**: react-hot-toast

## Setup Instructions

### 1. Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### 2. Firebase Setup

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication, Firestore Database, and Storage

2. **Configure Authentication**:
   - In Firebase Console, go to Authentication > Sign-in method
   - Enable Email/Password authentication
   - Create an admin user with email and password

3. **Configure Firestore**:
   - Go to Firestore Database
   - Create a database in production mode
   - Set up security rules (see below)

4. **Configure Storage**:
   - Go to Storage
   - Create a storage bucket
   - Set up security rules (see below)

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### 4. Firebase Security Rules

**Firestore Rules**:
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
  }
}
```

**Storage Rules**:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to images
    match /gallery/{category}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

### 6. Admin Access

1. Navigate to `/admin` in your browser
2. Use the credentials you created in Firebase Authentication
3. Default demo credentials: `admin@photography.com` / `admin123`

## Usage

### Admin Dashboard

1. **Upload Images**:
   - Drag & drop images or click to select
   - Add title, description, and select category
   - Crop images using the built-in cropper
   - Upload to Firebase Storage

2. **Manage Genres**:
   - Create custom genres with descriptions
   - Delete existing genres
   - Organize images by categories

3. **Gallery Management**:
   - View all uploaded images
   - Search by title or description
   - Filter by category
   - Download or delete images

### Public Gallery

- Browse images by category
- Click images to view in full screen
- Download images directly
- Responsive design for all devices

## File Structure

```
src/
├── components/
│   ├── AdminAuth.tsx          # Admin authentication
│   ├── AdminGallery.tsx       # Gallery management
│   ├── AdminUploadForm.tsx    # Image upload with cropping
│   ├── GalleryGrid.tsx        # Public gallery display
│   ├── ImageCropper.tsx       # Image cropping component
│   └── ...
├── pages/
│   ├── AdminDashboard.tsx     # Main admin interface
│   ├── Gallery.tsx           # Public gallery page
│   └── ...
└── config/
    └── firebase.ts           # Firebase configuration
```

## Customization

### Adding New Genres
1. Go to Admin Dashboard > Upload Images
2. Click "Add Genre" in the Genre Management section
3. Enter genre name and description
4. Save to create the new category

### Styling
- Modify `tailwind.config.js` for theme customization
- Update CSS classes in components for styling changes
- Icons can be changed using Lucide React icons

### Firebase Configuration
- Update Firebase config in `src/config/firebase.ts`
- Modify security rules for different access levels
- Add additional Firebase services as needed

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
- Build the project: `npm run build`
- Upload the `build` folder to your hosting provider
- Ensure environment variables are configured

## Troubleshooting

### Common Issues

1. **Firebase Connection Errors**:
   - Verify environment variables are correct
   - Check Firebase project settings
   - Ensure services are enabled

2. **Upload Failures**:
   - Check Firebase Storage rules
   - Verify file size limits
   - Ensure proper authentication

3. **Image Display Issues**:
   - Check Firebase Storage URLs
   - Verify CORS settings
   - Ensure proper image formats

### Support

For issues or questions:
1. Check Firebase Console for errors
2. Review browser console for JavaScript errors
3. Verify all dependencies are installed correctly

## License

This project is open source and available under the MIT License. 