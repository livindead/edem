angular.module('starter.controllers').controller('CatalogCategoryCtrl', ['$scope', '$http', function($scope,$state,$location,Dinners,Login,Stuards,$ionicModal,$ionicPopup,$timeout) {
  
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

  $scope.setTag = function(arr){
    console.log(arr);
    if(arr !== undefined){
      var id = '';
      for (var i = 0; i < arr.length; i++) {
        id = arr[i].id + ',' + id;
      }
      id = id.slice(0, id.length -1);
      Stuards.getAllStuardByNetId(id).then(function(response){
        Stuards.setSelectedNetworkTag(response.data);   
        console.log(Stuards.getSelectedNetworkTag());
        $state.go("app.map" );       
      }).catch(function(response){
        console.log(response);
      });
    } else {
      $scope.Err("В выбранном разделе нет еды :(");
    }  
  };

  var sort = function (obj){
    var tags = [];
      for(var i=0;i<obj.length;i++){
        for (var j = 0; j < obj[i].type.length; j++) {
          var kk = parseInt(obj[i].type[j]);
          if(tags[kk] == undefined) tags[kk] = [];
          tags[kk].push(obj[i]); 
        };
      }
    return tags;  
  } 

  var groupBy = function (collection, kk) {
    var i = 0, val, index,
        values = [], result = [];
    for (; i < collection.length; i++) {
      val = collection[i].type[kk];
      index = values.indexOf(val);
      if (index > -1){
        result[index].push(collection[i]);
      }
      else {
        values.push(val);
        result.push([collection[i]]);
      }
    }
    return result;
  }
/*
  Dinners.getDinnersNetworks().then(function(response){
    var data = response.data;
    for(var i = 0;i < data.length;i++){
      data[i].type = JSON.parse(data[i].type);
    }
    $scope.networks =  sort(data);
      console.log($scope.networks);
  }).catch(function(response){
    console.log(response);
  });
*/
}]);