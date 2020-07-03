from flask import Blueprint, render_template, redirect, session
from flask_login import login_required, login_user, logout_user
from .forms import *
from .models import *
from .UserDatabaseClass import *

authentication_bp = Blueprint('authentication', __name__)

@authentication_bp.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    
    if form.validate_on_submit():
        
        # adds a user into the database
        registration_success = UserDBModel().create(form.name_input.data, form.email_input.data, form.password_input.data, session)


        # able to create a new user
        if registration_success:
            session.clear()
            print("user sucessfully registered")
            return redirect('/login')

        print("user already exists")
    return render_template('authentication/register.html', form=form)

@authentication_bp.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():

        # if user has valid credentials returns user id
        # otherwise returns None

        user_id = UserDBModel().validate(form.email_input.data, form.password_input.data)

        if user_id != None:
            current_user = UserModel(user_id)
            login_user(current_user)
            
            print("user is logged in")

            return redirect('/main')

        print("user does not exist")

    return render_template('authentication/login.html', form=form)

@authentication_bp.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    form = LogoutForm()
    if form.validate_on_submit():

        if form.logout_input.data:
            logout_user()
        return redirect('/main')
    
    return render_template('authentication/logout.html', form=form)