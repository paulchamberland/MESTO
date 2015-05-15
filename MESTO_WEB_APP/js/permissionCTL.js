app.controller('permissionCTL', function($scope) {
    var self = this;

    $scope.permission = {
                    codeName :"",
                    name :"",
                    description :""};
    
    $scope.lstPermissions = [];
    
    $scope.lstAvailablePermissions = [];
    $scope.lstSelectAvailablePermissions = [];
    
    function init() {
        $scope.lstPermissions.push({codeName:"test1",name:"first test", description:"this is a first test of permission with a description as long as my sentence can be in the recurrent contexte of developpement at this point"});
        $scope.lstPermissions.push({codeName:"test2",name:"second test", description:"this is a second test of permission"});
        $scope.lstPermissions.push({codeName:"test3",name:"third test", description:"this is a third test of permission"});
        $scope.lstPermissions.push({codeName:"adminAccess",name:"Access to Admin Section", description:"Block Logging, show/hide navigation button"});
        $scope.lstPermissions.push({codeName:"deleteRole",name:"Delete existing role", description:"Show/Hide the delete button"});
        $scope.lstPermissions.push({codeName:"deleteUser",name:"Delete existing user", description:"Show/Hide the delete button"});
        $scope.lstPermissions.push({codeName:"deleteEquip",name:"Delete existing equipement", description:"Show/Hide the delete button"});
        $scope.lstPermissions.push({codeName:"deleteRoom",name:"Delete existing room", description:"Show/Hide the delete button"});
        $scope.lstPermissions.push({codeName:"deleteSite",name:"Delete existing site", description:"Show/Hide the delete button"});
        $scope.lstPermissions.push({codeName:"updateRole",name:"Modify existing role", description:"Enable/Disable the update function"});
        $scope.lstPermissions.push({codeName:"chgRoleUser",name:"Change Role of a User", description:"Show/Hide button of Role Management in UserForm"});
        $scope.lstPermissions.push({codeName:"chgPWDUser",name:"Change password of a User", description:"Block the update function when this value change "});
        $scope.lstPermissions.push({codeName:"updateUser",name:"Modify existing user", description:"Enable/Disable the update function"});
        $scope.lstPermissions.push({codeName:"updateEquip",name:"Modify existing equipment", description:"Enable/Disable the update function"});
        $scope.lstPermissions.push({codeName:"updateRoom",name:"Modify existing room", description:"Enable/Disable the update function"});
        $scope.lstPermissions.push({codeName:"updateSite",name:"Modify existing site", description:"Enable/Disable the update function"});
        $scope.lstPermissions.push({codeName:"createRole",name:"Create new Role", description:"Show/Hide functionalities in the Menu"});
        $scope.lstPermissions.push({codeName:"createUser",name:"Create new user", description:"Show/Hide functionalities in the Menu"});
        $scope.lstPermissions.push({codeName:"createEquip",name:"Create new equipment", description:"Show/Hide functionalities in the Menu"});
        $scope.lstPermissions.push({codeName:"createRoom",name:"Create new room", description:"Show/Hide functionalities in the Menu"});
        $scope.lstPermissions.push({codeName:"createSite",name:"Create new site", description:"Show/Hide functionalities in the Menu"});
        $scope.lstPermissions.push({codeName:"detailRoom",name:"See details of a room", description:"Stop the open Details Popup from list"});
        $scope.lstPermissions.push({codeName:"detailEquip",name:"See details of an equipment", description:"Stop the open Details Popup from list"});
        $scope.lstPermissions.push({codeName:"detailSite",name:"See details of a site", description:"Stop the open Details Popup from list"});
    }
    
    this.openPermission = function(pPerm) {
        self.setPermission(pPerm);
        $('#details').fadeIn('slow');
    }
    
    this.setPermission = function (pPerm) {
        $scope.permission = angular.copy(pPerm);
    };
    
    this.setLstAvailablePermissions = function (pLstAffectedPerms) {
        $scope.lstAvailablePermissions = angular.copy($scope.lstPermissions);
        
        var index = -1;
        for (var i = 0; i != pLstAffectedPerms.length; i++) {
            index = $scope.lstAvailablePermissions.map(function(e) {return e.codeName}).indexOf(pLstAffectedPerms[i].codeName);
            if (index != -1) {
                $scope.lstAvailablePermissions.splice(index, 1);
                index = -1;
            }
        }
    };
    
    init();
});