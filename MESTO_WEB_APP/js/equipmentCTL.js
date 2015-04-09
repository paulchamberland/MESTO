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
                    type:""};
    this.emptyEquipment = {};
    $scope.canDelete = false;
    
    // TODO: To remove at some point
    $scope.equipment_init = {id: "",
                    serialNumber :"432-43453454-4ref4",
                    barCode :"code",
                    manufacturer :"avenger",
                    model :"XW-5",
                    configHW :"some config",
                    configSW :"some config 2",
                    type:"HUB"};
    
    function init() {
        loadList();
        self.emptyEquipment = angular.copy($scope.equipment);
        //$scope.equipment = angular.copy($scope.equipment_init); // TODO: to remove at some point...
    }
    
    $scope.loadEquipment = function(p_equip) {
        $scope.equipment = angular.copy(p_equip);
        $scope.equipmentForm.$setPristine();
        $scope.canDelete = true;
        $scope.resetMsg();
    };
    
    $scope.resetFrm = function() {
        $scope.equipment = angular.copy(self.emptyEquipment);
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
                    type : $scope.equipment.type
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
    
    init();
});