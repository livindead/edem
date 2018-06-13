angular.module('myApp')
	.controller('RestaurantCtrl', function($scope,$window, $state,$stateParams,$filter,SweetAlert,Organizations,Restourants, Dinners) {
 	 	$scope.restaurants = [];
 	 	$scope.categorys = [];
 	 	$scope.dinners = [];

		$scope.currentPage = 0;
    	$scope.pageSize = 10;
    	$scope.netSort =  '';
    	$scope.catSort = '';
    	$scope.q = '';

 	 	var getOtherList = function(){
 	 			Organizations.getAllNetworks().then(function(res){
					console.log(res);
					$scope.networks = res.data;
				}).catch(function(res){
					$scope.loader = false;
					console.log(res);
				});
 	 	}

 	 	var IsJsonString = function (str) {
		    try {
		        JSON.parse(str);
		    } catch (e) {
		        return false;
		    }
		    return true;
		}

		var getAllCategory = function(){
			Dinners.getAllCategory().then(function(res){
				console.log(res);
				$scope.categorys = res.data;
			}).catch(function(res){
				console.log(res);
			});
		}

		$scope.getAllDinners = function(page){
			$scope.loader = true;
			Dinners.getAll(page).then(function(res){
				console.log(res);
				$scope.dinners = res.data;
				$scope.loader = false;
			}).catch(function(res){
				console.log(res);
			});
		}

		$scope.searchDinner = function(line){
			$scope.loader = true;
			Dinners.search(line).then(function(res){
				console.log(res);
				$scope.dinners = res.data;
				$scope.loader = false;
			}).catch(function(res){
				console.log(res);
			});
		}

		var getAllCategory = function(){
			Dinners.getAllCategory().then(function(res){
				console.log(res);
				$scope.categorys = res.data;
				for (var i = $scope.categorys.length - 1; i >= 0; i--) {
					$scope.categorys[i].icon = '../public/uploads/images/'+$scope.categorys[i].icon;
				}
			}).catch(function(res){
				console.log(res);
			});
		}

 	 	var getAllRestourants = function(){
 	 			$scope.loader = true;
	 	 		var networkId = $stateParams.id;
	 	 		if(networkId == null || networkId == ''){
	 	 			
	 	 			Restourants.getAll().then(function(res){
	 	 				console.log(res);
	 	 				$scope.restaurants = res.data;
	 	 				$scope.arrOfPages = [];
						for (var i = 0; i < Math.ceil($scope.getData().length/$scope.pageSize) ; i++) {
							$scope.arrOfPages.push({id:i});
						}
						for (var i = $scope.restaurants.length - 1; i >= 0; i--) {
							if( IsJsonString($scope.restaurants[i].phone)  ){
								var arr = JSON.parse($scope.restaurants[i].phone)
								if( Array.isArray(arr) ){
									$scope.restaurants[i].phone = arr;
								} else {
									$scope.restaurants[i].phone = [arr];
								}
								
							} else {
								$scope.restaurants[i].phone = [''];
							}	
						}
	 	 				$scope.loader = false;
	 	 			}).catch(function(res){
	 	 				console.log(res);
	 	 				$scope.loader = false;
	 	 			});
	 	 		} else {
	 	 			Restourants.getAllByNetworkId(networkId).then(function(res){
	 	 				console.log(res);
	 	 				$scope.restaurants = res.data;
	 	 				
	 	 				$scope.loader = false;
	 	 			}).catch(function(res){
	 	 				console.log(res);
	 	 				$scope.loader = false;
	 	 			});
	 	 		}
 	 	}
 	 	getOtherList();
 	 	getAllRestourants();



 	 	function escapeHtml(unsafe) {
				    return (unsafe
				    	 .replace(/&/g, "&amp;")
				         .replace(/</g, "")
				         .replace(/>/g, "")
				         .replace(/"/g, "")
				         .replace(/'/g, ""));
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

		$scope.firtsLoaderByTab = function(tabId){
			if(tabId == 1 && $scope.dinners.length == 0){
				$scope.getAllDinners(0);
				getAllCategory();
			} else if(tabId == 2 && $scope.restaurants.length == 0){
				getAllRestourants();
			} else if(tabId == 3 && $scope.categorys.length == 0){
				getAllCategory();
			}
		} 

		$scope.scrollTop = function(){
			$window.scrollTo(0, 0);
		}

 	 	$scope.addPhone = function(id,phone,arr){
 	 		if(phone != '' && phone != undefined ){
 	 			arr.push(phone);

 	 			$scope.restaurants[id].phone = arr;
 	 		}
 	 		 
 	 		console.log($scope.restaurants[id]);
 	 		
 	 	}

 	 	$scope.changeLockStatus = function(id,status){
				status = parseInt(status);
				if(status == 0) status = 1; else if(status == 1) status = 0;


			 	SweetAlert.swal({
				   title: "Вы уверены?",
				   text: "Вы действительно хотите сменить статус ресторана ?",
				   type: "info",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",confirmButtonText: "Да",
				   cancelButtonText: "Нет",
				   closeOnConfirm: false,
				   closeOnCancel: false }, 
						function(isConfirm){ 
						   if (isConfirm) {
						     Restourants.changeAllowStatusRes(id,status).then(function(response){
							 		console.log(response);
							 		getAllRestourants();
							 		SweetAlert.swal("Успешно", "Вы успешно отключили сменили статус", "success");
							 }).catch(function(response){
							 		console.log(response);
							 		SweetAlert.swal("Ошибка", "Ошибка сети или доступа", "error");
							 });

						   } else {
						      SweetAlert.swal("Отменено", "Вы отменили действие :)", "error");
						   }
						});


		}

 	 	$scope.editPoint = function(p_id,p_adress,p_contact,p_email,p_login,p_pass,p_doc){
 	 		var data = {
 	 			id: escapeHtml(p_id),
 	 			adress: escapeHtml(p_adress),
 	 			phone: JSON.stringify(p_contact),
 	 			email: escapeHtml(p_email),
 	 			login: escapeHtml(p_login),
 	 			pass: escapeHtml(p_pass),
 	 			doc: escapeHtml(p_doc)
 	 		}

 	 		Restourants.editRestourant(data).then(function(res){
 	 			SweetAlert.swal("Успешно", "Вы успешно обновили точку", "success");
 	 			console.log(res);
 	 		}).catch(function(res){
 	 			console.log(res);
 	 			SweetAlert.swal("Ошибка", "Ошибка сети или доступа", "error");
 	 		});

 	 	}

 	 	$scope.addFastPoint = function(networkId ,restAddressAdd, restContactsAdd, restEmailAdd,  restLoginAdd, restPassAdd, restContractAdd){
 	 		if( networkId != '' &&  networkId != undefined 
 	 			&& restAddressAdd != '' && restAddressAdd != undefined
 	 			&& restContactsAdd != '' && restContactsAdd != undefined
 	 			&& restEmailAdd != '' && restEmailAdd != undefined
 	 			&& restLoginAdd != '' && restLoginAdd != undefined
 	 			&& restPassAdd != '' && restPassAdd != undefined
 	 			&& restContractAdd != '' && restContractAdd != undefined

 	 		 ){
 	 				var data = {
		 	 			network_id: networkId,
		 	 			adress: escapeHtml(restAddressAdd),
		 	 			phone: JSON.stringify(restContactsAdd),
		 	 			email: escapeHtml(restEmailAdd),
		 	 			login: escapeHtml(restLoginAdd),
		 	 			pass: escapeHtml(restPassAdd),
		 	 			doc: escapeHtml(restContractAdd)
		 	 		}

		 	 		Restourants.fastAddPoint(data).then(function(res){
		 	 			SweetAlert.swal("Успешно", "Вы успешно добавили точку", "success");
		 	 			getAllRestourants();
		 	 			console.log(res);
		 	 		}).catch(function(res){
		 	 			console.log(res);
		 	 			SweetAlert.swal("Ошибка", "Ошибка сети или доступа", "error");
		 	 		});
 	 		} else {
 	 			SweetAlert.swal("Ошибка", "Заполните все поля", "error");
 	 		}
 	 	

 	 	}

 	 	$scope.sortByNet = function(id){
 	 		$scope.netSort = id;
 	 	}

 	 	$scope.sortCategoryByNet = function(id){
 	 		$scope.catSort = id;
 	 	}

 	 	$scope.getData = function () {
		    return $filter('filter')($scope.restaurants, $scope.q)
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


	});