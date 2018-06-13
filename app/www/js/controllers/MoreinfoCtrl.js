angular.module('starter.controllers').controller('MoreinfoCtrl', 
  ['$scope', '$ionicModal', '$state', '$ionicPopup', '$timeout', 'Login', 
  function($scope, $ionicModal, $state, $ionicPopup, $timeout, Login) {
    


    $scope.user = Login.get();
    $scope.data = {CarColor: "white"};
    console.log($scope.user,'Login get');

        // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/profile/app-editcolor.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.saveColor = function(selColor) {
    $scope.modal.hide();
    $scope.user.car_color = $scope.data.CarColor;
    console.log($scope.data.CarColor);

  };

  $scope.closeColor = function(selColor) {
    $scope.modal.hide();
 
  };

  // Open the login modal
  $scope.changeColor = function() {
    $scope.modal.show();
  };

    var Err = function(text){
      var alertPopup = $ionicPopup.alert({
             title: '',
             okType: 'button button-full green-button',
             cssClass: 'bar-balanced',
             template: ' <div class="col"><p class="bold-text">'+text+'</p></div>'
           });
           alertPopup.then(function(res) {
           });
           $timeout(function() {
             alertPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
    }

    $scope.updateUser = function(user){
        console.log(user);
       if(user  !== undefined && user.name !== undefined && 
          user.lname  !== undefined && user.phone  !== undefined && 
          user.car_title !== undefined && user.name  !== '' && 
          user.car_color !== undefined && user.car_color !== '' && user.lname  !== ''
          && user.car_title !== '' && user.phone  !== '' ){

          var exp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
          var login = user.phone;
          login = login.toString();
          login = login.replace(/[^0-9.]/g, "");

         Login.update(user).then(function(response){
                console.log(response);
                $scope.data = response.data;
                if($scope.data.status == "succes_update"){

                    $state.go('app.map');
                } else {
                   $scope.Err("Телефон или пароль введен не верно !");
                }
          }).catch(function(response){
                //handle the error
                console.warn(response);
          });

        } else {
            Err("Не все обязательные поля заполнены !");
        }
    }
}]);