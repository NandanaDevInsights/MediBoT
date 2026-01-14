import os
import requests
import io
from google.cloud import vision
from flask import request
from twilio.twiml.messaging_response import MessagingResponse
from app import app  # Import the main app to avoid port conflicts
from db_connect import get_connection

# ----------------------------
# DATABASE INIT
# ----------------------------
def init_db():
    """Ensure the prescriptions table exists and has necessary columns."""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # 1. Create table if not exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS prescriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                mobile_number VARCHAR(20),
                image_url TEXT,
                extracted_text TEXT,
                test_type VARCHAR(100),
                file_path TEXT,
                status VARCHAR(50) DEFAULT 'Pending',
                file_type VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # 2. Check and add columns if missing (Fix for existing tables)
        expected_columns = {
            "mobile_number": "VARCHAR(20)",
            "image_url": "TEXT",
            "extracted_text": "TEXT",
            "test_type": "VARCHAR(100)",
            "file_path": "TEXT",
            "status": "VARCHAR(50)",
            "file_type": "VARCHAR(50)"
        }

        for col, dtype in expected_columns.items():
            try:
                cursor.execute(f"SELECT {col} FROM prescriptions LIMIT 1")
                cursor.fetchall()
            except Exception:
                print(f"⚠️ Adding missing column: {col}")
                try:
                    cursor.execute(f"ALTER TABLE prescriptions ADD COLUMN {col} {dtype}")
                except Exception as alter_err:
                     print(f"Failed to add {col}: {alter_err}")

        conn.commit()
        cursor.close()
        conn.close()
        print("✅ Database initialized: 'prescriptions' table ready.")
    except Exception as e:
        print(f"⚠️ Database Initialization Failed: {e}")

# Run DB init on startup
init_db()

