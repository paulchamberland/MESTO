/* ANGULARJS main application : Inegrate all module and specific services design for Mesto
 * @author : jonathan-lefebvregithub@outlook.com
 */

var app = angular.module('MESTO', ['ngRoute', 'ngIdle', 'ui.bootstrap']);

/* specific routing */
app.config(function($routeProvider, IdleProvider) {
    $routeProvider.when('/home', {templateUrl:'home.html', controller:'siteCTL', controllerAs:'siteCTL'});
    $routeProvider.when('/site', {templateUrl:'site.html', controller:'siteCTL', controllerAs:'siteCTL'});
    $routeProvider.when('/sites', {templateUrl:'sites.html', controller:'siteCTL', controllerAs:'siteCTL'});
    $routeProvider.when('/room', {templateUrl:'room.html', controller:'roomCTL', controllerAs:'roomCTL'});
    $routeProvider.when('/room/:roomID', {templateUrl:'room.html', controller:'roomCTL', controllerAs:'roomCTL'});
    $routeProvider.when('/rooms', {templateUrl:'rooms.html', controller:'roomCTL', controllerAs:'roomCTL'});
    $routeProvider.when('/equip', {templateUrl:'equipment.html', controller:'equipmentCTL', controllerAs:'equipCTL'});
    $routeProvider.when('/equip/:serialNumber', {templateUrl:'equipment.html', controller:'equipmentCTL', controllerAs:'equipCTL'});
    $routeProvider.when('/equips', {templateUrl:'equipments.html', controller:'equipmentCTL', controllerAs:'equipCTL'});
    $routeProvider.when('/admin', {templateUrl:'mt-admin/mt-login.html'});
    $routeProvider.when('/admin/home', {templateUrl:'mt-admin/mt-home.html'});
    $routeProvider.when('/admin/site', {templateUrl:'mt-admin/mt-sites.html', controller:'siteCTL', controllerAs:'siteCTL'});
    $routeProvider.when('/admin/site/:reference', {templateUrl:'mt-admin/mt-sites.html', controller:'siteCTL', controllerAs:'siteCTL'});
    $routeProvider.when('/admin/sites', {templateUrl:'mt-admin/mt-lstSites.html', controller:'siteCTL', controllerAs:'siteCTL'});
    $routeProvider.when('/admin/room', {templateUrl:'mt-admin/mt-rooms.html', controller:'roomCTL', controllerAs:'roomCTL'});
    $routeProvider.when('/admin/room/:roomID', {templateUrl:'mt-admin/mt-rooms.html', controller:'roomCTL', controllerAs:'roomCTL'});
    $routeProvider.when('/admin/rooms', {templateUrl:'mt-admin/mt-lstRooms.html', controller:'roomCTL', controllerAs:'roomCTL'});
    $routeProvider.when('/admin/equip', {templateUrl:'mt-admin/mt-equipments.html', controller:'equipmentCTL', controllerAs:'equipCTL'});
    $routeProvider.when('/admin/equip/:serialNumber', {templateUrl:'mt-admin/mt-equipments.html', controller:'equipmentCTL', controllerAs:'equipCTL'});
    $routeProvider.when('/admin/equipments', {templateUrl:'mt-admin/mt-lstEquipments.html', controller:'equipmentCTL', controllerAs:'equipCTL'});
    $routeProvider.when('/admin/permissions', {templateUrl:'mt-admin/mt-lstPermissions.html', controller:'permissionCTL', controllerAs:'permissionCTL'});
    $routeProvider.when('/admin/role', {templateUrl:'mt-admin/mt-userRole.html', controller:'userRoleCTL', controllerAs:'userRoleCTL'});
    $routeProvider.when('/admin/role/:name', {templateUrl:'mt-admin/mt-userRole.html', controller:'userRoleCTL', controllerAs:'userRoleCTL'});
    $routeProvider.when('/admin/roles', {templateUrl:'mt-admin/mt-lstUserRoles.html', controller:'userRoleCTL', controllerAs:'userRoleCTL'});
    $routeProvider.when('/admin/user', {templateUrl:'mt-admin/mt-users.html', controller:'userCTL', controllerAs:'userCTL'});
    $routeProvider.when('/admin/user/:username', {templateUrl:'mt-admin/mt-users.html', controller:'userCTL', controllerAs:'userCTL'});
    $routeProvider.when('/admin/users', {templateUrl:'mt-admin/mt-lstUsers.html', controller:'userCTL', controllerAs:'userCTL'});
    $routeProvider.when('/admin/stream', {templateUrl:'mt-admin/mt-stream.html', controller:'streamCTL', controllerAs:'streamCTL'});
    $routeProvider.when('/createUser', {templateUrl:'user.html', controller:'userCTL', controllerAs:'userCTL'});
    $routeProvider.when('/profile', {templateUrl:'profile.html', controller:'userCTL', controllerAs:'userCTL'});
    $routeProvider.when('/stream', {templateUrl:'stream.html', controller:'streamCTL', controllerAs:'streamCTL'});
    $routeProvider.otherwise({redirectTo:"/home"});
    
    // initiate the userLogout system
    IdleProvider.idle(600);
    IdleProvider.timeout(5);
    IdleProvider.keepalive(false);
});

