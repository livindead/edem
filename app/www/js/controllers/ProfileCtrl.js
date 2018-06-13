angular.module('starter.controllers').controller('ProfileCtrl', 
  ['$scope', '$state', '$location', '$stateParams', 'Login', 
  function($scope, $state, $location, $stateParams, Login) {
  $scope.user = [];
  $scope.user = Login.get();
  console.log($scope.user);

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      console.log("State changed: ", toState);
      if ($location.path() == "/app/profile") {
          $scope.user = Login.get();
          console.log($scope.user);
      }

  });

  $scope.logout = function(){
    Login.clearUser();
    Login.add("");
    $state.go("login");
  } 
  
}]);