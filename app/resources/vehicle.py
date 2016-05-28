#  coding: utf-8

from app.validator import Validator
import app.resource


class Vehicle(app.resource.IdResource):

    fields = {
        "brand": str,
        "type": str,
        "year": int,
        "capacity_ccm": int,
        "power_kw": int,
        "category_id": int,
        "owner_id": int,
        "race_id": int,
        "description": str,
        "driver_id": int,
        "passenger_id": int,
        "mechanic_id": int
    }
    defaults = {
        "description": ""
    }

    def __init__(self, application):
        self.filename = "vehicle"
        super(self.__class__, self).__init__(application)


# EOF
