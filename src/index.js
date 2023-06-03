
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


const feed_url = 'https://media.rss.com/altdorf-historical-society/feed.xml'




const getFeed = async () => {
  return await parser.parseURL(feed_url);
}

const convertFeedItems = async (items) => {
  console.log("[convertFeedItems]", items.length)
  for (const { enclosure, itunes, title, contentSnippet, ...rest } of
    items
      .filter((e, i) => i < 1)
  ) {
    console.log("[convertFeedItems]", title, contentSnippet)


    let filename = `./${title}.mp4`
    let dirOut = `./out/${title}.mp4`
    // check if file already exists in directory
    console.log(itunes.image, enclosure.url)

    const x = new ffmpeg()
      .input(itunes.image)
      .addInputOption('-framerate 1')
      .loop()
      .input(enclosure.url)
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions([
        // '-preset medium',
        // '-tune stillimage',
        // '-crf 35',
        // '-crf 18',
        // '-pix_fmt yuv420p',
        // '-shortest'
        '-ar 48000'
      ])
      .on('progress', function (progress) {
        console.log(title, 'Processing: ' + progress.percent  + '% done',progress);

      })
      .on('end', function () {
        console.log(title, 'file has been converted succesfully');
      })
      .on('error', function (err) {
        console.log('an error happened: ' + err.message);
      })
      // .format('mp4')
      // .output(orderFolder + '/output.mp4')
      .save(dirOut);

    console.log("started")


    continue
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
        console.log(title, 'Processing: ' + progress.percent + '% done');
      })
      .on('end', function () {
        console.log(title, 'file has been converted succesfully');
      })
      .on('error', function (err) {
        console.log('an error happened: ' + err.message);
      })
      .format('mp4')
      .saveToFile(filename);
    console.log(ff)
  }
}


async function run() {


  const feed = await getFeed();
  const items = feed.items;
  const converted = await convertFeedItems(items);

}



run()

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