var unisphereApp = angular.module('unisphereApp');

unisphereApp.controller('IndexCtrl', function($scope, $http, $window, $location, $uibModal, AuthService, $localStorage){	
	$scope.clickProfile = function(){
        $scope.profileModal = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/html/modals/profileModal.html', 
            controller: 'IndexCtrl',
            scope: $scope
        });
        $http.post('/loadProfile', {token: $localStorage.user.accessToken})
            .then(function(result){
                $scope.name = result.data[0].name;
                $scope.alias = result.data[0].alias;
                $scope.description = result.data[0].description;
            }, function(error){
                console.log(error);
        });
    };
    
    $scope.update = function(){
        $scope.error = false;
        $scope.success = false;
        $scope.disabled = true;
        var user = {
            name: $scope.name,
            alias: $scope.alias,
            description: $scope.description
        };
        $http.post('/updateProfile', {token: $localStorage.user.accessToken, user: user})
            .then(function(result){
                $scope.success = true;
                $scope.successMessage = "Profile Updated";
                $scope.disabled = false;
            }).catch(function(error){
                $scope.error = true;
                $scope.errorMessage = error;
                $scope.disabled = false;
        });
    };
    
    $scope.closeProfile = function(){
        $scope.profileModal.dismiss();
    };
    
    $scope.logout = function(){
        AuthService.logout();
    };
});

