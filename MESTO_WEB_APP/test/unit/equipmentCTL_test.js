describe('Testing the controller of equipment object', function() {
    beforeEach(module('MESTO'));
    var controller, scope, securitySrv, enumManagerSrv;

    beforeEach(inject(function(_$controller_, $rootScope, _securitySrv_, _enumManagerSrv_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        scope = $rootScope;//.$new();
        controller = _$controller_('equipmentCTL', { $scope: scope });
        securitySrv = _securitySrv_;
        enumManagerSrv = _enumManagerSrv_;
        
        $ = function() {return {
                    fadeOut : function() {},
                    fadeIn : function() {}
                };
            };
        /*$ = function() {this.e; return this.e = {
                    fadeOut : function() {},
                    fadeIn : function() {}
                };
            };*/ // mock JQuery 
            
        //jasmine.createSpyObj('$'
        
        //securitySrv.isAuthorized = function(p) {return false;};
    }));
    
    it('Testing: creation object', function() {
        expect(scope.canDelete).toBeFalsy();
        expect(scope.isRoomListOpened).toBeFalsy();
        expect(scope.isSiteListOpened).toBeFalsy();
        
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
                            roomID:"",
                            role:"",
                            siteName:""
                        },
                        parentSite:{
                            id:"",
                            name:"",
                            role:""
                        }};
        
        expect(scope.equipment).toEqual(equipment);
        
        expect(controller.emptyEquipment).toEqual(equipment);
        
        
        expect(scope.isAutorizeUpdatingEquip).toBeFalsy();
        expect(scope.isAutorizeCreatingEquip).toBeFalsy();
        expect(scope.isAutorizeDeletingEquip).toBeFalsy();
        expect(scope.isAutorizeSeeDetailsEquip).toBeFalsy();
        expect(scope.canSave).toBeFalsy();
    });
    
    it('Testing: Get the label from TYPE value', function() {
        expect(controller.getLabelTYPE('RT')).toEqual("Router");
        expect(controller.getLabelTYPE('HUB')).toEqual("Hub");
        expect(controller.getLabelTYPE('SRV')).toEqual("Server");
        expect(controller.getLabelTYPE('SWT')).toEqual("Switch");
    });
    
    it('Testing: Open Equipement', function() {
        var equip = {id: "1",
                    serialNumber :"432-43453454-4ref4",
                    barCode :"code",
                    manufacturer :"avenger",
                    model :"XW-5",
                    type:"HUB"};
        
        //spyOn($, '().fadeIn'); // TODO: make a spy of a function without or sub object function
        controller.openEquipment(equip); // security ON
        
        expect(scope.equipment).toEqual(controller.emptyEquipment);
        //expect($().fadeIn).toHaveBeenCalled();// TODO: make a spy on jquery without or sub object function
        
        scope.isAutorizeSeeDetailsEquip = true;
        controller.openEquipment(equip); // security OFF
        
        expect(scope.equipment).toEqual(equip);
    });
    
    describe('Dependancy to navigateSrv', function() {
        var location, navigateSrv;
        
        beforeEach(inject(function(_navigateSrv_, _$location_) {
            navigateSrv = _navigateSrv_;
            location = _$location_;
        }));
        it('Testing: NavigateToEquipement function', function() {
            var equip = {id: "1",
                            serialNumber :"432-43453454-4ref4",
                            barCode :"code",
                            manufacturer :"avenger",
                            model :"XW-5",
                            type:"HUB"};
            
            spyOn(location, 'path');
            controller.navigateToEquipment(equip); // Security ON
            
            expect(location.path).not.toHaveBeenCalled();
            expect(navigateSrv.getEquip()).toBeNull();
            
            scope.isAutorizeUpdatingEquip = true;
            controller.navigateToEquipment(equip); // Security OFF
            
            expect(location.path).toHaveBeenCalledWith('/admin/equip');
            expect(navigateSrv.getEquip()).toEqual(equip);
        });
        
        it('Testing: Add a new object Equipement', function() {
            spyOn(location, 'path');
            
            controller.newEquip();
            
            expect(location.path).toHaveBeenCalledWith('/admin/equip');
        });
    });

    it('Testing: Load of an equipment', function() {
        //scope.equipmentForm = {$setPristine : function(){}};
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
                    
        controller.loadEquipment(fakeEquipment);
        
        expect(scope.equipment).toEqual(fakeEquipment);
        expect(scope.canDelete).toBe(true);
        expect(scope.SQLMsgs).not.toBeDefined();
        expect(scope.SQLErrors).not.toBeDefined();
    });
    
    it('Testing: Reset form', function() {
        scope.equipmentForm = {$setPristine : function(){}};
        controller.loadEquipment({id: "1",
                            serialNumber :"432-43453454-4ref4",
                            barCode :"code",
                            manufacturer :"avenger",
                            model :"XW-5",
                            configHW :"some config",
                            configSW :"some config",
                            type:"HUB"});
        
        controller.resetFrm();
        
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
                                            roomID:"",
                                            role:"",
                                            siteName:""
                                        },
                                        parentSite:{
                                            id:"",
                                            name:"",
                                            role:""
                                        }});
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
    
    it('Testing: associateRoom function', function() {
        var testDirty = false;
        scope.equipmentForm = {parentRoomName:{$setDirty : function(){testDirty=true;}}};
        scope.isRoomListOpened = true;
        controller.associateRoom({id:'3',roomID:"test"});
        
        expect(scope.equipment.parentRoom.id).toBe('3');
        expect(scope.equipment.parentRoom.roomID).toEqual("test");
        expect(scope.isRoomListOpened).toBeFalsy();
        expect(testDirty).toBeTruthy();
        
        testDirty = false;
        controller.associateRoom({id:'3',roomID:"test"});
        expect(testDirty).toBeFalsy();
    });
    
    it('Testing: closeRoomList function', function() {
        expect(scope.isRoomListOpened).toBeFalsy();
        
        scope.isRoomListOpened = true;
        controller.closeRoomList();
        
        expect(scope.isRoomListOpened).toBeFalsy();
    });
    it('Testing: closeSiteList function', function() {
        expect(scope.isSiteListOpened).toBeFalsy();
        
        scope.isSiteListOpened = true;
        controller.closeSiteList();
        
        expect(scope.isSiteListOpened).toBeFalsy();
    });
    
    it('Testing: associateSite function', function() {
        var testDirty = false;
        scope.equipmentForm = {parentSiteName:{$setDirty : function(){testDirty=true;}}};
        scope.isSiteListOpened = true;
        
        controller.associateSite({id:'3',siteName:"test"}); // test
        
        expect(scope.equipment.parentSite.id).toBe('3');
        expect(scope.equipment.parentSite.name).toEqual("test");
        expect(scope.isSiteListOpened).toBeFalsy();
        expect(testDirty).toBeTruthy();
        
        testDirty = false;
        controller.associateSite({id:'3',siteName:"test"});
        expect(testDirty).toBeFalsy();
    });
    
    it('Testing: cleanAssociateRoom function', function() {
        spyOn(controller, "validDoubleAssociation");
        scope.equipment.parentRoom = {id:"21", roomID:"test", role:"", siteName:""};
        scope.equipmentForm = {parentRoomName:{$setDirty : function(){testDirty=true;}}};
        
        controller.cleanAssociateRoom();
        expect(scope.equipment.parentRoom).toEqual({id:"", roomID:"",role:"", siteName:""});
        expect(controller.validDoubleAssociation).toHaveBeenCalled();
    });
    
    it('Testing: cleanAssociateSite function', function() {
        spyOn(controller, "validDoubleAssociation");
        scope.equipment.parentSite = {id:"21", name:"test", role:""};
        scope.equipmentForm = {parentSiteName:{$setDirty : function(){testDirty=true;}}};
        
        controller.cleanAssociateSite();
        expect(scope.equipment.parentSite).toEqual({id:"", name:"", role:""});
        expect(controller.validDoubleAssociation).toHaveBeenCalled();
    });
    
    it('Testing : openRoomList function', function() {
        expect(scope.isRoomListOpened).toBeFalsy();
        expect(scope.isSiteListOpened).toBeFalsy();
        
        spyOn(controller, 'loadRoomList');
        
        controller.openRoomList();
        
        expect(scope.isRoomListOpened).toBeTruthy();
        expect(scope.isSiteListOpened).toBeFalsy();
        expect(controller.loadRoomList).toHaveBeenCalled();
        // TODO test call JQuery
    });
    it('Testing : openSiteList function', function() {
        expect(scope.isRoomListOpened).toBeFalsy();
        expect(scope.isSiteListOpened).toBeFalsy();
        
        spyOn(controller, 'loadSiteList');
        
        controller.openSiteList();
        
        expect(scope.isRoomListOpened).toBeFalsy();
        expect(scope.isSiteListOpened).toBeTruthy();
        expect(controller.loadSiteList).toHaveBeenCalled();
        // TODO test call JQuery
    });
    
    describe('Testing Ajax call from Equipment object', function() {
        var location, streamSrv;
        
        beforeEach(inject(function(_$httpBackend_, _$location_, _streamSrv_) {
            $httpBackend = _$httpBackend_;
            location = _$location_;
            streamSrv = _streamSrv_;
        }));
 
        it('Testing: Refresh equipments list with success', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(''); // CTL INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(200, '[{"id": "1",'
                                                                                            +'"serialNumber":"432-43453454-4ref4",'
                                                                                            +'"barCode":"code",'
                                                                                            +'"manufacturer":"avenger",'
                                                                                            +'"model":"XW-5",'
                                                                                            +'"configHW":"some config",'
                                                                                            +'"configSW":"some config",'
                                                                                            +'"type":"HUB"}]');

            controller.refreshList(); // <--- TEST

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
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('lst'); // CTL INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            
            controller.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.equipmentList).toEqual('lst');
            expect(scope.lstError).toEqual('Database error, Contact administrator. Try later'); // Principal test
        });
        it('Testing: Refresh equipements list and failed...', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('lst'); // CTL INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(500, 'server error');

            controller.refreshList(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.equipmentList).toEqual('lst');
            expect(scope.lstError).toEqual('error: 500:undefined'); // Principal test
        });
 
        it('Testing: Skipping the Saving', function() {
            scope.equipmentForm = {$dirty:false, $valid:false};
            scope.canDelete = true;
            scope.equipment = {serialNumber:"fake"};
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond([{}]);

            controller.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.equipment).toEqual({serialNumber :"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.equipmentList).toEqual([{}]);
        });
        it('Testing: Succeeding the Saving (with old msg)', function() {
            scope.equipmentForm = {$setPristine:function(){}, $dirty:true, $valid:true};
            scope.SQLErrors = " error msg";
            scope.MsgErrors = "success msg";
            scope.canDelete = true;
            scope.equipment = {id: "",
                                serialNumber:"fake",
                                parentRoom:{
                                    id:"",
                                    roomID:"",
                                    role:"",
                                    siteName:""
                                },
                                parentSite:{
                                    id:"",
                                    name:"",
                                    role:""
                                }};
            
            spyOn(location, 'path');  
            spyOn(streamSrv, 'saveActivity');  
            spyOn(enumManagerSrv, 'getRoomLabelROLE');  
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond('{"msg":"Equipment created successfully!!!", "error":""}');

            controller.save(); // <--- TEST

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
                                            roomID:"",
                                            role:"",
                                            siteName:""
                                        },
                                        parentSite:{
                                            id:"",
                                            name:"",
                                            role:""
                                        }});
                                        
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.equipmentList).toEqual('');
                     
            expect(location.path).toHaveBeenCalledWith("/admin/equipments");
            expect(streamSrv.saveActivity).toHaveBeenCalled();
            expect(streamSrv.saveActivity.calls.mostRecent().args[1]).toBeFalsy();
            expect(enumManagerSrv.getRoomLabelROLE).toHaveBeenCalled();
        });
        it('Testing: Succeeding the Saving and change de path of Logger', function() {
            scope.equipmentForm = {$setPristine:function(){}, $dirty:true, $valid:true};
            scope.SQLErrors = " error msg";
            scope.MsgErrors = "success msg";
            scope.canDelete = true;
            scope.equipment = {id:"1",
                                serialNumber:"fake",
                                parentRoom:{
                                    id:"",
                                    roomID:"",
                                    role:"",
                                    siteName:""
                                },
                                parentSite:{
                                    id:"1",
                                    name:"test",
                                    role:"TS"
                                }};
            
            spyOn(location, 'path');  
            spyOn(streamSrv, 'saveActivity');  
            spyOn(enumManagerSrv, 'getSiteLabelROLE');  
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond('{"msg":"Equipment created successfully!!!", "error":""}');

            controller.save(); // <--- TEST

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
                                            roomID:"",
                                            role:"",
                                            siteName:""
                                        },
                                        parentSite:{
                                            id:"",
                                            name:"",
                                            role:""
                                        }});
                                        
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.equipmentList).toEqual('');
                     
            expect(location.path).toHaveBeenCalledWith("/admin/equipments");
            expect(streamSrv.saveActivity).toHaveBeenCalled();
            expect(enumManagerSrv.getSiteLabelROLE).toHaveBeenCalled();
        });
        it('Testing: Generated error for Saving', function() {
            scope.equipmentForm = {$dirty:true, $valid:true};
            scope.canDelete = true;
            scope.equipment = {serialNumber:"fake",
                                parentRoom:{
                                    id:"12",
                                    roomID:"test", 
                                    siteName:"toto"
                                },
                                parentSite:{
                                    id:"",
                                    name:""
                                }};
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond({});
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond('{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            
            controller.save(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.equipment).toEqual({serialNumber:"fake",
                                                parentRoom:{
                                                    id:"12",
                                                    roomID:"test", 
                                                    siteName:"toto"
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
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond({});
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond(500, 'server error');
            
            controller.save(); // <--- TEST

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

        
        it('Testing: Succeeding the Deleting (with old Msg)', function() {
            scope.equipmentForm = {$setPristine:function(){}};
            scope.SQLErrors = " error msg";
            scope.MsgErrors = "success msg";
            scope.canDelete = true;
            scope.equipment = {serialNumber:"fake",
                                    parentRoom:{
                                        id:"",
                                        roomID:"",
                                        role:"",
                                        siteName:""
                                    },
                                    parentSite:{
                                        id:"",
                                        name:"",
                                        role:""
                                    }};
            
            spyOn(location, 'path');
            spyOn(streamSrv, 'saveActivity');
            spyOn(enumManagerSrv, 'getRoomLabelROLE');
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond('{"msg":"Equipment deleted successfully!!!", "error":""}');

            controller.delete(); // <--- TEST

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
                                            roomID:"",
                                            role:"",
                                            siteName:""
                                        },
                                        parentSite:{
                                            id:"",
                                            name:"",
                                            role:""
                                        }});
            
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.equipmentList).toEqual('');
                                                
            expect(location.path).toHaveBeenCalledWith("/admin/equipments");
            expect(streamSrv.saveActivity).toHaveBeenCalled();
            expect(streamSrv.saveActivity.calls.mostRecent().args[1]).toBeFalsy();
            expect(enumManagerSrv.getRoomLabelROLE).toHaveBeenCalled();
        });
        it('Testing: Succeeding the Deleting and change de path of Logger', function() {
            scope.equipmentForm = {$setPristine:function(){}};
            scope.SQLErrors = " error msg";
            scope.MsgErrors = "success msg";
            scope.canDelete = true;
            scope.equipment = {serialNumber:"fake",
                                    parentRoom:{
                                        id:"",
                                        roomID:"",
                                        role:"",
                                        siteName:""
                                    },
                                    parentSite:{
                                        id:"1",
                                        name:"test",
                                        role:"TE"
                                    }};
            
            spyOn(location, 'path');
            spyOn(streamSrv, 'saveActivity');
            spyOn(enumManagerSrv, 'getSiteLabelROLE');
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond('{"msg":"Equipment deleted successfully!!!", "error":""}');

            controller.delete(); // <--- TEST

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
                                            roomID:"",
                                            role:"",
                                            siteName:""
                                        },
                                        parentSite:{
                                            id:"",
                                            name:"",
                                            role:""
                                        }});
            
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).not.toBeDefined();
            expect(scope.equipmentList).toEqual('');
                                                
            expect(location.path).toHaveBeenCalledWith("/admin/equipments");
            expect(streamSrv.saveActivity).toHaveBeenCalled();
            expect(enumManagerSrv.getSiteLabelROLE).toHaveBeenCalled();
        });
        it('Testing: Generating error for Deleting', function() {
            scope.canDelete = true;
            scope.equipment = {serialNumber:"fake"};
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond('fake');
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond(200, '{"msg":"", "error":"Database error, Contact administrator. Try later"}');
            
            controller.delete(); // <--- TEST

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
            
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond({});
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/saveEquipment.php').respond(500, 'server error');
            
            controller.delete(); // <--- TEST

            $httpBackend.flush();
            
            expect(scope.canDelete).toBe(true);
            expect(scope.equipment).toEqual({serialNumber:"fake"});
            expect(scope.SQLMsgs).not.toBeDefined();
            expect(scope.SQLErrors).toEqual('error: 500:undefined'); // Principal test
            expect(scope.equipmentList).toEqual({});
        });
        
        it('Testing: Failed to load Rooms List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(200, '{"msg":"", "error":"Database error"}');
            
            controller.loadRoomList();
            $httpBackend.flush();
            
            expect(scope.lstRmErr).toEqual("Database error");
            expect(scope.roomList).not.toBeDefined();
        });
        it('Testing: Error to load Rooms List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(500, '{"msg":"", "error":"error"}');
            
            controller.loadRoomList();
            $httpBackend.flush();
            
            expect(scope.lstRmErr).toEqual("error: 500:undefined");
            expect(scope.roomList).not.toBeDefined();
        });
        it('Testing: Success to load Rooms List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAORoom.php').respond(200, '[{"test":"test"}]');
            
            controller.loadRoomList();
            $httpBackend.flush();
            
            expect(scope.lstRmErr).not.toBeDefined();
            expect(scope.roomList).toEqual([{test:"test"}]);
        });
        
        it('Testing: Failed to load Sites List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(200, '{"msg":"", "error":"Database error"}');
            
            controller.loadSiteList();
            $httpBackend.flush();
            
            expect(scope.lstStErr).toEqual("Database error");
            expect(scope.siteList).not.toBeDefined();
        });
        it('Testing: Error to load Sites List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(500, '{"msg":"", "error":"error"}');
            
            controller.loadSiteList();
            $httpBackend.flush();
            
            expect(scope.lstStErr).toEqual("error: 500:undefined");
            expect(scope.siteList).not.toBeDefined();
        });
        it('Testing: Success to load Sites List', function() {
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/loggedUser.php').respond(''); // APP INIT
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOEquipment.php').respond(''); // CTR init
            $httpBackend.expectPOST('/MESTO/MESTO_WEB_APP/php/DAOSite.php').respond(200, '[{"test":"test"}]');
            
            controller.loadSiteList();
            $httpBackend.flush();
            
            expect(scope.lstStErr).not.toBeDefined();
            expect(scope.siteList).toEqual([{test:"test"}]);
        });
    });
});