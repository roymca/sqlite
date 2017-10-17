var db = null;
 
var example = angular.module('starter', ['ionic', 'ngCordova'])
    .run(function($ionicPlatform, $cordovaSQLite) {
        $ionicPlatform.ready(function() {
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
            db = window.openDatabase("sqlite", "1.0","sqlitedemo",2000); 
            $cordovaSQLite.execute(db, "CREATE TABLE roy (id integer primary key, firstname text, lastname text)");
        });
    });
	
	example.config(function($stateProvider, $urlRouterProvider){
		$stateProvider.state('sqpage', {
			url: '/sqpage',
			templateUrl: 'templates/sqpage.html',
			controller: 'sqpageCtrl'   
		  });
		  
		$stateProvider.state('searchdata', {
			url: '/searchdata',
			templateUrl: 'templates/searchdata.html',
			controller: 'sqpageCtrl'   
		  });
		
		$urlRouterProvider.otherwise('/sqpage');
	});
	
	example.controller("sqpageCtrl", function($scope, $cordovaSQLite, $state) {
 
		//$cordovaSQLite.deleteDB("my.db");
		
		
		(function(){
			$scope.alldata = [];
			$cordovaSQLite.execute(db, "select * from roy").then (function(result){
				if (result.rows.length){
					for (var i = 0; i < result.rows.length; i++ ){
						$scope.alldata.push(result.rows.item(i));
					}
				}
				else{
					console.log("no data found");
				}
			},function(error){
				console.log("error"+err);
			});
		})()
 
		$scope.insert = function(data) {
			var res1= data.firstname;
			var fname = res1.toLowerCase();
			
			var res2 = data.lastname;
			var lname = res2.toLowerCase();
			
			var query = "INSERT INTO roy (firstname, lastname) VALUES (?,?)";
			$cordovaSQLite.execute(db, query, [fname, lname]);
			
			$scope.load();
		}
		
		
 
		$scope.load = function(){
			$scope.alldata = [];
			$cordovaSQLite.execute(db, "select * from roy").then (function(result){
				if (result.rows.length){
					for (var i = 0; i < result.rows.length; i++ ){
						$scope.alldata.push(result.rows.item(i));
					}
				}
				else{
					console.log("no data found");
				}
			},function(error){
				console.log("error"+err);
			});
			
		}
		
		$scope.show = function(data) {
			$scope.keepdata = [];
			$state.go('searchdata');
			
			console.log(data.firstname);
			console.log(data.lastname);
			
			var res1= data.firstname;
			if(res1 !== undefined){
			var fname = res1.toLowerCase();
			}
			else{
				var fname = null;
			}
			
			var res2 = data.lastname;
			if (res2 !== undefined){
				var lname = res2.toLowerCase();
			 }
			 else{
				 var lname = null;
			 }
			
			var query = "SELECT * from roy WHERE firstname = ? OR lastname = ?";
			$cordovaSQLite.execute(db, query, [fname, lname]).then (function(result){
			//$cordovaSQLite.execute(db, "select * from example WHERE firstname = ? OR lastname = ?").then (function(result){
				console.log(result);
				console.log(result.rows[0].firstname);
				console.log(result.rows[0].lastname);
				console.log(result.rows.length);
				if(result.rows.length > 0){
					for(var i = 0; i< result.rows.length; i++){
						$scope.keepdata.push(result.rows.item(i));
						console.log($scope.keepdata);
					}
				}
				alert("data is found" );
			});
		};
		
		
		
		$scope.delete = function() {
			var query = "DROP table example";
			$cordovaSQLite.execute(db, query, []);
			$scope.load();
		}
  
});