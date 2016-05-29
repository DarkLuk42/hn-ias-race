#!/usr/bin/env python3
# coding: utf-8

import os
import cherrypy
from app.application import Application


def main():
    # Get current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))

    cherrypy.engine.autoreload.unsubscribe()
    cherrypy.engine.timeout_monitor.unsubscribe()

    # Static content config
    root_o = cherrypy.tree.mount(Application(current_dir), '/', {
        '/': {
            'tools.staticdir.root': current_dir,
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './content',
            'tools.sessions.on': True,
            'tools.sessions.storage_type': "File",
            'tools.sessions.storage_path': './data/sessions',
            'tools.sessions.timeout': 10,
            'tools.encode.on': True,
            'tools.encode.encoding': "utf-8",
            'request.error_response': Application.handle_error,
            'request.dispatch': cherrypy.dispatch.MethodDispatcher()
        }
    })

    cherrypy.config.update({
        'server.socket_host': "0.0.0.0",
        'server.socket_port': 8081
    })

    # suppress traceback-info
    cherrypy.config.update({'request.show_tracebacks': False})
    access_log = cherrypy.log.access_log
    for handler in tuple(access_log.handlers):
        access_log.removeHandler(handler)

    # Start server
    cherrypy.engine.start()
    cherrypy.engine.block()

if __name__ == '__main__':
    main()
# EOF
