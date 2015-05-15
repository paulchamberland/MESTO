app.controller('userRoleCTL', function($scope, $http, $location, navigateSrv, permissionSrv) {
    var self = this;
    var ACTIVITY_DELETE = "del";

    $scope.userRole = {id: "",
                    name :"",
                    description :"",
                    lstPermissions :[]}
                    
    $scope.lstSelectedPermissionsObj = [];
    $scope.lstAvailablePermissions = [];
    //$scope.lstSelectAvailablePermissions = [];
    
    this.emptyUserRole = {};
    $scope.canDelete = false;
    
    function init() {
        self.emptyUserRole = angular.copy($scope.userRole);
        
        if (navigateSrv.getUserRole() != null) {
            self.loadUserRole(navigateSrv.getUserRole());
            navigateSrv.cleanMemory();
        }
        else {
            self.loadList();
        }
    };
    
    this.setUserRole = function (pUserRole) {
        $scope.userRole = angular.copy(pUserRole);
    };
    
    this.loadUserRole = function(pUserRole) {
        self.setUserRole(pUserRole);
        $scope.userRole.lstPermissions = $scope.userRole.lstPermissions.split(',');
        
        $scope.canDelete = true;
        self.resetMsg();
    };
    
    this.navigateToUserRole = function(pUserRole) {
        navigateSrv.setUserRole(pUserRole);
        $location.path("/admin/role");
    };
    
    this.resetFrm = function() {
        self.setUserRole(self.emptyUserRole);
        $scope.lstSelectedPermissionsObj = [];
        self.setLstAvailablePermissions();
        
        $scope.userRoleForm.$setPristine();
        $scope.canDelete = false;
    };
    
    this.resetMsg = function() {
        if ($scope.SQLErrors) delete $scope.SQLErrors;
        if ($scope.SQLMsgs) delete $scope.SQLMsgs;
    };
    
    this.save = function() {
        if ($scope.userRoleForm.$dirty && $scope.userRoleForm.$valid) {
            $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/saveUserRole.php", // TODO: Make a config with path
                data: {                    
                    id : $scope.userRole.id,
                    name : $scope.userRole.name,
                    description : $scope.userRole.description,
                    lstPermissions : $scope.userRole.lstPermissions.toString()
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
                url: "/MESTO/MESTO_WEB_APP/php/saveUserRole.php", // TODO: Make a config with path
                data: {
                    id : $scope.userRole.id,
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
        $http.post("/MESTO/MESTO_WEB_APP/php/DAOUserRole.php").success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.userRoleList = data;
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
    
    this.newUserRole = function() {
        $location.path("/admin/role");
    };
    
    this.setLstAvailablePermissions = function (pLstAffectedPerms) {
        pLstAffectedPerms = !pLstAffectedPerms ? [] : pLstAffectedPerms;
        
        $scope.lstAvailablePermissions = angular.copy(permissionSrv.lstPermissions);
        
        var index = -1;
        for (var i = 0; i != pLstAffectedPerms.length; i++) {
            index = $scope.lstAvailablePermissions.map(function(e) {return e.codeName}).indexOf(pLstAffectedPerms[i].codeName);
            if (index != -1) {
                $scope.lstAvailablePermissions.splice(index, 1);
                index = -1;
            }
        }
        
        $scope.TEMP2 = null;
        $scope.TEMP = null;
    };
    
    this.affectPermissions = function(pSelectPermCodes, pLstAvailablePermissions) {
        if (pSelectPermCodes == null)
            pSelectPermCodes = $scope.userRole.lstPermissions
        else
            $scope.userRole.lstPermissions = $scope.userRole.lstPermissions.concat(pSelectPermCodes);
        
        pLstAvailablePermissions = !pLstAvailablePermissions ? angular.copy(permissionSrv.lstPermissions) : pLstAvailablePermissions;        
        
        var index = -1;
        for (var i=0; i != pSelectPermCodes.length; i++) {
            index = pLstAvailablePermissions.map(function(e) {return e.codeName}).indexOf(pSelectPermCodes[i]);
            if (index != -1)
                $scope.lstSelectedPermissionsObj.push(pLstAvailablePermissions[index]);
        }
    };
    
    this.unaffectPermissions = function(pSelectPermCodes) {
        pSelectPermCodes = !pSelectPermCodes ? [] : pSelectPermCodes;
        
        var index = -1;
        var index2 = -1;
        for (var i=0; i != pSelectPermCodes.length; i++) {
            index2 = $scope.userRole.lstPermissions.indexOf(pSelectPermCodes[i]);
            if (index2 != -1)
                $scope.userRole.lstPermissions.splice(index2, 1);
        
            index = $scope.lstSelectedPermissionsObj.map(function(e) {return e.codeName}).indexOf(pSelectPermCodes[i]);
            if (index != -1)
                $scope.lstSelectedPermissionsObj.splice(index, 1);
        }
    };
    
    this.getLstSelectedPermissionsObj = function() {
        return $scope.lstSelectedPermissionsObj;
    };
    
    init();
});