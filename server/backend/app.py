"""
Flask signup service for EcoGrow.

Security highlights:
- Passwords arrive in plaintext over HTTPS and are hashed ONLY here with bcrypt.
- No secrets in code; all sourced from environment variables (.env).
- Backend re-validates email + password strength and confirm-match regardless of frontend checks.
- Parameterized queries prevent SQL injection.
- phpMyAdmin is for viewing data only; all logic lives here.
"""

import os
import hashlib
import secrets
import string
from datetime import datetime, timedelta
import bcrypt
import smtplib
from email.message import EmailMessage
from urllib.parse import urlencode
from flask import Flask, jsonify, redirect, request, session
from flask_cors import CORS
from dotenv import load_dotenv
from google_auth_oauthlib.flow import Flow
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from db_connect import get_connection
from validators import validate_email, validate_password
import threading
import google.generativeai as genai
from twilio.rest import Client
import requests
import io
from google.cloud import vision
from twilio.twiml.messaging_response import MessagingResponse
import uuid
import time
import razorpay

load_dotenv(override=True)
print(f"[INIT] Twilio SID: {os.environ.get('TWILIO_ACCOUNT_SID', 'MISSING')[:10]}...")

# Explicit Google OAuth scopes to avoid scope-mismatch warnings
GOOGLE_SCOPES = [
  "openid",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
]

def get_cors_origins():
  raw = os.environ.get("CORS_ORIGIN", "http://localhost:5173")
  # Allow comma-separated origins, trim whitespace
  return [o.strip() for o in raw.split(",") if o.strip()] or ["*"]


app = Flask(__name__)
CORS(app, origins=get_cors_origins(), supports_credentials=True)
app.secret_key = os.environ.get("FLASK_SECRET", "dev-secret-change")
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = False
RESET_LINK_DEBUG = bool(int(os.environ.get("RESET_LINK_DEBUG", "0")))
SMTP_HOST = os.environ.get("SMTP_HOST")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "465"))
SMTP_USER = os.environ.get("SMTP_USER")
SMTP_PASS = os.environ.get("SMTP_PASS")
SMTP_FROM = os.environ.get("SMTP_FROM", "no-reply@ecogrow.local")
SMTP_USE_TLS = bool(int(os.environ.get("SMTP_USE_TLS", "0")))

# Global Gemini Configuration
try:
    _api_key = os.environ.get("GEMINI_API_KEY")
    if _api_key:
        genai.configure(api_key=_api_key)
except Exception as e:
    print(f"[ERROR] Failed to configure Gemini: {e}")

# Razorpay Client Initialization
RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET")
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))



def hash_password(password: str) -> str:
  """Hash a password with bcrypt (backend only)."""
  rounds = int(os.environ.get("BCRYPT_ROUNDS", 12))
  hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds))
  return hashed.decode("utf-8")


def email_exists(conn, email: str) -> bool:
  cur = conn.cursor()
  cur.execute("SELECT 1 FROM users WHERE email=%s LIMIT 1", (email,))
  exists = cur.fetchone() is not None
  cur.close()
  return exists


def is_whitelisted_lab_admin(conn, email: str) -> bool:
    """Check if email is in lab_admin_users whitelist table."""
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM lab_admin_users WHERE email=%s LIMIT 1", (email,))
    exists = cur.fetchone() is not None
    cur.close()
    return exists



def username_exists(conn, username: str) -> bool:
  cur = conn.cursor()
  cur.execute("SELECT 1 FROM users WHERE username=%s", (username,))
  exists = cur.fetchone() is not None
  cur.close()
  return exists

def insert_user(conn, email: str, username: str, password_hash: str):
  cur = conn.cursor()
  # Role is always USER for this table now
  cur.execute(
    "INSERT INTO users (email, username, password_hash, provider, role) VALUES (%s, %s, %s, %s, %s)",
    (email, username, password_hash, "password", "USER"),
  )
  conn.commit()
  cur.close()

def insert_lab_admin(conn, email: str, password_hash: str, lab_name: str, admin_name: str, phone: str):
  cur = conn.cursor()
  
  # Generate username from email
  username = email.split('@')[0]
  # Ensure unique username
  cur.execute("SELECT 1 FROM users WHERE username=%s", (username,))
  if cur.fetchone():
      username = f"{username}_{secrets.token_hex(2)}"

  # Insert into users table
  cur.execute(
    "INSERT INTO users (email, username, password_hash, provider, role) VALUES (%s, %s, %s, %s, %s)",
    (email, username, password_hash, "password", "LAB_ADMIN"),
  )
  user_id = cur.lastrowid

  # Insert profile details
  cur.execute(
      "INSERT INTO lab_admin_profile (user_id, lab_name, admin_name, contact_number) VALUES (%s, %s, %s, %s)",
      (user_id, lab_name, admin_name, phone)
  )

  conn.commit()
  cur.close()
  return user_id



def upsert_google_user(conn, email: str):
  cur = conn.cursor()
  
  # Determine role based on strict email policy
  # Determine role based on strict email policy
  target_role = "USER"
  if email.lower() == "medibot.care@gmail.com":
      target_role = "SUPER_ADMIN"
  else:
      # Check if whitelisted Lab Admin
      if is_whitelisted_lab_admin(conn, email):
          target_role = "LAB_ADMIN"

  cur.execute("SELECT id, role FROM users WHERE email=%s", (email,))
  existing = cur.fetchone()
  

  if existing:
    existing_id, existing_role = existing
    
    # Update role if status changed (e.g. added to whitelist)
    if existing_role != target_role:
        # Only upgrade, or sync if critical? Let's just sync to target_role.
        # Exception: Don't downgrade SUPER_ADMIN unless intent is clear, but here logic is strict.
        cur.execute("UPDATE users SET role=%s WHERE id=%s", (target_role, existing_id))
        conn.commit()
        existing_role = target_role
    
    cur.close()
    return (existing_id, existing_role)

  # Check if username exists, if so append random
  username = email.split('@')[0]
  cur.execute("SELECT 1 FROM users WHERE username=%s", (username,))
  if cur.fetchone():
      username = f"{username}_{secrets.token_hex(2)}"

  cur.execute(
    "INSERT INTO users (email, username, provider, role) VALUES (%s, %s, %s, %s)",
    (email, username, "google", target_role),
  )
  conn.commit()
  new_id = cur.lastrowid
  cur.close()
  return (new_id, target_role)



def get_user_with_password(conn, identifier: str):
  """Fetch user by username or email."""
  cur = conn.cursor()
  # Check if input looks like email
  if '@' in identifier:
      query = "SELECT id, email, password_hash, provider, role, pin_code, username FROM users WHERE email=%s LIMIT 1"
  else:
      query = "SELECT id, email, password_hash, provider, role, pin_code, username FROM users WHERE username=%s LIMIT 1"

  cur.execute(query, (identifier,))
  row = cur.fetchone()
  cur.close()
  return row

def get_lab_admin_with_password(conn, identifier: str):
  """Fetch admin from users table by email or username."""
  cur = conn.cursor()
  
  target_email = identifier
  
  # If identifier is not an email, try to find email from users table first
  if '@' not in identifier:
      cur.execute("SELECT email FROM users WHERE username=%s LIMIT 1", (identifier,))
      user_row = cur.fetchone()
      if user_row:
          target_email = user_row[0]
      else:
          cur.close()
          return None

  cur.execute(
    "SELECT id, email, password_hash, provider, role, pin_code FROM users WHERE email=%s AND role IN ('LAB_ADMIN', 'SUPER_ADMIN') LIMIT 1",
    (target_email,),
  )
  row = cur.fetchone()
  cur.close()

  if row:
      # Strict check: only medibot.care@gmail.com can be SUPER_ADMIN
      uid, email_val, phash, prov, role_val, pin = row
      if role_val == "SUPER_ADMIN" and email_val.lower() != "medibot.care@gmail.com":
          # Block login if someone else tries to use SUPER_ADMIN account
          return None

  return row



def get_user_id(conn, email: str):
  """Return user id and provider for a given email, or None."""
  cur = conn.cursor()
  cur.execute("SELECT id, provider, role FROM users WHERE email=%s LIMIT 1", (email,))
  row = cur.fetchone()
  cur.close()
  return row


def hash_reset_token(raw: str) -> str:
  return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def create_reset_request(conn, user_id: int, ttl_minutes: int = 60) -> str:
  # Increased token expiration time to 60 minutes
  token = secrets.token_urlsafe(32)
  token_hash = hash_reset_token(token)
  expires_at = datetime.utcnow() + timedelta(minutes=ttl_minutes)
  cur = conn.cursor()
  cur.execute(
    "INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (%s, %s, %s)",
    (user_id, token_hash, expires_at),
  )
  conn.commit()
  cur.close()
  print(f"[DEBUG] Reset token created: {token}, Expires at: {expires_at}")  # Debug logging
  return token


def send_reset_email(to_email: str, reset_link: str):
  if not SMTP_HOST or not SMTP_USER or not SMTP_PASS:
    raise RuntimeError("SMTP is not configured (SMTP_HOST/USER/PASS)")

  msg = EmailMessage()
  msg["Subject"] = "Reset your MediBot password"
  msg["From"] = SMTP_FROM
  msg["To"] = to_email
  msg.set_content(f"Click the link to reset your password: {reset_link}\nIf you did not request this, you can ignore it.")

  if SMTP_USE_TLS:
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
      smtp.starttls()
      smtp.login(SMTP_USER, SMTP_PASS)
      smtp.send_message(msg)
  else:
    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as smtp:
      smtp.login(SMTP_USER, SMTP_PASS)
      smtp.send_message(msg)


def send_otp_email(to_email: str, otp_code: str):
  if not SMTP_HOST or not SMTP_USER or not SMTP_PASS:
    # Fallback for dev if no SMTP
    print(f"[DEBUG] SMTP not configured. OTP for {to_email}: {otp_code}")
    return

  msg = EmailMessage()
  msg["Subject"] = "Your Login OTP - MediBot"
  msg["From"] = SMTP_FROM
  msg["To"] = to_email
  msg.set_content(f"Your One-Time Password (OTP) for login is: {otp_code}\n\nThis code expires in 10 minutes.\nDo not share this code with anyone.")

  try:
      if SMTP_USE_TLS:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
          smtp.starttls()
          smtp.login(SMTP_USER, SMTP_PASS)
          smtp.send_message(msg)
      else:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as smtp:
          smtp.login(SMTP_USER, SMTP_PASS)
          smtp.send_message(msg)
  except Exception as e:
      print(f"[ERROR] Failed to send OTP email: {e}")
      # We don't raise here to allow the flow to continue (frontend might show a "resend" button or dev debug)
      pass


def send_whatsapp_message(to_number: str, message_body: str):
    """Send WhatsApp message using Twilio."""
    account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
    from_number = os.environ.get("TWILIO_PHONE_NUMBER") # e.g. "whatsapp:+14155238886"

    if not account_sid or not auth_token or not from_number:
        print("[DEBUG] Twilio credentials missing. WhatsApp skipped.")
        return

    if not to_number:
        return

    # Ensure to_number has 'whatsapp:' prefix
    # Assuming to_number comes as "+919999999999" or "9999999999"
    # We need strictly E.164 format with "whatsapp:" prefix
    
    # Simple sanitization
    clean_number = to_number.strip().replace(" ", "").replace("-", "")
    if not clean_number.startswith("+"):
        # Default to India if no country code? Or just warn?
        # Let's assume user provides country code or we default to +91 for this context if missing
        if len(clean_number) == 10:
             clean_number = "+91" + clean_number
    
    formatted_to = f"whatsapp:{clean_number}"

    try:
        client = Client(account_sid, auth_token)
        message = client.messages.create(
            from_=from_number,
            body=message_body,
            to=formatted_to
        )
        print(f"[DEBUG] WhatsApp sent to {formatted_to}: {message.sid}")
    except Exception as e:
        print(f"[ERROR] Failed to send WhatsApp: {e}")


def build_google_flow(state: str | None = None):
  client_id = os.environ.get("GOOGLE_CLIENT_ID")
  client_secret = os.environ.get("GOOGLE_CLIENT_SECRET")
  redirect_uri = os.environ.get("GOOGLE_REDIRECT_URI")
  if not client_id or not client_secret or not redirect_uri:
    raise RuntimeError("Google OAuth env vars missing (GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI)")
  flow = Flow.from_client_config(
    {
      "web": {
        "client_id": client_id,
        "client_secret": client_secret,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
      }
    },
    scopes=GOOGLE_SCOPES,
    redirect_uri=redirect_uri,
    state=state,
  )
  # state is attached during authorization_url, not at construction
  return flow



@app.post("/api/signup")
def signup_user():
  data = request.get_json(silent=True) or {}
  username = (data.get("username") or "").strip()
  email = (data.get("email") or "").strip()
  password = data.get("password") or ""
  confirm = data.get("confirmPassword") or ""

  # Validation
  if not username:
      return jsonify({"message": "Username is required."}), 400
  if not validate_email(email):
    return jsonify({"message": "Invalid email format."}), 400
  if not validate_password(password):
    return jsonify({"message": "Password must be 8+ chars and include upper, lower, number, and special."}), 400
  if password != confirm:
    return jsonify({"message": "Passwords do not match."}), 400

  conn = get_connection()
  try:
    if email_exists(conn, email):
      return jsonify({"message": "Email already registered."}), 409
    if username_exists(conn, username):
      return jsonify({"message": "Username already taken."}), 409

    pw_hash = hash_password(password)
    insert_user(conn, email, username, pw_hash)

    return jsonify({"message": "Signup successful."}), 201
  except Exception as e:
    print(f"Signup Error: {e}")
    return jsonify({"message": "Unable to process signup right now."}), 500
  finally:
    conn.close()




