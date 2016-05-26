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
            return resource

        Validator.fail_found()

    def api_create(self, **data):
        Validator.require(data, "name", "date", "leader_id")
        if "description" not in data:
            data["description"] = ""
        resource = self.create({
            "name": data["name"],
            "date": data["date"],
            "description": data["description"],
            "leader_id": Validator.require_int(data["leader_id"])
        })
        self.application.station.resources.append({
            "name": "Start",
            "description": "",
            "race_id": resource["id"],
            "position": 0
        })
        self.application.station.save()
        return resource

    def append_data_to_resource(self, data):
        data["stations"] = self.application.station.findall({"race_id": data["id"]})

# EOF
