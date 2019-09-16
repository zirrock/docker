FROM python

RUN pip3 install Flask-SQLAlchemy flask-marshmallow marshmallow-sqlalchemy marshmallow connexion[swagger-ui] Redis rq

COPY . .

CMD ["python3", "server.py"]

