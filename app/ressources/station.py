#  coding: utf-8

from app.validator import Validator
import app.resource


class Resource(app.resource.Resource):

    def __init__(self, application):
        self.application = application
        self.filename = "station"
        self.resources = []
        self.load()

    def sortfunction(self, resource):
        return resource["position"]

    def api_update(self, id, **data):
        id = Validator.require_int(id)
        Validator.require(data, "name", "position", "race_id")
        if "description" not in data:
            data["description"] = ""
        resource = self.find({"id": id})
        if resource is not None:
            position = Validator.require_int(data["position"])
            # race_id = Validator.require_int(data["race_id"])

            if resource["position"] != position:
                for other_resource in self.findall({"race_id": resource["race_id"]}):
                    if other_resource["position"] >= resource["position"] and other_resource != resource:
                        other_resource["position"] += 1

            resource["name"] = data["name"]
            resource["description"] = data["description"]
            resource["position"] = position
            # resource["race_id"] = race_id
            self.save()

            return resource

        Validator.fail_found()

    def api_create(self, **data):
        Validator.require(data, "name", "race_id")
        if "description" not in data:
            data["description"] = ""
        resource = self.create({
            "name": data["name"],
            "description": data["description"],
            "position": self.maxvalue("position")+1,
            "race_id": Validator.require_int(data["race_id"])
        })
        return resource

# EOF
