var unisphereApp = angular.module('unisphereApp');

unisphereApp.controller('EventCtrl', function($scope, $http, $window, $location, $uibModal, AuthService, $localStorage){
	$scope.events = [];
	$http.post("/loadEvents", {token: $localStorage.user.accessToken})
        .then(function(events){
            for(var i = 0; i < events.data.length; i++){
                events.data[i].time = calculateTime(events.data[i].time);
                $scope.events.push(events.data[i]);
            }
            $("#search-field").change();
        }, function (error){
            console.log(error);
    });
    
    $scope.clickEvent = function(){
        $scope.eventModal = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/html/modals/eventModal.html',
            controller: 'EventCtrl',
            scope: $scope
        });
    };
    
    $scope.createEvent = function(){
        $scope.error = false;
        $scope.disabled = true;
        console.log($scope.date);
        var event = {
            token: $localStorage.user.accessToken,
            name: $scope.name,
            description: $scope.description,
            time: Date.parse($scope.date)
        };
        $http.post('/newEvent', event)
        .then(function (result) {
            $scope.disabled = false;
            $scope.eventModal.dismiss();
        }).catch(function (error) {
            $scope.error = true;
            $scope.errorMessage = "Error creating event at this time.";
            $scope.disabled = false;
            $scope.form = {};
        });
    };
    
    $scope.closeEvent = function(){
        $scope.eventModal.dismiss();
    };
});