import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv('server/backend/.env')
api_key = os.environ.get("GEMINI_API_KEY")
print(f"Key: {api_key[:5]}...")
genai.configure(api_key=api_key)

model = genai.GenerativeModel('gemini-1.5-flash')
try:
    response = model.generate_content("Say hello")
    print(f"Success: {response.text}")
except Exception as e:
    print(f"Error: {e}")
