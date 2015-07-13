/* statisticCTL : Control behavior for admin dashboard.
 * @author : jonathan-lefebvregithub@outlook.com
 */
app.controller('statisticCTL', function($scope, $http, CONF_PATH) {
    $scope.nbSite = 0;
    $scope.nbSiteModified = 0;
    $scope.nbUser = 0;
    $scope.nbUserModified = 0;
    $scope.nbEquipment = 0;
    $scope.nbEquipmentModified = 0;
    $scope.nbPendingUser = 0;
    
    // contructor
    function init() {
        $http({
            method: 'POST',
            url: CONF_PATH+"/php/DAOStatistic.php",
            headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(
            function(data) {
                if (data.error == null) {
                    $scope.nbSite = data.nbSite;
                    $scope.nbSiteModified = data.nbSiteModified;
                    $scope.nbUser = data.nbUser;
                    $scope.nbUserModified = data.nbUserModified;
                    $scope.nbEquipment = data.nbEquipment;
                    $scope.nbEquipmentModified = data.nbEquipmentModified;
                    $scope.nbPendingUser = data.nbPendingUser;
                }
                else {
                    $scope.nbSite = "N/A";
                    $scope.nbSiteModified = "N/A";
                    $scope.nbUser = "N/A";
                    $scope.nbUserModified = "N/A";
                    $scope.nbEquipment = "N/A";
                    $scope.nbEquipmentModified = "N/A";
                    $scope.nbPendingUser = "N/A";
                }
            }
        ).error(
            function(data, status, headers, config, statusText) {
                $scope.nbSite = "N/A";
                $scope.nbSiteModified = "N/A";
                $scope.nbUser = "N/A";
                $scope.nbUserModified = "N/A";
                $scope.nbEquipment = "N/A";
                $scope.nbEquipmentModified = "N/A";
                $scope.nbPendingUser = "N/A";
            }
        );
    }
    
    init();
});