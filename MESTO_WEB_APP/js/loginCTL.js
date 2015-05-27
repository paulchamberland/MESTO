app.controller('loginCTL', function($scope, $rootScope, $http, $location, securitySrv) {
    var self = this;
    $scope.logInfo = {
        username : 'tester',
        pwd : 'test'
    };
    
    this.login = function(pLogInfo) {
        securitySrv.login({
            username : pLogInfo.username,
            pwd : pLogInfo.pwd
            },
            [function(response) {
                if (response.data.error == null) {
                    $scope.loginForm.username.$setValidity('wrong', true);
                    $scope.loginForm.pwd.$setValidity('wrong', true);
                    
                    $('#loginBox').toggle();
                    $('#loginButton').toggleClass('active');
                }
                else {
                    $scope.loginForm.username.$setValidity('wrong', false);
                    $scope.loginForm.pwd.$setValidity('wrong', false);
                }
            }, function() {
                $scope.loginForm.username.$setValidity('wrong', false);
                $scope.loginForm.pwd.$setValidity('wrong', false);
            }]
        );
    };
    
    this.adminLogin = function(pLogInfo) {
        securitySrv.login({
                username : pLogInfo.username,
                pwd : pLogInfo.pwd
                },
                [function(response) {
                    if (response.data.error == null) {
                        $scope.loginForm.username.$setValidity('wrong', true);
                        $scope.loginForm.pwd.$setValidity('wrong', true);
                        
                        $location.path('/admin/home');
                    }
                    else {
                        $scope.loginForm.username.$setValidity('wrong', false);
                        $scope.loginForm.pwd.$setValidity('wrong', false);
                    }
                }, function() {
                    $scope.loginForm.username.$setValidity('wrong', false);
                    $scope.loginForm.pwd.$setValidity('wrong', false);
                }]
            );
    };
    this.logout = function() {
        securitySrv.logout();
    };    
    this.isLogged = function() {
        return securitySrv.isLogged();
    };
    this.getUserName = function() {
        return securitySrv.getUserName();
    };
});