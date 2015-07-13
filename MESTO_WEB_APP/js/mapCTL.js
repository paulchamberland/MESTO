/* mapCTL : controller of GoogleMap
 * @author : jonathan-lefebvregithub@outlook.com
 */

app.controller('mapCTL', function($scope, $compile, $location, navigateSrv, securitySrv, googleMap) {
    var self = this;
    $scope.isAutorizeSeeDetailsSite = securitySrv.isAuthorized('detailSite'); // user restriction
    
    var map = null;// create or get the current instance of Map.
    
    // contructor
    this.initMap = function(pMap, pLat, pLon) {
        if (pMap == "mini") {
            map = googleMap.getMiniMap(parseFloat(pLat), parseFloat(pLon));
        }
        else {
            map = googleMap.getMap();
        }
    }
    
    var markers = []; // list markers corresponging to the lstSites
    var lstSites = []; // list of all site need to be display
    
    $scope.filterRole = {}; // Site's roles filter active
    $scope.filterOrg = {}; // Site's organisation filter active
    
    $scope.optLayerZone = true; // option to display color zone on map
    
    // initialize all filter with real sites values
    this.initFilter = function(roles, orgs) {
        for (var i=0; i != roles.length; i++) {
            $scope.filterRole[roles[i].value] = true;
        }
        
        for (var i=0; i != orgs.length; i++) {
            $scope.filterOrg[orgs[i].value] = true;
        }
    };
    
    /* Description : create all markers and their behavior corresponding to the promise of a list of Site.
     *                Set also Cluster corresponding to the list.
     * @param : promiseLstSite : Angular Promise, return from the site Ajax call.
     */
    this.createMarkers = function(promiseLstSite){
        promiseLstSite.then(function(resp) {
            lstSites = resp.data;
            
            var strInfoContent = "";
            for (var i=0; i != lstSites.length; i++) {
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
                                +'</div>';
                
                markers.push(googleMap.factoryMarker(lstSites[i].latitude, lstSites[i].longitude, map, lstSites[i].reference, strInfoContent));
            }
            
            googleMap.setMarkersCluster(map, markers);
            
            googleMap.setLoadFunctionOnInfoWindow(function() {
                $scope.$apply(function(){
                    $compile($(".mapDetails"))($scope)
                });
            });
        });
    };
    this.createMarker = function(pSite) {
        if (pSite == null) return;
        
        googleMap.factoryMarker(pSite.latitude, pSite.longitude, map, pSite.reference, "");
    };
    
    $scope.seeSiteDetails = function(siteIndex) {
        if ($scope.isAutorizeSeeDetailsSite) {
            navigateSrv.setSite(lstSites[siteIndex]);
            $location.path("/site");
        }
    };
    
    this.applyFilter = function() {
        googleMap.resetMarkerCluster();
        
        for (var i=0; i != lstSites.length; i++) {
            if ($scope.filterOrg[lstSites[i].organization] && $scope.filterRole[lstSites[i].role]) {
                markers[i].setMap(map);
                markers[i].setAnimation(google.maps.Animation.DROP);
            }
            else {
                markers[i].setMap(null);
            }
        }
        
        googleMap.setMarkersCluster(map, markers);
    };
    
    this.changeLayerZone = function() {
        if ($scope.optLayerZone) {
            googleMap.showZone();
        }
        else {
            googleMap.hideZone();
        }
    };
});