var noticeApp = angular.module('indexApp');

noticeApp.controller('MainCtrl', function($scope, $http, $window, jwtHelper, authenticationSvc){
	var date = new Date();
	var currentTime = date.getTime();
	var userInfo = authenticationSvc.getUserInfo();
	$scope.posts = [];
	$http.get("http://localhost:3000/loadPosts").success(function(data){
		for(var i = 0; i < data.length; i++){
			var postTime = Math.floor((currentTime - data[i].POST_TIME) / 60000);
			if(postTime > 60){
				postTime = Math.floor(postTime / 60);
				if(postTime < 60){
					postTime = postTime;
				}
			}
			data[i].POST_TIME = postTime;
			if(data[i].POST_EMAIL_FRAG === userInfo.emailFrag){
				$scope.posts.push(data[i]);
			}
		}
		$("#search-field").change();
	});
	$scope.submitPost = function(){
		var newPost = {
			message: $scope.postMessage,
			token: userInfo.accessToken
		};
		$http
 		.post('/newPost', newPost)
 		.success(function (data, status, headers, config) {
 			$scope.post = data.post;
 			window.location.replace("/");
 		})
 		.error(function (data, status, headers, config) {
 			alert("Post Failed, Try Again Later");
		  	window.location = "/";
 		});
		
  	};
  	$scope.modalShown = false;
    $scope.toggleModal = function() {
    	$scope.modalShown = !$scope.modalShown;
    };
});

noticeApp.filter('searchFor', function(){
	return function(arr, searchString){
		if(!searchString){
			return arr;
		}
		var result = [];
		searchString = searchString.toLowerCase();
		angular.forEach(arr, function(item){
			if(item.POST_USERNAME.toLowerCase().indexOf(searchString) !== -1){
				result.push(item);
			}
		});
		return result;
	};
});
