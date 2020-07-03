import sqlite3

class AnimalModel():
    tablename = "ANIMAL"

    def __init__(self):
        self.conn = sqlite3.connect('ANIMAL.db')

    def update_animals(self, user_id, json):
        c = self.conn.cursor()
        # print('json + ' + json)

        update_var = json['animal'].upper()
        update_num = None

        # implemented here to make sure it's only one greater
        # returns early if not valid
        animal_current_values = self.get_number_of_animals(user_id, update_var)
        current_animals_rehabilitated = animal_current_values[0]
        current_animals_killed = animal_current_values[1]


        if 'animalRehab' in json:
            update_num = json['animalRehab']
            if (current_animals_rehabilitated + 1) != update_num:
                return False
        else:
            update_var += '_DEAD'
            update_num = json['animalDead']
            if (current_animals_killed + 1) != update_num:
                return False

        update_query = f'UPDATE {self.tablename} ' \
                f'SET {update_var} ' \
                f'= {update_num} '\
                f'WHERE user_id = {user_id};'

        print(update_query)

        result = c.execute(update_query)
        self.conn.commit()
        c.close()
        
        return result


    def get_number_of_animals(self, user_id, animal):
        c = self.conn.cursor()

        animalAliveString = animal.upper()
        animalDeadString = animal.upper() + str('_DEAD')

        animal_query = f'SELECT {animalAliveString}, {animalDeadString} ' \
                f'FROM {self.tablename} ' \
                f'WHERE user_id = {user_id};'

        # animal_query = f'select * from ANIMAL;'
        animal_result = c.execute(animal_query).fetchone()


        c.close()

        return animal_result 
        # return animal_numbers
        # return None
        
