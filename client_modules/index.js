var app = angular.module('indexApp', [
	'ngRoute', 
	'ngAnimate', 
	'infinite-scroll', 
	'ngSanitize', 
	'ui.router', 
	'angular-jwt',
	'ui.bootstrap'
]);
app.config(function($stateProvider, $locationProvider, $httpProvider){
      $stateProvider
          .state('home',{
        	  url: "/",
        	  templateUrl: '/html/noticeBoard.html',
        	  controller: 'MainCtrl',
        	  resolve: {
        		  	auth: ["$q", "authenticationSvc", function($q, authenticationSvc) {
        		  		var userInfo = authenticationSvc.getUserInfo();
        		  		if(userInfo) {
        		  			return $q.when(userInfo);
        		  		}else{
        		  			return $q.reject({ authenticated: false });
        		  		}
        		    }]
        	  }
          })
          .state('people',{
        	  url: "/people",
              templateUrl: '/html/people.html',
              controller: 'PeopleCtrl',
              resolve: {
      		  	auth: ["$q", "authenticationSvc", function($q, authenticationSvc) {
      		  		var userInfo = authenticationSvc.getUserInfo();
      		  		if(userInfo) {
      		  			return $q.when(userInfo);
      		  		}else{
      		  			return $q.reject({ authenticated: false });
      		  		}
      		    }]
              }
          })
          .state('profile',{
        	  url: "/profile",
              templateUrl: '/html/profile.html',
              controller: 'ProfileCtrl',
              resolve: {
      		  	auth: ["$q", "authenticationSvc", function($q, authenticationSvc) {
      		  		var userInfo = authenticationSvc.getUserInfo();
      		  		if(userInfo) {
      		  			return $q.when(userInfo);
      		  		}else{
      		  			return $q.reject({ authenticated: false });
      		  		}
      		    }]
              }
          })
          .state('register',{
        	  url: "/register",
              templateUrl: '/html/registerForm.html',
              controller: 'RegisterCtrl',
          })
          .state('register.signup',{
        	  url: "/signup",
              templateUrl: '/html/registerSignup.html',
          })
          .state('register.confirm',{
        	  url: "/confirm",
              templateUrl: '/html/registerConfirm.html',
          })
          .state('logout', {
        	  url: "/logout",
        	  controller: 'LogoutCtrl',
        	  resolve: {
      		  	auth: ["$q", "authenticationSvc", function($q, authenticationSvc) {
      		  		var userInfo = authenticationSvc.getUserInfo();
      		  		if(userInfo) {
      		  			return $q.when(userInfo);
      		  		}else{
      		  			return $q.reject({ authenticated: false });
      		  		}
      		    }]
        	  }
          })
          .state('login',{
            	  url: "/login",
                  templateUrl: '/html/login.html',
                  controller: 'LoginCtrl',
          });
      $locationProvider.html5Mode(true);
});


app.controller('HeaderCtrl', function($scope, $window, jwtHelper, authenticationSvc){

});

app.controller('LogoutCtrl', function($scope, $window, $location, authenticationSvc){
	authenticationSvc.logout()
			.then(function (result) {
                $scope.userInfo = null;
                $location.path("/login");
            }, function (error) {
                console.log(error);
            });
});

app.run(["$rootScope", "$location", function($rootScope, $location) {
	  $rootScope.$on("$routeChangeSuccess", function(userInfo) {
		  console.log(userInfo);
	  });
	  $rootScope.$on("$routeChangeError", function(event, current, previous, eventObj) {
		  if (eventObj.authenticated === false) {
			  $location.path("/login");
		  }
	  });
}]);

app.factory("authenticationSvc", function($http, $q, $window) {
	  	var userInfo;
	  	function login(email, password) {
		    var deferred = $q.defer();
		    $http.post("/authenticate", {
		    	email: email,
		    	password: password
		    }).then(function(result) {
		    	userInfo = {
		    		accessToken: result.data.token,
		    		id: result.data.id,
		    		emailFrag: result.data.emailFrag
		    	};
		    	$window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
		    	deferred.resolve(userInfo);
		    },function(error) {
		    	deferred.reject(error);
		    });
		    	return deferred.promise; 
		 }
	  	function logout() {
	  		var deferred = $q.defer();
	  		$http({
	  			method: "POST",
	  			url: "/logout",
	  			headers: {
	  				"access_token": userInfo.accessToken
	  			}
	  		}).then(function(result) {
	  			$window.sessionStorage["userInfo"] = null;
	  			userInfo = null;
	  			deferred.resolve(result);
	  		},function(error) {
	  			deferred.reject(error);
	  		});
	  		return deferred.promise;
	  	}
	  	
	  	function getUserInfo() {
		    return userInfo;
	  	}
	  
	  	function init() {
	  		if ($window.sessionStorage["userInfo"]) {
	  			userInfo = JSON.parse($window.sessionStorage["userInfo"]);
	  		}
	  	} 
	  	init();
	  	
	  	return {
    		login: login,
    		logout: logout,
            getUserInfo: getUserInfo
	  	};
});
