/* loginCTL : Controller for Permission view and permission model. 
 * @see : permissionSrv to see correspondance to this controller.
 * @author : jonathan-lefebvregithub@outlook.com
 */
app.controller('permissionCTL', function($scope, permissionSrv, $modal, paginator) {
    var self = this;
    var modalInstance = null; // popup instance manage locally
    
    // Model
    $scope.permission = {
                    codeName :"",
                    name :"",
                    description :""};
    
    $scope.lstPermissions = []; // All list permissions
    
    // constructor
    function init() {
        $scope.lstPermissions = permissionSrv.lstPermissions;
        paginator.init($scope, $scope.lstPermissions);
    }
    
    this.openPermission = function(pPerm) {
        self.setPermission(pPerm);
        
        modalInstance = $modal.open({
            animation: true,
            scope: $scope,
            templateUrl: 'detailModalContent.html'
        });
    };
    
    this.closeDetail = function() {
        modalInstance.dismiss('done');
    };
    
    this.setPermission = function (pPerm) {
        $scope.permission = angular.copy(pPerm);
    };
    
    init();
});