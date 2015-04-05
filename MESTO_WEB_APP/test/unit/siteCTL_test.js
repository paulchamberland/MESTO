describe('Testing the controller of site object', function() {
    beforeEach(module('MESTO'));
    var $controller;

    beforeEach(inject(function(_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));
    
    it('Testing: creation object', function() {
        var $scope = {};
        var controller = $controller('siteCTL', { $scope: $scope });
        expect($scope.canDelete).toBe(false);
        
        var site = {id: "",
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
        
        expect($scope.site).toEqual(site);
        
        expect(controller.emptySite).toEqual(site);
    });

    it('Testing: Load of a site', function() {
        var $scope = {};
        $scope.siteForm = {$setPristine : function(){}};
        var controller = $controller('siteCTL', { $scope: $scope });
        
        var fakeSite = {id: "1",
                    reference :"test",
                    latitude:"12.123456",
                    longitude:"43.123456",
                    siteName:"test4",
                    description:"test5",
                    isTemporary:true,
                    startDate:"12-12-1912",
                    endDate:"11-11-1900",
                    address:"test9",
                    city:"test10",
                    province:"test11",
                    country:"test12",
                    postalCode:"X5X 5X5",
                    role:"COP"};
                    
        $scope.loadSite(fakeSite);
        
        fakeSite.startDate = new Date(fakeSite.startDate).toDMY();
        fakeSite.endDate = new Date(fakeSite.endDate).toDMY();
        
        expect($scope.site).toEqual(fakeSite);
        //expect($scope.siteForm.$pristine).toBe(true);
        //expect($scope.siteForm.$dirty).toBe(false);
        //expect($scope.siteForm.$valid).toBe(true);
        expect($scope.canDelete).toBe(true);
    });
    
    it('Testing: Reset form', function() {
        var $scope = {};
        $scope.siteForm = {$setPristine : function(){}};
        var controller = $controller('siteCTL', { $scope: $scope });
        $scope.loadSite({id: "1",
                    reference :"test",
                    latitude:"12.123456",
                    longitude:"43.123456",
                    siteName:"test4",
                    description:"test5",
                    isTemporary:true,
                    startDate:"12-12-1912",
                    endDate:"11-11-1900",
                    address:"test9",
                    city:"test10",
                    province:"test11",
                    country:"test12",
                    postalCode:"X5X 5X5",
                    role:"COP"});
        
        $scope.resetFrm();
        
        expect($scope.canDelete).toBe(false);
        //expect($scope.siteForm.$pristine).toBe(true);
        //expect($scope.siteForm.$dirty).toBe(false);
        //expect($scope.siteForm.$valid).toBe(true);
        expect($scope.site).toEqual({id: "",
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
                                    role:""});
    });
    
    describe('Testing Ajax call from site object', function() {
        beforeEach(inject(function(_$httpBackend_) {
            $httpBackend = _$httpBackend_;
        }));
 
        it('Testing: Skipping the Saving', function() {
            var $scope = {};
            $scope.siteForm = {$dirty:false, $valid:false};
            var controller = $controller('siteCTL', { $scope: $scope });
            $scope.canDelete = true;
            $scope.site = {reference:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveSite.php').respond('{"msg":"Site created successfully!!!", "error":""}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond([{}]);
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond('[{"id": "1",'
                                                                                        +'"reference":"test",'
                                                                                        +'"latitude":"12.123456",'
                                                                                        +'"longitude":"43.123456",'
                                                                                        +'"siteName":"test4",'
                                                                                        +'"description":"test5",'
                                                                                        +'"isTemporary":true,'
                                                                                        +'"startDate":"12-12-1912",'
                                                                                        +'"endDate":"11-11-1900",'
                                                                                        +'"address":"test9",'
                                                                                        +'"city":"test10",'
                                                                                        +'"province":"test11",'
                                                                                        +'"country":"test12",'
                                                                                        +'"postalCode":"X5X 5X5",'
                                                                                        +'"role":"COP"}]');

            $scope.save(); // <--- TEST

            $httpBackend.flush();
            
            expect($scope.canDelete).toBe(true);
            expect($scope.site).toEqual({reference :"fake"});
            expect($scope.SQLMsgs).not.toBeDefined();
            expect($scope.SQLErrors).not.toBeDefined();
            expect($scope.siteList).toEqual([{}]);
        });
        
        it('Testing: Succeeding the Saving', function() {
            var $scope = {};
            $scope.siteForm = {$setPristine:function(){}, $dirty:true, $valid:true};
            var controller = $controller('siteCTL', { $scope: $scope });
            $scope.canDelete = true;
            $scope.site = {reference:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveSite.php').respond('{"msg":"Site created successfully!!!", "error":""}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond('');
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond('[{"id": "1",'
                                                                                        +'"reference":"test",'
                                                                                        +'"latitude":"12.123456",'
                                                                                        +'"longitude":"43.123456",'
                                                                                        +'"siteName":"test4",'
                                                                                        +'"description":"test5",'
                                                                                        +'"isTemporary":true,'
                                                                                        +'"startDate":"12-12-1912",'
                                                                                        +'"endDate":"11-11-1900",'
                                                                                        +'"address":"test9",'
                                                                                        +'"city":"test10",'
                                                                                        +'"province":"test11",'
                                                                                        +'"country":"test12",'
                                                                                        +'"postalCode":"X5X 5X5",'
                                                                                        +'"role":"COP"}]');

            $scope.save(); // <--- TEST

            $httpBackend.flush();
            
            expect($scope.canDelete).toBe(false);
            expect($scope.site).toEqual({id: "",
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
                                    role:""});
            expect($scope.SQLMsgs).toEqual('Site created successfully!!!');
            expect($scope.SQLErrors).not.toBeDefined();
            expect($scope.siteList).toEqual([{"id": "1",
                                                "reference":"test",
                                                "latitude":"12.123456",
                                                "longitude":"43.123456",
                                                "siteName":"test4",
                                                "description":"test5",
                                                "isTemporary":true,
                                                "startDate":"12-12-1912",
                                                "endDate":"11-11-1900",
                                                "address":"test9",
                                                "city":"test10",
                                                "province":"test11",
                                                "country":"test12",
                                                "postalCode":"X5X 5X5",
                                                "role":"COP"}]);
        });
        
        it('Testing: Generated error for Saving', function() {
            var $scope = {};
            $scope.siteForm = {$dirty:true, $valid:true};
            var controller = $controller('siteCTL', { $scope: $scope });
            $scope.canDelete = true;
            $scope.site = {reference:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveSite.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond({});
            
            $scope.save(); // <--- TEST

            $httpBackend.flush();
            
            expect($scope.canDelete).toBe(true);
            expect($scope.site).toEqual({reference:"fake"});
            expect($scope.SQLMsgs).not.toBeDefined();
            expect($scope.SQLErrors).toEqual('Database error, Contact administrator. Try later'); // Principal test
            expect($scope.siteList).toEqual({});
        });
        
        it('Testing: Failing the Saving', function() {
            var $scope = {};
            $scope.siteForm = {$dirty:true, $valid:true};
            var controller = $controller('siteCTL', { $scope: $scope });
            $scope.canDelete = true;
            $scope.site = {reference:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveSite.php').respond(500, 'server error');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond({});
            
            $scope.save(); // <--- TEST

            $httpBackend.flush();
            
            expect($scope.canDelete).toBe(true);
            expect($scope.site).toEqual({reference:"fake"});
            expect($scope.SQLMsgs).not.toBeDefined();
            expect($scope.SQLErrors).toEqual('error: 500:undefined'); // Principal test
            expect($scope.siteList).toEqual({});
        });
        
        
        
        
        it('Testing: Succeeding the Deleting', function() {
            var $scope = {};
            $scope.siteForm = {$setPristine:function(){}};
            var controller = $controller('siteCTL', { $scope: $scope });
            $scope.canDelete = true;
            $scope.site = {reference:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveSite.php').respond('{"msg":"Site deleted successfully!!!", "error":""}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond('');
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond('[{"id": "1",'
                                                                                        +'"reference":"test",'
                                                                                        +'"latitude":"12.123456",'
                                                                                        +'"longitude":"43.123456",'
                                                                                        +'"siteName":"test4",'
                                                                                        +'"description":"test5",'
                                                                                        +'"isTemporary":true,'
                                                                                        +'"startDate":"12-12-1912",'
                                                                                        +'"endDate":"11-11-1900",'
                                                                                        +'"address":"test9",'
                                                                                        +'"city":"test10",'
                                                                                        +'"province":"test11",'
                                                                                        +'"country":"test12",'
                                                                                        +'"postalCode":"X5X 5X5",'
                                                                                        +'"role":"COP"}]');

            $scope.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect($scope.canDelete).toBe(false);
            expect($scope.site).toEqual({id: "",
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
                                    role:""});
            expect($scope.SQLMsgs).toEqual('Site deleted successfully!!!');
            expect($scope.SQLErrors).not.toBeDefined();
            expect($scope.siteList).toEqual([{"id": "1",
                                                "reference":"test",
                                                "latitude":"12.123456",
                                                "longitude":"43.123456",
                                                "siteName":"test4",
                                                "description":"test5",
                                                "isTemporary":true,
                                                "startDate":"12-12-1912",
                                                "endDate":"11-11-1900",
                                                "address":"test9",
                                                "city":"test10",
                                                "province":"test11",
                                                "country":"test12",
                                                "postalCode":"X5X 5X5",
                                                "role":"COP"}]);
        });
        
        it('Testing: Generating erro for Deleting', function() {
            var $scope = {};
            var controller = $controller('siteCTL', { $scope: $scope });
            $scope.canDelete = true;
            $scope.site = {reference:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveSite.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond('fake');
            
            $scope.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect($scope.canDelete).toBe(true);
            expect($scope.site).toEqual({reference:"fake"});
            expect($scope.SQLMsgs).not.toBeDefined();
            expect($scope.SQLErrors).toEqual('Database error, Contact administrator. Try later'); // Principal test
            expect($scope.siteList).toEqual('fake');
        });
        
        it('Testing: Failling the Deleting', function() {
            var $scope = {};
            var controller = $controller('siteCTL', { $scope: $scope });
            $scope.canDelete = true;
            $scope.site = {reference:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveSite.php').respond(500, 'server error');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond({});
            
            $scope.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect($scope.canDelete).toBe(true);
            expect($scope.site).toEqual({reference:"fake"});
            expect($scope.SQLMsgs).not.toBeDefined();
            expect($scope.SQLErrors).toEqual('error: 500:undefined'); // Principal test
            expect($scope.siteList).toEqual({});
        });
        
        it('Testing: Refresh sites list with success', function() {
            var $scope = {};
            var controller = $controller('siteCTL', { $scope: $scope });
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond('[{"id": "1",'
                                                                                        +'"reference":"test",'
                                                                                        +'"latitude":"12.123456",'
                                                                                        +'"longitude":"43.123456",'
                                                                                        +'"siteName":"test4",'
                                                                                        +'"description":"test5",'
                                                                                        +'"isTemporary":true,'
                                                                                        +'"startDate":"12-12-1912",'
                                                                                        +'"endDate":"11-11-1900",'
                                                                                        +'"address":"test9",'
                                                                                        +'"city":"test10",'
                                                                                        +'"province":"test11",'
                                                                                        +'"country":"test12",'
                                                                                        +'"postalCode":"X5X 5X5",'
                                                                                        +'"role":"COP"}]');

            $scope.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            
            expect($scope.lstError).not.toBeDefined();
            expect($scope.siteList).toEqual([{"id": "1",
                                                "reference":"test",
                                                "latitude":"12.123456",
                                                "longitude":"43.123456",
                                                "siteName":"test4",
                                                "description":"test5",
                                                "isTemporary":true,
                                                "startDate":"12-12-1912",
                                                "endDate":"11-11-1900",
                                                "address":"test9",
                                                "city":"test10",
                                                "province":"test11",
                                                "country":"test12",
                                                "postalCode":"X5X 5X5",
                                                "role":"COP"}]);
        });
        it('Testing: Refresh sites list and failed...', function() {
            var $scope = {};
            var controller = $controller('siteCTL', { $scope: $scope });
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(500, 'server error');

            $scope.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect($scope.siteList).not.toBeDefined();
            expect($scope.lstError).toEqual('error: 500:undefined'); // Principal test
        });
    });
    
    it('', function() {

    });
});