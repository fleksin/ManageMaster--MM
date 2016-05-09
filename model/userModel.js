var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
 
// Connection URL 
var url = 'mongodb://localhost:27017/test';

//get users function
var getUsers=function(callback){
	// Use connect method to connect to the Server 
	MongoClient.connect(url, function(err, db) {
		var employees = db.collection('employees');
		// find all documents 
		employees.find({}).toArray(function(err,docs){
			callback(docs);
			db.close();
		});
		
	});
}

var editUser = function(user, callback){
	var id = new ObjectId(user['_id']);
	user['_id'] = id;
	MongoClient.connect(url, function(err, db) {
		var employees = db.collection('employees');		
		employees.updateOne(
			{_id:id},		
			{$set: user},
			function(err, result){
				callback(result);
				db.close();
			}
		);		
	});
}

var deleteUser = function(ID, callback){
	var id = new ObjectId(ID);
	MongoClient.connect(url, function(err, db) {		
		var employees = db.collection('employees');		
		employees.deleteOne(
			{_id:id},		
			function(err, result){
				callback(result);
				db.close();
			}
		);		
	});
}

var addUser = function(user, callback){
	MongoClient.connect(url, function(err, db) {		
		var employees = db.collection('employees');		
		employees.insertMany(
			[user],		
			function(err, result){
				callback(result);
				db.close();
			}
		);		
	});
}

var userModel = {
	getUsers: getUsers,
	editUser: editUser,
	deleteUser: deleteUser,
	addUser: addUser
};

module.exports = userModel;