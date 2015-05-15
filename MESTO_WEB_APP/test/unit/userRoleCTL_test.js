describe('Testing the controller of userRole object', function() {
    beforeEach(module('MESTO'));
    var controller, scope;

    beforeEach(inject(function(_$controller_, $rootScope) {
        scope = $rootScope;
        controller = _$controller_('userRoleCTL', { $scope: scope });
    }));
    
    it('Testing: creation object', function() {
        expect(scope.canDelete).toBeFalsy();
        
        var userRole = {id: "",
                    name :"",
                    description :"",
                    lstPermissions :[]};
        
        expect(scope.userRole).toEqual(userRole);
        
        expect(controller.emptyUserRole).toEqual(userRole);
        expect(scope.lstSelectedPermissionsObj).toEqual([]);
    });
    
    describe('Dependancy to navigateSrv', function() {
        var location, navigateSrv;
        
        beforeEach(inject(function(_navigateSrv_, _$location_) {
            navigateSrv = _navigateSrv_;
            location = _$location_;
        }));
        it('Testing: NavigateToUserRole function', function() {
            var userRole = {id: "1",
                    name :"SpecialTester",
                    lstPermissions :["test", "test2"]};
            
            spyOn(location, 'path');
            
            controller.navigateToUserRole(userRole);
            
            expect(location.path).toHaveBeenCalledWith('/admin/role');
            expect(navigateSrv.getUserRole()).toEqual(userRole);
        });
        
        it('Testing: Redirect to UserRole form', function() {
            spyOn(location, 'path');
            
            controller.newUserRole();
            
            expect(location.path).toHaveBeenCalledWith('/admin/role');
        });
    });

    it('Testing: Load of a userRole', function() {
        scope.SQLMsgs = "Good message";
        scope.SQLErrors = "bad message";
        
        var fakeUserRole = {id: "1",
                        name :"SpecialTester",
                        lstPermissions :"test,test2"};
                    
        controller.loadUserRole(fakeUserRole);
        
        expect(scope.userRole).toEqual({id: "1",
                                name :"SpecialTester",
                                lstPermissions :["test","test2"]});
        expect(scope.lstSelectedPermissionsObj).toEqual([]);
        expect(scope.canDelete).toBe(true);
        expect(scope.SQLMsgs).not.toBeDefined();
        expect(scope.SQLErrors).not.toBeDefined();
    });
    
    it('Testing: Reset form', function() {
        scope.userRoleForm = {$setPristine : function(){}};
        controller.loadUserRole({id: "1",
                                name :"SpecialTester",
                                description: "well test",
                                lstPermissions :"test,test2"});
        
        controller.resetFrm();
        
        expect(scope.canDelete).toBe(false);
        expect(scope.userRole).toEqual({id: "",
                                name :"",
                                description: "",
                                lstPermissions :[]});
        expect(scope.lstSelectedPermissionsObj).toEqual([]);
    });
    
    it('Testing: Reset Messages ', function() {
        controller.resetMsg(); // Test when already not define
        
        expect(scope.SQLMsgs).not.toBeDefined();
        expect(scope.SQLErrors).not.toBeDefined();
        
        scope.SQLMsgs = "Good message";
        scope.SQLErrors = "bad message";
        controller.resetMsg(); // test when define
        
        expect(scope.SQLMsgs).not.toBeDefined();
        expect(scope.SQLErrors).not.toBeDefined();
    });
    
    it('Testing: getLstSelectedPermissionsObj function', function() {
        scope.lstSelectedPermissionsObj = ["test"];
        
        expect(controller.getLstSelectedPermissionsObj()).toEqual(["test"]);
    });
    
    it('Testing: affectPermissions  function', function() {
        
        controller.affectPermissions()
         
        expect(scope.lstSelectedPermissionsObj).toEqual([]);
        expect(scope.userRole.lstPermissions).toEqual([]);
        
        controller.affectPermissions(null, null)
         
        expect(scope.lstSelectedPermissionsObj).toEqual([]);
        expect(scope.userRole.lstPermissions).toEqual([]);
         
        var basics = [{codeName:"test", name:"tester"},{codeName:"test2", name:"tester2"},{codeName:"test3", name:"tester3"}]
        controller.affectPermissions(null, basics)
         
        expect(scope.lstSelectedPermissionsObj).toEqual([]);
        expect(scope.userRole.lstPermissions).toEqual([]);
         
        scope.userRole.lstPermissions = ["test2"];
        controller.affectPermissions(null, basics)
         
        expect(scope.lstSelectedPermissionsObj).toEqual([{codeName:"test2", name:"tester2"}]);
        expect(scope.userRole.lstPermissions).toEqual(["test2"]);
        
        var basics = [{codeName:"test", name:"tester"},{codeName:"test2", name:"tester2"},{codeName:"test3", name:"tester3"}]
        controller.affectPermissions(["test3"], basics)
         
        expect(scope.lstSelectedPermissionsObj).toEqual([{codeName:"test2", name:"tester2"},{codeName:"test3", name:"tester3"}]);
        expect(scope.userRole.lstPermissions).toEqual(["test2","test3"]);
    });
    
    it('Testing: unaffectPermissions function', function() {
        controller.unaffectPermissions();
        
        expect(scope.lstSelectedPermissionsObj).toEqual([]);
        expect(scope.userRole.lstPermissions).toEqual([]);
        
        controller.unaffectPermissions(null);
        
        expect(scope.lstSelectedPermissionsObj).toEqual([]);
        expect(scope.userRole.lstPermissions).toEqual([]);
        
        scope.lstSelectedPermissionsObj = [{codeName:"test2", name:"tester2"},{codeName:"test3", name:"tester3"}];
        scope.userRole.lstPermissions = ["test2","test3"];
        controller.unaffectPermissions(["test2"]);
        
        expect(scope.lstSelectedPermissionsObj).toEqual([{codeName:"test3", name:"tester3"}]);
        expect(scope.userRole.lstPermissions).toEqual(["test3"]);
    });
    
    describe('Testing Ajax call from UserRole object', function() {
        beforeEach(inject(function(_$httpBackend_) {
            $httpBackend = _$httpBackend_;
        }));
 
        it('Testing: Refresh users list with success', function() {
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond(200, '[{"id": "1",'
                                                                                            +'"name":"SpecialTester",'
                                                                                            +'"lstPermissions":"test,test2"}]');

            controller.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.lstError).not.toBeDefined();
            expect(scope.userRoleList).toEqual([{"id":"1",
                                                    "name":"SpecialTester",
                                                    "lstPermissions":"test,test2"}]);
        });
        it('Testing: Generated error for Refresh', function() {
            scope.canDelete = true;
            scope.userRole = {name:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            
            controller.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.userRoleList).not.toBeDefined();
            expect(scope.lstError).toEqual('Database error, Contact administrator. Try later'); // Principal test
        });
        it('Testing: Refresh userRoles list and failed...', function() {
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond(500, 'server error');

            controller.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.userRoleList).not.toBeDefined();
            expect(scope.lstError).toEqual('error: 500:undefined'); // Principal test
        });
 
        it('Testing: Skipping the Saving', function() {
            scope.userRoleForm = {$dirty:false, $valid:false};
            scope.canDelete = true;
            scope.userRole = {name:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveUserRole.php').respond('{"msg":"Role created successfully!!!", "error":""}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond([{}]);
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond('[{"id": "1",'
                                                                                            +'"name":"SpecialTester",'
                                                                                            +'"lstPermissions":"test,test2"}]');

            controller.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.userRole).toEqual({name :"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.userRoleList).toEqual([{}]);
        });
        it('Testing: Succeeding the Saving (with old msg)', function() {
            scope.userRoleForm = {$setPristine:function(){}, $dirty:true, $valid:true};
            scope.SQLErrors = " error msg";
            scope.MsgErrors = "success msg";
            scope.canDelete = true;
            scope.userRole = {name:"fake",
                              lstPermissions:["test","test2"]
                             };
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveUserRole.php').respond('{"msg":"Role created successfully!!!", "error":""}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond('');
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond('[{"id": "1",'
                                                                                        +'"name":"SpecialTester",'
                                                                                        +'"lstPermissions":"test,test2"}]');

            controller.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(false);
            expect(scope.userRole).toEqual({id: "",
                                        name :"",
                                        description :"",
                                        lstPermissions :[]});
            expect(scope.SQLMsgs).toEqual('Role created successfully!!!');
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.userRoleList).toEqual([{"id":"1",
                                                    "name":"SpecialTester",
                                                    "lstPermissions":"test,test2"}]);
        });
        it('Testing: Generated error for Saving', function() {
            scope.userRoleForm = {$dirty:true, $valid:true};
            scope.canDelete = true;
            scope.userRole = {name:"fake",
                              lstPermissions:["test","test2"]
                             };
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveUserRole.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond({});
            
            controller.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.userRole).toEqual({name:"fake",
                                            lstPermissions:["test","test2"]
                                           });
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('Database error, Contact administrator. Try later'); // Principal test
            expect(scope.userRoleList).toEqual({});
        });
        it('Testing: Failing the Saving', function() {
            scope.userRoleForm = {$dirty:true, $valid:true};
            scope.canDelete = true;
            scope.userRole = {name:"fake",
                              lstPermissions:["test","test2"]
                             };
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveUserRole.php').respond(500, 'server error');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond({});
            
            controller.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.userRole).toEqual({name:"fake",
                                            lstPermissions:["test","test2"]
                                           });
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('error: 500:undefined'); // Principal test
            expect(scope.userRoleList).toEqual({});
        });

        
        it('Testing: Succeeding the Deleting (with old Msg)', function() {
            scope.userRoleForm = {$setPristine:function(){}};
            scope.SQLErrors = " error msg";
            scope.MsgErrors = "success msg";
            scope.canDelete = true;
            scope.userRole = {name:"fake",
                              lstPermissions:["test","test2"]
                             };
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveUserRole.php').respond('{"msg":"Role deleted successfully!!!", "error":""}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond('');
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond('[{"id": "1",'
                                                                                        +'"name":"SpecialTester",'
                                                                                        +'"lstPermissions":"test,test2"}]');

            controller.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(false);
            expect(scope.userRole).toEqual({id: "",
                                            name :"",
                                            description :"",
                                            lstPermissions :[]
                                           });
            expect(scope.SQLMsgs).toEqual('Role deleted successfully!!!');
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.userRoleList).toEqual([{"id":"1",
                                                    "name":"SpecialTester",
                                                    "lstPermissions":"test,test2"}]);
        });
        it('Testing: Generating error for Deleting', function() {
            scope.canDelete = true;
            scope.userRole = {name:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveUserRole.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond('fake');
            
            controller.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.userRole).toEqual({name:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('Database error, Contact administrator. Try later'); // Principal test
            expect(scope.userRoleList).toEqual('fake');
        });
        it('Testing: Failling the Deleting', function() {
            scope.canDelete = true;
            scope.userRole = {name:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveUserRole.php').respond(500, 'server error');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond({});
            
            controller.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.userRole).toEqual({name:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('error: 500:undefined'); // Principal test
            expect(scope.userRoleList).toEqual({});
        });
    });
});