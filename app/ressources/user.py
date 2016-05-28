#  coding: utf-8

import app.resource


class User(app.resource.Resource):

    fields = {
        "login": str,
        "password": str,
        "firstname": str,
        "lastname": str,
        "driver_license": bool
    }
    defaults = {
        "driver_license": True
    }

    def __init__(self, application):
        self.application = application
        self.filename = "user"
        self.resources = []
        self.load()

    def sortfunction(self, resource):
        return resource["login"]

# EOF
