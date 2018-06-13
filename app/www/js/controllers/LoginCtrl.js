angular.module('starter.controllers').controller('LoginCtrl', 
  ['$scope', '$location', '$ionicPlatform', '$http', '$ionicModal', '$ionicPopup', '$cordovaOauth', 'auth', '$timeout', '$state', 'Login', 
  function($scope, $location, $ionicPlatform, $http, $ionicModal, $ionicPopup, $cordovaOauth, auth, $timeout, $state, Login) {

  var user = Login.loadUser();
  
  if( user != null && user != "" ){
       console.log(user);
       Login.check(user.phone,user.password).then(function(response){
                console.log(response);
                $scope.data = response.data;
                if($scope.data.status == "succes_login"){
                    Login.add($scope.data.user);
                    Login.saveUser($scope.data.user);
                    console.log('Sign-In', Login.get());
                    $state.go('app.map');
                } else {
                    $ionicPlatform.ready(function() {
                        //only production
                        //navigator.splashscreen.hide();
                    }); 
                  
                   console.log("Телефон или пароль введен не верно !");
                }
          }).catch(function(response){
                //handle the error
                $ionicPlatform.ready(function() {
                    //navigator.splashscreen.hide();
                });
                alert(response);
                console.warn(response);
          });
  } else {
        
        $ionicPlatform.ready(function() {
            //navigator.splashscreen.hide();
        });
        var state = Login.getInfoState();
        if (state == null || state == "" || state == false) {
            $state.go('helper');
            Login.setInfoState(true);
        } 
        
        console.log("go helper ");
  }

  $scope.Err = function(text){
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

  $scope.reg = function(user){
      console.log(user);
       if(user  !== undefined && user.fname !== undefined && 
         user.lname  !== undefined  && user.fname  !== '' && 
         user.lname  !== '' && user.phone !== '' && user.phone  !== undefined){
          var exp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
          var phone = user.phone;
          phone = phone.replace(/[^0-9.]/g, "");
          phone = phone.substring(phone.length-10);

           Login.reg(user.fname,user.lname,phone).then(function(response){
                console.log(response);
                 
                if(response.data['status'] == "added_user"){
                    $state.go('moreinfo');
                    $scope.regUser = response.data;
                    Login.add(response.data);
                    $scope.loginModal();
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
                    $state.go('app.map');
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

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login/singin.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.loginClose = function(){
    $state.go('app.map');
  }

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.loginModal = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.checkPass = function(pass) {
    console.log('Doing login', pass);

    if($scope.regUser['pass'] == pass){
        $state.go('moreinfo');
    } 
 
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.resendSMS = function(){
        $scope.data = {};
        var myPopup = $ionicPopup.show({
          template: '<input type="phone" ng-model="data.phone">',
          title: 'Введите номер своего телефона',
          subTitle: 'Без цифры 8 и +7',
          scope: $scope,
          buttons: [
            { text: 'Отмена',
              type: 'grey-button'
             },
            {
              text: 'Выслать',
              type: 'green-button',
              onTap: function(e) {
                console.log($scope.data);
                if (!$scope.data.phone) {
                  e.preventDefault();
                } else {
                  return $scope.data.phone;
                }
              }
            }
          ]
        });

        myPopup.then(function(res) {
          console.log('Tapped!', res);
          if(res !== undefined ){
                Login.reg(" ", " ",res).then(function(response){
                      //do something with response
                      console.log(response);
                      $scope.data = response.data;
                }).catch(function(response){
                      alert("Сервер временно недоступен !");
                      console.warn(response);
                });
          }
          

        });


    }
 

    $scope.loginWithGoogle = function(){
      console.log("google");
      auth.signin({
            authParams: {
              // This asks for the refresh token
              // So that the user never has to log in again
              scope: 'openid offline_access',
              // This is the device name
              device: 'Mobile device'
            },
            // Make the widget non closeable
            standalone: true
          }, function(profile, token, accessToken, state, refreshToken) {
                  // Login was successful
            // We need to save the information from the login
            console.log('profile', profile);
            console.log('token', token);
            console.log('refreshToken', refreshToken);
            localStorage.setItem('profile', profile); 
            
          }, function(error) {
            // Oops something went wrong during login:
            console.log("There was an error logging in", error);
        });

     




    }
 


 /*
      function initClient() {
        // Initialize the client with API key and People API, and initialize OAuth with an
        // OAuth 2.0 client ID and scopes (space delimited string) to request access.
        gapi.client.init({
            apiKey: 'AIzaSyDlAPBFaA0zNdzAXgp0UyOo4cThjmNa_4g',
            discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1"],
            clientId: '723011328567-toompjj6krlksels2afke4ejqfej8b9e.apps.googleusercontent.com',
            scope: 'profile'
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
      }
      gapi.load('client:auth2', initClient);

      function updateSigninStatus(isSignedIn) {
        // When signin status changes, this function is called.
        // If the signin status is changed to signedIn, we make an API call.
        if (isSignedIn) {
          makeApiCall();
        }
      }

  
      function handleSignOutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }

      function makeApiCall() {
        // Make an API call to the People API, and print the user's given name.
        gapi.client.people.people.get({
          resourceName: 'people/me'
        }).then(function(response) {
          console.log('Hello, ' + response.result.names[0].givenName);
        }, function(reason) {
          console.log('Error: ' + reason.result.error.message);
        });
      }


  $scope.socailLogin = function() {
       gapi.auth2.getAuthInstance().signIn();

       
  };
 
 */

        
}]);