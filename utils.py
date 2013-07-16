import re
from flask import make_response, jsonify


def return_json(response_object):
    if 'error' in response_object:
        code = 500
    else:
        code = 200
    return make_response(jsonify(response_object), code, {'Content-Type': 'application/json'})


def return_json_error(response_object, code=500):
    return make_response(jsonify(response_object), code, {'Content-Type': 'application/json'})


def strip_html(html):
    regex = re.compile(r'<.*?>')
    return regex.sub('', html)