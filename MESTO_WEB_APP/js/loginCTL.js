app.controller('loginCTL', function($scope, $rootScope, $http, $location, securitySrv) {
    var self = this;
    $scope.logInfo = {
        username : 'tester',
        pwd : 'test'
    };
    
    $scope.username = "";
    
    $scope.login = function(pLogInfo) {
        securitySrv.login({
                username : pLogInfo.username,
                pwd : pLogInfo.pwd
            }).then(function(response) {
                if (response.data.msg != '') {
                    $scope.loginForm.username.$setValidity('wrong', true);
                    $scope.loginForm.pwd.$setValidity('wrong', true);
                    $('#loginBox').hide();
                    $scope.username = securitySrv.getUsername();
                }
                else {
                    $scope.loginForm.username.$setValidity('wrong', false);
                    $scope.loginForm.pwd.$setValidity('wrong', false);
                }
            }, function() {
                $scope.loginForm.username.$setValidity('wrong', false);
                $scope.loginForm.pwd.$setValidity('wrong', false);
            });
    };
    $scope.logout = function() {
        securitySrv.logout();
    };    
    $scope.isLogged = function() {
        return securitySrv.isLogged();
    };
});