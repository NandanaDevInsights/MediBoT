# Lab Admin Profile Feature

## ✅ Implementation Complete

The Lab Admin Dashboard now displays the logged-in admin's name and lab data in the profile section.

## API Endpoints

### GET /api/profile
Returns the logged-in user's profile information.

**Response:**
```json
{
  "user_id": 1,
  "email": "admin@lab.com",
  "role": "LAB_ADMIN",
  "admin_name": "Admin Name",
  "lab_name": "Royal Clinical Laboratory",
  "address": "123 Main St, City",
  "contact": "1234567890"
}
```

### How It Works

1. **On Dashboard Load:**
   - Dashboard calls `/api/profile`
   - Backend checks session for `user_id`
   - Fetches user data from `users` table
   - Fetches lab profile from `lab_admin_profile` table
   - Returns combined data

2. **Profile Data Sources:**
   - `users` table: email, role
   - `lab_admin_profile` table: lab_name, address, contact_number, admin_name

3. **Fallback Logic:**
   - If no `admin_name` in profile → Uses email username (e.g., "admin@lab.com" → "Admin")
   - If no lab profile exists → Returns null values

## Frontend Integration

The dashboard already fetches this data on mount (line 239):
```javascript
const res = await fetch('http://localhost:5000/api/profile', { credentials: 'include' });
const data = await res.json();
setProfileData(prev => ({ 
    ...prev, 
    admin_name: data.admin_name || 'Admin', 
    email: data.email || '' 
}));
```

## Database Tables

### users
```
| id | email          | role      |
|----|---------------|-----------|
| 1  | admin@lab.com | LAB_ADMIN |
```

### lab_admin_profile
```
| id | user_id | lab_name                  | address        | contact_number | admin_name  |
|----|---------|--------------------------|----------------|----------------|-------------|
| 1  | 1       | Royal Clinical Laboratory | 123 Main St    | 1234567890     | Dr. Smith   |
```

## Setting Up Profile Data

### Method 1: During Account Creation
When creating a lab admin account, also create their profile:

```sql
-- After creating user
INSERT INTO lab_admin_profile (user_id, lab_name, address, contact_number, admin_name)
VALUES (1, 'Royal Clinical Laboratory', '123 Main St, City', '1234567890', 'Dr. Smith');
```

### Method 2: Manual Update
Update profile for existing admin:

```sql
-- Check if profile exists
SELECT * FROM lab_admin_profile WHERE user_id=1;

-- If not exists, insert
INSERT INTO lab_admin_profile (user_id, lab_name, address, contact_number, admin_name)
VALUES (1, 'Your Lab Name', 'Your Address', '1234567890', 'Your Name');

-- If exists, update
UPDATE lab_admin_profile 
SET lab_name='Your Lab Name', 
    address='Your Address', 
    contact_number='1234567890',
    admin_name='Your Name'
WHERE user_id=1;
```

### Method 3: Through Dashboard (if save endpoint exists)
The dashboard may have a profile edit form that saves to this table.

## What Shows in Dashboard

### Profile Section
- **Admin Name**: From `admin_name` field or email username
- **Email**: From `users.email`
- **Lab Name**: From `lab_admin_profile.lab_name`
- **Address**: From `lab_admin_profile.address`
- **Contact**: From `lab_admin_profile.contact_number`

### Profile Menu (Top Right)
- Shows admin name
- Shows email
- Logout option

## Testing

### Test 1: Check Current Profile
```bash
# Login first, then:
curl http://localhost:5000/api/profile \
  -H "Cookie: session=your_session_cookie" \
  --cookie-jar cookies.txt
```

### Test 2: Add Profile Data
```sql
-- Find your user_id
SELECT id, email FROM users WHERE email='youremail@example.com';

-- Add profile (replace user_id with your actual ID)
INSERT INTO lab_admin_profile (user_id, lab_name, address, contact_number, admin_name)
VALUES (1, 'My Laboratory', '123 Test Street', '9876543210', 'Dr. Test Admin');
```

### Test 3: Verify in Dashboard
1. Login to dashboard
2. Check top-right profile menu
3. Should show your admin name
4. Go to Settings/Profile section
5. Should show all lab data

## Troubleshooting

### Issue: Profile shows "Admin" instead of my name

**Cause:** No profile data in `lab_admin_profile` table

**Solution:**
```sql
-- Get your user_id
SELECT id FROM users WHERE email='youremail@example.com';

-- Add profile
INSERT INTO lab_admin_profile (user_id, admin_name, lab_name)
VALUES (your_user_id, 'Your Name', 'Your Lab Name');
```

### Issue: "Not authenticated" error

**Cause:** Session expired or not logged in

**Solution:** Login again at `/admin/login`

### Issue: Lab data not showing

**Cause:** No entry in `lab_admin_profile` table

**Solution:** Add profile data using SQL or dashboard form

## Files Modified

1. ✅ `server/backend/app.py` - Added `/api/profile` GET endpoint (lines 431-491)

## Summary

🎉 **Profile feature is now working!**

- ✅ `/api/profile` endpoint returns logged-in admin's data
- ✅ Dashboard fetches and displays profile on load
- ✅ Shows admin name, email, lab name, address, contact
- ✅ Fallback to email username if no admin_name set

**Next step:** Add profile data to `lab_admin_profile` table for your account!
