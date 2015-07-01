var faker = require('faker');
var mysql = require('mysql')
var async = require('async');
var settings = require('../config/setting');
var db    = require('../db/handler');
    
var testSetting = {
    "MinLatitude" : 37.476909,  
    "MinLongitude" : 126.950497,
    "LatLngIncrement" : 0.001, 
    "NumOfRow" : 100, // 2,000 * 2,000 causes Out Of Memomry Error
    "NumOfCol" : 100,
    "userName" : ["김기렴","이윤재","권성민"],
    "userPenName" : ["kimkr","yiyoon","kwonsm"],
    "imageName" : ["2015033002725_0.jpg"],
    "userId" : [1238123, 1239230, 3023483],
}

exports.generate = function(){
    var startTime = new Date().getTime();
    async.waterfall([
        function(callback){
            for(var uid = 0; uid < testSetting.userId.length; ++uid){
                var data = {
                    userId    : testSetting.userId[uid],
                    userName  : testSetting.userName[uid],
                    userPenName : testSetting.userPenName[uid],
                };
                db.execute('insert', 'user')(data, function(ret){console.log(ret);});
            }
            callback();
        },
        function(callback){
            for(var rid = 0; rid < testSetting.NumOfRow; ++rid){
                for(var cid = 0; cid < testSetting.NumOfCol; ++cid){
                    var data = {
                        postUserId 	  : testSetting.userId[(rid + cid + 1) % testSetting.userId.length],
                        postText  : faker.lorem.sentence(),
                        imageName : testSetting.imageName[(rid + cid + 1) % testSetting.imageName.length],
                        postLat   : testSetting.MinLatitude + rid * testSetting.LatLngIncrement,
                        postLon   : testSetting.MinLongitude + cid * testSetting.LatLngIncrement,
                    };
                    db.execute('insert', 'post')(data, function(ret){console.log(ret);});
                }
            }
            callback();
        },
        function(callback){
            for(var rid = 0; rid < testSetting.NumOfRow; ++rid){
                for(var cid = 0; cid < testSetting.NumOfCol; ++cid){
                  console.log("comment postId : ", rid * testSetting.NumOfRow + cid);
                    var data = {
                        commentUserId    : testSetting.userId[(rid + cid + 1) % testSetting.userId.length],
                        commentPostId    : rid * testSetting.NumOfRow + cid,
                        commentText      : faker.lorem.sentence(),
                    };
                    db.execute('insert', 'comment')(data, function(ret){console.log(ret);});
                }
            }
            callback();
        },
        function(callback){
            for(var rid = 0; rid < testSetting.NumOfRow; ++rid){
                for(var cid = 0; cid < testSetting.NumOfCol; ++cid){
		    console.log("Like postId : ", rid * testSetting.NumOfRow + cid);
                    var data = {
                        userId    : testSetting.userId[(rid + cid + 1) % testSetting.userId.length],
                        postId    : rid * testSetting.NumOfRow + cid,
                    };
                    db.execute('insert', 'user_like_post')(data, function(ret){console.log(ret);});
                }
            }
            callback();
        },
    ],
    function(err, result){
	if(err){
	    console.log(err);
	} else {
	    var elapsedTime = new Date().getTime() - startTime;
            console.log("ElpasedTime : ", elapsedTime);
	}
    });
    
}
