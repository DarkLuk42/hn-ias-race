#  coding: utf-8

from app.validator import Validator
import app.resource


class Resource(app.resource.Resource):

    def __init__(self, application):
        self.application = application
        self.filename = "race"
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
        Validator.require(data, "name", "date", "leader_id")
        if "description" not in data:
            data["description"] = ""
        resource = self.find({"id": id})
        if resource is not None:
            resource["name"] = data["name"]
            resource["date"] = data["date"]
            resource["description"] = data["description"]
            resource["leader_id"] = Validator.require_int(data["leader_id"])
            self.save()
            return self.application.response(resource)

        Validator.fail_found()

    def POST(self, **data):
        Validator.require(data, "name", "date", "leader_id")
        if "description" not in data:
            data["description"] = ""
        resource = self.create({
            "name": data["name"],
            "date": data["date"],
            "description": data["description"],
            "leader_id": Validator.require_int(data["leader_id"])
        })
        return self.application.response(resource)

    def DELETE(self, id):
        resource = self.remove({"id": id})
        if resource is not None:
            resource.delete()
            return self.application.response(resource)

        Validator.fail_found()

# EOF