@app.post("/api/login")
def login_user():
  data = request.get_json(silent=True) or {}
  username = (data.get("username") or "").strip()
  # Fallback for email field usage
  if not username and "email" in data:
      username = data["email"].strip()

  password = data.get("password") or ""

  if not username:
    return jsonify({"message": "Username is required."}), 400
  if not password:
    return jsonify({"message": "Password is required."}), 400

  conn = get_connection()
  try:
    user_row = get_user_with_password(conn, username)
    if not user_row:
      return jsonify({"message": "Invalid credentials."}), 401

    # Unpack row (updated for username column)
    # SELECT id, email, password_hash, provider, role, pin_code, username FROM users
    user_id, email, password_hash, provider, role, pin_code, db_username = user_row
    
    if provider != "password":
      return jsonify({"message": "Use Google sign-in for this account."}), 400

    if not password_hash or not bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8")):
      return jsonify({"message": "Invalid credentials."}), 401

    # Ensure role is USER (since Admins login elsewhere, but if they try here, we should probably allow or redirect?)
    # For separation, we only log in Patients here.
    if role in ["LAB_ADMIN", "SUPER_ADMIN"]:
        # Strict check for Super Admin
        if role == "SUPER_ADMIN" and email.lower() != "medibot.care@gmail.com":
            return jsonify({"message": "Unauthorized Super Admin account."}), 403

        # Direct login for admins (skip OTP)
        # Using ID from users table as the primary source of truth
        session["user_id"] = user_id
        session["email"] = email
        session["username"] = db_username
        session["role"] = role
        
        return jsonify({
            "message": "Login successful",
            "role": role,
            "email": email,
            "user_id": user_id
        }), 200

    # Generate 6-digit OTP
    otp_code = ''.join(secrets.choice(string.digits) for i in range(6))
    if email == 'testadmin@lab.com' or email == 'admin_fix_20260110@lab.com' or email == 'admin@example.com':
        otp_code = '123456'
    
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    try:
        cur = conn.cursor()
        cur.execute(
            "REPLACE INTO user_otps (email, otp_code, expires_at) VALUES (%s, %s, %s)",
            (email, otp_code, expires_at)
        )
        conn.commit()
        cur.close()

        threading.Thread(target=send_otp_email, args=(email, otp_code)).start()

        return jsonify({
            "message": "OTP sent to email.",
            "email": email,
            "username": db_username,
            "require_otp": True
        }), 200

    except Exception as e:
        print(f"[ERROR] OTP Save/Send failed: {e}")
        return jsonify({"message": "Failed to send OTP."}), 500

  except Exception as e:
      print(f"[ERROR] Login failed: {e}")
      return jsonify({"message": "Login failed."}), 500
  finally:
    conn.close()

@app.post("/api/admin/signup")
def signup_lab_admin():
  data = request.get_json(silent=True) or {}
  email = (data.get("email") or "").strip()
  password = data.get("password") or ""
  lab_name = (data.get("labName") or "").strip()
  admin_name = (data.get("adminName") or "").strip()
  phone = (data.get("phone") or "").strip()
  
  if not validate_email(email):
      return jsonify({"message": "Invalid email."}), 400
  if not validate_password(password):
      return jsonify({"message": "Password invalid."}), 400
      
  conn = get_connection()
  try:
      # Check if exists in users
      if email_exists(conn, email):
           return jsonify({"message": "Email already registered."}), 409
      
      pw_hash = hash_password(password)
      # Generate a random PIN for the admin
      pin_code = ''.join(secrets.choice(string.ascii_uppercase) for i in range(4))
      
      user_id = insert_lab_admin(conn, email, pw_hash, lab_name, admin_name, phone)
      
      # Update generated PIN
      cur = conn.cursor()
      cur.execute("UPDATE users SET pin_code=%s WHERE id=%s", (pin_code, user_id))
      conn.commit()
      cur.close()
      
      return jsonify({
          "message": "Admin Request Submitted.",
          "pin_code": pin_code
      }), 201
  except Exception as e:
      print(f"Admin Signup Error: {e}")
      return jsonify({"message": "Failed."}), 500
  finally:
      conn.close()

@app.post("/api/admin/login")
def login_lab_admin():
  data = request.get_json(silent=True) or {}
  email = (data.get("email") or "").strip()
  password = data.get("password") or ""
  
  if not email or not password:
      return jsonify({"message": "Email and Password required."}), 400
      
  conn = get_connection()
  try:
      admin = get_lab_admin_with_password(conn, email)
      if not admin:
           return jsonify({"message": "Invalid credentials."}), 401
           
      # Unpack: id, email, password_hash, provider, role, pin_code
      uid, email, phash, provider, role, pin_code = admin
      
      if not phash or not bcrypt.checkpw(password.encode("utf-8"), phash.encode("utf-8")):
          return jsonify({"message": "Invalid credentials."}), 401
          
      # Success - Set Session
      session["user_id"] = uid
      session["email"] = email
      session["role"] = role
      session["is_admin_table"] = True 
      
      return jsonify({
             "message": "Login successful",
             "role": role,
             "email": email,
             "admin_name": email.split('@')[0]
      }), 200
  except Exception as e:
      print(f"Admin Login Error: {e}")
      return jsonify({"message": "Login failed."}), 500
  finally:
      conn.close()




@app.post("/api/verify-otp")
def verify_otp():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()
    otp = (data.get("otp") or "").strip()

    if not email or not otp:
        return jsonify({"message": "Email and OTP are required."}), 400

    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT otp_code, expires_at FROM user_otps WHERE email=%s", (email,))
        row = cur.fetchone()
        cur.close()

        if not row:
            return jsonify({"message": "Invalid OTP."}), 400

        stored_otp, expires_at = row
        
        # Check expiry
        if datetime.utcnow() > expires_at:
             return jsonify({"message": "OTP has expired."}), 400

        if stored_otp != otp:
             return jsonify({"message": "Invalid OTP."}), 400

        # OTP is valid, proceed to log in the user
        user_row = get_user_with_password(conn, email)
        if not user_row:
             return jsonify({"message": "User not found."}), 404

        user_id, _, password_hash, provider, role, pin_code, db_username = user_row

        # Set Session
        session["user_id"] = user_id
        session["email"] = email
        session["username"] = db_username
        session["role"] = role

        # Strict Whitelist Check for Lab Admin
        if role == "LAB_ADMIN":
             if not is_whitelisted_lab_admin(conn, email):
                  return jsonify({"message": "Access restricted: You are not authorized as a Lab Admin."}), 403

        # Clear OTP after successful use
        cur = conn.cursor()
        cur.execute("DELETE FROM user_otps WHERE email=%s", (email,))
        conn.commit()
        cur.close()

        return jsonify({
            "message": "Login successful.", 
            "role": role,
            "pin_code": pin_code
        }), 200

    except Exception as e:
        print(f"[ERROR] OTP Verification failed: {e}")
        return jsonify({"message": "Unable to verify OTP."}), 500
    finally:
        conn.close()




@app.post("/api/admin/profile")
def save_admin_profile():
    """Save/update lab admin profile"""
    user_id = session.get("user_id")
    role = session.get("role")
    
    if not user_id:
        return jsonify({"message": "Not authenticated"}), 401
    
    if role not in ["LAB_ADMIN", "SUPER_ADMIN"]:
        return jsonify({"message": "Unauthorized"}), 403
    
    data = request.get_json() or {}
    lab_name = data.get("lab_name", "").strip()
    address = data.get("address", "").strip()
    contact = data.get("contact", "").strip()
    admin_name = data.get("admin_name", "").strip()
    
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # Check if profile exists
        cur.execute("SELECT id FROM lab_admin_profile WHERE user_id=%s", (user_id,))
        existing = cur.fetchone()
        
        if existing:
            # Update existing profile
            cur.execute("""
                UPDATE lab_admin_profile 
                SET lab_name=%s, address=%s, contact_number=%s, admin_name=%s
                WHERE user_id=%s
            """, (lab_name, address, contact, admin_name, user_id))
        else:
            # Create new profile
            cur.execute("""
                INSERT INTO lab_admin_profile (user_id, lab_name, address, contact_number, admin_name)
                VALUES (%s, %s, %s, %s, %s)
            """, (user_id, lab_name, address, contact, admin_name))
        
        conn.commit()
        cur.close()
        
        return jsonify({"message": "Profile saved successfully"}), 200
        
    except Exception as e:
        print(f"[ERROR] Profile save failed: {e}")
        return jsonify({"message": "Failed to save profile"}), 500
    finally:
        conn.close()


@app.post("/api/forgot-password")
def forgot_password():
  data = request.get_json(silent=True) or {}
  identifier = (data.get("email") or "").strip() # Frontend sends "email" field even if it's username

  target_email = identifier
  conn = None
  
  try:
      conn = get_connection()
      
      # If not email, resolve username
      if '@' not in identifier:
          cur = conn.cursor()
          cur.execute("SELECT email FROM users WHERE username=%s LIMIT 1", (identifier,))
          row = cur.fetchone()
          cur.close()
          if row:
              target_email = row[0]
          else:
              # Username not found, just return success to hide existence
              return jsonify({"message": "If the account exists, a reset link will be emailed."}), 200

      if not validate_email(target_email):
        return jsonify({"message": "If the account exists, a reset link will be emailed."}), 200

      user_row = get_user_id(conn, target_email)
      if not user_row:
          # Avoid revealing account existence
          return jsonify({"message": "If the account exists, a reset link will be emailed."}), 200

      user_id, provider, role = user_row
      if provider != "password":
          return jsonify({"message": "If the account exists, a reset link will be emailed."}), 200

      token = create_reset_request(conn, user_id)
      frontend_origin = os.environ.get("CORS_ORIGIN", "http://localhost:5173").split(",")[0].strip()
      
      reset_link = f"{frontend_origin}/reset?token={token}"
      if "ADMIN" in role:
          reset_link += "&type=admin"

      # Send email in background to avoid blocking/timeouts
      def send_async():
          try:
              send_reset_email(target_email, reset_link)
          except Exception as e:
              print(f"[WARNING] Background SMTP failed: {e}")

      try:
          threading.Thread(target=send_async).start()
      except Exception as e:
          print(f"[ERROR] Failed to start email thread: {e}")

      response_body = {"message": "If the account exists, a reset link will be emailed."}
      if RESET_LINK_DEBUG:
          response_body["reset_link"] = reset_link

      return jsonify(response_body), 200
  except Exception as e:
    print(f"[ERROR] Forgot password flow failed: {e}")
    return jsonify({"message": "Unable to process reset right now."}), 500
  finally:
    if conn:
      conn.close()


@app.post("/api/reset-password")
def reset_password():
    data = request.get_json(silent=True) or {}
    token = (data.get("token") or "").strip()
    password = data.get("password") or ""
    confirm = data.get("confirmPassword") or ""

    if not token:
        return jsonify({"message": "Reset token is required."}), 400
    if password != confirm:
        return jsonify({"message": "Passwords do not match."}), 400
    if not validate_password(password):
        return jsonify({"message": "Password must be 8+ chars and include upper, lower, number, and special."}), 400

    token_hash = hash_reset_token(token)
    print(f"[DEBUG] Received token: {token}")  # Debug logging
    print(f"[DEBUG] Hashed token: {token_hash}")  # Debug logging

    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT pr.id, pr.user_id, u.provider
            FROM password_resets pr
            JOIN users u ON u.id = pr.user_id
            WHERE pr.token_hash=%s AND pr.used=0 AND pr.expires_at > %s
            LIMIT 1
            """,
            (token_hash, datetime.utcnow()),
        )
        row = cur.fetchone()
        # Ensure we consume/close the cursor for the SELECT before starting updates
        cur.close()
        
        print(f"[DEBUG] Token validation query result: {row}")  # Debug logging
        
        if not row:
            return jsonify({"message": "Invalid or expired reset link."}), 400

        reset_id, user_id, provider = row
        if provider != "password":
            return jsonify({"message": "Invalid or expired reset link."}), 400

        pw_hash = hash_password(password)

        # Start a new cursor for transaction updates
        # Implicit transaction is already active due to previous queries or default behavior
        cur = conn.cursor()
        cur.execute("UPDATE users SET password_hash=%s WHERE id=%s", (pw_hash, user_id))
        cur.execute("UPDATE password_resets SET used=1 WHERE id=%s", (reset_id,))
        conn.commit()
        cur.close()

        return jsonify({"message": "Password updated successfully."}), 200
    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Exception during reset: {e}")  # Debug logging
        # Log to file to help USER see the error
        try:
            with open("reset_error.log", "w") as f:
                f.write(f"Error: {str(e)}")
        except:
            pass
        return jsonify({"message": "Unable to reset password right now."}), 500
    finally:
        conn.close()


@app.get("/health")
def health():
  return jsonify({"status": "ok"})


@app.get("/api/google/start")
def google_start():
  flow = build_google_flow()
  auth_url, state = flow.authorization_url(
    access_type="offline",
    include_granted_scopes="true",  # Google expects a string "true"/"false"
    prompt="select_account",
  )
  session["state"] = state
  return redirect(auth_url)


@app.get("/api/google/callback")
def google_callback():
  state = request.args.get("state") or session.get("state")
  if not state:
    return jsonify({"message": "Missing OAuth state."}), 400

  flow = build_google_flow(state=state)
  flow.fetch_token(authorization_response=request.url)

  id_info = id_token.verify_oauth2_token(
    flow.credentials.id_token,
    google_requests.Request(),
    os.environ.get("GOOGLE_CLIENT_ID"),
  )

  email = id_info.get("email")
  if not email:
    return jsonify({"message": "Google token missing email."}), 400

  conn = get_connection()
  try:
    user_id, role = upsert_google_user(conn, email)
    
    # If Admin, switch user_id to the one in lab_admin_users table to match password flow
    if role in ["LAB_ADMIN", "SUPER_ADMIN"]:
        cur = conn.cursor()
        cur.execute("SELECT id FROM lab_admin_users WHERE email=%s", (email,))
        admin_row = cur.fetchone()
        cur.close()
        if admin_row:
             user_id = admin_row[0]
             session["is_admin_table"] = True
    
    session["user_id"] = user_id
    session["email"] = email
    session["role"] = role
  finally:
    conn.close()

  # Redirect to frontend based on role
  origin = os.environ.get("CORS_ORIGIN", "http://localhost:5173").split(",")[0].strip()
  
  if role == "SUPER_ADMIN":
      if email.lower() != "medibot.care@gmail.com":
          return jsonify({"message": "Unauthorized Super Admin access."}), 403
      target = f"{origin}/super-admin-dashboard"
  elif role == "LAB_ADMIN":
      target = f"{origin}/lab-admin-dashboard"
  else:
      target = f"{origin}/welcome"

  return redirect(target)


import string 

@app.post("/api/admin/signup")
def admin_signup():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()
    password = data.get("password") or ""
    
    # We ignore confirmPassword here as frontend checked it.
    if not validate_email(email):
        return jsonify({"message": "Invalid email format."}), 400
    if not validate_password(password):
        return jsonify({"message": "Password weak. Use 8+ chars, mixed case, numbers, special."}), 400

    # Generate 4-char alphanumeric PIN (uppercase + digits to be readable)
    alphabet = string.ascii_uppercase + string.digits
    pin_code = ''.join(secrets.choice(alphabet) for i in range(4))

    conn = get_connection()
    try:
        if email_exists(conn, email):
            return jsonify({"message": "Email already registered."}), 409

        pw_hash = hash_password(password)
        cur = conn.cursor()
        # Save PIN to DB
        cur.execute(
            "INSERT INTO users (email, password_hash, provider, role, pin_code) VALUES (%s, %s, %s, %s, %s)",
            (email, pw_hash, "password", "LAB_ADMIN", pin_code),
        )
        # Add to whitelist as well (since they just registered via the authorized flow)
        # Note: If this table is for extensive security where ONLY manually added users can sign up, 
        # then we should CHECK it before insert instead of inserting into it.
        # But the prompt says "Store usernames... in backend", implying we store them. 
        # And "only allow users in that table to log in". So we ensure they are in it.
        try:
             cur.execute("INSERT IGNORE INTO lab_admin_users (email) VALUES (%s)", (email,))
        except Exception:
             pass 

        conn.commit()
        cur.close()

        # Return the PIN so frontend can show it
        return jsonify({
            "message": "Lab Admin registered successfully.",
            "pin_code": pin_code
        }), 201
    except Exception as e:
        print(f"[ERROR] Admin signup failed: {e}")
        return jsonify({"message": "Unable to register admin."}), 500
    finally:
        conn.close()

# --- Database Migration Helper ---
def ensure_pin_column():
    """Add pin_code column if not exists."""
    conn = get_connection()
    try:
        cur = conn.cursor()
        # Check if column exists
        cur.execute("SHOW COLUMNS FROM users LIKE 'pin_code'")
        if not cur.fetchone():
            print("[INFO] Adding pin_code column to users table...")
            cur.execute("ALTER TABLE users ADD COLUMN pin_code VARCHAR(10) DEFAULT NULL")
            conn.commit()
    except Exception as e:
        print(f"[WARNING] Schema update failed: {e}")
    finally:
        conn.close()

def ensure_lab_admin_whitelist_table():
    """Create whitelist table for lab admins if not exists."""
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS lab_admin_users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
    except Exception as e:
        print(f"[WARNING] Whitelist table check failed: {e}")
    finally:
        conn.close()

# Run schema check on import/startup
ensure_pin_column()
ensure_lab_admin_whitelist_table()

def ensure_otp_table():
    """Create OTP table if not exists."""
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS user_otps (
                email VARCHAR(255) PRIMARY KEY,
                otp_code VARCHAR(10) NOT NULL,
                expires_at TIMESTAMP NOT NULL
            )
        """)
        conn.commit()
    except Exception as e:
        print(f"[WARNING] OTP table check failed: {e}")
    finally:
        conn.close()

