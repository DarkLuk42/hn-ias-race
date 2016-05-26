#  coding: utf-8

from app.validator import Validator
from app.database import Database
import peewee


class User(peewee.Model):
    id = peewee.PrimaryKeyField()
    is_admin = peewee.BooleanField()
    login = peewee.CharField()
    password = peewee.CharField()
    firstname = peewee.CharField()
    lastname = peewee.CharField()
    driver_license = peewee.BooleanField()
    hidden = (password,)

    class Meta:
        database = Database.getpeeweeinstance()


class Resource(object):
    def __init__(self, application):
        self.application = application

    exposed = True

    def GET(self, id):
        user = User.select().where(User.id == id).first()
        if user is not None:
            return self.application.response(user)

        Validator.fail_found()

    def PUT(self, id, **data):
        Validator.require(data, "login", "password", "firstname", "lastname")
        user = User.select().where(User.id == id).first()
        if user is not None:
            user.is_admin = False
            user.driver_license = "driver_license" in data and data["driver_license"] == "1"
            user.login = data["login"]
            user.password = data["password"]
            user.firstname = data["firstname"]
            user.lastname = data["lastname"]
            user.save()
            return self.application.response(user)

        Validator.fail_found()

    def POST(self, **data):
        Validator.require(data, "login", "password", "firstname", "lastname")
        return self.application.response(User.create(is_admin=False,
                                                     driver_license="driver_license" in data
                                                                    and data["driver_license"] == "1",
                                                     login=data["login"],
                                                     password=data["password"],
                                                     firstname=data["firstname"],
                                                     lastname=data["lastname"]))

    def DELETE(self, id):
        user = User.select().where(User.id == id).first()
        if user is not None:
            user.delete()
            return self.application.response(user)

        Validator.fail_found()

# EOF
