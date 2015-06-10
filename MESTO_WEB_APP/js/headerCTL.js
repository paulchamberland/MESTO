app.controller('headerCTL', function($scope, $location, securitySrv) {
    var self = this;
    this.isSearchDisplay = function() {
        var isDisplay = true;
        if ($location.path() != '' && "/admin".indexOf($location.path()) != -1 /*&& !securitySrv.isLogged()*/) {
            isDisplay = false;
        }
        else if ($location.path() != '' && "/createUser".indexOf($location.path()) != -1) {
            isDisplay = false;
        }
        
        return isDisplay;
    };
    
    this.isLoginDisplay = function() {
        var isDisplay = true;
        if ($location.path() != '' && "/admin".indexOf($location.path()) != -1 /*&& !securitySrv.isLogged()*/) {
            isDisplay = false;
        }
        else if ($location.path() != '' && "/createUser".indexOf($location.path()) != -1) {
            isDisplay = false;
        }
        
        return isDisplay;
    };
});