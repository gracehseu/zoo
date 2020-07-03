from flask import Blueprint, render_template, redirect, request, session
from flask_login import current_user, login_required
from .models import *
from app.constants.ANIMALS import ANIMALS 

animals_bp = Blueprint('animals', __name__)

@animals_bp.route('/habitat/<animal>', methods=['GET', 'POST'])
# @login_required
def animal(animal):
    # print('animals is' + str(ANIMALS))
    if animal in ANIMALS:
        animalText = animal.replace('_', ' ')
        if current_user.is_authenticated:

            # loads up user animal & number of animals
            # print(current_user.id)
            num_animals = AnimalModel().get_number_of_animals(current_user.id, animal)

            print(num_animals)
            animals_rehabilitated = num_animals[0]
            animals_killed = num_animals[1]

            print(animalText)

        else:
            # print(session.get())
            # print(session[animal.upper()])
            if session.get(animal.upper()) == None:
                animals_rehabilitated = 0
                session[animal.upper()] = 0
            else:
                animals_rehabilitated = session[animal.upper()]
            if session.get(animal.upper() + "_DEAD") == None:
                animals_killed = 0
                session[animal.upper() + "_DEAD"] = 0
            else:
                animals_killed  = session[animal.upper() + "_DEAD"]
            print(session)

        return render_template('animals/animal.html', animal=animal, animals_rehabilitated=animals_rehabilitated, animals_killed=animals_killed, animalText=animalText)

    else:
        return render_template('404.html')

@animals_bp.route('/habitatupdate', methods=['POST'])
def update_animal():
    info = request.get_json()
    if current_user.is_authenticated:
        result = AnimalModel().update_animals(current_user.id, info)
    else:
        update_var = info['animal'].upper()
        current_animals_rehabilitated = session.get(update_var)
        current_animals_killed = session.get(update_var + "_DEAD")


        if 'animalRehab' in info:
            update_num = info['animalRehab']
            if (current_animals_rehabilitated + 1) == update_num:
                session[update_var] = update_num
        else:
            update_var += '_DEAD'
            update_num = info['animalDead']
            if (current_animals_killed + 1) == update_num:
                session[update_var] = update_num
        
    return redirect('/')

