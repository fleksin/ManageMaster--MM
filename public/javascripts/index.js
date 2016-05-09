(function(){
	var server = 'http://localhost:3000/';
	var app = angular.module('myapp', ['ngRoute']);
	app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: 'table.html',
                    controller: 'userCtrl'
                }).  
				when('/edit/', {
                    templateUrl: 'edit.html',
                    controller: 'editCtrl'
                }).
				when('/create/', {
                    templateUrl: 'create.html',
                    controller: 'createCtrl'
                }).                
                otherwise({
                    redirectTo: '/'
                });
	}]);
	app.service('userModel', function($http){
		var db = [];
		var addUser = function(user, callback){
			//console.log(user);
			$http.post(server+'user', {user:user}).then(function(res){
				callback();
			});
		};
		var deleteUser =  function(id){
			$http.delete(server+'user/'+id).then(function(res){
				if(res.data.ok == 1){
					for(var i = 0; i < db.length; i++){
						if(db[i]['_id'] == id) db.splice(i,1);
					}
				}
			});
		};		
		var saveUser = function(user, callback){
			$http.put(server+'user/', {user:user}).then(function(res){			
				callback(res);
			});
		}
		var showdb = function(){console.log(angular.toJson(db));};
		var getNewId = function(){	
			var d = new Date();
			var id = Math.floor(Math.random() * d.getDate() + d.getMilliseconds());	
			return id;			
		};
		var fetchData = function(callback){
			$http.get(server+'users').then(function(res){
				db = res.data;
				callback(db);
			});
		}
		return {
			fetchData: fetchData,
			addUser: addUser,
			deleteUser: deleteUser,
			saveUser: saveUser,
			showdb:showdb,
			getNewId: getNewId,			
		};
	});
	
	app.directive("fileread", [function () {
		return {
			//transclude:true,
			scope: {
				fileread: "="  //fileread: '=fileread' // fileread='x'
			},
			link: function (scope, element, attributes) {
				element.bind("change", function (changeEvent) {
					var reader = new FileReader();
					reader.onload = function (loadEvent) {
						scope.$apply(function () {
							scope.fileread = loadEvent.target.result;
						});
					}
					reader.readAsDataURL(changeEvent.target.files[0]);
				});
				element.on('$destroy', function(){
					scope.fileread = null;
				});
			}
		}
	}]);
	
	app.directive('autoFocus', [function(){
		return{
			restrict:'A',
			link:function(scope, element, attributes){
				element.on('mouseenter', function(){					
					element.find('img').css('max-height', '40px');
				});
				element.on('mouseleave', function(){
					element.find('img').css('max-height', '20px');
				});
			}
		}
	}]);
	
	app.controller('userCtrl', function($scope, userModel, $location, $rootScope){
		userModel.fetchData(function(users){
			$scope.users = users;
		});
		$scope.showManager = function(manager){
			$scope.manager= manager;
		};
		$scope.edit = function(user){
			$rootScope.user = user;
			$location.path('/edit/');
		}		
		$scope.deleteUser = function(user){
			userModel.deleteUser(user['_id']);
		}
		$scope.createUser = function(){
			$location.path('/create/');
		}
		$scope.seeReportTo = function(user){
			$scope.manager = {
				manager:{
					_id:user['_id']
				}
			}
		}
	});
	app.controller('editCtrl', function($scope, userModel, $location){
		$scope.update = function(){
			userModel.saveUser($scope.user,function(){
				$location.path('/');
			});			
		}
	});
	
	app.controller('createCtrl', function($scope, userModel, $location){
		$scope.user={};
		$scope.create = function(){	
			userModel.addUser($scope.user, function(){
				$location.path('/');
			});			
		}		
	});
})();