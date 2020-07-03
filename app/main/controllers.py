from flask import Blueprint, render_template
from flask_login import current_user, login_required
from app.constants.ANIMALS import ANIMALS 

main_bp = Blueprint('main', __name__)

@main_bp.route("/main", methods=["GET", "POST"])
@main_bp.route("/", methods=["GET", "POST"])
def main():
    if current_user.is_authenticated:
        # TODO: maybe in the future do zoo with no login
        # animals = ['elephant', 'giraffe', 'camel', 'lion',
        #         'alligator', 'hippo', 'kangaroo', 'monkey',
        #         'rhino', 'black bear', 'polar bear', 'flamingo']
        return render_template('main/main.html', name=current_user.name, animals=ANIMALS)
    else:
        return render_template('main/main.html', name='', animals=ANIMALS)