#  coding: utf-8

import app.resource
from app.validator import Validator


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
        super().__init__(application)

    def sortfunction(self, resource):
        return resource["login"]

    def api_create(self, **data):
        fillable = Validator.validate(data, self.__class__.fields, self.__class__.defaults)
        if self.find({"login": fillable["login"]}) is not None:
            Validator.fail('Der Benutzername ist bereits vergeben.');
        resource = self.create(fillable)
        return resource

# EOF
