import os
import io
from google.cloud import vision

def test_ocr():
    print("Testing Google Vision API...")
    
    # 1. Setup Auth
    key_file = "google_key.json"
    if not os.path.exists(key_file):
        print(f"❌ Error: {key_file} not found!")
        return

    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.abspath(key_file)
    print(f"🔑 Using credentials: {os.environ['GOOGLE_APPLICATION_CREDENTIALS']}")

    # 2. Setup Client
    try:
        client = vision.ImageAnnotatorClient()
        print("✅ Client initialized.")
    except Exception as e:
        print(f"❌ Client init failed: {e}")
        return

    # 3. Test with existing image (prescription.jpg) or create a dummy one
    img_path = "prescription.jpg"
    if not os.path.exists(img_path):
        print(f"⚠️ {img_path} not found. Using a dummy text check instead (if possible) or skipping.")
        return # Cannot test without image

    print(f"📸 Reading image: {img_path}")
    
    try:
        with io.open(img_path, 'rb') as image_file:
            content = image_file.read()

        image = vision.Image(content=content)
        
        # 4. Call API
        print("📡 Sending request to Google Cloud...")
        response = client.text_detection(image=image)
        
        if response.error.message:
            print(f"❌ API Error: {response.error.message}")
        else:
            texts = response.text_annotations
            if texts:
                print(f"✅ Success! Found text:")
                print(texts[0].description[:100] + "...")
            else:
                print("⚠️ Success, but no text found.")
                
    except Exception as e:
        print(f"❌ Runtime Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_ocr()
