# Quick Testing Guide - Royal Clinical Laboratory Bookings

## How to Test the Implementation

### Step 1: Access the Landing Page
1. Open your browser and navigate to the landing page (typically `http://localhost:5173`)
2. You should see a location modal asking for your location

### Step 2: Search for Royal Clinical Laboratory
1. In the location modal, type: **"Kanjirapally"** or **"Kanjirappally"**
2. Click "Find Laboratories" or press Enter
3. The page will load laboratories in the Kanjirapally area

### Step 3: Find Royal Clinical Laboratory
1. Scroll through the list of laboratories
2. Look for **"Royal Clinical Laboratory"**
   - Location: Kanjirappally, Kottayam
   - Description: Clinical laboratory and other clinical tests
   - Price: ₹480

### Step 4: Make a Booking
1. Click the "Book Now" button on Royal Clinical Laboratory
2. Fill in the booking form:
   - **Date**: Select a future date
   - **Time**: Select a time slot
   - **Tests**: Select one or more tests from the available options
3. Click "Proceed to Payment"
4. Choose a payment method (or select "Pay at Lab")
5. Confirm the booking

### Step 5: Verify the Booking

#### Option A: Check Server Logs
Look at your backend server terminal. You should see:
```
[DEBUG] Booking for Lab: Royal Clinical Laboratory at (...)
[DEBUG] Inserting booking for Royal Clinical Laboratory into bookings table with lab_id=1
```

#### Option B: Run the Test Script
```bash
cd server/backend
python test_bookings.py
```

This will show:
- Bookings table structure
- Total number of bookings
- Recent bookings with details

#### Option C: Query the Database Directly
```sql
-- See all Royal Clinical Laboratory bookings
SELECT * FROM bookings WHERE lab_id = 1;

-- Count total bookings
SELECT COUNT(*) FROM bookings WHERE lab_id = 1;

-- See recent bookings with details
SELECT 
    id, 
    patient_name, 
    test_type, 
    appointment_date, 
    appointment_time, 
    status,
    created_at
FROM bookings 
WHERE lab_id = 1 
ORDER BY created_at DESC 
LIMIT 10;
```

## Expected Results

### In the `bookings` table:
- ✅ New row created with `lab_id = 1`
- ✅ Patient name populated
- ✅ Test type(s) listed
- ✅ Appointment date and time set
- ✅ Status = 'Pending'
- ✅ Location = "Kanjirappally, Kottayam"
- ✅ Source = "Website" or "Guest Website"

### In the `appointments` table:
- ✅ Booking also saved here (existing functionality maintained)

## Troubleshooting

### Issue: Booking not appearing in bookings table
**Check:**
1. Is the lab name exactly "Royal Clinical Laboratory"? (case-sensitive)
2. Check server logs for any errors
3. Verify the bookings table exists: `SHOW TABLES LIKE 'bookings';`

### Issue: Server error during booking
**Check:**
1. Backend server is running: `python app.py` in `server/backend`
2. Database connection is working
3. Check server error logs for specific error messages

### Issue: Can't find Royal Clinical Laboratory
**Solution:**
- Make sure you search for "Kanjirapally" or "Kanjirappally" in the location modal
- The lab is hardcoded for this specific location

## API Endpoints

### Create Booking (POST)
```
POST http://localhost:5000/api/admin/appointments
Content-Type: application/json

{
  "labName": "Royal Clinical Laboratory",
  "labAddress": "Near Junction, Kanjirapally",
  "lat": 9.5586,
  "lon": 76.7915,
  "location": "Kanjirappally, Kottayam",
  "doctor": "Dr. Smith (Ref)",
  "date": "2026-01-20",
  "time": "10:00",
  "tests": ["Blood Test", "CBC"]
}
```

### Get All Bookings (GET)
```
GET http://localhost:5000/api/admin/bookings
```
*Requires admin authentication*

## Notes
- Only bookings for "Royal Clinical Laboratory" are saved to the `bookings` table
- All other lab bookings go only to the `appointments` table
- The `lab_id` is hardcoded to `1` for all Royal Clinical Laboratory bookings
- No existing functionality has been modified or broken
