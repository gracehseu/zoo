from flask import Flask, render_template, redirect, session
from flask_login import LoginManager
from .db import Schema

from .authentication.controllers import authentication_bp
from .authentication.models import UserModel

from .main.controllers import main_bp

from .animals.controllers import animals_bp

# from .constants import ANIMALS

app = Flask(__name__)

# configurations
app.config.from_object('config')

# set up database
db = Schema()

# login manager
login_manager = LoginManager()
login_manager.init_app(app)

# user_loader callback
@login_manager.user_loader
def load_user(user_id):
    return UserModel(user_id)

@login_manager.unauthorized_handler
def unauthorized():
    # do stuff
    return redirect('/')

# register blueprints
app.register_blueprint(authentication_bp)
app.register_blueprint(main_bp)
app.register_blueprint(animals_bp)

@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

# print(ANIMALS)

# # global ANIMALS 
# ANIMALS = ['elephant', 'giraffe', 'camel', 'lion',
#                 'alligator', 'hippo', 'kangaroo', 'monkey',
#                 'rhino', 'black_bear', 'polar_bear', 'flamingo']

# app.config.static_folder ='/static'
