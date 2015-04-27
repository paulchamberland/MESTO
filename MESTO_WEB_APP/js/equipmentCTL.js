app.controller('equipmentCTL', function($scope, $http) {
    var self = this;
    var ACTIVITY_DELETE = "del";
    $scope.TYPE = [{value:'RT',label:'Router'},{value:'HUB',label:'Hub'},{value:'SRV',label:'Server'},{value:'SWT',label:'Switch'}];

    $scope.equipment = {id: "",
                    serialNumber :"",
                    barCode :"",
                    manufacturer :"",
                    model :"",
                    configHW :"",
                    configSW :"",
                    type:"",
                    parentRoom:{
                        id:"",
                        roomID:""
                    },
                    parentSite:{
                        id:"",
                        name:""
                    }};
    this.emptyEquipment = {};
    $scope.canDelete = false;
    $scope.isRoomListOpened = false; // Flag to manage GUI display of the list
    $scope.isSiteListOpened = false; // Flag to manage GUI display of the list
    
    $scope.getLabelTYPE = function(pType) {
        for (t in $scope.TYPE) {
            if ($scope.TYPE[t].value == pType) return $scope.TYPE[t].label;
        }
    };
    
    // TODO: To remove at some point
    $scope.equipment_init = {id: "",
                    serialNumber :"432-43453454-4ref4",
                    barCode :"code",
                    manufacturer :"avenger",
                    model :"XW-5",
                    configHW :"some config",
                    configSW :"some config 2",
                    type:"HUB",
                    parentRoom:{
                        id:"32",
                        roomID:"Test pRoom"
                    },
                    parentSite:{
                        id:"21",
                        name:"test pSite"
                    }};
    
    function init() {
        loadList();
        self.emptyEquipment = angular.copy($scope.equipment);
        //$scope.equipment = angular.copy($scope.equipment_init); // TODO: to remove at some point...
    }
    
    $scope.openEquipment = function(pEquip) {
        $scope.setEquipment(pEquip);
        $('#details').fadeIn('slow');
    }
    
    $scope.setEquipment = function (p_equip) {
        $scope.equipment = angular.copy(p_equip);
    };
    
    $scope.loadEquipment = function(p_equip) {
        $scope.setEquipment(p_equip);
        $scope.equipmentForm.$setPristine();
        $scope.canDelete = true;
        $scope.resetMsg();
    };
    
    $scope.resetFrm = function() {
        $scope.setEquipment(self.emptyEquipment);
        $scope.equipmentForm.$setPristine();
        $scope.canDelete = false;
    };
    
    $scope.resetMsg = function() {
        if ($scope.SQLErrors) delete $scope.SQLErrors;
        if ($scope.SQLMsgs) delete $scope.SQLMsgs;
    }
    
    $scope.save = function() {
        if ($scope.equipmentForm.$dirty && $scope.equipmentForm.$valid) {
            $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/saveEquipment.php", // TODO: Make a config with path
                data: {
                    id : $scope.equipment.id,
                    serialNumber : $scope.equipment.serialNumber,
                    barCode : $scope.equipment.barCode,
                    manufacturer : $scope.equipment.manufacturer,
                    model : $scope.equipment.model,
                    configHW : $scope.equipment.configHW,
                    configSW : $scope.equipment.configSW,
                    type : $scope.equipment.type,
                    parentRoomKey : $scope.equipment.parentRoom.id,
                    parentSiteKey : $scope.equipment.parentSite.id
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(
                function(data, status) {
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
                url: "/MESTO/MESTO_WEB_APP/php/saveEquipment.php", // TODO: Make a config with path
                data: {
                    id : $scope.equipment.id,
                    activity : ACTIVITY_DELETE
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(
                function(data, status) {
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
    
    $scope.validDoubleAssociation = function() {
        if (($scope.equipment.parentSite.name != null && $scope.equipment.parentSite.name != "")
                && ($scope.equipment.parentRoom.roomID != null && $scope.equipment.parentRoom.roomID != "") ) {
            $scope.equipmentForm.parentSiteName.$setValidity('doubleAssociation', false);
        }
        else {
            $scope.equipmentForm.parentSiteName.$setValidity('doubleAssociation', true);
        }
    };
    
    function loadList() {
        $http.post("/MESTO/MESTO_WEB_APP/php/DAOEquipment.php").success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.equipmentList = data;
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
    
    $scope.closeRoomList = function() {
        $scope.isRoomListOpened = false;
        $('#lstRoom').fadeOut('slow');
    };
    $scope.closeSiteList = function() {
        $scope.isSiteListOpened = false;
        $('#lstSite').fadeOut('slow');
    };
    
    $scope.openRoomList = function() {
        if (! $scope.isSiteListOpened) {
            $scope.isRoomListOpened = true;
            $scope.isSiteListOpened = false;
            
            loadRoomList();
            $('#lstRoom').fadeIn('slow');
        }
    };
    $scope.openSiteList = function() {
        if (! $scope.isRoomListOpened) {
            $scope.isRoomListOpened = false;
            $scope.isSiteListOpened = true;
            loadSiteList();
            $('#lstSite').fadeIn('slow');
        }
    };
    
    $scope.associateRoom = function(selectRoom) {
        if ($scope.equipment.parentRoom.roomID != selectRoom.roomID) {
            $scope.equipmentForm.parentRoomName.$setDirty();
        }
        
        $scope.equipment.parentRoom.id = selectRoom.id;
        $scope.equipment.parentRoom.roomID = selectRoom.roomID;
        
        $scope.closeRoomList();
    };
    $scope.associateSite = function(selectSite) {
        if ($scope.equipment.parentSite.name != selectSite.siteName) {
            $scope.equipmentForm.parentSiteName.$setDirty();
        }
        
        $scope.equipment.parentSite.id = selectSite.id;
        $scope.equipment.parentSite.name = selectSite.siteName;
        
        $scope.closeSiteList();
    };
    
    $scope.cleanAssociateRoom = function() {
        $scope.equipmentForm.parentRoomName.$setDirty();
        
        $scope.equipment.parentRoom.id = "";
        $scope.equipment.parentRoom.roomID = "";
        $scope.validDoubleAssociation();
    };
    $scope.cleanAssociateSite = function() {
        $scope.equipmentForm.parentSiteName.$setDirty();
        
        $scope.equipment.parentSite.id = "";
        $scope.equipment.parentSite.name = "";
        $scope.validDoubleAssociation();
    };
    
    function loadRoomList() {
        $http.post("/MESTO/MESTO_WEB_APP/php/DAORoom.php").success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.roomList = data;
                }
                else {
                    $scope.lstRmErr = data.error;
                }
            }
        ).error(
            function(data, status, headers, config, statusText) {
                // TODO: error server handling
                $scope.lstRmErr = "error: "+status+":"+statusText;
            }
        );
    };
    function loadSiteList() {
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
    
    init();
});