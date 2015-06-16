app.controller('streamCTL', function($scope, $http) {
    var self = this;
    $scope.activities = [];
    
    function init() {
        self.loadStream();
    }
    
    this.loadStream = function() {
        $http.post("/MESTO/MESTO_WEB_APP/php/DAOStream.php").success(
            function(data) {
                if (data.error == null) {
                    $scope.activities = data;
                }
                else {
                    $scope.lstError = data.error;
                }
            }
        ).error(
            function(data, status, headers, config, statusText) {
                // TODO: error server handling
                $scope.lstError = "error: "+status+":"+statusText;
            }
        );
    };
    
    init();
});