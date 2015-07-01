var AWS = require('aws-sdk');
var fs = require('fs');
//var s3Stream = require('./node_modules/s3-upload-stream/lib/s3-upload-stream.js')(new AWS.S3());
//AWS.config.region = 'ap-northeast-1';
//AWS.config.update({accessKeyId: 'AKIAICFUNSZVN5VNR34Q', secretAccessKey: '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'});
var bucket = 'zikseeservers3';
exports.send = function(imagePath, imageName){
  var image = fs.readFileSync(imagePath);
  var s3 = new AWS.S3({params: {Bucket: bucket}});
  s3.upload({Key : imageName, Body : image}, function(err){
    if(err){
      console.log(err);
    } else {
      fs.unlink(imagePath);
    }
  });

//   var read = fs.createReadStream(imagePath);
//   var upload = s3Stream.upload({
//       Bucket: bucket,
//       Key: imageName,
//     }
//   );
//   upload.maxPartSize(20971520); // 20 MB
//   read.pipe(upload);
}

