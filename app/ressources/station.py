#  coding: utf-8

from app.validator import Validator
import app.resource


class Resource(app.resource.Resource):

    fields = {
        "name": str,
        "position": int,
        "race_id": int,
        "description": str
    }
    defaults = {
        "description": ""
    }

    def __init__(self, application):
        self.application = application
        self.filename = "station"
        self.resources = []
        self.load()

    def sortfunction(self, resource):
        return resource["position"]

    def api_update(self, id, **data):
        resource = super(Resource, self).api_update(id, **data)
        return resource

    def api_create(self, **data):
        data["position"] = self.maxvalue("position")+1
        resource = super(Resource, self).api_create(**data)
        return resource

# EOF
