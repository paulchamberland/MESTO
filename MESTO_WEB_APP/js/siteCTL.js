app.controller('siteCTL', function($scope, $http, $location, navigateSrv) {
    var self = this;
    var ACTIVITY_DELETE = "del";
    var ACTIVITY_ADDING_ASSO_EQUIP = "add-ass-st|eq";
    var ACTIVITY_REMOVE_ASSO_EQUIP = "rem-ass-st|eq";
    var ACTIVITY_REMOVE_ASSO_ROOM = "rem-ass-st|rm";
    var LOAD_INCLUDE_EQUIP = "SITE_INC";
    var LOAD_FREE_EQUIP = "SITE_FREE";
    $scope.ROLE = [{value:'ED',label:'Edifice'},{value:'FLR',label:'Floor'},{value:'FOB',label:'FOB'},{value:'COP',label:'COP'},{value:'CMP',label:'CAMP'}];
    
    $scope.site = {id: "",
                    reference :"",
                    latitude:"",
                    longitude:"",
                    siteName:"",
                    description:"",
                    isTemporary:false,
                    startDate:"",
                    endDate:"",
                    address:"",
                    city:"",
                    province:"",
                    country:"",
                    postalCode:"",
                    role:"",
                    pointOfContact:"",
                    phoneNumberPoC:"",
                    lstRooms:[],
                    lstEquips:[]};
    this.emptySite = {};
    $scope.canDelete = false;
    
    $scope.getLabelROLE = function(pRole) {
        for (t in $scope.ROLE) {
            if ($scope.ROLE[t].value == pRole) return $scope.ROLE[t].label;
        }
    };
    
    // TODO: To remove at some point
    $scope.site_init = {id: "1",
                    reference :"test",
                    latitude:"12.123456",
                    longitude:"43.123456",
                    siteName:"test4",
                    description:"test5",
                    isTemporary:true,
                    startDate:"12-12-12",
                    endDate:"11-11-1900",
                    address:"test9",
                    city:"test10",
                    province:"test11",
                    country:"test12",
                    postalCode:"X5X 5X5",
                    role:"COP",
                    pointOfContact:"Lt. Bariton",
                    phoneNumberPoC:"514-555-4321",
                    lstRooms:[],
                    lstEquips:[]};
    
    function init() {
        self.emptySite = angular.copy($scope.site);
        
        if (navigateSrv.getSite() != null) {
            $scope.loadSite(navigateSrv.getSite());
            navigateSrv.cleanMemory();
            //$scope.site = angular.copy($scope.site_init); // TODO: to remove at some point...
        }
        else {
            loadList();
        }
    }
    
    $scope.openSite = function(pSite) {
        $scope.setSite(pSite);
        
        loadRoomsList();
        self.loadEquipsList();
        
        $('#details').fadeIn('slow');
    }
    
    $scope.setSite = function(pSite) {
        $scope.site = angular.copy(pSite);
    }
    
    $scope.loadSite = function(p_site) {
        $scope.setSite(p_site);
        $scope.site.startDate = Date.parseToDMY($scope.site.startDate);
        $scope.site.endDate = Date.parseToDMY($scope.site.endDate);
        //$scope.siteForm.$setPristine();
        $scope.canDelete = true;
        $scope.resetMsg();
        
        loadRoomsList();
        self.loadEquipsList();
    };
    
    $scope.navigateToSite = function(p_site) {
        navigateSrv.setSite(p_site);
        $location.path("/admin/site");
    };
    
    $scope.resetFrm = function() {
        $scope.setSite(self.emptySite);
        $scope.siteForm.$setPristine();
        $scope.canDelete = false;
    };
    
    $scope.resetMsg = function() {
        if ($scope.SQLErrors) delete $scope.SQLErrors;
        if ($scope.SQLMsgs) delete $scope.SQLMsgs;
    }
    
    $scope.save = function() {
        if ($scope.siteForm.$dirty && $scope.siteForm.$valid) {
            $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/saveSite.php", // TODO: Make a config with path
                data: {
                    id : $scope.site.id,
                    reference : $scope.site.reference,
                    latitude : $scope.site.latitude,
                    longitude : $scope.site.longitude,
                    siteName : $scope.site.siteName,
                    description : $scope.site.description,
                    isTemporary : $scope.site.isTemporary,
                    startDate : new Date($scope.site.startDate).toYMD(), 
                    endDate : new Date($scope.site.endDate).toYMD(),
                    address : $scope.site.address,
                    city : $scope.site.city,
                    province : $scope.site.province,
                    country : $scope.site.country,
                    postalCode : $scope.site.postalCode,
                    role : $scope.site.role,
                    pointOfContact : $scope.site.pointOfContact,
                    phoneNumberPoC : $scope.site.phoneNumberPoC
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(
                function(data, status) {
                    $scope.resetMsg();
                    if (data.msg != '') {
                        $scope.SQLMsgs = data.msg;
                        loadList();
                        $scope.resetFrm();
                    }
                    else {
                        $scope.SQLErrors = data.error;
                    }
                }
            ).error(
                function(data, status, headers, config, statusText) {
                    // TODO: error server handling
                    $scope.SQLErrors = "error: "+status+":"+statusText;
                }
            );
        }
    };
    
    $scope.delete = function() {
        $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/saveSite.php", // TODO: Make a config with path
                data: {
                    id : $scope.site.id,
                    activity : ACTIVITY_DELETE
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(
                function(data, status) {
                    $scope.resetMsg();
                    if (data.msg != '') {
                        $scope.SQLMsgs = data.msg;
                        loadList();
                        $scope.resetFrm();
                    }
                    else {
                        $scope.SQLErrors = data.error;
                    }
                }
            ).error(
                function(data, status, headers, config, statusText) {
                    // TODO: error server handling
                    $scope.SQLErrors = "error: "+status+":"+statusText;
                }
            );
    };
    
    /*
     *  Unused: Delete or use it?
     */
    $scope.refreshList = function() {
        loadList();
    };
    
    $scope.validEndDate = function() {
        if ($scope.siteForm.endDate.$valid && $scope.siteForm.startDate.$valid && $scope.siteForm.endDate.$dirty && $scope.siteForm.startDate.$dirty
                && Date.parse($scope.site.endDate) <= Date.parse($scope.site.startDate)) {
            $scope.siteForm.endDate.$setValidity('greaterThan', false);
        }
        else {
            $scope.siteForm.endDate.$setValidity('greaterThan', true);
        }
    };
    
    function loadList() {
        $http.post("/MESTO/MESTO_WEB_APP/php/DAOSite.php").success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.siteList = data;
                }
                else {
                    $scope.lstError = data.error;
                }
            }
        ).error(
            function(data, status, headers, config, statusText) {
                // TODO: error server handling
                $scope.lstError = "error: "+status+":"+statusText;
                //$scope.error = "error: "+data+" -- "+status+" -- "+headers+" -- "+config;
            }
        );
    };
    
    function loadRoomsList() {
        $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/DAORoom.php", // TODO: Make a config with path
                data: {
                    id : $scope.site.id
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.site.lstRooms = data;
                }
                else {
                    $scope.lstRoomErr = data.error;
                }
            }
            ).error(
                function(data, status, headers, config, statusText) {
                    // TODO: error server handling
                    $scope.lstRoomErr = "error: "+status+":"+statusText;
                    //$scope.error = "error: "+data+" -- "+status+" -- "+headers+" -- "+config;
                }
            );
    };
    
    $scope.removeAssRoom = function(p_roomID) {
        $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/saveRoom.php",
                data: {id: p_roomID,
                        activity: ACTIVITY_REMOVE_ASSO_ROOM},
                headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(
                function(data) {
                    if (data.msg != '') {
                        loadRoomsList(); // refresh
                    }
                    else {
                        $scope.lstRoomErr = data.error;
                    }
                }
            ).error(
                function(data, status, headers, config, statusText) {
                    // TODO: error server handling
                    $scope.lstRoomErr = "error: "+status+":"+statusText;
                    //$scope.error = "error: "+data+" -- "+status+" -- "+headers+" -- "+config;
                });
    };
    
    $scope.newRoom = function() {
        $location.path("/admin/room"); // TODO: complete by sending the ID and do the comportement on the Room page
    };
    
    this.loadEquipsList = function() {
        $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/DAOEquipment.php", // TODO: Make a config with path
                data: {
                    id : $scope.site.id,
                    type : LOAD_INCLUDE_EQUIP
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.site.lstEquips = data;
                }
                else {
                    $scope.lstEquipErr = data.error;
                }
            }
            ).error(
                function(data, status, headers, config, statusText) {
                    // TODO: error server handling
                    $scope.lstEquipErr = "error: "+status+":"+statusText;
                    //$scope.error = "error: "+data+" -- "+status+" -- "+headers+" -- "+config;
                }
            );
    };
    
    this.loadFreeEquipsList = function() {
        $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/DAOEquipment.php", // TODO: Make a config with path
                data: {
                    id : $scope.site.id,
                    type : LOAD_FREE_EQUIP
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.lstFreeEquips = data;
                }
                else {
                    $scope.lstFreeEquipErr = data.error;
                }
            }
            ).error(
                function(data, status, headers, config, statusText) {
                    // TODO: error server handling
                    $scope.lstFreeEquipErr = "error: "+status+":"+statusText;
                    //$scope.error = "error: "+data+" -- "+status+" -- "+headers+" -- "+config;
                }
            );
    };
    
    $scope.removeAssEquip = function(p_equipID) {
        $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/saveEquipment.php",
                data: {id: p_equipID,
                        activity: ACTIVITY_REMOVE_ASSO_EQUIP},
                headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(
                function(data) {
                    if (data.msg != '') {
                        self.loadEquipsList(); // refresh
                    }
                    else {
                        $scope.lstEquipErr = data.error;
                    }
                }
            ).error(
                function(data, status, headers, config, statusText) {
                    // TODO: error server handling
                    $scope.lstEquipErr = "error: "+status+":"+statusText;
                    //$scope.error = "error: "+data+" -- "+status+" -- "+headers+" -- "+config;
                });
    };
    
    $scope.openFreeEquipsList = function() {
        self.loadFreeEquipsList();
        
        $('#lstFreeEquips').fadeIn('slow');
    }
    
    $scope.closeFreeEquipsList = function() {
        $('#lstFreeEquips').fadeOut('slow');
        
        delete $scope.lstFreeEquips;
    }
    
    $scope.addFreeEquipsList = function() {
        var lstAdding = [];
        for (var i = 0; i != $scope.lstFreeEquips.length; i++) {
            if ($scope.lstFreeEquips[i].adding) {
                lstAdding.push($scope.lstFreeEquips[i].id);
            }
        }
    
        $http({
            method: 'POST',
            url: "/MESTO/MESTO_WEB_APP/php/saveEquipment.php",
            data: {ids: lstAdding.toString(),
                    siteID: $scope.site.id,
                    activity: ACTIVITY_ADDING_ASSO_EQUIP},
            headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(
            function(data) {
                if (data.msg != '') {
                    self.loadEquipsList();// refresh
                    $scope.closeFreeEquipsList(); 
                }
                else {
                    $scope.lstFreeEquipErr = data.error;
                }
            }
        ).error(
            function(data, status, headers, config, statusText) {
                // TODO: error server handling
                $scope.lstFreeEquipErr = "error: "+status+":"+statusText;
                //$scope.error = "error: "+data+" -- "+status+" -- "+headers+" -- "+config;
            });
    }
    
    $scope.newEquip = function() {
        $location.path("/admin/equip"); // TODO: complete by sending the ID and do the comportement on the Room page
    };
    
    init();
});