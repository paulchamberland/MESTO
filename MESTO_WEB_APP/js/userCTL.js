app.controller('userCTL', function($scope, $http, $location, navigateSrv, securitySrv) {
    var self = this;
    var ACTIVITY_DELETE = "del";

    $scope.user = {id: "",
                    username :"",
                    name :"",
                    email :"",
                    password :"",
                    supervisor :"",
                    role :"",
                    title :"",
                    active : false,
                    approved : false,
                    address :"",
                    phone:""};
    this.emptyUser = {};
    $scope.canDelete = false;
    $scope.canSave = true;
    $scope.changePassword = false;
    
    $scope.isAutorizeChangingPassword = false;
    $scope.isAutorizeUpdatingUser = false;
    $scope.isAutorizeCreatingUser = false;
    $scope.isAutorizeDeletingUser = false;
    
    this.isSendingEmail = false;
    
    this.getNameRole = function(pRole) {
        for (t in $scope.roleList) {
            if ($scope.roleList[t].id == pRole) return $scope.roleList[t].name;
        }
        return "";
    };
    
    this.changePassword = function() {
        $scope.changePassword = ! $scope.changePassword;
    };
    
    function init() {
        self.emptyUser = angular.copy($scope.user);
        
        if (navigateSrv.getUser() != null) {
            self.loadUser(navigateSrv.getUser());
            navigateSrv.cleanMemory();
        }
        else {
            self.loadList();
        }
        
        self.loadRolesList();
        
        $scope.isAutorizeChangingPassword = securitySrv.isAuthorized('chgPWDUser');
        $scope.isAutorizeUpdatingUser = securitySrv.isAuthorized('updateUser');
        $scope.isAutorizeCreatingUser = securitySrv.isAuthorized('createUser');
        $scope.isAutorizeDeletingUser = securitySrv.isAuthorized('deleteUser');
        
        $scope.canSave = ($scope.user.id > 0 && $scope.isAutorizeUpdatingUser) || ($scope.user.id <= 0 && $scope.isAutorizeCreatingUser);
    };
    
    this.setUser = function (pUser) {
        $scope.user = angular.copy(pUser);
    };
    
    this.loadUser = function(pUser) {
        self.setUser(pUser);
        $scope.canDelete = true;
        self.resetMsg();
    };
    
    this.navigateToUser = function(pUser) {
        navigateSrv.setUser(pUser);
        $location.path("/admin/user");
    };
    
    this.resetFrm = function() {
        self.setUser(self.emptyUser);
        $scope.userForm.$setPristine();
        $scope.canDelete = false;
    };
    
    this.resetMsg = function() {
        if ($scope.SQLErrors) delete $scope.SQLErrors;
        if ($scope.SQLMsgs) delete $scope.SQLMsgs;
    };
    
    this.save = function() {
        if ($scope.userForm.$dirty && $scope.userForm.$valid) {
            /*if (self.isSendingEmail) 
                self.notifyUser($scope.user.email, "You're new user have been approved");*/
                
            $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/saveUser.php", // TODO: Make a config with path
                data: {                    
                    id : $scope.user.id,
                    username : $scope.user.username,
                    name : $scope.user.name,
                    email : $scope.user.email,
                    password : $scope.user.password,
                    supervisor : $scope.user.supervisor,
                    role : $scope.user.role,
                    title : $scope.user.title,
                    active : $scope.user.active,
                    approved : $scope.user.approved,
                    address : $scope.user.address,
                    phone : $scope.user.phone
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(
                function(data, status) {
                    self.resetMsg();
                    if (data.msg != '') {
                        //$scope.SQLMsgs = data.msg;
                        //self.loadList();
                        self.resetFrm();
                        
                        if ($location.path() == "/admin/user") {
                            $location.path("/admin/users");
                        }
                        else {
                            $scope.SQLMsgs = data.msg;
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
                url: "/MESTO/MESTO_WEB_APP/php/saveUser.php", // TODO: Make a config with path
                data: {
                    id : $scope.user.id,
                    activity : ACTIVITY_DELETE
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(
                function(data, status) {
                    self.resetMsg();
                    if (data.msg != '') {
                        //$scope.SQLMsgs = data.msg;
                        //self.loadList();
                        self.resetFrm();
                        $location.path("/admin/users");
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
        $http.post("/MESTO/MESTO_WEB_APP/php/DAOUser.php").success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.userList = data;
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
    
    this.loadRolesList = function() {
        $http.post("/MESTO/MESTO_WEB_APP/php/DAOUserRole.php").success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.roleList = data;
                }
                else {
                }
            }
        ).error(
            function(data, status, headers, config, statusText) {
                // TODO: error server handling
            }
        );
    };
    
    this.newUser = function() {
        $location.path("/admin/user");
    };
    
    this.approve = function() {
        if ($scope.user.approved != 1 && $scope.user.active == 1) {
            $scope.user.approved = 1;
            self.isSendingEmail = true;
        }
    };
    
    
    
    init();
});