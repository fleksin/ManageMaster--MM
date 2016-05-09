var express = require('express');
var router = express.Router();
var userModel = require('../model/userModel');

/* GET users listing. */
router.get('/', function(req, res) {
	userModel.getUsers(function(docs){
		res.json(docs);
	});
});

module.exports = router;
