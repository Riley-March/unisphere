var peopleApp = angular.module('indexApp');

peopleApp.controller('PeopleCtrl', function($scope, $http, $window, jwtHelper, authenticationSvc){
	var userInfo = authenticationSvc.getUserInfo();
	$scope.profiles = [];
	$http.get("http://localhost:3000/loadProfiles").success(function(data){
		for(var i = 0; i < data.length; i++){
			if(data[i].USER_EMAIL_FRAG === userInfo.emailFrag){
				$scope.profiles.push(data[i]);
			}
			
		}
		$("#search-field").change();
	});
});

peopleApp.filter('searchFor', function(){
	return function(arr, searchString){
		if(!searchString){
			return arr;
		}
		var result = [];
		searchString = searchString.toLowerCase();
		angular.forEach(arr, function(item){
			if(item.USER_NAME.toLowerCase().indexOf(searchString) !== -1){
				result.push(item);
			}
		});
		return result;
	};
});
