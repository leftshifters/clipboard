var db = require('./lib/db');
var Jimp = require('jimp');
var thumbsDir = '/public/thumbs';
var path = require('path');
var async = require('async');
var fs = require('fs');
var query = {
  type: 'image'
};

var limit = 200;
var page = 0;

db.fetchItemByQuery(query, limit, page, function(err, results) {
  if(err) {
    console.error(err);
    process.exit(1);
  }

  console.log(results);

  async.series(results.map(function(item) {
    return function(cb) {
      var thumbname = item.basenameWithoutExt + '-thumb' + item.extension;
      var thumbUploadDir = path.join(process.cwd(), thumbsDir);

      fs.access(path.join(process.cwd(), item.relativePathLong), function(err) {
        if(err) {
          return cb(null);
        }

        Jimp.read(path.join(process.cwd(), item.relativePathLong)).then(function (img) {
          fs.access(thumbUploadDir + '/' + thumbname, function(err) {
            console.log(err);
            if(!err) {
              console.log('Image exist');
              cb(null);
            }

            img
              .resize(250, Jimp.AUTO)
              .write(thumbUploadDir + '/' + thumbname, function(err) {
                if(err) {
                  console.error(err);
                  cb(null);
                }
                item.relativeThumbPathShort = 'thumbs/' + thumbname;
                item.relativeThumbPathLong = thumbsDir + '/' + thumbname;

                db.updateItemThumb(item, function(err) {
                  if(err) {
                    return cb(err);
                  }
                  console.log('done with id ' + item._id + 'with thumb path ' + thumbname);
                  cb(null);
                });
              });
            }).catch(function (err) {
              console.log(err);
              cb(null);
            });
          });
      });
    };
  }), function(err) {
    if(err) {
      console.error(err);
      process.exit(1);
    }

    console.log('Successfully Done');
    process.exit(0);
  });
});
