describe('Testing the service Security => ', function() {
    var securitySrv, location;
    
    beforeEach(module('MESTO'));
    
    beforeEach(inject(function(_securitySrv_, _$httpBackend_, _$location_) {
        securitySrv = _securitySrv_;
        $httpBackend = _$httpBackend_;
        location = _$location_;
    }));
    
    it('Testing: getUsername function', function() {
        expect(securitySrv.getUsername()).toBeNull();
    });
    
    it('Testing: isLogged function', function() {
        expect(securitySrv.isLogged()).toBeFalsy();
    });
    
    it('Testing: failed login function', function() {
        $httpBackend.whenPOST("/MESTO/MESTO_WEB_APP/php/login.php").respond(200, {msg:"", error:"Login Failed"});
        
        securitySrv.login({username:"teest", pwd:"t53t"});
        
        $httpBackend.flush();
        
        expect(securitySrv.isLogged()).toBeFalsy();
        expect(securitySrv.getUsername()).toBeNull();
    });
    it('Testing: error login function', function() {
        $httpBackend.whenPOST("/MESTO/MESTO_WEB_APP/php/login.php").respond(404, 'server not found');
        
        securitySrv.login({username:"teest", pwd:"t53t"});
        
        $httpBackend.flush();
        
        expect(securitySrv.isLogged()).toBeFalsy();
        expect(securitySrv.getUsername()).toBeNull();
    });
    it('Testing: worked login & createUser functions', function() {
        $httpBackend.whenPOST("/MESTO/MESTO_WEB_APP/php/login.php").respond(200, {msg:"Login success", error:""});
        spyOn(location, 'path');
        
        securitySrv.login({username:"teest", pwd:"t53t"});
        
        $httpBackend.flush();
        
        expect(location.path).not.toHaveBeenCalled();
        expect(securitySrv.isLogged()).toBeTruthy();
        expect(securitySrv.getUsername()).toEqual('Jooj');
    });
    
    it('Testing: logout after login function', function() {
        $httpBackend.whenPOST("/MESTO/MESTO_WEB_APP/php/login.php").respond(200, {msg:"Login success", error:""});
        spyOn(location, 'path');
        
        securitySrv.login({username:"teest", pwd:"t53t"});
        
        $httpBackend.flush();
        
        securitySrv.logout();
        
        expect(location.path).toHaveBeenCalledWith('/home');
        expect(securitySrv.isLogged()).toBeFalsy();
        expect(securitySrv.getUsername()).toBeNull();
    });
});