# ----------------------------
# WEBHOOK ROUTE
# ----------------------------
# ----------------------------
# WEBHOOK ROUTE
# ----------------------------
@app.route("/webhook/whatsapp", methods=["POST"])
def whatsapp_webhook():
    print("✅ Webhook HIT - Processing Prescription")
    
    resp = MessagingResponse()

    # 1️⃣ Check if image is sent
    num_media = int(request.form.get("NumMedia", 0))
    sender_number = request.form.get("From", "Unknown")

    if num_media == 0:
        resp.message("❌ Please send a prescription image.")
        return str(resp)

    # 2️⃣ Get image URL
    media_url = request.form.get("MediaUrl0")
    print("📸 Image URL:", media_url)

    try:
        # 3️⃣ Download image
        # Create unique filename
        import uuid
        import time
        
        filename = f"rx_{int(time.time())}_{uuid.uuid4().hex[:8]}.jpg"
        # Ensure static/prescriptions exists
        static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "prescriptions")
        os.makedirs(static_dir, exist_ok=True)
        
        image_path = os.path.join(static_dir, filename)
        
        # Twilio User-Agent / Auth handling
        # Load from environment variables for security, fallback to hardcoded
        TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "AC87e1526e841d05fd5e26640ea549c0eb")
        TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "f57aac68b4ae52c9b92787830f5570e3")
        
        print(f"🔑 Downloading image from: {media_url}")
        
        headers = {'User-Agent': 'TwilioBot'}
        download_resp = requests.get(
            media_url,
            auth=(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN),
            headers=headers
        )
        
        # Retry logic: If 400 (Bad Request), 401 (Unauthorized), or 403 (Forbidden) occurs
        if download_resp.status_code in [400, 401, 403]:
            print(f"⚠️ Initial download failed with {download_resp.status_code}. Retrying without auth signatures...")
            download_resp = requests.get(media_url, headers=headers)
        
        if download_resp.status_code == 200:
            with open(image_path, "wb") as f:
                f.write(download_resp.content)
            print(f"✅ Image downloaded successfully to {image_path}")
        else:
            print(f"❌ Failed to download. Status: {download_resp.status_code}")
            if download_resp.status_code == 401:
                print("💡 HINT: Your Twilio Auth Token in .env is incorrect or expired.")
            
            resp.message("❌ Could not download image. Please check Twilio settings.")
            return str(resp)

        # 4️⃣ DUAL OCR STRATEGY: Google Vision -> Fallback to OCR.Space
        extracted_text = None
        current_ocr_service = "None"

        # --- ATTEMPT 1: Google Cloud Vision ---
        print("🤖 Attempting Google Cloud Vision...")
        try:
            basedir = os.path.dirname(os.path.abspath(__file__))
            key_path = os.path.join(basedir, "google_key.json")
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = key_path
            
            client = vision.ImageAnnotatorClient()
            with io.open(image_path, 'rb') as image_file:
                content = image_file.read()
            image = vision.Image(content=content)
            
            response = client.text_detection(image=image)
            texts = response.text_annotations
            
            if response.error.message:
                raise Exception(f"Google API Error: {response.error.message}")
                
            if texts:
                extracted_text = texts[0].description
                current_ocr_service = "Google Vision"
            
        except Exception as google_err:
            print(f"⚠️ Google Vision Failed ({google_err}). Switching to Fallback...")
            
            # --- ATTEMPT 2: OCR.Space (Fallback) ---
            print("🔄 Fallback: Sending to OCR.Space...")
            try:
                API_KEY = os.environ.get("OCR_SPACE_API_KEY", "helloworld")
                ocr_resp = requests.post(
                    'https://api.ocr.space/parse/image',
                    files={image_path: open(image_path, 'rb')},
                    data={'apikey': API_KEY, 'language': 'eng', 'OCREngine': 2},
                    timeout=20
                )
                
                if ocr_resp.status_code == 200:
                    res_json = ocr_resp.json()
                    if not res_json.get('IsErroredOnProcessing') and res_json.get('ParsedResults'):
                         extracted_text = res_json['ParsedResults'][0]['ParsedText']
                         current_ocr_service = "OCR.Space (Fallback)"
                    else:
                        print(f"❌ OCR.Space Error: {res_json.get('ErrorMessage')}")
                
            except Exception as space_err:
                print(f"❌ OCR.Space Failed: {space_err}")

        # 5️⃣ Validate Results
        if not extracted_text:
            resp.message("❌ Failed to read text from image (Both OCR engines failed).")
            return str(resp)
            
        print(f"✅ Success! Text extracted via {current_ocr_service}")
        
        # Clean up text
        raw_text = extracted_text
        cleaned_lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
        cleaned_lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
        
        # Filter for lines that look like tests (keyword matching)
        # We removed generic words like "blood", "test", "urine" to avoid matching labels/instructions.
        test_keywords = [
            "cbc", "count", "platelet", "hemoglobin", "hct", "mcv", "mch",
            "cmp", "metabolic", "panel", "glucose", "calcium", "electrolyte", "sodium", "potassium",
            "lipid", "cholesterol", "hdl", "ldl", "triglyceride",
            "thyroid", "tsh", "t3", "t4",
            "urinalysis", "culture",
            "vitamin", "iron", "ferritin",
            "liver", "renal", "kidney", "function", "profile",
            "sugar", "hba1c", "insulin",
            "analysis", "screen"
        ]
        
        # Aggressive exclusion of non-test lines
        exclude_keywords = [
            "sample", "specimen", "physician", "ordered", "forward", "indicated", 
            "required", "signature", "date", "instructions", "collect", "patient",
            "metro", "city", "india", "phone", "fax", "requisition", "form", "information", 
            "ordering", "sex", "age", "referred", "client",
            "lab", "laboratory", "hospital", "clinic", "diagnostic", "centre", "center",
            "pathology", "scans", "medical", "health", "services", "ltd", "pvt", "dr.", "doctor",
            "floor", "suite", "road", "street", "lane", "avenue", "opp", "near"
        ]
        
        filtered_lines = []
        for line in cleaned_lines:
            line_lower = line.lower()
            # Must match a test keyword AND NOT match an exclusion keyword
            if any(kw in line_lower for kw in test_keywords) and not any(bad in line_lower for bad in exclude_keywords):
                filtered_lines.append(line)
        
        # Fallback: If no keywords found, try to get lines that aren't excluded
        if not filtered_lines and cleaned_lines:
             # Filter out garbage lines first
             clean_fallback = [line for line in cleaned_lines if not any(bad in line.lower() for bad in exclude_keywords)]
             
             # If we have lines left, use them
             if clean_fallback:
                 # Skip the first few lines as they are often still headers if they survived exclusion
                 start_idx = 2 if len(clean_fallback) > 4 else 0
                 filtered_lines = clean_fallback[start_idx:start_idx+6]
             else:
                 filtered_lines = ["Could not identify specific tests. View full report online."] 

        extracted_text_display = "\n".join(filtered_lines)
        
        extracted_text = raw_text.lower()
        print("📝 OCR Text Snippet:", extracted_text[:50].replace('\n', ' '))

        # 5️⃣ Detect test type
        test_type = "General Lab Test"
        if "blood" in extracted_text or "cbc" in extracted_text: test_type = "Blood Test"
        elif "urine" in extracted_text: test_type = "Urine Test"
        elif "thyroid" in extracted_text or "tsh" in extracted_text: test_type = "Thyroid Test"
        elif "sugar" in extracted_text or "glucose" in extracted_text: test_type = "Diabetes/Sugar Test"
        elif "cholesterol" in extracted_text or "lipid" in extracted_text: test_type = "Lipid Profile"

        print(f"🔬 Identified Test: {test_type}")

        # 6️⃣ Save to Database
        try:
            conn = get_connection()
            cursor = conn.cursor()
            
            # Prepare file path relative to server root for frontend
            # Assuming frontend uses something like http://localhost:5000/static/prescriptions/...
            relative_file_path = f"http://localhost:5000/static/prescriptions/{filename}"
            
            cursor.execute(
                """INSERT INTO prescriptions 
                   (mobile_number, image_url, extracted_text, test_type, file_path, status, file_type) 
                   VALUES (%s, %s, %s, %s, %s, 'Pending', 'image/jpeg')""",
                (sender_number, media_url, extracted_text, test_type, relative_file_path)
            )
            conn.commit()
            cursor.close()
            conn.close()
            print("💾 Prescription saved to DB.")
        except Exception as db_err:
            print(f"⚠️ DB Save Failed: {db_err}")

        # 7️⃣ Return Login Link
        website_link = "http://127.0.0.1:5173/login"
        resp.message(
            f"✅ Prescription Processed!\n"
            f"🔬 Identified Category: {test_type}\n\n"
            f"TESTS ORDERED:\n"
            f"{extracted_text_display}\n\n"
            f"💾 Saved to Records\n"
            f"Login here to view full report:\n"
            f"{website_link}"
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        resp.message("❌ Internal server error.")

    return str(resp)

@app.route("/", methods=["GET", "POST"])
def health_check():
    """
    Simple health check route to verify the server is running and accessible.
    """
    return "✅ Backend is RUNNING! If you see this, the URL is correct."

if __name__ == "__main__":
    # Run the IMPORTED app (which contains auth + OCR)
    print("🚀 Starting Combined Server (Auth + OCR) on port 5000...")
    app.run(host="0.0.0.0", port=5000, debug=True)