var unisphereApp = angular.module('unisphereApp');

unisphereApp.controller('NoticeCtrl', function($scope, $http, $window, AuthService, $localStorage){
	$scope.posts = [];
    $scope.comments = [{username: "Riley March", text: "first"},
                       {username: "Riley March", text: "second"},
                       {username: "Riley March", text: "third"},
                       {username: "Riley March", text: "fourth"}];
	$http.post("/loadPosts", {token: $localStorage.user.accessToken})
        .then(function(posts){
            for(var i = 0; i < posts.data.length; i++){
                posts.data[i].time = calculateTime(posts.data[i].time);
                $scope.posts.push(posts.data[i]);
            }
            $("#search-field").change();
        }, function (error){
            console.log(error);
    });
	
	$scope.submitPost = function(){
        $http.post('/newPost', {message: $scope.message, token: $localStorage.user.accessToken})
            .then(function (post) {
                post.data.time = "0s";
                $scope.posts.unshift(post.data);
                $("#postForm")[0].reset();
            }, function(error){
                console.log(error);
        });
  	};
});


