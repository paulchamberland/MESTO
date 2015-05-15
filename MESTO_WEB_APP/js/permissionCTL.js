app.controller('permissionCTL', function($scope, permissionSrv) {
    var self = this;

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
        $('#details').fadeIn('slow');
    }
    
    this.setPermission = function (pPerm) {
        $scope.permission = angular.copy(pPerm);
    };
    
    init();
});