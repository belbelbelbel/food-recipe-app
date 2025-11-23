# Role-Based Access Control (RBAC) Guide

This app implements a comprehensive role-based access control system for secure data management.

## Roles

### 1. **user** (Default Role)
- Can create and manage their own meal plans
- Can read their own meal plans
- Cannot access other users' data
- Cannot moderate content

**Permissions:**
- `mealPlans.create`
- `mealPlans.read.own`
- `mealPlans.update.own`
- `mealPlans.delete.own`

### 2. **moderator**
- All user permissions, plus:
- Can read all meal plans
- Can create and moderate recipes
- Cannot manage users

**Permissions:**
- All user permissions, plus:
- `mealPlans.read.all`
- `recipes.create`
- `recipes.moderate`

### 3. **admin**
- Full system access
- Can manage all meal plans (read, update, delete any)
- Can manage users and roles
- Can access admin features

**Permissions:**
- All moderator permissions, plus:
- `mealPlans.update.all`
- `mealPlans.delete.all`
- `users.manage`
- `admin.access`

## Implementation

### Firestore Security Rules

The `firestore.rules` file implements role-based security at the database level:

```javascript
// Users can only access their own meal plans
allow read: if isOwner(resource.data.userId) || isAdmin();

// Users can only update their own plans
allow update: if isOwner(resource.data.userId) || isAdmin();
```

### Application-Level Checks

The app also performs role checks in the application layer:

```typescript
// Check if user can update a meal plan
const plan = await getMealPlanById(planId)
const userIsAdmin = await isAdmin()

if (plan.userId !== currentUserId && !userIsAdmin) {
  throw new Error("You don't have permission")
}
```

## Usage Examples

### Check User Role

```typescript
import { getCurrentUserRole, isAdmin, hasRole } from "@/lib/firebase/auth"

// Get user's role
const role = await getCurrentUserRole() // "user" | "moderator" | "admin"

// Check if admin
const isUserAdmin = await isAdmin() // boolean

// Check specific role
const isModerator = await hasRole("moderator") // boolean
```

### Check Permissions

```typescript
import { 
  hasPermission, 
  canCreateMealPlans,
  canReadAllMealPlans 
} from "@/lib/firebase/roles"

// Check specific permission
const canCreate = await hasPermission("mealPlans.create")

// Use helper functions
if (await canCreateMealPlans()) {
  // Show create button
}

if (await canReadAllMealPlans()) {
  // Show all meal plans, not just user's
}
```

### Protect Actions

```typescript
// In a component or API route
import { isAdmin } from "@/lib/firebase/auth"

async function deleteMealPlan(planId: string) {
  const plan = await getMealPlanById(planId)
  const currentUserId = getCurrentUserId()
  const userIsAdmin = await isAdmin()

  // Only owner or admin can delete
  if (plan.userId !== currentUserId && !userIsAdmin) {
    throw new Error("Unauthorized")
  }

  // Proceed with deletion
  await deleteMealPlan(planId)
}
```

## Setting User Roles

### During Sign Up

Users are automatically assigned the "user" role when they sign up:

```typescript
import { signUp } from "@/lib/firebase/auth"

const userCredential = await signUp(email, password, displayName)
// User profile is created with role: "user"
```

### Updating User Roles (Admin Only)

Only admins can update user roles:

```typescript
import { updateUserRole } from "@/lib/firebase/auth"

// Admin can promote user to moderator
await updateUserRole(userId, "moderator")

// Admin can promote user to admin
await updateUserRole(userId, "admin")
```

### Manual Role Assignment (Firebase Console)

1. Go to Firebase Console > Firestore Database
2. Navigate to `users` collection
3. Find the user document
4. Update the `role` field:
   - `"user"` - Regular user
   - `"moderator"` - Content moderator
   - `"admin"` - System administrator

## Security Best Practices

1. **Always check permissions on the server side**
   - Firestore rules provide the first line of defense
   - Application-level checks provide additional security

2. **Never trust client-side role checks alone**
   - Always verify permissions in Firestore rules
   - Client-side checks are for UX only

3. **Use helper functions**
   - Use `isAdmin()`, `hasRole()`, `hasPermission()` instead of direct role checks
   - Makes code more maintainable

4. **Log admin actions**
   - Consider logging all admin actions for audit trails

5. **Regular security audits**
   - Review Firestore rules regularly
   - Test permission boundaries

## Testing Roles

### Test as Regular User
1. Sign up with a new account
2. Verify you can only see your own meal plans
3. Try to access another user's plan (should fail)

### Test as Admin
1. Set your user role to "admin" in Firestore
2. Verify you can see all meal plans
3. Verify you can delete any meal plan
4. Verify you can manage users

## Troubleshooting

### "Permission denied" errors
- Check Firestore security rules are deployed
- Verify user is authenticated
- Check user's role in Firestore
- Verify the action is allowed for that role

### Role not updating
- Check Firestore rules allow role updates
- Verify you're updating the correct user document
- Check browser cache (may need to refresh)

### Admin can't access everything
- Verify Firestore rules include admin checks
- Check `isAdmin()` function is working
- Verify user document has `role: "admin"`

## Future Enhancements

Potential additions to the RBAC system:
- Custom roles
- Role hierarchies
- Permission inheritance
- Time-based permissions
- Resource-specific permissions

