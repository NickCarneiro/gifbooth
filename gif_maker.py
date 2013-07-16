from PIL import Image
import os
from images2gif import writeGif


def pngs_to_gif(png_dir):
    gif_name = png_dir.split('/').pop() + '.gif'
    print gif_name
    file_names = sorted((png for png in os.listdir(png_dir) if '.png' in png))

    images = [Image.open(png_dir + '/' + fn) for fn in file_names]

    gif_path = png_dir + '/' + gif_name
    print gif_path
    writeGif(gif_path, images, duration=0.5)

if __name__ == '__main__':
    pngs_to_gif('/Users/burt/development/gifbooth/uploads/1373942909944')

