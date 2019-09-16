from datetime import datetime
from config import db, ma

class Group(db.Model):
  __tablename__ = 'groups'
  group_id = db.Column(db.Integer,
                        primary_key=True)
  name = db.Column(db.String)
  user = db.Column(db.String)
  owner = db.Column(db.String)

class GroupSchema(ma.ModelSchema):
  class Meta:
    model = Group
    sqla_session = db.session

