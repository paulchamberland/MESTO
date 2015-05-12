app.controller('permissionCTL', function($scope) {
    var self = this;

    $scope.permission = {
                    codeName :"",
                    name :"",
                    description :""};
    
    $scope.lstPermission = [];
    
    function init() {
        $scope.lstPermission.push({codeName:"test1",name:"first test", description:"this is a first test of permission with a description as long as my sentence can be in the recurrent contexte of developpement at this point"});
        $scope.lstPermission.push({codeName:"test2",name:"second test", description:"this is a second test of permission"});
        $scope.lstPermission.push({codeName:"test3",name:"third test", description:"this is a third test of permission"});
        $scope.lstPermission.push({codeName:"adminAccess",name:"Access to Admin Section", description:"Block Logging, show/hide navigation button"});
        $scope.lstPermission.push({codeName:"deleteRole",name:"Delete existing role", description:"Show/Hide the delete button"});
        $scope.lstPermission.push({codeName:"deleteUser",name:"Delete existing user", description:"Show/Hide the delete button"});
        $scope.lstPermission.push({codeName:"deleteEquip",name:"Delete existing equipement", description:"Show/Hide the delete button"});
        $scope.lstPermission.push({codeName:"deleteRoom",name:"Delete existing room", description:"Show/Hide the delete button"});
        $scope.lstPermission.push({codeName:"deleteSite",name:"Delete existing site", description:"Show/Hide the delete button"});
        $scope.lstPermission.push({codeName:"updateRole",name:"Modify existing role", description:"Enable/Disable the update function"});
        $scope.lstPermission.push({codeName:"chgRoleUser",name:"Change Role of a User", description:"Show/Hide button of Role Management in UserForm"});
        $scope.lstPermission.push({codeName:"chgPWDUser",name:"Change password of a User", description:"Block the update function when this value change "});
        $scope.lstPermission.push({codeName:"updateUser",name:"Modify existing user", description:"Enable/Disable the update function"});
        $scope.lstPermission.push({codeName:"updateEquip",name:"Modify existing equipment", description:"Enable/Disable the update function"});
        $scope.lstPermission.push({codeName:"updateRoom",name:"Modify existing room", description:"Enable/Disable the update function"});
        $scope.lstPermission.push({codeName:"updateSite",name:"Modify existing site", description:"Enable/Disable the update function"});
        $scope.lstPermission.push({codeName:"createRole",name:"Create new Role", description:"Show/Hide functionalities in the Menu"});
        $scope.lstPermission.push({codeName:"createUser",name:"Create new user", description:"Show/Hide functionalities in the Menu"});
        $scope.lstPermission.push({codeName:"createEquip",name:"Create new equipment", description:"Show/Hide functionalities in the Menu"});
        $scope.lstPermission.push({codeName:"createRoom",name:"Create new room", description:"Show/Hide functionalities in the Menu"});
        $scope.lstPermission.push({codeName:"createSite",name:"Create new site", description:"Show/Hide functionalities in the Menu"});
        $scope.lstPermission.push({codeName:"detailRoom",name:"See details of a room", description:"Stop the open Details Popup from list"});
        $scope.lstPermission.push({codeName:"detailEquip",name:"See details of an equipment", description:"Stop the open Details Popup from list"});
        $scope.lstPermission.push({codeName:"detailSite",name:"See details of a site", description:"Stop the open Details Popup from list"});
    }
    
    this.openPermission = function(pPerm) {
        self.setPermission(pPerm);
        $('#details').fadeIn('slow');
    }
    
    this.setPermission = function (pPerm) {
        $scope.permission = angular.copy(pPerm);
    };
    
    init();
});