describe('E2E: Room => ', function() {
    function getLastRoom() {
        element(by.id('mnRooms')).click();
        
        element.all(by.repeater('roomList')).last().click();
    };
    
    beforeAll(function() {
        browser.get('http://localhost/MESTO/MESTO_WEB_APP/#/home');
        
        element(by.id('loginButton')).click();
        
        element(by.model('logInfo.username')).clear();
        element(by.model('logInfo.username')).sendKeys('tester');
        element(by.model('logInfo.pwd')).clear();
        element(by.model('logInfo.pwd')).sendKeys('tester');
        
        element(by.id('login')).click();
        
        element(by.id('mnAdmin')).click();
        element(by.id('mnRooms')).click();
        element(by.id('btnNewRoom')).click();
    });
    
    afterAll(function() {
        element(by.id('logoutButton')).click();
    });
    
    describe('Field Validation => ', function() {
        beforeEach(function() {
            element(by.model('room.pointOfContact')).sendKeys('t'); // be sure RESET is active
            element(by.id('btnReset')).click();
        });
    
        it('Testing: Required form fields', function() {
            element(by.model('room.pointOfContact')).sendKeys('t'); // started state
            
            //Expected 'ng-pristine ng-untouched ng-invalid ng-invalid-required' to equal 'ng-dirty'.
            expect(element(by.model('room.roomID')).getAttribute("class")).toMatch("ng-invalid-required");
            expect(element(by.model('room.parentSite.name')).getAttribute("class")).toMatch("ng-invalid-required");
        });
        
        it('Testing: Validation pattern of roomSize', function() {
            var input = element(by.model('room.roomSize'));
            input.sendKeys('t');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('5-');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('5.21');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('254');

            expect(input.getAttribute("value")).toEqual('254');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
        });
    });
    
    describe('basic operation => ', function() {
        beforeEach(function() {
            element(by.model('room.pointOfContact')).sendKeys('t'); // be sure RESET is active
            element(by.id('btnReset')).click();
        });
        
        it('Testing: Associate a site and required', function() {
            element(by.id('btnLinkSite')).click();
            element.all(by.repeater('siteList')).first().click();
            
            expect(element(by.model('room.parentSite.name')).getAttribute("value")).not.toEqual('');
            expect(element(by.model('room.parentSite.name')).getAttribute("class")).toMatch("ng-valid-required");
        });

        it('Testing: State of Saving button', function() {
            var btn = element(by.id('btnSave'));
            
            expect(btn.getAttribute('disabled')).toBeTruthy();
            
            element(by.model('room.pointOfContact')).sendKeys('t');
            expect(btn.getAttribute('disabled')).toBeTruthy();
            
            element(by.model('room.roomID')).sendKeys('test');
            element(by.id('btnLinkSite')).click();
            element.all(by.repeater('siteList')).first().click();
            
            expect(btn.getAttribute('disabled')).toBeFalsy();
        });

        it('Testing: State of Reset button', function() {
            var btn = element(by.id('btnReset'));
            
            expect(btn.getAttribute('disabled')).toBeTruthy();
            
            element(by.model('room.pointOfContact')).sendKeys('t');
            expect(btn.getAttribute('disabled')).toBeFalsy();
        });
        
        it('Testing: State of Get equipement button', function() {
            expect(element(by.id('btnOpenFreeLstEquip')).isPresent()).toBeFalsy();
            
            getLastRoom();
            
            expect(element(by.id('btnOpenFreeLstEquip')).isPresent()).toBeTruthy();
        });
    });

    describe(' - Basic Database Operation => ', function() {
        it('Testing: Save a room', function() {
            element(by.model('room.pointOfContact')).sendKeys('t');
            element(by.id('btnReset')).click();
            
            element(by.model('room.roomID')).sendKeys('testE2E'); // unique & required
            element(by.model('room.pointOfContact')).sendKeys('tester');
            element(by.model('room.roomSize')).sendKeys('24');
            element(by.model('room.role')).sendKeys('T');
            element(by.id('btnLinkSite')).click();
            browser.sleep(1000);
            element.all(by.repeater('siteList')).first().click();
            
            element(by.id('btnSave')).click();
            expect(browser.getCurrentUrl()).toMatch("#/admin/rooms");
        });
        it('Testing: Save a room, already exist', function() {
            element(by.id('btnNewRoom')).click();
            
            element(by.model('room.roomID')).sendKeys('testE2E'); // unique & required
            element(by.model('room.pointOfContact')).sendKeys('tester');
            element(by.model('room.roomSize')).sendKeys('24');
            element(by.id('btnLinkSite')).click();
            browser.sleep(1000);
            element.all(by.repeater('siteList')).first().click();
            
            element(by.id('btnSave')).click();
            expect(browser.getCurrentUrl()).toMatch("#/admin/room");
            expect(element(by.binding('SQLErrors')).getText()).toEqual('Room already exists with same room ID.');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('');
        });
        /******************** need data ****************************/
        it('Testing: State of Delete button', function() {
            var btn = element(by.id('btnDelete'));
            
            expect(btn.getAttribute('disabled')).toBeTruthy();
            
            element(by.model('room.pointOfContact')).sendKeys('t');
            expect(btn.getAttribute('disabled')).toBeTruthy();
            
            getLastRoom();
            expect(btn.getAttribute('disabled')).toBeFalsy();
        });
        /***********************************************************/

        it('Testing: Update a room', function() {
            getLastRoom();
            
            element(by.model('room.pointOfContact')).sendKeys('V2');// changed
             
            element(by.id('btnSave')).click();
            expect(browser.getCurrentUrl()).toMatch("#/admin/rooms");
        });
        
        it('Testing: Associate a equipement to a Room', function() {
            getLastRoom();
            element(by.id('btnOpenFreeLstEquip')).click();
            
            element.all(by.repeater('lstFreeEquips')).get(0).element(by.model('e.adding')).click();
            element(by.id('btnAddLstEquips')).click();
            
            expect(element.all(by.repeater('lstEquips')).count()).toEqual(1);
        });
        
        it('Testing: Remove a associate equipement to a Room', function() {
            getLastRoom();
            
            element.all(by.repeater('lstEquips')).get(0).element(by.id('btnRemoveEquip')).click();
            
            expect(element.all(by.repeater('lstEquips')).count()).toEqual(0);
        });
        
        it('Testing: Delete a room', function() {
            getLastRoom();
            
            element(by.id('btnDelete')).click();
            expect(browser.getCurrentUrl()).toMatch("#/admin/rooms");
        });
    });
    
    describe(' - Advance database operation => ', function() {
        it('Testing: Update a room with a other existing unique roomID value', function() {
            element(by.id('btnNewRoom')).click();
            
            element(by.model('room.roomID')).sendKeys('testE2E_V3'); // unique & required
            element(by.model('room.pointOfContact')).sendKeys('tester_3');
            element(by.model('room.roomSize')).sendKeys('24');
            element(by.id('btnLinkSite')).click();
            browser.sleep(1000);
            element.all(by.repeater('siteList')).first().click();
            
            element(by.id('btnSave')).click();
            expect(browser.getCurrentUrl()).toMatch("#/admin/rooms");
            
            element(by.id('btnNewRoom')).click();
            
            element(by.model('room.roomID')).sendKeys('testE2E_V4'); // unique & required
            element(by.model('room.pointOfContact')).sendKeys('tester_4');
            element(by.model('room.roomSize')).sendKeys('24');
            element(by.id('btnLinkSite')).click();
            browser.sleep(1000);
            element.all(by.repeater('siteList')).first().click();
            
            element(by.id('btnSave')).click();
            expect(browser.getCurrentUrl()).toMatch("#/admin/rooms");
            
            getLastRoom();
            element(by.model('room.roomID')).clear();
            element(by.model('room.roomID')).sendKeys('testE2E_V3');
            element(by.id('btnSave')).click();
            
            expect(element(by.binding('SQLErrors')).getText()).toEqual('Update failed: Room already exists with same room ID.');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('');
            
            getLastRoom();
            element(by.id('btnDelete')).click();
            getLastRoom();
            element(by.id('btnDelete')).click();
        });

        it('Testing: Full data validation with database', function() {
            element(by.id('btnNewRoom')).click();
            
            element(by.model('room.roomID')).sendKeys('testE2E'); // unique & required
            element(by.model('room.pointOfContact')).sendKeys('tester');
            element(by.model('room.technicalPointOfContact')).sendKeys('tester technical');
            element(by.model('room.roomSize')).sendKeys('24');
            element(by.model('room.role')).sendKeys('T');
            element(by.id('btnLinkSite')).click();
            browser.sleep(1000);
            element.all(by.repeater('siteList')).first().click();// Just to be sure the info is there
            
            
            element(by.id('btnSave')).click();
            getLastRoom();
            
            expect(element(by.model('room.roomID')).getAttribute("value")).toEqual('testE2E');
            expect(element(by.model('room.pointOfContact')).getAttribute("value")).toEqual('tester');
            expect(element(by.model('room.technicalPointOfContact')).getAttribute("value")).toEqual('tester technical');
            expect(element(by.model('room.roomSize')).getAttribute("value")).toEqual('24');
            expect(element(by.model('room.role')).$('option:checked').getText()).toEqual('Telecom');
            expect(element(by.model('room.parentSite.name')).getAttribute("value")).not.toEqual('');
            
            element(by.id('btnDelete')).click();
        });

        /*
        // TODO: By default, angular don't trust html tag, but define some way to be bulletproof for XSS attack
        it('Testing: removing html and php tag', function() {
            element(by.model('room.roomID')).sendKeys('testE2E<h1>v2</h1>'); // unique & required
            element(by.model('room.pointOfContact')).sendKeys('tester<?php echo "test";?>');
            element(by.model('room.technicalPointOfContact')).sendKeys('tester t<script>alert("show me");</script>');
            element(by.model('room.roomSize')).sendKeys('24'); // have a pattern to block anything a number
            element(by.model('room.role')).sendKeys('T'); // is a selectbox.
            
            element(by.id('btnSave')).click();
            element.all(by.repeater('roomList')).last().click();
            
            expect(element(by.model('room.roomID')).getAttribute("value")).toEqual('testE2Ev2');
            expect(element(by.model('room.pointOfContact')).getAttribute("value")).toEqual('tester');
            expect(element(by.model('room.technicalPointOfContact')).getAttribute("value")).toEqual('tester t');
            expect(element(by.model('room.roomSize')).getAttribute("value")).toEqual('24');
            expect(element(by.model('room.role')).$('option:checked').getText()).toEqual('Telecom');
            
            element(by.id('btnDelete')).click();
        });*/
    });
});