#  coding: utf-8

from app.validator import Validator
import app.resource
from copy import deepcopy


class Resource(app.resource.Resource):

    def __init__(self, application):
        self.application = application
        self.filename = "race"
        self.resources = []
        self.load()

    def sortfunction(self, resource):
        return resource["date"]

    def api_update(self, id, **data):
        id = Validator.require_int(id)
        Validator.require(data, "name", "date", "leader_id", require_exist=False)
        resource = self.find({"id": id})
        if resource is not None:
            if "state" in data:
                resource["state"] = data["state"]
            if "name" in data:
                resource["name"] = data["name"]
            if "date" in data:
                resource["date"] = data["date"]
            if "description" in data:
                resource["description"] = data["description"]
            if "leader_id" in data:
                resource["leader_id"] = Validator.require_int(data["leader_id"])
            self.save()
            return resource

        Validator.fail_found()

    def api_create(self, **data):
        Validator.require(data, "name", "date", "leader_id")
        if "description" not in data:
            data["description"] = ""
        resource = self.create({
            "state": "PREPARE",
            "name": data["name"],
            "date": data["date"],
            "description": data["description"],
            "leader_id": Validator.require_int(data["leader_id"])
        })
        self.application.station.create({
            "name": "Station 1",
            "description": "",
            "race_id": resource["id"],
            "position": 0
        })
        self.application.station.save()
        return resource

    def append_data_to_resource(self, data):
        data["stations"] = self.application.station.findall({"race_id": data["id"]})

# EOF
