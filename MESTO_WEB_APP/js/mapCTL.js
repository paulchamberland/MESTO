app.controller('mapCTL', function($scope, $compile, $location, navigateSrv, securitySrv, googleMap) {
    var self = this;
    $scope.isAutorizeSeeDetailsSite = securitySrv.isAuthorized('detailSite');
    
    var map = googleMap.getMap(); // create or get the current instance of Map.
    
    var markers = [];
    var lstSites = [];
    
    $scope.filterRole = {};
    $scope.filterOrg = {};
    
    this.initFilter = function(roles, orgs) {
        for (var i=0; i != roles.length; i++) {
            $scope.filterRole[roles[i].value] = true;
        }
        
        for (var i=0; i != orgs.length; i++) {
            $scope.filterOrg[orgs[i].value] = true;
        }
    };
    
    this.createMarkers = function(promiseLstSite){
        promiseLstSite.then(function(resp) {
            lstSites = resp.data;
            
            var strInfoContent = "";
            for (var i=0; i != lstSites.length; i++) {
                //setTimeout(function() {
                    strInfoContent = '<div class="mapDetails">'
                                    +'    <div class="top">'+lstSites[i].siteName+'</div>'
                                    +'    <hr>'
                                    +'    <div class="core">'
                                    +'        <div class="inner">'+lstSites[i].address+', '+lstSites[i].city+', '+lstSites[i].province+', '+lstSites[i].country+', '+lstSites[i].postalCode+'</div>'
                                    +'        </br>'
                                    +'        <div class="inner"><span class="label">PoC</span>: '+lstSites[i].pointOfContact+'</div>';
                    if ($scope.isAutorizeSeeDetailsSite)
                        strInfoContent += '        <div class="inner last"><a class="link" href="" data-ng-click="seeSiteDetails('+i+')">More Detail</a></div>'
                                    
                    strInfoContent +='    </div>'
                                    +'</div>'
                    //markers[lstSites[i].reference] = googleMap.factoryMarker(lstSites[i].latitude, lstSites[i].longitude, map, lstSites[i].reference, strInfoContent);
                    markers.push(googleMap.factoryMarker(lstSites[i].latitude, lstSites[i].longitude, map, lstSites[i].reference, strInfoContent));
                //}, i + 300);
            }
            
            googleMap.setMarkersCluster(map, markers);
            googleMap.setLoadFunctionOnInfoWindow(function() {
                $scope.$apply(function(){
                    $compile($(".mapDetails"))($scope)
                });
            });
        });
    };
    
    $scope.seeSiteDetails = function(siteIndex) {
        if ($scope.isAutorizeSeeDetailsSite) {
            navigateSrv.setSite(lstSites[siteIndex]);
            $location.path("/site");
        }
    };
});