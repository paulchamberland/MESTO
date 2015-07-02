app.controller('permissionCTL', function($scope, permissionSrv, $modal) {
    var self = this;
    var modalInstance = null;
    
    $scope.permission = {
                    codeName :"",
                    name :"",
                    description :""};
    
    $scope.lstPermissions = [];
    
    function init() {
        $scope.lstPermissions = permissionSrv.lstPermissions;
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