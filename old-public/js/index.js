var app = angular.module('unisphereApp', [
    'ngRoute',
    'ui.router',
    'angular-jwt',
    'ui.bootstrap',
    'ngStorage'
]);

app.config(function($stateProvider, $locationProvider, $httpProvider, $urlRouterProvider){
    $stateProvider
        .state('noticePage',{
            url: "/",
            templateUrl: '/html/notice.html',
            controller: 'NoticeCtrl',
            access: {restricted: true}
        })
        .state('loginPage',{
            url: "/login",
            templateUrl: '/html/welcome.html',
            controller: 'LoginCtrl',
            access: {restricted: false}
        })
        .state('eventPage',{
                url: "/event",
                templateUrl: '/html/event.html',
                controller: 'EventCtrl',
                access: {restricted: true}
        })
        .state('peoplePage',{
            url: "/people",
            templateUrl: '/html/people.html',
            controller: 'PeopleCtrl',
            access: {restricted: true}
        });
    $locationProvider.html5Mode(true);
});

app.run(function($rootScope, $location, $route, $http, AuthService){
    $rootScope.$on('$stateChangeStart', function(event, next, current){
        AuthService.getUserStatus().then(function(){
            if(next.access.restricted && !AuthService.isLoggedIn()){
                $location.path('/login');
                $route.reload();
            }
        });
    });
});