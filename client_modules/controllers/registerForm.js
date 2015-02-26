var registerApp = angular.module('indexApp');

registerApp.controller('RegisterCtrl', function($scope, $http, $window){
	$scope.formData = {};
	
	$scope.addUser = function(){
		var newUser = {
				email: $scope.formData.email,
				name: $scope.formData.name,
				alias: $scope.formData.alias,
				description: $scope.formData.desc,
				keycode: $scope.formData.keycode
			};
		$http
 		.post('/addUser', newUser)
 		.success(function (data, status, headers, config) {
 			$scope.keypin = data.keypin;
 		})
 		.error(function (data, status, headers, config) {
 			alert("Something went wrong. Please try again later");
		  	window.location = "/#login";
 		});
	}
	
	$scope.confirmUser = function(){
		var keypin = {
			keypin: $scope.formData.keycode,
			email: $scope.formData.email
		}
		$http
 		.post('/confirmUser', keypin)
 		.success(function (data, status, headers, config) {
 			window.location.replace("/#login");
 		})
 		.error(function (data, status, headers, config) {
 			alert("Something went wrong. Please try again later");
		  	window.location = "/#login";
 		});
	}
});
