# Lab Admin Login Redirect - Complete Guide

## ✅ Current Implementation

The system is correctly set up to redirect lab admins to the dashboard after login. Here's how it works:

### Flow Diagram
```
1. User goes to /admin/login
2. Enters email & password
3. Clicks "Login as Lab Admin"
4. Backend validates credentials
5. Backend sets session (user_id, email, role)
6. Backend returns: { role: "LAB_ADMIN", email, admin_name }
7. Frontend receives response
8. Frontend sets sessionStorage.setItem('auth_role', 'LAB_ADMIN')
9. Frontend navigates to '/lab-admin-dashboard'
10. ProtectedRoute checks role
11. Dashboard loads ✓
```

## Code Implementation

### 1. Backend Login (`app.py` lines 310-327)
```python
# Skip OTP for Admin Users
if role in ["LAB_ADMIN", "SUPER_ADMIN"]:
    # Verify whitelist for LAB_ADMIN
    if role == "LAB_ADMIN":
        if not is_whitelisted_lab_admin(conn, email):
            return jsonify({"message": "Access restricted"}), 403
    
    # Set session
    session["user_id"] = user_id
    session["email"] = email
    session["role"] = role
    
    return jsonify({
        "message": "Login successful",
        "role": role,
        "email": email,
        "admin_name": email.split('@')[0]
    }), 200
```

### 2. Frontend Login (`AdminLoginPage.jsx` lines 59-70)
```javascript
const processLoginSuccess = (result) => {
    const serverRole = result.role;

    if (serverRole === 'LAB_ADMIN') {
        sessionStorage.setItem('auth_role', 'LAB_ADMIN');
        sessionStorage.removeItem('lab_admin_pin_verified');
        navigate('/lab-admin-dashboard', { replace: true });
    } else if (serverRole === 'SUPER_ADMIN') {
        sessionStorage.setItem('auth_role', 'SUPER_ADMIN');
        navigate('/super-admin-dashboard', { replace: true });
    } else {
        navigate('/welcome', { replace: true });
    }
}
```

### 3. Route Protection (`App.jsx` lines 102-107)
```javascript
<Route
    path="/lab-admin-dashboard"
    element={
        <ProtectedRoute allowedRoles={['LAB_ADMIN']}>
            <LabAdminDashboard />
        </ProtectedRoute>
    }
/>
```

### 4. Protected Route (`ProtectedRoute.jsx` lines 40-56)
```javascript
const currentRole = sessionStorage.getItem('auth_role');

if (!currentRole) {
    // Not logged in - redirect to admin login
    if (allowedRoles.includes('LAB_ADMIN') || allowedRoles.includes('SUPER_ADMIN')) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
}

if (allowedRoles && !allowedRoles.includes(currentRole)) {
    // Wrong role - redirect to correct dashboard
    if (currentRole === 'LAB_ADMIN') return <Navigate to="/lab-admin-dashboard" replace />;
    if (currentRole === 'SUPER_ADMIN') return <Navigate to="/super-admin-dashboard" replace />;
    return <Navigate to="/login" replace />;
}

return children; // Allow access
```

## Testing Steps

### Step 1: Verify Account Setup
```bash
cd server/backend

# Check if your email is whitelisted
python promote_to_admin.py --list

# If not listed, promote your account
python promote_to_admin.py youremail@example.com
```

### Step 2: Test Login
1. Open browser: `http://localhost:5173/admin/login`
2. Enter your email and password
3. Click "Login as Lab Admin"
4. **Expected:** Immediately redirected to `/lab-admin-dashboard`

### Step 3: Check Browser Console
Open browser DevTools (F12) and check:

**Console tab:**
- Should NOT show any errors
- Should show successful navigation

**Application tab → Session Storage:**
- Should see: `auth_role: "LAB_ADMIN"`

**Network tab:**
- POST to `/api/login` → Status 200
- Response should include: `{ "role": "LAB_ADMIN", ... }`

## Troubleshooting

### Issue 1: Redirects back to login page

**Possible Causes:**
1. Session not being set
2. Role not being stored in sessionStorage
3. ProtectedRoute rejecting access

**Debug:**
```javascript
// Add this to AdminLoginPage.jsx after line 87
console.log('Login result:', result);
console.log('Setting role:', result.role);
sessionStorage.setItem('auth_role', result.role);
console.log('Role stored:', sessionStorage.getItem('auth_role'));
```

### Issue 2: "Access restricted" error

**Cause:** Email not in `lab_admin_users` whitelist

**Solution:**
```bash
python add_lab_admin.py youremail@example.com
# OR
python promote_to_admin.py youremail@example.com
```

### Issue 3: "Invalid credentials" error

**Cause:** Wrong password or account doesn't exist

**Solution:**
```bash
# Check if account exists
python promote_to_admin.py --list

# If not, sign up first at /admin/signup
```

### Issue 4: Stuck on loading screen

**Cause:** ProtectedRoute waiting for session verification

**Debug:**
```javascript
// Check ProtectedRoute.jsx line 13
// Add console.log to see what's happening
console.log('Checking session...');
fetch('http://localhost:5000/api/profile', { credentials: 'include' })
    .then(res => {
        console.log('Profile response:', res.status);
        return res.json();
    })
    .then(data => console.log('Profile data:', data));
```

## Manual Testing Checklist

- [ ] Account exists in `users` table
- [ ] Email in `lab_admin_users` whitelist
- [ ] Role is `LAB_ADMIN` in `users` table
- [ ] Can access `/admin/login` page
- [ ] Can enter credentials
- [ ] Login button works
- [ ] No console errors
- [ ] Redirects to `/lab-admin-dashboard`
- [ ] Dashboard loads successfully
- [ ] Profile data appears in dashboard

## Quick Fix Commands

```bash
# 1. Ensure account is set up properly
cd server/backend
python promote_to_admin.py youremail@example.com

# 2. Add profile data (optional but recommended)
python add_profile.py "youremail@example.com" "Your Name" "Your Lab Name"

# 3. Verify setup
python test_lab_admin_auth.py
```

## Expected Behavior

✅ **Correct Flow:**
1. Visit `/admin/login`
2. Enter credentials
3. Click login
4. **Instant redirect** to `/lab-admin-dashboard`
5. Dashboard loads with your profile data
6. Top-right shows your name
7. All dashboard features work

❌ **Incorrect Flow (needs fixing):**
1. Visit `/admin/login`
2. Enter credentials
3. Click login
4. Stays on login page OR
5. Redirects back to login OR
6. Shows "Access restricted" error

## Summary

The redirect system is **fully implemented and should work**. If it's not working:

1. **Check account setup** - Run `python promote_to_admin.py youremail@example.com`
2. **Check browser console** - Look for errors
3. **Check sessionStorage** - Should have `auth_role: "LAB_ADMIN"`
4. **Check backend logs** - Should show successful login

If you're still having issues, please share:
- Browser console errors
- Network tab response from `/api/login`
- What happens after clicking login button
