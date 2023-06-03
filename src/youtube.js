export function uploadVideo(auth, title, description, tags) {
    const service = google.youtube('v3')

    service.videos.insert({
        auth: auth,
        part: 'snippet,status',
        requestBody: {
            snippet: {
                title,
                description,
                tags,
                categoryId: categoryIds.ScienceTechnology,
                defaultLanguage: 'en',
                defaultAudioLanguage: 'en'
            },
            status: {
                privacyStatus: "private"
            },
        },
        media: {
            body: fs.createReadStream(videoFilePath),
        },
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        console.log(response.data)

        console.log('Video uploaded. Uploading the thumbnail now.')
        service.thumbnails.set({
            auth: auth,
            videoId: response.data.id,
            media: {
                body: fs.createReadStream(thumbFilePath)
            },
        }, function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            console.log(response.data)
        })
    });
}
