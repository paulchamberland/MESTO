describe('Testing the service Security => ', function() {
    var securitySrv, location, Idle;
    
    beforeEach(module('MESTO'));
    
    beforeEach(inject(function(_securitySrv_, _$httpBackend_, _$location_, _Idle_) {
        securitySrv = _securitySrv_;
        $httpBackend = _$httpBackend_;
        location = _$location_;
        Idle = _Idle_;
    }));
    
    it('Testing: getUserName function', function() {
        expect(securitySrv.getUserName()).toBeNull();
    });
    
    it('Testing: getUser function', function() {
        expect(securitySrv.getUser()).toBeNull();
    });
    
    it('Testing: isLogged function', function() {
        expect(securitySrv.isLogged()).toBeFalsy();
    });
    
    it('Testing: failed login function', function() {
        $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
        $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/login.php").respond(200, {msg:"", error:"Login Failed"});
        
        var thenSpy1 = jasmine.createSpy('thenTest1');
        var thenSpy2 = jasmine.createSpy('thenTest2');
        securitySrv.login({username:"teest", pwd:"t53t"}, [thenSpy1, thenSpy2]);
        
        $httpBackend.flush();
        
        expect(securitySrv.isLogged()).toBeFalsy();
        expect(securitySrv.getUserName()).toBeNull();
        expect(thenSpy1).not.toHaveBeenCalled();
        expect(thenSpy2).toHaveBeenCalled();
    });
    it('Testing: error login function', function() {
        $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
        $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/login.php").respond(404, 'server not found');
        
        var thenSpy1 = jasmine.createSpy('thenTest1');
        var thenSpy2 = jasmine.createSpy('thenTest2');
        
        securitySrv.login({username:"teest", pwd:"t53t"}, [thenSpy1, thenSpy2]);
        
        $httpBackend.flush();
        
        expect(securitySrv.isLogged()).toBeFalsy();
        expect(securitySrv.getUserName()).toBeNull();
        expect(thenSpy1).not.toHaveBeenCalled();
        expect(thenSpy2).toHaveBeenCalled();
    });
    it('Testing: worked login but failed loadUser functions', function() {
        $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
        $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/login.php").respond(200, {msg:"Login success", error:"", obj:"2"});
        $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/DAOUser.php").respond(200, {msg:"", error:"Login Failed"});
        spyOn(location, 'path');
        spyOn(Idle, 'watch');
        
        var thenSpy1 = jasmine.createSpy('thenTest1');
        var thenSpy2 = jasmine.createSpy('thenTest2');
        
        securitySrv.login({username:"teest", pwd:"t53t"}, [thenSpy1, thenSpy2]);
        
        $httpBackend.flush();
        
        expect(location.path).not.toHaveBeenCalled();
        expect(securitySrv.isLogged()).toBeFalsy();
        expect(securitySrv.getUserName()).toBeNull();
        // In this case, the error handling is done via the data with a elseIf in the success function
        expect(thenSpy1).toHaveBeenCalled(); 
        expect(thenSpy2).not.toHaveBeenCalled();
        expect(Idle.watch).not.toHaveBeenCalled();
    });
    it('Testing: worked login but error loadUser functions', function() {
        $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
        $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/login.php").respond(200, {msg:"Login success", error:"", obj:"2"});
        $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/DAOUser.php").respond(404, 'server not found');
        
        spyOn(location, 'path');
        spyOn(Idle, 'watch');
        var thenSpy1 = jasmine.createSpy('thenTest1');
        var thenSpy2 = jasmine.createSpy('thenTest2');
        
        securitySrv.login({username:"teest", pwd:"t53t"}, [thenSpy1, thenSpy2]);
        
        $httpBackend.flush();
        
        expect(location.path).not.toHaveBeenCalled();
        expect(securitySrv.isLogged()).toBeFalsy();
        expect(securitySrv.getUserName()).toBeNull();
        expect(thenSpy1).not.toHaveBeenCalled();
        expect(thenSpy2).toHaveBeenCalled();
        expect(Idle.watch).not.toHaveBeenCalled();
    });
    it('Testing: worked login & createUser functions', function() {
        $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
        $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/login.php").respond(200, {msg:"Login success", error:"", obj:"2"});
        $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/DAOUser.php").respond(200, [{name:"adminTest"}]);
        
        spyOn(location, 'path');
        spyOn(Idle, 'watch');
        var thenSpy1 = jasmine.createSpy('thenTest1');
        var thenSpy2 = jasmine.createSpy('thenTest2');
        
        securitySrv.login({username:"teest", pwd:"t53t"}, [thenSpy1, thenSpy2]);
        
        $httpBackend.flush();
        
        expect(location.path).not.toHaveBeenCalled();
        expect(securitySrv.isLogged()).toBeTruthy();
        expect(securitySrv.getUserName()).toEqual('adminTest');
        expect(securitySrv.getUser()).toEqual({name:"adminTest"});
        expect(thenSpy1).toHaveBeenCalled();
        expect(thenSpy2).not.toHaveBeenCalled();
        expect(Idle.watch).toHaveBeenCalled();
    });
    
    it('Testing: logout after login function', function() {
        $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
        $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/login.php").respond(200, {msg:"Login success", error:"", obj:"2"});
        $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/DAOUser.php").respond(200, [{name:"adminTest"}]);
        
        spyOn(location, 'path');
        
        securitySrv.login({username:"teest", pwd:"t53t"}, [function(){}, function(){}]);
        $httpBackend.flush();
        
        $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/logout.php").respond();
                
        securitySrv.logout();
        $httpBackend.flush();
        
        expect(location.path).toHaveBeenCalledWith('/home');
        expect(securitySrv.isLogged()).toBeFalsy();
        expect(securitySrv.getUserName()).toBeNull();
    });
    
    it('Testing: Failed to checkLoggedUser', function() {
        $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
        $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/loggedUser.php").respond(200, '');
        
        securitySrv.checkLoggedUser();
        $httpBackend.flush();
        expect(securitySrv.isLogged()).toBeFalsy();
        expect(securitySrv.getUserName()).toBeNull();
        expect(securitySrv.isAuthorized('titi')).toBeFalsy();
        expect(securitySrv.isAuthorized('toto')).toBeFalsy();
    });
    it('Testing: Error to checkLoggedUser', function() {
        $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
        $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/loggedUser.php").respond(404, '');
        
        securitySrv.checkLoggedUser();
        $httpBackend.flush();
        expect(securitySrv.isLogged()).toBeFalsy();
        expect(securitySrv.getUserName()).toBeNull();
        expect(securitySrv.isAuthorized('titi')).toBeFalsy();
        expect(securitySrv.isAuthorized('toto')).toBeFalsy();
    });
        it('Testing: Success to checkLoggedUser', function() {
        $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
        $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/loggedUser.php").respond(200, {obj:{name:'test', lstPermissions:['toto','tata']},  uId:"222"});
        
        securitySrv.checkLoggedUser();
        $httpBackend.flush();
        
        expect(securitySrv.isLogged()).toBeTruthy();
        expect(securitySrv.getUserName()).toEqual('test');
        expect(securitySrv.isAuthorized('titi')).toBeFalsy();
        expect(securitySrv.isAuthorized('toto')).toBeTruthy();
    });
});