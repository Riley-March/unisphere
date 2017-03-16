var unisphereApp = angular.module('unisphereApp');

unisphereApp.controller('LoginCtrl', function($scope, $http, $window, $location, $uibModal, AuthService){	
	$scope.clickLogin = function(){
        $scope.loginModal = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/html/modals/loginModal.html', 
            controller: 'LoginCtrl',
            scope: $scope
        });
    };
    
    $scope.login = function(){
        $scope.error = false;
        $scope.disabled = true;
        AuthService.login($scope.form.email, $scope.form.password)
        .then(function(result){
            $location.path("/");
            $scope.disabled = false;
            $scope.loginModal.dismiss();
        }).catch(function(){
            $scope.error = true;
            $scope.errorMessage = "Invalid username and/or password";
            $scope.disabled = false;
            $scope.form = {};
        });
    }
    
    $scope.clickRegister = function(){
        $scope.registerModal = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/html/modals/registerModal.html', 
            controller: 'LoginCtrl',
            scope: $scope
        });
    };
    
	$scope.register = function(){
        $scope.error = false;
        $scope.disabled = true;
        var user = {
            email: $scope.email,
            name: $scope.name,
            alias: $scope.alias,
            description: $scope.description,
            avatar: $scope.avatar
        };
        $http.post('/addUser', user)
        .then(function (result) {
            $scope.disabled = false;
            $scope.registerModal.dismiss();
        }).catch(function (error) {
            $scope.error = true;
            $scope.errorMessage = "Email address already in use";
            $scope.disabled = false;
            $scope.form = {};
        });
	}
    
	$scope.forgotPassword = function(){
		$scope.showModal = false;
		$scope.passwordModal = !$scope.passwordModal;
		var email = document.getElementById('emailAddress');
		$scope.sendPassword = function(){
			var passwordRequest = {
				email: email.value
			};
			console.log(passwordRequest);
			$http.post('/sendPassword', passwordRequest).success(function(result){
				alert('Password Sent!');
				$scope.passwordModal = false;
				$scope.showModal = !$scope.showModal;
			}).error(function(err){
				console.log(err);
			});
		}
	}
    
    $scope.closeLogin = function(){
        $scope.loginModal.dismiss();
    }
    
    $scope.closeRegister = function(){
        $scope.registerModal.dismiss();
    }
});

