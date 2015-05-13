var app = angular.module('MESTO', ['ngRoute']);
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl:'home.html', controller:'mapCTL'});
    $routeProvider.when('/site', {templateUrl:'sites.html', controller:'siteCTL', controllerAs:'siteCTL'});
    $routeProvider.when('/room', {templateUrl:'rooms.html', controller:'roomCTL', controllerAs:'roomCTL'});
    $routeProvider.when('/equip', {templateUrl:'equipments.html', controller:'equipmentCTL', controllerAs:'equipCTL'});
    $routeProvider.when('/admin', {templateUrl:'mt-admin/mt-login.html'});
    $routeProvider.when('/admin/home', {templateUrl:'mt-admin/mt-home.html'});
    $routeProvider.when('/admin/site', {templateUrl:'mt-admin/mt-sites.html', controller:'siteCTL', controllerAs:'siteCTL'});
    $routeProvider.when('/admin/sites', {templateUrl:'mt-admin/mt-lstSites.html', controller:'siteCTL', controllerAs:'siteCTL'});
    $routeProvider.when('/admin/room', {templateUrl:'mt-admin/mt-rooms.html', controller:'roomCTL', controllerAs:'roomCTL'});
    $routeProvider.when('/admin/rooms', {templateUrl:'mt-admin/mt-lstRooms.html', controller:'roomCTL', controllerAs:'roomCTL'});
    $routeProvider.when('/admin/equip', {templateUrl:'mt-admin/mt-equipments.html', controller:'equipmentCTL', controllerAs:'equipCTL'});
    $routeProvider.when('/admin/equipments', {templateUrl:'mt-admin/mt-lstEquipments.html', controller:'equipmentCTL', controllerAs:'equipCTL'});
    $routeProvider.when('/admin/permissions', {templateUrl:'mt-admin/mt-lstPermissions.html', controller:'permissionCTL', controllerAs:'permissionCTL'});
    $routeProvider.when('/admin/user', {templateUrl:'mt-admin/mt-users.html', controller:'userCTL', controllerAs:'userCTL'});
    $routeProvider.when('/admin/users', {templateUrl:'mt-admin/mt-lstUsers.html', controller:'userCTL', controllerAs:'userCTL'});
    $routeProvider.otherwise({redirectTo:"/home"});
}]);

app.run(function($rootScope, $location, securitySrv) {
    var routeRestricted = ['/admin/home', '/admin/site', '/admin/sites', '/admin/room', '/admin/rooms', '/admin/equip', '/admin/equipments', '/admin/permissions', '/admin/user', '/admin/users'];
    var forbiddenCall = ['.html', '.php'];
    $rootScope.$on('$routeChangeStart', function() {
        if ("/admin/".indexOf($location.path()) != -1 && securitySrv.isLogged()) {
            $location.path('/admin/home');
        }
        else if (routeRestricted.indexOf($location.path()) != -1 && !securitySrv.isLogged()) {
            $location.path('/home');
        }
        else if (forbiddenCall.indexOf($location.path()) != -1) {
            $location.path('/home');
        }
    });
});

app.factory('navigateSrv', function() {
    var equip = null;
    var room = null;
    var site = null;
    var user = null;
    
    // TODO: to each 'set' we could use "cleanMemory" instead of manual nullation
    function setEquip(p_equip) {
        equip = angular.copy(p_equip); 
        room = null;
        site = null;
        user = user;
    };
    function setRoom(p_room) {
        equip = null; 
        room = angular.copy(p_room);
        site = null;
        user = user;
    };
    function setSite(p_site) {
        equip = null; 
        room = null;
        site = angular.copy(p_site);
        user = user;
    };
    function setUser(p_user) {
        equip = null; 
        room = null;
        site = null;
        user = angular.copy(p_user);
    };
    
    function getEquip() {
        return equip;
    };
    function getRoom() {
        return room;
    };
    function getSite() {
        return site;
    };
    function getUser() {
        return user;
    };
    
    function cleanMemory() {
        equip = null; 
        room = null;
        site = null;
        user = null;
    }
    
    return {
        cleanMemory : cleanMemory,
        setEquip : setEquip,
        getEquip : getEquip,
        setRoom : setRoom,
        getRoom : getRoom,
        setSite : setSite,
        getSite : getSite,
        setUser : setUser,
        getUser : getUser
    };
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
                if (data.msg != '' && data.obj != '') {
                    loadUser(data.obj);
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
    
    function loadUser(pId) {
        return $http({
            method: 'POST',
            url: "/MESTO/MESTO_WEB_APP/php/DAOUser.php", // TODO: Make a config with path
            data: {id:pId},
            headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(
            function(data, status) {
                if (data.error == null) {
                    createUser(data[0]);
                }
                else {
                }
            }
        ).error(
            function(data, status, headers, config, statusText) {
                // TODO: error server handling
            });
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
    
    function getUserName() {
        return (currentUser) ? currentUser.name : null;
    }
    
    return {
        login : login,
        logout : logout,
        isLogged : isLogged,
        getUserName : getUserName
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