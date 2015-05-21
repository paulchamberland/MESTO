describe('Testing the controller of permission object', function() {
    beforeEach(module('MESTO'));
    var controller, scope;

    beforeEach(inject(function(_$controller_, $rootScope) {
        scope = $rootScope;
        controller = _$controller_('permissionCTL', { $scope: scope });
        
        $ = function() {return {
                fadeOut : function() {},
                fadeIn : function() {}
            };
        };
    }));
    
    it('Testing: creation object', function() {
        
        var permission = {
                    codeName :"",
                    name :"",
                    description :""};
        
        expect(scope.permission).toEqual(permission);
        expect(scope.lstPermissions).toEqual([{codeName:"adminAccess",name:"Access to Admin Section", description:"Block Logging, show/hide navigation button"}
                                            ,{codeName:"deleteRole",name:"Delete existing role", description:"Show/Hide the delete button"}
                                            ,{codeName:"deleteUser",name:"Delete existing user", description:"Show/Hide the delete button"}
                                            ,{codeName:"deleteEquip",name:"Delete existing equipement", description:"Show/Hide the delete button"}
                                            ,{codeName:"deleteRoom",name:"Delete existing room", description:"Show/Hide the delete button"}
                                            ,{codeName:"deleteSite",name:"Delete existing site", description:"Show/Hide the delete button"}
                                            ,{codeName:"updateRole",name:"Modify existing role", description:"Enable/Disable the update function"}
                                            ,{codeName:"chgRoleUser",name:"Change Role of a User", description:"Show/Hide button of Role Management in UserForm"}
                                            ,{codeName:"chgPWDUser",name:"Change password of a User", description:"Block the update function when this value change "}
                                            ,{codeName:"updateUser",name:"Modify existing user", description:"Enable/Disable the update function"}
                                            ,{codeName:"updateEquip",name:"Modify existing equipment", description:"Enable/Disable the update function"}
                                            ,{codeName:"updateRoom",name:"Modify existing room", description:"Enable/Disable the update function"}
                                            ,{codeName:"updateSite",name:"Modify existing site", description:"Enable/Disable the update function"}
                                            ,{codeName:"createRole",name:"Create new Role", description:"Show/Hide functionalities in the Menu"}
                                            ,{codeName:"createUser",name:"Create new user", description:"Show/Hide functionalities in the Menu"}
                                            ,{codeName:"createEquip",name:"Create new equipment", description:"Show/Hide functionalities in the Menu"}
                                            ,{codeName:"createRoom",name:"Create new room", description:"Show/Hide functionalities in the Menu"}
                                            ,{codeName:"createSite",name:"Create new site", description:"Show/Hide functionalities in the Menu"}
                                            ,{codeName:"detailRoom",name:"See details of a room", description:"Stop the open Details Popup from list"}
                                            ,{codeName:"detailEquip",name:"See details of an equipment", description:"Stop the open Details Popup from list"}
                                            ,{codeName:"detailSite",name:"See details of a site", description:"Stop the open Details Popup from list"}]);
        
    });
    
    it('Testing: Open/set permission', function() {
        var permission = {
                    codeName :"test",
                    name :"tester",
                    description :"un test"};
                    
        controller.openPermission(permission);
        
        expect(scope.permission).toEqual(permission);
        
        // TODO: make a spy of jquery without or sub object function
    });
});