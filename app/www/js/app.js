
angular.module('starter', ['ionic','ngCordova','ngCordovaOauth','firebase', 'ngMask','ionic-rating-stars','ngFileUpload', 'starter.controllers', 'starter.services','yaMap',  'auth0',
  'angular-storage',
  'angular-jwt' ,'ionic-numberpicker','proton.multi-list-picker','angulartics', 'angulartics.google.analytics' ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    /*setTimeout(function() {
        navigator.splashscreen.hide();
    }, 300);
	*/
    
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.directive("limitTo", [function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
                if (this.value.length == limit) e.preventDefault();
            });
        }
    }
}])

 .config(function ($analyticsProvider) {
	        $analyticsProvider.firstPageview(true); /* Records pages that don't use $state or $route */
	        $analyticsProvider.withAutoBase(true);  /* Records full path */
	})

.config(function($stateProvider, $urlRouterProvider , authProvider,  $httpProvider,
  jwtInterceptorProvider ) {


	authProvider.init({
      domain: 'interkot.eu.auth0.com',
      clientID: 'xLCmIiHoXSM7nRpv7m50pTCUVnes8wP3',
      callbackURL: window.location.href,
      loginState: 'login',
      language: 'ru',
        auth: {
		   redirect: false,
		   sso: true
		  },
      	languageDictionary: {
              title: "Войти через социальные сети"
            },
        theme: {
          logo: 'img/logo.png',
          primaryColor: "#fff"
        }

 
    });
 
	$stateProvider
	.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'AppCtrl'
	})

	.state('login', {
		url: '/login',
		templateUrl: 'templates/login/login.html',
		controller: 'LoginCtrl'
	})

	.state('moreinfo', {
		url: '/moreinfo',
		templateUrl: 'templates/login/moreinfo.html',
		controller: 'MoreinfoCtrl'
	})

	.state('helper', {
		url: '/helper',
		templateUrl: 'templates/helper.html'
	})

	.state('app.map', {
		url: '/map',
		views: {
			'menuContent': {
				templateUrl: 'templates/map/app-map.html',
				controller: 'mapCtrl'
			}
		}
	})

	.state('app.catalogCategory', {
		url: '/catalogCategory',
		views: {
			'menuContent': {
				templateUrl: 'templates/catalog/app-catalog-category.html',
				controller: 'CatalogCategoryCtrl'
			}
		}
	})

	.state('app.catalog', {
		url: '/catalog/:id',
		views: {
			'menuContent': {
				templateUrl: 'templates/catalog/app-catalog.html',
				controller: 'CatalogCtrl'
			}
		}
	})

	.state('app.confirm', {
		url: '/confirm',
		views: {
			'menuContent': {
				templateUrl: 'templates/catalog/app-catalog-confirm.html',
				controller: 'ConfirmCtrl'
			}
		}
	})

	.state('app.catalogStuard', {
		url: '/catalogStuar/:id',
		views: {
			'menuContent': {
				templateUrl: 'templates/catalog/app-catalog-stuard.html',
				controller: 'CatalogStuardCtrl'
			}
		}
	})

	.state('app.profile', {
		url: '/profile',
		views: {
			'menuContent': {
				templateUrl: 'templates/profile/app-profile.html',
				controller: 'ProfileCtrl'
			}
		}
	})

	.state('app.editprofile', {
		url: '/editprofile',
		views: {
			'menuContent': {
				templateUrl: 'templates/profile/app-editprofile.html',
				controller: 'EditProfileCtrl'
			}
		}
	})

	.state('app.orders', {
		url: '/orders',
		views: {
			'menuContent': {
				templateUrl: 'templates/orders/app-orders.html',
				controller: 'OrdersCtrl'
			}
		}
	})

	.state('app.orderinfo', {
		url: '/orderinfo/:id',
		views: {
			'menuContent': {
				templateUrl: 'templates/orders/app-orderinfo.html',
				controller: 'OrderInfoCtrl'
			}
		}
	})

	.state('app.about', {
		url: '/about',
		views: {
			'menuContent': {
				templateUrl: 'templates/about/app-about.html',
				controller: 'AboutCtrl'
			}
		}
	})

	.state('app.faq', {
		url: '/faq',
		views: {
			'menuContent': {
				templateUrl: 'templates/about/app-faq.html',
			}
		}
	})

	.state('app.back', {
		url: '/back',
		views: {
			'menuContent': {
				templateUrl: 'templates/about/app-back.html',
			}
		}
	})

	.state('app.agree', {
		url: '/agree',
		views: {
			'menuContent': {
				templateUrl: 'templates/about/app-agree.html',
			}
		}
	})

	.state('app.route', {
		url: '/route',
		views: {
			'menuContent': {
				templateUrl: 'templates/route/app-route.html',
			}
		}
	})

	;
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/map');
});