var express = require('express');
var router = express.Router();
var userModel = require('../model/userModel');
var multer = require('multer');
var fs = require('fs');
//var upload = multer({dest: 'public/upload/'});
var gm = require('gm');


var readImage = function(user, callback){
	var img = user.img;
	if(!img){
		console.log('no image uploaded');
		callback(user);
		return;
	}
	var regex = /^data:.+\/(.+);base64,(.*)$/;
	var matches = img.match(regex);
	var ext = matches[1];
	var data = matches[2];
	var buffer = new Buffer(data, 'base64');
	var filename = Date.now()+'.'+ext;
	var path = 'upload/'
	var imgUrl = path+filename;
	var headUrl = path+ 'sm'+filename;
	fs.writeFileSync('public/'+imgUrl, buffer);
	user.imgUrl = imgUrl;
	delete user.img;
	gm('public/'+imgUrl).resize(240)
	.write('public/'+ headUrl, function(err){
		if(err) console.log(err);
		else console.log('resize done!');
		user.headUrl = headUrl;	
		callback(user);
	});
}

/* GET home page. */
router.put('/user', function(req, res) {
	var user = req.body.user;
	//console.log(user);
	readImage(user, function(user){
		userModel.editUser(user, function(result){
			res.send(result);
		});
	});	
});

router.delete('/user/:id', function(req,res){
	var id = req.params.id;
	userModel.deleteUser(id, function(result){
		res.send(result);
	})
});

router.post('/user/', function(req,res){
	var user = req.body.user;
	readImage(user, function(user){
		userModel.addUser(user, function(result){
			res.send(result);
		});
	});
});



module.exports = router;
