import os


# returns False or filesystem path to gif
from local import CONVERT_PATH


def pngs_to_gif(png_dir, destination_file, delay):
    convert_command = 'cd ' + png_dir + ' && ' + CONVERT_PATH + ' -delay ' + str(delay) + ' -loop 0 *.png ' + destination_file
    convert_result = os.system(convert_command)
    return convert_result == 0