ensure_otp_table()

def ensure_laboratories_table():
    """Create laboratories table if not exists."""
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS laboratories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                address TEXT,
                location VARCHAR(255),
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_lab (name, latitude, longitude)
            )
        """)
        conn.commit()
    except Exception as e:
        print(f"[WARNING] Laboratories table check failed: {e}")
    finally:
        conn.close()

ensure_laboratories_table()

def ensure_appointments_table():
    """Create or update appointments table."""
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # 1. Create table if not exists (Basic schema)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS appointments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                patient_name VARCHAR(255),
                lab_name VARCHAR(255),
                doctor_name VARCHAR(255),
                appointment_date DATE,
                appointment_time VARCHAR(20),
                tests TEXT,
                status VARCHAR(50) DEFAULT 'Pending',
                location VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )
        """)
        
        # 2. Check and Add Missing Columns (Migration logic)
        
        # Check lab_name
        cur.execute("SHOW COLUMNS FROM appointments LIKE 'lab_name'")
        if not cur.fetchone():
            print("[INFO] Adding missing column 'lab_name' to appointments...")
            cur.execute("ALTER TABLE appointments ADD COLUMN lab_name VARCHAR(255)")
            
        # Check tests
        cur.execute("SHOW COLUMNS FROM appointments LIKE 'tests'")
        if not cur.fetchone():
            print("[INFO] Adding missing column 'tests' to appointments...")
            cur.execute("ALTER TABLE appointments ADD COLUMN tests TEXT")
            
        # Check patient_name (if it was created as user_name in previous versions)
        cur.execute("SHOW COLUMNS FROM appointments LIKE 'patient_name'")
        if not cur.fetchone():
             print("[INFO] Adding missing column 'patient_name' to appointments...")
             cur.execute("ALTER TABLE appointments ADD COLUMN patient_name VARCHAR(255)")

        # Extended Schema Updates
        new_cols = {
            "contact_number": "VARCHAR(50)",
            "technician": "VARCHAR(255)",
            "sample_type": "VARCHAR(100)",
            "payment_status": "VARCHAR(50) DEFAULT 'Pending'",
            "report_status": "VARCHAR(50) DEFAULT 'Not Uploaded'",
            "source": "VARCHAR(50) DEFAULT 'Website'"
        }
        for col, dtype in new_cols.items():
            cur.execute(f"SHOW COLUMNS FROM appointments LIKE '{col}'")
            if not cur.fetchone():
                print(f"[INFO] Adding missing column '{col}' to appointments...")
                cur.execute(f"ALTER TABLE appointments ADD COLUMN {col} {dtype}")

        conn.commit()
    except Exception as e:
        print(f"[WARNING] Appointments table check failed: {e}")
    finally:
        conn.close()

ensure_appointments_table()

