from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired

class RegistrationForm(FlaskForm):
    name_input = StringField('Name: ', validators=[DataRequired()])
    email_input = StringField('Email: ', validators=[DataRequired()])
    password_input = PasswordField('Password: ', validators=[DataRequired()])
    submit = SubmitField('Register')

class LoginForm(FlaskForm):
    email_input = StringField('Email: ', validators=[DataRequired()])
    password_input = PasswordField('Password: ', validators=[DataRequired()])
    submit = SubmitField('submit')

class LogoutForm(FlaskForm):
    stay_logged_in = SubmitField('No, I changed my mind!')
    logout_input = SubmitField("Log me out, thanks!")