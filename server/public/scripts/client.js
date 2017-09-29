var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial']);

/// Routes ///
myApp.config(function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    console.log('myApp -- config')
    $routeProvider
        .when('/home', {
            templateUrl: '/views/templates/home.html',
            controller: 'LoginController as lc',
        })
        .when('/login', {
            templateUrl: '/views/templates/login.html',
            controller: 'LoginController as lc',
        })
        .when('/register', {
            templateUrl: '/views/templates/register.html',
            controller: 'LoginController as lc'
        })
        .when('/user', {
            templateUrl: '/views/templates/user.html',
            controller: 'UserController as uc',
            resolve: {
                getuser: function(UserService) {
                    return UserService.getuser();
                }
            }
        })
        .when('/overview', {
            templateUrl: '/views/templates/overview.html',
            controller: 'LoginController as lc',
        })
        .when('/volunteerDetail', {
            templateUrl: '/views/templates/volunteerDetail.html',
            controller: 'LoginController as lc',
        })
<<<<<<< HEAD
=======
        .when('/newAdmin', {
            templateUrl: '/views/templates/newAdmin.html'
        })
>>>>>>> ccfcf5c16b2c9b532539ce3b69752c9fc63a1137
        .when('/info', {
            templateUrl: '/views/templates/info.html',
            controller: 'InfoController',
            resolve: {
                getuser: function(UserService) {
                    return UserService.getuser();
                }
            }
        })
<<<<<<< HEAD
        .when('/manageadmin', {
            templateUrl: '/views/manageadmin.html',
            controller: 'ManageAdminController as vm',
        })
        .when('/newadmin', {
            templateUrl: '/views/newadmin.html',
            controller: 'newAdminController as vm',
        })
        .when('/training', {
            templateUrl: '/views/training.html',
            controller: 'trainingController as vm',
        })
=======
>>>>>>> ccfcf5c16b2c9b532539ce3b69752c9fc63a1137
        .otherwise({
            redirectTo: 'home'
        });
});