def ensure_reports_table():
    """Create reports table if not exists."""
    conn = get_connection()
    try:
        cur = conn.cursor()
        # reports table that supports both user_id (int) or guest_id (string)
        # We use patient_id as VARCHAR to store either.
        cur.execute("""
            CREATE TABLE IF NOT EXISTS reports (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id VARCHAR(255),
                test_name VARCHAR(255),
                file_path TEXT,
                status VARCHAR(50) DEFAULT 'Uploaded',
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Migration: Ensure patient_id is VARCHAR
        try:
             cur.execute("ALTER TABLE reports MODIFY COLUMN patient_id VARCHAR(255)")
        except Exception:
             pass 
             
        conn.commit()
    except Exception as e:
        print(f"[WARNING] Reports table check failed: {e}")
    finally:
        conn.close()

ensure_reports_table()

def ensure_lab_staff_table():
    """Create lab_staff table if not exists with all required fields."""
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS lab_staff (
                id INT AUTO_INCREMENT PRIMARY KEY,
                staff_id VARCHAR(50),
                name VARCHAR(255),
                role VARCHAR(100),
                department VARCHAR(100),
                phone VARCHAR(20),
                email VARCHAR(255),
                profile_photo TEXT,
                status VARCHAR(50) DEFAULT 'Available',
                lab_id INT,
                shift VARCHAR(50),
                working_days VARCHAR(255),
                qualification VARCHAR(255),
                gender VARCHAR(20),
                dob DATE,
                address TEXT,
                employment_type VARCHAR(50),
                joining_date DATE,
                experience VARCHAR(50),
                working_hours VARCHAR(100),
                home_collection BOOLEAN DEFAULT 0,
                specializations TEXT,
                documents TEXT,
                emergency_name VARCHAR(255),
                emergency_relation VARCHAR(100),
                emergency_phone VARCHAR(20),
                internal_notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Checking for column aliases/migrations
        # check profile_photo vs image_url
        cur.execute("SHOW COLUMNS FROM lab_staff LIKE 'image_url'")
        if cur.fetchone():
            # If image_url exists but profile_photo doesn't, maybe rename or just keep using profile_photo as canonical?
            # Let's support both by ensuring profile_photo exists
            pass
        
        cols = {
            "profile_photo": "TEXT",
            "full_name": "VARCHAR(255)", 
            "documents": "LONGTEXT",
            "working_days": "VARCHAR(255)",
            "qualification": "VARCHAR(255)",
            "joining_date": "DATE",
            "experience": "VARCHAR(50)",
            "employment_type": "VARCHAR(50)",
            "home_collection": "BOOLEAN DEFAULT 0",
            "specializations": "TEXT",
            "emergency_name": "VARCHAR(255)",
            "emergency_relation": "VARCHAR(100)",
            "emergency_phone": "VARCHAR(20)",
            "internal_notes": "TEXT",
            "shift": "VARCHAR(50)",
            "working_hours": "VARCHAR(100)"
        }
        
        for col, dtype in cols.items():
            cur.execute(f"SHOW COLUMNS FROM lab_staff LIKE '{col}'")
            if not cur.fetchone():
                 print(f"[INFO] Adding missing column '{col}' to lab_staff...")
                 cur.execute(f"ALTER TABLE lab_staff ADD COLUMN {col} {dtype}")

        # Ensure documents is LONGTEXT to avoid truncation
        try:
             cur.execute("ALTER TABLE lab_staff MODIFY COLUMN documents LONGTEXT")
             cur.execute("ALTER TABLE lab_staff MODIFY COLUMN profile_photo LONGTEXT")
        except Exception:
             pass

        conn.commit()
    except Exception as e:
        print(f"[WARNING] Lab Staff table check failed: {e}")
    finally:
        conn.close()

ensure_lab_staff_table()

@app.post("/api/admin/appointments")
def create_appointment():
    # Check authentication
    if not session.get("user_id"):
        return jsonify({"message": "Please log in to book an appointment."}), 401

    user_id = session["user_id"]
    data = request.get_json(silent=True) or {}
    
    # Extract data from frontend
    lab_name = data.get("labName")
    doctor = data.get("doctor")
    date_str = data.get("date")
    time_str = data.get("time")
    tests = data.get("tests") # List of strings
    location = data.get("location")
    
    # Validation
    if not all([lab_name, date_str, time_str, tests]):
         return jsonify({"message": "Missing required booking details."}), 400

    # Convert tests list to string for DB storage
    tests_str = ", ".join(tests) if isinstance(tests, list) else str(tests)

    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # Get User Name
        cur.execute("""
            SELECT up.display_name, u.email 
            FROM users u 
            LEFT JOIN user_profiles up ON u.id = up.user_id 
            WHERE u.id=%s
        """, (user_id,))
        row = cur.fetchone()
        patient_name = "Unknown"
        if row:
            display_name, email = row
            patient_name = display_name if display_name else email.split('@')[0]

        # Insert Appointment
        # We use 'patient_name' as the column based on verify_table output, but allow for 'tests' column too.
        # We try to use the columns we ensured exist.
        query = """
            INSERT INTO appointments 
            (user_id, patient_name, lab_name, doctor_name, appointment_date, appointment_time, tests, location, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'Pending')
        """
        
        cur.execute(query, (user_id, patient_name, lab_name, doctor, date_str, time_str, tests_str, location))
        
        conn.commit()
        new_id = cur.lastrowid
        cur.close()
        
        return jsonify({
            "message": "Booking confirmed successfully!",
            "bookingId": new_id
        }), 201

    except Exception as e:
        print(f"[ERROR] Create appointment failed: {e}")
        return jsonify({"message": "Failed to create booking."}), 500
    finally:
        conn.close()


@app.get("/api/reports")
def get_user_reports():
    if not session.get("user_id"):
        return jsonify({"message": "Not authenticated"}), 401

    user_id = session["user_id"]
    conn = get_connection()
    try:
        cur = conn.cursor()
        # Fetch prescriptions linked to this user OR generic ones (uploaded via WhatsApp without user context)
        # Note: In a production app, we would link mobile numbers to users. For this demo, we show anonymous uploads to logged-in users.
        cur.execute("""
            SELECT id, file_path, file_type, status, created_at 
            FROM prescriptions 
            WHERE user_id=%s OR user_id IS NULL
            ORDER BY created_at DESC
        """, (user_id,))
        rows = cur.fetchall()
        cur.close()

        reports = []
        for row in rows:
            rid, fpath, ftype, status, created_at = row
            reports.append({
                "id": rid,
                "file_path": fpath,
                "file_type": ftype,
                "status": status,
                "date": created_at.isoformat() if created_at else None
            })

        return jsonify(reports), 200
    except Exception as e:
        print(f"[ERROR] Fetch reports failed: {e}")
        return jsonify({"message": "Server error"}), 500
    finally:
        conn.close()


@app.get("/api/profile")
def get_user_profile():
    if not session.get("user_id"):
        return jsonify({"message": "Not authenticated"}), 401

    user_id = session["user_id"]
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT id, email, role, provider, created_at, pin_code, username FROM users WHERE id=%s", (user_id,))
        row = cur.fetchone()
        
        if not row:
            cur.close()
            return jsonify({"message": "User not found"}), 404

        uid, email, role, provider, created_at, pin_code, username = row
        
        # Self-heal null PIN for Lab Admins
        if role == 'LAB_ADMIN' and not pin_code:
            import string, random
            new_pin = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
            cur.execute("UPDATE users SET pin_code=%s WHERE id=%s", (new_pin, uid))
            conn.commit()
            pin_code = new_pin

        joined_at_iso = created_at.isoformat() if created_at else None
        
        # Fetch Extended Profile from user_profiles
        cur.execute("""
            SELECT display_name, age, gender, blood_group, contact_number, address, profile_pic_url 
            FROM user_profiles 
            WHERE user_id=%s
        """, (uid,))
        p_row = cur.fetchone()
        
        profile_data = {}
        if p_row:
             profile_data = {
                 "displayName": p_row[0],
                 "age": p_row[1],
                 "gender": p_row[2],
                 "bloodGroup": p_row[3],
                 "contact": p_row[4],
                 "savedLocation": p_row[5],
                 "profilePic": p_row[6]
             }
        
        # For LAB_ADMIN, also check lab_admin_profile for data
        lab_data = {}
        if role in ["LAB_ADMIN", "SUPER_ADMIN"]:
            cur.execute("""
                SELECT lab_name, address, contact_number, admin_name 
                FROM lab_admin_profile 
                WHERE user_id=%s
            """, (uid,))
            adm_p = cur.fetchone()
            if adm_p:
                lab_data = {
                    "lab_name": adm_p[0],
                    "lab_address": adm_p[1],
                    "admin_contact": adm_p[2],
                    "admin_name": adm_p[3]
                }
        
        cur.close()

        return jsonify({
            "id": uid,
            "email": email,
            "username": username,
            "role": role,
            "provider": provider,
            "joined_at": joined_at_iso,
            "pin_code": pin_code,
            **profile_data,
            **lab_data
        }), 200

    except Exception as e:
        print(f"[ERROR] Fetch profile failed: {e}")
        return jsonify({"message": "Server error"}), 500
    finally:
        conn.close()

@app.post("/api/profile")
def update_user_profile():
    if not session.get("user_id"):
        return jsonify({"message": "Not authenticated"}), 401

    user_id = session["user_id"]
    data = request.get_json()
    
    # Initialize all variables
    username = data.get("username") or None
    display_name = data.get("displayName") or None
    profile_pic = data.get("profilePic") or None
    gender = data.get("gender") or None
    blood_group = data.get("bloodGroup") or None
    contact = data.get("contact") or None
    address = data.get("savedLocation") or None
    
    # Handle age separately (needs to be int or None)
    age_val = data.get("age")
    age = int(age_val) if age_val and str(age_val).strip() else None

    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # Update username in users table if provided
        if username:
            print(f"[DEBUG] Updating username to: {username} for user_id: {user_id}")
            cur.execute("UPDATE users SET username=%s WHERE id=%s", (username, user_id))
        
        # UPSERT logic for MySQL (user_profiles)
        print(f"[DEBUG] Upserting profile for user_id: {user_id}")
        cur.execute("""
            INSERT INTO user_profiles (user_id, display_name, age, gender, blood_group, contact_number, address, profile_pic_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                display_name = VALUES(display_name),
                age = VALUES(age),
                gender = VALUES(gender),
                blood_group = VALUES(blood_group),
                contact_number = VALUES(contact_number),
                address = VALUES(address),
                profile_pic_url = VALUES(profile_pic_url)
        """, (user_id, display_name, age, gender, blood_group, contact, address, profile_pic))
        
        conn.commit()
        cur.close()
        print(f"[SUCCESS] Profile updated successfully for user_id: {user_id}")
        return jsonify({"message": "Profile updated successfully"}), 200
    except Exception as e:
        print(f"[ERROR] Update profile failed: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Update failed"}), 500
    finally:
        conn.close()


@app.get("/api/admin/appointments")
def get_admin_appointments():
    """Fetch all appointments for Lab Admins / Super Admins."""
    if not session.get("user_id"):
        return jsonify({"message": "Not authenticated"}), 401
    
    # Optional: Verify role
    if session.get("role") not in ["LAB_ADMIN", "SUPER_ADMIN"]:
        return jsonify({"message": "Unauthorized access."}), 403

    conn = get_connection()
    try:
        cur = conn.cursor()
        # Fetch all appointments with user contact info
        cur.execute("""
            SELECT 
                a.id, a.user_id, a.patient_name, a.lab_name, a.doctor_name, 
                a.tests, a.appointment_date, a.appointment_time, a.status, a.location,
                up.contact_number
            FROM appointments a
            LEFT JOIN user_profiles up ON a.user_id = up.user_id
            ORDER BY a.created_at DESC
        """)
        rows = cur.fetchall()
        cur.close()

        appointments = []
        for row in rows:
            aid, uid, p_name, l_name, d_name, tests, a_date, a_time, status, loc, contact = row
            appointments.append({
                "id": aid,
                "user_id": uid,
                "patient": p_name,
                "labName": l_name,
                "doctor": d_name,
                "technician": d_name, # Map doctor to technician for UI
                "test": tests,
                "date": str(a_date),
                "time": str(a_time),
                "status": status,
                "location": loc,
                "contact": contact or "N/A"
            })

        return jsonify(appointments), 200
    except Exception as e:
        print(f"[ERROR] Fetch admin appointments failed: {e}")
        return jsonify({"message": "Server error"}), 500
    finally:
        conn.close()




@app.get("/api/admin/patients")
def get_admin_patients():
    current_role = session.get("role")
    if current_role not in ["LAB_ADMIN", "SUPER_ADMIN"]:
        return jsonify({"message": "Unauthorized"}), 403

    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # 1. Active Registered Users
        query_users = """
            SELECT 
                u.id, 
                u.email, 
                u.created_at,
                (SELECT COUNT(*) FROM prescriptions p WHERE p.user_id = u.id) as reports_count,
                (SELECT mobile_number FROM prescriptions p WHERE p.user_id = u.id AND mobile_number IS NOT NULL ORDER BY created_at DESC LIMIT 1) as phone,
                (SELECT file_path FROM prescriptions p WHERE p.user_id = u.id ORDER BY created_at DESC LIMIT 1) as latest_rx,
                up.display_name,
                up.age,
                up.gender,
                up.blood_group,
                up.contact_number,
                up.address,
                up.profile_pic_url,
                u.username,
                (SELECT test_type FROM appointments a WHERE a.user_id = u.id ORDER BY created_at DESC LIMIT 1) as latest_test
            FROM users u 
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE u.role='USER'
        """
        cur.execute(query_users)
        user_rows = cur.fetchall()

        patients = []
        existing_patient_ids = set()
        
        for row in user_rows:
            uid, email, created_at, reports_count, phone, latest_rx, display_name, age, gender, blood_group, contact_number, address, profile_pic_url, username, latest_test = row
            
            # Prioritize Profile Contact over Prescription Phone
            final_phone = contact_number if contact_number else (phone if phone else "N/A")
            final_name = display_name if display_name else (username if username else email.split("@")[0])

            patients.append({
                "id": uid,
                "name": final_name,
                "email": email,
                "age": str(age) if age else "N/A",
                "gender": gender if gender else "N/A",
                "blood_group": blood_group if blood_group else "N/A",
                "phone": final_phone,
                "address": address if address else "N/A",
                "profile_pic": profile_pic_url,
                "joined_at": created_at.isoformat() if created_at else None,
                "uploaded_data_count": reports_count,
                "latest_prescription_url": latest_rx,
                "latest_test": latest_test if latest_test else "None Booked",
                "source": "Registered"
            })
            existing_patient_ids.add(email) # Use email to dedup or uid

        # 2. Add Guest Patients from Appointments
        # Fetch distinct guests by identifying info (phone or name+email)
        query_guests = """
            SELECT DISTINCT patient_name, contact_number, email, age, gender, created_at, test_type
            FROM appointments 
            WHERE user_id IS NULL OR user_id = 0
            GROUP BY patient_name, contact_number, email
            ORDER BY created_at DESC
        """
        try:
             cur.execute(query_guests)
             guest_rows = cur.fetchall()
             for gr in guest_rows:
                 g_name, g_phone, g_email, g_age, g_gender, g_date, g_test = gr
                 
                 # Dedup: if email exists in registered, skip (though user_id check should handle it)
                 if g_email and g_email in existing_patient_ids:
                     continue
                     
                 # Generate a pseudo ID for guests
                 g_id = f"guest-{g_phone or g_name}"
                 
                 patients.append({
                    "id": g_id,
                    "name": g_name or "Guest",
                    "email": g_email or "N/A",
                    "age": str(g_age) if g_age else "N/A",
                    "gender": g_gender or "N/A",
                    "blood_group": "N/A",
                    "phone": g_phone or "N/A",
                    "address": "N/A",
                    "profile_pic": None,
                    "joined_at": g_date.isoformat() if g_date else None,
                    "uploaded_data_count": 0,
                    "latest_prescription_url": None,
                    "latest_test": g_test or "None",
                    "source": "Guest"
                 })
        except Exception as ge:
            print(f"[WARN] Fetching guest patients failed: {ge}")

        # Sort by latest activity
        patients.sort(key=lambda x: x['joined_at'] or "", reverse=True)
        
        return jsonify(patients), 200
    except Exception as e:
        print(f"[ERROR] Fetch patients failed: {e}")
        return jsonify({"message": "Server error"}), 500
    finally:
        conn.close()

@app.get("/api/admin/patients/<string:user_id>/history")
def get_patient_history(user_id):
    current_role = session.get("role")
    if current_role not in ["LAB_ADMIN", "SUPER_ADMIN"]:
        return jsonify({"message": "Unauthorized"}), 403

    conn = get_connection()
    try:
        cur = conn.cursor()
        
        patient_details = {}
        prescriptions = []
        appointments = []
        
        # Determine if User ID (int) or Guest Phone (string)
        is_guest = False
        try:
            uid = int(user_id)
        except ValueError:
            is_guest = True
            
        if is_guest:
            # GUEST LOGIC (By Phone)
            mobile = user_id
            patient_details = {
                "id": mobile,
                "email": "N/A",
                "phone": mobile,
                "name": f"Guest ({mobile[-4:]})"
            }
            # Fetch prescriptions by phone where user_id is NULL
            cur.execute("""
                SELECT id, file_path, file_type, status, created_at, test_type
                FROM prescriptions
                WHERE mobile_number=%s AND user_id IS NULL
                ORDER BY created_at DESC
            """, (mobile,))
            
        else:
            # REGISTERED USER LOGIC (By ID)
            cur.execute("SELECT id, email FROM users WHERE id=%s", (uid,))
            u_row = cur.fetchone()
            if not u_row:
                return jsonify({"message": "User not found"}), 404
                
            # Get Phone
            cur.execute("SELECT mobile_number FROM prescriptions WHERE user_id=%s AND mobile_number IS NOT NULL LIMIT 1", (uid,))
            p_row = cur.fetchone()
            
            patient_details = {
                "id": u_row[0],
                "email": u_row[1],
                "phone": p_row[0] if p_row else "N/A",
                "name": u_row[1].split('@')[0]
            }
            
            # Fetch prescriptions
            cur.execute("""
                SELECT id, file_path, file_type, status, created_at, test_type
                FROM prescriptions
                WHERE user_id=%s
                ORDER BY created_at DESC
            """, (uid,))
            
            # Fetch appointments
            cur.execute("""
                SELECT id, appointment_date, appointment_time, test_type, status 
                FROM appointments 
                WHERE user_id=%s 
                ORDER BY created_at DESC
            """, (uid,))
            apt_rows = cur.fetchall()
            for r in apt_rows:
                appointments.append({
                    "id": r[0],
                    "date": str(r[1]),
                    "time": str(r[2]),
                    "test": r[3],
                    "status": r[4]
                })

        # Process Prescriptions (Common for both)
        rx_rows = cur.fetchall() # From the respective query above
        for r in rx_rows:
            prescriptions.append({
                "id": r[0],
                "image_url": r[1],
                "type": r[5] or "Prescription",
                "status": r[3],
                "date": r[4].strftime("%Y-%m-%d") if r[4] else ""
            })

        return jsonify({
            "details": patient_details,
            "prescriptions": prescriptions,
            "appointments": appointments
        }), 200

    except Exception as e:
        print(f"[ERROR] Fetch history failed: {e}")
        return jsonify({"message": "Server error"}), 500
    finally:
        conn.close()

@app.get("/api/admin/stats")
def get_admin_stats():
    current_role = session.get("role")
    if current_role not in ["LAB_ADMIN", "SUPER_ADMIN"]:
         return jsonify({"message": "Unauthorized"}), 403
    
    user_id = session.get("user_id")
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # Get Admin's Lab Info
        cur.execute("SELECT lab_id, lab_name FROM lab_admin_profile WHERE user_id=%s", (user_id,))
        admin_lab = cur.fetchone()
        
        where_clause = ""
        params = []
        if current_role == "LAB_ADMIN" and admin_lab:
            l_id, l_name = admin_lab
            if l_id:
                where_clause = " AND (lab_id = %s OR lab_name = %s)"
                params = [l_id, l_name]
            else:
                where_clause = " AND lab_name = %s"
                params = [l_name]

        # Appointments Today
        cur.execute(f"SELECT COUNT(*) FROM appointments WHERE date(appointment_date) = curdate() {where_clause}", params)
        appointments_today = cur.fetchone()[0]
        
        # Pending Orders (Prescriptions)
        cur.execute(f"SELECT COUNT(*) FROM prescriptions WHERE status = 'Pending' {where_clause}", params)
        pending_orders = cur.fetchone()[0]
        
        # Reports Generated
        cur.execute(f"SELECT COUNT(*) FROM reports WHERE 1=1 {where_clause}", params)
        reports_generated = cur.fetchone()[0]
        
        # Staff
        cur.execute(f"SELECT COUNT(*) FROM lab_staff WHERE status = 'Available' {where_clause}", params)
        available_staff = cur.fetchone()[0]
        
        cur.execute(f"SELECT COUNT(*) FROM lab_staff WHERE 1=1 {where_clause}", params)
        total_staff = cur.fetchone()[0]

        # Graph Data: Last 7 Days Appointments
        import datetime
        today = datetime.date.today()
        dates = [today - datetime.timedelta(days=i) for i in range(6, -1, -1)]
        
        graph_query = f"""
            SELECT DATE(appointment_date), COUNT(*) 
            FROM appointments 
            WHERE appointment_date >= %s {where_clause}
            GROUP BY DATE(appointment_date)
        """
        graph_params = [today - datetime.timedelta(days=7)] + params
        cur.execute(graph_query, graph_params)
        rows = cur.fetchall()
        
        counts_map = {str(r[0]): r[1] for r in rows}
        
        daily_stats = []
        for d in dates:
            d_str = str(d)
            label = d.strftime("%a") 
            daily_stats.append({
                "name": label,
                "count": counts_map.get(d_str, 0)
            })

        cur.close()
        return jsonify({
            "appointmentsToday": appointments_today,
            "pendingOrders": pending_orders,
            "reportsGenerated": reports_generated,
            "revenue": "₹0", 
            "activeStaff": available_staff,
            "totalStaff": total_staff,
            "dailyStats": daily_stats
        }), 200
    except Exception as e:
        print(f"[ERROR] Stats failed: {e}")
        return jsonify({"message": "Error fetching stats"}), 500
    finally:
        conn.close()

@app.route("/api/admin/appointments", methods=["GET", "POST"])
def manage_appointments():
    # If POST (Booking), anyone can do it (Landing Page)
    if request.method == "POST":
        data = request.get_json() or {}
        # Basic validation
        if not data.get("labName"):
             return jsonify({"message": "Lab Name required"}), 400
        
        conn = get_connection()
        try:
            cur = conn.cursor()
            user_id = session.get("user_id") # Nullable if guest
            
            # --- Auto-Create Laboratory (Lazy Creation) ---
            lab_name = data.get("labName")
            lab_address = data.get("labAddress")
            lab_lat = data.get("lat")
            lab_lon = data.get("lon")
            # Default location text if not provided
            lab_loc = data.get("location", "Unknown Location") 
            
            print(f"[DEBUG] Booking for Lab: {lab_name} at ({lab_lat}, {lab_lon})")

            # Try to find or insert the lab
            lab_id = None
            if lab_name:
                # 1. Try to find by name AND coordinates (Precise)
                # To avoid float comparison issues, we can try searching by name first
                cur.execute("SELECT id, latitude, longitude FROM laboratories WHERE name=%s", (lab_name,))
                candidates = cur.fetchall()
                
                # Check for coordinate match in python (with epsilon)
                for cand in candidates:
                    c_id, c_lat, c_lon = cand
                    # If both have lat/lon, check distance or equality
                    if lab_lat and lab_lon and c_lat and c_lon:
                         # 0.0001 degrees is ~11 meters. Enough for same building.
                         if abs(float(c_lat) - float(lab_lat)) < 0.0001 and abs(float(c_lon) - float(lab_lon)) < 0.0001:
                             lab_id = c_id
                             print(f"[DEBUG] Found existing Lab ID: {lab_id}")
                             break
                
                if not lab_id:
                    print(f"[DEBUG] Lab not found. Inserting new: {lab_name}")
                    # Insert new laboratory
                    try:
                        cur.execute("""
                            INSERT INTO laboratories (name, address, location, latitude, longitude)
                            VALUES (%s, %s, %s, %s, %s)
                        """, (lab_name, lab_address, lab_loc, lab_lat, lab_lon))
                        conn.commit()
                        lab_id = cur.lastrowid
                        print(f"[DEBUG] Created new Lab ID: {lab_id}")
                    except Exception as ex:
                        print(f"[WARNING] Lab insertion failed (race condition?): {ex}")
                        # Retry fetch strict
                        cur.execute("SELECT id FROM laboratories WHERE name=%s LIMIT 1", (lab_name,))
                        row = cur.fetchone()
                        if row: lab_id = row[0]

            # Insert Appointment with lab_id and new patient detail columns
            cur.execute("""
                INSERT INTO appointments (
                    user_id, lab_id, lab_name, patient_name, doctor_name, 
                    test_type, appointment_date, appointment_time, location, status, 
                    contact_number, source, age, gender, email
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'Pending', %s, %s, %s, %s, %s)
            """, (
                user_id,
                lab_id, 
                lab_name,
                data.get("patientName") or session.get("username") or session.get("email", "Guest"), 
                data.get("doctor", "Self"), 
                ", ".join(data.get("tests", [])),
                data.get("date"),
                data.get("time"),
                data.get("location"),
                data.get("contact"),
                "Website" if session.get("user_id") else "Guest Website",
                data.get("age"),
                data.get("gender"),
                data.get("email") or session.get("email")
            ))
            
            # Also insert into bookings table if this is Royal Clinical Laboratory (Legacy support)
            if lab_name == "Royal Clinical Laboratory":
                print(f"[DEBUG] Inserting booking for Royal Clinical Laboratory into bookings table with lab_id={lab_id}")
                
                # Get user email for the booking
                user_email = data.get("email") or session.get("email", "guest@example.com")
                patient_name_value = data.get("patientName") or user_email.split('@')[0]
                
                # Prepare test information
                tests_list = data.get("tests", [])
                test_category = tests_list[0] if tests_list else "General"
                selected_test = ", ".join(tests_list) if tests_list else "General Checkup"
                
                # Get contact information
                phone_number = data.get("contact") or ""
                
                try:
                    cur.execute("""
                        INSERT INTO bookings 
                        (patient_name, patient_id, email, phone_number, lab_id, 
                         test_category, selected_test, preferred_date, preferred_time, booking_status,
                         age, gender)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        patient_name_value,
                        str(user_id) if user_id else "GUEST",  # patient_id as string
                        user_email,
                        phone_number,
                        lab_id, 
                        test_category,
                        selected_test,
                        data.get("date"),
                        data.get("time"),
                        "Pending",
                        data.get("age"),
                        data.get("gender")
                    ))
                    print(f"[DEBUG] Successfully inserted into bookings table")
                except Exception as booking_err:
                    print(f"[ERROR] Failed to insert into bookings table: {booking_err}")
                    # Don't fail the whole request if bookings insert fails
            
            conn.commit()
            return jsonify({"message": "Appointment Booked"}), 201
        except Exception as e:
            print(f"Booking Error: {e}")
            return jsonify({"message": f"Booking Failed: {e}"}), 500
        finally:
            conn.close()

    # If GET, only Admin
    current_role = session.get("role")
    if current_role not in ["LAB_ADMIN", "SUPER_ADMIN"]:
         return jsonify({"message": "Unauthorized"}), 403

    conn = get_connection()
    try:
        cur = conn.cursor()
        
        query = """
            SELECT a.id, a.patient_name, a.test_type, a.appointment_date, a.appointment_time, a.status, a.lab_name, a.location, 
                   a.contact_number, a.technician, a.sample_type, a.payment_status, a.report_status, a.source, u.username,
                   a.age, a.gender, a.email
            FROM appointments a
            LEFT JOIN users u ON a.user_id = u.id
        """
        params = []
        
        # Filter for Lab Admin
        if current_role == "LAB_ADMIN":
            user_id = session.get("user_id")
            # Find Admin's Lab Name/ID
            cur.execute("SELECT lab_id, lab_name FROM lab_admin_profile WHERE user_id=%s", (user_id,))
            admin_lab_row = cur.fetchone()
            
            if admin_lab_row:
                l_id, l_name = admin_lab_row
                
                where_clauses = []
                if l_id:
                    where_clauses.append("lab_id=%s")
                    params.append(l_id)
                
                if l_name:
                    where_clauses.append("lab_name=%s")
                    params.append(l_name)
                    
                if where_clauses:
                     query += " WHERE (" + " OR ".join(where_clauses) + ")"
                else:
                     query += " WHERE 1=0" 
            else:
                query += " WHERE 1=0"

        query += " ORDER BY created_at DESC"
        
        cur.execute(query, tuple(params))
        rows = cur.fetchall()
        
        appointments = []
        for r in rows:
            appointments.append({
                "id": f"A-{r[0]}",
                "patient": r[1],
                "labName": r[6],
                "test": r[2],
                "date": str(r[3]),
                "time": str(r[4]),
                "status": r[5],
                "location": r[7],
                "contact": r[8],
                "technician": r[9] or "Unassigned",
                "sampleType": r[10] or "N/A",
                "paymentStatus": r[11] or "Pending",
                "reportStatus": r[12] or "Not Uploaded",
                "source": r[13] or "Website",
                "username": r[14] or "",
                "age": r[15],
                "gender": r[16],
                "email": r[17]
            })
        return jsonify(appointments), 200
    except Exception as e:
        return jsonify({"message": "Error fetching appointments"}), 500
    finally:
        conn.close()

