angular.module('myApp')
	.controller('ProfileCtrl', function($scope,$state,Users) {
		 $scope.user = Users.loadUser(); 
		 console.log($scope.user );

		 $scope.logout = function(){
		 	Users.clearUser();
		 	$state.go('login');
		 }

		 $scope.updatePass = function(pass1){
		 	if(pass1.length > 5 ){
		 		var data = {
					id:$scope.user.id,
					pass: pass1
				};
				Organizations.updatePass(data).then(function(response){
					console.log(response);
				}).catch(function(response){
					console.log(response);
					SweetAlert.swal("Ошибка", "Сервер временно не доступен", "error");
				});
		 	}else {
		 		SweetAlert.swal("Ошибка", "Пароль должен бытьт не менее 5 знаков", "error");
		 	}
		 	
		 }

		 $scope.updateInfo = function(pass1){
		 	 
		 		var data = {
					id:$scope.user.id,
					fio: $scope.user.pass,
					mail: $scope.user.mail,
					phone: $scope.user.phone
				};
				Organizations.updateInfo(data).then(function(response){
					console.log(response);
				}).catch(function(response){
					console.log(response);
					SweetAlert.swal("Ошибка", "Сервер временно не доступен", "error");
				});
		 	 
		 	
		 }
		 
	})