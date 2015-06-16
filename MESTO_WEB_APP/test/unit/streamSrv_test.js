describe('Testing the service Stream (activity) => ', function() {
    var streamSrv, scope, securitySrv;
    
    beforeEach(module('MESTO'));
    
    beforeEach(inject(function(_streamSrv_, $rootScope, _$httpBackend_, _securitySrv_) {
        streamSrv = _streamSrv_;
        scope = $rootScope;
        $httpBackend = _$httpBackend_;
        securitySrv = _securitySrv_;
    }));
    
    /*it('Testing: getUserName function', function() {
        expect(streamSrv.getUserName()).toBeNull();
    });*/
    it('Testing: skipping the saveActivity', function() {
        $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
        
        spyOn(securitySrv, 'isLogged');
        
        streamSrv.saveActivity();
        $httpBackend.flush();
        
        expect(scope.SQLErrors).not.toBeDefined();
        expect(securitySrv.isLogged).toHaveBeenCalled();
    });
    
    it('Testing: Failed to saveActivity', function() {
        securitySrv.isLogged = function() { return true;};
        
        $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
        $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/saveStream.php").respond(200, '{"msg":"", "error":"Failed"}');
        
        spyOn(securitySrv, 'getUser').and.returnValue({name:"test"});
        
        streamSrv.saveActivity(scope);
        $httpBackend.flush();
        
        expect(scope.SQLErrors).toEqual("Failed");
        expect(securitySrv.getUser).toHaveBeenCalled();
    });
    it('Testing: Error to saveActivity', function() {
        securitySrv.isLogged = function() { return true;};
    
        $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
        $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/saveStream.php").respond(404, '{"msg":"", "error":"test"}');
        
        spyOn(securitySrv, 'getUser').and.returnValue({name:"test"});
        
        streamSrv.saveActivity(scope);
        $httpBackend.flush();
        
        expect(scope.SQLErrors).toEqual('error: 404:undefined');
        expect(securitySrv.getUser).toHaveBeenCalled();
    });
    it('Testing: Success to saveActivity', function() {
        securitySrv.isLogged = function() { return true;};
        
        $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
        $httpBackend.expectPOST("/MESTO/MESTO_WEB_APP/php/saveStream.php").respond(200, '{"msg":"Activity created successfully!!!", "error":""}');
        
        spyOn(securitySrv, 'getUser').and.returnValue({name:"test"});
        
        streamSrv.saveActivity(scope);
        $httpBackend.flush();
        
        expect(scope.SQLErrors).not.toBeDefined();
        expect(securitySrv.getUser).toHaveBeenCalled();
    });
});