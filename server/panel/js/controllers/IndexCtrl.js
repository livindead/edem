angular.module('myApp')
	.controller('IndexCtrl', function($scope,$filter, $timeout,Users,Upload, Organizations,SweetAlert) {
			$scope.networks = [];
			$scope.currentPage = 0;
    		$scope.pageSize = 5;
    		$scope.q = '';
    		$scope.image_loader = false;


			var getAllOrgs = function(){
				$scope.loader = true;
				Organizations.getAllNetworks().then(function(res){
					console.log(res);
					$scope.networks = res.data;
					for (var i = $scope.networks.length - 1; i >= 0; i--) {
						$scope.networks[i].logo = '../public/uploads/images/'+$scope.networks[i].logo;
					}
					$scope.arrOfPages = [];
					for (var i = 0; i < Math.ceil($scope.getData().length/$scope.pageSize) ; i++) {
						$scope.arrOfPages.push({id:i});
					}
					$scope.loader = false;
				}).catch(function(res){
					$scope.loader = false;
					console.log(res);
				});
			}

			$scope.addNetwork = function(s_title,s_contact){
				if(s_title != '' && s_contact != ''){
					var data = {
						title: s_title,
						image: $scope.image.image,
						email: '',
						contact: s_contact
					};

					Organizations.addNetwork(data).then(function(response){
						console.log(response);
						getAllOrgs();
					}).catch(function(response){
						console.log(response);
						SweetAlert.swal("Ошибка", "Ошибка сети или доступа", "error");
					});
				}

			}

			$scope.editNetwork = function(s_id,s_logo,s_title,s_contact){
				var data = {
					id: s_id,
					title: s_title,
					image: s_logo,
					contact: s_contact
				};

				Organizations.editNetwork(data).then(function(response){
					console.log(response);
					getAllOrgs();
				}).catch(function(response){
					console.log(response);
					SweetAlert.swal("Ошибка", "Ошибка сети или доступа", "error");
				});
			}

			$scope.changeLockStatus = function(id,status){
				status = parseInt(status);
				if(status == 0) status = 1; else if(status == 1) status = 0;


			 	SweetAlert.swal({
				   title: "Вы уверены?",
				   text: "Вы действительно хотите сменить статус сети ?",
				   type: "info",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",confirmButtonText: "Да",
				   cancelButtonText: "Нет",
				   closeOnConfirm: false,
				   closeOnCancel: false }, 
						function(isConfirm){ 
						   if (isConfirm) {
						     Organizations.changeAllowStatusNetwork(id,status).then(function(response){
							 		console.log(response);
							 		getAllOrgs();
							 		SweetAlert.swal("Успешно", "Вы успешно отключили сеть", "success");
							 }).catch(function(response){
							 		console.log(response);
							 });

						   } else {
						      SweetAlert.swal("Отменено", "Вы отменили действие :)", "error");
						   }
						});


			}


			$scope.getData = function () {
		      return $filter('filter')($scope.networks, $scope.q)
		    }
		    
		    $scope.numberOfPages=function(){
		        return Math.ceil($scope.getData().length/$scope.pageSize);                
		    }

		    $scope.setPageByNum = function(val){
		    	$scope.currentPage = parseInt(val);
		    }

		    $scope.setNexPage = function(){
		    	var size = $scope.numberOfPages();
		    	if($scope.currentPage + 1 <= size-1 ) $scope.currentPage = $scope.currentPage + 1;
		    }

		    $scope.setPrevPage = function(){
		    	if($scope.currentPage > 0) $scope.currentPage = $scope.currentPage - 1;
		    }

		    $scope.uploadLogo = function(file, errFiles) {
		    		$scope.image_loader = true;

			        $scope.f = file;
			        $scope.errFile = errFiles && errFiles[0];
			        file.done = false;
			        if (file) {
			            file.upload = Upload.upload({
			                url: 'http://test.interkot.ru/edim-server/api/image/add/',
			                //url: 'cp.edem-edim.ru/panel/app/add_image.php',
			                file: file 
			            });

			            file.upload.then(function (response) {
			            	file.done = true; 	
			                $scope.image = response.data;
			                $scope.image_loader = false;
			                console.log(response);
			               	
			            }, function (response) {
			               // if (response.status > 0)
			               //    $scope.errorMsg = response.status + ': ' + response.data;
			            }, function (evt) {
			               // file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			            });
			        }   
			}
		    

			getAllOrgs();


	});