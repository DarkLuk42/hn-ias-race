# coding: utf-8

import json
from os import listdir
from os.path import isfile, join


class Template(object):
    def __init__(self, application):
        self.application = application
        self.templates = {}
    exposed = True

    def load(self, template_dir):
        for file in listdir(template_dir):
            abs_file = join(template_dir, file)
            if isfile(abs_file) and file[-5:] == ".html":
                with open(abs_file, "r") as f:
                    self.templates[file[:-5]] = f.read()

    def GET(self):
        self.load(self.application.application_dir + "/templates")
        return json.dumps({"templates": self.templates})


# EOF
