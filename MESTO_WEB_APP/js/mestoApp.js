var app = angular.module('MESTO', ['ngRoute', 'ngIdle']);

app.config(function($routeProvider, IdleProvider) {
    $routeProvider.when('/home', {templateUrl:'home.html', controller:'siteCTL', controllerAs:'siteCTL'});
    $routeProvider.when('/site', {templateUrl:'site.html', controller:'siteCTL', controllerAs:'siteCTL'});
    $routeProvider.when('/sites', {templateUrl:'sites.html', controller:'siteCTL', controllerAs:'siteCTL'});
    $routeProvider.when('/rooms', {templateUrl:'rooms.html', controller:'roomCTL', controllerAs:'roomCTL'});
    $routeProvider.when('/equips', {templateUrl:'equipments.html', controller:'equipmentCTL', controllerAs:'equipCTL'});
    $routeProvider.when('/admin', {templateUrl:'mt-admin/mt-login.html'});
    $routeProvider.when('/admin/home', {templateUrl:'mt-admin/mt-home.html'});
    $routeProvider.when('/admin/site', {templateUrl:'mt-admin/mt-sites.html', controller:'siteCTL', controllerAs:'siteCTL'});
    $routeProvider.when('/admin/sites', {templateUrl:'mt-admin/mt-lstSites.html', controller:'siteCTL', controllerAs:'siteCTL'});
    $routeProvider.when('/admin/room', {templateUrl:'mt-admin/mt-rooms.html', controller:'roomCTL', controllerAs:'roomCTL'});
    $routeProvider.when('/admin/rooms', {templateUrl:'mt-admin/mt-lstRooms.html', controller:'roomCTL', controllerAs:'roomCTL'});
    $routeProvider.when('/admin/equip', {templateUrl:'mt-admin/mt-equipments.html', controller:'equipmentCTL', controllerAs:'equipCTL'});
    $routeProvider.when('/admin/equipments', {templateUrl:'mt-admin/mt-lstEquipments.html', controller:'equipmentCTL', controllerAs:'equipCTL'});
    $routeProvider.when('/admin/permissions', {templateUrl:'mt-admin/mt-lstPermissions.html', controller:'permissionCTL', controllerAs:'permissionCTL'});
    $routeProvider.when('/admin/role', {templateUrl:'mt-admin/mt-userRole.html', controller:'userRoleCTL', controllerAs:'userRoleCTL'});
    $routeProvider.when('/admin/roles', {templateUrl:'mt-admin/mt-lstUserRoles.html', controller:'userRoleCTL', controllerAs:'userRoleCTL'});
    $routeProvider.when('/admin/user', {templateUrl:'mt-admin/mt-users.html', controller:'userCTL', controllerAs:'userCTL'});
    $routeProvider.when('/admin/users', {templateUrl:'mt-admin/mt-lstUsers.html', controller:'userCTL', controllerAs:'userCTL'});
    $routeProvider.otherwise({redirectTo:"/home"});
    
    IdleProvider.idle(10000);
    IdleProvider.timeout(5);
    IdleProvider.keepalive(false);
});

app.run(function($rootScope, $location, securitySrv) {
    var routeRestricted = ['/admin/home', '/admin/site', '/admin/sites', '/admin/room', '/admin/rooms', '/admin/equip', '/admin/equipments', '/admin/permissions', '/admin/role', '/admin/roles', '/admin/user', '/admin/users'];
    var forbiddenCall = ['.html', '.php'];

    securitySrv.checkLoggedUser().then(function () {
        $rootScope.$on('$routeChangeStart', function() {
            if ("/admin/".indexOf($location.path()) != -1 && securitySrv.isLogged() && securitySrv.isAuthorized('adminAccess')) {
                $location.path('/admin/home');
            }
            else if (routeRestricted.indexOf($location.path()) != -1 && (!securitySrv.isLogged() || !securitySrv.isAuthorized('adminAccess'))) {
                $location.path('/home');
            }
            else if (forbiddenCall.indexOf($location.path()) != -1) {
                $location.path('/home');
            }
        });
    });
    
    $rootScope.$on('IdleStart', function() {
        console.log('idle start');
    });

    $rootScope.$on('IdleEnd', function() {
        console.log('Idle end');
    });
    $rootScope.$on('IdleTimeout', function() {
        securitySrv.logout();
        alert('you have been aways? By security we log you out');
        console.log('log out');
    });
});

