const {Storage} = require('@google-cloud/storage');
const gcs = new Storage({
    projectId: process.env.PROJECT_NAME || 'tripdizer-dev',
    keyFilename: './tripdizer-service-account.json'
});

module.exports = {
    upload: function (fileName, fileContent, folder, onSuccess, onFailure) {
        if (fileContent == null || fileContent == '') {
            onSuccess();
        } else {
            const bucket = gcs.bucket(process.env.MEDIA_BUCKET_NAME || 'tripdizer-dev.appspot.com');
            const file = bucket.file(folder + "/" + fileName+".png");
            var strImage = fileContent.replace(/^data:image\/[a-z]+;base64,/, "");
            fileContent = null;
            var buf = Buffer.from(strImage, 'base64'); // Ta-da
            file.save(buf, {contentType: "auto"}, function(err) {
                strImage = null;
                if (err) {
                    console.error(err);
                    onFailure(err)
                } else {
                    onSuccess();
                }
            });
        }
    }
}