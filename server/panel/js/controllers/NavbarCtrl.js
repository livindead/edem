angular.module('myApp')
	.controller('NavbarCtrl', function($scope,$state,$window ,$timeout,Users,SweetAlert) {
			$scope.user = Users.loadUser();
			$scope.currPage = "index";
 

			if($scope.user == '' || $scope.user == undefined){
				$scope.user = {rights:1};
				console.log( "user null ");
			} 
			
			$scope.logout = function(){
				Users.clearUser();
			}
			
			$scope.toggle = function(){
				var body = angular.element( document.querySelector( 'body' ) );
				body.toggleClass('overlay-open');
			}
		 	
 	
	})	;