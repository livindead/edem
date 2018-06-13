angular.module('starter.controllers').controller('CatalogStuardCtrl', 
  ['$scope', '$ionicPopup', '$stateParams', '$location', '$state', 'Dinners', 'Stuards', '$ionicModal', 'Login', 
    function($scope, $ionicPopup, $stateParams, $location, $state, Dinners, Stuards, $ionic,Modal, Login) {
    

    $scope.cart = [];
    $scope.totalPrice = 0;
    $scope.count = 0;
    $scope.user = Login.get();
    $scope.show = {loader: true};


    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      console.log("State changed: ", toState);

      if ( $location.path().search("/catalogStuar/") != "-1") {

               $scope.stuardId = $stateParams.id;
              var is_select_map = Stuards.isSelectBuyCatalog();
              
              console.log(is_select_map,"is_select_map");
              var mycart = Dinners.getItems();
              if(is_select_map == true && mycart.length > 0 ){
                  Stuards.selectStuardId($scope.stuardId);
                      Stuards.checkFood($scope.stuardId,mycart).then(function(response){
                          console.log(response);
                          if(response.data.status == false){
                            $scope.dinners = [];
                          } else {
                            $scope.show.loader = false;
                            $state.go("app.confirm");
                          }
                      }).catch(function(response){
                        console.warn(response);
                      });
                 
                  
                  
                  console.log(mycart );
                  //
              } else {
                      Stuards.getById($scope.stuardId).then(function(response){
                        $scope.phone = response.data[0].phone;
                      }).catch(function(response){
                        console.log(response)
                      });

                  Dinners.getDinnersByPointId($scope.stuardId).then(function(response){
                  $scope.dinners = response.data;
                  $scope.show.loader = false;
                  for (i = 0; i <  $scope.dinners.length; i++){
                      $scope.dinners[i]['cart_count'] = 1;
                      //!!!!!!!!!!!!!!!! REMOVE THIS !!!!!/// 
                      if($scope.dinners[i]['count'] == 0) $scope.dinners[i]['count'] = 3;
                  }
                      console.log($scope.dinners);
                  }).catch(function(res){
                      console.warn(res);
                  });

              }
      }

    }); 


           
      $scope.openNumberPicker = function(item,number) {

        $scope.MaxNumber = [];
        for(var i=1;i<=number;i++){
          $scope.MaxNumber.push(i);
        }

        var myPopup =  $ionicPopup.show({
          templateUrl: "templates/catalog/number-picker.template.html",
          scope: $scope,
          cssClass: 'number-picker-popup' 
        });

        $scope.selectNumber = function(selCount){
            console.log(item,selCount);
              if(checkCount(item,$scope.cart,selCount)){
                countCartItem(item,$scope.cart,selCount);
                $scope.totalPrice = fullPrice($scope.cart);
                $scope.count = selCount; 
              }
              
 
          myPopup.close();
        };

         

      };

     $scope.Confirm = function() {
        Stuards.getById($scope.stuardId).then(function(response){
            console.log(response);
            Stuards.selectStuard(response.data[0]);

            Stuards.selectStuardId($scope.stuardId);
            $state.go("app.confirm");
            Dinners.addItems($scope.cart);
            Dinners.addPrice($scope.totalPrice);
            $scope.cart = [];
            $scope.totalPrice = 0;
            $scope.cartShow = false;

        }).catch(function(response){
            console.err(response);
        });
 
    };

    

      $ionicModal.fromTemplateUrl('templates/catalog/app-catalog-confirm.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });


      $scope.closeConfirm = function() {
        $scope.modal.hide();
      };

      $scope.openConfirm = function() {
        $scope.modal.show();
      };



    fullPrice = function(list) {
      var price = 0;
      for (i = 0; i < list.length; i++) {
          price = price + list[i]['cart_count']*list[i]['price'];
      }
      return price;
    }


    containsObject = function(obj, list) {
      var i;
      for (i = 0; i < list.length; i++) {
          if (angular.equals(list[i], obj)) {
              list.splice(i, 1);  
              return true;
          }
      }
      return false;
    };

    containsObjectWithOutSplice = function(obj, list) {
      var i;
      for (i = 0; i < list.length; i++) {
          if (angular.equals(list[i], obj)) {
              return true;
          }
      }
      return false;
    };


    countCartItem = function(obj, list,count){
        for (i = 0; i < list.length; i++) {
            if (angular.equals(list[i], obj)) {
                 list[i]['cart_count'] = parseInt(count); 
            }
          }
    }


    checkCount = function(obj, list, count){
      var flag = false;
        for (i = 0; i < list.length; i++) {
            if (angular.equals(list[i], obj)) {
                 if( parseInt(list[i]['count']) >= parseInt(count)  ) flag = true; 
            }
          }
      return flag;    
    }
 
    $scope.counterP = function(item,count){
        count = count + 1;
        if(checkCount(item,$scope.cart,count)){
          countCartItem(item,$scope.cart,count);
          $scope.totalPrice = fullPrice($scope.cart);
          $scope.count = count;
        }
        return $scope.count;
    };
    $scope.counterM = function(item,count){
        if($scope.count > 0){
            count = count - 1;    
            if(checkCount(item,$scope.cart,count)){
              countCartItem(item,$scope.cart,count);
              $scope.totalPrice = fullPrice($scope.cart);
              $scope.count = count;
            }
        }
        return $scope.count;
    };


    $scope.addToCart = function(item){
        if($scope.count == 0)  $scope.count++;
        if(!containsObject(item,$scope.cart)){
            $scope.cart.push(item);
        } 
        if($scope.cart.length == 0){
            $scope.cartShow = false;
             count = 0;
        } else {
            $scope.cartShow = true;
        }
        var price = 0;
        $scope.totalPrice = fullPrice($scope.cart);
        $scope.totalPrice = price + $scope.totalPrice;
         
    };
    $scope.addToCartByButtons = function(item){
       // if($scope.count == 0)  $scope.count++;
        if(!containsObjectWithOutSplice(item,$scope.cart)){
            $scope.cart.push(item);
        } 
 
        if($scope.cart.length == 0){
            $scope.cartShow = false;
             count = 0;
        } else {
            $scope.cartShow = true;
        }
        var price = 0;
        $scope.totalPrice = fullPrice($scope.cart);
        $scope.totalPrice = price + $scope.totalPrice;
                console.log($scope.cart,$scope.count); 
    };

    
}]);