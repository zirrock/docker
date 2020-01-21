import os
import connexion
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

basedir = os.path.abspath(os.path.dirname(__file__))

connex_app = connexion.App(__name__, specification_dir=basedir)

app = connex_app.app

sqlite_url1 = "sqlite:////" + os.path.join(basedir, "dates.db")
sqlite_url2 = "sqlite:////" + os.path.join(basedir, "dates2.db")
sqlite_url3 = "sqlite:////" + os.path.join(basedir, "dates3.db")

app.config['SQLALCHEMY_ECHO'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = sqlite_url1
app.config['SQLALCHEMY_BINDS'] = {
    'sqlite1':	sqlite_url1,
    'sqlite2':	sqlite_url2,
    'sqlite3':	sqlite_url3
}
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

ma = Marshmallow(app)
