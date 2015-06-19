app.controller('streamCTL', function($scope, $http) {
    var self = this;
    $scope.activities = [];
    
    this.loadStream = function(pIsRestrain, pLimit) {
        $http({
            method: 'POST',
            url: "/MESTO/MESTO_WEB_APP/php/DAOStream.php", // TODO: Make a config with path
            data: {
                isRestrain : pIsRestrain.toString(),
                limit : pLimit
            },
            headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(
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
});