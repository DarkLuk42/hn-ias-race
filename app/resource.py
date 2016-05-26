# coding: utf-8

import json
from app.validator import *
from copy import deepcopy


class Resource(object):

    exposed = True
    hidden = []

    def __init__(self, application):
        self.application = application
        self.filename = "data"
        self.resources = []
        self.load()

    def sortfunction(self, resource):
        return resource["id"]

    def sort(self, resources):
        return sorted(resources, key=self.sortfunction)

    def load(self):
        try:
            with open(self.application.application_dir+"/data/"+self.filename+".json") as f:
                self.resources = json.load(f)
        except:
            self.save()
        self.resources = self.sort(self.resources)

    def save(self):
        with open(self.application.application_dir+"/data/"+self.filename+".json", "w") as f:
            return json.dump(self.resources, f, indent=2)

    def find(self, data, inverse=False):
        for model in self.resources:
            found = True
            for key in data:
                if model[key] != data[key]:
                    found = False
            if found != inverse:
                return model
        return None

    def findall(self, data, inverse=False):
        result = []
        for model in self.resources:
            found = True
            for key in data:
                if model[key] != data[key]:
                    found = False
            if found != inverse:
                result.append(model)
        return result

    def maxvalue(self, field):
        maxvalue = 0
        for model in self.resources:
            maxvalue = max(maxvalue, model[field])
        return maxvalue

    def create(self, data):
        data["id"] = self.maxvalue("id") + 1
        self.resources.append(data)
        self.resources = self.sort(self.resources)
        self.save()
        return data

    def remove(self, data):
        for model in self.resources:
            found = True
            for key in data:
                if model[key] != data[key]:
                    found = False
            if found:
                result = deepcopy(model)
                self.resources.remove(model)
                self.save()
                return model
        return None

    def validateunique(self, field, value, exclude):
        records = self.findall(exclude, inverse=True)
        for record in records:
            if record[field] == value:
                Validator.fail('Value '+value+' for field '+field+' is already in use.')

    def GET(self, id=None, **data):
        if id is None:
            return self.response(self.api_list(**data))
        return self.response(self.api_get(id, **data))

    def POST(self, **data):
        result = self.response(self.api_create(**data))
        self.save()
        return result

    def PUT(self, id, **data):
        result = self.response(self.api_update(id, **data))
        self.save()
        return result

    def DELETE(self, id, **data):
        result = self.response(self.api_remove(id, **data))
        self.save()
        return result

    # default api methods
    def api_get(self, id, **data):
        id = Validator.require_int(id)
        resource = self.find({"id": id})
        if resource is not None:
            return resource

        Validator.fail_found()

    def api_list(self, **data):
        return self.resources

    def api_update(self, id, **data):
        Validator.fail_found()

    def api_create(self, **data):
        Validator.fail_found()

    def api_remove(self, id, **data):
        id = Validator.require_int(id)
        resource = self.remove({"id": id})
        if resource is not None:
            return resource

        Validator.fail_found()

    def append_data_to_resource(self, data):
        pass

    def response(self, data):
        data = deepcopy(data)
        if isinstance(data, self.resources.__class__):
            for resource in data:
                self.append_data_to_resource(resource)
        else:
            self.append_data_to_resource(data)

        return self.application.response(data)


# EOF
