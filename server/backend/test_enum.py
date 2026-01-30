from db_connect import get_connection

def test_insert_pending():
    try:
        conn = get_connection()
        cur = conn.cursor()
        query = "INSERT INTO prescriptions (mobile_number, status) VALUES (%s, %s)"
        cur.execute(query, ("+123", "Pending"))
        conn.commit()
        print("Insert with 'Pending' Successful")
        conn.close()
    except Exception as e:
        print(f"Insert with 'Pending' Failed: {e}")

if __name__ == "__main__":
    test_insert_pending()
