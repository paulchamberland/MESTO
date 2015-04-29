describe('Testing the controller of site object =>', function() {
    beforeEach(module('MESTO'));
    var controller, scope;

    beforeEach(inject(function(_$controller_, $rootScope) {
        scope = $rootScope;
        controller = _$controller_('siteCTL', { $scope: scope });
    }));
    
    it('Testing: creation object', function() {
        expect(scope.canDelete).toBe(false);
        
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
                    role:"",
                    pointOfContact:"",
                    phoneNumberPoC:"",
                    lstRooms:[],
                    lstEquips:[]};
        
        expect(scope.site).toEqual(site);
        
        expect(controller.emptySite).toEqual(site);
    });

    it('Testing: Load of a site', function() {
        scope.siteForm = {$setPristine : function(){}};
        scope.SQLMsgs = "Good message";
        scope.SQLErrors = "bad message";
        
        var fakeSite = {id: "1",
                    reference :"test",
                    latitude:"12.123456",
                    longitude:"43.123456",
                    siteName:"test4",
                    description:"test5",
                    isTemporary:true,
                    startDate:"1912-01-01",
                    endDate:"1900-11-11",
                    address:"test9",
                    city:"test10",
                    province:"test11",
                    country:"test12",
                    postalCode:"X5X 5X5",
                    role:"COP",
                    pointOfContact:"Lt. Bariton",
                    phoneNumberPoC:"514-555-4321",
                    lstRooms:[{id:"2",name:"test"},{id:"3",name:"testV2"}],
                    lstEquips:[{id:"2",roomID:"test"},{id:"3",roomID:"testV2"}]};
                    
        scope.loadSite(fakeSite);
        
        expect(scope.site).toEqual({id: "1",
                                    reference :"test",
                                    latitude:"12.123456",
                                    longitude:"43.123456",
                                    siteName:"test4",
                                    description:"test5",
                                    isTemporary:true,
                                    startDate:"01-01-1912",
                                    endDate:"11-11-1900",
                                    address:"test9",
                                    city:"test10",
                                    province:"test11",
                                    country:"test12",
                                    postalCode:"X5X 5X5",
                                    role:"COP",
                                    pointOfContact:"Lt. Bariton",
                                    phoneNumberPoC:"514-555-4321",
                                    lstRooms:[{id:"2",name:"test"},{id:"3",name:"testV2"}],
                                    lstEquips:[{id:"2",roomID:"test"},{id:"3",roomID:"testV2"}]});
        expect(scope.canDelete).toBe(true);
        expect(scope.SQLMsgs).not.toBeDefined();
        expect(scope.SQLErrors).not.toBeDefined();
    });
    it('Testing: Validation of Date at loading', function() {
        scope.siteForm = {$setPristine : function(){}};
        
        var fakeSite = {id: "1",
                    reference :"test",
                    latitude:"12.123456",
                    longitude:"43.123456",
                    siteName:"test4",
                    isTemporary:true,
                    startDate:"01-01-2008",
                    endDate:"01-01-2010"};
                    
        scope.loadSite(fakeSite);
        
        expect(scope.site).toEqual({id: "1",
                    reference :"test",
                    latitude:"12.123456",
                    longitude:"43.123456",
                    siteName:"test4",
                    isTemporary:true,
                    startDate:"01-01-2008",
                    endDate:"01-01-2010"});
        
        var fakeSite2 = {id: "2",
            reference :"tester",
            latitude:"55.123456",
            longitude:"44.123456",
            siteName:"tester2",
            isTemporary:true,
            startDate:"2008-01-01",
            endDate:"2010-01-01"};
                    
        scope.loadSite(fakeSite2);
        
        expect(scope.site).toEqual({id: "2",
                    reference :"tester",
                    latitude:"55.123456",
                    longitude:"44.123456",
                    siteName:"tester2",
                    isTemporary:true,
                    startDate:"01-01-2008",
                    endDate:"01-01-2010"});
    });
    
    it('Testing: Reset form', function() {
        scope.siteForm = {$setPristine : function(){}};
        scope.loadSite({id: "1",
                    reference :"test",
                    latitude:"12.123456",
                    longitude:"43.123456",
                    siteName:"test4",
                    description:"test5",
                    isTemporary:true,
                    startDate:"1912-12-12",
                    endDate:"1900-11-11",
                    address:"test9",
                    city:"test10",
                    province:"test11",
                    country:"test12",
                    postalCode:"X5X 5X5",
                    role:"COP",
                    pointOfContact:"Lt. Bariton",
                    phoneNumberPoC:"514-555-4321",
                    lstRooms:[{id:"2",name:"test"},{id:"3",name:"testV2"}],
                    lstEquips:[{id:"2",roomID:"test"},{id:"3",roomID:"testV2"}]});
        
        scope.resetFrm();
        
        expect(scope.canDelete).toBe(false);
        expect(scope.site).toEqual({id: "",
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
                                    role:"",
                                    pointOfContact:"",
                                    phoneNumberPoC:"",
                                    lstRooms:[],
                                    lstEquips:[]});
    });
    
    it('Testing: Reset Messages ', function() {
        scope.resetMsg(); // Test when already not define
        
        expect(scope.SQLMsgs).not.toBeDefined();
        expect(scope.SQLErrors).not.toBeDefined();
        
        scope.SQLMsgs = "Good message";
        scope.SQLErrors = "bad message";
        scope.resetMsg(); // test when define
        
        expect(scope.SQLMsgs).not.toBeDefined();
        expect(scope.SQLErrors).not.toBeDefined();
    });
    
    describe('Testing Ajax call from site object =>', function() {
        beforeEach(inject(function(_$httpBackend_) {
            $httpBackend = _$httpBackend_;
        }));
 
        it('Testing: Refresh sites list with success', function() {
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(200, '[{"id": "1",'
                                                                                        +'"reference":"test",'
                                                                                        +'"latitude":"12.123456",'
                                                                                        +'"longitude":"43.123456",'
                                                                                        +'"siteName":"test4",'
                                                                                        +'"description":"test5",'
                                                                                        +'"isTemporary":true,'
                                                                                        +'"startDate":"1912-12-12",'
                                                                                        +'"endDate":"1900-11-11",'
                                                                                        +'"address":"test9",'
                                                                                        +'"city":"test10",'
                                                                                        +'"province":"test11",'
                                                                                        +'"country":"test12",'
                                                                                        +'"postalCode":"X5X 5X5",'
                                                                                        +'"role":"COP",'
                                                                                        +'"pointOfContact":"Lt. Bariton",'
                                                                                        +'"phoneNumberPoC":"514-555-4321"}]');

            scope.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.lstError).not.toBeDefined();
            expect(scope.siteList).toEqual([{"id": "1",
                                                "reference":"test",
                                                "latitude":"12.123456",
                                                "longitude":"43.123456",
                                                "siteName":"test4",
                                                "description":"test5",
                                                "isTemporary":true,
                                                "startDate":"1912-12-12",
                                                "endDate":"1900-11-11",
                                                "address":"test9",
                                                "city":"test10",
                                                "province":"test11",
                                                "country":"test12",
                                                "postalCode":"X5X 5X5",
                                                "role":"COP",
                                                "pointOfContact":"Lt. Bariton",
                                                "phoneNumberPoC":"514-555-4321"}]);
        });
        it('Testing: Generated error for Refresh', function() {
            scope.canDelete = true;
            scope.site = {reference:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            
            scope.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.siteList).not.toBeDefined();
            expect(scope.lstError).toEqual('Database error, Contact administrator. Try later'); // Principal test
        });
        it('Testing: Refresh sites list and failed...', function() {
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(500, 'server error');

            scope.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.siteList).not.toBeDefined();
            expect(scope.lstError).toEqual('error: 500:undefined'); // Principal test
        });
 
        it('Testing: Skipping the Saving', function() {
            scope.siteForm = {$dirty:false, $valid:false};
            scope.canDelete = true;
            scope.site = {reference:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveSite.php').respond('{"msg":"Site created successfully!!!", "error":""}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond([{}]);
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond('[{"id": "1",'
                                                                                        +'"reference":"test",'
                                                                                        +'"latitude":"12.123456",'
                                                                                        +'"longitude":"43.123456",'
                                                                                        +'"siteName":"test4",'
                                                                                        +'"description":"test5",'
                                                                                        +'"isTemporary":true,'
                                                                                        +'"startDate":"1912-12-12",'
                                                                                        +'"endDate":"1900-11-11",'
                                                                                        +'"address":"test9",'
                                                                                        +'"city":"test10",'
                                                                                        +'"province":"test11",'
                                                                                        +'"country":"test12",'
                                                                                        +'"postalCode":"X5X 5X5",'
                                                                                        +'"role":"COP",'
                                                                                        +'"pointOfContact":"Lt. Bariton",'
                                                                                        +'"phoneNumberPoC":"514-555-4321"}]');

            scope.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.site).toEqual({reference :"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.siteList).toEqual([{}]);
        });
        it('Testing: Succeeding the Saving (with old msg)', function() {
            scope.siteForm = {$setPristine:function(){}, $dirty:true, $valid:true};
            scope.SQLErrors = " error msg";
            scope.MsgErrors = "success msg";
            scope.canDelete = true;
            scope.site = {reference:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveSite.php').respond('{"msg":"Site created successfully!!!", "error":""}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond('');
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond('[{"id": "1",'
                                                                                        +'"reference":"test",'
                                                                                        +'"latitude":"12.123456",'
                                                                                        +'"longitude":"43.123456",'
                                                                                        +'"siteName":"test4",'
                                                                                        +'"description":"test5",'
                                                                                        +'"isTemporary":true,'
                                                                                        +'"startDate":"1912-12-12",'
                                                                                        +'"endDate":"1900-11-11",'
                                                                                        +'"address":"test9",'
                                                                                        +'"city":"test10",'
                                                                                        +'"province":"test11",'
                                                                                        +'"country":"test12",'
                                                                                        +'"postalCode":"X5X 5X5",'
                                                                                        +'"role":"COP",'
                                                                                        +'"pointOfContact":"Lt. Bariton",'
                                                                                        +'"phoneNumberPoC":"514-555-4321"}]');

            scope.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(false);
            expect(scope.site).toEqual({id: "",
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
                                    role:"",
                                    pointOfContact:"",
                                    phoneNumberPoC:"",
                                    lstRooms:[],
                                    lstEquips:[]});
            expect(scope.SQLMsgs).toEqual('Site created successfully!!!');
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.siteList).toEqual([{"id": "1",
                                                "reference":"test",
                                                "latitude":"12.123456",
                                                "longitude":"43.123456",
                                                "siteName":"test4",
                                                "description":"test5",
                                                "isTemporary":true,
                                                "startDate":"1912-12-12",
                                                "endDate":"1900-11-11",
                                                "address":"test9",
                                                "city":"test10",
                                                "province":"test11",
                                                "country":"test12",
                                                "postalCode":"X5X 5X5",
                                                "role":"COP",
                                                "pointOfContact":"Lt. Bariton",
                                                "phoneNumberPoC":"514-555-4321"}]);
        });
        it('Testing: Generated error for Saving', function() {
            scope.siteForm = {$dirty:true, $valid:true};
            scope.canDelete = true;
            scope.site = {reference:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveSite.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond({});
            
            scope.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.site).toEqual({reference:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('Database error, Contact administrator. Try later'); // Principal test
            expect(scope.siteList).toEqual({});
        });
        it('Testing: Failing the Saving', function() {
            scope.siteForm = {$dirty:true, $valid:true};
            scope.canDelete = true;
            scope.site = {reference:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveSite.php').respond(500, 'server error');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond({});
            
            scope.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.site).toEqual({reference:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('error: 500:undefined'); // Principal test
            expect(scope.siteList).toEqual({});
        });

        
        it('Testing: Succeeding the Deleting (with old msg)', function() {
            scope.siteForm = {$setPristine:function(){}};
            scope.SQLErrors = " error msg";
            scope.MsgErrors = "success msg";
            scope.canDelete = true;
            scope.site = {reference:"fake"};
            
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
                                                                                        +'"role":"COP",'
                                                                                        +'"pointOfContact":"Lt. Bariton",'
                                                                                        +'"phoneNumberPoC":"514-555-4321"}]');

            scope.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(false);
            expect(scope.site).toEqual({id: "",
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
                                    role:"",
                                    pointOfContact:"",
                                    phoneNumberPoC:"",
                                    lstRooms:[],
                                    lstEquips:[]});
            expect(scope.SQLMsgs).toEqual('Site deleted successfully!!!');
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.siteList).toEqual([{"id": "1",
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
                                                "role":"COP",
                                                "pointOfContact":"Lt. Bariton",
                                                "phoneNumberPoC":"514-555-4321"}]);
        });
        it('Testing: Generating error for Deleting', function() {
            scope.canDelete = true;
            scope.site = {reference:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveSite.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond('fake');
            
            scope.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.site).toEqual({reference:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('Database error, Contact administrator. Try later'); // Principal test
            expect(scope.siteList).toEqual('fake');
        });
        it('Testing: Failling the Deleting', function() {
            scope.canDelete = true;
            scope.site = {reference:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveSite.php').respond(500, 'server error');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond({});
            
            scope.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.site).toEqual({reference:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('error: 500:undefined'); // Principal test
            expect(scope.siteList).toEqual({});
        });
        
        it('Testing: Load sub list of Equipements', function() {
            scope.siteForm = {$setPristine : function(){}};
            
            var pSite = {id: "1",
                    reference :"test",
                    latitude:"12.123456",
                    longitude:"43.123456",
                    siteName:"test4",
                    lstRooms:[{id:"2",name:"test"},{id:"3",name:"testV2"}],
                    lstEquips:[{id:"2",roomID:"test"},{id:"3",roomID:"testV2"}]};
                        
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond('');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond('');
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('[{"test":"test"}]');
                        
            scope.loadSite(pSite);
            $httpBackend.flush();
            
            expect(scope.site.lstEquips).toEqual([{test:"test"}]);
        });
    });
});