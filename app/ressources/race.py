#  coding: utf-8

from app.validator import Validator
import app.resource
from copy import deepcopy


class Resource(app.resource.Resource):

    fields = {
        "name": str,
        "date": str,
        "leader_id": int,
        "state": str,
        "description": str
    }
    defaults = {
        "description": ""
    }

    def __init__(self, application):
        self.application = application
        self.filename = "race"
        self.resources = []
        self.load()

    def sortfunction(self, resource):
        return resource["date"]

    def api_update(self, id, **data):
        resource = super(Resource, self).api_update(id, **data)
        self.sync_stations(resource, data)
        return resource

    def api_create(self, **data):
        data["state"] = "PREPARE"
        resource = super(Resource, self).api_create(**data)
        self.sync_stations(resource, data)
        return resource

    def sync_stations(self, resource, data):
        stations = self.application.station.findall({"race_id": resource["id"]})

        if "stations[]name[]" in data:
            stations = []
            for i in range(0, len(data["stations[]name[]"])):
                station = {
                    "name": data["stations[]name[]"][i],
                    "description": data["stations[]description[]"][i],
                    "race_id": resource["id"],
                    "position": i
                }
                stations.append(station)

        if len(stations) == 0:
            stations.append({
                "name": "Station 1",
                "description": "",
                "race_id": resource["id"],
                "position": 0
            })

        self.application.station.removeall({"race_id": resource["id"]})

        for station in stations:
            self.application.station.create(station)

        self.application.station.save()

    def prepare_response(self, resource):
        resource["stations"] = self.application.station.findall({"race_id": resource["id"]})

# EOF
