from app import app
import os

if __name__ == "__main__":
    # OCR functionality has been integrated into app.py
    # This script now simply starts the main application
    print("🚀 Starting MediBot Server (OCR Integrated)...")
    app.run(host="0.0.0.0", port=5000, debug=True)