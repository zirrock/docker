import os
from config import db
from models import Group

if os.path.exists('groups.db'):
  os.remove('groups.db')

db.create_all()

db.session.commit()
