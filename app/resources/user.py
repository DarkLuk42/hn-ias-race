#  coding: utf-8

import app.resource


class User(app.resource.IdResource):

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
        self.filename = "user"
        super(self.__class__, self).__init__(application)

    def sortfunction(self, resource):
        return resource["login"]

# EOF
