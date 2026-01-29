"""
Direct test - call the get_lab_staff function
"""
import sys
sys.path.append('.')

# Import the app to get the function
import importlib
import app as flask_app

# Reload to get latest code
importlib.reload(flask_app)

# Mock the session
class MockSession:
    def get(self, key):
        return "LAB_ADMIN" if key == "role" else None

# Replace session temporarily
flask_app.session = Mock Session()

# Call the function directly
try:
    with flask_app.app.app_context():
        result = flask_app.get_lab_staff()
        print(f"Result: {result}")
        if hasattr(result, 'get_json'):
            data = result.get_json()
            print(f"\n✅ SUCCESS! Got {len(data)} staff members")
            if len(data) > 0:
                print(f"\nFirst staff member: {data[0]}")
        else:
            print(result)
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
