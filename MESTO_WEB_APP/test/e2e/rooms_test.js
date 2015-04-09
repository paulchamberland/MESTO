describe('E2E: Room =>', function() {
    beforeEach(function() {
        browser.get('http://localhost/MESTO/MESTO_WEB_APP/rooms.html');
    });
    
    it('Testing : Web label display', function() {
        expect(browser.getTitle()).toEqual('Manage Rooms');
    });
    
    it('Testing: Required form fields', function() {
        element(by.model('room.pointOfContact')).sendKeys('t'); // started state
        
        //Expected 'ng-pristine ng-untouched ng-invalid ng-invalid-required' to equal 'ng-dirty'.
        expect(element(by.model('room.roomID')).getAttribute("class")).toMatch("ng-invalid-required");
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
    
    it('Testing: State of Saving button', function() {
        var btn = element(by.id('btnSave'));
        
        expect(btn.isEnabled()).toBeFalsy();
        
        element(by.model('room.pointOfContact')).sendKeys('t');
        expect(btn.isEnabled()).toBeFalsy();
        
        element(by.model('room.roomID')).sendKeys('test');
        
        expect(btn.isEnabled()).toBeTruthy();
    });
    
    it('Testing: State of Reset button', function() {
        var btn = element(by.id('btnReset'));
        
        expect(btn.isEnabled()).toBeFalsy();
        
        element(by.model('room.pointOfContact')).sendKeys('t');
        expect(btn.isEnabled()).toBeTruthy();
    });

    it('Testing: Save a room', function() {
        element(by.model('room.roomID')).sendKeys('testE2E'); // unique & required
        element(by.model('room.pointOfContact')).sendKeys('tester');
        element(by.model('room.roomSize')).sendKeys('24');
        element(by.model('room.role')).sendKeys('T');
        
        element(by.id('btnSave')).click();
        expect(element(by.binding('SQLErrors')).getText()).toEqual('');
        expect(element(by.binding('SQLMsgs')).getText()).toEqual('Room created successfully!!!');
    });
    it('Testing: Save a room, already exist', function() {
        element(by.model('room.roomID')).sendKeys('testE2E'); // unique & required
        element(by.model('room.pointOfContact')).sendKeys('tester');
        element(by.model('room.roomSize')).sendKeys('24');
        
        element(by.id('btnSave')).click();
        expect(element(by.binding('SQLErrors')).getText()).toEqual('Room already exists with same room ID.');
        expect(element(by.binding('SQLMsgs')).getText()).toEqual('');
    });
    /******************** need data ****************************/
    it('Testing: State of Delete button', function() {
        var btn = element(by.id('btnDelete'));
        
        expect(btn.isEnabled()).toBeFalsy();
        
        element(by.model('room.pointOfContact')).sendKeys('t');
        expect(btn.isEnabled()).toBeFalsy();
        
        element(by.repeater('roomList').row(0)).click();
        expect(btn.isEnabled()).toBeTruthy();
    });
    /***********************************************************/
    
    it('Testing: Update a room', function() {
        //var sites = element.all(by.repeater('s in siteList'));
        //var last = element(by.repeater('s in siteList').row(sites.count()-1));
        
        element(by.repeater('roomList').row(0)).click(); // TODO: need to put something more flexible
        //last.click();
        
        element(by.model('room.pointOfContact')).sendKeys('V2');// changed
         
        element(by.id('btnSave')).click();
        expect(element(by.binding('SQLErrors')).getText()).toEqual('');
        expect(element(by.binding('SQLMsgs')).getText()).toEqual('Room updated successfully!!!');
    });
    it('Testing: Delete a room', function() {
        element(by.repeater('roomList').row(0)).click(); // TODO: need to put something more flexible
        
        //expect(last).toEqual('testE2E');
        //last.click();
        
        element(by.id('btnDelete')).click();
        expect(element(by.binding('SQLErrors')).getText()).toEqual('');
        expect(element(by.binding('SQLMsgs')).getText()).toEqual('Room deleted successfully!!!');
    });
    
    it('Testing: Full data validation with database', function() {
        element(by.model('room.roomID')).sendKeys('testE2E'); // unique & required
        element(by.model('room.pointOfContact')).sendKeys('tester');
        element(by.model('room.technicalPointOfContact')).sendKeys('tester technical');
        element(by.model('room.roomSize')).sendKeys('24');
        element(by.model('room.role')).sendKeys('T');
        
        element(by.id('btnSave')).click();
        element(by.repeater('roomList').row(0)).click(); // TODO: need to put something more flexible
        
        expect(element(by.model('room.roomID')).getAttribute("value")).toEqual('testE2E');
        expect(element(by.model('room.pointOfContact')).getAttribute("value")).toEqual('tester');
        expect(element(by.model('room.technicalPointOfContact')).getAttribute("value")).toEqual('tester technical');
        expect(element(by.model('room.roomSize')).getAttribute("value")).toEqual('24');
        expect(element(by.model('room.role')).$('option:checked').getText()).toEqual('Telecom');
        
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
        element(by.repeater('roomList').row(0)).click();
        
        expect(element(by.model('room.roomID')).getAttribute("value")).toEqual('testE2Ev2');
        expect(element(by.model('room.pointOfContact')).getAttribute("value")).toEqual('tester');
        expect(element(by.model('room.technicalPointOfContact')).getAttribute("value")).toEqual('tester t');
        expect(element(by.model('room.roomSize')).getAttribute("value")).toEqual('24');
        expect(element(by.model('room.role')).$('option:checked').getText()).toEqual('Telecom');
        
        element(by.id('btnDelete')).click();
    });*/
});