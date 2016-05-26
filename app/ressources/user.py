#  coding: utf-8

from app.validator import Validator
import app.resource


class Resource(app.resource.Resource):

    def __init__(self, application):
        self.application = application
        self.filename = "user"
        self.resources = []
        self.load()

    def GET(self, id=None):
        if id is None:
            return self.application.response(self.resources)
        resource = self.find({"id": id})
        if resource is not None:
            return self.application.response(resource)

        Validator.fail_found()

    def PUT(self, id, **data):
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
            return self.application.response(resource)

        Validator.fail_found()

    def POST(self, **data):
        Validator.require(data, "login", "password", "firstname", "lastname")
        self.validateunique("login", data["login"], {})
        return self.application.response(self.create({
            "is_admin": False,
            "driver_license": "driver_license" in data and data["driver_license"] == "1",
            "login": data["login"],
            "password": data["password"],
            "firstname": data["firstname"],
            "lastname": data["lastname"]
        }))

    def DELETE(self, id):
        resource = self.remove({"id": id})
        if resource is not None:
            resource.delete()
            return self.application.response(resource)

        Validator.fail_found()

# EOF