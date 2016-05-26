# coding: utf-8

import MySQLdb
import peewee


class Database(object):
    instance = None
    peeweeinstance = None

    def __init__(self):
        self.connection = MySQLdb.connect(host="localhost",
                                          user="ias",
                                          passwd="sai",
                                          db="ias")

    def __del__(self):
        self.connection.close()

    def execute(self, query, *args):
        cursor = self.connection.cursor()
        cursor.execute(query, args)
        cursor.close()

    def fetchone(self, query, *args):
        cursor = self.connection.cursor()
        cursor.execute(query, args)
        result = cursor.fetchone()
        cursor.close()
        return result

    def fetchall(self, query, *args):
        cursor = self.connection.cursor()
        cursor.execute(query, args)
        result = cursor.fetchall()
        cursor.close()
        return result

    def getconnection(self):
        return self.connection

    @staticmethod
    def getinstance():
        if Database.instance is None:
            Database.instance = Database()
        return Database.instance

    @staticmethod
    def getpeeweeinstance():
        if Database.peeweeinstance is None:
            Database.peeweeinstance = peewee.MySQLDatabase("ias", user="ias", passwd="sai")
        return Database.peeweeinstance


# EOF
