app.controller('equipmentCTL', function($scope, $http, $location, $routeParams, navigateSrv, securitySrv, streamSrv, enumManagerSrv, $modal) {
    var self = this;
    var ACTIVITY_DELETE = "del";
    this.modalInstance = null; // shoudl be private, but test need it public.
    $scope.TYPE = enumManagerSrv.getEquip_TYPE();

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
                        roomID:"",
                        siteName:"",
                        role:""
                    },
                    parentSite:{
                        id:"",
                        name:"",
                        role:""
                    },
                    updateBy: "",
                    updateDate: ""};
    this.emptyEquipment = {};
    $scope.canDelete = false;
    $scope.canSave = true;
    
    $scope.isAutorizeUpdatingEquip = false;
    $scope.isAutorizeCreatingEquip = false;
    $scope.isAutorizeDeletingEquip = false;
    $scope.isAutorizeSeeDetailsEquip = false;
    
    this.getLabelTYPE = enumManagerSrv.getEquipLabelTYPE;
    
    function init() {
        self.emptyEquipment = angular.copy($scope.equipment);
        
        if ($routeParams.serialNumber) {
            self.loadDBEquipment($routeParams.serialNumber);
            $scope.canDelete = true;
        }
        else if (navigateSrv.getEquip() != null) {
            self.loadEquipment(navigateSrv.getEquip());
            navigateSrv.cleanMemory();
        }
        else {
            self.loadList();
        }
        
        $scope.isAutorizeUpdatingEquip = securitySrv.isAuthorized('updateEquip');
        $scope.isAutorizeCreatingEquip = securitySrv.isAuthorized('createEquip');
        $scope.isAutorizeDeletingEquip = securitySrv.isAuthorized('deleteEquip');
        $scope.isAutorizeSeeDetailsEquip = securitySrv.isAuthorized('detailEquip');
        
        $scope.canSave = ($scope.equipment.id > 0 && $scope.isAutorizeUpdatingEquip) || ($scope.equipment.id <= 0 && $scope.isAutorizeCreatingEquip);
    }
    
    /** Secure function **/
    this.openEquipment = function(pEquip) {
        if ($scope.isAutorizeSeeDetailsEquip) {
            self.setEquipment(pEquip);
            $('#details').fadeIn('slow');
        }
    }
    
    this.setEquipment = function (p_equip) {
        $scope.equipment = angular.copy(p_equip);
    };
    
    this.loadEquipment = function(p_equip) {
        self.setEquipment(p_equip);
        //$scope.equipmentForm.$setPristine();
        $scope.canDelete = true;
        self.resetMsg();
    };
    
    /** Secure function **/
    this.navigateToEquipment = function(p_equip) {
        if ($scope.isAutorizeUpdatingEquip) {
            navigateSrv.setEquip(p_equip);
            $location.path("/admin/equip");
        }
    };
    
    /** Secure function **/
    this.seeEquipmentDetails = function(p_equip) {
        if ($scope.isAutorizeSeeDetailsEquip) {
            navigateSrv.setEquip(p_equip);
            $location.path("/equip");
        }
    };
    
    this.resetFrm = function() {
        self.setEquipment(self.emptyEquipment);
        $scope.equipmentForm.$setPristine();
        $scope.canDelete = false;
    };
    
    this.resetMsg = function() {
        if ($scope.SQLErrors) delete $scope.SQLErrors;
        if ($scope.SQLMsgs) delete $scope.SQLMsgs;
    }
    
    this.save = function() {
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
                    parentRoomKey : ($scope.equipment.parentRoom) ? $scope.equipment.parentRoom.id : "",
                    parentSiteKey : ($scope.equipment.parentSite) ? $scope.equipment.parentSite.id : "",
                    updateBy : securitySrv.getUserName()
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(
                function(data, status) {
                    self.resetMsg();
                    if (data.msg != '') {
                        streamSrv.saveActivity($scope, false, ($scope.equipment.id == '') ? "add" : "mod", ($scope.equipment.type == "") ? "equipment" : self.getLabelTYPE($scope.equipment.type)
                                                , "equip", $scope.equipment.serialNumber
                                                , ($scope.equipment.parentSite && $scope.equipment.parentSite.id > 0) 
                                                        ? enumManagerSrv.getSiteLabelROLE($scope.equipment.parentSite.role)
                                                        : enumManagerSrv.getRoomLabelROLE($scope.equipment.parentRoom.role)
                                                , ($scope.equipment.parentSite && $scope.equipment.parentSite.id > 0) 
                                                        ? $scope.equipment.parentSite.name
                                                        : $scope.equipment.parentRoom.roomID);
                        
                        //$scope.SQLMsgs = data.msg;
                        //self.loadList();
                        self.resetFrm();
                        $location.path("/admin/equipments");
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
                url: "/MESTO/MESTO_WEB_APP/php/saveEquipment.php", // TODO: Make a config with path
                data: {
                    id : $scope.equipment.id,
                    activity : ACTIVITY_DELETE
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(
                function(data, status) {
                    self.resetMsg();
                    if (data.msg != '') {
                        streamSrv.saveActivity($scope, false, "del", self.getLabelTYPE($scope.equipment.type)
                                                , "equip", $scope.equipment.serialNumber
                                                , ($scope.equipment.parentSite && $scope.equipment.parentSite.id > 0) 
                                                        ? enumManagerSrv.getSiteLabelROLE($scope.equipment.parentSite.role)
                                                        : enumManagerSrv.getRoomLabelROLE($scope.equipment.parentRoom.role)
                                                , ($scope.equipment.parentSite && $scope.equipment.parentSite.id > 0) 
                                                        ? $scope.equipment.parentSite.name
                                                        : $scope.equipment.parentRoom.roomID);
                                                                                       
                        //$scope.SQLMsgs = data.msg;
                        //self.loadList();
                        self.resetFrm();
                        $location.path("/admin/equipments");
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
    
    this.validDoubleAssociation = function() {
        if (($scope.equipment.parentSite.name != null && $scope.equipment.parentSite.name != "")
                && ($scope.equipment.parentRoom.roomID != null && $scope.equipment.parentRoom.roomID != "") ) {
            $scope.equipmentForm.parentSiteName.$setValidity('doubleAssociation', false);
        }
        else {
            $scope.equipmentForm.parentSiteName.$setValidity('doubleAssociation', true);
        }
    };
    
    this.loadList = function() {
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
    
    this.loadDBEquipment = function(pSerialNumber) {
        $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/DAOEquipment.php", // TODO: Make a config with path
                data: {
                    serialNumber : pSerialNumber
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.equipment = data[0];
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
    
    this.closeRoomList = function() {
        self.modalInstance.dismiss('done');
    };
    this.closeSiteList = function() {
        self.modalInstance.dismiss('done');
    };
    
    this.openRoomList = function() {
        self.loadRoomList();
        self.modalInstance = $modal.open({
            animation: true,
            scope: $scope,
            templateUrl: 'roomListModalContent.html'
        });
    };
    this.openSiteList = function() {
        self.loadSiteList();
        self.modalInstance = $modal.open({
            animation: true,
            scope: $scope,
            templateUrl: 'siteListModalContent.html'
        });
    };
    
    this.associateRoom = function(selectRoom) {
        if ($scope.equipment.parentRoom.roomID != selectRoom.roomID) {
            $scope.equipmentForm.parentRoomName.$setDirty();
        }
        
        $scope.equipment.parentRoom.id = selectRoom.id;
        $scope.equipment.parentRoom.roomID = selectRoom.roomID;
        $scope.equipment.parentRoom.role = selectRoom.role;
        $scope.equipment.parentRoom.siteName = selectRoom.siteName;
        
        self.closeRoomList();
    };
    this.associateSite = function(selectSite) {
        if ($scope.equipment.parentSite.name != selectSite.siteName) {
            $scope.equipmentForm.parentSiteName.$setDirty();
        }
        
        $scope.equipment.parentSite.id = selectSite.id;
        $scope.equipment.parentSite.name = selectSite.siteName;
        $scope.equipment.parentSite.role = selectSite.role;
        
        self.closeSiteList();
    };
    
    this.cleanAssociateRoom = function() {
        $scope.equipmentForm.parentRoomName.$setDirty();
        
        $scope.equipment.parentRoom.id = "";
        $scope.equipment.parentRoom.roomID = "";
        $scope.equipment.parentRoom.role = "";
        $scope.equipment.parentRoom.siteName = "";
        
        self.validDoubleAssociation();
    };
    this.cleanAssociateSite = function() {
        $scope.equipmentForm.parentSiteName.$setDirty();
        
        $scope.equipment.parentSite.id = "";
        $scope.equipment.parentSite.name = "";
        $scope.equipment.parentSite.role = "";
        
        self.validDoubleAssociation();
    };
    
    this.loadRoomList = function() {
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
    
    this.newEquip = function() {
        $location.path("/admin/equip");
    };
    
    init();
});