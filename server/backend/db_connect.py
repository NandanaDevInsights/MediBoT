"""
Database connection pool for the Flask backend.

All credentials are pulled from environment variables; nothing is hard-coded.
Uses mysql-connector pooling for efficient reuse across requests.
"""

import os
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import pooling

load_dotenv()



def get_connection():
    return mysql.connector.connect(
        host=os.environ.get("MYSQLHOST"),
        port=int(os.environ.get("MYSQLPORT", 3306)),
        user=os.environ.get("MYSQLUSER"),
        password=os.environ.get("MYSQLPASSWORD"),
        database=os.environ.get("MYSQLDATABASE"),
        ssl_mode=os.environ.get("MYSQL_SSL_MODE", "REQUIRED")
    )


pool = None

def get_connection():
	"""Get a pooled connection for request-scoped use."""
	global pool
	if pool is None:
		pool = get_pool()
	return pool.get_connection()