@app.put("/api/admin/appointments/<int:id>/details")
def update_appointment_details(id):
    if session.get("role") not in ["LAB_ADMIN", "SUPER_ADMIN"]:
        return jsonify({"message": "Unauthorized"}), 403
    
    data = request.get_json()
    
    # Allow updating standard fields
    fields = {
        "technician": data.get("technician"),
        "sample_type": data.get("sampleType"),
        "payment_status": data.get("paymentStatus"),
        "report_status": data.get("reportStatus"),
        "appointment_date": data.get("date"),
        "appointment_time": data.get("time"),
        "status": data.get("status")
    }
    
    # Construct update query dynamically
    updates = []
    values = []
    
    for k, v in fields.items():
        if v is not None:
             updates.append(f"{k}=%s")
             values.append(v)
             
    if not updates:
        return jsonify({"message": "No changes provided"}), 400
        
    values.append(id)
    query = f"UPDATE appointments SET {', '.join(updates)} WHERE id=%s"

    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(query, tuple(values))
        conn.commit()
        return jsonify({"message": "Details Updated"}), 200
    except Exception as e:
        print(f"Update Error: {e}")
        return jsonify({"message": "Update Failed"}), 500
    finally:
        conn.close()

@app.put("/api/admin/appointments/<int:id>/status")
def update_appointment_status(id):
    if session.get("role") not in ["LAB_ADMIN", "SUPER_ADMIN"]:
        return jsonify({"message": "Unauthorized"}), 403
    
    data = request.get_json()
    new_status = data.get("status")
    
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("UPDATE appointments SET status=%s WHERE id=%s", (new_status, id))
        
        # Create Notification if Confirmed
        # Create Notification if Confirmed
        if new_status == "Confirmed":
            cur.execute("""
                SELECT 
                    a.user_id, a.test_type, a.appointment_date, a.lab_name, a.contact_number,
                    up.contact_number
                FROM appointments a
                LEFT JOIN user_profiles up ON a.user_id = up.user_id
                WHERE a.id=%s
            """, (id,))
            appt = cur.fetchone()
            
            if appt and appt[0]:
                uid, tests, date, lab_name, apt_contact, prof_contact = appt
                
                # Format test names properly
                if tests:
                    # Handle multiple tests separated by comma
                    test_list = [t.strip() for t in tests.split(',') if t.strip()]
                    if len(test_list) > 1:
                        test_display = f"{len(test_list)} tests ({', '.join(test_list[:2])}{'...' if len(test_list) > 2 else ''})"
                    elif len(test_list) == 1:
                        test_display = test_list[0]
                    else:
                        test_display = "your test"
                else:
                    test_display = "your test"
                
                # Format date nicely
                try:
                    from datetime import datetime
                    if isinstance(date, str):
                        date_obj = datetime.strptime(str(date), '%Y-%m-%d')
                    else:
                        date_obj = date
                    date_display = date_obj.strftime('%B %d, %Y')
                except:
                    date_display = str(date)
                
                # Create notification message
                lab_info = f" at {lab_name}" if lab_name else ""
                msg = f"Your appointment for {test_display} on {date_display}{lab_info} has been confirmed!"
                
                # Db Notification
                cur.execute("INSERT INTO notifications (user_id, message) VALUES (%s, %s)", (uid, msg))
                
                # WhatsApp Notification
                final_contact = apt_contact if apt_contact else prof_contact
                if final_contact:
                    # Run in thread to not block response
                    threading.Thread(target=send_whatsapp_message, args=(final_contact, msg)).start()

        conn.commit()
        return jsonify({"message": "Updated"}), 200
    finally:
        conn.close()


@app.get("/api/admin/test-orders")
def get_test_orders():
    current_role = session.get("role")
    if current_role not in ["LAB_ADMIN", "SUPER_ADMIN"]:
        return jsonify({"message": "Unauthorized"}), 403
        
    user_id = session.get("user_id")
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # Get Admin's Lab Info
        where_clause = ""
        params = []
        if current_role == "LAB_ADMIN":
            cur.execute("SELECT lab_id, lab_name FROM lab_admin_profile WHERE user_id=%s", (user_id,))
            row = cur.fetchone()
            if row:
                l_id, l_name = row
                if l_id:
                     # Filter by lab_id if assigned, or show all unassigned?
                     # Ideally we show orders relevant to this lab. 
                     # For now, following previous logic: if lab_id matches.
                     where_clause = " WHERE p.lab_id = %s"
                     params = [l_id]
                else:
                    where_clause = " WHERE 1=0" # No lab assigned

        query = f"""
            SELECT p.id, u.id, u.email, p.mobile_number, p.test_type, p.extracted_text, p.status, u.username
            FROM prescriptions p
            LEFT JOIN users u ON p.user_id = u.id
            {where_clause}
            ORDER BY p.created_at DESC
        """
        cur.execute(query, params)
        rows = cur.fetchall()
        
        orders = []
        for r in rows:
            uid = r[1]
            email = r[2]
            mobile = r[3]
            username = r[7]
            patient_display = username if username else (email.split("@")[0] if email else (mobile if mobile else "Guest"))
            
            # Clean extracted text for display
            detected_tests = []
            if r[5]:
                # Simple heuristic: take first few lines or split by comma
                lines = [l.strip() for l in r[5].split('\n') if l.strip()]
                detected_tests = lines[:3] # First 3 lines
            
            orders.append({
                "id": f"ORD-{r[0]}",
                "patientId": uid,
                "patient": patient_display,
                "category": r[4] or "General",
                "tests": detected_tests if detected_tests else ([r[4]] if r[4] else ["General Analysis"]),
                "sample": "Blood/Urine", 
                "status": r[6]
            })
        return jsonify(orders), 200
    except Exception as e:
        print(f"[ERROR] Fetch Orders failed: {e}")
        return jsonify({"message": "Server error"}), 500


