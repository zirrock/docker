import os
from config import db
from models import Date

if os.path.exists('dates.db'):
  os.remove('dates.db')

db.create_all()

db.session.commit()
