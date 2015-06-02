app.controller('mapCTL', function($scope, googleMap) {
    var self = this;
    var map = googleMap.getMap(); // create or get the current instance of Map.
    
    var markers = [];
    
    this.createMarkers = function(promiseLstSite){
        promiseLstSite.then(function(resp) {
            var lstSites = resp.data;
            
            var strInfoContent = "";
            for (var i=0; i != lstSites.length; i++) {
                //setTimeout(function() {
                    strInfoContent = '<div class="mapDetails">'
                                    +'    <div class="top">'+lstSites[i].siteName+'</div>'
                                    +'    <hr>'
                                    +'    <div class="core">'
                                    +'        <div class="inner">'+lstSites[i].address+', '+lstSites[i].city+', '+lstSites[i].province+', '+lstSites[i].country+', '+lstSites[i].postalCode+'</div>'
                                    +'        </br>'
                                    +'        <div class="inner"><span class="label">PoC</span>: '+lstSites[i].pointOfContact+'</div>'
                                    +'        <div class="inner last"><a class="link" href="#/test">More Detail</a></div>'
                                    +'    </div>'
                                    +'</div>'
                    
                    //markers[lstSites[i].reference] = googleMap.factoryMarker(lstSites[i].latitude, lstSites[i].longitude, map, lstSites[i].reference, strInfoContent);
                    markers.push(googleMap.factoryMarker(lstSites[i].latitude, lstSites[i].longitude, map, lstSites[i].reference, strInfoContent));
                //}, i + 300);
            }
            
            googleMap.setMarkersCluster(map, markers);
        });
    };
});