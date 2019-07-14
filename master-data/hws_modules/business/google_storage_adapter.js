const {Storage} = require('@google-cloud/storage');
const gcs = new Storage({
    projectId: 'tripdizer-dev',
    keyFilename: './tripdizer-dev-da0d594753eb.json'
});

module.exports = {
    upload: function (fileName, fileContent, folder, onSuccess, onFailure) {
        const bucket = gcs.bucket('tripdizer-dev.appspot.com');
        const file = bucket.file(folder + "/" + fileName+".png");
        var strImage = fileContent.replace(/^data:image\/[a-z]+;base64,/, "");
        fileContent = null;
        var buf = Buffer.from(strImage, 'base64'); // Ta-da
        file.save(buf, {contentType: "auto"}, function(err) {
            strImage = null;
            if (err) {
                console.log(err);
                onFailure(err)
            } else {
                onSuccess();
            }
        });
    }
}