app.run(function($rootScope, $location, securitySrv) {
    var routeRestricted = ['/admin/home', '/admin/site', '/admin/sites', '/admin/room', '/admin/rooms', '/admin/equip', '/admin/equipments', '/admin/permissions', '/admin/role', '/admin/roles', '/admin/user', '/admin/users', '/admin/stream'];
    var forbiddenCall = ['.html', '.php'];

    // security check for define what page should be use with a user logged
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
    
    // Define the way we warn the use that he become idle
    $rootScope.$on('IdleStart', function() {
        console.log('idle start');
    });
    // Define the way we inform user he's not idle anymore (a little dump to do?)
    $rootScope.$on('IdleEnd', function() {
        console.log('Idle end');
    });
    // Define the way we kick out idle user
    $rootScope.$on('IdleTimeout', function() {
        securitySrv.logout();
        alert('you have been aways? By security we log you out');
        console.log('log out');
    });
});

/*
 * Configuration service that can be use to set Constante across the apps. At this point only a confPath is used
 */
app.factory('CONF_PATH', function() {
    return "/MESTO/MESTO_WEB_APP";
});

/* navigateSrv : Service who facilitate navigation between same controller load. 
 *                Give the possibility to stock 1 object of each type in the main map.
 *                The object "saved" could be load alter by a controller
 */