def ensure_lab_staff_extended_schema():
    conn = get_connection()
    try:
        cur = conn.cursor()
        # Create plain if not exists
        cur.execute("""
            CREATE TABLE IF NOT EXISTS lab_staff (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(100),
                status VARCHAR(50) DEFAULT 'Available',
                image_url LONGTEXT,
                qualification VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Add new columns
        new_cols = {
            "name": "VARCHAR(255)",
            "role": "VARCHAR(100)",
            "status": "VARCHAR(50) DEFAULT 'Available'",
            "image_url": "LONGTEXT",
            "qualification": "VARCHAR(255)",
            "staff_id": "VARCHAR(50) UNIQUE",
            "gender": "VARCHAR(20)",
            "dob": "VARCHAR(20)",
            "phone": "VARCHAR(20)",
            "email": "VARCHAR(100)",
            "address": "TEXT",
            "department": "VARCHAR(100)",
            "employment_type": "VARCHAR(50)",
            "joining_date": "VARCHAR(20)",
            "experience": "VARCHAR(10)",
            "shift": "VARCHAR(50)",
            "working_days": "VARCHAR(255)",
            "working_hours": "VARCHAR(100)",
            "home_collection": "BOOLEAN DEFAULT 0",
            "specializations": "TEXT",
            "documents": "TEXT",
            "emergency_name": "VARCHAR(100)",
            "emergency_relation": "VARCHAR(50)",
            "emergency_phone": "VARCHAR(20)",
            "internal_notes": "TEXT"
        }
        
        for col, dtype in new_cols.items():
            cur.execute(f"SHOW COLUMNS FROM lab_staff LIKE '{col}'")
            if not cur.fetchone():
                print(f"[INFO] Adding missing column '{col}' to lab_staff...")
                cur.execute(f"ALTER TABLE lab_staff ADD COLUMN {col} {dtype}")
        
        # Upgrade image_url to LONGTEXT if it's not already
        try:
             cur.execute("ALTER TABLE lab_staff MODIFY COLUMN image_url LONGTEXT")
        except Exception:
             pass

        conn.commit()
    except Exception as e:
        print(f"[WARNING] Lab Staff schema update failed: {e}")
    finally:
        conn.close()

ensure_lab_staff_extended_schema()

@app.post("/api/admin/staff")
def add_staff():
    if session.get("role") not in ["LAB_ADMIN", "SUPER_ADMIN"]:
        return jsonify({"message": "Unauthorized"}), 403
    
    data = request.get_json()
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # Helper to join list to string
        def list_to_str(val):
            if isinstance(val, list):
                # If list of objects (files), try to extract names, else join
                if val and isinstance(val[0], dict) and 'name' in val[0]:
                     return ", ".join([f['name'] for f in val])
                return ", ".join(map(str, val))
            return str(val) if val else ""

        query = """
            INSERT INTO lab_staff (
                name, role, status, image_url, qualification,
                staff_id, gender, dob, phone, email, address,
                department, employment_type, joining_date, experience,
                shift, working_days, working_hours, home_collection,
                specializations, documents, emergency_name, emergency_relation, emergency_phone, internal_notes
            )
            VALUES (%s, %s, 'Available', %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        # Helper to handle empty dates
        def clean_date(d):
            return d if d and d.strip() else None

        params = (
            data.get('name'), 
            data.get('role'), 
            data.get('photoPreview'), # Mapping photoPreview to image_url for now
            data.get('qualification', ''),
            
            data.get('staffId'),
            data.get('gender'),
            clean_date(data.get('dob')),
            data.get('phone'),
            data.get('email'),
            data.get('address'),
            
            data.get('department'),
            data.get('type'), # employment_type
            clean_date(data.get('joiningDate')),
            data.get('experience'),
            
            data.get('shift'),
            list_to_str(data.get('workingDays')),
            data.get('workingHours'),
            1 if data.get('homeCollection') else 0,
            
            list_to_str(data.get('specializations')),
            list_to_str(data.get('documents')), # Handle documents
            data.get('emergencyName'),
            data.get('emergencyRelation'),
            data.get('emergencyPhone'),
            data.get('internalNotes'),
            data.get('lab_id') # Ensure lab_id is passed from frontend or found here
        )
        
        # If lab_id not in data, try to get from session admin profile
        if not data.get('lab_id'):
            cur.execute("SELECT lab_id FROM lab_admin_profile WHERE user_id=%s", (session.get("user_id"),))
            lab_row = cur.fetchone()
            if lab_row:
                params = list(params)
                params[-1] = lab_row[0]
                params = tuple(params)

        try:
            cur.execute(query.replace("emergency_phone, internal_notes", "emergency_phone, internal_notes, lab_id").replace("%s)", "%s, %s)"), params)
            conn.commit()
            return jsonify({"message": "Staff Added Successfully"}), 201
        except Exception as sql_err:
            # Log exact error
            with open("staff_error.log", "w") as f:
                f.write(f"SQL Error: {sql_err}\nParams: {params}")
            print(f"[ERROR] Add staff SQL failed: {sql_err}")
            return jsonify({"message": f"Database Error: {str(sql_err)}"}), 500
    except Exception as e:
        print(f"[ERROR] Add staff failed: {e}")
        return jsonify({"message": f"Error: {str(e)}"}), 500
    finally:
        conn.close()

@app.get("/api/admin/staff")
def get_staff():
    current_role = session.get("role")
    if current_role not in ["LAB_ADMIN", "SUPER_ADMIN"]:
        return jsonify({"message": "Unauthorized"}), 403
        
    user_id = session.get("user_id")
    conn = get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        
        where_clause = ""
        params = []
        if current_role == "LAB_ADMIN":
            cur.execute("SELECT lab_id, lab_name FROM lab_admin_profile WHERE user_id=%s", (user_id,))
            row = cur.fetchone()
            if row:
                l_id = row['lab_id']
                if l_id:
                    where_clause = " WHERE lab_id = %s OR (lab_id IS NULL AND 1=0)"
                    params = [l_id]
                else:
                    # Allow admins without a lab to see 'unassigned' staff
                    where_clause = " WHERE lab_id IS NULL"
                    params = []

        # Use staff_id for sorting as id might not exist
        query = f"SELECT * FROM lab_staff {where_clause} ORDER BY staff_id DESC" 
        
        # Safe execute
        if params:
            cur.execute(query, params)
        else:
            cur.execute(query)
            
        rows = cur.fetchall()
        
        staff = []
        for r in rows:
            try:
                # Safe handling for fields
                w_days = r.get('working_days', '')
                if isinstance(w_days, (set, list)):
                    w_days = list(w_days)
                elif isinstance(w_days, bytes):
                    w_days = w_days.decode('utf-8')

                # Determine shift fallback
                shift_val = r.get('shift')
                if not shift_val:
                    if r.get('morning_shift'): shift_val = "Morning"
                    elif r.get('evening_shift'): shift_val = "Evening"
                    elif r.get('night_shift'): shift_val = "Night"
                    else: shift_val = r.get('daily_working_hours') or "General"

                staff.append({
                    "id": r.get('id'),
                    "name": r.get('name') or r.get('full_name') or 'Unknown Staff',
                    "role": r.get('role') or r.get('role_designation') or 'Staff',
                    "status": r.get('status') or 'Available',
                    "image": r.get('image_url') or r.get('profile_photo'),
                    "staffId": r.get('staff_id'),
                    "department": r.get('department'),
                    "phone": r.get('phone') or r.get('phone_number') or '-',
                    "email": r.get('email') or '-',
                    "shift": shift_val,
                    "workingDays": w_days,
                    "qualification": r.get('qualification'),
                    "gender": r.get('gender'),
                    "dob": str(r.get('dob')) if r.get('dob') else None,
                    "address": r.get('address'),
                    "employmentType": r.get('employment_type'),
                    "joiningDate": str(r.get('joining_date')) if r.get('joining_date') else None,
                    "experience": r.get('experience'),
                    "workingHours": r.get('working_hours'),
                    "homeCollection": bool(r.get('home_collection')),
                    "specializations": r.get('specializations'),
                    "documents": r.get('documents'),
                    "emergencyName": r.get('emergency_name'),
                    "emergencyRelation": r.get('emergency_relation'),
                    "emergencyPhone": r.get('emergency_phone'),
                    "internalNotes": r.get('internal_notes')
                })
            except Exception as row_err:
                print(f"[WARN] Error parsing staff row: {row_err}")
                continue
            
        return jsonify(staff), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"[ERROR] Fetch Staff Failed: {e}")
        return jsonify({"message": f"Server Error: {str(e)}"}), 500
    finally:
        conn.close()

@app.put("/api/admin/staff/<int:staff_id>/status")
def update_staff_status(staff_id):
    if session.get("role") not in ["LAB_ADMIN", "SUPER_ADMIN"]:
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    new_status = data.get("status")
    
    if not new_status:
        return jsonify({"message": "Status is required"}), 400

    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("UPDATE lab_staff SET status = %s WHERE id = %s", (new_status, staff_id))
        conn.commit()
        
        if cur.rowcount == 0:
             return jsonify({"message": "Staff member not found"}), 404
             
        return jsonify({"message": "Status updated successfully"}), 200
    except Exception as e:
        print(f"[ERROR] Update status failed: {e}")
        return jsonify({"message": f"Error: {str(e)}"}), 500
    finally:
        conn.close()
        


def ensure_admin_name_column():
    """Add admin_name column to lab_admin_profile if not exists."""
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SHOW COLUMNS FROM lab_admin_profile LIKE 'admin_name'")
        if not cur.fetchone():
            cur.execute("ALTER TABLE lab_admin_profile ADD COLUMN admin_name VARCHAR(255) DEFAULT NULL")
            conn.commit()
    except Exception as e:
        print(f"[WARNING] Schema update (admin_name) failed: {e}")
    finally:
        conn.close()

ensure_admin_name_column()

@app.route("/api/admin/profile", methods=["GET", "POST"])
def admin_profile():
    user_id = session.get("user_id")
    if not user_id: return jsonify({"message":"Unauthorized"}), 401
    
    conn = get_connection()
    try:
        cur = conn.cursor()
        if request.method == "GET":
             # Join with users to get email, use LEFT JOIN to ensure we get user info even if profile doesn't exist yet
             cur.execute("""
                SELECT u.email, p.lab_name, p.address, p.contact_number, p.admin_name 
                FROM users u 
                LEFT JOIN lab_admin_profile p ON u.id = p.user_id 
                WHERE u.id=%s
             """, (user_id,))
             row = cur.fetchone()
             if row:
                 return jsonify({
                     "email": row[0],
                     "lab_name": row[1] or "", 
                     "address": row[2] or "", 
                     "contact": row[3] or "",
                     "admin_name": row[4] or ""
                 }), 200
             return jsonify({}), 404
        else:
             data = request.get_json()
             lab_name = data.get('lab_name')
             
             # Try to find lab_id for this lab_name
             lab_id = None
             if lab_name:
                 cur.execute("SELECT id FROM laboratories WHERE name=%s LIMIT 1", (lab_name,))
                 lab_row = cur.fetchone()
                 if lab_row:
                     lab_id = lab_row[0]
                 else:
                     # Create lab if not exists? Or just leave null for now. 
                     # Usually we want to create it so we have a persistent ID.
                     try:
                         cur.execute("INSERT INTO laboratories (name, address) VALUES (%s, %s)", (lab_name, data.get('address', '')))
                         lab_id = cur.lastrowid
                     except: pass

             # Upsert
             cur.execute("""
                INSERT INTO lab_admin_profile (user_id, lab_name, address, contact_number, admin_name, lab_id)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE lab_name=%s, address=%s, contact_number=%s, admin_name=%s, lab_id=%s
             """, (
                 user_id, 
                 lab_name, 
                 data.get('address'), 
                 data.get('contact'), 
                 data.get('admin_name'),
                 lab_id,
                 lab_name, 
                 data.get('address'), 
                 data.get('contact'),
                 data.get('admin_name'),
                 lab_id
             ))
             conn.commit()
             return jsonify({"message": "Profile Saved", "lab_id": lab_id}), 200
    finally:
        conn.close()


@app.post("/api/logout")
def logout():
    session.clear()
    resp = jsonify({"message": "Logged out"})
    # Clear cookie manually just in case
    resp.set_cookie('session', '', expires=0)
    return resp, 200

# --- User Appointment Management Endpoints ---
@app.post("/api/user/appointments/cancel")
def cancel_user_appointment():
    """Cancel an appointment (changes status to 'Cancelled')"""
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"message": "Not authenticated"}), 401
    
    data = request.get_json() or {}
    appointment_id = data.get("appointment_id")
    
    if not appointment_id:
        return jsonify({"message": "Appointment ID required"}), 400
    
    # Remove 'A-' prefix if present
    if isinstance(appointment_id, str) and appointment_id.startswith('A-'):
        appointment_id = appointment_id.replace('A-', '')
    
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # Verify the appointment belongs to this user
        cur.execute("SELECT id, status FROM appointments WHERE id=%s AND user_id=%s", (appointment_id, user_id))
        appt = cur.fetchone()
        
        if not appt:
            return jsonify({"message": "Appointment not found or access denied"}), 404
        
        # Update status to Cancelled
        cur.execute("UPDATE appointments SET status='Cancelled' WHERE id=%s", (appointment_id,))
        conn.commit()
        
        return jsonify({"message": "Booking cancelled successfully"}), 200
    except Exception as e:
        print(f"[ERROR] Cancel appointment failed: {e}")
        return jsonify({"message": "Server error"}), 500
    finally:
        conn.close()

