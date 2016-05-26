# coding: utf-8

from app.validator import Validator
from .user import Resource as UserResource


class Resource(object):
    def __init__(self, application):
        self.application = application
    exposed = True

    def POST(self, **data):
        Validator.require(data, "login", "password")
        userresource = UserResource(self.application)
        user = userresource.find({"login": data["login"], "password": data["password"]})
        if user is not None:
            return self.application.response(user)
        Validator.fail("The username or password is wrong!")


# EOF
