describe('Testing the controller of room object =>', function() {
    beforeEach(module('MESTO'));
    var controller, scope;

    beforeEach(inject(function(_$controller_, $rootScope){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        scope = $rootScope;//.$new();
        controller = _$controller_('roomCTL', { $scope: scope });
    }));
    
    it('Testing: creation object', function() {
        expect(scope.canDelete).toBe(false);
        
        var room = {id: "",
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
        
        expect(scope.room).toEqual(room);
        
        expect(controller.emptyRoom).toEqual(room);
    });
    
    it('Testing: Get the label from ROLE value', function() {
        expect(controller.getLabelROLE('MTC')).toEqual("Main Telecom");
        expect(controller.getLabelROLE('TC')).toEqual("Telecom");
        expect(controller.getLabelROLE('SPR')).toEqual("Spare");
        expect(controller.getLabelROLE('STR')).toEqual("Storage");
    });
    
    it('Testing: Open room', function() {
        var room = {id: "1",
                    roomID :"erv324r23",
                    pointOfContact :"sgt bilbo",
                    roomSize :"43",
                    role:"TC"};
                    
        // TODO: Spy on the sub list private function
        controller.openRoom(room);
        
        expect(scope.room).toEqual(room);
        // TODO: make a spy on jquery without or sub object function
    });
    
    describe('Dependancy to navigateSrv/location', function() {
        var location, navigateSrv;
        
        beforeEach(inject(function(_navigateSrv_, _$location_) {
            navigateSrv = _navigateSrv_;
            location = _$location_;
        }));
        it('Testing: NavigateToRoom function', function() {
            var room = {id: "1",
                    roomID :"erv324r23",
                    pointOfContact :"sgt bilbo",
                    roomSize :"43",
                    role:"TC"};
            
            spyOn(location, 'path');
            
            controller.navigateToRoom(room);
            
            expect(location.path).toHaveBeenCalledWith('/admin/room');
            expect(navigateSrv.getRoom()).toEqual(room);
        });
        
        it('Testing: Add a new sub-object Equipment', function() {
            spyOn(location, 'path');
            
            controller.newEquip();
            
            expect(location.path).toHaveBeenCalledWith('/admin/equip');
        });
    });

    it('Testing: Load of a room', function() {
        //scope.roomForm = {$setPristine : function(){}};
        scope.SQLMsgs = "Good message";
        scope.SQLErrors = "bad message";
        
        var fakeRoom = {id: "1",
                    roomID :"erv324r23",
                    pointOfContact :"sgt bilbo",
                    technicalPointOfContact :"sgt bilbo",
                    roomSize :"43",
                    role:"TC",
                    parentSite:{
                        id:"2",
                        name:"siteTest"
                    }};
                    
        controller.loadRoom(fakeRoom);
        
        expect(scope.room).toEqual(fakeRoom);
        expect(scope.canDelete).toBe(true);
        expect(scope.SQLMsgs).not.toBeDefined();
        expect(scope.SQLErrors).not.toBeDefined();
    });
    
    it('Testing: Reset form', function() {
        scope.roomForm = {$setPristine : function(){}};
        controller.loadRoom({id: "1",
                    roomID :"erv324r23",
                    pointOfContact :"sgt bilbo",
                    technicalPointOfContact :"sgt bilbo",
                    roomSize :"43",
                    role:"TC",
                    parentSite:{
                        id:"2",
                        name:"siteTest"
                    },
                    lstEquips:[]});
        
        controller.resetFrm();
        
        expect(scope.canDelete).toBe(false);
        expect(scope.room).toEqual({id: "",
                                    roomID :"",
                                    pointOfContact :"",
                                    technicalPointOfContact :"",
                                    roomSize :"",
                                    role:"",
                                    parentSite:{
                                        id:"",
                                        name:""
                                    },
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
 
    it('Testing: associateSite function', function() {
        var testDirty = false;
        scope.roomForm = {parentSiteName:{$setDirty : function(){testDirty=true;}}};
        
        controller.associateSite({id:'3',siteName:"test"}); // test
        
        expect(scope.room.parentSite.id).toBe('3');
        expect(scope.room.parentSite.name).toEqual("test");
        expect(testDirty).toBeTruthy();
        
        testDirty = false;
        controller.associateSite({id:'3',siteName:"test"});
        expect(testDirty).toBeFalsy();
    });
    
    it('Testing: cleanAssociateSite', function() {
        var testDirty = true;
        scope.roomForm = {parentSiteName:{$setDirty : function(){testDirty=false;}}};
        
        controller.cleanAssociateSite();
        
        expect(scope.room.parentSite.id).toEqual("");
        expect(scope.room.parentSite.name).toEqual("")
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
    
    describe('Testing Ajax call from Room object => ', function() {
        beforeEach(inject(function(_$httpBackend_) {
            $httpBackend = _$httpBackend_;
        }));
 
        it('Testing: Refresh rooms list with success', function() {
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(200, '[{"id": "1",'
                                                                                        +'"roomID":"erv324r23",'
                                                                                        +'"pointOfContact":"sgt bilbo",'
                                                                                        +'"technicalPointOfContact":"sgt bilbo",'
                                                                                        +'"roomSize":"43",'
                                                                                        +'"role":"TC",'
                                                                                        +'"parentSite":{"id":"2","name":"siteTest"}'
                                                                                        +'}]');

            controller.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.lstError).not.toBeDefined();
            expect(scope.roomList).toEqual([{id:"1",
                                                roomID:"erv324r23",
                                                pointOfContact:"sgt bilbo",
                                                technicalPointOfContact:"sgt bilbo",
                                                roomSize:"43",
                                                role:"TC",
                                                parentSite:{id:"2",name:"siteTest"}
                                                }]);
        });
        it('Testing: Generated error for Refresh', function() {
            scope.canDelete = true;
            scope.room = {roomID:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            
            controller.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.roomList).not.toBeDefined();
            expect(scope.lstError).toEqual('Database error, Contact administrator. Try later'); // Principal test
        });
        it('Testing: Refresh rooms list and failed...', function() {
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(500, 'server error');

            controller.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.roomList).not.toBeDefined();
            expect(scope.lstError).toEqual('error: 500:undefined'); // Principal test
        });
 
        it('Testing: Skipping the Saving', function() {
            scope.roomForm = {$dirty:false, $valid:false};
            scope.canDelete = true;
            scope.room = {roomID:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveRoom.php').respond('{"msg":"Room created successfully!!!", "error":""}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond([{}]);
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond('[{"id": "1",'
                                                                                        +'"roomID":"erv324r23",'
                                                                                        +'"pointOfContact":"sgt bilbo",'
                                                                                        +'"technicalPointOfContact":"sgt bilbo",'
                                                                                        +'"roomSize":"43",'
                                                                                        +'"role":"TC",'
                                                                                        +'"parentSite":{"id":"2","name":"siteTest"}'
                                                                                        +'}]');

            controller.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.room).toEqual({roomID :"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.roomList).toEqual([{}]);
        });
        it('Testing: Succeeding the Saving (with old Msg)', function() {
            scope.roomForm = {$setPristine:function(){}, $dirty:true, $valid:true};
            scope.SQLErrors = " error msg";
            scope.MsgErrors = "success msg";
            scope.canDelete = true;
            scope.room = {roomID:"fake",parentSite:{},lstEquips:[]};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveRoom.php').respond('{"msg":"Room created successfully!!!", "error":""}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond('');
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond('[{"id": "1",'
                                                                                        +'"roomID":"erv324r23",'
                                                                                        +'"pointOfContact":"sgt bilbo",'
                                                                                        +'"technicalPointOfContact":"sgt bilbo",'
                                                                                        +'"roomSize":"43",'
                                                                                        +'"role":"TC",'
                                                                                        +'"parentSite":{"id":"2","name":"siteTest"}'
                                                                                        +'}]');

            controller.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(false);
            expect(scope.room).toEqual({id: "",
                                    roomID :"",
                                    pointOfContact :"",
                                    technicalPointOfContact :"",
                                    roomSize :"",
                                    role:"",
                                    parentSite:{
                                        id:"",
                                        name:""
                                    },
                                    lstEquips:[]});
            expect(scope.SQLMsgs).toEqual('Room created successfully!!!');
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.roomList).toEqual([{"id":"1",
                                                "roomID":"erv324r23",
                                                "pointOfContact":"sgt bilbo",
                                                "technicalPointOfContact":"sgt bilbo",
                                                "roomSize":"43",
                                                "role":"TC",
                                                "parentSite":{
                                                    "id":"2",
                                                    "name":"siteTest"
                                                }}]);
        });
        it('Testing: Generated error for Saving', function() {
            scope.roomForm = {$dirty:true, $valid:true};
            scope.canDelete = true;
            scope.room = {roomID:"fake",parentSite:{id:"3"}};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveRoom.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond({});
            
            controller.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.room).toEqual({roomID:"fake",parentSite:{id:"3"}});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('Database error, Contact administrator. Try later'); // Principal test
            expect(scope.roomList).toEqual({});
        });
        it('Testing: Failing the Saving', function() {
            scope.roomForm = {$dirty:true, $valid:true};
            scope.canDelete = true;
            scope.room = {roomID:"fake",parentSite:{id:"3"}};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveRoom.php').respond(500, 'server error');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond({});
            
            controller.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.room).toEqual({roomID:"fake",parentSite:{id:"3"}});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('error: 500:undefined'); // Principal test
            expect(scope.roomList).toEqual({});
        });

        it('Testing: Failed to Load sub list of Equipements', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(''); // CTR init
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(200, '{"msg":"", "error":"Database error"}');
            
            controller.loadEquipsList();
            $httpBackend.flush();
            
            expect(scope.lstEquipErr).toEqual("Database error");
            expect(scope.room.lstEquips).toEqual([]);
        });
        it('Testing: Error to Load sub list of Equipements', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(''); // CTR init
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(500, '{"msg":"", "error":"error"}');
            
            controller.loadEquipsList();
            $httpBackend.flush();
            
            expect(scope.lstEquipErr).toEqual("error: 500:undefined");
            expect(scope.room.lstEquips).toEqual([]);
        });
        it('Testing: Success to Load sub list of Equipements', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(''); // CTR init
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(200, '[{"test":"test"}]');
            
            controller.loadEquipsList();
            $httpBackend.flush();
            
            expect(scope.lstEquipErr).not.toBeDefined();
            expect(scope.room.lstEquips).toEqual([{test:"test"}]);
        });
        
        it('Testing: Succeeding the Deleting (with old msg)', function() {
            scope.roomForm = {$setPristine:function(){}};
            scope.SQLErrors = " error msg";
            scope.MsgErrors = "success msg";
            scope.canDelete = true;
            scope.room = {roomID:"fake",parentSite:{},lstEquips:[]};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveRoom.php').respond('{"msg":"Room deleted successfully!!!", "error":""}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond('');
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond('[{"id": "1",'
                                                                                        +'"roomID":"erv324r23",'
                                                                                        +'"pointOfContact":"sgt bilbo",'
                                                                                        +'"technicalPointOfContact":"sgt bilbo",'
                                                                                        +'"roomSize":"43",'
                                                                                        +'"role":"TC",'
                                                                                        +'"parentSite":{"id":"2","name":"siteTest"}'
                                                                                        +'}]');

            controller.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(false);
            expect(scope.room).toEqual({id: "",
                                    roomID :"",
                                    pointOfContact :"",
                                    technicalPointOfContact :"",
                                    roomSize :"",
                                    role:"",
                                    parentSite:{
                                        id:"",
                                        name:""
                                    },
                                    lstEquips:[]});
            expect(scope.SQLMsgs).toEqual('Room deleted successfully!!!');
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.roomList).toEqual([{"id":"1",
                                                "roomID":"erv324r23",
                                                "pointOfContact":"sgt bilbo",
                                                "technicalPointOfContact":"sgt bilbo",
                                                "roomSize":"43",
                                                "role":"TC",
                                                "parentSite":{
                                                    "id":"2",
                                                    "name":"siteTest"
                                                }}]);
        });
        it('Testing: Generating error for Deleting', function() {
            scope.canDelete = true;
            scope.room = {roomID:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveRoom.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond('fake');
            
            controller.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.room).toEqual({roomID:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('Database error, Contact administrator. Try later'); // Principal test
            expect(scope.roomList).toEqual('fake');
        });
        it('Testing: Failling the Deleting', function() {
            scope.canDelete = true;
            scope.room = {roomID:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveRoom.php').respond(500, 'server error');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond({});
            
            controller.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.room).toEqual({roomID:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('error: 500:undefined'); // Principal test
            expect(scope.roomList).toEqual({});
        });
        
        it('Testing : openSiteList function', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond({}); // basic call from constructor
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond({});
            expect(scope.siteList).not.toBeDefined();
            
            controller.openSiteList();
            $httpBackend.flush();
            
            expect(scope.siteList).toEqual({});
        });
        
        it('Testing: Failed to remove a associated equipment', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(''); // CTR init
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond(200, '{"msg":"", "error":"Database error"}');
            
            controller.removeAssEquip(12);
            $httpBackend.flush();
            
            expect(scope.lstEquipErr).toEqual("Database error");
        });
        it('Testing: Error to remove a associated equipment', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(''); // CTR init
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond(500, '{"msg":"", "error":"error"}');
            
            controller.removeAssEquip(12);
            $httpBackend.flush();
            
            expect(scope.lstEquipErr).toEqual("error: 500:undefined");
        });
        it('Testing: Success to remove a associated equipment', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(''); // CTR init
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond(200, '{"msg":"success", "error":""}');
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('[{"test":"test"}]');
            
            controller.removeAssEquip(12);
            $httpBackend.flush();
            
            expect(scope.lstEquipErr).not.toBeDefined();
            expect(scope.room.lstEquips).toEqual([{test:"test"}]);
        });
        
        it('Testing: Failed to load Free Equips List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(''); // CTR init
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(200, '{"msg":"", "error":"Database error"}');
            
            controller.loadFreeEquipsList();
            $httpBackend.flush();
            
            expect(scope.lstFreeEquipErr).toEqual("Database error");
            expect(scope.lstFreeEquips).not.toBeDefined();
        });
        it('Testing: Error to load Free Equips List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(''); // CTR init
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(500, '{"msg":"", "error":"error"}');
            
            controller.loadFreeEquipsList();
            $httpBackend.flush();
            
            expect(scope.lstFreeEquipErr).toEqual("error: 500:undefined");
            expect(scope.lstFreeEquips).not.toBeDefined();
        });
        it('Testing: Success to load Free Equips List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(''); // CTR init
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(200, '[{"test":"test"}]');
            
            controller.loadFreeEquipsList();
            $httpBackend.flush();
            
            expect(scope.lstFreeEquipErr).not.toBeDefined();
            expect(scope.lstFreeEquips).toEqual([{test:"test"}]);
        });
        
        it('Testing: Failed to add Free Equips List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(''); // CTR init
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond(200, '{"msg":"", "error":"Database error"}');
            scope.lstFreeEquips = [43,41,3];
            
            controller.addFreeEquipsList();
            $httpBackend.flush();
            
            expect(scope.lstFreeEquipErr).toEqual("Database error");
        });
        it('Testing: Error to add Free Equips List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(''); // CTR init
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond(500, '{"msg":"", "error":"error"}');
            scope.lstFreeEquips = [43,41,3];
            
            controller.addFreeEquipsList();
            $httpBackend.flush();
            
            expect(scope.lstFreeEquipErr).toEqual("error: 500:undefined");
        });
        it('Testing: Success to add Free Equips List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(''); // CTR init
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond(200, '[{"test":"test"}]');
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('');
            scope.lstFreeEquips = [43,41,3];
            
            controller.closeFreeEquipsList = jasmine.createSpy("closeFreeEquipsList");
            controller.loadEquipsList = jasmine.createSpy("loadEquipsList");
            
            controller.addFreeEquipsList();
            $httpBackend.flush();
            
            expect(controller.closeFreeEquipsList).toHaveBeenCalled();
            expect(controller.loadEquipsList).toHaveBeenCalled();
            
            expect(scope.lstFreeEquipErr).not.toBeDefined();
        });
    });
});