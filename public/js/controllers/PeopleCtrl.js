var unisphereApp = angular.module('unisphereApp');

unisphereApp.controller('PeopleCtrl', function($scope, $http, $window, AuthService, $localStorage){
	$scope.people = [];
	$http.post("/loadPeople", {token: $localStorage.user.accessToken})
        .then(function(people){
            for(var i = 0; i < people.data.length; i++){
                $scope.people.push(people.data[i]);
            }
            $("#search-field").change();
        }, function (error){
            console.log(error);
    });
});