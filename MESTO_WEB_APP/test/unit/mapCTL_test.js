describe('Testing the controller of map =>', function() {
    beforeEach(module('MESTO'));
    var controller, scope, securitySrv, navigateSrv, location, googleMap;

    beforeEach(inject(function(_$controller_, $rootScope, $location, _securitySrv_, _navigateSrv_, _googleMap_){
        scope = $rootScope;
        controller = _$controller_('mapCTL', { $scope: scope });
        securitySrv = _securitySrv_;
        navigateSrv = _navigateSrv_;
        location = $location
        googleMap = _googleMap_
    }));
    
    it('Testing: creation object', function() {
        expect(scope.isAutorizeSeeDetailsSite).toBeFalsy();
        expect(scope.filterRole).toEqual({});
        expect(scope.filterOrg).toEqual({});
        expect(scope.optLayerZone).toBeTruthy();
    });
    
    it('Testing: InitFilter function', function() {
    
        var filt1 = [{value:"t1",label:"test1"},{value:"t2",label:"test2"}]
        var filt2 = [{value:"x1",label:"test3"},{value:"x2",label:"test4"}]
        controller.initFilter(filt1, filt2);
        
        expect(scope.filterRole).toEqual({t1:true, t2:true});
        expect(scope.filterOrg).toEqual({x1:true, x2:true});
    });

    it('Testing: Create Markers', function() {
        var createMarkerThenSet = null;
        var promise = {then: function(p){createMarkerThenSet=p;}};
        
        spyOn(googleMap, "setMarkersCluster");
        spyOn(googleMap, "setLoadFunctionOnInfoWindow");
                    
        controller.createMarkers(promise);
        createMarkerThenSet({data:[]});
        
        expect(googleMap.setMarkersCluster).toHaveBeenCalled();
        expect(googleMap.setLoadFunctionOnInfoWindow).toHaveBeenCalled();
    });
    
    it('Testing: seeSiteDetails function', function() {
        spyOn(location, 'path');
        
        scope.seeSiteDetails(0); // Security ON
        
        expect(location.path).not.toHaveBeenCalled();
        expect(navigateSrv.getSite()).toBeNull();
        
        scope.isAutorizeSeeDetailsSite = true;
        scope.seeSiteDetails(0); // Security OFF
        
        //expect(navigateSrv.getSite()).toEqual();
        expect(location.path).toHaveBeenCalledWith('/site');
    });
    
    it('Testing: applyFilter function', function() {
        spyOn(googleMap, 'resetMarkerCluster');
        spyOn(googleMap, 'setMarkersCluster');
        
        controller.applyFilter();
        
        expect(googleMap.resetMarkerCluster).toHaveBeenCalled();
        expect(googleMap.setMarkersCluster).toHaveBeenCalled();
    });
    
    it('Testing: changeLayerZone function', function() {
        spyOn(googleMap, 'showZone');
        spyOn(googleMap, 'hideZone');
        scope.optLayerZone = false;
        
        controller.changeLayerZone();
        
        expect(googleMap.showZone).not.toHaveBeenCalled();
        expect(googleMap.hideZone).toHaveBeenCalled();
        googleMap.hideZone.calls.reset();
        
        scope.optLayerZone = true;
        
        controller.changeLayerZone();
        
        expect(googleMap.showZone).toHaveBeenCalled();
        expect(googleMap.hideZone).not.toHaveBeenCalled();
    });
});