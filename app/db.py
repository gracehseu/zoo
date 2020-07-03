import sqlite3
from app.constants.ANIMALS import ANIMALS 

class Schema:
    def __init__(self):
        self.create_user_table()
        self.create_animal_table()

    def create_user_table(self):
        conn = sqlite3.connect('USER.db')
        conn.execute("""DROP TABLE IF EXISTS USER""")
        print('clear user table')

        query = """
        CREATE TABLE IF NOT EXISTS "USER" (
            user_id INTEGER PRIMARY KEY,
            name TEXT,
            email TEXT,
            password TEXT
            );
        """
        conn.execute(query)
        conn.commit()
        conn.close()

    def create_animal_table(self):

        conn = sqlite3.connect('ANIMAL.db')
        conn.execute("""DROP TABLE IF EXISTS ANIMAL""")
        print('clear animal table')

        query = """
        CREATE TABLE IF NOT EXISTS "ANIMAL" (
        user_id INTEGER PRIMARY KEY, """

        for animal in ANIMALS:
            query +=  animal.upper() + " INTEGER DEFAULT 0, "
            query +=  animal.upper() + "_DEAD INTEGER DEFAULT 0, "

        query = query[:-2] + ');'

        print(query)

        # query = """
        # CREATE TABLE IF NOT EXISTS "ANIMAL" (
        #     user_id INTEGER PRIMARY KEY,
        #     ELEPHANT INTEGER DEFAULT 0,
        #     GIRAFFE INTEGER DEFAULT 0,
        #     CAMEL INTEGER DEFAULT 0,
        #     LION INTEGER DEFAULT 0,
        #     ELEPHANT_DEAD INTEGER DEFAULT 0,
        #     GIRAFFE_DEAD INTEGER DEFAULT 0,
        #     CAMEL_DEAD INTEGER DEFAULT 0,
        #     LION_DEAD INTEGER DEFAULT 0
        #     );
            
        # """
        conn.execute(query)
        conn.commit()
        conn.close()