app.controller('roomCTL', function($scope, $http) {
    var self = this;
    var ACTIVITY_DELETE = "del";
    $scope.ROLE = [{value:'MTC',label:'Main Telecom'},{value:'TC',label:'Telecom'},{value:'SPR',label:'Spare'},{value:'STR',label:'Storage'}];
    
    $scope.room = {id: "",
                    roomID :"",
                    pointOfContact :"",
                    technicalPointOfContact :"",
                    roomSize :"",
                    role:""};
    this.emptyRoom = {};
    $scope.canDelete = false;
    
    // TODO: To remove at some point
    $scope.room_init = {id: "1",
                    roomID :"erv324r23",
                    pointOfContact :"sgt bilbo",
                    technicalPointOfContact :"sgt bilbo",
                    roomSize :"43",
                    role:"TC"};
    
    function init() {
        loadList();
        self.emptyRoom = angular.copy($scope.room);
        //$scope.room = angular.copy($scope.room_init); // TODO: to remove at some point...
    }
    
    $scope.loadRoom = function(p_room) {
        $scope.room = angular.copy(p_room);
        $scope.roomForm.$setPristine();
        $scope.canDelete = true;
        // TODO: reset old msg:
    };
    
    $scope.resetFrm = function() {
        $scope.room = angular.copy(self.emptyRoom);
        $scope.roomForm.$setPristine();
        $scope.canDelete = false;
        // TODO: reset old msg: update a room, load again, modify and clic on reset...
    };
    
    $scope.save = function() {
        if ($scope.roomForm.$dirty && $scope.roomForm.$valid) {
            $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/saveRoom.php", // TODO: Make a config with path
                data: {
                    id : $scope.room.id,
                    roomID : $scope.room.roomID,
                    pointOfContact : $scope.room.pointOfContact,
                    technicalPointOfContact : $scope.room.technicalPointOfContact,
                    roomSize : $scope.room.roomSize,
                    role : $scope.room.role
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
                url: "/MESTO/MESTO_WEB_APP/php/saveRoom.php", // TODO: Make a config with path
                data: {
                    id : $scope.room.id,
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
    
    function loadList() {
        $http.post("/MESTO/MESTO_WEB_APP/php/DAORoom.php").success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.roomList = data;
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