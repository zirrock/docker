import os
from config import db
from models import Date
from shutil import copyfile

if os.path.exists('dates.db'):
  os.remove('dates.db')
if os.path.exists('dates2.db'):
  os.remove('dates2.db')
if os.path.exists('dates3.db'):
  os.remove('dates3.db')


db.create_all()

db.session.commit()

copyfile("./dates.db", "./dates2.db")
copyfile("./dates.db", "./dates3.db")
