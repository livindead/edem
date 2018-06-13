angular.module('starter.controllers').controller('CatalogCtrl', 
  ['$scope', '$state', '$stateParams', '$location', 'Dinners', 'Login', 'Stuards', '$ionicModal', '$ionicPopup', 
  function($scope, $state, $stateParams, $location, Dinners, Login, Stuards, $ionicModal, $ionicPopup) {
  
  $scope.cartShow = false;
  $scope.cart = [];
  $scope.totalPrice = 0;
  $scope.count = 0;
  $scope.user = Login.get();
  $scope.show = {loader: true};

  //refrash data for ng repeat without disabling cashe
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    console.log("State changed: ", toState);
    $scope.network_id = $stateParams.id;

    Dinners.getDinnersByNetworkId($scope.network_id).then(function(response){
      console.log(response);
      $scope.show.loader = false;
      $scope.dinners = response.data;
      if($scope.dinners.length > 0){
        var i = $scope.dinners.length
        while (i--){
          $scope.dinners[i]['cart_count'] = 1;
          //if( parseInt($scope.dinners[i]['count']) <= 0 ) $scope.dinners.splice(i, 1);
        }
      }
      console.log($scope.dinners);
    }).catch(function(res){
      console.warn(res);
    });
  }); 

  /*
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    console.log("State changed: ", toState);
    if ($location.path() == "/app/catalog") {
      var myCart = Dinners.getItems();
      if(myCart.length == 0){
        $scope.cartShow = false;
        $scope.cart = [];
        $scope.totalPrice = 0;
        Dinners.getDinners().then(function(response){
          $scope.show.loader = false;
          $scope.dinners = response.data;
          for (i = 0; i <  $scope.dinners.length; i++){
            $scope.dinners[i]['cart_count'] = 1;
          }
          console.log($scope.dinners);
        }).catch(function(res){
          console.warn(res);
        });
      }
    }
  });
  */

  $scope.alertOpen = function(text){

    var myPopup = $ionicPopup.show({
      template: '<img src="img/cancel-alert2.png">',
      title: 'Время приготовления данного блюда больше времени вашего прибытия к ресторану.<br>Подождете?',
      scope: $scope,
      buttons: [
        { text: 'отмена',
          type: 'button-grey'
        },
        {
          text: 'заказать',
          type: 'green-button'
        }
      ]
    });
  };

  $cope.backBtn = function(){
    Stuards.selectBuyCatalog(false);
    $state.go("app.networks-catalog");
  };

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

  $scope.selectStuardOnMap = function() {
    Stuards.selectBuyCatalog(true);
    $state.go("app.map");
    Dinners.addItems($scope.cart);
    Dinners.addPrice($scope.totalPrice);
    
    //clear 
    $scope.cart = [];
    $scope.totalPrice = 0;
    $scope.cartShow = false;
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
    console.log($scope.count);
    return $scope.count;
  };

  $scope.addToCart = function(item){
    console.log(item);
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
    //if($scope.count == 0)  $scope.count++;
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

  $scope.getOrder = function(){
    console.log($scope.cart);
  }
    
}]);