import os
from config import db
from models import User

if os.path.exists('users.db'):
  os.remove('users.db')

db.create_all()

db.session.commit()
