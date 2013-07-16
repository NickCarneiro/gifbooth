import base64
import os
from flask import Flask, render_template, request, url_for, make_response, send_file
from gif_maker import pngs_to_gif
from local import APP_PATH
from utils import return_json, return_json_error

app = Flask(__name__)



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/gifs')
def get_gifs():
    gifs = os.listdir(APP_PATH + 'gifs/')
    gif_urls = []
    for filename in sorted(gifs):
        if '.gif' in filename:
            gif_urls.append('/gifs/' + filename)
    return return_json({'urls': gif_urls})

@app.route('/stream')
def get_stream():
    return render_template('stream.html')

@app.route('/gifs/<filename>')
def get_gif_file(filename):
    gif_path = APP_PATH + 'gifs/' + filename
    if os.path.isfile(gif_path):
        return send_file(APP_PATH + 'gifs/' + filename)
    else:
        return return_json_error({'error': 'File not found'}, 400)

@app.route('/upload', methods=['POST'])
def upload():
    try:
        #todo: sanitize this
        group_timestamp = request.form['timestamp']
        base64_image = request.form['image'].replace('data:image/png;base64,', '')
        image_data = base64.b64decode(base64_image)
        # create folder for this set of images with timestamp as folder name
        batch_dir = APP_PATH + 'uploads/' + group_timestamp
        if not os.path.exists(batch_dir):
            os.mkdir(batch_dir)
        png_index = request.form['index']
        file_name = png_index + '.png'
        f = open(batch_dir + '/' + file_name, 'w')
        f.write(image_data)
        f.close()
        response = {'message': 'Upload successful'}
        # if there are 4 files in the directory, we have gotten all the pngs
        # we need to make a gif
        if len(os.listdir(batch_dir)) == 4:
            gif_destination_file = APP_PATH + 'gifs/' + group_timestamp + '.gif'
            gif_result = pngs_to_gif(batch_dir, gif_destination_file)

            if gif_result:
                #upload image to indgur
                gif_url = '/gifs/' + group_timestamp + '.gif'
                response['gif_url'] = gif_url
        return return_json(response)
    except Exception as e:
        print e
        return return_json({'error': 'Upload failed'})

if __name__ == "__main__":
    app.debug = True
    app.run()
