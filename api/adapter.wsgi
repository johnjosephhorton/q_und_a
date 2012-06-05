import sys, os, bottle

sys.path = ['/var/www/questions/api/'] + sys.path
os.chdir(os.path.dirname(__file__))

import questions

application = bottle.default_app()