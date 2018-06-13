angular.module('starter.controllers').controller('mapCtrl', 
  ['$scope', '$state', 'Stuards', 'Dinners', 'Orders', '$ionicModal', '$location', '$ionicPopup', '$ionicHistory', '$cordovaGeolocation','$timeout','$cordovaInAppBrowser','Dinners', 'Login', 
  function($scope, $state, Stuards, Dinners, Orders, $ionicModal, $location, $ionicPopup, $ionicHistory, $cordovaGeolocation,$timeout,$cordovaInAppBrowser, Dinners, Login) {
  

  $scope.route = [];
  $scope.show = {
    userRoute : true,
    searchHide : true,
    searchHideRoute : true,
    searcResult : false,
    raiting: false,
    selectPointOnMap: false
  };
  $scope.show2 = {loader: true};
  $scope.showPanelInfo = false;
  $scope.searchStuard = [];
  $scope.stuards = [];
  $scope.cartShow = false;
  $scope.saleBtnActiv = true;
  $scope.cart = [];
  $scope.saleId = 0;
  $scope.totalPrice = 0;
  $scope.food_delivery_time = 0;
  $scope.isMoreTimeElepse = false;
  $scope.count = 0;
  $scope.showUserRoutes = true;
  $scope.isRouteTabSelect = 0;
  $scope.isHelper = false;
  $scope.point = {a:'',b:''};

  $scope.userPosition = [37.632134,55.752577];
  $scope.isFoodFilter = {state:false,name:""};
  $scope.user = Login.get();
  $scope.favorites = Login.getFavorites();
  $scope.myPoints = Login.getMyPoints();
  $scope.MyPointHistory = Login.getMyRoutsHistory();

  var myPlacemark;

  if($scope.favorites == null) $scope.favorites = [];
  if($scope.myPoints == null) $scope.myPoints = [];
  if($scope.MyPointHistory == null) $scope.MyPointHistory = [];

  var state = Login.getInfoState();
  if (state == null || state == "" || state == false || state == 'false') {
    $scope.isHelper = true;       
    Login.setInfoState(true);
    console.log("go helper ");
  } 

  var alertPopup = function(str){
      var alertPopup = $ionicPopup.alert({
                  title: 'Скидка активна',
                  okType: 'button button-full green-button',
                  cssClass: 'bar-balanced',
                  template: ' <div class="col"><p class="bold-text">'+str+'</p></div>'
            });
  }

  $ionicModal.fromTemplateUrl('templates/route/app-route.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeRoute = function() {
    $scope.modal.hide();
  };

  $scope.routeChoose = function() {
    $scope.modal.show();
    $scope.getMyLocation();
  };

  $ionicModal.fromTemplateUrl('templates/catalog/app-catalog-category.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalCat = modal;
  });

  $scope.categoryClose = function() {
    $scope.modalCat.hide();
  };

  $scope.categoryOpen = function() {
    $scope.modalCat.show();
  };

  $ionicModal.fromTemplateUrl('templates/map/app-rate-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalRate = modal;
  });

  $scope.rateClose = function() {
    $scope.modalRate.hide();
  };

  $scope.rateOpen = function() {
    $scope.modalRate.show();
  };

  $ionicModal.fromTemplateUrl('templates/catalog/app-catalog-menu.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalMenu = modal;
  });

  $scope.cancelRest = function() {
    $scope.modalMenu.hide();
  };

  $scope.setRest = function(id,pid,title,adress,img,menu_dinners_status) {
    //console.log(pid,title,adress,img);
    $scope.rest_title = title;
    $scope.rest_adress = "Москва, "+adress;
    $scope.rest_img = img;
    $scope.menu_dinners_status = menu_dinners_status;
    $scope.panel_pointId = pid;
    $scope.rest_id = id;
    $scope.modalMenu.show();

    $scope.cart = [];
    $scope.cartShow = false;

    $scope.show.loader = true;
    Dinners.getCategoryDinnersById(pid).then(function(response){
      console.log(response);
      $scope.show.loader = false;
      $scope.categorys = response.data;

      console.log($scope.dinners);
    }).catch(function(res){
      console.warn(res);
    });


      var posOptions = { maximumAge: 30000,timeout: 5000,enableHighAccuracy: false};
                                 $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                                    var lat  = position.coords.latitude
                                    var long = position.coords.longitude
                                   ymaps.route([ [ long, lat],adress ],{
                                                  }).then(function (route) {
                                                       $scope.timeElepse = route.getJamsTime()/60;
                                                       $scope.dist = route.getLength()/1000;
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
                                          console.log( coor,adress);
                                             ymaps.route([coor,adress],{}).then(function (route) {
                                                       $scope.timeElepse = Math.round(route.getJamsTime()/60);
                                                       $scope.dist = route.getLength()/1000;
                                                  }, function (error) {
                                                      console.err(error);
                                                  });     
                                          $scope.$digest();
                                      });
                                      
                                   
                                });

  };

  //== LOGIN

  $ionicModal.fromTemplateUrl('templates/login/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalLogin = modal;
  });

 
  $scope.loginClose = function() {
    $scope.modalLogin.hide();
  };

  $scope.loginOpen = function() {
    $scope.modalLogin.show();
  };

  $scope.login = function(user){
    console.log(user);
      if(user  !== undefined && user.password !== undefined && 
         user.phone  !== undefined  && user.password  !== '' && 
         user.phone  !== '' ){
          var exp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
          var login = user.phone;
          login = login.replace(/[^0-9.]/g, "");
          login = login.substring(login.length-10);

          Login.check(login,user.password).then(function(response){
                console.log(response);
                $scope.data = response.data;
                if($scope.data.status == "succes_login"){
                    Login.add($scope.data.user);
                    Login.saveUser($scope.data.user);
                    console.log('Sign-In', Login.get());
                    $scope.loginClose(); 
                } else {
                   $scope.Err("Телефон или пароль введен не верно !");
                }
          }).catch(function(response){
                //handle the error
                console.warn(response);
          });
      } else {
          $scope.Err("Телефон или пароль введен не верно !");
      }
  }

  $scope.userdata = {CarColor: "white"};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/profile/app-editcolor.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalColor = modal;
  });

  // Triggered in the login modal to close it
  $scope.saveColor = function(selColor) {
    $scope.modalColor.hide();
    $scope.userdata.CarColor = selColor;
    console.log($scope.userdata.CarColor);

  };

  $scope.closeColor = function(selColor) {
    $scope.modalColor.hide();
 
  };

  // Open the login modal
  $scope.changeColor = function() {
    $scope.modalColor.show();
  };

  $scope.reg = function(user){
      console.log(user);
       if(user  !== undefined && user.fname !== undefined && 
         user.lname  !== undefined  && user.fname  !== '' && 
         user.lname  !== '' && user.phone !== '' && user.phone  !== undefined){
          var exp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
          var phone = user.phone;
          phone = phone.replace(/[^0-9.]/g, "");
          phone = phone.substring(phone.length-10);

           Login.reg(user.fname,user.lname,phone,user.car_number,$scope.userdata.CarColor).then(function(response){
                console.log(response);
                 
                if(response.data['status'] == "added_user"){
                    $scope.regUser = response.data;
                    Login.add(response.data);
                    Login.saveUser(response.data);
                    $scope.loginClose();

                } else if(response.data['status'] == "resend_pass" ) {
                    $scope.Err("На ваш номер высла СМС код");
                } else {
                     $scope.Err("Упс :( Что то пошло не так..");
                }
            }).catch(function(response){
                  console.warn(response);
                  $scope.Err("Сервер временно не доступен :(");
            });  

       } else {
          $scope.Err("Заполните все поля !");
       }
  }



  //==

  $ionicModal.fromTemplateUrl('templates/catalog/app-catalog-confirm.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalConf = modal;
  });

  $scope.confirmClose = function() {
    $scope.modalConf.hide();
  };

  $scope.confirmOpen = function() {
    $scope.modalConf.show();
  };


  $ionicModal.fromTemplateUrl('templates/catalog/app-category-menu.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalCatMenu = modal;
  });

  $scope.cancelCatMenu = function() {
    $scope.modalCatMenu.hide();
  };

  $scope.alertInfo = function(text){

    var myPopup = $ionicPopup.show({
      template: '<textarea placeholder="Не обязательно" rows="6"></textarea><p>Мы обязательно разберемся!</p>',
      title: '<span>Заказ не был доставлен?</span>',
      subTitle: 'Оформите жалобу ниже, добавив дополнительный комментарий, если нужно.',
      scope: $scope,
      buttons: [
        { text: 'отправить',
          type: 'red-button'
        },
        {
          text: 'отмена',
          type: 'button-grey'
        }
      ]
    });
  };

  $scope.timeInfoAlert = function(text){

    var myPopup = $ionicPopup.show({
        template: '<img src="img/cancel-alert2.png">',
        title: 'Время приготовления данного блюда больше времени вашего прибытия к ресторану.<br><br>Подождете?',
        scope: $scope,
        buttons: [
          { text: 'отмена',
            type: 'button-grey'
          },
          {
            text: 'заказать',
            type: 'green-button',
          }
        ]
      });
  };

