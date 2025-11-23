# Firestore Debugging Guide

## Issue: Meal Plans Not Showing Up

If you created a meal plan and it shows in the database but not in the app, here's how to debug:

### 1. Check Browser Console

Open browser DevTools (F12) and check the Console tab. Look for:
- "Fetching meal plans for user: [userId]"
- "Found X meal plans for user [userId]"
- Any error messages

### 2. Check Firestore Security Rules

The security rules have been updated to be more lenient. Make sure you've deployed them:

1. Go to Firebase Console → Firestore Database → Rules
2. Copy the rules from `firestore.rules` file
3. Click "Publish"

### 3. Check Firestore Indexes

If you see an error about missing index:

1. Go to Firebase Console → Firestore Database → Indexes
2. Click the link in the error message to create the index
3. Or manually create:
   - Collection: `mealPlans`
   - Fields: `userId` (Ascending), `updatedAt` (Descending)
   - Query scope: Collection

### 4. Verify User ID Match

The meal plan's `userId` must match your Firebase Auth `uid`:

1. Check your user ID in browser console:
   ```javascript
   // In browser console
   import { auth } from './lib/firebase/config'
   console.log(auth.currentUser?.uid)
   ```

2. Check the meal plan in Firestore:
   - Go to Firebase Console → Firestore Database
   - Open `mealPlans` collection
   - Check the `userId` field matches your auth `uid`

### 5. Check User Profile

The app creates a user profile on signup. If it's missing:

1. Go to Firebase Console → Firestore Database
2. Check if `users/{your-uid}` document exists
3. If missing, the app will still work but some features might be limited

### 6. Test Query Directly

You can test the query in Firebase Console:

1. Go to Firestore Database
2. Click on `mealPlans` collection
3. Add a filter: `userId == [your-uid]`
4. See if your plans appear

### 7. Common Issues

**Issue: "Permission denied"**
- Solution: Deploy updated security rules
- Make sure you're signed in

**Issue: "Missing index"**
- Solution: Create the composite index (see step 3)
- Or the app will fallback to query without orderBy

**Issue: "No plans found"**
- Check that `userId` in meal plan matches your auth `uid`
- Check browser console for the actual user ID being used

**Issue: Plans created but not visible**
- Refresh the page
- Check browser console for errors
- Verify security rules are deployed

### 8. Force Refresh

After fixing issues, force refresh the meal plans:

1. Go to Meal Plans page
2. Open browser console
3. Run: `location.reload()`

### 9. Check Network Tab

In browser DevTools → Network tab:
- Look for Firestore requests
- Check if they return 200 (success) or 403 (permission denied)
- Check the response data

### Quick Fix Checklist

- [ ] Security rules deployed
- [ ] User is signed in
- [ ] User ID matches between auth and meal plan
- [ ] Firestore indexes created (if needed)
- [ ] Browser console shows no errors
- [ ] Network requests return 200 status

If all else fails, check the browser console for detailed error messages!

