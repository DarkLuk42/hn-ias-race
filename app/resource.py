# coding: utf-8

import json
from app.validator import *


class Resource(object):

    exposed = True
    hidden = []

    def __init__(self, application):
        self.application = application
        self.filename = "todo"
        self.resources = []
        self.load()

    def load(self):
        try:
            with open(self.application.application_dir+"/data/"+self.filename+".json") as f:
                self.resources = json.load(f)
        except:
            self.save()

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
        self.save()
        return data

    def remove(self, data):
        for model in self.resources:
            found = True
            for key in data:
                if model[key] != data[key]:
                    found = False
            if found:
                self.resources.remove(model)
                self.save()
                return model
        return None

    def validateunique(self, field, value, exclude):
        records = self.findall(exclude, inverse=True)
        for record in records:
            if record[field] == value:
                Validator.fail('Value '+value+' for field '+field+' is already in use.')


# EOF
