describe('E2E: Equipment =>', function() {
    beforeEach(function() {
        browser.get('http://localhost/MESTO/MESTO_WEB_APP/#/admin/equip');
    });
    
    it('Testing: Required form fields', function() {
        element(by.model('equipment.model')).sendKeys('t'); // started state
        
        //Expected 'ng-pristine ng-untouched ng-invalid ng-invalid-required' to equal 'ng-dirty'.
        expect(element(by.model('equipment.serialNumber')).getAttribute("class")).toMatch("ng-invalid-required");
    });
    
    it('Testing: Associate a room', function() {
        element(by.id('btnLinkRoom')).click();
        element.all(by.repeater('roomList')).first().click();
        
        expect(element(by.model('equipment.parentRoom.roomID')).getAttribute("value")).not.toEqual('');
        expect(element(by.model('equipment.parentSite.name')).getAttribute("value")).toEqual('');
    });
    it('Testing: Associate a site', function() {
        element(by.id('btnLinkSite')).click();
        element.all(by.repeater('siteList')).first().click();
        
        expect(element(by.model('equipment.parentSite.name')).getAttribute("value")).not.toEqual('');
        expect(element(by.model('equipment.parentRoom.roomID')).getAttribute("value")).toEqual('');
    });
    it('Testing: Exclusive association for a site and for a room', function() {
        element(by.id('btnLinkSite')).click();
        element.all(by.repeater('siteList')).first().click();
        
        expect(element(by.model('equipment.parentSite.name')).getAttribute("class")).toMatch("ng-valid-double-association");
        
        element(by.id('btnLinkRoom')).click();
        element.all(by.repeater('roomList')).first().click();
        
        expect(element(by.model('equipment.parentSite.name')).getAttribute("class")).toMatch("ng-invalid-double-association");
        
        element(by.id('btnCleanSite')).click();
        expect(element(by.model('equipment.parentSite.name')).getAttribute("class")).toMatch("ng-valid-double-association");
    });
    
    it('Testing: State of Saving button', function() {
        var btn = element(by.id('btnSave'));
        
        expect(btn.isEnabled()).toBeFalsy();
        
        element(by.model('equipment.model')).sendKeys('t');
        expect(btn.isEnabled()).toBeFalsy();
        
        element(by.model('equipment.serialNumber')).sendKeys('test');
        
        expect(btn.isEnabled()).toBeTruthy();
    });
    
    it('Testing: State of Reset button', function() {
        var btn = element(by.id('btnReset'));
        
        expect(btn.isEnabled()).toBeFalsy();
        
        element(by.model('equipment.model')).sendKeys('t');
        expect(btn.isEnabled()).toBeTruthy();
    });

    it('Testing: Save an equipment', function() {
        element(by.model('equipment.serialNumber')).sendKeys('testE2E'); // unique & required
        element(by.model('equipment.barCode')).sendKeys('test');
        element(by.model('equipment.manufacturer')).sendKeys('tester');
        element(by.model('equipment.model')).sendKeys('Xw-133');
        element(by.model('equipment.configHW')).sendKeys('config 1');
        element(by.model('equipment.configSW')).sendKeys('config 2');
        element(by.model('equipment.type')).sendKeys('SRV');
        
        element(by.id('btnSave')).click();
        expect(element(by.binding('SQLErrors')).getText()).toEqual('');
        expect(element(by.binding('SQLMsgs')).getText()).toEqual('Equipment created successfully!!!');
    });
    it('Testing: Save a equipment, already exist', function() {
        element(by.model('equipment.serialNumber')).sendKeys('testE2E'); // unique & required
        element(by.model('equipment.manufacturer')).sendKeys('tester');
        element(by.model('equipment.model')).sendKeys('Xw-133');
        element(by.model('equipment.type')).sendKeys('SRV');
        
        element(by.id('btnSave')).click();
        expect(element(by.binding('SQLErrors')).getText()).toEqual('Equipment already exists with same serial number.');
        expect(element(by.binding('SQLMsgs')).getText()).toEqual('');
    });

    /******************** need data ****************************/
    it('Testing: State of Delete button', function() {
        var btn = element(by.id('btnDelete'));
        
        expect(btn.isEnabled()).toBeFalsy();
        
        element(by.model('equipment.model')).sendKeys('t');
        expect(btn.isEnabled()).toBeFalsy();
        
        element.all(by.repeater('equipmentList')).last().click();
        expect(btn.isEnabled()).toBeTruthy();
    });
    /***********************************************************/
    
    it('Testing: Update an equipment', function() {
        element.all(by.repeater('equipmentList')).last().click();
        
        element(by.model('equipment.model')).sendKeys('V2');// changed
         
        element(by.id('btnSave')).click();
        expect(element(by.binding('SQLErrors')).getText()).toEqual('');
        expect(element(by.binding('SQLMsgs')).getText()).toEqual('Equipment updated successfully!!!');
    });
    it('Testing: Delete an equipment', function() {
        element.all(by.repeater('equipmentList')).last().click();
        
        element(by.id('btnDelete')).click();
        expect(element(by.binding('SQLErrors')).getText()).toEqual('');
        expect(element(by.binding('SQLMsgs')).getText()).toEqual('Equipment deleted successfully!!!');
    });
    
    it('Testing: Full data validation with database', function() {
        element(by.model('equipment.serialNumber')).sendKeys('testE2E_V2'); // unique & required
        element(by.model('equipment.barCode')).sendKeys('test barcode');
        element(by.model('equipment.manufacturer')).sendKeys('tester');
        element(by.model('equipment.model')).sendKeys('X5');
        element(by.model('equipment.configHW')).sendKeys('config 1');
        element(by.model('equipment.configSW')).sendKeys('config 2');
        element(by.model('equipment.type')).sendKeys('SRV');
        element(by.id('btnLinkRoom')).click();
        element.all(by.repeater('roomList')).first().click();
        
        element(by.id('btnSave')).click();
        element.all(by.repeater('equipmentList')).last().click();
        
        expect(element(by.model('equipment.serialNumber')).getAttribute("value")).toEqual('testE2E_V2');
        expect(element(by.model('equipment.barCode')).getAttribute("value")).toEqual('test barcode');
        expect(element(by.model('equipment.manufacturer')).getAttribute("value")).toEqual('tester');
        expect(element(by.model('equipment.model')).getAttribute("value")).toEqual('X5');
        expect(element(by.model('equipment.configHW')).getAttribute("value")).toEqual('config 1');
        expect(element(by.model('equipment.configSW')).getAttribute("value")).toEqual('config 2');
        expect(element(by.model('equipment.type')).$('option:checked').getText()).toEqual('Server');
        expect(element(by.model('equipment.parentRoom.roomID')).getAttribute("value")).not.toEqual('');
                
        element(by.id('btnDelete')).click();
    });
});