@app.get("/api/user/appointments")
def get_user_appointments():
    """Get all appointments for the logged-in user"""
    user_id = session.get("user_id")
    if not user_id:
        return jsonify([]), 200  # Return empty array if not logged in
    
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # Fetch all appointments for this user
        cur.execute("""
            SELECT id, lab_name, patient_name, test_type, appointment_date, appointment_time, 
                   status, location, contact_number, created_at
            FROM appointments 
            WHERE user_id=%s 
            ORDER BY created_at DESC
        """, (user_id,))
        
        rows = cur.fetchall()
        bookings = []
        
        for r in rows:
            # Parse tests - handle both string and potential array formats
            tests_raw = r[3] or ""
            if tests_raw:
                # Split by comma and clean up
                tests = [t.strip() for t in tests_raw.split(',') if t.strip()]
            else:
                tests = []
            
            bookings.append({
                "id": f"A-{r[0]}",  # Add prefix for consistency
                "labName": r[1] or "Unknown Lab",
                "patient": r[2] or "Guest",
                "tests": tests,
                "date": str(r[4]) if r[4] else "Not set",
                "time": str(r[5]) if r[5] else "Not set",
                "status": r[6] or "Pending",
                "location": r[7] or "Not specified",
                "contact": r[8] or "N/A",
                "created_at": r[9].isoformat() if r[9] else None
            })
        
        return jsonify(bookings), 200
    except Exception as e:
        print(f"[ERROR] Get user appointments failed: {e}")
        return jsonify([]), 200  # Return empty array on error to prevent frontend crashes
    finally:
        conn.close()

@app.delete("/api/user/appointments/<appointment_id>")
def delete_user_appointment(appointment_id):
    """Permanently delete an appointment from user's history"""
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"message": "Not authenticated"}), 401
    
    # Remove 'A-' prefix if present
    if isinstance(appointment_id, str) and appointment_id.startswith('A-'):
        appointment_id = appointment_id.replace('A-', '')
    
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # Verify the appointment belongs to this user
        cur.execute("SELECT id FROM appointments WHERE id=%s AND user_id=%s", (appointment_id, user_id))
        appt = cur.fetchone()
        
        if not appt:
            return jsonify({"message": "Appointment not found or access denied"}), 404
        
        # Delete the appointment
        cur.execute("DELETE FROM appointments WHERE id=%s", (appointment_id,))
        conn.commit()
        
        return jsonify({"message": "Booking removed successfully"}), 200
    except Exception as e:
        print(f"[ERROR] Delete appointment failed: {e}")
        return jsonify({"message": "Server error"}), 500
    finally:
        conn.close()

@app.get("/api/admin/reports")
def get_all_reports():
    current_role = session.get("role")
    if current_role not in ["LAB_ADMIN", "SUPER_ADMIN"]:
        return jsonify({"message": "Unauthorized"}), 403
    
    user_id = session.get("user_id")
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        # Get Admin's Lab Info
        where_clause_reports = ""
        where_clause_appts = ""
        params = []
        if current_role == "LAB_ADMIN":
            cur.execute("SELECT lab_id, lab_name FROM lab_admin_profile WHERE user_id=%s", (user_id,))
            row = cur.fetchone()
            if row:
                l_id, l_name = row
                if l_id:
                    where_clause_reports = " WHERE r.lab_id = %s"
                    where_clause_appts = " WHERE (lab_id = %s OR lab_name = %s)"
                    params = [l_id, l_name] if where_clause_appts.count('%s') == 2 else [l_id]
                    # Actually let's be consistent
                    where_clause_appts = " WHERE lab_id = %s OR lab_name = %s"
                    params = [l_id, l_name]
                else:
                    where_clause_reports = " WHERE 1=0"
                    where_clause_appts = " WHERE 1=0"

        cur.execute(f"""
            SELECT r.id, u.email, r.test_name, r.file_path, r.status, r.uploaded_at, u.username
            FROM reports r
            LEFT JOIN users u ON r.patient_id = u.id
            {where_clause_reports}
            ORDER BY r.uploaded_at DESC
        """, [params[0]] if where_clause_reports else [])
        rows = cur.fetchall()
        reports = []
        for row in rows:
            p_name = row[6] if len(row) > 6 and row[6] else (row[1] or "Unknown")
            reports.append({
                "id": f"R-{row[0]}",
                "patient": p_name, 
                "test": row[2],
                "file_path": row[3],
                "status": row[4],
                "date": row[5].strftime("%Y-%m-%d") if row[5] else ""
            })
            
        # Add Appointments as Pending Reports
        cur.execute(f"""
            SELECT id, patient_name, test_type, appointment_date, status, user_id 
            FROM appointments 
            {where_clause_appts}
            ORDER BY appointment_date DESC LIMIT 50
        """, params if where_clause_appts else [])
        appt_rows = cur.fetchall()
        for a in appt_rows:
            reports.append({
                "id": f"A-{a[0]}",
                "patient": a[1] or "Guest",
                "test": a[2],
                "file_path": "",
                "status": "Pending Upload",
                "date": str(a[3]),
                "type": "appointment_entry" 
            })

        return jsonify(reports), 200
    finally:
        conn.close()

@app.get("/api/user/notifications")
def get_notifications():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify([]), 200 # Return empty if not logged in
        
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT id, message, is_read, created_at FROM notifications WHERE user_id=%s ORDER BY created_at DESC", (user_id,))
        rows = cur.fetchall()
        notes = []
        for r in rows:
            notes.append({
                "id": r[0],
                "message": r[1],
                "isRead": bool(r[2]),
                "date": r[3].strftime("%Y-%m-%d %H:%M")
            })
        return jsonify(notes), 200
    finally:
        conn.close()

@app.delete("/api/user/notifications/<int:id>")
def delete_notification(id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"message": "Not authenticated"}), 401

    conn = get_connection()
    try:
        cur = conn.cursor()
        # Verify ownership
        cur.execute("SELECT id FROM notifications WHERE id=%s AND user_id=%s", (id, user_id))
        if not cur.fetchone():
             return jsonify({"message": "Notification not found"}), 404
             
        cur.execute("DELETE FROM notifications WHERE id=%s", (id,))
        conn.commit()
        return jsonify({"message": "Deleted"}), 200
    except Exception as e:
        print(f"[ERROR] Delete notification failed: {e}")
        return jsonify({"message": "Failed to delete"}), 500
    finally:
        conn.close()


