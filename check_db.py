import sqlite3, os

def main():
    # Resolve database file path; uses SQLite file 'app.db' in project root
    db_path = "app.db"
    conn = sqlite3.connect(db_path)
    tables = [row[0] for row in conn.execute('SELECT name FROM sqlite_master WHERE type="table"')]
    print('Tables in the database:', tables)
    conn.close()

if __name__ == "__main__":
    main()
