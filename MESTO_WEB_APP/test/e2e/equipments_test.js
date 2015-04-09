describe('E2E: Equipment =>', function() {
    beforeEach(function() {
        browser.get('http://localhost/MESTO/MESTO_WEB_APP/equipments.html');
    });
    
    it('Testing : Web label display', function() {
        expect(browser.getTitle()).toEqual('Manage Equipments');
    });
    
    it('Testing: Required form fields', function() {
        element(by.model('equipment.model')).sendKeys('t'); // started state
        
        //Expected 'ng-pristine ng-untouched ng-invalid ng-invalid-required' to equal 'ng-dirty'.
        expect(element(by.model('equipment.serialNumber')).getAttribute("class")).toMatch("ng-invalid-required");
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
        
        element(by.repeater('equipmentList').row(0)).click();
        expect(btn.isEnabled()).toBeTruthy();
    });
    /***********************************************************/
    
    it('Testing: Update an equipment', function() {
        element(by.repeater('equipmentList').row(0)).click(); // TODO: need to put something more flexible
        
        element(by.model('equipment.model')).sendKeys('V2');// changed
         
        element(by.id('btnSave')).click();
        expect(element(by.binding('SQLErrors')).getText()).toEqual('');
        expect(element(by.binding('SQLMsgs')).getText()).toEqual('Equipment updated successfully!!!');
    });
    it('Testing: Delete an equipment', function() {
        element(by.repeater('equipmentList').row(0)).click(); // TODO: need to put something more flexible
        
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
        
        element(by.id('btnSave')).click();
        element(by.repeater('equipmentList').row(0)).click(); // TODO: need to put something more flexible
        
        expect(element(by.model('equipment.serialNumber')).getAttribute("value")).toEqual('testE2E_V2');
        expect(element(by.model('equipment.barCode')).getAttribute("value")).toEqual('test barcode');
        expect(element(by.model('equipment.manufacturer')).getAttribute("value")).toEqual('tester');
        expect(element(by.model('equipment.model')).getAttribute("value")).toEqual('X5');
        expect(element(by.model('equipment.configHW')).getAttribute("value")).toEqual('config 1');
        expect(element(by.model('equipment.configSW')).getAttribute("value")).toEqual('config 2');
        expect(element(by.model('equipment.type')).$('option:checked').getText()).toEqual('Server');
        
        element(by.id('btnDelete')).click();
    });
});