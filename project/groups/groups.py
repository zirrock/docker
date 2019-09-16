from flask import make_response, abort, jsonify
from config import db
from models import Group, GroupSchema

import redis
from rq import Queue, Connection

redis_url = 'redis://redis:6379/0'

def read_all():
  groups = Group.query.order_by(Group.name)

  group_schema = GroupSchema(many=True)
  return group_schema.dump(groups)

def read_one(group_id):

  group = Group.query.filter(Group.group_id == group_id).one_or_none()

  if group is not None:
    
    group_schema = GroupSchema()
    data = group_schema.dump(group)
    return data

def read_user_groups(username):
  groups = Group.query.filter(Group.owner == username).all()

  group_schema = GroupSchema(many=True)
  return group_schema.dump(groups)

def read_subscribed_groups(username):
  print(username)
  groups = Group.query.filter(Group.user == username,  Group.owner != Group.user).all()

  group_schema = GroupSchema(many=True)
  return group_schema.dump(groups)

def create_group(group):
  
  name = group.get('name')
  user = group.get('user')
  owner = group.get('owner')

  existing_group = Group.query.filter(Group.name == name, Group.owner == owner, Group.user == user).one_or_none()

  if existing_group is None:

    if (not user == owner):
      existing_group = Group.query.filter(Group.name == name, Group.owner == owner).one_or_none()
      
      if existing_group is None:
        abort(409, 'Group {name} does not exist, so you can\'t subscribe to it'.format(name=name))

    schema = GroupSchema()
    new_group = schema.load(group, session = db.session)

    db.session.add(new_group)
    db.session.commit()

    return schema.dump(new_group), 201
  else:
    abort(409, 'Group {name} exists already'.format(name=name)) 

