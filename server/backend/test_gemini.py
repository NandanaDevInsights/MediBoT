import google.generativeai as genai
import sys

API_KEY = 'AIzaSyBhLGdahoy9QaRJvLF1tb_pGRAl4N99yYg'

try:
    genai.configure(api_key=API_KEY)
    
    # Try to list models first
    models = list(genai.list_models())
    print(f"Found {len(models)} models")
    
    # Filter to content generation models
    gen_models = [m for m in models if 'generateContent' in m.supported_generation_methods]
    print(f"Found {len(gen_models)} generation models:")
    for m in gen_models[:5]:
        print(f"  - {m.name}")
    
    if gen_models:
        model_name = gen_models[0].name
        print(f"\nUsing model: {model_name}")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content('Hello')
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"ERROR: {type(e).__name__}")
    print(f"Message: {e}")
    sys.exit(1)
