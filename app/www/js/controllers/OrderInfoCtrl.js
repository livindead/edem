angular.module('starter.controllers').controller('OrderInfoCtrl', 
  ['$scope', '$state', '$stateParams', '$ionicPopup', '$location', '$stateParams', '$ionicHistory', '$cordovaInAppBrowser', 'Stuards', 'Orders', 'Dinners', 'Login', 
  function($scope, $state, $stateParams, $ionicPopup, $location, $stateParams, $ionicHistory, $cordovaInAppBrowser, Stuards, Orders, Dinners, Login) {
    
    $scope.orderInfo = [];
    $scope.orderId = $stateParams.id;
    $scope.orderInfo  = Orders.get($scope.orderId);
    $scope.user = Login.get();
    
    $scope.orderInfo.arrival_time = parseInt($scope.orderInfo.arrival_time);

    var Msg = function(text){
      var alertPopup = $ionicPopup.alert({
             title: '',
             okType: 'button button-full green-button',
             cssClass: 'bar-balanced',
             template: ' <div class="col"><p class="bold-text">'+text+'</p></div>'
           });
           alertPopup.then(function(res) {
              alertPopup.close();
           });

    }


    $scope.sendSMS = function(oid,sid,status){
      Dinners.clearTimer();
      Orders.sendSMSOnPoint(oid,sid,status).then(function(response){
        console.log(response);
      }).catch(function(response){
        console.warn(response);
      });
    };

    $scope.statusClass = function(number){
      if(number == 0) className = 'red-active-order';
      if(number == 1) className = 'active-order';
      if(number == 2) className = 'active-order';
      if(number == 3) className = 'gray-archive-order';
      console.log(className);
      return className;
    };

    $scope.cancelOrder = function(id){
      
       var myPopup = $ionicPopup.show({
        template: '<img src="img/cancel-alert.png">',
        title: 'Уверены, что хотите отменить заказ?',
        scope: $scope,
        buttons: [
          { text: 'нет',
            type: 'button-grey'
          },
          {
            text: 'да, отменить',
            type: 'red-button',
            onTap: function(e) {
              console.log($scope.data);
              
                Dinners.cancel(id).then(function(response){
                    Msg("Ваш заказ отменен. В ближайшее время с вами свяжеться наш менеджер !");
                    $state.go("app.orders"); 
                }).catch(function(err){
                    console.log(err);
                });
              
            }
          }
        ]
      });

          

    }; 

    $scope.repeatOrder = function(){
        
          var cart = {
              point_id: $scope.orderInfo.point_id,
              stuard_id: $scope.orderInfo.stuard_id,
              user_id: $scope.user.id,
              dinner_arr: JSON.stringify($scope.orderInfo.dinner_arr),
              price: $scope.orderInfo.price
          };

          console.log(cart,"cart");
          Dinners.buy(cart).then(function(response){
              console.log(response);
              var data = response.data;
              if(data.status == 'order_success'){
                   Dinners.pay(data.pay_id,data.pay_cost).then(function(response){
                      console.log(response);
                      var data = response.data;
                      if(data.status == "payment_success"){
                           var options = {
                              location: 'yes',
                              clearcache: 'yes',
                              toolbar: 'no'
                            };
                          $cordovaInAppBrowser.open(data.url, '_blank', options).then(function(event) {
                             console.log(event);
                          }).catch(function(event) {
                             console.log(event);
                          });
                          Stuards.selectBuyCatalog(false);
                          Dinners.addItems([]);
                          $ionicHistory.nextViewOptions({
                                historyRoot: true
                           });
                          $state.go('app.orders');
                      }
                    }).catch(function(err){
                        alert(err);
                    });
              }
          }).catch(function(err){
              console.log(err);
          });

    };

  $scope.openNavi = function(val){
        launchnavigator.navigate('Москва,'+val);
  }

    console.log($scope.orderId);
     $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
   
        console.log($location.path().search("/orderinfo/"));
          if ( $location.path().search("/orderinfo/") != "-1") {
              $scope.orderInfo  = Orders.get($scope.orderId);
              console.log(Orders.get($scope.orderId));
          }
    }); 

}]);