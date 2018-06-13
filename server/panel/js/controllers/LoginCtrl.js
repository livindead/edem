 
angular.module('myApp')
	.controller('LoginCtrl', function($scope,$timeout,$state,Users,SweetAlert,Organizations) {
		 
	 	$scope.signin = function(login,pass){
	 		Users.login(login,pass).then(function(response){
	 			console.log(response);
	 			if(response.data.token != null){
	 				Users.saveUser(response.data.token.user[0],response.data.token.token);
	 				$state.go("index");
	 			}	else {
	 				console.log("fail");
	 				SweetAlert.swal("Ошибка", "Логин или Пароль не верен", "error");
	 			}
	 		}).catch(function(response){
	 			console.log(response);
	 			SweetAlert.swal("Ошибка", "Сервер временно не доступен", "error");
	 		});



	 	}

	 	$scope.loginPanel = function(login,pass){
	 		Organizations.checkLogin(login,pass).then(function(response){
	 			console.log(response);
	 			if(response.data.length > 0  && response.data[0].is_del == '0'){
	 				Users.saveUser(response.data[0]);
	 				$state.go("index");
	 			}	else {
	 				console.log("fail");
	 				SweetAlert.swal("Ошибка", "Логин или Пароль не верен", "error");
	 			}
	 		}).catch(function(response){
	 			console.log(response);
	 			SweetAlert.swal("Ошибка", "Сервер временно не доступен", "error");
	 		})
	 	}	

	});