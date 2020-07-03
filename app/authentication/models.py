from flask_login import UserMixin, login_manager
from .UserDatabaseClass import UserDBModel

class UserModel(UserMixin):

    def __init__ (self, user_id):
        self.id = user_id
        self.name = UserDBModel().get_name(user_id)

    def get_id(self):
        return self.id
