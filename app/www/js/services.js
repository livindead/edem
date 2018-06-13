angular.module('starter.services', [])

.factory('Login', function($http) {
  var host = 'https://cp.edem-edim.ru/';

  var response;
  var luser = [];
  var user = [];

  return {
      add : function(newObj) {
        user = newObj;
      },
      get : function(){
        return user;
      },
      saveUser: function (user) {
          localStorage.setItem('user', JSON.stringify(user));
      },
      setInfoState: function(state) {
        localStorage.setItem('moreState', state);
      },
      setSaleState: function(saleCode,state) {
        var sales = localStorage.getItem('saleState');
        if(sales != '' && sales != null && sales != 'null' ){
              sales = JSON.parse(sales);
        } else {
            sales = [{code:saleCode,status:state}];
        }

        localStorage.setItem('saleState', JSON.stringify(sales));
      },
      checkSaleState: function(code) {
        var status = true;
        var sales = JSON.parse(localStorage.getItem('saleState') );
        if(sales != '' && sales != null && sales != 'null' ){ 
           for (var i = sales.length - 1; i >= 0; i--) {
            if(sales[i].code == code) status = false;
          };
        }  
       
        return status;
      },
      getInfoState: function() {
        return localStorage.getItem('moreState');
      },
      loadUser: function () {
          var storageUser = localStorage.getItem('user');
          if(storageUser != '') luser = JSON.parse(storageUser);
          return luser;
      },
      clearUser: function() {
         localStorage.setItem('user','');
      },
      getFavorites: function () {
          var favor = localStorage.getItem('favorites');
          if(favor != '') favor = JSON.parse(favor);
          return favor;
      },
      setFavorites: function (val) {
          localStorage.setItem('favorites', JSON.stringify(val));
      },
      getMyPoints: function () {
          var favor = localStorage.getItem('mypoints');
          if(favor != '' && favor != null && favor != 'null'){
            favor = JSON.parse(favor);
          } else {
            favor = [];
          }
          return favor;
      },
      setMyPoints: function (val) {
          localStorage.setItem('mypoints', JSON.stringify(val));
      },
      getMyRoutsHistory: function () {
          var route = localStorage.getItem('myrouts');
          if(route != '' && route != null && route != 'null' ){
              route = JSON.parse(route);
          } else {
            route = [];
          }
          return route;
      },
      setMyRoutsHistory: function (val) {
          localStorage.setItem('myrouts', JSON.stringify(val));
      },

      check : function(login,pass){
        url = 'index.php?mobile=y&status=check_login&login='+login+'&pass='+pass+'&callback=JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      reg : function(name,lname,phone,car_num,car_col){
        var url = 'index.php?mobile=y&status=get_pass&name='+name+'&lastname='+lname+'&phone='+phone+'&car='+car_num+'&col='+car_col+'&callback=JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      update : function(arr,id){
       url = 'index.php?mobile=y&status=update_user&arr='+JSON.stringify(arr)+'&callback=JSON_CALLBACK';
       url = host + url;
       console.log(url);
       return $http.jsonp(url);
      },
      clear : function(){
        user = [];
      }

  };
})