app.factory('navigateSrv', function() {
    var equip = null;
    var room = null;
    var site = null;
    var user = null;
    var userRole = null;
    
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
    function setUserRole(p_userRole) {
        equip = null; 
        room = null;
        site = null;
        user = null;
        userRole = angular.copy(p_userRole);
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
    function getUserRole() {
        return userRole;
    };
    
    function cleanMemory() {
        equip = null; 
        room = null;
        site = null;
        user = null;
        userRole = null;
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
        getUser : getUser,
        setUserRole : setUserRole,
        getUserRole : getUserRole
    };
});

app.factory('permissionSrv', function() {
    var lstPermissions = [];
    
    lstPermissions.push({codeName:"adminAccess",name:"Access to Admin Section", description:"Block Logging, show/hide navigation button"});
    lstPermissions.push({codeName:"deleteRole",name:"Delete existing role", description:"Show/Hide the delete button"});
    lstPermissions.push({codeName:"deleteUser",name:"Delete existing user", description:"Show/Hide the delete button"});
    lstPermissions.push({codeName:"deleteEquip",name:"Delete existing equipement", description:"Show/Hide the delete button"});
    lstPermissions.push({codeName:"deleteRoom",name:"Delete existing room", description:"Show/Hide the delete button"});
    lstPermissions.push({codeName:"deleteSite",name:"Delete existing site", description:"Show/Hide the delete button"});
    lstPermissions.push({codeName:"updateRole",name:"Modify existing role", description:"Enable/Disable the update function"});
    //lstPermissions.push({codeName:"chgRoleUser",name:"Change Role of a User", description:"Show/Hide button of Role Management in UserForm"});
    lstPermissions.push({codeName:"chgPWDUser",name:"Change password of a User", description:"Block the update function when this value change "});
    lstPermissions.push({codeName:"updateUser",name:"Modify existing user", description:"Enable/Disable the update function"});
    lstPermissions.push({codeName:"updateEquip",name:"Modify existing equipment", description:"Enable/Disable the update function"});
    lstPermissions.push({codeName:"updateRoom",name:"Modify existing room", description:"Enable/Disable the update function"});
    lstPermissions.push({codeName:"updateSite",name:"Modify existing site", description:"Enable/Disable the update function"});
    lstPermissions.push({codeName:"createRole",name:"Create new Role", description:"Show/Hide functionalities in the Menu"});
    lstPermissions.push({codeName:"createUser",name:"Create new user", description:"Show/Hide functionalities in the Menu"});
    lstPermissions.push({codeName:"createEquip",name:"Create new equipment", description:"Show/Hide functionalities in the Menu"});
    lstPermissions.push({codeName:"createRoom",name:"Create new room", description:"Show/Hide functionalities in the Menu"});
    lstPermissions.push({codeName:"createSite",name:"Create new site", description:"Show/Hide functionalities in the Menu"});
    lstPermissions.push({codeName:"detailRoom",name:"See details of a room", description:"Stop the open Details Popup from list"});
    lstPermissions.push({codeName:"detailEquip",name:"See details of an equipment", description:"Stop the open Details Popup from list"});
    lstPermissions.push({codeName:"detailSite",name:"See details of a site", description:"Stop the open Details Popup from list"});
    
    return {
        lstPermissions : lstPermissions
    }
});

app.factory('securitySrv', function($http, $location, Idle) {
    var currentUser = null;
    var uId = null;
    
    function login(pData, then) {
        if (!then) return;
        
        $http({
            method: 'POST',
            url: "/MESTO/MESTO_WEB_APP/php/login.php", // TODO: Make a config with path
            data: pData,
            headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(
            function(data, status) {
                if (data.msg != null && data.msg != '' && data.obj != '') {
                    uId = data.uId;
                    loadUser(data.obj).then(then[0], then[1])
                                      .then(function(resp){if (currentUser != null) Idle.watch()});
                }
                else {
                    then[1]();
                }
            }
        ).error(
            function(data, status, headers, config, statusText) {
                then[1]();
            }
        );
    }
    
    function loadUser(pId) {
        return $http({
            method: 'POST',
            url: "/MESTO/MESTO_WEB_APP/php/DAOUser.php", // TODO: Make a config with path
            data: {id:pId,
                   activity:'login'},
            headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(
            function(data, status) {
                if (data.error == null) {
                    createUser(data[0]);
                }
                else {
                    currentUser = null;
                }
            }
        ).error(
            function(data, status, headers, config, statusText) {
                // TODO: error server handling
                currentUser = null;
            });
    }
    
    function checkLoggedUser() {
       return $http({
            method: 'POST',
            url: "/MESTO/MESTO_WEB_APP/php/loggedUser.php", // TODO: Make a config with path
            headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(
            function(data, status) {
                if (data != "") {
                    createUser(data.obj);
                    uId = data.uId;
                    Idle.watch();
                }
            }
        ).error(
            function(data, status, headers, config, statusText) {
                // TODO: error server handling
            }
        );
    }
    
    function logout() {
        $http({
            method: 'POST',
            url: "/MESTO/MESTO_WEB_APP/php/logout.php", // TODO: Make a config with path
            headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(
            function(data, status) {
                currentUser = null;

                Idle.unwatch();
                
                $location.path('/home');
            }
        ).error(
            function(data, status, headers, config, statusText) {
                // TODO: error server handling
            }
        );
    }
    
    function isLogged() {
        return currentUser != null;
    }
    
    function createUser(user) {
        currentUser = user;
    }
    
    function getUserName() {
        return (currentUser) ? currentUser.name : null;
    }
    
    function isAuthorized(pPermission) {
        return (currentUser && currentUser.lstPermissions) ? currentUser.lstPermissions.indexOf(pPermission) != -1 : false;
    }
    
    return {
        login : login,
        logout : logout,
        checkLoggedUser : checkLoggedUser,
        isLogged : isLogged,
        getUserName : getUserName,
        isAuthorized : isAuthorized
    };
});

app.factory('googleMap', function() {
    var mapOptions = {
        center: { lat: 45.899566, lng: -72.894373},
        zoom: 8
    };
    
    var mainMap = null;
    var zones = null;
    var info = null;
    var markersCluster = null;
    
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
            
            info = new google.maps.InfoWindow({});
        }
        catch (e) {console.error('Something wrong with google');}
        
        return mainMap;
    }
    
    function factoryMarker(latitude, longitude, map, title, strInfoContent, linkClicker) {
        var mk = null;
        try {
            var mk = new google.maps.Marker({position: new google.maps.LatLng(latitude, longitude), map: map, title: title, animation: google.maps.Animation.DROP});
            
            google.maps.event.addListener(mk, 'click', function() {
                info.setContent(strInfoContent);
                $('.link').click(linkClicker);
                info.open(map, mk);  
            });
        }
        catch(e) {console.error('Something wrong with google'+e.message);}
        
        return mk;
    }
    
    function resetMarkerCluster() {
        markersCluster.clearMarkers();
            
        markersCluster = null;
    }
    
    function setMarkersCluster(map, arr) {
        markersCluster = new MarkerClusterer(map, arr, {gridSize: 20, maxZoom: 15});
    }
    
    function setLoadFunctionOnInfoWindow(onload) {
        google.maps.event.addListener(info, 'domready', function() {
           onload();
        });
    }
    
    return { getMap : getMap,
            factoryMarker : factoryMarker,
            setMarkersCluster : setMarkersCluster,
            resetMarkerCluster : resetMarkerCluster,
            setLoadFunctionOnInfoWindow : setLoadFunctionOnInfoWindow};
});