var app = angular.module('MESTO', ['ngRoute']);
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl:'home.html', controller:'mapCTL'});
    $routeProvider.when('/site', {templateUrl:'sites.html', controller:'siteCTL'});
    $routeProvider.when('/room', {templateUrl:'rooms.html', controller:'roomCTL'});
    $routeProvider.when('/equip', {templateUrl:'equipments.html', controller:'equipmentCTL'});
    $routeProvider.when('/admin', {templateUrl:'mt-admin/index.php'});
    $routeProvider.otherwise({redirectTo:"/home"});
}]);

app.run(function($rootScope, $location, securitySrv) {
    var routeRestricted = ['/admin'];
    var forbiddenCall = ['.html', '.php'];
    $rootScope.$on('$routeChangeStart', function() {
        if (routeRestricted.indexOf($location.path()) != -1 && !securitySrv.isLogged()) {
            $location.path('/home');
        }
        else if (forbiddenCall.indexOf($location.path()) != -1) {
            $location.path('/home');
        }
    });
});

app.factory('securitySrv', function($http, $location) {
    var currentUser = null;
    
    function login(pData) {
        return $http({
            method: 'POST',
            url: "/MESTO/MESTO_WEB_APP/php/login.php", // TODO: Make a config with path
            data: pData,
            headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(
            function(data, status) {
                if (data.msg != '') {
                    createUser({id: "id", userId: "Jooj"});
                    $location.path('/admin');
                }
                else {
                }
            }
        ).error(
            function(data, status, headers, config, statusText) {
                // TODO: error server handling
            }
        );
    }
    
    function logout() {
        currentUser = null;
        $location.path('/home');
    }
    
    function isLogged() {
        return currentUser != null;
    }
    
    function createUser(user) {
        currentUser = user;
    };
    
    function getUsername() {
        return currentUser.userId;
    }
    
    return {
        login : login,
        logout : logout,
        isLogged : isLogged,
        getUsername : getUsername
    }
});

app.factory('googleMap', function() {
    var mapOptions = {
        center: { lat: 45.899566, lng: -72.894373},
        zoom: 8
    };
    
    var mainMap = null;
    var zones = null;
    
    function getMap() {
        try {
            //if (mainMap == null) {
                mainMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            //}
            
            //if (zones == null) {
                zones = new geoXML3.parser({
                    map: mainMap, 
                    zoom: false,
                    suppressInfoWindows: true
                });
                zones.parse('limits/Zones.kml');
            //}
        }
        catch (e) {}
        
        return mainMap;
    }
    
    return { getMap : getMap };
});