import base64
import os
from flask import Flask, render_template, request
from local import APP_PATH
from utils import return_json

app = Flask(__name__)



@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    try:
        group_timestamp = request.form['timestamp']
        base64_image = request.form['image'].replace('data:image/png;base64,', '')
        image_data = base64.b64decode(base64_image)
        # create folder for this set of images with timestamp as folder name
        batch_dir = APP_PATH + 'uploads/' + group_timestamp
        if not os.path.exists(batch_dir):
            os.mkdir(batch_dir)
        file_name = request.form['index'] + '.png'
        f = open(batch_dir + '/' + file_name, 'w')
        f.write(image_data)
        f.close()
        return return_json({'message': 'Upload successful'})
    except Exception as e:
        print e
        return return_json({'error': 'Upload failed'})

if __name__ == "__main__":
    app.debug = True
    app.run()
