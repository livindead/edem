angular.module('starter.controllers').controller('AboutCtrl', 
  ['$scope', '$stateParams', '$cordovaInAppBrowser',
  function($scope, $stateParams, $cordovaInAppBrowser) {
  
  var options = {
    location: 'yes',
    clearcache: 'yes',
    toolbar: 'no'
  };

  $scope.openBrowser = function(link) {
    $cordovaInAppBrowser.open(link, '_blank', options).then(function(event) {
      // success
      console.log(event);
    }).catch(function(event) {
      // error
      console.log(event);
    });       
  }

}]);