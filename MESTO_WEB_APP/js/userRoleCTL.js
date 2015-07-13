/* userRoleCTL : Control behavior of views for userRole model.
 * @author : jonathan-lefebvregithub@outlook.com
 */
app.controller('userRoleCTL', function($scope, $http, $location, $routeParams, navigateSrv, permissionSrv, securitySrv, streamSrv, CONF_PATH) {
    var self = this;
    var ACTIVITY_DELETE = "del"; // Constance send by Ajax call to PHP indicating a delete request

    // model
    $scope.userRole = {id: "",
                    name :"",
                    description :"",
                    lstPermissions :[],
                    updateBy: "",
                    updateDate: ""}
                    
    $scope.lstSelectedPermissionsObj = [];
    $scope.lstAvailablePermissions = [];
    //$scope.lstSelectAvailablePermissions = [];
    
    this.emptyUserRole = {};
    $scope.canDelete = false;
    $scope.canSave = true;
    
    $scope.isAutorizeUpdatingRole = false;
    $scope.isAutorizeCreatingRole = false;
    $scope.isAutorizeDeletingRole = false;
    
    // constructor
    function init() {
        self.emptyUserRole = angular.copy($scope.userRole);
        
        if ($routeParams.name) {
            self.loadDBUserRole($routeParams.name);
            $scope.canDelete = true;
        }
        else if (navigateSrv.getUserRole() != null) {
            self.loadUserRole(navigateSrv.getUserRole());
            navigateSrv.cleanMemory();
        }
        else {
            self.loadList();
        }
        
        $scope.isAutorizeUpdatingRole = securitySrv.isAuthorized('updateRole');
        $scope.isAutorizeCreatingRole = securitySrv.isAuthorized('createRole');
        $scope.isAutorizeDeletingRole = securitySrv.isAuthorized('deleteRole');
        
        $scope.canSave = ($scope.userRole.id > 0 && $scope.isAutorizeUpdatingRole) || ($scope.userRole.id <= 0 && $scope.isAutorizeCreatingRole);
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
                url: CONF_PATH+"/php/saveUserRole.php",
                data: {                    
                    id : $scope.userRole.id,
                    name : $scope.userRole.name,
                    description : $scope.userRole.description,
                    lstPermissions : $scope.userRole.lstPermissions.toString(),
                    updateBy : securitySrv.getUserName()
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(
                function(data, status) {
                    self.resetMsg();
                    if (data.msg != '') {
                        streamSrv.saveActivity($scope, true, ($scope.userRole.id == '') ? "add" : "mod", "user's role"
                                                , "role", $scope.userRole.name, "system", "Mesto");
                        //$scope.SQLMsgs = data.msg;
                        //self.loadList();
                        self.resetFrm();
                        $location.path("/admin/roles");
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
                url: CONF_PATH+"/php/saveUserRole.php",
                data: {
                    id : $scope.userRole.id,
                    activity : ACTIVITY_DELETE
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(
                function(data, status) {
                    self.resetMsg();
                    if (data.msg != '') {
                        streamSrv.saveActivity($scope, true, ($scope.userRole.id == '') ? "add" : "mod", "user's role"
                                                , "role", $scope.userRole.name, "system", "Mesto");
                        //$scope.SQLMsgs = data.msg;
                        //self.loadList();
                        self.resetFrm();
                        $location.path("/admin/roles");
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
    
    // Load all userRole list
    this.loadList = function() {
        $http.post(CONF_PATH+"/php/DAOUserRole.php").success(
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
    
    /* Load a specific userRole with a given name
     * @param : pName : Name of the userRole to find
     * @return : none (but fill the model with userRole found.
     */
    this.loadDBUserRole = function(pName) {
        $http({
                method: 'POST',
                url: CONF_PATH+"/php/DAOUserRole.php",
                data: {
                    name : pName
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.userRole = data[0];
                    $scope.userRole.lstPermissions = $scope.userRole.lstPermissions.split(',');
                    self.affectPermissions(null, null);
                    self.setLstAvailablePermissions(self.getLstSelectedPermissionsObj())
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
    
    this.newUserRole = function() {
        $location.path("/admin/role");
    };
    
    // Set available permission according to the aldready affected
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
    
    // With all unaffected selected permission set Available array and Selected array permission
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
    
    // With all affected selected permission set Available array and Selected array permission
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