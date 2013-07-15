from datetime import datetime
from flask import Flask, render_template, request, jsonify, make_response
from flask.ext.sqlalchemy import SQLAlchemy
from utils import return_json, strip_html

app = Flask(__name__)



@app.route("/")
def hello():
    return render_template('index.html')

if __name__ == "__main__":
    app.debug = True
    app.run()
