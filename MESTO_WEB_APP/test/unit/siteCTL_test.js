describe('Testing the controller of site object =>', function() {
    beforeEach(module('MESTO'));
    var controller, scope;

    beforeEach(inject(function(_$controller_, $rootScope) {
        scope = $rootScope;
        controller = _$controller_('siteCTL', { $scope: scope });
        
        $ = function() {return {
                fadeOut : function() {},
                fadeIn : function() {}
            };
        };
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
        
        expect(scope.isAutorizeUpdatingSite).toBeFalsy();
        expect(scope.isAutorizeCreatingSite).toBeFalsy();
        expect(scope.isAutorizeDeletingSite).toBeFalsy();
        expect(scope.isAutorizeSeeDetailsSite).toBeFalsy();
        expect(scope.canSave).toBeFalsy();
    });
    
    it('Testing: Get the label from ROLE value', function() {
        expect(controller.getLabelROLE('ED')).toEqual("Edifice");
        expect(controller.getLabelROLE('FLR')).toEqual("Floor");
        expect(controller.getLabelROLE('FOB')).toEqual("FOB");
        expect(controller.getLabelROLE('COP')).toEqual("COP");
        expect(controller.getLabelROLE('CMP')).toEqual("CAMP");
    });

    it('Testing: Open site', function() {
        var site = {id: "1",
                    reference :"test",
                    latitude:"12.123456",
                    longitude:"43.123456",
                    siteName:"test4"};
                    
        // TODO: Spy on both sub list private function
        controller.openSite(site); // security ON
        
        expect(scope.site).toEqual(controller.emptySite);
        // TODO: make a spy of jquery without or sub object function
        
        scope.isAutorizeSeeDetailsSite = true;
        controller.openSite(site); // security OFF
        
        expect(scope.site).toEqual(site);
    });
    
    describe('Dependancy to navigateSrv/location', function() {
        var location, navigateSrv;
        
        beforeEach(inject(function(_navigateSrv_, _$location_) {
            navigateSrv = _navigateSrv_;
            location = _$location_;
        }));
        it('Testing: NavigateToSite function', function() {
            var site = {id: "1",
                    reference :"test",
                    latitude:"12.123456",
                    longitude:"43.123456",
                    siteName:"test4"};
            
            spyOn(location, 'path');
            
            controller.navigateToSite(site); // Security ON
            
            expect(location.path).not.toHaveBeenCalled();
            expect(navigateSrv.getSite()).toBeNull();
            
            scope.isAutorizeUpdatingSite = true;
            controller.navigateToSite(site); // Security OFF
            
            expect(location.path).toHaveBeenCalledWith('/admin/site');
            expect(navigateSrv.getSite()).toEqual(site);
        });
        
        it('Testing: Add a new sub-object Room', function() {
            spyOn(location, 'path');
            
            controller.newRoom();
            
            expect(location.path).toHaveBeenCalledWith('/admin/room');
        });
        
        it('Testing: Add a new sub-object Equipment', function() {
            spyOn(location, 'path');
            
            controller.newEquip();
            
            expect(location.path).toHaveBeenCalledWith('/admin/equip');
        });
        
        it('Testing: Add a new object Site', function() {
            spyOn(location, 'path');
            
            controller.newSite();
            
            expect(location.path).toHaveBeenCalledWith('/admin/site');
        });
    });
    
    it('Testing: Load of a site', function() {
        //scope.siteForm = {$setPristine : function(){}};
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
                    
        controller.loadSite(fakeSite);
        
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
                    
        controller.loadSite(fakeSite);
        
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
                    
        controller.loadSite(fakeSite2);
        
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
        controller.loadSite({id: "1",
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
        
        controller.resetFrm();
        
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
        controller.resetMsg(); // Test when already not define
        
        expect(scope.SQLMsgs).not.toBeDefined();
        expect(scope.SQLErrors).not.toBeDefined();
        
        scope.SQLMsgs = "Good message";
        scope.SQLErrors = "bad message";
        controller.resetMsg(); // test when define
        
        expect(scope.SQLMsgs).not.toBeDefined();
        expect(scope.SQLErrors).not.toBeDefined();
    });
    
    it('Testing: openFreeRoomsList', function() {
        spyOn(controller, "loadFreeRoomsList");
        
        controller.openFreeRoomsList();
        expect(controller.loadFreeRoomsList).toHaveBeenCalled();
        // TODO : add test and spy for JQuery
    });
    
    it('Testing: closeFreeRoomsList', function() {
        scope.lstFreeRooms = "test";
        controller.closeFreeRoomsList();
        
        expect(scope.lstFreeRooms).not.toBeDefined();
        // TODO : add test and spy for JQuery
    });
    
    it('Testing: openFreeEquipsList', function() {
        spyOn(controller, "loadFreeEquipsList");
        
        controller.openFreeEquipsList();
        expect(controller.loadFreeEquipsList).toHaveBeenCalled();
        // TODO : add test and spy for JQuery
    });
    
    it('Testing: closeFreeEquipsList', function() {
        scope.lstFreeEquips = "test";
        controller.closeFreeEquipsList();
        
        expect(scope.lstFreeEquips).not.toBeDefined();
        // TODO : add test and spy for JQuery
    });
    describe('Testing Ajax call from site object =>', function() {
        var location;
        
        beforeEach(inject(function(_$httpBackend_, _$location_) {
            $httpBackend = _$httpBackend_;
            location = _$location_;
        }));
 
        it('Testing: Refresh sites list with success', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTL INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(200, '[{"id": "1",'
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

            controller.refreshList(); // <--- TEST

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
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTL INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            
            controller.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.siteList).toEqual('');
            expect(scope.lstError).toEqual('Database error, Contact administrator. Try later'); // Principal test
        });
        it('Testing: Refresh sites list and failed...', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTL INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(500, 'server error');

            controller.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.siteList).toEqual('');
            expect(scope.lstError).toEqual('error: 500:undefined'); // Principal test
        });
 
        it('Testing: Skipping the Saving', function() {
            scope.siteForm = {$dirty:false, $valid:false};
            scope.canDelete = true;
            scope.site = {reference:"fake"};
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond('lst'); // CTL INIT

            controller.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.site).toEqual({reference :"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.siteList).toEqual('lst');
        });
        it('Testing: Succeeding the Saving (with old msg)', function() {
            scope.siteForm = {$setPristine:function(){}, $dirty:true, $valid:true};
            scope.SQLErrors = " error msg";
            scope.MsgErrors = "success msg";
            scope.canDelete = true;
            scope.site = {reference:"fake"};
            
            spyOn(location, 'path');  
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTL INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveSite.php').respond('{"msg":"Site created successfully!!!", "error":""}');

            controller.save(); // <--- TEST

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
                                    
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.siteList).toEqual('');
            
            expect(location.path).toHaveBeenCalledWith("/admin/sites");
        });
        it('Testing: Generated error for Saving', function() {
            scope.siteForm = {$dirty:true, $valid:true};
            scope.canDelete = true;
            scope.site = {reference:"fake"};
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond('lst'); // CTL INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveSite.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            
            controller.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.site).toEqual({reference:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('Database error, Contact administrator. Try later'); // Principal test
            expect(scope.siteList).toEqual('lst');
        });
        it('Testing: Failing the Saving', function() {
            scope.siteForm = {$dirty:true, $valid:true};
            scope.canDelete = true;
            scope.site = {reference:"fake"};
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond('lst'); // CTL INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveSite.php').respond(500, 'server error');
            
            controller.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.site).toEqual({reference:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('error: 500:undefined'); // Principal test
            expect(scope.siteList).toEqual('lst');
        });

        
        it('Testing: Succeeding the Deleting (with old msg)', function() {
            scope.siteForm = {$setPristine:function(){}};
            scope.SQLErrors = " error msg";
            scope.MsgErrors = "success msg";
            scope.canDelete = true;
            scope.site = {reference:"fake"};
            
            spyOn(location, 'path');
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTL INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveSite.php').respond('{"msg":"Site deleted successfully!!!", "error":""}');

            controller.delete(); // <--- TEST

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
            
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.siteList).toEqual('');
            
            expect(location.path).toHaveBeenCalledWith("/admin/sites");
        });
        it('Testing: Generating error for Deleting', function() {
            scope.canDelete = true;
            scope.site = {reference:"fake"};
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond('lst'); // CTL INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveSite.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            
            controller.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.site).toEqual({reference:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('Database error, Contact administrator. Try later'); // Principal test
            expect(scope.siteList).toEqual('lst');
        });
        it('Testing: Failling the Deleting', function() {
            scope.canDelete = true;
            scope.site = {reference:"fake"};
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond('lst'); // CTL INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveSite.php').respond(500, 'server error');
            
            controller.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.site).toEqual({reference:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('error: 500:undefined'); // Principal test
            expect(scope.siteList).toEqual('lst');
        });
        
        it('Testing: Failed to Load sub list of Equipements', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(200, '{"msg":"", "error":"Database error"}');
            
            controller.loadEquipsList();
            $httpBackend.flush();
            
            expect(scope.lstEquipErr).toEqual("Database error");
            expect(scope.site.lstEquips).toEqual([]);
        });
        it('Testing: Error to Load sub list of Equipements', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(500, '{"msg":"", "error":"error"}');
            
            controller.loadEquipsList();
            $httpBackend.flush();
            
            expect(scope.lstEquipErr).toEqual("error: 500:undefined");
            expect(scope.site.lstEquips).toEqual([]);
        });
        it('Testing: Success to Load sub list of Equipements', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(200, '[{"test":"test"}]');
            
            controller.loadEquipsList();
            $httpBackend.flush();
            
            expect(scope.lstEquipErr).not.toBeDefined();
            expect(scope.site.lstEquips).toEqual([{test:"test"}]);
        });
        
        it('Testing: Failed to remove a associated equipment', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond(200, '{"msg":"", "error":"Database error"}');
            
            controller.removeAssEquip(12);
            $httpBackend.flush();
            
            expect(scope.lstEquipErr).toEqual("Database error");
        });
        it('Testing: Error to remove a associated equipment', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond(500, '{"msg":"", "error":"error"}');
            
            controller.removeAssEquip(12);
            $httpBackend.flush();
            
            expect(scope.lstEquipErr).toEqual("error: 500:undefined");
        });
        it('Testing: Success to remove a associated equipment', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond(200, '{"msg":"success", "error":""}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('[{"test":"test"}]');
            
            spyOn(controller, "loadEquipsList").and.callThrough();
            
            controller.removeAssEquip(12);
            $httpBackend.flush();
            
            expect(scope.lstEquipErr).not.toBeDefined();
            expect(scope.site.lstEquips).toEqual([{test:"test"}]);
            expect(controller.loadEquipsList).toHaveBeenCalled();
        });
        
        it('Testing: Failed to remove a associated room', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveRoom.php').respond(200, '{"msg":"", "error":"Database error"}');
            
            controller.removeAssRoom(12);
            $httpBackend.flush();
            
            expect(scope.lstRoomErr).toEqual("Database error");
        });
        it('Testing: Error to remove a associated room', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveRoom.php').respond(500, '{"msg":"", "error":"error"}');
            
            controller.removeAssRoom(12);
            $httpBackend.flush();
            
            expect(scope.lstRoomErr).toEqual("error: 500:undefined");
        });
        it('Testing: Success to remove a associated room', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveRoom.php').respond(200, '{"msg":"success", "error":""}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond('[{"test":"test"}]');
            
            controller.removeAssRoom(12);
            $httpBackend.flush();
            
            expect(scope.lstRoomErr).not.toBeDefined();
            expect(scope.site.lstRooms).toEqual([{test:"test"}]);
        });
        
        it('Testing: Failed to load Free Equips List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(200, '{"msg":"", "error":"Database error"}');
            
            controller.loadFreeEquipsList();
            $httpBackend.flush();
            
            expect(scope.lstFreeEquipErr).toEqual("Database error");
            expect(scope.lstFreeEquips).not.toBeDefined();
        });
        it('Testing: Error to load Free Equips List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(500, '{"msg":"", "error":"error"}');
            
            controller.loadFreeEquipsList();
            $httpBackend.flush();
            
            expect(scope.lstFreeEquipErr).toEqual("error: 500:undefined");
            expect(scope.lstFreeEquips).not.toBeDefined();
        });
        it('Testing: Success to load Free Equips List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(200, '[{"test":"test"}]');
            
            controller.loadFreeEquipsList();
            $httpBackend.flush();
            
            expect(scope.lstFreeEquipErr).not.toBeDefined();
            expect(scope.lstFreeEquips).toEqual([{test:"test"}]);
        });
        
        it('Testing: Failed to add Free Equips List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond(200, '{"msg":"", "error":"Database error"}');
            scope.lstFreeEquips = [43,41,3];
            
            controller.addFreeEquipsList();
            $httpBackend.flush();
            
            expect(scope.lstFreeEquipErr).toEqual("Database error");
        });
        it('Testing: Error to add Free Equips List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond(500, '{"msg":"", "error":"error"}');
            scope.lstFreeEquips = [43,41,3];
            
            controller.addFreeEquipsList();
            $httpBackend.flush();
            
            expect(scope.lstFreeEquipErr).toEqual("error: 500:undefined");
        });
        it('Testing: Success to add Free Equips List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond(200, '[{"test":"test"}]');
            scope.lstFreeEquips = [43,41,3];
            
            controller.closeFreeEquipsList = jasmine.createSpy("closeFreeEquipsList");
            controller.loadEquipsList = jasmine.createSpy("loadEquipsList");
            
            controller.addFreeEquipsList();
            $httpBackend.flush();
            
            expect(controller.closeFreeEquipsList).toHaveBeenCalled();
            expect(controller.loadEquipsList).toHaveBeenCalled();
            
            expect(scope.lstFreeEquipErr).not.toBeDefined();
        });
        
        it('Testing: Failed to load Free Rooms List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(200, '{"msg":"", "error":"Database error"}');
            
            controller.loadFreeRoomsList();
            $httpBackend.flush();
            
            expect(scope.lstFreeRoomErr).toEqual("Database error");
            expect(scope.lstFreeRooms).not.toBeDefined();
        });
        it('Testing: Error to load Free Rooms List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(500, '{"msg":"", "error":"error"}');
            
            controller.loadFreeRoomsList();
            $httpBackend.flush();
            
            expect(scope.lstFreeRoomErr).toEqual("error: 500:undefined");
            expect(scope.lstFreeRooms).not.toBeDefined();
        });
        it('Testing: Success to load Free Rooms List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(200, '[{"test":"test"}]');
            
            controller.loadFreeRoomsList();
            $httpBackend.flush();
            
            expect(scope.lstFreeRoomErr).not.toBeDefined();
            expect(scope.lstFreeRooms).toEqual([{test:"test"}]);
        });
        
        it('Testing: Failed to add Free Rooms List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveRoom.php').respond(200, '{"msg":"", "error":"Database error"}');
            scope.lstFreeRooms = [43,41,3];
            
            controller.addFreeRoomsList();
            $httpBackend.flush();
            
            expect(scope.lstFreeRoomErr).toEqual("Database error");
        });
        it('Testing: Error to add Free Rooms List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveRoom.php').respond(500, '{"msg":"", "error":"error"}');
            scope.lstFreeRooms = [43,41,3];
            
            controller.addFreeRoomsList();
            $httpBackend.flush();
            
            expect(scope.lstFreeRoomErr).toEqual("error: 500:undefined");
        });
        it('Testing: Success to add Free Rooms List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveRoom.php').respond(200, '[{"test":"test"}]');
            scope.lstFreeRooms = [43,41,3];
            
            controller.closeFreeRoomsList = jasmine.createSpy("closeFreeRoomsList");
            controller.loadRoomsList = jasmine.createSpy("loadRoomsList");
            
            controller.addFreeRoomsList();
            $httpBackend.flush();
            
            expect(controller.closeFreeRoomsList).toHaveBeenCalled();
            expect(controller.loadRoomsList).toHaveBeenCalled();
            
            expect(scope.lstFreeRoomErr).not.toBeDefined();
        });
    });
});