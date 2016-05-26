#  coding: utf-8

from app.validator import Validator
import app.resource


class Resource(app.resource.Resource):

    def __init__(self, application):
        self.application = application
        self.filename = "user"
        self.resources = []
        self.load()

    def sortfunction(self, resource):
        return resource["login"]

    def api_update(self, id, **data):
        id = Validator.require_int(id)
        Validator.require(data, "login", "password", "firstname", "lastname")
        self.validateunique("login", data["login"], {"id": id})
        resource = self.find({"id": id})
        if resource is not None:
            resource["driver_license"] = "driver_license" in data and data["driver_license"] == "1"
            resource["login"] = data["login"]
            resource["password"] = data["password"]
            resource["firstname"] = data["firstname"]
            resource["lastname"] = data["lastname"]
            self.save()
            return resource

        Validator.fail_found()

    def api_create(self, **data):
        Validator.require(data, "login", "password", "firstname", "lastname")
        self.validateunique("login", data["login"], {})
        return self.create({
            "is_admin": False,
            "driver_license": "driver_license" in data and data["driver_license"] == "1",
            "login": data["login"],
            "password": data["password"],
            "firstname": data["firstname"],
            "lastname": data["lastname"]
        })

# EOF
