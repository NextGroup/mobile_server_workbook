var express = require('express'),
    formidable = require('formidable'),
    fs = require('fs'),
    mysql = require('mysql');

var app = express();
var savePath = './uploads/';
var connection = mysql.createConnection({
    host        : 'localhost',
    query       : { pool : true },
    user        : 'YOUR MYSQL ID',
    password    : 'YOUR MYSQL PASSWORD',
    database    : 'nextagram',
    selectlimit : 10,
    timeout     : 40000
});

app.get('/loadData/', function(req, res) {
    console.log('ArticleNumber : ' + req.query.ArticleNumber);
    var sql = 'SELECT * FROM next_android_nextagram WHERE ArticleNumber >' + req.query.ArticleNumber;
    connection.query(sql, function(err, rows, fields){
	if(err) {
	    res.sendStatus(400);
    	    console.log('error');
	    return;
        }
	console.log(rows);
	if(rows.length == 0){
	    res.sendStatus(204);
        } else {
	    res.status(201).json(rows);
	    res.end();
	}
    });
}); 

app.post('/upload', function(req, res){

    if(!isFormData(req)){
	res.status(400).end('Bad Request: expecting multipart/form-data');
	return;
    }

    var tmpPathChanged = false;
    var body = {};
    var form = new formidable.IncomingForm();

    form.on('field', function(name, value){
        body[name] = value;
    });
    
    /*
	meaning
		Instread of receiving the file requested to save in /tmp/XXX, save it in savePath + name
	arguments
   	  	file : the file sent from the uploader
    		name : the name of file which is specified in the uploader's request
    */ 
    form.on('fileBegin', function(name, file) {
	if(body.hasOwnProperty('imgName')){
	    tmpPathChanged = true;
            file.path = savePath + body.imgName;
	} 
    });

    form.on('file', function(name, file) {
	if(!tmpPathChanged && body.hasOwnProperty('imgName')){
	    tmpPathChanged = true;
            file.path = savePath + body.imgName;
	}
    });

    form.on('end', function(fields, files){
        var sql = 'INSERT INTO next_android_nextagram ' +
    	      '(Title, WriterName, WriterID, Content, WriteDate, ImgName) ' +
    	      'VALUES(?, ?, ?, ?, ?, ?);';
        var args = [body.title, body.writerName, body.writerID, body.content, body.writeDate, body.imgName];
        connection.query(sql, args, function(err, results, fields) {
       	    if(err) {
                res.sendStatus(500);
                console.log('error');
        	return;
            }
	    console.log(results);
	    res.sendStatus(200);
        });
    });

    form.parse(req);
});

var isFormData = function(req){
    var type = req.headers['content-type'] || '';
    return 0 == type.indexOf('multipart/form-data');
}

app.get('/image/:filename', function(req, res) {

    console.log('filename : ' + req.params.filename);

    var path = savePath + req.params.filename;

    fs.exists(path, function(exists){
        if(exists){
	    var stream = fs.createReadStream(savePath + req.params.filename);
	    stream.pipe(res);
	    stream.on('close', function(){
  		res.end();
	    });
        } else {
	    res.sendStatus(204);
        }
    });
}); 

app.listen(5009);
