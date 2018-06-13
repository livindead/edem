angular.module('myApp')
	.controller('MenuCtrl', function($scope,$state,$window ,$timeout,Users,SweetAlert) {
			$scope.user = Users.loadUser();
			$scope.currPage = "index";
 

			if($scope.user == '' || $scope.user == undefined){
				$scope.user = {rights:1};
				console.log( "user null ");
			} 
			
			$scope.logout = function(){
				Users.clearUser();
			}
			
			$scope.$watch(function () { 
				 	var val = Users.loadUser();
				 	$scope.user = val;
				 	$scope.currPage = $state.current.name;
				}, function (value) {
				      //$scope.user = value;
			});
 	
	})	;