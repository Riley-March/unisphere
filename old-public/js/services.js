var app = angular.module('unisphereApp')

app.factory('AuthService', ['$http', '$q', '$window', '$location', '$rootScope', '$localStorage', function($http, $q, $window, $location, $rootScope, $localStorage){
    var user = null;
    var userStatus = null;
    function login(email, password){
        var deferred = $q.defer();
        $http.post('/authenticate', {
            email: email,
            password: password
        }).then(function(result){
            user = {
                accessToken: result.data.token
            };
            $localStorage.user = user;
            deferred.resolve(user);
        }, function(error){
            deferred.reject(error);
        });
        return deferred.promise; 
    }
    
    function logout(){
        $http.post('/logout').then(function(result){
            $localStorage.user = null;
            userStatus = null;
            $location.path('/login');
        }, function(error){
           console.error(error.stack); 
        });
    }
    
    function isLoggedIn(){
        if(userStatus){
            return true;
        }else{
            return false;
        }
    }
    
    function getUserStatus(){
        return $http.post('/userStatus').then(function(result){
            if(result.data.user){
                userStatus = true;
                $rootScope.userLoggedIn = true;
            }else{
                userStatus = false;
                $rootScope.userLoggedIn = false;
            }
        }, function(error){
            userStatus = false;
            $rootScope.userLoggedIn = false;
        });
    }
    
    return {
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus
    };
}]);

app.filter('postSearch', function(){
	return function(arr, searchString){
		if(!searchString){
			return arr;
		}
		var result = [];
		searchString = searchString.toLowerCase();
		angular.forEach(arr, function(post){
			if(post.text.toLowerCase().indexOf(searchString) !== -1){
				result.push(post);
			}
		});
		return result;
	};
});

app.filter('eventSearch', function(){
	return function(arr, searchString){
		if(!searchString){
			return arr;
		}
		var result = [];
		searchString = searchString.toLowerCase();
		angular.forEach(arr, function(event){
			if(event.name.toLowerCase().indexOf(searchString) !== -1){
				result.push(event);
			}
		});
		return result;
	};
});

app.filter('personSearch', function(){
	return function(arr, searchString){
		if(!searchString){
			return arr;
		}
		var result = [];
		searchString = searchString.toLowerCase();
		angular.forEach(arr, function(person){
			if(person.name.toLowerCase().indexOf(searchString) !== -1){
				result.push(person);
			}
		});
		return result;
	};
});