describe('Testing the controller of equipment object', function() {
    beforeEach(module('MESTO'));
    var controller, scope;

    beforeEach(inject(function(_$controller_, $rootScope){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        scope = $rootScope;//.$new();
        controller = _$controller_('equipmentCTL', { $scope: scope });
    }));
    
    it('Testing: creation object', function() {
        expect(scope.canDelete).toBe(false);
        
        var equipment = {id: "",
                        serialNumber :"",
                        barCode :"",
                        manufacturer :"",
                        model :"",
                        configHW :"",
                        configSW :"",
                        type:"",
                        parentRoom:{
                            id:"",
                            roomID:""
                        },
                        parentSite:{
                            id:"",
                            name:""
                        }};
        
        expect(scope.equipment).toEqual(equipment);
        
        expect(controller.emptyEquipment).toEqual(equipment);
    });

    it('Testing: Load of an equipment', function() {
        scope.equipmentForm = {$setPristine : function(){}};
        scope.SQLMsgs = "Good message";
        scope.SQLErrors = "bad message";
        
        var fakeEquipment = {id: "1",
                            serialNumber :"432-43453454-4ref4",
                            barCode :"code",
                            manufacturer :"avenger",
                            model :"XW-5",
                            configHW :"some config",
                            configSW :"some config",
                            type:"HUB"};
                    
        scope.loadEquipment(fakeEquipment);
        
        expect(scope.equipment).toEqual(fakeEquipment);
        expect(scope.canDelete).toBe(true);
        expect(scope.SQLMsgs).not.toBeDefined();
        expect(scope.SQLErrors).not.toBeDefined();
    });
    
    it('Testing: Reset form', function() {
        scope.equipmentForm = {$setPristine : function(){}};
        scope.loadEquipment({id: "1",
                            serialNumber :"432-43453454-4ref4",
                            barCode :"code",
                            manufacturer :"avenger",
                            model :"XW-5",
                            configHW :"some config",
                            configSW :"some config",
                            type:"HUB"});
        
        scope.resetFrm();
        
        expect(scope.canDelete).toBe(false);
        expect(scope.equipment).toEqual({id: "",
                                        serialNumber :"",
                                        barCode :"",
                                        manufacturer :"",
                                        model :"",
                                        configHW :"",
                                        configSW :"",
                                        type:"",
                                        parentRoom:{
                                            id:"",
                                            roomID:""
                                        },
                                        parentSite:{
                                            id:"",
                                            name:""
                                        }});
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
    
    it('Testing: associateRoom function', function() {
        var testDirty = false;
        scope.equipmentForm = {parentRoomName:{$setDirty : function(){testDirty=true;}}};
        scope.isRoomListOpened = true;
        scope.associateRoom({id:'3',roomID:"test"});
        
        expect(scope.equipment.parentRoom.id).toBe('3');
        expect(scope.equipment.parentRoom.roomID).toEqual("test");
        expect(scope.isRoomListOpened).toBeFalsy();
        expect(testDirty).toBeTruthy();
        
        testDirty = false;
        scope.associateRoom({id:'3',roomID:"test"});
        expect(testDirty).toBeFalsy();
    });
    
    it('Testing: closeRoomList function', function() {
        expect(scope.isRoomListOpened).toBeFalsy();
        
        scope.isRoomListOpened = true;
        scope.closeRoomList();
        
        expect(scope.isRoomListOpened).toBeFalsy();
    });
    it('Testing: closeSiteList function', function() {
        expect(scope.isSiteListOpened).toBeFalsy();
        
        scope.isSiteListOpened = true;
        scope.closeSiteList();
        
        expect(scope.isSiteListOpened).toBeFalsy();
    });
    
    it('Testing: associateSite function', function() {
        var testDirty = false;
        scope.equipmentForm = {parentSiteName:{$setDirty : function(){testDirty=true;}}};
        scope.isSiteListOpened = true;
        scope.associateSite({id:'3',siteName:"test"});
        
        expect(scope.equipment.parentSite.id).toBe('3');
        expect(scope.equipment.parentSite.name).toEqual("test");
        expect(scope.isSiteListOpened).toBeFalsy();
        expect(testDirty).toBeTruthy();
        
        testDirty = false;
        scope.associateSite({id:'3',siteName:"test"});
        expect(testDirty).toBeFalsy();
    });
    
    it('Testing: cleanAssociateRoom function', function() {
        scope.validDoubleAssociation = function() {};
        scope.equipment.parentRoom = {id:"21", roomID:"test"};
        scope.cleanAssociateRoom();
        expect(scope.equipment.parentRoom).toEqual({id:"", roomID:""});
    });
    
    it('Testing: cleanAssociateSite function', function() {
        scope.validDoubleAssociation = function() {};
        scope.equipment.parentSite = {id:"21", name:"test"};
        scope.cleanAssociateSite();
        expect(scope.equipment.parentSite).toEqual({id:"", name:""});
    });
    
    describe('Testing Ajax call from Equipment object', function() {
        beforeEach(inject(function(_$httpBackend_) {
            $httpBackend = _$httpBackend_;
        }));
 
        it('Testing: Refresh equipments list with success', function() {
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(200, '[{"id": "1",'
                                                                                            +'"serialNumber":"432-43453454-4ref4",'
                                                                                            +'"barCode":"code",'
                                                                                            +'"manufacturer":"avenger",'
                                                                                            +'"model":"XW-5",'
                                                                                            +'"configHW":"some config",'
                                                                                            +'"configSW":"some config",'
                                                                                            +'"type":"HUB"}]');

            scope.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.lstError).not.toBeDefined();
            expect(scope.equipmentList).toEqual([{"id":"1",
                                                "serialNumber":"432-43453454-4ref4",
                                                "barCode":"code",
                                                "manufacturer":"avenger",
                                                "model":"XW-5",
                                                "configHW":"some config",
                                                "configSW":"some config",
                                                "type":"HUB"}]);
        });
        it('Testing: Generated error for Refresh', function() {
            scope.canDelete = true;
            scope.equipment = {serialNumber:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            
            scope.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.equipmentList).not.toBeDefined();
            expect(scope.lstError).toEqual('Database error, Contact administrator. Try later'); // Principal test
        });
        it('Testing: Refresh equipements list and failed...', function() {
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(500, 'server error');

            scope.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.equipmentList).not.toBeDefined();
            expect(scope.lstError).toEqual('error: 500:undefined'); // Principal test
        });
 
        it('Testing: Skipping the Saving', function() {
            scope.equipmentForm = {$dirty:false, $valid:false};
            scope.canDelete = true;
            scope.equipment = {serialNumber:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond('{"msg":"Equipment created successfully!!!", "error":""}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond([{}]);
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('[{"id": "1",'
                                                                                        +'"serialNumber":"432-43453454-4ref4",'
                                                                                        +'"barCode":"code",'
                                                                                        +'"manufacturer":"avenger",'
                                                                                        +'"model":"XW-5",'
                                                                                        +'"configHW":"some config",'
                                                                                        +'"configSW":"some config",'
                                                                                        +'"type":"HUB"}]');

            scope.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.equipment).toEqual({serialNumber :"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.equipmentList).toEqual([{}]);
        });
        it('Testing: Succeeding the Saving', function() {
            scope.equipmentForm = {$setPristine:function(){}, $dirty:true, $valid:true};
            scope.canDelete = true;
            scope.equipment = {roomID:"fake",
                                parentRoom:{
                                    id:"",
                                    roomID:""
                                },
                                parentSite:{
                                    id:"",
                                    name:""
                                }};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond('{"msg":"Equipment created successfully!!!", "error":""}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('');
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('[{"id": "1",'
                                                                                        +'"serialNumber":"432-43453454-4ref4",'
                                                                                        +'"barCode":"code",'
                                                                                        +'"manufacturer":"avenger",'
                                                                                        +'"model":"XW-5",'
                                                                                        +'"configHW":"some config",'
                                                                                        +'"configSW":"some config",'
                                                                                        +'"type":"HUB"}]');

            scope.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(false);
            expect(scope.equipment).toEqual({id: "",
                                        serialNumber :"",
                                        barCode :"",
                                        manufacturer :"",
                                        model :"",
                                        configHW :"",
                                        configSW :"",
                                        type:"",
                                        parentRoom:{
                                            id:"",
                                            roomID:""
                                        },
                                        parentSite:{
                                            id:"",
                                            name:""
                                        }});
            expect(scope.SQLMsgs).toEqual('Equipment created successfully!!!');
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.equipmentList).toEqual([{"id":"1",
                                                "serialNumber":"432-43453454-4ref4",
                                                "barCode":"code",
                                                "manufacturer":"avenger",
                                                "model":"XW-5",
                                                "configHW":"some config",
                                                "configSW":"some config",
                                                "type":"HUB"}]);
        });
        it('Testing: Generated error for Saving', function() {
            scope.equipmentForm = {$dirty:true, $valid:true};
            scope.canDelete = true;
            scope.equipment = {serialNumber:"fake",
                                parentRoom:{
                                    id:"12",
                                    roomID:"test"
                                },
                                parentSite:{
                                    id:"",
                                    name:""
                                }};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond({});
            
            scope.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.equipment).toEqual({serialNumber:"fake",
                                                parentRoom:{
                                                    id:"12",
                                                    roomID:"test"
                                                },
                                                parentSite:{
                                                    id:"",
                                                    name:""
                                                }});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('Database error, Contact administrator. Try later'); // Principal test
            expect(scope.equipmentList).toEqual({});
        });
        it('Testing: Failing the Saving', function() {
            scope.equipmentForm = {$dirty:true, $valid:true};
            scope.canDelete = true;
            scope.equipment = {serialNumber:"fake",
                                parentRoom:{
                                    id:"12",
                                    roomID:"test"
                                },
                                parentSite:{
                                    id:"",
                                    name:""
                                }};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond(500, 'server error');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond({});
            
            scope.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.equipment).toEqual({serialNumber:"fake",
                                                parentRoom:{
                                                    id:"12",
                                                    roomID:"test"
                                                },
                                                parentSite:{
                                                    id:"",
                                                    name:""
                                                }});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('error: 500:undefined'); // Principal test
            expect(scope.equipmentList).toEqual({});
        });

        
        it('Testing: Succeeding the Deleting', function() {
            scope.equipmentForm = {$setPristine:function(){}};
            scope.canDelete = true;
            scope.equipment = {serialNumber:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond('{"msg":"Equipment deleted successfully!!!", "error":""}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('');
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('[{"id": "1",'
                                                                                        +'"serialNumber":"432-43453454-4ref4",'
                                                                                        +'"barCode":"code",'
                                                                                        +'"manufacturer":"avenger",'
                                                                                        +'"model":"XW-5",'
                                                                                        +'"configHW":"some config",'
                                                                                        +'"configSW":"some config",'
                                                                                        +'"type":"HUB"}]');

            scope.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(false);
            expect(scope.equipment).toEqual({id: "",
                                        serialNumber :"",
                                        barCode :"",
                                        manufacturer :"",
                                        model :"",
                                        configHW :"",
                                        configSW :"",
                                        type:"",
                                        parentRoom:{
                                            id:"",
                                            roomID:""
                                        },
                                        parentSite:{
                                            id:"",
                                            name:""
                                        }});
            expect(scope.SQLMsgs).toEqual('Equipment deleted successfully!!!');
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.equipmentList).toEqual([{"id":"1",
                                                "serialNumber":"432-43453454-4ref4",
                                                "barCode":"code",
                                                "manufacturer":"avenger",
                                                "model":"XW-5",
                                                "configHW":"some config",
                                                "configSW":"some config",
                                                "type":"HUB"}]);
        });
        it('Testing: Generating error for Deleting', function() {
            scope.canDelete = true;
            scope.equipment = {serialNumber:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('fake');
            
            scope.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.equipment).toEqual({serialNumber:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('Database error, Contact administrator. Try later'); // Principal test
            expect(scope.equipmentList).toEqual('fake');
        });
        it('Testing: Failling the Deleting', function() {
            scope.canDelete = true;
            scope.equipment = {serialNumber:"fake"};
            
            $httpBackend.whenPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond(500, 'server error');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond({});
            
            scope.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.equipment).toEqual({serialNumber:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('error: 500:undefined'); // Principal test
            expect(scope.equipmentList).toEqual({});
        });
        
        it('Testing : openSiteList function', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond({}); // basic call from constructor
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond({});
            expect(scope.siteList).not.toBeDefined();
            
            scope.openSiteList();
            $httpBackend.flush();
            
            expect(scope.isSiteListOpened).toBe(true);
            expect(scope.siteList).toEqual({});
        });
        it('Testing : openRoomList function', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond({}); // basic call from constructor
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond({});
            expect(scope.roomList).not.toBeDefined();
            
            scope.openRoomList();
            $httpBackend.flush();
            
            expect(scope.isRoomListOpened).toBe(true);
            expect(scope.roomList).toEqual({});
        });
    });
});