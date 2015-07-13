/* loginCTL : Controller of login behavior, manage credential and interface function call.
 * @see : securitySrv to Service corresponding to this controller.
 * @author : jonathan-lefebvregithub@outlook.com
 */
app.controller('loginCTL', function($scope, $rootScope, $http, $location, securitySrv, navigateSrv) {
    var self = this;
    $scope.logInfo = {
        username : '',
        pwd : ''
    };
    
    this.login = function(pLogInfo) {
        // declare function as "promise result" for arguments
        securitySrv.login({
            username : pLogInfo.username,
            pwd : pLogInfo.pwd
            },
            [function(response) {
                if (response.data.error == null) {
                    $scope.loginForm.username.$setValidity('wrong', true);
                    $scope.loginForm.pwd.$setValidity('wrong', true);
                    
                    $('#loginBox').toggle(false);
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
        // declare function as "promise result" for arguments
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
    
    this.openProfileUser = function() {
        navigateSrv.setUser(securitySrv.getUser());
        $location.path("/profile");
    };
});