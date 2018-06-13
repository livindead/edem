angular.module('starter.controllers').controller('ConfirmCtrl', 
  ['$scope', '$state', '$location', '$ionicHistory', '$cordovaInAppBrowser', '$cordovaGeolocation', 'Dinners', 'Login', 'Stuards', '$ionicModal', 
  function($scope, $state, $location, $ionicHistory, $cordovaInAppBrowser, $cordovaGeolocation, Dinners, Login, Stuards, $ionicModal) {
    
    //refrash data for ng repeat without disabling cashe
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      console.log("State changed: ", toState);

      if ($location.path() == "/app/confirm") {
          $scope.user = Login.get();
          $scope.cart = Dinners.getItems();
          $scope.totalPrice = Dinners.getPrice();

          //Disable select stuard on map
          Stuards.selectBuyCatalog(false);
      }

    }); 

    var trackGPS = function(){

                                 var posOptions = {timeout: 10000, enableHighAccuracy: false};
                                 $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                                    var lat  = position.coords.latitude
                                    var long = position.coords.longitude
                                    console.log('Time '+lat + '   ' + long,$scope.point_adress);

                                     ymaps.route([
                                                      [ long, lat],$scope.point_adress ],{
                                                      
                                                  }).then(function (route) {
                                                        
                                                       $scope.timeElepse = route.getJamsTime()/60;
                                                       $scope.dist = route.getLength()/1000;
                                                       Dinners.setUserArrTime($scope.order_id,$scope.timeElepse).then(function(response){
                                                          console.log(response);
                                                        }).catch(function(response){
                                                          console.log(response);
                                                        });

                                                  }, function (error) {
                                                      console.err(error);
                                                  });
                                            
                                 }, function(err) {
                                    console.log(err);
                                    var geolocation = ymaps.geolocation;
                                     geolocation.get({
                                          provider: 'auto',
                                          mapStateAutoApply: true
                                     }).then(function (result) {
                                          var coor = result.geoObjects.position;
                                          console.log( coor,$scope.point_adress);
                                             ymaps.route([
                                                      coor,$scope.point_adress],{
                                                      
                                                  }).then(function (route) {
                                                        
                                                       $scope.timeElepse = Math.round(route.getJamsTime()/60);
                                                       $scope.dist = route.getLength()/1000;
                                                      
                                                        Dinners.setUserArrTime($scope.order_id,$scope.timeElepse).then(function(response){
                                                          console.log(response);
                                                        }).catch(function(response){
                                                          console.log(response);
                                                        });

                                                  }, function (error) {
                                                      console.err(error);
                                                  });     
                                          $scope.$digest();
                                      });
                                      
                                   
                                });
    }

    $scope.buyDinner = function(){
          var stuard = Stuards.get();
          console.log(stuard,"stuard");
          $scope.point_adress = stuard.point_adress
          var cart = {
              point_id: stuard.point_id,
              stuard_id: Stuards.getStuardId(),
              user_id: $scope.user["id"],
              dinner_arr: JSON.stringify($scope.cart),
              price: $scope.totalPrice
          };

          console.log(cart,"cart");
          Dinners.buy(cart).then(function(response){
              console.log(response);
              var data = response.data;
              if(data.status == 'order_success'){
                   $scope.order_id = data.pay_id;
                   
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
                            trackGPS();
                            //== tracking user
                             Dinners.setTimer( setInterval(function(){
                                  trackGPS();
                             },120000) );
                          


                            

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

      $scope.closeConfirm = function(){
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
           Stuards.selectBuyCatalog(false);
          $state.go("app.map");
      }

      $ionicModal.fromTemplateUrl('templates/catalog/app-catalog-pay.html', {
          id: "2",
          scope: $scope
      }).then(function(modal) {
         $scope.payModal = modal;
      });

      $scope.openPay = function() {
        $scope.payModal.show();
      };



}]);