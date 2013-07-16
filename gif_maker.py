import os


# returns False or filesystem path to gif
def pngs_to_gif(png_dir, destination_file):
    convert_command = 'cd ' + png_dir + ' && /usr/local/bin/convert -delay 100 -loop 0 *.png ' + destination_file
    convert_result = os.system(convert_command)
    return convert_result == 0


if __name__ == '__main__':
    pngs_to_gif('/Users/burt/development/gifbooth/uploads/1373942909944')

