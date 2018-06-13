myApp.factory('Organizations', function($http) {
	var host = 'http://test.interkot.ru/edim-server/api/';

  return {
      getAllNetworks : function(){
        url = '/networks/get/all/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      }, 
      addNetwork : function(data){
         var url = '/networks/add/';
         url = host + url;
         console.log(url);
         data['token'] = localStorage.getItem('token');
         return $http({
            'url':url,
            'method':'POST', 
            'data': data,
            'headers': { 'Content-Type' :'application/json'}
          });
      },
      editNetwork : function(data){
         var url = '/networks/edit/';
         url = host + url;
         console.log(url);
         data['token'] = localStorage.getItem('token');
         return $http({
            'url':url,
            'method':'POST', 
            'data': data,
            'headers': { 'Content-Type' :'application/json'}
          });
      },
       changeAllowStatusNetwork : function(id,val){
        var token = localStorage.getItem('token');

        url = '/networks/set/status/'+id+'/'+val+'/'+token+'/JSON_CALLBACK';
        url = host + url;
        console.log(url);
       
        return $http.jsonp(url);
      },
      updateInfo: function(name,sid,pd,pp,pt,id){
        url = '/partner/set/info/'+name+'/'+sid+'/'+pd+'/'+pp+'/'+pt+'/'+id+'/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      }

      

  };
})

.factory('Restourants', function($http) {
  var host = 'http://test.interkot.ru/edim-server/api/';
 
  var response;

  return {
    
      getAll : function() {
        url = '/restaurant/get/all/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      getAllByNetworkId : function(id) {
        url = '/restaurant/get/network/'+id+'/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      editRestourant : function(data) {
         var url = '/restaurant/edit/';
         url = host + url;
         console.log(url);
         data['token'] = localStorage.getItem('token');
         return $http({
            'url':url,
            'method':'POST', 
            'data': data,
            'headers': { 'Content-Type' :'application/json'}
          });
      },
      changeAllowStatusRes : function(id,val){
        var token = localStorage.getItem('token');
        url = '/restaurant/set/status/'+id+'/'+val+'/'+token+'/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      fastAddPoint: function(data) {
         var url = '/restaurant/add/fast/';
         url = host + url;
         console.log(url);
         data['token'] = localStorage.getItem('token');
         return $http({
            'url':url,
            'method':'POST', 
            'data': data,
            'headers': { 'Content-Type' :'application/json'}
          });
      } 
       

  };
})

.factory('Dinners', function($http) {
  var host = 'http://test.interkot.ru/edim-server/api/';
 
  var response;

  return {
    
      getAll : function(page) {
        url = '/dinners/get/all/'+page+'/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      getAllByNetId : function(id) {
        url = '/dinners/get/network/id/'+id+'/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      getAllCategory : function(id) {
        url = '/dinners/get/category/all/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      search : function(line) {
        url = '/dinners/search/'+line+'/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      }

  };
})

.factory('Orders', function($http) {
  var host = 'http://test.interkot.ru/edim-server/api/';
 
  var response;

  return {
    
      getAll : function() {
        url = '/orders/get/all/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      getOrgByCity : function(id) {
        url = '/partner/city/'+id+'/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      getAllByCity : function(id) {
        url = '/orders/get/bycity/'+id+'/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      getAllByOrg : function(id) {
        url = '/orders/get/byorg/'+id+'/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      }
       

  };
})


.factory('Users', function($http) {
  var host = 'http://test.interkot.ru/edim-server/api/';
  var luser;

  return {

  saveUser: function (user,token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
  },
  clearUser: function () {
      localStorage.setItem('user', '');
      localStorage.setItem('token', '');
  },
  loadUser: function () {
      var storageUser = localStorage.getItem('user');
      if(storageUser != '' && storageUser != 'undefined') luser = JSON.parse(storageUser);
      return luser;
  },

  getAll : function(){
        url = '/user/getall/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
   },
   login : function(login,pass){
        url = '/panel/user/login/'+login+'/'+pass+'/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
    },
    updatePass : function(data){
         var url = '/panel/user/update/pass/';
         url = host + url;
         console.log(url);
         data['token'] = localStorage.getItem('token');
         return $http({
            'url':url,
            'method':'POST', 
            'data': data,
            'headers': { 'Content-Type' :'application/json'}
          });
    },
    updateInfo : function(data){
         var url = '/panel/user/update/info/';
         url = host + url;
         console.log(url);
         data['token'] = localStorage.getItem('token');
         return $http({
            'url':url,
            'method':'POST', 
            'data': data,
            'headers': { 'Content-Type' :'application/json'}
          });
    }
    

        };
})

.factory('Payments', function($http) {
  var host = 'http://test.interkot.ru/edim-server/api/';
  var luser;

  return {

   getAll : function(){
        url = '/payment/get/all/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
    byId : function(id){
        url = '/payment/get/id/'+id+'/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
    add : function(login,pass){
        url = '/panel/login/'+login+'/'+pass+'/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      }
  };
})

.factory('Deals', function($http) {
  var host = 'http://test.interkot.ru/edim-server/api/';
  var luser;

  return {

   getAll : function(){
        url = '/deals/all/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      }
  };
})

.factory('Settings', function($http) {
  var host = 'http://test.interkot.ru/edim-server/api/';
  var luser;

  return {

   setPayPrice : function(price){
        url = '/payment/setprice/'+price+'/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
   getPayPrice : function(){
        url = '/payment/getprice/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      }  
  };
})

.factory('Citys', function($http) {
  var host = 'http://test.interkot.ru/edim-server/api/';
  var adress = "";
  var adress2 = "";
  var response;

  return {
    
 
      getAll : function() {
        url = '/city/all/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      add : function(title) {

        url = '/city/add/'+title+'/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      del : function(id) {

        url = '/city/del/'+id+'/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      setPercent : function(id,perc){

        url = '/city/set/percent/'+id+'/'+perc+'/JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      setAdress2 : function(line) {
        adress2 = line;
      },
      getAdress2 : function(){
        return adress2;
      }


  };
})

;