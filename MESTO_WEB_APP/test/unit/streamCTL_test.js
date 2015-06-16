describe('Testing the controller of Stream object', function() {
    beforeEach(module('MESTO'));
    var controller, scope;

    beforeEach(inject(function(_$controller_, $rootScope){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        scope = $rootScope;//.$new();
        controller = _$controller_('streamCTL', { $scope: scope });
    }));
    
    describe('Testing Ajax call from Stream object', function() {
        beforeEach(inject(function(_$httpBackend_) {
            $httpBackend = _$httpBackend_;
        }));
 
        it('Testing: Error to load activities stream', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOStream.php').respond(500, '{"msg":"", "error":"Database error, Contact administrator. Try later"}'); // CTL INIT

            $httpBackend.flush();
            
            expect(scope.lstError).toEqual('error: 500:undefined');
            expect(scope.activities).toEqual([]);
        });
        it('Testing: Failed to load activities stream', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOStream.php').respond(200, '{"msg":"", "error":"Database error, Contact administrator. Try later"}'); // CTL INIT

            $httpBackend.flush();
            
            expect(scope.lstError).toEqual("Database error, Contact administrator. Try later");
            expect(scope.activities).toEqual([]);
        });
        it('Testing: Load activities stream with success', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOStream.php').respond(200, '['
                                        +'{"action":"Added", "concern":"server", "parent":{"role":"camp", "info":"label32"}, "date":"2014-10-10 13:30", "userName":"Jo Lerigolo", "title":"tester" },'
                                        +'{"action":"Modified", "concern":"router", "parent":{"role":"storage", "info":"Xfi43"}, "date":"2014-10-11 13:30", "userName":"Jo Lerigolo", "title":"tester" }'
                                        +']'); // CTL INIT

            $httpBackend.flush();
            
            expect(scope.lstError).not.toBeDefined();
            expect(scope.activities).toEqual([
                                        {"action":"Added", "concern":"server", "parent":{"role":"camp", "info":"label32"}, "date":"2014-10-10 13:30", "userName":"Jo Lerigolo", "title":"tester" },
                                        {"action":"Modified", "concern":"router", "parent":{"role":"storage", "info":"Xfi43"}, "date":"2014-10-11 13:30", "userName":"Jo Lerigolo", "title":"tester" }
                                    ]);
        });
    });
});