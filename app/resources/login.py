# coding: utf-8

from app.validator import Validator


class Login(object):
    def __init__(self, application):
        self.application = application
    exposed = True

    def POST(self, **data):
        Validator.require(data, "login", "password")
        user = self.application.user.find({"login": data["login"], "password": data["password"]})
        if user is not None:
            return self.application.user.response(user)
        Validator.fail("The username or password is wrong!")


# EOF
