angular.module('starter.controllers').controller('OrdersCtrl', 
  ['$scope', '$ionicHistory', '$stateParams', '$location', '$stateParams', 'Orders', 'Login',
  function($scope, $ionicHistory, $stateParams, $location, $stateParams, Orders, Login) {
  
    $scope.ordersList = [];
    $scope.user = Login.get();
    $scope.show = {loader: true};
    
    Orders.getOrdersById($scope.user.id).then(function(response){
                  console.log(response.data);
                  $scope.ordersList = response.data;
                  $scope.show.loader = false;
                  angular.forEach($scope.ordersList, function(value, key) {
                    value['dinner_arr'] =  JSON.parse(value['dinner_arr']);
                    value['count_price'] =  value['dinner_arr'].length;
                  });
                  Orders.add($scope.ordersList);
              }).catch(function(response){
                  console.warn(response);
    });

    $scope.doRefresh = function(){
        Orders.getOrdersById($scope.user.id).then(function(response){
                    console.log(response.data);
                    $scope.ordersList = response.data;
                    $scope.show.loader = false;
                    angular.forEach($scope.ordersList, function(value, key) {
                      value['dinner_arr'] =  JSON.parse(value['dinner_arr']);
                      value['count_price'] =  value['dinner_arr'].length;
                    });
                    Orders.add($scope.ordersList);
                    $scope.$broadcast('scroll.refreshComplete');
                }).catch(function(response){
                    console.warn(response);
        });
    };          
    
    $scope.statusClass = function(number){
      var className = '';
      if(number == 0) className = 'red-active-order';
      if(number == 1) className = 'active-order';
      if(number == 2) className = 'active-order';
      if(number == 3) className = 'gray-archive-order';
      return className;
    }; 



     $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        console.log("State changed: ", toState);
        console.log($ionicHistory.viewHistory(),"back");
   
          if ($location.path() == "/app/orders" ) {
            if($ionicHistory.viewHistory().forwardView != null ){
              if($ionicHistory.viewHistory().forwardView.stateName != "app.orderinfo" ) {

                 $scope.user = Login.get();
                  Orders.getOrdersById($scope.user.id).then(function(response){
                      console.log(response.data);
                      $scope.ordersList = response.data;
                      $scope.show.loader = false;
                      angular.forEach($scope.ordersList, function(value, key) {
                        value['dinner_arr'] =  JSON.parse(value['dinner_arr']);
                        value['count_price'] =  value['dinner_arr'].length;
                      });
                      Orders.add($scope.ordersList);
                  }).catch(function(response){
                      console.warn(response);
                  }); 

              } else {
                    $scope.user = Login.get();
                    Orders.getOrdersById($scope.user.id).then(function(response){
                        console.log(response.data);
                        $scope.ordersList = response.data;
                        $scope.show.loader = false;
                        angular.forEach($scope.ordersList, function(value, key) {
                          value['dinner_arr'] =  JSON.parse(value['dinner_arr']);
                          value['count_price'] =  value['dinner_arr'].length;
                        });
                        Orders.add($scope.ordersList);
                    }).catch(function(response){
                        console.warn(response);
                    });
                }
            } 
          }

    }); 

     


}]);