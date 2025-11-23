# Firebase Setup Guide

This app uses Firebase Firestore for backend data storage. Follow these steps to set up Firebase:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name (e.g., "flavoriz-app")
   - Enable/disable Google Analytics (optional)
   - Click "Create project"

## 2. Enable Firestore Database

1. In your Firebase project, go to **Build** > **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to your users)
5. Click "Enable"

### Set up Security Rules (Important!)

**Role-Based Access Control (RBAC) is implemented!**

The app uses a role-based security system with three roles:
- **user** (default) - Can create and manage their own meal plans
- **moderator** - Can manage recipes and moderate content
- **admin** - Full access to all resources

#### Option 1: Use the provided role-based rules (Recommended)

1. Copy the contents of `firestore.rules` file
2. In Firebase Console, go to **Firestore Database** > **Rules** tab
3. Paste the rules and click "Publish"

These rules provide:
- Users can only access their own meal plans
- Admins can access all meal plans
- Role-based permissions for different operations
- Secure user profile management

#### Option 2: Test mode (Development only)

For quick testing, you can use test mode:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Warning**: Test mode allows anyone to read/write. Only use for development!

#### Setting up Admin Users

After deploying the role-based rules, you'll need to manually set admin roles:

1. Create a user account through the app
2. In Firestore Console, go to `users` collection
3. Find the user document
4. Update the `role` field to `"admin"`

Or use the Firebase Console to run:
```javascript
// In Firestore Console > Data tab, select a user document
// Update the role field:
{
  role: "admin"
}
```

## 3. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "Flavoriz Web")
5. Copy the Firebase configuration object

## 4. Set Up Environment Variables

1. Create a `.env.local` file in the root of your project:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

2. Replace the values with your actual Firebase config values

## 5. Install Dependencies

Firebase is already installed. If you need to reinstall:

```bash
npm install firebase --legacy-peer-deps
```

## 6. Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Navigate to the Meal Plans page
3. Try creating a new meal plan
4. Check your Firestore console - you should see a new document in the `mealPlans` collection

## Current Implementation

The app currently uses:
- **Firestore** for meal plan storage
- **Session-based user IDs** (temporary - stored in sessionStorage)
- **localStorage fallback** if Firestore is not configured

### Next Steps

#### Enable Firebase Authentication

1. In Firebase Console, go to **Build** > **Authentication**
2. Click "Get started"
3. Enable **Email/Password** provider
4. (Optional) Enable other providers (Google, GitHub, etc.)

#### Role-Based Access Control

The app now includes RBAC with three roles:
- **user** - Default role, can manage own meal plans
- **moderator** - Can moderate content
- **admin** - Full system access

To set a user as admin:
1. User signs up through the app
2. In Firestore Console, go to `users` collection
3. Find the user document by their UID
4. Update `role` field to `"admin"`

#### Authentication Integration

The app is ready for authentication! The `lib/firebase/auth.ts` file includes:
- `signUp()` - Create new user accounts
- `signIn()` - Sign in existing users
- `signOut()` - Sign out
- `getCurrentUserRole()` - Get user's role
- `isAdmin()` - Check if user is admin
- `hasRole()` - Check if user has specific role

You can integrate these into your UI components as needed.

## Troubleshooting

### "Firestore not initialized" error
- Check that your `.env.local` file exists and has all required variables
- Restart your development server after adding environment variables
- Check browser console for specific error messages

### Data not persisting
- Check Firestore security rules
- Verify Firebase project is active
- Check browser console for errors

### Can't see data in Firestore console
- Make sure you're looking at the correct project
- Check that the collection name is `mealPlans`
- Verify documents are being created (check browser network tab)

## Support

For Firebase-specific issues, check:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

