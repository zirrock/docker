from flask import make_response, abort
from config import db
from models import Date, DateSchema, Binds_Manager

def read_all():
  dates = Date.query.order_by(Date.name)

  date_schema = DateSchema(many=True)
  return date_schema.dump(dates)

def read_group_dates(group_id):
  dates = Date.query.filter(Date.group_id == group_id).all()

  date_schema = DateSchema(many=True)
  return date_schema.dump(dates)

def read_groups_dates(groups):
  dates = Date.query.filter(Date.group_id.in_(groups)).all()

  date_schema = DateSchema(many=True)
  return date_schema.dump(dates)

def create_date(date):
  name = date.get('name')
  group_id = date.get('group_id')
  date_date = date.get('date')

  existing_date = Date.query.filter(Date.name == name, Date.group_id == group_id).one_or_none()

  if existing_date is None:
    schema = DateSchema()
    new_date = schema.load(date, session = db.session)
    new_date.__bind_key__ = Binds_Manager.get_active_bind()
    print(new_date.__bind_key__)

    db.session.add(new_date)
    db.session.commit()

    return schema.dump(new_date), 201
  else:
    abort(409, 'Date {name} exists already'.format(name=name))
