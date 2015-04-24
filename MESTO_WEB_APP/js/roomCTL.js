app.controller('roomCTL', function($scope, $http, $location) {
    var self = this;
    var ACTIVITY_DELETE = "del";
    $scope.ROLE = [{value:'MTC',label:'Main Telecom'},{value:'TC',label:'Telecom'},{value:'SPR',label:'Spare'},{value:'STR',label:'Storage'}];
    
    $scope.room = {id: "",
                    roomID :"",
                    pointOfContact :"",
                    technicalPointOfContact :"",
                    roomSize :"",
                    role:"",
                    parentSite:{
                        id:"",
                        name:""
                    },
                    lstEquips:[]};
    this.emptyRoom = {};
    $scope.canDelete = false; // Flag disable button delete
    $scope.isSiteListOpened = false; // Flag to manage GUI display of the list
    
    $scope.getLabelROLE = function(pRole) {
        for (t in $scope.ROLE) {
            if ($scope.ROLE[t].value == pRole) return $scope.ROLE[t].label;
        }
    };
    
    // TODO: To remove at some point
    $scope.room_init = {id: "1",
                    roomID :"erv324r23",
                    pointOfContact :"sgt bilbo",
                    technicalPointOfContact :"sgt bilbo",
                    roomSize :"43",
                    role:"TC",
                    parentSite:{
                        id:"2",
                        name:"siteTest"
                    },
                    lstEquips:[]};
    
    function init() {
        loadList();
        self.emptyRoom = angular.copy($scope.room);
        //$scope.room = angular.copy($scope.room_init); // TODO: to remove at some point...
    }
    
    $scope.openRoom = function(pRoom) {
        $scope.setRoom(pRoom);
        loadEquipsList();
    }
    
    $scope.setRoom = function(pRoom) {
        $scope.room = angular.copy(pRoom);
    }
    
    $scope.loadRoom = function(p_room) {
        $scope.setRoom(p_room);
        $scope.roomForm.$setPristine();
        $scope.canDelete = true;
        $scope.resetMsg();
        
        loadEquipsList();
    };
    
    $scope.resetFrm = function() {
        $scope.setRoom(self.emptyRoom);
        $scope.roomForm.$setPristine();
        $scope.canDelete = false;
    };
    
    $scope.resetMsg = function() {
        if ($scope.SQLErrors) delete $scope.SQLErrors;
        if ($scope.SQLMsgs) delete $scope.SQLMsgs;
    }
    
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
                    role : $scope.room.role,
                    parentSiteKey : $scope.room.parentSite.id
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
    
    $scope.closeSiteList = function() {
        $scope.isSiteListOpened = false;
    };

    $scope.openSiteList = function() {
        $scope.isSiteListOpened = true;
        loadSiteList();
    };
    
    $scope.associateSite = function(selectSite) {
        if ($scope.room.parentSite.name != selectSite.siteName) {
            $scope.roomForm.parentSiteName.$setDirty();
        }
        
        $scope.room.parentSite.id = selectSite.id;
        $scope.room.parentSite.name = selectSite.siteName;
        $scope.isSiteListOpened = false;
    };
    
    function loadSiteList() {
        $http.post("/MESTO/MESTO_WEB_APP/php/DAOSite.php").success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.siteList = data;
                }
                else {
                    $scope.lstStErr = data.error;
                }
            }
        ).error(
            function(data, status, headers, config, statusText) {
                // TODO: error server handling
                $scope.lstStErr = "error: "+status+":"+statusText;
            }
        );
    };
    
    function loadEquipsList() {
        $http({
                method: 'POST',
                url: "/MESTO/MESTO_WEB_APP/php/DAOEquipment.php", // TODO: Make a config with path
                data: {
                    id : $scope.room.id,
                    type : "ROOM_INC"
                },
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success( // TODO: Make a config with path
            function(data) {
                if (data.error == null) {
                    $scope.room.lstEquips = data;
                }
                else {
                    $scope.lstEquipErr = data.error;
                }
            }
            ).error(
                function(data, status, headers, config, statusText) {
                    // TODO: error server handling
                    $scope.lstEquipErr = "error: "+status+":"+statusText;
                    //$scope.error = "error: "+data+" -- "+status+" -- "+headers+" -- "+config;
                }
            );
    };
    
    $scope.addEquip = function() {
        $location.path("/admin/equip"); // TODO: complete by sending the ID and do the comportement on the Room page
    };
    
    init();
});