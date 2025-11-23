# Complete Authentication Guide

This app now has a **full-featured authentication system** with login, signup, password reset, and role-based access control.

## Features Implemented

### ✅ Authentication Pages
- **Login Page** (`/login`) - Sign in with email and password
- **Sign Up Page** (`/signup`) - Create new account with validation
- **Forgot Password** (`/forgot-password`) - Password reset via email
- **Profile Page** (`/profile`) - View and edit user profile

### ✅ Authentication Features
- Email/password authentication
- Password strength indicator
- Password visibility toggle
- Form validation
- Error handling with user-friendly messages
- Success notifications
- Protected routes
- Auto-redirect after login/signup

### ✅ User Interface
- Auth state in navbar
- User menu with avatar
- Sign in/Sign up buttons when logged out
- User profile display
- Role badges (user/moderator/admin)
- Mobile-responsive auth UI

### ✅ Security
- Role-based access control (RBAC)
- Protected routes
- Secure password handling
- Session management
- Auto-logout on errors

## User Flow

### Sign Up Flow
```
1. User visits /signup
2. Enters display name (optional), email, password
3. Password strength is shown in real-time
4. Confirms password
5. Clicks "Create Account"
6. Account created in Firebase Auth
7. User profile created in Firestore with role: "user"
8. Auto-redirected to /meal-plans
9. Success notification shown
```

### Login Flow
```
1. User visits /login
2. Enters email and password
3. Clicks "Sign In"
4. Firebase authenticates user
5. User profile loaded from Firestore
6. Auto-redirected to /meal-plans
7. Success notification shown
```

### Password Reset Flow
```
1. User clicks "Forgot password?" on login page
2. Enters email address
3. Firebase sends reset email
4. Success message shown
5. User checks email and clicks reset link
6. User sets new password
7. Can now login with new password
```

## Pages & Routes

### Public Routes
- `/` - Home page (recipes)
- `/recipes/[id]` - Recipe details
- `/login` - Sign in page
- `/signup` - Sign up page
- `/forgot-password` - Password reset

### Protected Routes
- `/meal-plans` - User's meal plans (works without auth, but better with)
- `/meal-plans/[id]` - Meal plan details
- `/profile` - User profile (requires auth)

## Components

### AuthProvider
Wraps the entire app and provides auth state:
```tsx
<AuthProvider>
  {/* Your app */}
</AuthProvider>
```

### useAuth Hook
Access auth state anywhere:
```tsx
const { user, userProfile, loading, signOut } = useAuth()
```

### ProtectedRoute Component
Protect pages that require authentication:
```tsx
<ProtectedRoute>
  <YourProtectedContent />
</ProtectedRoute>
```

## Firebase Setup Required

### 1. Enable Authentication
1. Go to Firebase Console > Authentication
2. Click "Get started"
3. Enable **Email/Password** provider
4. (Optional) Enable other providers

### 2. Set Up Firestore
1. Create Firestore database
2. Deploy security rules from `firestore.rules`
3. Rules include role-based access control

### 3. Environment Variables
Add to `.env.local`:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## User Roles

### Default Role: "user"
- All new users get "user" role
- Can create and manage own meal plans
- Cannot access admin features

### Setting Admin Role
1. User signs up through app
2. Go to Firestore Console
3. Navigate to `users` collection
4. Find user document by UID
5. Update `role` field to `"admin"`

Or use Firebase Console:
```javascript
// In Firestore Console
{
  role: "admin"
}
```

## Code Examples

### Check if User is Logged In
```tsx
import { useAuth } from "@/contexts/auth-context"

function MyComponent() {
  const { user, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please sign in</div>
  
  return <div>Welcome, {user.email}!</div>
}
```

### Protect a Page
```tsx
import { ProtectedRoute } from "@/components/protected-route"

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div>This page requires authentication</div>
    </ProtectedRoute>
  )
}
```

### Sign Out
```tsx
import { useAuth } from "@/contexts/auth-context"

function SignOutButton() {
  const { signOut } = useAuth()
  
  return (
    <button onClick={signOut}>
      Sign Out
    </button>
  )
}
```

### Check User Role
```tsx
import { useAuth } from "@/contexts/auth-context"
import { isAdmin } from "@/lib/firebase/auth"

function AdminPanel() {
  const { userProfile } = useAuth()
  const [isUserAdmin, setIsUserAdmin] = useState(false)
  
  useEffect(() => {
    isAdmin().then(setIsUserAdmin)
  }, [])
  
  if (!isUserAdmin) return <div>Access denied</div>
  
  return <div>Admin Panel</div>
}
```

## Error Handling

The app handles common Firebase Auth errors:

- `auth/user-not-found` - No account with this email
- `auth/wrong-password` - Incorrect password
- `auth/invalid-email` - Invalid email format
- `auth/email-already-in-use` - Email already registered
- `auth/weak-password` - Password too weak
- `auth/too-many-requests` - Too many failed attempts
- `auth/user-disabled` - Account disabled

All errors show user-friendly messages.

## Security Best Practices

1. **Never expose Firebase config secrets**
   - Only use `NEXT_PUBLIC_` prefixed variables
   - Never commit `.env.local`

2. **Use Firestore Security Rules**
   - Rules enforce access control at database level
   - Don't rely only on client-side checks

3. **Validate on Server**
   - Client-side validation is for UX
   - Always validate on server/Firestore rules

4. **Protect Sensitive Routes**
   - Use `ProtectedRoute` component
   - Check roles before showing admin features

5. **Handle Auth State**
   - Always check `loading` state
   - Handle `null` user gracefully

## Testing Authentication

### Test Sign Up
1. Go to `/signup`
2. Fill in form
3. Submit
4. Check Firestore for new user document
5. Verify redirect to meal plans

### Test Login
1. Go to `/login`
2. Enter credentials
3. Submit
4. Verify navbar shows user menu
5. Verify redirect to meal plans

### Test Password Reset
1. Go to `/forgot-password`
2. Enter email
3. Check email for reset link
4. Click link and set new password
5. Login with new password

### Test Protected Routes
1. Try accessing `/profile` without login
2. Should redirect to `/login`
3. After login, should access profile

## Troubleshooting

### "Firebase Auth not initialized"
- Check environment variables are set
- Restart dev server after adding env vars
- Verify Firebase project is active

### "User profile not loading"
- Check Firestore rules allow reading user documents
- Verify user document exists in `users` collection
- Check browser console for errors

### "Can't sign in"
- Verify Email/Password provider is enabled
- Check email format is correct
- Verify password meets requirements

### "Redirect loop"
- Check ProtectedRoute redirect path
- Verify login page doesn't require auth
- Check for conflicting route guards

## Next Steps

### Optional Enhancements
- [ ] Social login (Google, GitHub)
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Remember me functionality
- [ ] Session persistence
- [ ] Account deletion
- [ ] Change password in profile

### Admin Features
- [ ] Admin dashboard
- [ ] User management UI
- [ ] Role management UI
- [ ] Activity logs

## Summary

You now have a **complete, production-ready authentication system** with:
- ✅ Login/Signup pages
- ✅ Password reset
- ✅ User profiles
- ✅ Protected routes
- ✅ Role-based access
- ✅ Beautiful UI
- ✅ Error handling
- ✅ Mobile responsive

The app is ready for users to sign up, log in, and start creating meal plans!

