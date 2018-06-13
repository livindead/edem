angular.module('myApp')
 	.controller('RegCtrl', function($scope,$timeout,$state,Users,SweetAlert,Organizations) {
		 

	 	$scope.reg = function(login,pass,phone,title,contact){
	 		if(login !== undefined && login !== '' &&
	 			pass !== undefined && pass !== '' &&
	 			phone !== undefined && phone !== '' &&
	 			title !== undefined && title !== '' &&
	 			contact !== undefined && contact !== '' ) {

	 			 Organizations.add(login,pass,phone, contact, title,0,-1,0,0,0).then(function(response){
		 			console.log(response);
		 			if(response.data  == "success" ){
		 				//Users.saveUser(response.data.user);
		 				SweetAlert.swal("Поздравляем", "Вы успешно зарегистрировались", "success");	
		 				$state.go("login");
		 			}	

		 			if(response.data  == "exist") {
		 				console.log("fail");
		 				SweetAlert.swal("Ошибка", "Логин занят", "error");
		 			}
		 		}).catch(function(response){
		 			console.log(response);
		 			SweetAlert.swal("Ошибка", "Сервер временно не доступен", "error");
		 		});
	 		}else{
	 				SweetAlert.swal("Ошибка", "Заполните все поля", "error");
	 		}
	 		
	 	}	

	});
