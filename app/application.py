# coding: utf-8

import cherrypy
import json
from .validator import Validator
from app.ressources import *


class Application(object):
    def __init__(self, application_dir):
        self.application_dir = application_dir

        self.template = template.Template(self)
        self.login = login.Login(self)

        self.user = user.User(self)
        self.station = station.Station(self)
        self.race = race.Race(self)
        self.vehicle = vehicle.Vehicle(self)
        self.vehicle_category = vehicle_category.VehicleCategory(self)

    @staticmethod
    def response(data=None):
        return json.dumps(data)

    @staticmethod
    def handle_error():
        exception = cherrypy._cperror._exc_info()[1]
        message = repr(exception)
        data = {"message": message}

        cherrypy.response.status = 500
        if isinstance(exception, cherrypy.NotFound):
            cherrypy.response.status = 404
        elif isinstance(exception, Validator.ValidationFailedRequire):
            cherrypy.response.status = 400
            message = str(exception)
            data = {"message": message, "fields": exception.get_fields()}
        elif isinstance(exception, Validator.ValidationFailedFields):
            cherrypy.response.status = 400
            message = str(exception)
            data = {"message": message, "fields": exception.get_fields()}
        elif isinstance(exception, Validator.ValidationFailed):
            cherrypy.response.status = 400
            message = str(exception)
            data = {"message": message}

        cherrypy.response.body = bytes(json.dumps(data), "UTF-8")

    def default(self, *arglist, **kwargs):
        if len(arglist) == 0:
            raise cherrypy.HTTPRedirect("index.html")
        msg_s = "unbekannte Anforderung: " + \
                repr(arglist) + \
                '' + \
                repr(kwargs)
        raise cherrypy.HTTPError(404, msg_s)
    default.exposed = True


# EOF
