import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from app.constants.ANIMALS import ANIMALS_QUERY 

class UserDBModel():
    tablename = "USER"

    def __init__(self):

        self.conn = sqlite3.connect('USER.db')    
    
    def create(self, name, email, password, animal_info):

        c = self.conn.cursor()

        existence_query = f'SELECT email ' \
                f'FROM {self.tablename} ' \
                f'WHERE email=\'{email}\';' \
        
        existence_result = c.execute(existence_query).fetchone()
        if existence_result:
            c.close()
            return False
        else:
            # insert query
            hashed_password = generate_password_hash(password)

            insert_query = f'insert into {self.tablename} ' \
                f'(name, email, password) ' \
                f'SELECT \'{name}\', \'{email}\', \'{hashed_password}\';'\

            result = c.execute(insert_query)

            self.conn.commit()

            c.close()
            self.create_animal_database(animal_info)

            return True

        c.close()
        return False

    def validate(self, email, password):

        c = self.conn.cursor()
        
        query = f'SELECT *'\
                f' FROM {self.tablename}'\
                f' WHERE'\
                f' email = \'{email}\'';

        user_result = c.execute(query)

        valid_user_result = c.fetchone()
        c.close()   

        if valid_user_result != None and check_password_hash(valid_user_result[3], password):
            # should probably change this in the future
            # I assume that the id is position 0
            if check_password_hash(valid_user_result[3], password):
                return valid_user_result[0]


        c.close()
        return None

    def get_name(self, user_id):
        c = self.conn.cursor()
        
        query = f'SELECT *'\
                f' FROM {self.tablename}'\
                f' WHERE'\
                f' user_id = \'{user_id}\'';

        user_result = c.execute(query)
        valid_user_result = c.fetchone()
        c.close()   

        if valid_user_result != None:

            # TODO: should probably change this in the future
            # I assume that the name is position 1

            return valid_user_result[1]


        c.close()
        return None

    def create_animal_database (self, animal_exists):

        conn = sqlite3.connect('ANIMAL.db')
        c = conn.cursor()

        print(animal_exists)

        animals_already_added = False

        if animal_exists != None:

            insert_query = 'insert into ANIMAL' 
            animals_query = '('
            values_query = 'VALUES ('
            for animal in animal_exists.keys():

                if animal in ANIMALS_QUERY:
                    animals_already_added = True
                    animals_query += str(animal) + ','
                    values_query += str(animal_exists[animal]) + ','
            animals_query = animals_query[:-1] + ')'
            values_query = values_query[:-1] + ');'
            insert_query += animals_query + values_query


        if not animals_already_added:
            insert_query = f'insert into ANIMAL' \
                    f'(ELEPHANT) ' \
                    f'VALUES (0);'\

        print(insert_query)
        
        result = c.execute(insert_query)
        conn.commit();

        c.close()
        
