var loginApp = angular.module('indexApp');

loginApp.controller('LoginCtrl', function($scope, $http, $window, $location, authenticationSvc){
	var email = document.getElementById('USER_EMAIL');
	var password = document.getElementById('USER_PASSWORD');
	$scope.userInfo = null;
	$scope.submit = function () {
		authenticationSvc.login(email.value, password.value)
			.then(function(result){
				$scope.userInfo = result;
				$location.path("/");
			}, function(error){
				$window.alert("Invalid Credentials");
				console.log(error);
			});
	};	
});




