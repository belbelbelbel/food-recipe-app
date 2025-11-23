# Firebase Configuration Setup

Your Firebase configuration has been set up! Here's what you need to know:

## ✅ Configuration Complete

Your Firebase credentials are now configured in `lib/firebase/config.ts` with fallback values. The app will work immediately!

## Environment Variables (Optional)

While the config has fallback values, it's recommended to use environment variables for better security and flexibility.

### Create `.env.local` file

Create a `.env.local` file in the root of your project with:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCVglTaeq_BgCCbWp47jNZffq6y0GuphdM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=foodreciepe-7a6ba.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=foodreciepe-7a6ba
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=foodreciepe-7a6ba.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1070340958580
NEXT_PUBLIC_FIREBASE_APP_ID=1:1070340958580:web:8d9db238516ffacd84a421
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-FMT46Z657E
```

**Note:** `.env.local` is already in `.gitignore`, so it won't be committed to git.

## What's Configured

✅ **Firebase App** - Initialized  
✅ **Firestore Database** - Ready to use  
✅ **Firebase Authentication** - Ready for login/signup  
✅ **Firebase Analytics** - Enabled (if supported)  

## Next Steps

### 1. Enable Firebase Services

Go to [Firebase Console](https://console.firebase.google.com/project/foodreciepe-7a6ba):

1. **Enable Authentication:**
   - Go to Build > Authentication
   - Click "Get started"
   - Enable "Email/Password" provider

2. **Enable Firestore:**
   - Go to Build > Firestore Database
   - Click "Create database"
   - Start in test mode (for development)
   - Choose a location

3. **Deploy Security Rules:**
   - Go to Firestore Database > Rules
   - Copy rules from `firestore.rules` file
   - Paste and publish

### 2. Test the Setup

```bash
npm run dev
```

Then:
- Try signing up at `/signup`
- Try logging in at `/login`
- Create a meal plan
- Check Firestore console to see data

### 3. Set Up Admin User

1. Sign up through the app
2. Go to Firestore Console > `users` collection
3. Find your user document
4. Update `role` field to `"admin"`

## Security Notes

⚠️ **Important:** The API keys in the config file are public (they're meant to be exposed in client-side code). However:

- ✅ They're safe to expose (Firebase security is handled by security rules)
- ✅ Never commit `.env.local` to git (already in `.gitignore`)
- ✅ Use Firestore security rules to protect data
- ✅ The real security is in your Firestore rules, not the API keys

## Current Configuration

- **Project ID:** foodreciepe-7a6ba
- **Auth Domain:** foodreciepe-7a6ba.firebaseapp.com
- **Storage Bucket:** foodreciepe-7a6ba.firebasestorage.app
- **Analytics:** Enabled (G-FMT46Z657E)

## Troubleshooting

### "Firebase not initialized"
- Check that you've restarted the dev server after adding env vars
- Verify the config values are correct

### "Permission denied" errors
- Check Firestore security rules are deployed
- Verify rules allow your operations

### Analytics not working
- Analytics only works in production or with proper setup
- Check browser console for errors

## Ready to Go!

Your Firebase is configured and ready. The app will work with the fallback values, but using `.env.local` is recommended for production.

