describe('Testing the controller of user object', function() {
    beforeEach(module('MESTO'));
    var controller, scope;

    beforeEach(inject(function(_$controller_, $rootScope) {
        scope = $rootScope;
        controller = _$controller_('userCTL', { $scope: scope });
    }));
    
    it('Testing: creation object', function() {
        expect(scope.canDelete).toBeFalsy();
        
        var user = {id: "",
                    username :"",
                    name :"",
                    email :"",
                    password :"",
                    supervisor :"",
                    role :"",
                    title :"",
                    active : false,
                    address :"",
                    phone:""};
        
        expect(scope.user).toEqual(user);
        
        expect(controller.emptyUser).toEqual(user);
    });
    
    xit('Testing: Get the label from TYPE value', function() {
        expect(controller.getLabelTYPE('RT')).toEqual("Router");
        expect(controller.getLabelTYPE('HUB')).toEqual("Hub");
        expect(controller.getLabelTYPE('SRV')).toEqual("Server");
        expect(controller.getLabelTYPE('SWT')).toEqual("Switch");
    });
    
    it('Testing: Active to changePassword', function() {
        expect(scope.changePassword).toBeFalsy();
        
        controller.changePassword();
        
        expect(scope.changePassword).toBeTruthy();
        
        controller.changePassword();
        
        expect(scope.changePassword).toBeFalsy();
    });
    
    describe('Dependancy to navigateSrv', function() {
        var location, navigateSrv;
        
        beforeEach(inject(function(_navigateSrv_, _$location_) {
            navigateSrv = _navigateSrv_;
            location = _$location_;
        }));
        it('Testing: NavigateToUser function', function() {
            var user = {id: "1",
                    username :"admin",
                    name :"Ad Mean",
                    email :"admin@test.ca",
                    password :"fj387dj2i",
                    supervisor :"testeur",
                    role :"ADM",
                    title :"test",
                    active : true,
                    address :"some address",
                    phone:"16156161"};
            
            spyOn(location, 'path');
            
            controller.navigateToUser(user);
            
            expect(location.path).toHaveBeenCalledWith('/admin/user');
            expect(navigateSrv.getUser()).toEqual(user);
        });
        
        it('Testing: Add a new object User', function() {
            spyOn(location, 'path');
            
            controller.newUser();
            
            expect(location.path).toHaveBeenCalledWith('/admin/user');
        });
    });

    it('Testing: Load of a user', function() {
        scope.SQLMsgs = "Good message";
        scope.SQLErrors = "bad message";
        
        var fakeUser = {id: "1",
                    username :"admin",
                    name :"Ad Mean",
                    email :"admin@test.ca",
                    password :"fj387dj2i",
                    supervisor :"testeur",
                    role :"ADM",
                    title :"test",
                    active : true,
                    address :"some address",
                    phone:"16156161"};
                    
        controller.loadUser(fakeUser);
        
        expect(scope.user).toEqual(fakeUser);
        expect(scope.canDelete).toBe(true);
        expect(scope.SQLMsgs).not.toBeDefined();
        expect(scope.SQLErrors).not.toBeDefined();
    });
    
    it('Testing: Reset form', function() {
        scope.userForm = {$setPristine : function(){}};
        controller.loadUser({id: "1",
                            username :"admin",
                            name :"Ad Mean",
                            email :"admin@test.ca",
                            password :"fj387dj2i",
                            role :"ADM",
                            active : true});
        
        controller.resetFrm();
        
        expect(scope.canDelete).toBe(false);
        expect(scope.user).toEqual({id: "",
                                    username :"",
                                    name :"",
                                    email :"",
                                    password :"",
                                    supervisor :"",
                                    role :"",
                                    title :"",
                                    active : false,
                                    address :"",
                                    phone:""});
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
    
    describe('Testing Ajax call from User object', function() {
        beforeEach(inject(function(_$httpBackend_) {
            $httpBackend = _$httpBackend_;
        }));
 
        it('Testing: Refresh users list with success', function() {
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond(200, '[{"id": "1",'
                                                                                            +'"username":"admin",'
                                                                                            +'"name":"Ad Mean",'
                                                                                            +'"email":"admin@test.ca",'
                                                                                            +'"password":"fj387dj2i",'
                                                                                            +'"role":"ADM",'
                                                                                            +'"active":"true"}]');

            controller.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.lstError).not.toBeDefined();
            expect(scope.userList).toEqual([{"id":"1",
                                                "username":"admin",
                                                "name":"Ad Mean",
                                                "email":"admin@test.ca",
                                                "password":"fj387dj2i",
                                                "role":"ADM",
                                                "active":"true"}]);
        });
        it('Testing: Generated error for Refresh', function() {
            scope.canDelete = true;
            scope.user = {username:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            
            controller.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.userList).not.toBeDefined();
            expect(scope.lstError).toEqual('Database error, Contact administrator. Try later'); // Principal test
        });
        it('Testing: Refresh users list and failed...', function() {
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond(500, 'server error');

            controller.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.userList).not.toBeDefined();
            expect(scope.lstError).toEqual('error: 500:undefined'); // Principal test
        });
 
        it('Testing: Skipping the Saving', function() {
            scope.userForm = {$dirty:false, $valid:false};
            scope.canDelete = true;
            scope.user = {username:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveUser.php').respond('{"msg":"User created successfully!!!", "error":""}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond([{}]);
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond('[{"id": "1",'
                                                                                        +'"username":"admin",'
                                                                                        +'"name":"Ad Mean",'
                                                                                        +'"email":"admin@test.ca",'
                                                                                        +'"password":"fj387dj2i",'
                                                                                        +'"role":"ADM",'
                                                                                        +'"active":"true"}]');

            controller.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.user).toEqual({username :"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.userList).toEqual([{}]);
        });
        it('Testing: Succeeding the Saving (with old msg)', function() {
            scope.userForm = {$setPristine:function(){}, $dirty:true, $valid:true};
            scope.SQLErrors = " error msg";
            scope.MsgErrors = "success msg";
            scope.canDelete = true;
            scope.user = {username:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveUser.php').respond('{"msg":"User created successfully!!!", "error":""}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond('');
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond('[{"id": "1",'
                                                                                        +'"username":"admin",'
                                                                                        +'"name":"Ad Mean",'
                                                                                        +'"email":"admin@test.ca",'
                                                                                        +'"password":"fj387dj2i",'
                                                                                        +'"role":"ADM",'
                                                                                        +'"active":"true"}]');

            controller.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(false);
            expect(scope.user).toEqual({id: "",
                                        username :"",
                                        name :"",
                                        email :"",
                                        password :"",
                                        supervisor :"",
                                        role :"",
                                        title :"",
                                        active : false,
                                        address :"",
                                        phone:""});
            expect(scope.SQLMsgs).toEqual('User created successfully!!!');
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.userList).toEqual([{"id":"1",
                                                "username":"admin",
                                                "name":"Ad Mean",
                                                "email":"admin@test.ca",
                                                "password":"fj387dj2i",
                                                "role":"ADM",
                                                "active":"true"}]);
        });
        it('Testing: Generated error for Saving', function() {
            scope.userForm = {$dirty:true, $valid:true};
            scope.canDelete = true;
            scope.user = {username:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveUser.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond({});
            
            controller.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.user).toEqual({username:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('Database error, Contact administrator. Try later'); // Principal test
            expect(scope.userList).toEqual({});
        });
        it('Testing: Failing the Saving', function() {
            scope.userForm = {$dirty:true, $valid:true};
            scope.canDelete = true;
            scope.user = {username:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveUser.php').respond(500, 'server error');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond({});
            
            controller.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.user).toEqual({username:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('error: 500:undefined'); // Principal test
            expect(scope.userList).toEqual({});
        });

        
        it('Testing: Succeeding the Deleting (with old Msg)', function() {
            scope.userForm = {$setPristine:function(){}};
            scope.SQLErrors = " error msg";
            scope.MsgErrors = "success msg";
            scope.canDelete = true;
            scope.user = {username:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveUser.php').respond('{"msg":"User deleted successfully!!!", "error":""}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond('');
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond('[{"id": "1",'
                                                                                        +'"username":"admin",'
                                                                                        +'"name":"Ad Mean",'
                                                                                        +'"email":"admin@test.ca",'
                                                                                        +'"password":"fj387dj2i",'
                                                                                        +'"role":"ADM",'
                                                                                        +'"active":"true"}]');

            controller.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(false);
            expect(scope.user).toEqual({id: "",
                                        username :"",
                                        name :"",
                                        email :"",
                                        password :"",
                                        supervisor :"",
                                        role :"",
                                        title :"",
                                        active : false,
                                        address :"",
                                        phone:""});
            expect(scope.SQLMsgs).toEqual('User deleted successfully!!!');
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.userList).toEqual([{"id":"1",
                                                "username":"admin",
                                                "name":"Ad Mean",
                                                "email":"admin@test.ca",
                                                "password":"fj387dj2i",
                                                "role":"ADM",
                                                "active":"true"}]);
        });
        it('Testing: Generating error for Deleting', function() {
            scope.canDelete = true;
            scope.user = {username:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveUser.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond('fake');
            
            controller.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.user).toEqual({username:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('Database error, Contact administrator. Try later'); // Principal test
            expect(scope.userList).toEqual('fake');
        });
        it('Testing: Failling the Deleting', function() {
            scope.canDelete = true;
            scope.user = {username:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveUser.php').respond(500, 'server error');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond({});
            
            controller.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.user).toEqual({username:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('error: 500:undefined'); // Principal test
            expect(scope.userList).toEqual({});
        });
    });
});