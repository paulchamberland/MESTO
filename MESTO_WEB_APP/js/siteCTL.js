app.controller('siteCTL', function($scope, $http, $location, $routeParams, navigateSrv, securitySrv, streamSrv, enumManagerSrv, $modal) {
    var self = this;
    var modalInstance = null;
    
    var ACTIVITY_DELETE = "del";
    var ACTIVITY_ADDING_ASSO_EQUIP = "add-ass-st|eq";
    var ACTIVITY_REMOVE_ASSO_EQUIP = "rem-ass-st|eq";
    var ACTIVITY_ADDING_ASSO_ROOM = "add-ass-st|rm";
    var ACTIVITY_REMOVE_ASSO_ROOM = "rem-ass-st|rm";
    var LOAD_INCLUDE_EQUIP = "SITE_INC";
    var LOAD_INCLUDE_ROOM = "SITE_INC";
    var LOAD_FREE_EQUIP = "SITE_FREE";
    var LOAD_FREE_ROOM = "SITE_FREE";
    $scope.ROLE = enumManagerSrv.getSite_ROLE();
    $scope.ORGANIZATION = enumManagerSrv.getSite_ORGANIZATION();
    
    $scope.modifySite = false; // action flag to change the display of detail vs form page
    
    this.openStartCalendar = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.strOpened = true;
    };
    this.openEndCalendar = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.endOpened = true;
    };
    
    this.modifySite = function() {
        $scope.modifySite = true;
    };
    
    var promiseLstLoad = null;
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
                    organization:"",
                    techPoC:"",
                    phoneTechPoC:"",
                    employesNumber:"",
                    lstRooms:[],
                    lstEquips:[],
                    updateBy: "",
                    updateDate: ""};
    this.emptySite = {};
    $scope.canDelete = false;
    $scope.canSave = true;
    
    $scope.isAutorizeUpdatingSite = false;
    $scope.isAutorizeCreatingSite = false;
    $scope.isAutorizeDeletingSite = false;
    $scope.isAutorizeSeeDetailsSite = false;
    $scope.isDateNotEditable = false;
    
    this.getLabelROLE = enumManagerSrv.getSiteLabelROLE;
    
    this.getLabelORGANIZATION = enumManagerSrv.getSiteLabelORGANIZATION;
    
    function init() {
        self.emptySite = angular.copy($scope.site);
        
        if ($routeParams.reference) {
            self.loadDBSite($routeParams.reference);
            $scope.canDelete = true;
        }
        else if (navigateSrv.getSite() != null) {
            self.loadSite(navigateSrv.getSite());
            navigateSrv.cleanMemory();
        }
        else {
            promiseLstLoad = self.loadList();
        }
        
        $scope.isAutorizeUpdatingSite = securitySrv.isAuthorized('createSite');
        $scope.isAutorizeCreatingSite = securitySrv.isAuthorized('updateSite');
        $scope.isAutorizeDeletingSite = securitySrv.isAuthorized('deleteSite');
        $scope.isAutorizeSeeDetailsSite = securitySrv.isAuthorized('detailSite');
        $scope.isDateNotEditable = securitySrv.isLogged() && securitySrv.getUser().username != "tester"; // Hack for simplify e2e Test
        
        $scope.canSave = ($scope.site.id > 0 && $scope.isAutorizeUpdatingSite) || ($scope.site.id <= 0 && $scope.isAutorizeCreatingSite);
    }
    
    /** Secure function **/
    this.openSite = function(pSite) {
        if ($scope.isAutorizeSeeDetailsSite) {
            self.setSite(pSite);
            
            self.loadRoomsList();
            self.loadEquipsList();
            
            $('#details').fadeIn('slow');
        }
    }
    
    this.setSite = function(pSite) {
        $scope.site = angular.copy(pSite);
    }
    
    this.loadSite = function(p_site) {
        self.setSite(p_site);
        $scope.site.startDate = Date.parseToDMY($scope.site.startDate);
        $scope.site.endDate = Date.parseToDMY($scope.site.endDate);
        //$scope.siteForm.$setPristine();
        $scope.canDelete = true;
        self.resetMsg();
        
        self.loadRoomsList();
        self.loadEquipsList();
    };
    
    /** Secure function **/
    this.navigateToSite = function(p_site) {
        if ($scope.isAutorizeUpdatingSite) {
            navigateSrv.setSite(p_site);
            $location.path("/admin/site");
        }
    };
    
    /** Secure function **/
    this.seeSiteDetails = function(p_site) {
        if ($scope.isAutorizeSeeDetailsSite) {
            navigateSrv.setSite(p_site);
            $location.path("/site");
        }
    };
    
    this.resetFrm = function() {
        self.setSite(self.emptySite);
        $scope.siteForm.$setPristine();
        $scope.canDelete = false;
    };
    
    this.resetMsg = function() {
        if ($scope.SQLErrors) delete $scope.SQLErrors;
        if ($scope.SQLMsgs) delete $scope.SQLMsgs;
    }
    
    this.save = function() {
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
                    organization : $scope.site.organization,
                    pointOfContact : $scope.site.pointOfContact,
                    phoneNumberPoC : $scope.site.phoneNumberPoC,
                    techPoC : $scope.site.techPoC,
                    phoneTechPoC : $scope.site.phoneTechPoC,
                    employesNumber : $scope.site.employesNumber,
                    updateBy : securitySrv.getUserName()
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(
                function(data, status) {
                    self.resetMsg();
                    if (data.msg != '') {
                        streamSrv.saveActivity($scope, false, ($scope.site.id == '') ? "add" : "mod", ($scope.site.role == "") ? "site" : self.getLabelROLE($scope.site.role)
                                                , "site", $scope.site.reference, "system", "Mesto");
                        //$scope.SQLMsgs = data.msg;
                        //self.loadList();
                        self.resetFrm();
                        
                        if ($location.path() == "/admin/site") {
                            $location.path("/admin/sites");
                        }
                        else {
                            $location.path("/sites");
                        }
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
    
    this.delete = function() {
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
                    self.resetMsg();
                    if (data.msg != '') {
                        streamSrv.saveActivity($scope, false, "del", ($scope.site.role == "") ? "site" : self.getLabelROLE($scope.site.role)
                                                , "site", $scope.site.reference, "system", "Mesto");
                        
                        //$scope.SQLMsgs = data.msg;
                        //self.loadList();
                        self.resetFrm();
                        $location.path("/admin/sites");
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
    this.refreshList = function() {
        self.loadList();
    };
    
    this.validEndDate = function() {
        if ($scope.siteForm.endDate.$valid && $scope.siteForm.startDate.$valid && $scope.siteForm.endDate.$dirty && $scope.siteForm.startDate.$dirty
                && Date.parse($scope.site.endDate) <= Date.parse($scope.site.startDate)) {
            $scope.siteForm.endDate.$setValidity('greaterThan', false);
        }
        else {
            $scope.siteForm.endDate.$setValidity('greaterThan', true);
        }
    };
    
    this.loadList = function() {
        return $http.post("/MESTO/MESTO_WEB_APP/php/DAOSite.php").success( // TODO: Make a config with path
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
    
    this.loadDBSite = function(pReference) {
        $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/DAOSite.php", // TODO: Make a config with path
                data: {
                    reference : pReference
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.site = data[0];
                }
                else {
                    $scope.SQLErrors = data.error;
                }
            }
        ).error(
            function(data, status, headers, config, statusText) {
                // TODO: error server handling
                $scope.SQLErrors = "error: "+status+":"+statusText;
                //$scope.error = "error: "+data+" -- "+status+" -- "+headers+" -- "+config;
            }
        );
    };
    /**********************************************************************************************/
    
    this.loadRoomsList = function() {
        $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/DAORoom.php", // TODO: Make a config with path
                data: {
                    id : $scope.site.id,
                    type : LOAD_INCLUDE_ROOM
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
    
    this.loadFreeRoomsList = function() {
        $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/DAORoom.php", // TODO: Make a config with path
                data: {
                    id : $scope.site.id,
                    type : LOAD_FREE_ROOM
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.lstFreeRooms = data;
                }
                else {
                    $scope.lstFreeRoomErr = data.error;
                }
            }
            ).error(
                function(data, status, headers, config, statusText) {
                    // TODO: error server handling
                    $scope.lstFreeRoomErr = "error: "+status+":"+statusText;
                    //$scope.error = "error: "+data+" -- "+status+" -- "+headers+" -- "+config;
                }
            );
    };
    
    this.removeAssRoom = function(p_roomID) {
        $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/saveRoom.php",
                data: {id: p_roomID,
                        activity: ACTIVITY_REMOVE_ASSO_ROOM},
                headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(
                function(data) {
                    if (data.msg != '') {
                        self.loadRoomsList(); // refresh
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
    
    this.openFreeRoomsList = function() {
        self.loadFreeRoomsList();
        
        modalInstance = $modal.open({
            animation: true,
            scope: $scope,
            templateUrl: 'freeRoomListModalContent.html'
        });
    };
    
    this.closeFreeRoomsList = function() {
        modalInstance.dismiss('done');
        
        delete $scope.lstFreeRooms;
    };
    
    this.addFreeRoomsList = function() {
        var lstAdding = [];
        for (var i = 0; i != $scope.lstFreeRooms.length; i++) {
            if ($scope.lstFreeRooms[i].adding) {
                lstAdding.push($scope.lstFreeRooms[i].id);
            }
        }
    
        $http({
            method: 'POST',
            url: "/MESTO/MESTO_WEB_APP/php/saveRoom.php",
            data: {ids: lstAdding.toString(),
                    siteID: $scope.site.id,
                    activity: ACTIVITY_ADDING_ASSO_ROOM},
            headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(
            function(data) {
                if (data.msg != '') {
                    self.loadRoomsList();// refresh
                    self.closeFreeRoomsList(); 
                }
                else {
                    $scope.lstFreeRoomErr = data.error;
                }
            }
        ).error(
            function(data, status, headers, config, statusText) {
                // TODO: error server handling
                $scope.lstFreeRoomErr = "error: "+status+":"+statusText;
                //$scope.error = "error: "+data+" -- "+status+" -- "+headers+" -- "+config;
            });
    };
    
    this.newRoom = function() {
        modalInstance.dismiss('redirect');
        $location.path("/admin/room"); // TODO: complete by sending the ID and do the comportement on the Room page
    };
    
    /**********************************************************************************************/
    
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
    
    this.removeAssEquip = function(p_equipID) {
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
    
    this.openFreeEquipsList = function() {
        self.loadFreeEquipsList();
        
        modalInstance = $modal.open({
            animation: true,
            scope: $scope,
            templateUrl: 'freeEquipListModalContent.html'
        });
    }
    
    this.closeFreeEquipsList = function() {
        modalInstance.dismiss('done');
        
        delete $scope.lstFreeEquips;
    }
    
    this.addFreeEquipsList = function() {
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
                    self.closeFreeEquipsList(); 
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
    
    this.newEquip = function() {
        modalInstance.dismiss('redirect');
        $location.path("/admin/equip"); // TODO: complete by sending the ID and do the comportement on the Room page
    };
    
    this.newSite = function() {
        $location.path("/admin/site");
    };
    
    this.getListSites = function() {
        return promiseLstLoad;
    };
    
    init();
});