from datetime import datetime
from config import db, ma

class Binds_Manager():

  bind_keys = ['sqlite1', 'sqlite2', 'sqlite3']
  bind_count = 3
  active_key = 0

  @staticmethod
  def get_active_bind():
    res = Binds_Manager.bind_keys[Binds_Manager.active_key]
    Binds_Manager.active_key += 1
    Binds_Manager.active_key %= Binds_Manager.bind_count
    return res

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

