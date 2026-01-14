import requests
import json

def test_ocr_space():
    print("Testing OCR.Space API...")
    
    # Use the existing image
    image_path = "prescription.jpg"
    
    try:
        with open(image_path, 'rb') as f:
            print("📤 Uploading image...")
            response = requests.post(
                'https://api.ocr.space/parse/image',
                files={image_path: f},
                data={
                    'apikey': 'helloworld',
                    'language': 'eng',
                    'isOverlayRequired': False,
                    'OCREngine': 2 
                }
            )
        
        result = response.json()
        
        if result.get('IsErroredOnProcessing'):
            print(f"❌ API Error: {result.get('ErrorMessage')}")
        else:
            parsed = result.get('ParsedResults')
            if parsed:
                text = parsed[0].get('ParsedText')
                print("✅ Success! Text found:")
                print(text[:200])
            else:
                print("⚠️ No text found in result.")
                
    except Exception as e:
        print(f"❌ Connection Failed: {e}")

if __name__ == "__main__":
    test_ocr_space()
