app.controller('roomCTL', function($scope, $http, $location, navigateSrv, securitySrv) {
    var self = this;
    var ACTIVITY_DELETE = "del";
    var ACTIVITY_ADDING_ASSO_EQUIP = "add-ass-rm|eq";
    var ACTIVITY_REMOVE_ASSO_EQUIP = "rem-ass-rm|eq";
    var LOAD_FREE_EQUIP = "ROOM_FREE";
    $scope.ROLE = [{value:'MTC',label:'Main Telecom'},{value:'TC',label:'Telecom'},{value:'SPR',label:'Spare'},{value:'STR',label:'Storage'}];
    
    $scope.room = {id: "",
                    roomID :"",
                    pointOfContact :"",
                    technicalPointOfContact :"",
                    roomSize :"",
                    role:"",
                    parentSite:{
                        id:"",
                        name:""
                    },
                    lstEquips:[]};
    this.emptyRoom = {};
    $scope.canDelete = false; // Flag disable button delete
    $scope.canSave = true;
    
    $scope.isAutorizeUpdatingRoom = false;
    $scope.isAutorizeCreatingRoom = false;
    $scope.isAutorizeDeletingRoom = false;
    $scope.isAutorizeSeeDetailsRoom = false;
    
    this.getLabelROLE = function(pRole) {
        for (t in $scope.ROLE) {
            if ($scope.ROLE[t].value == pRole) return $scope.ROLE[t].label;
        }
    };
    
    function init() {
        self.emptyRoom = angular.copy($scope.room);
        
        if (navigateSrv.getRoom() != null) {
            self.loadRoom(navigateSrv.getRoom());
            navigateSrv.cleanMemory();
        }
        else {
            self.loadList();
        }
        
        $scope.isAutorizeUpdatingRoom = securitySrv.isAuthorized('createRoom');
        $scope.isAutorizeCreatingRoom = securitySrv.isAuthorized('updateRoom');
        $scope.isAutorizeDeletingRoom = securitySrv.isAuthorized('deleteRoom');
        $scope.isAutorizeSeeDetailsRoom = securitySrv.isAuthorized('detailRoom');
        
        $scope.canSave = ($scope.room.id > 0 && $scope.isAutorizeUpdatingRoom) || ($scope.room.id <= 0 && $scope.isAutorizeCreatingRoom);
    }
    
    /** Secure function **/
    this.openRoom = function(pRoom) {
        if ($scope.isAutorizeSeeDetailsRoom) {
            self.setRoom(pRoom);
            self.loadEquipsList();
            $('#details').fadeIn('slow');
        }
    }
    
    this.setRoom = function(pRoom) {
        $scope.room = angular.copy(pRoom);
    }
    
    this.loadRoom = function(p_room) {
        self.setRoom(p_room);
        //$scope.roomForm.$setPristine();
        $scope.canDelete = true;
        self.resetMsg();
        
        self.loadEquipsList();
    };
    
    /** Secure function **/
    this.navigateToRoom = function(p_room) {
        if ($scope.isAutorizeUpdatingRoom) {
            navigateSrv.setRoom(p_room);
            $location.path("/admin/room");
        }
    };
    
    this.resetFrm = function() {
        self.setRoom(self.emptyRoom);
        $scope.roomForm.$setPristine();
        $scope.canDelete = false;
    };
    
    this.resetMsg = function() {
        if ($scope.SQLErrors) delete $scope.SQLErrors;
        if ($scope.SQLMsgs) delete $scope.SQLMsgs;
    }
    
    this.save = function() {
        if ($scope.roomForm.$dirty && $scope.roomForm.$valid) {
            $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/saveRoom.php", // TODO: Make a config with path
                data: {
                    id : $scope.room.id,
                    roomID : $scope.room.roomID,
                    pointOfContact : $scope.room.pointOfContact,
                    technicalPointOfContact : $scope.room.technicalPointOfContact,
                    roomSize : $scope.room.roomSize,
                    role : $scope.room.role,
                    parentSiteKey : $scope.room.parentSite.id
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(
                function(data, status) {
                    self.resetMsg();
                    if (data.msg != '') {
                        $scope.SQLMsgs = data.msg;
                        self.loadList();
                        self.resetFrm();
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
                url: "/MESTO/MESTO_WEB_APP/php/saveRoom.php", // TODO: Make a config with path
                data: {
                    id : $scope.room.id,
                    activity : ACTIVITY_DELETE
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(
                function(data, status) {
                    self.resetMsg();
                    if (data.msg != '') {
                        $scope.SQLMsgs = data.msg;
                        self.loadList();
                        self.resetFrm();
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
    
    this.loadList = function() {
        $http.post("/MESTO/MESTO_WEB_APP/php/DAORoom.php").success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.roomList = data;
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
    
    this.closeSiteList = function() {
        $('#lstSite').fadeOut('slow');
    };

    this.openSiteList = function() {
        self.loadSiteList();
        $('#lstSite').fadeIn('slow');
    };
    
    this.associateSite = function(selectSite) {
        if ($scope.room.parentSite.name != selectSite.siteName) {
            $scope.roomForm.parentSiteName.$setDirty();
        }
        
        $scope.room.parentSite.id = selectSite.id;
        $scope.room.parentSite.name = selectSite.siteName;
        self.closeSiteList();
    };
    
    this.cleanAssociateSite = function() {
        $scope.roomForm.parentSiteName.$setDirty();
        
        $scope.room.parentSite.id = "";
        $scope.room.parentSite.name = "";
    };
    
    this.loadSiteList = function() {
        $http.post("/MESTO/MESTO_WEB_APP/php/DAOSite.php").success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.siteList = data;
                }
                else {
                    $scope.lstStErr = data.error;
                }
            }
        ).error(
            function(data, status, headers, config, statusText) {
                // TODO: error server handling
                $scope.lstStErr = "error: "+status+":"+statusText;
            }
        );
    };
    
    this.loadEquipsList = function() {
        $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/DAOEquipment.php", // TODO: Make a config with path
                data: {
                    id : $scope.room.id,
                    type : "ROOM_INC"
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.room.lstEquips = data;
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
                    id : $scope.room.id,
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
        
        $('#lstFreeEquips').fadeIn('slow');
    };
    
    this.closeFreeEquipsList = function() {
        $('#lstFreeEquips').fadeOut('slow');
        
        delete $scope.lstFreeEquips;
    };
    
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
                    roomID: $scope.room.id,
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
        $location.path("/admin/equip"); // TODO: complete by sending the ID and do the comportement on the Room page
    };
    
    init();
});