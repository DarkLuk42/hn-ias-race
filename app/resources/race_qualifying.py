# coding: utf-8
from copy import deepcopy

from app.resource import Resource
from app.validator import Validator


class RaceQualifying(Resource):

    exposed = True
    fields = {
        "time_s": int,
        "state": str
    }
    defaults = {
        "state": "QUALIFIED"
    }

    def __init__(self, application):
        self.filename = "race_qualifying"
        super().__init__(application)

    def sortfunction(self, resource):
        return resource["time_s"]

    def GET(self, race_id=None, vehicle_id=None, **data):
        if vehicle_id is None:
            if race_id is None:
                return self.response(self.sort(self.findall(data)))
            race_id = Validator.require_int(race_id)
            data["race_id"] = race_id
            return self.response(self.sort(self.findall(data)))
        vehicle_id = Validator.require_int(vehicle_id)

        resource = self.find({"race_id": race_id, "vehicle_id": vehicle_id})

        return self.response(resource)

    def PUT(self, race_id, vehicle_id, **data):
        race_id = Validator.require_int(race_id)
        vehicle_id = Validator.require_int(vehicle_id)
        resource = self.find({"race_id": race_id, "vehicle_id": vehicle_id})
        if resource is None:
            resource = {"race_id": race_id, "vehicle_id": vehicle_id}
            data = Validator.validate(data, self.__class__.fields, self.__class__.defaults, require_all=True)
            self.resources.append(resource)
        else:
            data = Validator.validate(data, self.__class__.fields, self.__class__.defaults, require_all=False)
        for field in data:
            resource[field] = data[field]
        self.save()
        return self.response(resource)

    def DELETE(self, race_id, vehicle_id, **data):
        race_id = Validator.require_int(race_id)
        vehicle_id = Validator.require_int(vehicle_id)
        filter = {"race_id": race_id, "vehicle_id": vehicle_id}
        resource = self.find(filter)
        if resource is not None:
            response = deepcopy(resource)
            self.remove(filter)
            return self.response(response)

        Validator.fail_found()


# EOF
