#  coding: utf-8

import app.resource


class VehicleCategory(app.resource.IdResource):

    fields = {
        "name": str,
        "description": str,
        "qualifying_time_s": int
    }
    defaults = {
        "description": ""
    }

    def __init__(self, application):
        self.filename = "form_vehicle_category"
        super().__init__(application)


# EOF
