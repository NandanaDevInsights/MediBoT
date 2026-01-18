# FIXED: Royal Clinical Laboratory Bookings

## Problem
Bookings for Royal Clinical Laboratory were not being saved to the `bookings` table because:
1. The code was trying to insert into columns that didn't exist in the actual table
2. The existing `bookings` table had a different structure than expected

## Solution
Updated the code to match the **actual bookings table structure**:

### Actual Table Structure (from your database):
```
- booking_id (Primary Key)
- patient_name
- patient_id
- age
- gender
- email
- phone_number
- lab_id
- test_category
- selected_test
- preferred_date
- preferred_time
- booking_status
- created_at
- updated_at
```

## Changes Made

### 1. Fixed INSERT Query in `app.py` (lines 1497-1534)
**Before:** Tried to insert into non-existent columns like `user_id`, `doctor_name`, `test_type`, `appointment_date`, etc.

**After:** Now correctly inserts into:
- `patient_name` - Patient's name or email username
- `patient_id` - User ID as string or "GUEST"
- `email` - User's email address
- `phone_number` - Contact number from booking form
- `lab_id` - Fixed value of **1** for Royal Clinical Laboratory
- `test_category` - First test selected
- `selected_test` - All tests joined with commas
- `preferred_date` - Booking date
- `preferred_time` - Booking time
- `booking_status` - Set to "Pending"

### 2. Fixed GET Endpoint (lines 2094-2135)
Updated `/api/admin/bookings` to query the correct columns and return proper field names.

### 3. Updated Test Scripts
- `test_bookings.py` - Now queries correct columns
- `verify_bookings.py` - New comprehensive verification script

## How to Test

### Step 1: Verify Setup
```bash
cd server/backend
python verify_bookings.py
```

This will show:
- ✅ Table exists
- ✅ All required columns present
- 📊 Current booking count
- Recent bookings (if any)

### Step 2: Make a Test Booking
1. Open landing page (http://localhost:5173)
2. Enter location: **"Kanjirapally"**
3. Find **"Royal Clinical Laboratory"** in the list
4. Click "Book Now"
5. Fill in:
   - Date: Any future date
   - Time: Any time
   - Tests: Select one or more tests
6. Complete the booking

### Step 3: Verify Booking Was Saved
```bash
python verify_bookings.py
```

You should now see:
- Booking count increased
- Your booking details listed

### Step 4: Check Server Logs
Look for these messages in the Flask server output:
```
[DEBUG] Booking for Lab: Royal Clinical Laboratory at (...)
[DEBUG] Inserting booking for Royal Clinical Laboratory into bookings table with lab_id=1
[DEBUG] Successfully inserted into bookings table
```

## What Happens Now

When a user books **Royal Clinical Laboratory**:

1. ✅ Booking saved to `appointments` table (existing functionality - unchanged)
2. ✅ Booking **also** saved to `bookings` table with `lab_id = 1` (NEW!)
3. ✅ All required fields properly mapped
4. ✅ Error handling in place (won't break if bookings insert fails)

## Database Query Examples

### View all Royal Clinical Laboratory bookings:
```sql
SELECT * FROM bookings WHERE lab_id = 1;
```

### Count bookings:
```sql
SELECT COUNT(*) FROM bookings WHERE lab_id = 1;
```

### Recent bookings with details:
```sql
SELECT 
    booking_id,
    patient_name,
    email,
    phone_number,
    selected_test,
    preferred_date,
    preferred_time,
    booking_status,
    created_at
FROM bookings 
WHERE lab_id = 1 
ORDER BY created_at DESC;
```

## Files Modified

1. ✅ `server/backend/app.py` - Fixed INSERT and SELECT queries
2. ✅ `server/backend/test_bookings.py` - Updated column names
3. ✅ `server/backend/verify_bookings.py` - New verification script

## Status

🟢 **READY TO USE** - The backend server has automatically reloaded with the fixes. You can now make a booking and it will be properly saved to the bookings table with lab_id = 1.
