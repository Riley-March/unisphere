var profileApp = angular.module('indexApp');

profileApp.controller('ProfileCtrl', function($scope, $http, $window, jwtHelper, authenticationSvc){
	var userInfo = authenticationSvc.getUserInfo();
	$http.post('/loadProfile', {
			id: userInfo.id
		})
		.success(function (data, status, headers, config) {
			$scope.USER_NAME = data[0].USER_NAME;
			$scope.USER_ALIAS = data[0].USER_ALIAS;
			$scope.USER_DESCRIPTION = data[0].USER_DESCRIPTION;
		})
		.error(function (data, status, headers, config) {
			alert("Could Not Load Profile");
			window.location = "/";
		});
});
