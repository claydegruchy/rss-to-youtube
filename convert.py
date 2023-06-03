import feedparser
import os
import urllib.request
import re


def striphtml(data):
    p = re.compile(r'<.*?>')
    return p.sub('', data)


def show_progress(block_num, block_size, total_size):
    print("[Download]", "Downloading", block_num*block_size, "of", total_size)


# open the rss feed
feed = feedparser.parse(
    "https://media.rss.com/altdorf-historical-society/feed.xml")

working_dir = 'working_dir/'
output_dir = 'out/'

if not os.path.exists(working_dir):
    os.makedirs(working_dir)

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

def download(url, title, type):
    print("[Download]", "Downloading " + title)
    # check if file exists, if not download it
    dest = working_dir + title + "."+type
    if not os.path.exists(dest):
        req = urllib.request.urlretrieve(url, dest, show_progress)
        # show progress of req
        return dest
    else:
        print("[Download]", "File already exists", title)
        return dest


def convert(audio_file, image_file, completed_file):
    print("[Convert]", "Converting", completed_file)
    if not os.path.exists(completed_file):
        command = 'ffmpeg -loop 1 -framerate 2 -i "{}" -i "{}" -c:v libx264 -preset medium -tune stillimage -crf 18 -c:a copy -shortest -pix_fmt yuv420p "{}"'.format(
            image_file, audio_file, completed_file)
        print("[Convert]", command)
        os.system(command)
    else:
        print("[Convert]", "File already exists", completed_file)


for entry in feed["entries"]:
    title = entry["title"]
    # find in the links the one that has the mp3
    image_url = entry["image"]['href']
    for link in entry["links"]:
        if link["type"] == "audio/mpeg":
            audio_url = link["href"]
            break

    audio_file = download(audio_url, title, "mp3")
    image_file = download(image_url, title, "jpg")
    completed_file = output_dir + title + ".mkv"
    convert(audio_file, image_file, completed_file)


for entry in feed["entries"]:
    print("=========================================")
    title = entry["title"]
    summary = striphtml(entry['summary'])

    print("[Title]:", "\n"+title)
    print("[Summary]:", "\n"+summary)