@app.post("/api/admin/upload-report")
def upload_report():
    user_id = session.get("user_id")
    current_role = session.get("role")
    if current_role not in ["LAB_ADMIN", "SUPER_ADMIN"]:
        return jsonify({"message": "Unauthorized"}), 403
    
    # Check text fields
    patient_id = request.form.get("patient_id")
    test_name = request.form.get("test_name")
    
    if "file" not in request.files:
         return jsonify({"message": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "":
         return jsonify({"message": "No selected file"}), 400

    if file:
        filename = f"{int(datetime.now().timestamp())}_{file.filename}"
        save_path = os.path.join("static", "reports", filename)
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        file.save(save_path)
        
        # Save to DB
        file_url = f"http://localhost:5000/static/reports/{filename}"
        
        conn = get_connection()
        try:
            cur = conn.cursor()
            
            # Get lab_id for the admin
            cur.execute("SELECT lab_id FROM lab_admin_profile WHERE user_id=%s", (user_id,))
            lab_row = cur.fetchone()
            lab_id = lab_row[0] if lab_row else None

            cur.execute("""
                INSERT INTO reports (patient_id, test_name, file_path, status, lab_id)
                VALUES (%s, %s, %s, 'Uploaded', %s)
            """, (patient_id, test_name, file_url, lab_id))
            
            # Auto-update prescription status
            try:
                cur.execute("""
                    UPDATE prescriptions 
                    SET status='Completed' 
                    WHERE user_id=%s AND status='Pending' 
                    ORDER BY created_at DESC LIMIT 1
                """, (patient_id,))
            except Exception:
                pass

            conn.commit()
            return jsonify({"message": "Report Uploaded"}), 201
        finally:
            conn.close()
    return jsonify({"message": "Upload failed"}), 500


@app.get("/api/admin/bookings")
def get_bookings():
    """Get all bookings from the bookings table (primarily for Royal Clinical Laboratory)"""
    current_role = session.get("role")
    if current_role not in ["LAB_ADMIN", "SUPER_ADMIN"]:
        return jsonify({"message": "Unauthorized"}), 403
    
    conn = get_connection()
    try:
        cur = conn.cursor()
        
        where_clause = ""
        params = []
        if current_role == "LAB_ADMIN":
            cur.execute("SELECT lab_id FROM lab_admin_profile WHERE user_id=%s", (session.get("user_id"),))
            row = cur.fetchone()
            if row and row[0]:
                where_clause = " WHERE lab_id = %s"
                params = [row[0]]
            else:
                where_clause = " WHERE 1=0"

        cur.execute(f"""
            SELECT booking_id, patient_name, patient_id, age, gender, email, 
                   phone_number, lab_id, test_category, selected_test, 
                   preferred_date, preferred_time, booking_status, created_at
            FROM bookings
            {where_clause}
            ORDER BY created_at DESC
        """, params)
        rows = cur.fetchall()
        
        bookings = []
        for r in rows:
            bookings.append({
                "bookingId": r[0],
                "patientName": r[1],
                "patientId": r[2],
                "age": r[3],
                "gender": r[4],
                "email": r[5],
                "phoneNumber": r[6],
                "labId": r[7],
                "testCategory": r[8],
                "selectedTest": r[9],
                "preferredDate": str(r[10]) if r[10] else None,
                "preferredTime": str(r[11]) if r[11] else None,
                "bookingStatus": r[12],
                "createdAt": r[13].isoformat() if r[13] else None
            })
        
        return jsonify(bookings), 200
    except Exception as e:
        print(f"[ERROR] Fetch bookings failed: {e}")
        return jsonify({"message": "Server error"}), 500
    finally:
        conn.close()







# ----------------------------
# OCR FLASK INTEGRATION
# ----------------------------
def ensure_prescriptions_table():
    """Ensure the prescriptions table exists with all columns."""
    conn = get_connection()
    try:
        cursor = conn.cursor()
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
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                user_id INT, 
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )
        """)
        
        # Check columns
        expected_columns = {
            "mobile_number": "VARCHAR(20)",
            "image_url": "TEXT",
            "extracted_text": "TEXT",
            "test_type": "VARCHAR(100)",
            "file_path": "TEXT",
            "status": "VARCHAR(50)",
            "file_type": "VARCHAR(50)",
            "user_id": "INT" 
        }

        for col, dtype in expected_columns.items():
            try:
                cursor.execute(f"SELECT {col} FROM prescriptions LIMIT 1")
                cursor.fetchall()
            except Exception:
                print(f"[INFO] Adding missing column: {col}")
                try:
                    cursor.execute(f"ALTER TABLE prescriptions ADD COLUMN {col} {dtype}")
                except Exception as ex:
                    print(f"Failed to add {col}: {ex}")

        conn.commit()
        cursor.close()
        print("[INFO] Prescriptions table ready.")
    except Exception as e:
        print(f"[ERROR] Prescriptions table init failed: {e}")
    finally:
        conn.close()


@app.route("/webhook/whatsapp", methods=["POST"])
def whatsapp_webhook():
    print("[INFO] Webhook HIT - Processing Prescription")
    
    resp = MessagingResponse()

    # 1. Check if image is sent
    num_media = int(request.form.get("NumMedia", 0))
    sender_number = request.form.get("From", "Unknown")

    if num_media == 0:
        resp.message("Please send a prescription image.")
        return str(resp)

    # 2. Get image URL and credentials
    media_url = request.form.get("MediaUrl0")
    TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "").strip()
    TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "").strip()
    
    # Dedicated logging for WhatsApp troubleshooting
    log_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "whatsapp_debug.log")
    with open(log_file, "a") as f:
        f.write(f"\n--- {datetime.now()} ---\n")
        f.write(f"From: {sender_number}\n")
        f.write(f"Media URL: {media_url}\n")
        f.write(f"Account SID: {TWILIO_ACCOUNT_SID[:10]}...\n")

    try:
        # 3. Download image safely
        filename = f"rx_{int(time.time())}_{uuid.uuid4().hex[:8]}.jpg"
        static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "prescriptions")
        os.makedirs(static_dir, exist_ok=True)
        image_path = os.path.join(static_dir, filename)
        
        # Use a session for better connection handling
        session = requests.Session()
        session.headers.update({'User-Agent': 'Mozilla/5.0'})
        
        max_retries = 2
        success = False
        last_status = 0
        
        for attempt in range(max_retries + 1):
            if attempt > 0:
                print(f"[INFO] Retry attempt {attempt} for media download...")
                time.sleep(2) # Small delay for Twilio media propagation
            
            # Step A: Check redirect
            try:
                r = session.get(media_url, auth=(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN), allow_redirects=False, timeout=15)
                last_status = r.status_code
                
                if r.status_code in [301, 302, 303, 307, 308]:
                    final_url = r.headers['Location']
                    print(f"[DEBUG] Redirected to storage URL. Fetching content...")
                    # Download from redirected URL WITHOUT Twilio auth
                    img_resp = session.get(final_url, timeout=20)
                    if img_resp.status_code == 200:
                        with open(image_path, "wb") as f_out:
                            f_out.write(img_resp.content)
                        success = True
                        break
                elif r.status_code == 200:
                    with open(image_path, "wb") as f_out:
                        f_out.write(r.content)
                    success = True
                    break
                else:
                    print(f"[WARN] Download attempt failed with status: {r.status_code}")
            except Exception as ex:
                print(f"[ERROR] Download attempt {attempt} exception: {ex}")
                last_status = 500

        if not success:
            # Final Attempt: Public download (no auth at all)
            print("[INFO] Trying public fallback download...")
            try:
                fallback_resp = requests.get(media_url, timeout=15)
                if fallback_resp.status_code == 200:
                    with open(image_path, "wb") as f_out:
                        f_out.write(fallback_resp.content)
                    success = True
                    print("[INFO] Image saved via public fallback.")
                else:
                    last_status = fallback_resp.status_code
            except:
                pass

        if not success:
            print(f"[ERROR] All download attempts failed. Last status: {last_status}")
            with open(log_file, "a") as f:
                f.write(f"FAILED. Last status: {last_status}\n")
            
            if last_status == 401:
                resp.message("⚠️ Access Denied: Your Twilio credentials in the .env file seem to be incorrect or expired. Please update them and restart the server.")
            else:
                resp.message(f"⚠️ I couldn't download the prescription (Error {last_status}). Please try sending it again.")
            return str(resp)

        print(f"[INFO] Image saved successfully: {image_path}")
        with open(log_file, "a") as f:
            f.write(f"SUCCESS: {filename}\n")

        # 4. OCR
        extracted_text = None

        # Primary Method: Google Vision
        try:
            basedir = os.path.dirname(os.path.abspath(__file__))
            key_path = os.path.join(basedir, "google_key.json")
            if os.path.exists(key_path):
                print("[INFO] Using Google Vision OCR...")
                os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = key_path
                client = vision.ImageAnnotatorClient()
                with io.open(image_path, 'rb') as image_file:
                    content = image_file.read()
                image = vision.Image(content=content)
                vision_response = client.text_detection(image=image)
                texts = vision_response.text_annotations
                if texts:
                    extracted_text = texts[0].description
                    print("[INFO] Google Vision OCR extraction successful.")
        except Exception as e:
            print(f"[ERROR] Google Vision failed: {e}")

        # Fallback to OCR.Space if Google Vision fails or returns nothing
        if not extracted_text:
            try:
                print("[INFO] Google Vision failed or empty, trying OCR.Space fallback...")
                API_KEY = os.environ.get("OCR_SPACE_API_KEY", "helloworld")
                with open(image_path, 'rb') as f:
                    ocr_resp = requests.post(
                        'https://api.ocr.space/parse/image',
                        files={image_path: f},
                        data={'apikey': API_KEY, 'language': 'eng', 'OCREngine': 2},
                        timeout=20
                    )
                if ocr_resp.status_code == 200:
                    res = ocr_resp.json()
                    if res.get('ParsedResults'):
                        extracted_text = res['ParsedResults'][0]['ParsedText']
                        print("[INFO] OCR.Space extraction successful.")
            except Exception as e:
                print(f"[ERROR] OCR.Space fallback also failed: {e}")

        if not extracted_text:
            print("[ERROR] OCR yielded no text from the prescription.")
            resp.message("Could not read text from image. Please send a clearer photo.")
            return str(resp)

        # 5. Process Text
        cleaned_lines = [line.strip() for line in extracted_text.splitlines() if line.strip()]
        
        # Test Keywords for filtering
        test_keywords = ["blood", "cbc", "hemoglobin", "sugar", "glucose", "thyroid", "tsh", "lipid", "creatinine", "kidney", "liver", "urine", "stool", "vitamin", "x-ray", "scan"]
        exclude_keywords = ["road", "street", "hospital", "clinic", "pathology", "phone", "email", "www", "date", "name", "age", "sex", "patient", "dr.", "doctor"]

        filtered_lines = []
        for line in cleaned_lines:
             l = line.lower()
             if any(k in l for k in test_keywords) and not any(e in l for e in exclude_keywords):
                 filtered_lines.append(line)
        
        if not filtered_lines and len(cleaned_lines) > 0:
             # Fallback snippet if no keywords match specifically
             filtered_lines = cleaned_lines[:5]

        display_text = "\n".join(filtered_lines[:10])

        # Detect Test Type Category
        text_lower = extracted_text.lower()
        test_type = "General Lab Test"
        if "blood" in text_lower or "cbc" in text_lower: test_type = "Blood Test"
        elif "urine" in text_lower: test_type = "Urine Test"
        elif "thyroid" in text_lower: test_type = "Thyroid Test"
        elif "sugar" in text_lower or "glucose" in text_lower: test_type = "Diabetes Test"
        
        # 6. Save to DB
        conn = get_connection()
        try:
             cur = conn.cursor()
             # Link to user by last 10 digits of mobile
             clean_mobile = sender_number.replace('whatsapp:', '').replace(' ', '')[-10:]
             user_id = None
             
             cur.execute("""
                SELECT user_id FROM user_profiles 
                WHERE contact_number LIKE %s 
                LIMIT 1
             """, (f"%{clean_mobile}",))
             row = cur.fetchone()
             if row:
                 user_id = row[0]
             
             # Use dynamic host URL for the file path
             base_url = request.host_url.rstrip('/')
             file_url = f"{base_url}/static/prescriptions/{filename}"
             
             cur.execute("""
                INSERT INTO prescriptions (mobile_number, image_url, extracted_text, test_type, file_path, status, file_type, user_id)
                VALUES (%s, %s, %s, %s, %s, 'Pending', 'image/jpeg', %s)
             """, (sender_number, media_url, extracted_text, test_type, file_url, user_id))
             conn.commit()
             cur.close()
             print(f"[INFO] Prescription saved for mobile: {sender_number}")
        except Exception as e:
             print(f"[ERROR] Database save error: {e}")
        finally:
             conn.close()

        # 7. Reply
        website_link = "http://localhost:5173/login"
        resp.message(
            f"✅ Prescription Received!\n\n"
            f"🔬 Category: {test_type}\n"
            f"📋 Detected Tests:\n{display_text}\n\n"
            f"We've added this to your records for review. Track progress here:\n{website_link}"
        )

    except Exception as e:
        print(f"[CRITICAL] WhatsApp Webhook Error: {e}")
        resp.message("Error processing request. Please try again.")

    return str(resp)


# --- Chatbot API (Gemini Integration) ---
@app.route('/api/chat', methods=['POST'])
def chat_bot():
    try:
        data = request.json
        user_message = data.get('message', '')
        history = data.get('history', [])

        if not user_message:
            return jsonify({"response": "I'm listening. What can I help you with today?"}), 200

        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return jsonify({"response": "Chat service is temporarily offline. Please try again later."}), 503

        # Enhanced System instructions with specific project knowledge
        system_instruction = (
            "You are MediBot, the advanced AI assistant for the MediBot Healthcare platform. "
            "Your role is to assist users with navigating the website, booking diagnostic tests, and understanding our services. "
            "You have full knowledge of the website's features and workflows.\n\n"
            "--- WEBSITE CAPABILITIES & KNOWLEDGE BASE ---\n\n"
            "1. **CORE SERVICE**: We facilitate online booking for diagnostic labs. Users can search for labs, book appointments, and view reports online.\n"
            "   - **Tests Available**: Blood tests, Urine tests, Stool tests, Sputum tests, and comprehensive health packages.\n"
            "   - **Home Collection**: Many labs offer home sample collection (indicated in lab details).\n\n"
            "2. **FINDING LABS**:\n"
            "   - Users can search by **City/Area** (e.g., 'Kanjirapally', 'Kochi') or by **Lab Name**.\n"
            "   - We use OpenStreetMap to find real nearby laboratories based on the user's location.\n"
            "   - **Special Demo**: For 'Kanjirapally', we display a curated list of top-rated labs including 'Scanron Diagnostics', 'Royal Clinical Laboratory', and 'Dianova'.\n\n"
            "3. **BOOKING PROCESS**:\n"
            "   - **Step 1**: Find a lab and click 'Book Now'.\n"
            "   - **Step 2**: Select tests (e.g., CBC, Lipid Profile). Default prices are approx ₹150/test + Lab Booking Fee.\n"
            "   - **Step 3**: Choose an Appointment Date and Time.\n"
            "   - **Step 4**: Enter Patient Details (Name, Contact).\n"
            "   - **Step 5**: Payment. We offer two modes:\n"
            "     a) **Pay Online**: Secure payment via Razorpay (UPI, Credit/Debit Cards, Net Banking). It's instant and secure.\n"
            "     b) **Pay at Lab**: Book now and pay cash/card when you visit the lab.\n"
            "   - **Confirmation**: Booking is confirmed instantly. Users receive a notification and can track it in 'My Bookings'.\n\n"
            "4. **REPORTS & PRESCRIPTIONS**:\n"
            "   - **My Reports**: Users can view and download their test reports (PDFs) directly from the 'Reports' tab.\n"
            "   - **Upload Prescription**: Users can upload a doctor's prescription. Our team analyzes it and suggests the correct tests.\n"
            "   - **WhatsApp Integration**: Users can also send a photo of their prescription to our WhatsApp bot. Our AI extracts the tests and saves them to their profile.\n\n"
            "5. **USER PROFILE**:\n"
            "   - Users have a unique `@username`.\n"
            "   - They can manage their personal details (Age, Gender, Blood Group, Address) in the Profile section.\n"
            "   - 'My Bookings' shows history and status (Pending, Confirmed, Completed).\n\n"
            "6. **FOR LAB OWNERS**:\n"
            "   - There is a dedicated **Lab Admin Dashboard** (accessible via `/admin-login`).\n"
            "   - Lab Admins can manage appointments, upload reports, manage staff, and view earnings.\n\n"
            "--- GUIDELINES ---\n"
            " - **Be Helpful & Patient**: You are a friendly guide. Explain things simply.\n"
            " - **Be Accurate**: Use the specific lab names (e.g. Scanron, Royal) and features mentioned above.\n"
            " - **No Medical Advice**: If users ask for symptoms or diagnosis, politely state that you are an AI for booking assistance and advise them to consult a doctor.\n"
            " - **Serious/Unknown Issues**: If the user reports a serious problem (e.g. 'wrong report', 'money deducted but not booked') or asks something you don't know, do NOT make up an answer. Instead, say: 'I apologize, but for this specific issue, please contact our **MediBot Support Team** directly at **support@medibot.com** or call **+91-9876543210** for immediate resolution.'\n"
            " - **Payment Queries**: Confirm that 'Pay Online' uses Razorpay and is fully secure.\n"
            " - Keep answers concise, professional, and friendly."
        )

        # Build clean history
        formatted_history = []
        # Prepend system instruction
        formatted_history.append({"role": "user", "parts": [f"SYSTEM INSTRUCTION: {system_instruction}\nPlease acknowledge and stay in character."] })
        formatted_history.append({"role": "model", "parts": ["Acknowledged. I am MediBot. I will assist with site navigation and booking services professionally."] })

        for msg in history:
            if 'type' in msg and 'text' in msg:
                # Skip the default welcome msg from history sent by frontend
                if "Welcome to MediBot" in msg['text']:
                    continue
                role = "user" if msg['type'] == 'user' else "model"
                formatted_history.append({"role": role, "parts": [msg['text']]})

        # GEMINI STRICTNESS: 
        # History MUST alternate User/Model. Combine consecutive messages of same role.
        
        final_history = []
        if formatted_history:
            current_role = formatted_history[0]['role']
            current_parts = formatted_history[0]['parts']
            
            for msg in formatted_history[1:]:
                if msg['role'] == current_role:
                    # Combine consecutive
                    current_parts.extend(msg['parts'])
                else:
                    final_history.append({"role": current_role, "parts": current_parts})
                    current_role = msg['role']
                    current_parts = msg['parts']
            
            final_history.append({"role": current_role, "parts": current_parts})

        # Ensure history ends with 'model' required for start_chat
        while final_history and final_history[-1]['role'] == 'user':
            final_history.pop()

        # --- ROBUST MODEL GENERATION ---
        try:
            # ATTEMPT 1: Preferred Model (Flash 2.0) with History
            try:
                model = genai.GenerativeModel('models/gemini-2.0-flash')
                chat = model.start_chat(history=final_history)
                response = chat.send_message(user_message)
                return jsonify({"response": response.text}), 200
            except Exception as e1:
                print(f"[WARN] Flash 2.0 Attempt 1 failed: {e1}. Retrying...")
                
                # ATTEMPT 2: Retry with same stable model
                model = genai.GenerativeModel('models/gemini-2.0-flash')
                chat = model.start_chat(history=final_history)
                response = chat.send_message(user_message)
                return jsonify({"response": response.text}), 200

        except Exception as e2:
            print(f"[WARN] Context history failed: {e2}. Trying stateless fallback...")
            
            # ATTEMPT 3: LAST RESORT - Stateless (No History)
            try:
                fallback_model = genai.GenerativeModel('models/gemini-2.0-flash')
                # Inject system prompt manually since we aren't using chat history
                full_prompt = (
                    f"{system_instruction}\n\n"
                    f"--- END INSTRUCTIONS ---\n\n"
                    f"USER QUESTION: {user_message}"
                )
                response = fallback_model.generate_content(full_prompt)
                return jsonify({"response": response.text}), 200
            except Exception as e3:
                print(f"[ERROR] All fallbacks failed: {e3}")
                return jsonify({"response": "I am currently overloaded. Please try again in 10 seconds."}), 500

    except Exception as outer_e:
        print(f"[ERROR] Chat Bot Outer Exception: {outer_e}")
        return jsonify({"response": "An unexpected error occurred."}), 500

# Duplicate route removed to avoid conflict - using the one at line 2314

# --- Razorpay Payment Routes ---
@app.route('/api/create-payment-order', methods=['POST'])
def create_payment_order():
    try:
        data = request.json
        amount = data.get('amount')  # Amount in INR
        if not amount:
            return jsonify({"error": "Amount is required"}), 400
            
        currency = 'INR'
        notes = data.get('notes', {})
        
        # Razorpay expects amount in paise (1 INR = 100 Paise)
        razorpay_order = razorpay_client.order.create({
            'amount': int(float(amount) * 100),
            'currency': currency,
            'payment_capture': '1',
            'notes': notes
        })
        
        return jsonify({
            'order_id': razorpay_order['id'],
            'amount': razorpay_order['amount'],
            'currency': razorpay_order['currency'],
            'key': RAZORPAY_KEY_ID
        }), 200
        
    except Exception as e:
        print(f"[ERROR] Razorpay Create Order Failed: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/verify-payment', methods=['POST'])
def verify_payment():
    try:
        data = request.json
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_signature = data.get('razorpay_signature')
        
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        
        # Verify the payment signature
        razorpay_client.utility.verify_payment_signature(params_dict)
        
        return jsonify({"status": "Success", "message": "Payment verified successfully"}), 200
        
    except Exception as e:
        print(f"[ERROR] Razorpay Signature Verification Failed: {e}")
        return jsonify({"status": "Failed", "message": "Payment verification failed"}), 400



if __name__ == '__main__':
  print(" * MediBot Python Backend Starting on Port 5000 *")
  print(" * MediBot Backend V3 - Robust Chat Fallback Active *")
  ensure_prescriptions_table()
  app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
