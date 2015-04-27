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

    it('Testing: Load of a room', function() {
        scope.roomForm = {$setPristine : function(){}};
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
                    
        scope.loadRoom(fakeRoom);
        
        expect(scope.room).toEqual(fakeRoom);
        expect(scope.canDelete).toBe(true);
        expect(scope.SQLMsgs).not.toBeDefined();
        expect(scope.SQLErrors).not.toBeDefined();
    });
    
    it('Testing: Reset form', function() {
        scope.roomForm = {$setPristine : function(){}};
        scope.loadRoom({id: "1",
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
        
        scope.resetFrm();
        
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
        scope.resetMsg(); // Test when already not define
        
        expect(scope.SQLMsgs).not.toBeDefined();
        expect(scope.SQLErrors).not.toBeDefined();
        
        scope.SQLMsgs = "Good message";
        scope.SQLErrors = "bad message";
        scope.resetMsg(); // test when define
        
        expect(scope.SQLMsgs).not.toBeDefined();
        expect(scope.SQLErrors).not.toBeDefined();
    });
 
    it('Testing: associateSite function', function() {
        var testDirty = false;
        scope.roomForm = {parentSiteName:{$setDirty : function(){testDirty=true;}}};
        
        scope.associateSite({id:'3',siteName:"test"}); // test
        
        expect(scope.room.parentSite.id).toBe('3');
        expect(scope.room.parentSite.name).toEqual("test");
        expect(testDirty).toBeTruthy();
        
        testDirty = false;
        scope.associateSite({id:'3',siteName:"test"});
        expect(testDirty).toBeFalsy();
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

            scope.refreshList(); // <--- TEST

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
            
            scope.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.roomList).not.toBeDefined();
            expect(scope.lstError).toEqual('Database error, Contact administrator. Try later'); // Principal test
        });
        it('Testing: Refresh rooms list and failed...', function() {
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(500, 'server error');

            scope.refreshList(); // <--- TEST

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

            scope.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.room).toEqual({roomID :"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.roomList).toEqual([{}]);
        });
        it('Testing: Succeeding the Saving', function() {
            scope.roomForm = {$setPristine:function(){}, $dirty:true, $valid:true};
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

            scope.save(); // <--- TEST

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
            
            scope.save(); // <--- TEST

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
            
            scope.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.room).toEqual({roomID:"fake",parentSite:{id:"3"}});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('error: 500:undefined'); // Principal test
            expect(scope.roomList).toEqual({});
        });

        it('Testing: Load sub list of Equipements', function() {
            scope.roomForm = {$setPristine : function(){}};
            
            var pRoom = {id: "1",
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
                        
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond('');
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('[{"test":"test"}]');
                        
            scope.loadRoom(pRoom);
            $httpBackend.flush();
            
            expect(scope.room.lstEquips).toEqual([{test:"test"}]);
        });
        
        it('Testing: Succeeding the Deleting', function() {
            scope.roomForm = {$setPristine:function(){}};
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

            scope.delete(); // <--- TEST

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
            
            scope.delete(); // <--- TEST

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
            
            scope.delete(); // <--- TEST

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
            
            scope.openSiteList();
            $httpBackend.flush();
            
            expect(scope.siteList).toEqual({});
        });
    });
});