.factory('Dinners', function($http) {
  var host = 'https://cp.edem-edim.ru/';
  var response;

  var dinners = [];
  var price = 0;
  var point_id = 0;
  var timer = 0;
  return {
      addItems : function(newObj) {
        dinners = newObj;
      },
      addPoint : function(newObj) {
        point_id = newObj;
      },
      getItems : function(){
        return dinners;
      },
      getPoint : function(){
        return point_id;
      },
      addPrice : function(newObj) {
        price = newObj;
      },
      getPrice : function(){
        return price;
      },
      clear : function(){
        dinnerss = [];
      },
      getDinners : function(){
        url = 'index.php?mobile=y&status=get_dinners&callback=JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      getCategoryDinnersById : function(id){
        url = 'index.php?mobile=y&status=get_category_dinners_by_id&id='+id+'&callback=JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      getDinnersById : function(id){
        url = 'index.php?mobile=y&status=get_all_dinners_by_net_id&id='+id+'&callback=JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },getAllNetworks : function(id){
        url = 'index.php?mobile=y&status=get_all_networks_type&callback=JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },getDinnersByNetId : function(id){
        url = 'index.php?mobile=y&status=get_all_dinners_by_net_type_id&id='+id+'&callback=JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      getDinnersNetworks : function(id){
        url = 'index.php?mobile=y&status=get_all_networks&callback=JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },getDinnersByNetworkId : function(id){
        url = 'index.php?mobile=y&status=get_all_dinners_by_net_id&id='+id+'&callback=JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },getDinnersByPointId : function(id){
        url = 'index.php?mobile=y&status=get_all_dinners_by_point_id&id='+id+'&callback=JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },checkSale : function(code){
        url = 'index.php?mobile=y&status=check_sale&code='+code+'&callback=JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      order : function(userid,cart){
        url = 'index.php?mobile=y&status=order&id='+userid+'&cart='+JSON.stringify(arr)+'&callback=JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      buy : function(arr){
       url = 'index.php?mobile=y&status=add_order&arr='+JSON.stringify(arr)+'&callback=JSON_CALLBACK';
       url = host + url;
       console.log(url);
       return $http.jsonp(url);
      },
      pay : function(id, cost){
       url = '/app/payment.php?id='+id+'&cost='+cost+'&callback=JSON_CALLBACK';
       url = host + url;
       console.log(url);
       return $http.jsonp(url);
      },
      setUserArrTime : function(id, time,coord){
       url = 'index.php?mobile=y&status=set_order_arrival_time&id='+id+'&time='+time+'&coord='+JSON.stringify(coord)+'&callback=JSON_CALLBACK';
       url = host + url;
       console.log(url);
       return $http.jsonp(url);
      },
      cancel : function(id){
        url = 'index.php?mobile=y&status=cancel_order&id='+id+'&callback=JSON_CALLBACK';
        url = host + url;
        console.log(url);
        return $http.jsonp(url);
      },
      setTimer: function(nTimer){
        timer = nTimer;
      },
      clearTimer: function(){
        clearInterval(timer);
        console.log("all clear");
      }

  };
})

 .factory('Stuards', function($http) {
      var host = 'https://cp.edem-edim.ru/';
      var StuardId = 0;
      var is_select = false;
      var Stuard= [];
      var SelectedNetworkTag = null; 

      return {
        getAll: function() {
           url = 'index.php?mobile=y&status=get_stuard&callback=JSON_CALLBACK';
           url = host + url;
           console.log(url);
           return $http.jsonp(url);
        },
        getAllPoints: function() {
           url = 'index.php?mobile=y&status=get_points&callback=JSON_CALLBACK';
           url = host + url;
           console.log(url);
           return $http.jsonp(url);
        },
        getAllWithSchedule: function() {                      
           url = 'index.php?mobile=y&status=get_points_on_schedule&callback=JSON_CALLBACK';
           url = host + url;
           console.log(url);
           return $http.jsonp(url);
        },
        selectStuardId : function(id) {
            StuardId = id;
        },
        getStuardId : function() {
            return StuardId;
        },
        selectStuard : function(newObj) {
            Stuard = newObj;
        },
        get : function(){
            return Stuard;
        },
        clear : function(){
            Stuard = [];
        },
        selectBuyCatalog: function(val){
           is_select = val; 
        },
        isSelectBuyCatalog: function(){
          return is_select;
        },
        checkFood : function(sid,arr){
         url = 'index.php?mobile=y&status=check_stuard_food&arr='+JSON.stringify(arr)+'&id='+sid+'&callback=JSON_CALLBACK';
         url = host + url;
         console.log(url);
         return $http.jsonp(url);
        },
        getById: function(id) {
           url = 'index.php?mobile=y&status=get_stuard_by_id&id='+id+'&callback=JSON_CALLBACK';
           url = host + url;
           console.log(url);
           return $http.jsonp(url);
        },getAllStuardByNetId: function(id) {
           url = 'index.php?mobile=y&status=get_all_stuard_by_net_id&id='+id+'&callback=JSON_CALLBACK';
           url = host + url;
           console.log(url);
           return $http.jsonp(url);
        },
        setSelectedNetworkTag: function(arr) {
          SelectedNetworkTag = arr;
        },
        getSelectedNetworkTag: function() {
          return SelectedNetworkTag;
        }

  };
})

.factory('Orders', function($http) {
  var host = 'https://cp.edem-edim.ru/';
  var url = 'index.php?mobile=y&status=get_orders&callback=JSON_CALLBACK';
  url = host + url;
  var data = [];
  var response;

  return {
    add : function(newObj) {
        data = newObj;
      },
    get : function(id){
      var item = [];
        angular.forEach(data, function(value, key) {
           if(value['id'] == id) item  =  value;      
        });
        return  item;
      },
    all: function() {
      return data;
    },
    getData: function() {
       return $http.jsonp(url);
    },
    getOrdersById: function(id) {
       url = 'index.php?mobile=y&status=get_ordersbyid&id='+id+'&callback=JSON_CALLBACK';
       url = host + url;
       console.log(url);
       return $http.jsonp(url);
    },
    getOrdersRaiting: function(id) {
       url = 'index.php?mobile=y&status=get_orders_raiting&id='+id+'&callback=JSON_CALLBACK';
       url = host + url;
       console.log(url);
       return $http.jsonp(url);
    },
    setRaiting: function(id,count,text) {
       url = 'index.php?mobile=y&status=set_raiting&id='+id+'&count='+count+'&callback=JSON_CALLBACK';
       url = host + url;
       console.log(url);
       return $http.jsonp(url);
    },
    sendSMSOnPoint: function(oid,sid,status) {
       url = 'index.php?mobile=y&status=send_sms&sid='+sid+'&orderid='+oid+'&sms_status='+status+'&callback=JSON_CALLBACK';
       url = host + url;
       console.log(url);
       return $http.jsonp(url);
    }
  };
})

.factory('Auth', function($firebaseAuth) {
    //var endPoint = 'https://edim-edem.firebaseio.com/' ;
    var usersRef = new Firebase('https://edim-edem-69b06.firebaseio.com');
    return $firebaseAuth(usersRef);
  })


 ;
