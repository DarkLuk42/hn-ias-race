#  coding: utf-8

from app.validator import Validator
import app.resource


class Resource(app.resource.Resource):

    def __init__(self, application):
        self.application = application
        self.filename = "vehicle"
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
        Validator.require(data, "brand", "type", "year", "capacity_ccm", "power_kw", "category_id", "owner_id",
                          "driver_id", "passenger_id", "mechanic_id")

        if "description" not in data:
            data["description"] = ""
        resource = self.find({"id": id})
        if resource is not None:
            resource["brand"] = data["brand"]
            resource["type"] = data["type"]
            resource["description"] = data["description"]
            resource["year"] = Validator.require_int(data["year"])
            resource["capacity_ccm"] = Validator.require_int(data["capacity_ccm"])
            resource["power_kw"] = Validator.require_int(data["power_kw"])
            resource["category_id"] = Validator.require_int(data["category_id"])
            resource["owner_id"] = Validator.require_int(data["owner_id"])
            resource["driver_id"] = Validator.require_int(data["driver_id"])
            resource["passenger_id"] = Validator.require_int(data["passenger_id"])
            resource["mechanic_id"] = Validator.require_int(data["mechanic_id"])
            self.save()
            return self.application.response(resource)

        Validator.fail_found()

    def POST(self, **data):
        Validator.require(data, "brand", "type", "year", "capacity_ccm", "power_kw", "category_id", "owner_id",
                          "driver_id", "passenger_id", "mechanic_id")
        if "description" not in data:
            data["description"] = ""
        resource = self.create({
            "brand": data["brand"], "type": data["type"], "description": data["description"],
            "year": Validator.require_int(data["year"]),
            "capacity_ccm": Validator.require_int(data["capacity_ccm"]),
            "power_kw": Validator.require_int(data["power_kw"]),
            "category_id": Validator.require_int(data["category_id"]),
            "owner_id": Validator.require_int(data["owner_id"]),
            "driver_id": Validator.require_int(data["driver_id"]),
            "passenger_id": Validator.require_int(data["passenger_id"]),
            "mechanic_id": Validator.require_int(data["mechanic_id"])
        })
        return self.application.response(resource)

    def DELETE(self, id):
        resource = self.remove({"id": id})
        if resource is not None:
            resource.delete()
            return self.application.response(resource)

        Validator.fail_found()

# EOF
