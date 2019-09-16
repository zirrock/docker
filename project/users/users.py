from flask import make_response, abort
from config import db
from models import User, UserSchema

def read_all():
  users = User.query.order_by(User.username).all()

  user_schema = UserSchema(many=True)
  return user_schema.dump(users)

def read_one(username):
  user = User.query.filter(User.username == username).one_or_none()
  
  if user is not None:
    user_schema = UserSchema()
    return user_schema.dump(user)
  else:
    abort(404, 'User not found for username: {username}'.format(username=username))

def read_one_by_id(user_id):
  user = User.query.filter(User.person_id == user_id).one_or_none()
  
  if user is not None:
    user_schema = UserSchema()
    return user_schema.dump(user)
  else:
    abort(404, 'User not found for Id: {user_id}'.format(user_id=user_id))

def create(user):
  username = user.get('username')
  password = user.get('password')
  salt = user.get('salt')

  existing_user = User.query.filter(User.username == username).one_or_none()
  
  if existing_user is None:

    schema = UserSchema()
    new_user = schema.load(user, session = db.session)

    db.session.add(new_user)
    db.session.commit()

    return schema.dump(new_user), 201
  else:
    abort(409, 'User {username} exists already'.format(username=username)) 
