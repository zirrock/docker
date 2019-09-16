from datetime import datetime
from config import db, ma

class Date(db.Model):
  __tablename__ = 'dates'
  date_id = db.Column(db.Integer,
                        primary_key=True)
  date = db.Column(db.String)
  name = db.Column(db.String)
  group_id = db.Column(db.String)

class DateSchema(ma.ModelSchema):
  class Meta:
    model = Date
    sqla_session = db.session

