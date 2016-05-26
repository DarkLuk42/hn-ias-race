# coding: utf-8

from app.validator import Validator
from .user import User


class Resource(object):
    def __init__(self, application):
        self.application = application
    exposed = True

    def POST(self, **data):
        Validator.require(data, "login", "password")
        user = User.select().where(User.login == data["login"], User.password == data["password"]).first()
        if user is not None:
            return self.application.response(user)
        Validator.fail("The username or password is wrong!")


# EOF
