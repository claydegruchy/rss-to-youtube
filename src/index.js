
// const ffmpeg = require('fluent-ffmpeg');
// const ffmpeg_static = require('ffmpeg-static');
// as import:
import ffmpeg from 'fluent-ffmpeg';
import ffmpeg_static from 'ffmpeg-static';


// import fs
import fs from 'fs';


// get the rss feed
// as import:
import Parser from 'rss-parser';
const parser = new Parser();







const getFeed = async () => {
  return await parser.parseURL(feed_url);
}

const convertFeedItems = async (items) => {
  for (const { enclosure, itunes, title, contentSnippet, ...rest } of
    items.filter((e, i) => i < 1)) {
    // console.log(enclosure.url, itunes.image);
    // get the buffer from the response
    // console.log(mp3_buffer)
    // console.log(image)
    const ff = new ffmpeg({ source: enclosure.url })

      // .videoCodec('libvpx') //libvpx-vp9 could be used too
      .addOptions(
        '-loop 1',
        // '-i '+itunes.image, '-i '+enclosure.url, '-shortest -acodec copy', '-vcodec mjpeg'
      )
      .addInput(itunes.image)
      .addOptions(
        '-c:v libx264',
        // '-tune stillimage',
        // '-c:a aac',
        // '-b:a 192k',
        // '-shortest',
      )
      .on('progress', function (progress) {
        console.log('Processing: ' + progress.percent + '% done');
      })
      .on('end', function () {
        console.log('file has been converted succesfully');
      })
      .on('error', function (err) {
        console.log('an error happened: ' + err.message);
      })
      .format('mp4')
      .saveToFile(`./${title}.mp4`);
    console.log(ff)
  }
}

getFeed()



// set up youtube credentials
import { google } from 'googleapis';
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});


function promisifyCommand(command) {
  return new Promise((resolve, reject) => {
    command.on('end', resolve).on('error', reject).run();
  });
}


export const entry = (req, res) => {
  res.send({ "message": "Hello World!" });
};