//== GET DINNERS 

  $scope.setCatMenu = function(arr,cat_title,point_menu_dinner_status) {
    if(arr.length > 0){
        $scope.cat_title = cat_title;
        $scope.modalCatMenu.show();
        $scope.dinners = arr;


        for (var i = $scope.dinners.length - 1; i >= 0; i--) {
          $scope.dinners[i]['cart_count'] = 1;
            
            var in_arr = false;
            for (var j = point_menu_dinner_status.length - 1; j >= 0; j--) {
              if(point_menu_dinner_status[j].id == $scope.dinners[i]['id']){
                in_arr = true;
                $scope.dinners[i]['activ'] = point_menu_dinner_status[j].activ;
                if(parseInt(point_menu_dinner_status[j].citchenWaiting)>0){
                  $scope.dinners[i]['cook_time'] = parseInt(point_menu_dinner_status[j].time)+ ((parseInt(point_menu_dinner_status[j].citchenWaiting)/100) * parseInt(point_menu_dinner_status[j].time)) ;
               } else {
                  $scope.dinners[i]['cook_time'] = parseInt(point_menu_dinner_status[j].time);                                  
                }

              }
            }
            if(point_menu_dinner_status.length == 0 || in_arr == false){
               point_menu_dinner_status.push({id:$scope.dinners[i]['id'],activ:true,time:$scope.dinners[i]['cook_time'],citchenWaiting:0});
               $scope.dinners[i]['activ'] = true;
            }

        }
        console.log( arr);
    }

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
    var i = list.length;
    while (i--) {
        if (angular.equals(list[i], obj)) { 
             list[i]['cart_count'] = parseInt(count);
             if(count == 0){
                  list.splice(i, 1);
             } 
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
 
    s_count = parseInt(count) + 1;
    //if(checkCount(item,$scope.cart,count)){
    if(count < 99){  
      countCartItem(item,$scope.cart,s_count);
      $scope.totalPrice = fullPrice($scope.cart);
      $scope.count = s_count; 
    } 
    return $scope.count;
  };

  $scope.counterM = function(item,count){
    var flag = true;

    if(parseInt(count)> 0){
      s_count = parseInt(count) - 1;   
      //if(checkCount(item,$scope.cart,count)){
        countCartItem(item,$scope.cart,s_count);
        $scope.totalPrice = fullPrice($scope.cart);
        $scope.count = s_count; 
     // }    
    } 

    if(s_count == 0) {
      $scope.cartShow = false;
      flag = false;
      $scope.confirmClose();  
    }
    console.log(item,count,$scope.count);
    
    return flag;
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
          item.cart_count = 1;
          $scope.cart.push(item);
          var date = new Date();
          var food_delivery_time = 0;
          if($scope.timeElepse > parseInt(item.cook_time) ){
             food_delivery_time = $scope.timeElepse;
             $scope.isMoreTimeElepse = false;
          } else {
             food_delivery_time = parseInt(item.cook_time);
             $scope.isMoreTimeElepse = true;
          }
          console.log(food_delivery_time);
          var new_date = new Date(date.getTime()+food_delivery_time*60000);
          var hh = new_date.getHours();
          var mm = new_date.getMinutes();
          if(mm < 10) mm = '0'+mm;
          if(hh < 10) hh = '0'+hh;
          $scope.food_delivery_time = hh+':'+mm;

          $scope.food_delivery_time_min = parseInt(food_delivery_time);
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
 

  var trackGPS = function(end_point){

            var callbackFn = function(location) {
                console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);
                Dinners.setUserArrTime($scope.order_id,$scope.timeElepse,[ location.latitude,location.longitude]).then(function(response){
                                        console.log(response);
                                    }).catch(function(response){
                                        console.log(response);
                });

                window.backgroundGeolocation.finish();
            };

            var failureFn = function(error) {
                console.log('BackgroundGeolocation error');

            };

            console.log("Before configure")
            window.backgroundGeolocation.configure(callbackFn, failureFn, {
                desiredAccuracy: 10,
                stationaryRadius: 20,
                distanceFilter: 30,
                startForeground: true, 
                maxLocations: 1000,
                // Android only section
                locationProvider: window.backgroundGeolocation.provider.RAW_PROVIDER,
                interval:1000,
                fastestInterval: 1000,
                activitiesInterval: 1000,
                notificationTitle: 'Background tracking',
                notificationText: 'enabled',
                notificationIconColor: '#FEDD1E',
                notificationIconLarge: 'mappointer_large',
                notificationIconSmall: 'mappointer_small'
            });
                console.log("After configure")
           window.backgroundGeolocation.start();
 
           window.backgroundGeolocation.getLocations(
            function (locations) {
              
              var loc = locations[locations.length-1];
              console.log(locations,loc);
              $scope.centerCoord =  [loc.longitude,loc.latitude]; 
                Dinners.setUserArrTime($scope.order_id,$scope.timeElepse,[ loc.latitude,loc.longitude]).then(function(response){
                                        console.log(response);
                }).catch(function(response){
                                        console.log(response);
                });
            }, function(err){
              console.log(err);
            }
          );
                                 
                             /*    var posOptions = { maximumAge: 30000,timeout: 5000,enableHighAccuracy: false};
                                 $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                                    var lat  = position.coords.latitude
                                    var long = position.coords.longitude
                                    console.log('GPS TRACK Time '+lat + ' ' + long,end_point);

                                    Dinners.setUserArrTime($scope.order_id,$scope.timeElepse,[ lat,long]).then(function(response){
                                        console.log(response);
                                    }).catch(function(response){
                                        console.log(response);
                                    });
                                            
                                 }, function(err) {
                                    console.log(err);
                                   var geolocation = ymaps.geolocation;
                                     geolocation.get({
                                          provider: 'auto',
                                          mapStateAutoApply: true
                                     }).then(function (result) {
                                          var coor = result.geoObjects.position;
                                          console.log( coor,end_point);
                                          Dinners.setUserArrTime($scope.order_id,$scope.timeElepse,  [coor[1],coor[0]] ).then(function(response){
                                                          console.log(response);
                                                        }).catch(function(response){
                                                          console.log(response);
                                                        });  
                                          $scope.$digest();
                                      }).catch(function(err){
                                        console.log(err);
                                      });
                                      
                                   
                                });
                        */


  }

  $scope.checkSale = function(code){
    $scope.show2.loader = true;
    if(Login.checkSaleState(code)){
         Dinners.checkSale(code).then(function(response){
          console.log(response);
          $scope.loader = false;
          if(response.data.status == "succes_sale"){
              Login.setSaleState(code,false);
              $scope.saleId = response.data.values.id;
              $scope.saleSize = response.data.values.size;
              $scope.totalPrice =  Math.round($scope.totalPrice -  $scope.saleSize  );
              if($scope.totalPrice < 0) $scope.totalPrice = 0;
              $scope.show2.saleBtnActiv = false;
              alertPopup('Ваша скидка активна ! Размер '+$scope.saleSize+'р' );
               
          } else {
            alertPopup('Номер промо кода не действителен !');
          }
        }).catch(function(res){
            $scope.show2.loader = false;
            alertPopup('Номер промо кода не действителен !');
        });
    } else {
        alertPopup('Вы уже активировали код !');
    }
   
  }

  var buy_dinner = function(){
      var user = Login.loadUser();
       var cart = {
                    point_id: $scope.rest_id,
                    stuard_id: '-1',
                    user_id: user["id"],
                    dinner_arr: JSON.stringify($scope.cart),
                    price: $scope.totalPrice,
                    coord: JSON.stringify($scope.centerCoord),
                    arr_time: $scope.food_delivery_time_min,
                    sale_id:   $scope.saleId
                };

                //console.log(cart,"cart");
                Dinners.buy(cart).then(function(response){
                    console.log(response);

                    $scope.saleId = 0;
                    $scope.saleBtnActiv = true;
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
                                    toolbar: 'yes'
                                  };

                                $cordovaInAppBrowser.open(data.url, '_blank', options).then(function(event) {
                                   console.log(event);
                                }).catch(function(event) {
                                   console.log(event);
                                });
      
                                Dinners.addItems([]);

                                $scope.modalCatMenu.hide();   
                                $scope.modalMenu.hide();  
                                $scope.confirmClose();   
              
                                  trackGPS($scope.rest_adress);
                                  //== tracking user
                                  Dinners.setTimer( setInterval(function(){
                                        trackGPS($scope.rest_adress);
                                  },90000) );
                                

                                $state.go('app.orders');
                                $ionicHistory.nextViewOptions({
                                  historyRoot: true
                                });

                            }
                          }).catch(function(err){
                              alert(err);
                          });
                    }
                }).catch(function(err){
                    console.log(err);
                });
  }

  $scope.buyDinner = function(){
     var user = Login.loadUser();
      if( user != null && user != "" ){

        if($scope.isMoreTimeElepse){
            var myPopup = $ionicPopup.show({
              template: '<img src="img/cancel-alert2.png">',
              title: 'Время приготовления блюд больше времени вашего прибытия к ресторану.<br><br>Подождете?',
              scope: $scope,
              buttons: [
                { text: 'отмена',
                  type: 'button-grey',
                  onTap: function(e) {
                    myPopup.close();
                  }
                },
                {
                  text: 'заказать',
                  type: 'green-button',
                  onTap: function(e) {
                    buy_dinner();
                  }
                }
              ]
            });
         
        } else {
            buy_dinner();
        }   
      } else {
          $scope.loginOpen();
      }
  }

  //==

  $scope.sendRaiting = function(id,count,text){
       Orders.setRaiting(id,count,text).then(function(response){
        var data = response.data;
        console.log(response.data);
        $scope.show.raiting = false;
      }).catch(function(err){
        console.warn(err);
      });
  }

  $scope.enableSuggest = function(val){
   /* var element = document.getElementsByClassName("pane");
    var suggestView = new ymaps.SuggestView($event.target, {
        offset: [-1, 2], container: element[1]
    });
    */
    
    $scope.streetResult = [];
    if(val !== ''){
          ymaps.suggest("Москва, "+val).then(function (items) {
   
          var arr = { result: items };
          
          $scope.streetResult = arr;
           $scope.$apply();
          console.log($scope.streetResult);
        });
    }

    
 
  }



  //Показать только тех чья сеть имеет нужный тег 
   $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
             //console.log($scope.user,"id");
             //Перерисовка карты 
            if(typeof $scope.mMap !== 'undefined') $scope.mMap.container.fitToViewport();
            //document.getElementsByClassName("ymaps-2-1-62-map")[0].style.display = "none";
            setTimeout(function(){
                if(typeof $scope.mMap !== 'undefined') $scope.mMap.container.fitToViewport();
                //document.getElementsByClassName("ymaps-2-1-62-map")[0].style.display = "block";
                console.log("lol");
            }, 400);


             Orders.getOrdersRaiting($scope.user.id).then(function(response){
              console.log(response,"raiting");
              var data = response.data;
              if(data.length > 0){
                $scope.show.raiting = true;
                $scope.raiting = data[0];
                console.log($scope.raiting ); 
              }
            }).catch(function(err){
              console.warn(err);
            });
            $scope.showPanelInfo = false;

          if ( $location.path() == "/app/map") {              
              var StuarByTag = Stuards.getSelectedNetworkTag();
 
          }
    }); 

  var collection, resCollection;

  distance = function(c1,c2,c3,c4){
          // Convert degrees to radians.
        c1 = c1* 0.017453292519943295;
        c2 = c2* 0.017453292519943295;
        c3 = c3* 0.017453292519943295;
        c4 = c4* 0.017453292519943295;
        // Calculate delta longitude and latitude.
        //$delta_lat=($lat2 - $lat1);
       // $delta_lng=($lng2 - $lng1);
        return Math.round( 6378137 * Math.acos( Math.cos( c1 ) * Math.cos( c3 ) * Math.cos( c2 - c4 ) + Math.sin( c1) * Math.sin( c3 ) ) );
  }

  $scope.aroundMeStuards = function(udist){
      $scope.show.userRoute = true;
      $scope.show.searchHide = false;
      $scope.searchStuard = []; 
       var searchCor = $scope.userPosition;
       for (var i = 0, ii = $scope.stuards.length; i < ii; i++) {
          var dist = distance($scope.stuards[i]['coordinates'][0],$scope.stuards[i]['coordinates'][1],searchCor[0],searchCor[1]);
           console.log($scope.stuards[i]['name'],dist);
           if(udist > dist) $scope.searchStuard.push($scope.stuards[i]);
       }
       if($scope.searchStuard.length > 0) $scope.show.searcResult = false;      
      
  }
 

  $scope.search = function(line){
    console.log(line);
    if(line == "") {
      $scope.show.searchHide = false;
       $scope.searchStuard = [];
    } else {
      $scope.show.searchHide = true;
      $scope.searchStuard = []; 

      var current_time = new Date();
      var current_day = current_time.getDay() - 1;
      if(current_day == -1) current_day = 0;

        for (var i = 0, ii = $scope.stuards.length; i < ii; i++) {
              var sadress = $scope.stuards[i]['adress'].toLowerCase().replace(/ /g,'').replace(/\./g, "").replace(/\,/g, "");  
              var sname = $scope.stuards[i]['point_title'].toLowerCase().replace(/ /g,'').replace(/\./g, "").replace(/\,/g, "");  
              line = line.toLowerCase().replace(/ /g,'').replace(/\./g, "").replace(/\,/g, "");
              if(sadress.includes(line) || sname.includes(line) ){
                  $scope.searchStuard.push($scope.stuards[i]);
              }
            
         }
       
         console.log( $scope.searchStuard);
    }
    
  }

  var searchOnRoute = function(){

  }

  $scope.showStuardOnMap = function(){
      $scope.mMap.setCenter($scope.searchStuard[0].coordinates,12);
      $scope.show.searcResult = true;
      $scope.show.searchHide = true;
  }
 

  var  routeToLineString = function(route) {
      const points = route.getPaths().toArray()
        .map(x => x.getSegments().toArray())
        .reduce((s, x) => s.concat(x), []) // flatten
        .map(x => x.geometry.getCoordinates())
        .reduce((s, x) => s.concat(x), []); // flatten

      // Сюда можно добавить симплификацию линии для ускорения
      // поиска расстояния.

      return { type: 'LineString', coordinates: points };
  }

  $scope.selectPointOnMap = function(){
    $scope.routeChoose();
    $scope.show.selectPointOnMap = false;
     myPlacemark.geometry.setCoordinates([0,0]);
  }

  $scope.setPointOnMap = function(){
      $scope.closeRoute();
      $scope.show.selectPointOnMap = true;
  }
 
  $scope.userRouteGet = function(point){

    var balloonLayout = ymaps.templateLayoutFactory.createClass("<div></div>", {
        build: function () {
            this.constructor.superclass.build.call(this);
            }
        }
    );
    const threshold = 7500;
    var activRoute;

    $scope.show2.loader = true;
    $scope.mMap.geoObjects.remove($scope.multiRoute);
    $scope.multiRoute = new ymaps.multiRouter.MultiRoute({
        // Описание опорных точек мультимаршрута.
        referencePoints: [
            $scope.centerCoord,
            //"Москва, метро технопарк",
            "Москва, "+point
            //"Москва, метро Парк культуры",
            //"Москва, ул. Мясницкая"
        ],
        // Параметры маршрутизации.
        params: {
            // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
            results: 3,
            avoidTrafficJams: true
         }
    }, {
        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
        boundsAutoApply: true,
        balloonLayout: balloonLayout  
    });


    $scope.multiRoute.model.events.add("requestsuccess", function (event) {
      $scope.closeRoute();
      $scope.show2.loader = false;

           // var mygeoArr=$scope.multiRoute.getRoutes();//получил пути
      var routsArr = $scope.multiRoute.getRoutes().toArray();
      $scope.routesArray = [];

      for (var i = 0 ; i < routsArr.length; i++) {
        
        if(i< 3) $scope.routesArray.push({index: i,distance: parseInt( (routsArr[i].properties.get('distance').value/1000) ), time: parseInt((routsArr[i].properties.get('durationInTraffic').value/60) )});
          
      }

      if($scope.routesArray.length !== 0){
        console.log($scope.routesArray);
        $scope.showUserRoutes = false;
        activRoute = $scope.multiRoute.getActiveRoute();
      }else {
        $scope.userRouteClear();
        alert("Не удалось построить маршрут");
         
      }
       
        

    }).add("requestfail", function (event) {
        console.log("Ошибка: " + event.get("error").message);
        $scope.show2.loader = false;
        alert("Не удалось построить маршрут");
         $scope.userRouteClear();
    });

      $scope.myCollectionLine.add($scope.multiRoute);
      $scope.mMap.geoObjects.add( $scope.myCollectionLine);


    //$scope.mMap.geoObjects.add($scope.multiRoute);



    $scope.multiRoute.model.events.add("activeroutechange", function () {
     
          console.log("activeroutechange");
    }).add("requestfail", function (event) {
        console.log("Ошибка: " + event.get("error").message);
        $scope.show2.loader = false;
        alert("Не удалось построить маршрут");

    });

      $scope.multiRoute.events.once("update",function () {
          $scope.selectRoute(0);            
      });
           
 


 
        console.log($scope.userRoute);
        $scope.show.userRoute = true;
        $scope.show.searchHideRoute = false;

        setMyPointHistory(point);
  
        
  }

  $scope.selectRoute = function(index){
      // Собираем по линии для каждой нитки маршрута.
      $scope.multiRoute.setActiveRoute($scope.multiRoute.getRoutes().get(index));
      $scope.isRouteTabSelect = index;
      const threshold = 1500;
      var lineGeoObjectsNew = [];

      for (var i = $scope.stuards.length - 1; i >= 0; i--) {
        $scope.stuards[i]['is_del'] = 0;
      }

      const lineGeoObjects =  $scope.multiRoute.getRoutes().toArray()
            .map(route => new ymaps.Polyline(routeToLineString(route)));
           
          lineGeoObjectsNew.push(lineGeoObjects[index]);

          // Добавляем линии на карту, т.к. getClosest нужна информация о проекции.
          const lines =  new ymaps.GeoObjectCollection(
            { children: lineGeoObjectsNew },
            { visible: false });
          $scope.myCollectionLine.add(lines);
          $scope.mMap.geoObjects.add( $scope.myCollectionLine);
          
          // Обновляем visible для каждой метки.
          $scope.myCollection.each(function(placemark) {
            const coords = placemark.geometry.getCoordinates();
            
            // Вычисляем если расстояние хотя бы до одной нитки меньше порогового.
            const isNearSomeRoute = lines.toArray()
              .some(line => {
                const closest = line.geometry.getClosest(coords);
                return closest.distance < threshold;
              });

            placemark.options.set('visible', isNearSomeRoute);
            
            if(isNearSomeRoute == false){
              var id = placemark.properties.get('arr_id')
              $scope.stuards[id]['is_del'] = 1;
              

            }

          });

  
  }



  $scope.userRouteClear = function(){
     $scope.route.a = "";
     $scope.myCollection.removeAll();
     $scope.myCollectionLine.removeAll();
     $scope.getAllStuards();
     $scope.showUserRoutes = true;
  }

  $scope.baloonClick = function (event){
    console.log("baloonClick",event.get('target') );
  }

  // Создание метки.
  function createPlacemark(coords) {
            return new ymaps.Placemark(coords, {
                iconCaption: 'поиск...'
            }, {
                preset: 'islands#violetDotIconWithCaption',
                draggable: true
            });
  }

        // Определяем адрес по координатам (обратное геокодирование).
  function getAddress(coords) {
            myPlacemark.properties.set('iconCaption', 'поиск...');
            console.log(coords);
            ymaps.geocode(coords).then(function (res) {
                var firstGeoObject = res.geoObjects.get(0);
                $scope.point.a =  firstGeoObject.getAddressLine();
             
                console.log( $scope.adress,firstGeoObject );
                myPlacemark.properties
                    .set({
                        // Формируем строку с данными об объекте.
                        iconCaption: [
                            // Название населенного пункта или вышестоящее административно-территориальное образование.
                            firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                            // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                            firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                        ].filter(Boolean).join(', '),
                        // В качестве контента балуна задаем строку с адресом объекта.
                        balloonContent: firstGeoObject.getAddressLine()
                    });
                    $scope.loader = true;
          


            }).catch(function(response){
              console.log(response);
            });
  }


  $scope.geoObjects=[];

  $scope.beforeInit = function(){

    var geolocation = ymaps.geolocation;

        geolocation.get({
            provider: 'auto',
            mapStateAutoApply: true
        }).then(function (result) {
            $scope.centerCoord = result.geoObjects.position;
            $scope.centerCoord = [$scope.centerCoord[1],$scope.centerCoord[0]];
            $scope.geoObjects=[];
            $scope.geoObjects.push({
                geometry:{
                    type:'Point',
                    coordinates:result.geoObjects.position
                }
            });
            //$scope.$digest();
        });
  };

  function gpsRetry() {
    var gpsOptions = {maximumAge: 300000, timeout: 5000, enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log('Latitude: '          + position.coords.latitude          + "\n" +
              'Longitude: '         + position.coords.longitude         + "\n" +
              'Altitude: '          + position.coords.altitude          + "\n" +
              'Accuracy: '          + position.coords.accuracy          + "\n" +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + "\n" +
              'Heading: '           + position.coords.heading           + "\n" +
              'Speed: '             + position.coords.speed             + "\n" +
              'Timestamp: '         + position.timestamp                + "\n");
        }, function(error, gpsOptions) {
        console.log('code: '    + error.code    + "\n" +
              'message: ' + error.message + "\n");
        gpsRetry();

    }, gpsOptions);
}

  $scope.getMyLocation = function(){

      //$scope.beforeInit();
       var posOptions = { maximumAge: 300000, timeout: 5000, enableHighAccuracy: true};
                                 $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                                    var lat  = position.coords.latitude
                                    var long = position.coords.longitude
                                    console.log('Time '+lat + '   ' + long,$scope.point_adress);
                                    $scope.centerCoord = [long,lat];
                                    console.log($scope.centerCoord,"centering");
                                    if($scope.centerCoord !== undefined) $scope.mMap.setCenter($scope.centerCoord,14);
                                    
                                    $scope.geoObjects=[];
                                    $scope.geoObjects.push({
                                          geometry:{
                                              type:'Point',
                                              coordinates: $scope.centerCoord
                                          }
                                    });
                                          

                                 }, function(err) {
                                    console.log(err);
                                      var alertPopup = $ionicPopup.alert({
                                         title: 'Внимание',
                                         okType: 'button button-full green-button',
                                         cssClass: 'bar-balanced',
                                         template: ' <div class="col"><p class="bold-text"> Проверьте настройки GPS. </p></div>'
                                       });
 
                                   
                                });


       
  }

  $scope.showOnMap = function(cor){
      $scope.mMap.setCenter(cor,14);
  }

  var searchInside = function(geoObjects, bounds){
        var coord, results = [];
        for (var i = 0, ii = geoObjects.length; i < ii; i++) {
            coord = geoObjects[i].geometry.coordinates;
            if(    coord[0] + 2>bounds[0][0]
                && coord[0] - 2<bounds[1][0]
                && coord[1] + 2>bounds[0][1]
                && coord[1] - 2<bounds[1][1]){

                
                    
                results.push(geoObjects[i]);
            }
        }
        return results;
  };

  var compareTime  = function(Date1,Date2){
    //console.log(Date1,Date2);
    var date1 = new Date(Date1);
    var date2 = new Date(Date2);
    var date_min_1 = date1.getMinutes();
    date1.setMinutes(date_min_1 - 30,0,0);
    var hours1 = date1.getHours();
    var minutes1 = date1.getMinutes();
    
    var hours2 = date2.getHours();
    var minutes2 = date2.getMinutes();

    var flag = false;

    if(hours1 > hours2) {
      flag = true;
    } else if (hours1 == hours2 && minutes1 > minutes2){
      flag = true;
    }  
 
    //console.log(hours1+":"+minutes1+" "+hours2+":"+minutes2, flag);
    return flag;
  }
    var points = [];

  var IsJsonString = function(str) {
    try {
        JSON.parse(str);
    } catch (e) {
      console.warn(e);
        return false;
    }
    return true;
  } 

  $scope.getAllStuards = function(){
      $scope.show2.loader = true;

      Stuards.getAllWithSchedule().then(function(response){
              $scope.stuards = response.data;
              console.log($scope.stuards);
              var current_time = new Date();
              var current_day = current_time.getDay() - 1;
              if(current_day == -1) current_day = 0;

              for (var i = $scope.stuards.length - 1; i >= 0; i--) {

                if($scope.stuards[i].menu_dinners_status == ''){
                  $scope.stuards[i].menu_dinners_status = [];
                } else {
                 
                  if(IsJsonString($scope.stuards[i].menu_dinners_status)){
                    $scope.stuards[i].menu_dinners_status = JSON.parse($scope.stuards[i].menu_dinners_status);
                  } else {
                    $scope.stuards[i].menu_dinners_status = [];
                  }
                }
                if($scope.stuards[i].schedule == ''){
                  $scope.stuards[i].schedule = [];
                } else {
                  
                  if(IsJsonString($scope.stuards[i].schedule)){
                    var sched_time_obj = JSON.parse($scope.stuards[i].schedule);
                  } else {
                    sched_time_obj = [];
                  }
                  for (var j = sched_time_obj.length - 1; j >= 0; j--) {
                    sched_time_obj[j].start = new Date(sched_time_obj[j].start);
                    sched_time_obj[j].end = new Date(sched_time_obj[j].end);
                  }

                  $scope.stuards[i].schedule = sched_time_obj;
                }
                var avatar = $scope.stuards[i].point_img ;
                if (avatar == "") {
                  avatar = 'img/map-point-no-photo.png';
                  $scope.stuards[i].point_img = avatar;
                } else {
                  avatar = "https://cp.edem-edim.ru/public/image/"+avatar;
                  $scope.stuards[i].point_img  = avatar;
                }

              };
 
                    for (var i = 0, ii = $scope.stuards.length; i < ii; i++) {

                      (function(counter) {
       
                         //if(  $scope.stuards[counter]['status'] == '1' && $scope.stuards[counter]['schedule'][current_day].day == true &&   compareTime(current_time,$scope.stuards[counter]['schedule'][current_day].start) &&  compareTime($scope.stuards[counter]['schedule'][current_day].end, current_time) ) {
                            //  ymaps.geocode('Москва, '+$scope.stuards[counter]['adress'] ).then(function (res) {
                             
                                //var firstGeoObject = res.geoObjects.get(0);
                              
                                if(IsJsonString($scope.stuards[counter]['coord'] ) ){
                                  var coord = JSON.parse($scope.stuards[counter]['coord']);
                                } else {
                                  var coord = [0,0];
                                }
                                
                                
                                //console.log($scope.stuards[counter]);

                                    var avatar = $scope.stuards[counter]['point_img'];
                                    var name = $scope.stuards[counter]['point_title'];
                                    var adress = $scope.stuards[counter]['adress']; 
                                    var stuardId =  $scope.stuards[counter]['id']; 
                                    var pointId = $scope.stuards[counter]['id']; 
                                    var networkId = $scope.stuards[counter]['network_id'];
                                    var menu_dinners_status = $scope.stuards[counter]['menu_dinners_status'];
                                    $scope.stuards[counter]['coordinates'] = coord;
               

                                    
                                   var placemark = new ymaps.Placemark( coord, { 
                                          arr_id: counter
                                        }, {
                                          iconImageHref: avatar,
                                          iconLayout: 'default#image',
                                          iconImageSize: [54, 54], 
                                          iconImageOffset: [0, 0],
                                         balloonContentSize: [10, 10], 
                                          balloonLayout: 'default#imageWithContent',
                                          balloonImageHref: '../www/img/map-location.png',  
                                          balloonImageOffset: [0, 0], 
                                          balloonImageSize: [1, 1],
                                          balloonPanelMaxMapArea: Infinity
                                  });
                                  placemark.events.add('click', function (e) {
                                     // placemark.properties.set('balloonContent', "Идет загрузка данных...");
                                      console.log(adress);
                                      $scope.$apply(function () {
                                        $scope.panel_avatar = avatar;
                                        $scope.panel_name = name;
                                        $scope.panel_adress = adress;
                                        $scope.panel_stuardId = stuardId;
                                        $scope.panel_pointId = pointId
                                        $scope.panel_networkId = networkId;
                                        $scope.menu_dinners_status = menu_dinners_status;
                                          $scope.showPanelInfo = true;
                                      });
                                      
                                  });
                                    $scope.myCollection.add(placemark);

                                 
                            //  }, function (err) {
                            ///    console.error(err.message);
                           // });
                        //} else {
                        //  $scope.stuards[counter]['is_del'] = 1;
                        //}
                           
                      })(i);

                    };
          

            
              $scope.mMap.geoObjects.add($scope.myCollection);

              $scope.mMap.events.add('click', function(e) {
                   $scope.showPanelInfo = false;
                   $scope.$apply();

                  if($scope.show.selectPointOnMap == true){
                        var coords = e.get('coords');
                        // Если метка уже создана – просто передвигаем ее.
                        if (myPlacemark) {
                            myPlacemark.geometry.setCoordinates(coords);
                        }
                        // Если нет – создаем.
                        else {
                            myPlacemark = createPlacemark(coords);
                             $scope.mMap.geoObjects.add(myPlacemark);
                            // Слушаем событие окончания перетаскивания на метке.
                            myPlacemark.events.add('dragend', function () {
                                getAddress(myPlacemark.geometry.getCoordinates());
                            });
                        }
                        getAddress(coords);
                  }

              });
              $scope.show2.loader = false;
          }).catch(function(response){
              console.warn(response);
          });

    }

    $scope.afterInit=function(map){
          $scope.onMap = searchInside(points, map.getBounds());
          $scope.mMap = map;
          $scope.myCollection = new ymaps.GeoObjectCollection();
          $scope.myCollectionLine = new ymaps.GeoObjectCollection();
          //var StuarByTag = Stuards.getSelectedNetworkTag();

          $scope.mTraffic = new ymaps.traffic.provider.Actual({}, { infoLayerShown: true });

          //console.log(StuarByTag,"ByTAG");  

          $scope.getAllStuards();
          

          //angular.element(document.getElementById('ballonHint')).bind('click', function(){ console.log("1")});
           
          navigator.splashscreen.hide();
    };


    $scope.mapBoundschange=function(event){
          var myMap = event.get('target');
          $scope.onMap = searchInside(points, myMap.getBounds());

    };

    $scope.zoomIn = function () {
       var map = $scope.mMap;
       map.setZoom(map.getZoom() + 1, {checkZoomRange: true});
    }

    $scope.zoomOut = function () {
       var map = $scope.mMap;
       map.setZoom(map.getZoom() - 1, {checkZoomRange: true});
    }

    $scope.trafficOn = function () {
        $scope.mTraffic.setMap($scope.mMap);
    }

    $scope.trafficOff = function () {
        $scope.mTraffic.setMap(null);
    }

    $scope.closePanelInfo = function(){
      $scope.showPanelInfo = false;
    }
      
    $scope.checkFavorite = function (id) {
      $scope.favorites = Login.getFavorites();
      if($scope.favorites == null) $scope.favorites = [];
      var flag = false;
      for (var i = $scope.favorites.length - 1; i >= 0; i--) {
            if($scope.favorites[i].id == id && $scope.favorites[i].val == true ) flag = true;
      }
      return flag;
    }

    $scope.checkFavorCount = function () {
       $scope.favorites = Login.getFavorites();
      if($scope.favorites == null) $scope.favorites = [];
      var flag = 0;
      for (var i = $scope.favorites.length - 1; i >= 0; i--) {
            if($scope.favorites[i].val == true ) flag++;
      }
      return flag;
    }

    $scope.setLike = function (id) {
      var isFind = false;
      for (var i = $scope.favorites.length - 1; i >= 0; i--) {
        if($scope.favorites[i].id == id){
           $scope.favorites[i].val = !$scope.favorites[i].val;
           isFind = true;
        } 
      }
      if(isFind == false){
           $scope.favorites.push({id:id,val:true});
      }
      Login.setFavorites($scope.favorites);
    }

    $scope.checkMyPoint = function (id) {
      $scope.MyPoints = Login.getMyPoints();
      var flag = false;
      for (var i = $scope.MyPoints.length - 1; i >= 0; i--) {
            if($scope.MyPoints[i].id == id ) flag = true;
      }
      return flag;
    }

    $scope.setMyPoint = function (id,value) {
      var isFind = false;
      console.log(value);
      if(value !== '' && value !== undefined){
              for (var i = $scope.myPoints.length - 1; i >= 0; i--) {
                if($scope.myPoints[i].id == id){
                   $scope.myPoints[i].val = value;
                   isFind = true;
                } 
              }
          if(isFind == false){
            $scope.myPoints.push({id:id,val:value});
          }
            console.log($scope.myPoints);
            Login.setMyPoints($scope.myPoints);
      }

    }

    var checkMyPointHistory = function (id) {
      $scope.MyPointHistory = Login.getMyRoutsHistory();
      var flag = false;
      for (var i = $scope.MyPointHistory.length - 1; i >= 0; i--) {
            if($scope.MyPointHistory[i].id == id ) flag = true;
      }
      return flag;
    }

    var setMyPointHistory = function (value) {
      var isFound = false;
      var lId = 0;
      var count = $scope.MyPointHistory.length + 1;
      if($scope.MyPointHistory.length < 10){
          if($scope.MyPointHistory.length > 0){
            for (var i = $scope.MyPointHistory.length - 1; i >= 0; i--) {
              if($scope.MyPointHistory[i].val == value){
                isFound = true;
                lId = i;
              } 
            } 
          }
          if(isFound == false ){
            $scope.MyPointHistory.push({id:count,val:value});
            console.log($scope.MyPointHistory);
            Login.setMyRoutsHistory($scope.MyPointHistory);
          } else {
            $scope.MyPointHistory.splice(lId,1);  
            count = $scope.MyPointHistory.length + 1;
            $scope.MyPointHistory.push({id:count,val:value}); 
          }
      }

    }

    //Sorting TAGS

    $scope.Err = function(text){
    var alertPopup = $ionicPopup.alert({
      title: '',
      okType: 'button button-full green-button',
      cssClass: 'bar-balanced',
      template: ' <div class="col"><p class="bold-text col-text-center">'+text+'</p></div>'
    });
    alertPopup.then(function(res) {
    });
    $timeout(function() {
      alertPopup.close(); //close the popup after 3 seconds for some reason
    }, 3000);
  }

  $scope.clearTag = function(){
    console.log("clear");
    $scope.userRouteClear();
    $scope.isFoodFilter.state = false;
  }

  $scope.setTag = function(arr,tagName){
    console.log(arr);
    if(arr !== undefined){
      var id = '';
      for (var i = 0; i < arr.length; i++) {
        id = arr[i].id + ',' + id;
      }
      id = id.slice(0, id.length -1);
      Stuards.getAllStuardByNetId(id).then(function(response){
              $scope.isFoodFilter.state = true;
              $scope.isFoodFilter.name = tagName;
              $scope.stuards = response.data;

              for (var i = $scope.stuards.length - 1; i >= 0; i--) {
                
                var avatar = $scope.stuards[i]['point_img'];
                if (avatar == "") {
                  var my_avatar = 'img/map-point-no-photo.png';
                  $scope.stuards[i]['point_img'] = my_avatar;
                } else {
                  var my_avatar = "https://cp.edem-edim.ru/public/image/"+avatar;
                  $scope.stuards[i]['point_img'] = my_avatar;
                }

              };

              
                        $scope.myCollection.removeAll();
                        for (var i = 0, ii = $scope.stuards.length; i < ii; i++) {
                          (function(counter) {
                               ymaps.geocode('Москва, '+$scope.stuards[counter]['adress'], { results: 1 }).then(function (res) {

                                  var firstGeoObject = res.geoObjects.get(0);
                                  console.log(firstGeoObject.geometry.getCoordinates());
                                  console.log($scope.stuards[counter]);

                                      var avatar = $scope.stuards[counter]['point_img'];
                                      var name = $scope.stuards[counter]['point_title'];
                                      var adress = $scope.stuards[counter]['adress']; 
                                      var stuardId =  $scope.stuards[counter]['id']; 
                                      $scope.stuards[counter]['coordinates'] = firstGeoObject.geometry.getCoordinates();
                                      
                                      if(counter == 0)  $scope.mMap.setCenter($scope.stuards[counter]['coordinates'],12);
                                      
                                     var placemark = new ymaps.Placemark( firstGeoObject.geometry.getCoordinates(), { 
                                            
                                            //balloonContent: '<div class="stuard-point"> <div class="stuard-point-ico"> <img class="circle-avatar" src="'+avatar +'"> </div> <div class="stuard-point-block"> <div class="about-stuard"> <h2>'+name+'</h2> <p>'+adress+'</p> </div> <a href="#/app/catalogStuar/'+stuardId+'" id="ballonHint" class="button button-clear about-stuard-more"> <img src="img/arrow-right.png"> </a> </div>'
                                          }, {
                                            iconImageHref: avatar,
                                            iconLayout: 'default#image',
                                            iconImageSize: [54, 54], 
                                            iconImageOffset: [0, 0],
                                           balloonContentSize: [10, 10], 
                                            balloonLayout: 'default#imageWithContent',
                                            balloonImageHref: '../www/img/map-location.png',  
                                            balloonImageOffset: [0, 0], 
                                            balloonImageSize: [1, 1],
                                            balloonPanelMaxMapArea: Infinity
                                    });
                                    placemark.events.add('click', function (e) {
                                       // placemark.properties.set('balloonContent', "Идет загрузка данных...");
                                        console.log(adress);
                                        $scope.$apply(function () {
                                          $scope.panel_avatar = avatar;
                                          $scope.panel_name = name;
                                          $scope.panel_adress = adress;
                                          $scope.panel_stuardId = stuardId;
                                            $scope.showPanelInfo = true;
                                        });
                                        
                                    });
                                      $scope.myCollection.add(placemark);

                                   
                                }, function (err) {
                                  console.err(err.message);
                              });
                          })(i);

                        };
                           
                        $scope.mMap.geoObjects.add($scope.myCollection);

                        $scope.mMap.events.add('click', function() {
                             $scope.showPanelInfo = false;
                             $scope.$apply();
                        });




        $scope.categoryClose(); 
        console.log();    
      }).catch(function(response){
        console.log(response);
      });
    } else {
      $scope.Err("В выбранном разделе нет еды :(");
    }  
  };

  var sort = function (obj){
    var tags = [];
      for(var i=0;i<obj.length;i++){
        for (var j = 0; j < obj[i].type.length; j++) {
          var kk = parseInt(obj[i].type[j]);
          if(tags[kk] == undefined) tags[kk] = [];
          tags[kk].push(obj[i]); 
        };
      }
    return tags;  
  } 

  var groupBy = function (collection, kk) {
    var i = 0, val, index,
        values = [], result = [];
    for (; i < collection.length; i++) {
      val = collection[i].type[kk];
      index = values.indexOf(val);
      if (index > -1){
        result[index].push(collection[i]);
      }
      else {
        values.push(val);
        result.push([collection[i]]);
      }
    }
    return result;
  }

  Dinners.getDinnersNetworks().then(function(response){
    var data = response.data;
    for(var i = 0;i < data.length;i++){
      
      if(typeof data[i].type  === 'string' && data[i].type !== '""' && data[i].type !== ''){
          //console.log(data[i].type,i);
          data[i].type = JSON.parse(data[i].type.replace(/\"/g,'') );
      } 
    }
    $scope.networks =  sort(data);
      console.log($scope.networks);
  }).catch(function(response){
    console.log(response);
  });


}]);