app.factory('navigateSrv', function() {
    var equip = null;
    var room = null;
    var site = null;
    var user = null;
    var userRole = null;
    
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
    
    // Remove every object the Service had
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

/* permissionSrv : Permission is a model with no required DAO. All permission are fixed
 *                  This service instantiate them and make it available in all controller  
 */
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

/* enumManagerSrv : Service instantiate all enum in the apps. It's centralize here to be able to give access to all controller
 *
 */
app.factory('enumManagerSrv', function() {
    var equip_TYPE = [{value:'RT',label:'Router'},{value:'HUB',label:'Hub'},{value:'SRV',label:'Server'},{value:'SWT',label:'Switch'}];
    var room_ROLE = [{value:'MTC',label:'Main Telecom'},{value:'TC',label:'Telecom'},{value:'SPR',label:'Spare'},{value:'STR',label:'Storage'}];
    var site_ROLE = [{value:'ED',label:'Edifice'},{value:'FLR',label:'Floor'},{value:'FOB',label:'FOB'},{value:'COP',label:'COP'},{value:'CMP',label:'CAMP'}];
    var site_ORGANIZATION = [{value:'TC',label:'TC'},{value:'DND',label:'DND'},{value:'RCMP',label:'RCMP'},{value:'ASC',label:'ASC'},{value:'CSC',label:'CSC'}];
    
    function getEquip_TYPE() {
        return equip_TYPE;
    }
    
    function getRoom_ROLE() {
        return room_ROLE;
    }
    
    function getSite_ROLE() {
        return site_ROLE;
    }
    
    function getSite_ORGANIZATION() {
        return site_ORGANIZATION;
    }
    
    function getEquipLabelTYPE(pType) {
        for (t in equip_TYPE) {
            if (equip_TYPE[t].value == pType) return equip_TYPE[t].label;
        }
    }
    
    function getRoomLabelROLE(pRole) {
        for (t in room_ROLE) {
            if (room_ROLE[t].value == pRole) return room_ROLE[t].label;
        }
    };
    
    function getSiteLabelROLE(pRole) {
        for (t in site_ROLE) {
            if (site_ROLE[t].value == pRole) return site_ROLE[t].label;
        }
    };
    
    function getSiteLabelORGANIZATION(pOrg) {
        for (t in site_ORGANIZATION) {
            if (site_ORGANIZATION[t].value == pOrg) return site_ORGANIZATION[t].label;
        }
    };
    
    return {
        getEquip_TYPE : getEquip_TYPE,
        getEquipLabelTYPE : getEquipLabelTYPE,
        getRoom_ROLE : getRoom_ROLE,
        getRoomLabelROLE : getRoomLabelROLE,
        getSite_ROLE : getSite_ROLE,
        getSiteLabelROLE : getSiteLabelROLE,
        getSite_ORGANIZATION : getSite_ORGANIZATION,
        getSiteLabelORGANIZATION : getSiteLabelORGANIZATION,
        
    }
});

/* streamSrv : Service that manage activity(log) for the entire system.
 *              This service has a controller to more specific work : streamCTL
 */
app.factory('streamSrv', function($http, securitySrv, CONF_PATH) {

    function getActionLabel(pCode) {
        switch (pCode) {
            case 'add' : return "addition";
            case 'mod' : return "modification";
            case 'del' : return "deletion";
            default : "thing";
        }
    }
    
    function saveActivity(_scope, pIsRestrain, pAction, pConcern, pConcernObject, pConcernUnique, pParentRole, pParentInfo) {
        if (securitySrv.isLogged()) {
            $http({
                method: 'POST',
                url: CONF_PATH+"/php/saveStream.php",
                data: {
                    isRestrain : pIsRestrain ? '1' : '0',
                    action : getActionLabel(pAction),
                    concern : pConcern,
                    concernObject : pConcernObject,
                    concernUnique : pConcernUnique,
                    parentRole : /*(pParentRole != "") ? */pParentRole /*: "undefined"*/,
                    parentInfo : /*(pParentInfo != "") ? */pParentInfo /*: "undefined"*/,
                    userName : securitySrv.getUser().name,
                    title : securitySrv.getUser().title
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(
                function(data, status) {
                    if (data.error != '') { // sql error, no good return
                        _scope.SQLErrors = data.error;
                    }
                }
            ).error(
                function(data, status, headers, config, statusText) {
                    // TODO: error server handling
                    _scope.SQLErrors = "error: "+status+":"+statusText;
                }
            );
        }
    }
    
    return {
        saveActivity : saveActivity
    }
});

/* paginator : Prototype Service for centralized pagination treatment.
 *
 */
app.factory('paginator', function() {
    var scope = null;
    
    function init(pScope, pLst) {
        scope = pScope;
        scope.list = pLst
        scope.totalItems = scope.list.length;
        
        scope.currentPage = 1;
        scope.itemsPerPage = 5;
        
        scope.pageChanged = pageChanged;
        pageChanged();
    }

    function setPage(pageNo) {
        scope.currentPage = pageNo;
    }

    function pageChanged() {
        scope.$watch('currentPage + itemsPerPage', function() {
            var begin = ((scope.currentPage - 1) * scope.itemsPerPage),
            end = begin + scope.itemsPerPage;

            scope.listPaged = scope.list.slice(begin, end);
        });
    }
    
    return {
        init : init
    };
});

/* securitySrv : Service responsible for user management as Security purpose like, login, logout, check if logged...
 *                The service store information about user and security to gave to Controller when required.
 *                There is a closed relation with this service and PHP session used on the server side...
 */
app.factory('securitySrv', function($http, $location, Idle, CONF_PATH) {
    var currentUser = null;
    var uId = null;
    
    function login(pData, then) {
        if (!then) return;
        
        $http({
            method: 'POST',
            url: CONF_PATH+"/php/login.php",
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
            url: CONF_PATH+"/php/DAOUser.php",
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
            url: CONF_PATH+"/php/loggedUser.php",
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
            url: CONF_PATH+"/php/logout.php",
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
    
    function getUser() {
        return currentUser;
    }
    
    return {
        login : login,
        logout : logout,
        loadUser : loadUser,
        checkLoggedUser : checkLoggedUser,
        isLogged : isLogged,
        getUserName : getUserName,
        getUser : getUser,
        isAuthorized : isAuthorized
    };
});

/* 
 * googleMap : Service who controller, store, give main treatment of Google Maps API to controller
 *              This service possess a controller for more specific treatment : mapCTL
 */
app.factory('googleMap', function() {
    var mainMap = null; // main map of the home page
    var miniMap = null; // mini map of detail site page
    
    var zones = null; // array of zone layer
    var info = null; // stock unique opened infoWindows
    var markersCluster = null;
    
    // main contructor
    function getMap() {
        try {
            //if (mainMap == null) {
                mainMap = new google.maps.Map(document.getElementById('map-canvas'), {center: { lat: 45.899566, lng: -72.894373},
                                                                                      zoom: 8});
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
    
    // Second contructor
    function getMiniMap(pLat, pLon) {
        try {
            miniMap = new google.maps.Map(document.getElementById('map-canvas'), {center: { lat: pLat, lng: pLon}, streetViewControl: false, zoom: 16});
        }
        catch (e) {console.error('Something wrong with google::'+e);}
        
        return miniMap;
    }
    
    function showZone() {
        zones.showDocument();
    }
    
    function hideZone() {
        zones.hideDocument();
    }
    
    function factoryMarker(latitude, longitude, map, title, strInfoContent, linkClicker) {
        var mk = null;
        try {
            mk = new google.maps.Marker({position: new google.maps.LatLng(latitude, longitude), map: map, title: title, animation: google.maps.Animation.DROP});
            
            if (info != null) {
                google.maps.event.addListener(mk, 'click', function() {
                    info.setContent(strInfoContent);
                    $('.link').click(linkClicker);
                    info.open(map, mk);  
                });
            }
        }
        catch(e) {console.error('Something wrong with google::'+e);}
        
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
        if (info != null) {
            google.maps.event.addListener(info, 'domready', function() {
               onload();
            });
        }
    }
    
    return { getMap : getMap,
            getMiniMap : getMiniMap,
            hideZone : hideZone,
            showZone : showZone,
            factoryMarker : factoryMarker,
            setMarkersCluster : setMarkersCluster,
            resetMarkerCluster : resetMarkerCluster,
            setLoadFunctionOnInfoWindow : setLoadFunctionOnInfoWindow};
});