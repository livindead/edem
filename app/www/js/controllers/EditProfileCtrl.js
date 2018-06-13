angular.module('starter.controllers').controller('EditProfileCtrl', 
  ['$scope', '$state', '$stateParams', '$ionicModal', 'Upload', 'Login', 
  function($scope, $state, $stateParams, $ionicModal, Upload, Login) {
  
  $scope.user = [];
  $scope.imgFile = '';
  $scope.user = Login.get();
  $scope.data = {CarColor: 'white'};

  console.log($scope.user);

  $scope.uploadImage = function(file, errFiles) {
              $scope.f = file;
              $scope.errFile = errFiles && errFiles[0];
              file.done = false;
              if (file) {
                  file.upload = Upload.upload({
                      url: 'http://edem-edim.ru/server/index.php?mobile=y&status=add_image&id=',
                      file: file 
                  });

                  file.upload.then(function (response) {
                    file.done = true;   
                      $scope.image = response.data;
                      $scope.imgFile = response.data.image_name;
                      console.log(response);
                     
                  }, function (response) {
                  }, function (evt) {

                  });
              }   
  };

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

  $scope.updateUser = function(user){
        console.log(user);
       if(user  !== undefined && user.name !== undefined && 
          user.lname  !== undefined && user.phone  !== undefined && 
          user.car_title !== undefined && user.name  !== '' && 
          user.car_color !== undefined && user.car_color !== '' && user.lname  !== ''
          && user.car_title !== '' && user.phone  !== '' ){

          if($scope.imgFile != '') user['avatar'] = $scope.imgFile;
          var exp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
          var login = user.phone;
          login = login.replace(/[^0-9.]/g, "");

         Login.update(user).then(function(response){
                console.log(response);
                $scope.data = response.data;
                if($scope.data.status == "succes_update"){
                    $state.go('app.profile');
                } else {
                    console.log("Телефон или пароль введен не верно !");
                   //$scope.Err("Телефон или пароль введен не верно !");
                }
          }).catch(function(response){
                //handle the error
                console.warn(response);
          });

        } else {
            //Err("Не все обязательные поля заполнены !");
            console.log("Не все обязательные поля заполнены !");
        }
  }


}]);