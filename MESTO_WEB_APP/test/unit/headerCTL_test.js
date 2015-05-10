describe('Testing the controller of Header section =>', function() {
    beforeEach(module('MESTO'));
    var controller, scope, location;

    beforeEach(inject(function(_$controller_, $rootScope, _$location_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        scope = $rootScope;//.$new();
        controller = _$controller_('headerCTL', { $scope: scope });
        location = _$location_;
    }));
 
    it('Testing isSearchDisplay function', function() {
        expect(controller.isSearchDisplay()).toBeTruthy();
        
        location.path('toto');
        
        expect(controller.isSearchDisplay()).toBeTruthy();
        
        location.path('/admin');
        
        expect(controller.isSearchDisplay()).toBeFalsy();
    });
    
    it('Testing isLoginDisplay function', function() {
        expect(controller.isLoginDisplay()).toBeTruthy();
        
        location.path('toto');
        
        expect(controller.isLoginDisplay()).toBeTruthy();
        
        location.path('/admin');
        
        expect(controller.isLoginDisplay()).toBeFalsy();
    });
});