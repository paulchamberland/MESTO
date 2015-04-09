app.controller('siteCTL', function($scope, $http) {
    var self = this;
    var ACTIVITY_DELETE = "del";
    $scope.ROLE = [{value:'ED',label:'Edifice'},{value:'FLR',label:'Floor'},{value:'FOB',label:'FOB'},{value:'COP',label:'COP'},{value:'CMP',label:'CAMP'}];
    
    $scope.site = {id: "",
                    reference :"",
                    latitude:"",
                    longitude:"",
                    siteName:"",
                    description:"",
                    isTemporary:false,
                    startDate:"",
                    endDate:"",
                    address:"",
                    city:"",
                    province:"",
                    country:"",
                    postalCode:"",
                    role:""};
    this.emptySite = {};
    $scope.canDelete = false;
    
    // TODO: To remove at some point
    $scope.site_init = {id: "1",
                    reference :"test",
                    latitude:"12.123456",
                    longitude:"43.123456",
                    siteName:"test4",
                    description:"test5",
                    isTemporary:true,
                    startDate:"12-12-12",
                    endDate:"11-11-1900",
                    address:"test9",
                    city:"test10",
                    province:"test11",
                    country:"test12",
                    postalCode:"X5X 5X5",
                    role:"COP"};
    
    function init() {
        loadList();
        self.emptySite = angular.copy($scope.site);
        //$scope.site = angular.copy($scope.site_init); // TODO: to remove at some point...
    }
    
    $scope.loadSite = function(p_site) {
        $scope.site = angular.copy(p_site);
        $scope.site.startDate = new Date($scope.site.startDate).toDMY();
        $scope.site.endDate = new Date($scope.site.endDate).toDMY();
        $scope.siteForm.$setPristine();
        $scope.canDelete = true;
        $scope.resetMsg();
    };
    
    $scope.resetFrm = function() {
        $scope.site = angular.copy(self.emptySite);
        $scope.siteForm.$setPristine();
        $scope.canDelete = false;
    };
    
    $scope.resetMsg = function() {
        if ($scope.SQLErrors) delete $scope.SQLErrors;
        if ($scope.SQLMsgs) delete $scope.SQLMsgs;
    }
    
    $scope.save = function() {
        if ($scope.siteForm.$dirty && $scope.siteForm.$valid) {
            $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/saveSite.php", // TODO: Make a config with path
                data: {
                    id : $scope.site.id,
                    reference : $scope.site.reference,
                    latitude : $scope.site.latitude,
                    longitude : $scope.site.longitude,
                    siteName : $scope.site.siteName,
                    description : $scope.site.description,
                    isTemporary : $scope.site.isTemporary,
                    startDate : new Date($scope.site.startDate).toYMD(), // TODO : problem with the constructor, make it custom to put real value. Date.Parse?
                    endDate : new Date($scope.site.endDate).toYMD(),
                    address : $scope.site.address,
                    city : $scope.site.city,
                    province : $scope.site.province,
                    country : $scope.site.country,
                    postalCode : $scope.site.postalCode,
                    role : $scope.site.role
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(
                function(data, status) {
                    if (data.msg != '') {
                        $scope.SQLMsgs = data.msg;
                        loadList();
                        $scope.resetFrm();
                    }
                    else {
                        $scope.SQLErrors = data.error;
                    }
                }
            ).error(
                function(data, status, headers, config, statusText) {
                    // TODO: error server handling
                    $scope.SQLErrors = "error: "+status+":"+statusText;
                }
            );
        }
    };
    
    $scope.delete = function() {
        $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/saveSite.php", // TODO: Make a config with path
                data: {
                    id : $scope.site.id,
                    activity : ACTIVITY_DELETE
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(
                function(data, status) {
                    if (data.msg != '') {
                        $scope.SQLMsgs = data.msg;
                        loadList();
                        $scope.resetFrm();
                    }
                    else {
                        $scope.SQLErrors = data.error;
                    }
                }
            ).error(
                function(data, status, headers, config, statusText) {
                    // TODO: error server handling
                    $scope.SQLErrors = "error: "+status+":"+statusText;
                }
            );
    };
    
    /*
     *  Unused: Delete or use it?
     */
    $scope.refreshList = function() {
        loadList();
    };
    
    $scope.validEndDate = function() {
        if ($scope.siteForm.endDate.$valid && $scope.siteForm.startDate.$valid && $scope.siteForm.endDate.$dirty && $scope.siteForm.startDate.$dirty
                && Date.parse($scope.site.endDate) <= Date.parse($scope.site.startDate)) {
            $scope.siteForm.endDate.$setValidity('greaterThan', false);
        }
        else {
            $scope.siteForm.endDate.$setValidity('greaterThan', true);
        }
    };
    
    function loadList() {
        $http.post("/MESTO/MESTO_WEB_APP/php/DAOSite.php").success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.siteList = data;
                }
                else {
                    $scope.lstError = data.error;
                }
            }
        ).error(
            function(data, status, headers, config, statusText) {
                // TODO: error server handling
                $scope.lstError = "error: "+status+":"+statusText;
                //$scope.error = "error: "+data+" -- "+status+" -- "+headers+" -- "+config;
            }
        );
    };
    
    init();
});