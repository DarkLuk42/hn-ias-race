#  coding: utf-8

import app.resource


class VehicleCategory(app.resource.Resource):

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
        self.application = application
        self.filename = "vehicle_category"
        self.resources = []
        self.load()


# EOF
