# coding: utf-8

import cherrypy


class Validator(object):
    def __init__(self):
        pass

    @staticmethod
    def require(data, *fields, require_exist=True):
        empty_fields = list()
        for field in fields:
            if field not in data:
                if require_exist:
                    empty_fields.append(field)
            elif data[field] is None or data[field].strip() == "":
                empty_fields.append(field)
        if len(empty_fields) > 0:
            raise Validator.ValidationFailedRequire(empty_fields)

    @staticmethod
    def validate(data, fields, defaults, overwrite_data=False, require_all=True):
        response = {}
        missing_fields = []
        empty_fields = []
        wrong_formatted_fields = []

        for field in fields:
            field_type = fields[field]
            if field in data:
                if data[field] is None:
                    empty_fields.append(field)
                else:
                    try:
                        val = field_type(data[field])
                        if field_type is str:
                            if data[field].strip() == "":
                                empty_fields.append(field)
                            else:
                                response[field] = val
                        else:
                            response[field] = val
                    except ValueError:
                        wrong_formatted_fields.append(field)
            else:
                missing_fields.append(field)

        i = 0
        while i < len(missing_fields):
            missing_field = missing_fields[i]
            if missing_field in defaults:
                response[missing_field] = defaults[missing_field]
                del missing_fields[i]
            i += 1

        i = 0
        while i < len(empty_fields):
            empty_field = empty_fields[i]
            if empty_field in defaults:
                response[empty_field] = defaults[empty_field]
                del empty_fields[i]
            i += 1

        if overwrite_data:
            for field in list(data):
                del data[field]
            for field in response:
                data[field] = response[field]

        if len(wrong_formatted_fields) > 0 or len(empty_fields) > 0 or(len(missing_fields) > 0 and require_all):
            raise Validator.ValidationFailedFields(wrong_formatted_fields=wrong_formatted_fields,
                                                   empty_fields=empty_fields,
                                                   missing_fields=missing_fields)

        return response

    @staticmethod
    def require_int(strVal):
        try:
            return int(strVal)
        except ValueError:
            Validator.fail("The string '" + strVal + "' has to be a valid integer.")

    @staticmethod
    def fail(message):
        raise Validator.ValidationFailed(message)

    @staticmethod
    def fail_found(message=None):
        raise cherrypy.HTTPError(status=404, message=message)

    class ValidationFailed(Exception):
        def __init__(self, msg):
            self.msg = msg

        def __str__(self):
            return self.msg

    class ValidationFailedRequire(ValidationFailed):
        def __init__(self, required_fields):
            self.required_fields = required_fields
            self.msg = "The fields '" + "', '".join([str(field) for field in self.required_fields]) + "' are required."

        def get_fields(self):
            return self.required_fields

        def __str__(self):
            return self.msg

    class ValidationFailedFields(ValidationFailed):
        def __init__(self, wrong_formatted_fields, empty_fields, missing_fields):
            self.wrong_formatted_fields = wrong_formatted_fields
            self.empty_fields = empty_fields
            self.missing_fields = missing_fields

            wrong_formatted_str = "', '".join([str(field) for field in self.wrong_formatted_fields])
            empty_str = "', '".join([str(field) for field in self.empty_fields])
            missing_str = "', '".join([str(field) for field in self.missing_fields])

            tmp = False
            self.msg = "The fields "
            if wrong_formatted_fields:
                self.msg += "'" + wrong_formatted_str + "' are wrong formatted"
                tmp = True
            if empty_str:
                if tmp:
                    self.msg += " and "
                self.msg += "'" + empty_str + "' are empty"
                tmp = True
            if missing_str:
                if tmp:
                    self.msg += " and "
                self.msg += "'" + missing_str + "' are missing"
            self.msg += "."

        def get_fields(self):
            fields = {}
            for field in self.wrong_formatted_fields:
                fields[field] = field
            for field in self.empty_fields:
                fields[field] = field
            for field in self.missing_fields:
                fields[field] = field

            return list(fields)

        def __str__(self):
            return self.msg


# EOF
