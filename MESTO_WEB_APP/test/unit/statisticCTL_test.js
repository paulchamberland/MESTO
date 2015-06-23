describe('Testing the controller of Statistic object', function() {
    beforeEach(module('MESTO'));
    var controller, scope;

    beforeEach(inject(function(_$controller_, $rootScope){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        scope = $rootScope;//.$new();
        controller = _$controller_('statisticCTL', { $scope: scope });
    }));
    
    describe('Testing Ajax call from Statistic object', function() {
        beforeEach(inject(function(_$httpBackend_) {
            $httpBackend = _$httpBackend_;
        }));
 
        it('Testing: Error to load statistic', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOStatistic.php').respond(500, '{"msg":"", "error":"Database error, Contact administrator. Try later"}'); // CTL INIT

            $httpBackend.flush();
            
            expect(scope.nbSite).toEqual("N/A");
            expect(scope.nbSiteModified).toEqual("N/A");
            expect(scope.nbUser).toEqual("N/A");
            expect(scope.nbUserModified).toEqual("N/A");
            expect(scope.nbEquipment).toEqual("N/A");
            expect(scope.nbEquipmentModified).toEqual("N/A");
            expect(scope.nbPendingUser).toEqual("N/A");
        });
        it('Testing: Failed to load statistic', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOStatistic.php').respond(200, '{"msg":"", "error":"Database error, Contact administrator. Try later"}'); // CTL INIT

            $httpBackend.flush();
            
            expect(scope.nbSite).toEqual("N/A");
            expect(scope.nbSiteModified).toEqual("N/A");
            expect(scope.nbUser).toEqual("N/A");
            expect(scope.nbUserModified).toEqual("N/A");
            expect(scope.nbEquipment).toEqual("N/A");
            expect(scope.nbEquipmentModified).toEqual("N/A");
            expect(scope.nbPendingUser).toEqual("N/A");
        });
        it('Testing: Load activities statistic', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOStatistic.php').respond(200, '{"nbSite":39,"nbSiteModified":30,"nbUser":8,"nbUserModified":5,"nbEquipment":15,"nbEquipmentModified":10,"nbPendingUser":3}'); // CTL INIT

            $httpBackend.flush();
            
            expect(scope.nbSite).toEqual(39);
            expect(scope.nbSiteModified).toEqual(30);
            expect(scope.nbUser).toEqual(8);
            expect(scope.nbUserModified).toEqual(5);
            expect(scope.nbEquipment).toEqual(15);
            expect(scope.nbEquipmentModified).toEqual(10);
            expect(scope.nbPendingUser).toEqual(3);
        });
    });
});