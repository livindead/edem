
'use strict';
var myApp = angular.module('myApp',  ['ui.router','oitozero.ngSweetAlert','ngFileUpload'])

   .config(['$sceDelegateProvider', function($sceDelegateProvider) {
          $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://test.interkot.ru/edim-server/api/**'
          ]);
    }])

   .config(['$qProvider', function ($qProvider) {
        //$qProvider.errorOnUnhandledRejections(false);
    }])

    .filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            return input.slice(start);
        }
    })
    
    .run(function($rootScope,$location,Users) {
    
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
            var user = Users.loadUser();
            console.log(user,"user");
            if( toState.name !== 'reg'){
                if( user == undefined || user.id == undefined || user.id == ''){
                     //$location.path("/login");
                }
            }    

        });
     
    })

    .config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/login');
    
    $stateProvider
        

        .state('index', {
            url: '/index',
            views: {
                'content': {
                    templateUrl: './views/networks.html',
                    controller:'IndexCtrl'
                }   
             }
            
        }) 
        .state('login', {
            url: '/login',
            views: {
                'main-content': {
                    templateUrl: './views/login.html',
                    controller:'LoginCtrl'
                }   
            }
        })
        .state('reg', {
            url: '/reg',
            views: {
                'content': {
                    templateUrl: './views/reg.html',
                    controller:'RegCtrl'
                }   
             }
        })
        .state('profile', {
            url: '/profile',
            views: {
                'content': {
                    templateUrl: './views/profile.html',
                    controller:'ProfileCtrl'
                }   
             }
        })


        .state('statistics', {
            url: '/statistics',
            views: {
                'content': {
                    templateUrl: './views/statistics.html',
                    controller:'StatisticsCtrl'
                }   
             }
               
        })

        .state('main-new', {
            url: '/main-new',
            views: {
                'content': {
                    templateUrl: './views/networks-new.html',
                    controller:'MainNewoCtrl'
                }   
             }
               
        })

        .state('restaurant', {
            url: '/restaurant/:id?',
            views: {
                'content': {
                    templateUrl: './views/restaurant.html',
                    controller:'RestaurantCtrl'
                }   
             }
               
        })

        .state('restaurant-new', {
            url: '/restaurant-new',
            views: {
                'content': {
                    templateUrl: './views/restaurant-new.html',
                    controller:'RestaurantNewCtrl'
                }   
             }
               
        })

        .state('category', {
            url: '/category',
            views: {
                'content': {
                    templateUrl: './views/category.html',
                    controller:'CategoryCtrl'
                }   
             }
               
        })

        .state('settings', {
            url: '/settings',
            views: {
                'content': {
                    templateUrl: './views/settings.html',
                    controller:'SettingsCtrl'
                }   
             }
               
        })

        .state('notice', {
            url: '/notice',
            views: {
                'content': {
                    templateUrl: './views/notice.html',
                    controller:'NoticeCtrl'
                }   
             }
               
        })
        


        ;
        
}) ;

 
 