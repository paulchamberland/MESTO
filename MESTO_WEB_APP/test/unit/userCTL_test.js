describe('Testing the controller of user object => ', function() {
    beforeEach(module('MESTO'));
    var controller, scope;
    
    var emptyUser = {id: "",
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
                    approved : false,
                    address :"",
                    phone:""};
        
        expect(scope.user).toEqual(user);
        
        expect(controller.emptyUser).toEqual(user);
        
        expect(scope.isAutorizeUpdatingUser).toBeFalsy();
        expect(scope.isAutorizeCreatingUser).toBeFalsy();
        expect(scope.isAutorizeDeletingUser).toBeFalsy();
        expect(scope.isAutorizeChangingPassword).toBeFalsy();
        expect(scope.canSave).toBeFalsy();
    });
    
    it('Testing: Get the Name from Role value', function() {
            expect(controller.getNameRole('1')).toEqual("");
            expect(controller.getNameRole('2')).toEqual("");
        });
    
    it('Testing: Active to changePassword', function() {
        expect(scope.changePassword).toBeFalsy();
        
        controller.changePassword();
        
        expect(scope.changePassword).toBeTruthy();
        
        controller.changePassword();
        
        expect(scope.changePassword).toBeFalsy();
    });
    
    describe('Dependancy to navigateSrv => ', function() {
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
                    role :"1",
                    title :"test",
                    active : true,
                    approved : true,
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
                    role :"1",
                    title :"test",
                    active : true,
                    approved : true,
                    address :"some address",
                    phone:"16156161"};
                    
        controller.loadUser(fakeUser);
        
        expect(scope.user).toEqual(fakeUser);
        expect(scope.canDelete).toBe(true);
        expect(scope.SQLMsgs).not.toBeDefined();
        expect(scope.SQLErrors).not.toBeDefined();
    });
    
    it('Testing: Reset user form', function() {
        scope.userForm = {$setPristine : function(){}};
        controller.loadUser({id: "1",
                            username :"admin",
                            name :"Ad Mean",
                            email :"admin@test.ca",
                            password :"fj387dj2i",
                            role :"1",
                            active : true});
        
        controller.resetFrm();
        
        expect(scope.canDelete).toBe(false);
        expect(scope.user).toEqual(emptyUser);
    });
    it('Testing: Reset changePassword form', function() {
        scope.userPwdForm = {$setPristine : function(){}};
        scope.canDelete = true;
        controller.loadUser({id: "1",
                            username :"admin",
                            name :"Ad Mean",
                            email :"admin@test.ca",
                            password :"fj387dj2i",
                            role :"1",
                            active : true});
        
        controller.resetPwdFrm();
        
        expect(scope.canDelete).toBe(true);
        expect(scope.user).toEqual({id: "1",
                                    username :"admin",
                                    name :"Ad Mean",
                                    email :"admin@test.ca",
                                    password :"",
                                    role :"1",
                                    active : true});
    });
    
    it('Testing: Reset Messages of user Form', function() {
        controller.resetMsg(); // Test when already not define
        
        expect(scope.SQLMsgs).not.toBeDefined();
        expect(scope.SQLErrors).not.toBeDefined();
        
        scope.SQLMsgs = "Good message";
        scope.SQLErrors = "bad message";
        controller.resetMsg(); // test when define
        
        expect(scope.SQLMsgs).not.toBeDefined();
        expect(scope.SQLErrors).not.toBeDefined();
    });
    it('Testing: Reset Messages of user change password', function() {
        controller.resetPwdMsg(); // Test when already not define
        
        expect(scope.SQLPwdMsgs).not.toBeDefined();
        expect(scope.SQLPwdErrors).not.toBeDefined();
        
        scope.SQLPwdMsgs = "Good message";
        scope.SQLPwdErrors = "bad message";
        controller.resetPwdMsg(); // test when define
        
        expect(scope.SQLPwdMsgs).not.toBeDefined();
        expect(scope.SQLPwdErrors).not.toBeDefined();
    });
    
    it('Testing: Approve user created', function() {
        scope.user.active = true;
        
        controller.approve();
        
        expect(scope.user.approved).toBeTruthy();
        expect(controller.isSendingEmail).toBeTruthy();
        
        controller.isSendingEmail = false;
        
        controller.approve();
        expect(scope.user.approved).toBeTruthy();
        expect(controller.isSendingEmail).toBeFalsy();
    });
    
    describe('Testing Ajax call from User object => ', function() {
        var location, streamSrv;
        
        beforeEach(inject(function(_$httpBackend_, _$location_, _streamSrv_) {
            $httpBackend = _$httpBackend_;
            location = _$location_;
            streamSrv = _streamSrv_;
        }));
        
        it('Testing: Get the Name from Role value', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond('[{}]');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond('');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond([{id:"1",name:"admin"},{id:"2",name:"test"}]);
            
            controller.loadRolesList();
            
            $httpBackend.flush();
            
            expect(controller.getNameRole('1')).toEqual("admin");
            expect(controller.getNameRole('2')).toEqual("test");
            expect(controller.getNameRole('3')).toEqual("");
        });
 
        it('Testing: Refresh users list with success', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond('');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond([{}]);
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond(200, '[{"id": "1",'
                                                                                            +'"username":"admin",'
                                                                                            +'"name":"Ad Mean",'
                                                                                            +'"email":"admin@test.ca",'
                                                                                            +'"password":"fj387dj2i",'
                                                                                            +'"role":"1",'
                                                                                            +'"active":"true"}]');

            controller.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.lstError).not.toBeDefined();
            expect(scope.userList).toEqual([{"id":"1",
                                                "username":"admin",
                                                "name":"Ad Mean",
                                                "email":"admin@test.ca",
                                                "password":"fj387dj2i",
                                                "role":"1",
                                                "active":"true"}]);
        });
        it('Testing: Generated error for Refresh', function() {
            scope.canDelete = true;
            scope.user = {username:"fake"};
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond('lst');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond([{}]);
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond(200, '{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            
            controller.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.userList).toEqual('lst');
            expect(scope.lstError).toEqual('Database error, Contact administrator. Try later'); // Principal test
        });
        it('Testing: Refresh users list and failed...', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond('lst');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond([{}]);
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond(500, 'server error');

            controller.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.userList).toEqual('lst');
            expect(scope.lstError).toEqual('error: 500:undefined'); // Principal test
        });
 
        it('Testing: Skipping the Saving', function() {
            scope.userForm = {$dirty:false, $valid:false};
            scope.canDelete = true;
            scope.user = {username:"fake"};
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond('[{}]');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond([{}]);
            

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
            scope.user = {id: "1",
                            username :"fake",
                            name :"toto",
                            email :"test@test.ca",
                            password :"",
                            supervisor :"p",
                            role :"TT",
                            title :"truc",
                            active : false,
                            approved : false,
                            address :"",
                            phone:""};
            controller.isSendingEmail = true;
            
            spyOn(location, 'path').and.returnValue("/admin/user");
            spyOn(controller, 'notifyUser');
            spyOn(streamSrv, 'saveActivity');
            spyOn(controller, 'getNameRole');
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond('');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond('');
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveUser.php').respond(200, '{"msg":"User created successfully!!!", "error":""}');
            
            controller.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.user).toEqual({id: "1",
                                        username :"fake",
                                        name :"toto",
                                        email :"test@test.ca",
                                        password :"",
                                        supervisor :"p",
                                        role :"TT",
                                        title :"truc",
                                        active : false,
                                        approved : false,
                                        address :"",
                                        phone:""});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.userList).toEqual('');
                                                
            expect(location.path).toHaveBeenCalledWith("/admin/users");
            expect(controller.notifyUser).toHaveBeenCalledWith('test@test.ca', "You're new user have been approved");
            expect(streamSrv.saveActivity).toHaveBeenCalled();
            expect(streamSrv.saveActivity.calls.mostRecent().args[1]).toBeTruthy();
            expect(controller.getNameRole).toHaveBeenCalled();
            
            location.path.calls.reset();   
            location.path.and.returnValue("/user");
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveUser.php').respond('{"msg":"User created successfully!!!", "error":""}');

            controller.save(); // <--- TEST
            $httpBackend.flush();
            
            expect(location.path).toHaveBeenCalledWith();
            expect(scope.SQLMsgs).toEqual("User created successfully!!!");
            expect(scope.SQLErrors).not.toBeDefined();
            expect(streamSrv.saveActivity).toHaveBeenCalled();
            expect(streamSrv.saveActivity.calls.mostRecent().args[1]).toBeTruthy();
            expect(controller.getNameRole).toHaveBeenCalled();
        });
        it('Testing: Generated error for Saving', function() {
            scope.userForm = {$dirty:true, $valid:true};
            scope.canDelete = true;
            scope.user = {username:"fake"};
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond({});
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond([{}]);
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveUser.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            
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
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond({});
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond([{}]);
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveUser.php').respond(500, 'server error');
            
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
            
            spyOn(location, 'path');
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond('');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond([{}]);
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveUser.php').respond('{"msg":"User deleted successfully!!!", "error":""}');
            
            controller.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(false);
            expect(scope.user).toEqual(emptyUser);
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.userList).toEqual('');
            expect(location.path).toHaveBeenCalledWith("/admin/users");
        });
        it('Testing: Generating error for Deleting', function() {
            scope.canDelete = true;
            scope.user = {username:"fake"};
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond('fake');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond([{}]);
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveUser.php').respond(200, '{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            
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
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond({});
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond([{}]);
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveUser.php').respond(500, 'server error');
            
            controller.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.user).toEqual({username:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('error: 500:undefined'); // Principal test
            expect(scope.userList).toEqual({});
        });
        
        it('Testing: Notify user', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond({});
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond([]);
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/emailNotification.php').respond();
            
            controller.notifyUser("test@test.ca", "subject");
            
            $httpBackend.flush();
        });
        
        describe('Testing sub form of changing password =>', function() {
            it('Testing: Skipping the password Saving', function() {
                scope.userPwdForm = {$dirty:false, $valid:false};
                scope.canDelete = true;
                scope.user = {username:"fake",
                              password:"testest"};
                
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond('[{}]');
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond([{}]);
                

                controller.savePwd(); // <--- TEST

                $httpBackend.flush();
                
                expect(scope.canDelete).toBe(true);
                expect(scope.user).toEqual({username :"fake",
                                            password:"testest"});
                expect(scope.SQLPwdMsgs).not.toBeDefined();
                expect(scope.SQLPwdErrors).not.toBeDefined();
                expect(scope.userList).toEqual([{}]);
            });
            it('Testing: Succeeding the password saving (with old msg)', function() {
                scope.userPwdForm = {$setPristine:function(){}, $dirty:true, $valid:true};
                scope.SQLPwdErrors = " error msg";
                scope.MsgPwdErrors = "success msg";
                scope.user = {id: "1",
                                username :"fake",
                                name :"toto",
                                email :"test@test.ca",
                                password :"testttt",
                                supervisor :"p",
                                role :"",
                                title :"truc",
                                active : false,
                                approved : false,
                                address :"",
                                phone:""};
                
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond('');
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond('');
                
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveUser.php').respond(200, '{"msg":"Password change successfully!!!", "error":""}');
                
                controller.savePwd(); // <--- TEST

                $httpBackend.flush();
                
                expect(scope.user).toEqual({id: "1",
                                            username :"fake",
                                            name :"toto",
                                            email :"test@test.ca",
                                            password :"",
                                            supervisor :"p",
                                            role :"",
                                            title :"truc",
                                            active : false,
                                            approved : false,
                                            address :"",
                                            phone:""});
                                            
                expect(scope.SQLMsgs).not.toBeDefined();
                expect(scope.SQLErrors).not.toBeDefined();
                expect(scope.SQLPwdMsgs).toEqual("Password change successfully!!!");
                expect(scope.SQLPwdErrors).not.toBeDefined();
                expect(scope.userList).toEqual('');
            });
            it('Testing: Generated error for password Saving', function() {
                scope.userPwdForm = {$dirty:true, $valid:true};
                scope.user = {username:"fake", password :"test"};
                
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond({});
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond([{}]);
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveUser.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
                
                controller.savePwd(); // <--- TEST

                $httpBackend.flush();
                
                expect(scope.user).toEqual({username:"fake", password :"test"});
                expect(scope.SQLPwdMsgs).not.toBeDefined();
                expect(scope.SQLPwdErrors).toEqual('Database error, Contact administrator. Try later'); // Principal test
                expect(scope.userList).toEqual({});
            });
            it('Testing: Failing the password Saving', function() {
                scope.userPwdForm = {$dirty:true, $valid:true};
                scope.user = {username:"fake", password :"test"};
                
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond({});
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond([{}]);
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveUser.php').respond(500, 'server error');
                
                controller.savePwd(); // <--- TEST

                $httpBackend.flush();
                
                expect(scope.user).toEqual({username:"fake", password :"test"});
                expect(scope.SQLPwdMsgs).not.toBeDefined();
                expect(scope.SQLPwdErrors).toEqual('error: 500:undefined'); // Principal test
                expect(scope.userList).toEqual({});
            });
            
            it('Testing: Failed to load one User', function() {
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond(''); // CTR init
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond([{}]);
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond(200, '{"msg":"", "error":"Database error"}');
                
                controller.loadDBUser();
                $httpBackend.flush();
                
                expect(scope.SQLErrors).toEqual("Database error");
                expect(scope.user).toEqual(emptyUser);
            });
            it('Testing: Error to load one User', function() {
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond(''); // CTR init
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond([{}]);
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond(500, '{"msg":"", "error":"error"}');
                
                controller.loadDBUser();
                $httpBackend.flush();
                
                expect(scope.SQLErrors).toEqual("error: 500:undefined");
                expect(scope.user).toEqual(emptyUser);
            });
            it('Testing: Success to load one User', function() {
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond(''); // CTR init
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUserRole.php').respond([{}]);
                $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOUser.php').respond(200, '[{"test":"test"}]');
                
                controller.loadDBUser();
                $httpBackend.flush();
                
                expect(scope.SQLErrors).not.toBeDefined();
                expect(scope.user).toEqual({test:"test"});
            });
        });
    });
});