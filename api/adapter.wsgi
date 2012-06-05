import sys, os, bottle

sys.path = ['C:/Andrew/www/project/johnhorton/questions/api/'] + sys.path
os.chdir(os.path.dirname(__file__))

import questions

application = bottle.default_app()