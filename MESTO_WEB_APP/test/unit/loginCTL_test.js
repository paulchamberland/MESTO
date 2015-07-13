describe('Testing the Login Controller => ', function() {
    var scope, controller, securitySrv, location, navigateSrv;
    
    beforeEach(module('MESTO'));
    
    beforeEach(inject(function(_$rootScope_, _$controller_, _securitySrv_, _$httpBackend_, _$location_, _navigateSrv_) {
        scope = _$rootScope_;
        controller = _$controller_('loginCTL', { $scope: scope });
        securitySrv = _securitySrv_;
        navigateSrv = _navigateSrv_;
        $httpBackend = _$httpBackend_;
        location = _$location_;
        
        $ = function() {return {
            toggle : function() {},
            toggleClass : function() {}
            };
        };
        
    }));
    
    it('Testing: getUserName function', function() {
        spyOn(securitySrv, "getUserName");
        
        controller.getUserName();
        
        expect(securitySrv.getUserName).toHaveBeenCalled();
    });
    
    it('Testing: isLogged function', function() {
        spyOn(securitySrv, "isLogged");
        
        controller.isLogged();
        
        expect(securitySrv.isLogged).toHaveBeenCalled();
    });
    
    it('Testing: logout function', function() {
        spyOn(securitySrv, "logout");
        
        controller.logout();
        
        expect(securitySrv.logout).toHaveBeenCalled();
    });
    
    it('Testing: open Profile', function() {
        spyOn(securitySrv, 'getUser');
        spyOn(navigateSrv, 'setUser');
        spyOn(location, 'path');
        
        controller.openProfileUser();
        
        expect(securitySrv.getUser).toHaveBeenCalled();
        expect(navigateSrv.setUser).toHaveBeenCalled();
        expect(location.path).toHaveBeenCalled();
    });
    
    describe('Ajax calling =>', function() {
        beforeEach(function() {
            scope.loginForm = {username: {$setValidity: jasmine.createSpy("setValidity")},
                                pwd: {$setValidity: jasmine.createSpy("setValidity2")}};
        });
        
        it('Testing: failed login function', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/login.php").respond(200, {msg:"", error:"Login Failed"});
            
            controller.login({username:"teest", pwd:"t53t"});
            
            $httpBackend.flush();
            
            expect(securitySrv.isLogged()).toBeFalsy();
            expect(securitySrv.getUserName()).toBeNull();
            
            expect(controller.getUserName()).toBeNull();
            expect(scope.loginForm.username.$setValidity).toHaveBeenCalledWith('wrong', false);
            expect(scope.loginForm.pwd.$setValidity).toHaveBeenCalledWith('wrong', false);
        });
        it('Testing: error login function', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/login.php").respond(404, 'server not found');
            
            controller.login({username:"teest", pwd:"t53t"});
            
            $httpBackend.flush();
            
            expect(securitySrv.isLogged()).toBeFalsy();
            expect(securitySrv.getUserName()).toBeNull();
            
            expect(controller.getUserName()).toBeNull();
            expect(scope.loginForm.username.$setValidity).toHaveBeenCalledWith('wrong', false);
            expect(scope.loginForm.pwd.$setValidity).toHaveBeenCalledWith('wrong', false);
        });
        it('Testing: worked login function', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/login.php").respond(200, {msg:"Login success", error:""});
            $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/DAOUser.php").respond(200, [{name:"adminTest"}]);
            spyOn(location, 'path');
            
            controller.login({username:"teest", pwd:"t53t"});
            
            $httpBackend.flush();
            
            expect(securitySrv.isLogged()).toBeTruthy();
            expect(controller.getUserName()).toEqual('adminTest');
            
            expect(scope.loginForm.username.$setValidity).toHaveBeenCalledWith('wrong', true);
            expect(scope.loginForm.pwd.$setValidity).toHaveBeenCalledWith('wrong', true);
            
            // TODO : add test and spy for JQuery
        });
        
        it('Testing: failed adminLogin function', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/login.php").respond(200, {msg:"", error:"Login Failed"});
            
            controller.adminLogin({username:"teest", pwd:"t53t"});
            
            $httpBackend.flush();
            
            expect(securitySrv.isLogged()).toBeFalsy();
            expect(securitySrv.getUserName()).toBeNull();
            
            expect(controller.getUserName()).toBeNull();
            expect(scope.loginForm.username.$setValidity).toHaveBeenCalledWith('wrong', false);
            expect(scope.loginForm.pwd.$setValidity).toHaveBeenCalledWith('wrong', false);
        });
        it('Testing: error adminLogin function', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/login.php").respond(404, 'server not found');
            
            controller.adminLogin({username:"teest", pwd:"t53t"});
            
            $httpBackend.flush();
            
            expect(securitySrv.isLogged()).toBeFalsy();
            expect(securitySrv.getUserName()).toBeNull();
            
            expect(controller.getUserName()).toBeNull();
            expect(scope.loginForm.username.$setValidity).toHaveBeenCalledWith('wrong', false);
            expect(scope.loginForm.pwd.$setValidity).toHaveBeenCalledWith('wrong', false);
        });
        it('Testing: worked adminLogin function', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/login.php").respond(200, {msg:"Login success", error:""});
            $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/DAOUser.php").respond(200, [{name:"adminTest"}]);
            
            spyOn(location, 'path');
            
            controller.adminLogin({username:"teest", pwd:"t53t"});
            
            $httpBackend.flush();
            
            expect(location.path).toHaveBeenCalledWith('/admin/home');
            expect(securitySrv.isLogged()).toBeTruthy();
            expect(controller.getUserName()).toEqual('adminTest');
            
            expect(scope.loginForm.username.$setValidity).toHaveBeenCalledWith('wrong', true);
            expect(scope.loginForm.pwd.$setValidity).toHaveBeenCalledWith('wrong', true);
            
            // TODO : add test and spy for JQuery
        });
    });
});