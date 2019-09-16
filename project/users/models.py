from datetime import datetime
from config import db, ma

class User(db.Model):
  __tablename__ = 'users'
  person_id = db.Column(db.Integer,
                        primary_key=True)
  username = db.Column(db.String)
  password = db.Column(db.String)
  salt = db.Column(db.String)

class UserSchema(ma.ModelSchema):
  class Meta:
    model = User
    sqla_session = db.session

