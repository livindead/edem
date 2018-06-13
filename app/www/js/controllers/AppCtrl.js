angular.module('starter.controllers').controller('AppCtrl', 
  ['$scope', '$ionicModal','$timeout','$ionicPlatform','$state','Login',
  function($scope, $ionicModal, $timeout,$ionicPlatform,$state, Login) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  console.log("data login");
  var user = Login.loadUser();
  $scope.is_login = false;

  $scope.$watch(function () { 
      var user = Login.loadUser();
      if( user != null && user != "" ){
             //console.log(user);
             $scope.is_login = true;
      } else {
          $scope.is_login = false;
      }
          
    }, function (value) {
              //$scope.user = value;
  });

  if( user != null && user != "" ){
       console.log(user);
       Login.add(user);
       $scope.is_login = true;
   
  } else {
        $scope.is_login = false;
        $ionicPlatform.ready(function() {
            //navigator.splashscreen.hide();
        });
        
        
        
  }

  document.addEventListener('deviceready', function () {
    cordova.plugins.backgroundMode.setDefaults({ silent: true });
    cordova.plugins.backgroundMode.enable();

 
  });

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '210023296263064',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.0'
    });
      
    FB.AppEvents.logPageView();   
      
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
  

}]);