# coding: utf-8
from copy import deepcopy

from app.resource import Resource
from app.validator import Validator


class RaceEvaluation(Resource):

    exposed = True
    fields = {
        "time_s": int
    }

    def __init__(self, application):
        self.filename = "race_evaluation"
        super().__init__(application)

    def sortfunction(self, resource):
        return resource["time_s"]

    def GET(self, race_id=None, vehicle_id=None, station=None, **data):
        if station is None:
            if vehicle_id is None:
                if race_id is None:
                    return self.response(self.sort(self.findall(data)))
                race_id = Validator.require_int(race_id)
                data["race_id"] = race_id
                return self.response(self.sort(self.findall(data)))
            vehicle_id = Validator.require_int(vehicle_id)
            data["vehicle_id"] = vehicle_id
            return self.response(self.sort(self.findall(data)))
        station = Validator.require_int(station)

        resource = self.find({"race_id": race_id, "vehicle_id": vehicle_id, "station": station})

        return self.response(resource)

    def PUT(self, race_id, vehicle_id, station, **data):
        race_id = Validator.require_int(race_id)
        vehicle_id = Validator.require_int(vehicle_id)
        station = Validator.require_int(station)
        resource = self.find({"race_id": race_id, "vehicle_id": vehicle_id, "station": station})
        if resource is None:
            resource = {"race_id": race_id, "vehicle_id": vehicle_id, "station": station}
            data = Validator.validate(data, self.__class__.fields, self.__class__.defaults, require_all=True)
            self.resources.append(resource)
        else:
            data = Validator.validate(data, self.__class__.fields, self.__class__.defaults, require_all=False)
        for field in data:
            resource[field] = data[field]
        self.save()
        return self.response(resource)

    def DELETE(self, race_id, vehicle_id, station, **data):
        race_id = Validator.require_int(race_id)
        vehicle_id = Validator.require_int(vehicle_id)
        station = Validator.require_int(station)
        filter = {"race_id": race_id, "vehicle_id": vehicle_id, "station": station}
        resource = self.find(filter)
        if resource is not None:
            response = deepcopy(resource)
            self.remove(filter)
            return self.response(response)

        Validator.fail_found()

    def get_correct_station_order(self, resource):
        position = 0
        resources = self.sort(self.findall({"race_id": resource["race_id"], "vehicle_id": resource["vehicle_id"]}))
        for cmp_res in resources:
            if cmp_res["time_s"] < resource["time_s"]:
                position += 1
        return position == resource["station"]

    def prepare_response(self, resource):
        resource["correct_station_order"] = self.get_correct_station_order(resource)


# EOF
