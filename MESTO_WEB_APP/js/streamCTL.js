/* streamCTL : Control behavior of Stream Activity list.
 * @see : StreamSrv to look other function of Stream object
 * @author : jonathan-lefebvregithub@outlook.com
 */
app.controller('streamCTL', function($scope, $http, CONF_PATH) {
    var self = this;
    $scope.activities = [];
    
    this.loadStream = function(pIsRestrain, pLimit) {
        $http({
            method: 'POST',
            url: CONF_PATH+"/php/DAOStream.php",
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