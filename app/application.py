# coding: utf-8

import cherrypy
import json
from .validator import Validator
from app.ressources import *
from .database import Database
import peewee
from playhouse.shortcuts import model_to_dict


class Application(object):
    def __init__(self, application_dir):
        self.application_dir = application_dir
        self.db = Database()

        self.template = template.Resource(self)
        self.user = user.Resource(self)
        self.login = login.Resource(self)

    @staticmethod
    def response(data=None):
        if isinstance(data, peewee.Model):
            data = model_to_dict(data, exclude=data.hidden)
        return json.dumps(data)

    @staticmethod
    def handle_error():
        exception = cherrypy._cperror._exc_info()[1]
        message = repr(exception)

        cherrypy.response.status = 500
        if isinstance(exception, cherrypy.NotFound):
            cherrypy.response.status = 404
        elif isinstance(exception, Validator.ValidationFailed):
            cherrypy.response.status = 400
            message = str(exception)

        cherrypy.response.body = bytes(json.dumps({
            "message": message
        }), "UTF-8")

    def default(self, *arglist, **kwargs):
        if len(arglist) == 0 and len(kwargs) == 0:
            raise cherrypy.HTTPRedirect("index.html")
        msg_s = "unbekannte Anforderung: " + \
                repr(arglist) + \
                '' + \
                repr(kwargs)
        raise cherrypy.HTTPError(404, msg_s)
    default.exposed = True


# EOF
