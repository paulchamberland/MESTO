describe('E2E: Site => ', function() {
    beforeEach(function() {
        browser.get('http://localhost/MESTO/MESTO_WEB_APP/sites.html');
    });
    
    it('Testing : Web label display', function() {
        expect(browser.getTitle()).toEqual('Manage Sites');
    });
    
    it('Testing: Required form fields', function() {
        element(by.model('site.city')).sendKeys('t'); // started state
        
        //Expected 'ng-pristine ng-untouched ng-invalid ng-invalid-required' to equal 'ng-dirty'.
        expect(element(by.model('site.reference')).getAttribute("class")).toMatch("ng-invalid-required");
        expect(element(by.model('site.latitude')).getAttribute("class")).toMatch("ng-invalid-required");
        expect(element(by.model('site.longitude')).getAttribute("class")).toMatch("ng-invalid-required");
        expect(element(by.model('site.siteName')).getAttribute("class")).toMatch("ng-invalid-required");
    });
    
    it('Testing: Validation pattern of latitude', function() {
        var input = element(by.model('site.latitude'));
        input.sendKeys('t');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('12.321321');
        
        expect(input.getAttribute("value")).toEqual('12.321321');
        expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
    });
    
    it('Testing: Validation pattern of longitude', function() {
        var input = element(by.model('site.longitude'));
        input.sendKeys('t');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('12.321321');
        
        expect(input.getAttribute("value")).toEqual('12.321321');
        expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
    });
    
    it('Testing: Validation pattern of postal code', function() {
        var input = element(by.model('site.postalCode'));
        input.sendKeys('t');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear(); 
        input.sendKeys('D4D 2D2');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('F4F 2F2');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('I4I 2I2');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('O4O 2O2');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('Q4Q 2Q2');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('U4U 2U2');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('a4a 2a2');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('A4A 2A2');
        expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
    });
    
    it('Testing: Validation pattern of startDate', function() {
        // REGEX reference original : /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
        var input = element(by.model('site.startDate'));
        input.sendKeys('t');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('2000-12-12');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('12-30-2000');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('30/12/2000');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('31-02-2008');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('29-02-2007');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('29-02-2008');
        expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
    });
    
    it('Testing: Validation pattern of endDate', function() {
        var input = element(by.model('site.endDate'));
        input.sendKeys('t');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('2000-12-12');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('12-30-2000');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('30/12/2000');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('31-02-2008');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('29-02-2007');
        expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
        
        input.clear();
        input.sendKeys('29-02-2008');
        expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
    });
    
    it('Testing: Required field conditionnal of endDate', function() {
        element(by.model('site.isTemporary')).click(); // started state
        
        var input = element(by.model('site.endDate'));
        
        expect(element(by.model('site.endDate')).getAttribute("class")).toMatch("ng-invalid-required");
    });
    
    it('Testing: Validation of time between startDate and endDate', function() {
        var inputSD = element(by.model('site.startDate'));
        var inputED = element(by.model('site.endDate'));
        
        inputSD.sendKeys('01-01-2002');
        
        inputED.sendKeys('01-02-1998');
        expect(inputED.getAttribute("class")).toMatch("ng-invalid-greater-than");
        
        inputED.clear();
        inputED.sendKeys('01-02-2008');
        expect(inputED.getAttribute("class")).toMatch("ng-valid-greater-than");
        
        inputSD.clear();
        inputED.clear();
        inputED.sendKeys('01-02-2008');
        expect(inputED.getAttribute("class")).toMatch("ng-valid-greater-than");
    });
    
    it('Testing: State of Saving button', function() {
        var btn = element(by.id('btnSave'));
        
        expect(btn.isEnabled()).toBeFalsy();
        
        element(by.model('site.city')).sendKeys('t');
        expect(btn.isEnabled()).toBeFalsy();
        
        element(by.model('site.reference')).sendKeys('test');
        element(by.model('site.latitude')).sendKeys('12.432132');
        element(by.model('site.longitude')).sendKeys('12.321321');
        element(by.model('site.siteName')).sendKeys('t');
        
        expect(btn.isEnabled()).toBeTruthy();
    });
    
    it('Testing: State of Delete button', function() {
        var btn = element(by.id('btnDelete'));
        
        expect(btn.isEnabled()).toBeFalsy();
        
        element(by.model('site.city')).sendKeys('t');
        expect(btn.isEnabled()).toBeFalsy();
        
        element(by.repeater('s in siteList').row(0)).click(); // need to have data 
        expect(btn.isEnabled()).toBeTruthy();
    });
    
    it('Testing: State of Reset button', function() {
        var btn = element(by.id('btnReset'));
        
        expect(btn.isEnabled()).toBeFalsy();
        
        element(by.model('site.city')).sendKeys('t');
        expect(btn.isEnabled()).toBeTruthy();
    });
    
    describe(' - Basic Database Operation => ', function() {
        it('Testing: Save a site', function() {
            element(by.model('site.reference')).sendKeys('testE2E');
            element(by.model('site.latitude')).sendKeys('12.432132');
            element(by.model('site.longitude')).sendKeys('12.321321');
            element(by.model('site.siteName')).sendKeys('test scenario data');
            
            element(by.id('btnSave')).click();
            expect(element(by.binding('SQLErrors')).getText()).toEqual('');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('Site created successfully!!!');
        });
        it('Testing: Save a site, already exist', function() {
            element(by.model('site.reference')).sendKeys('testE2E'); // unique 
            element(by.model('site.latitude')).sendKeys('12.432132');
            element(by.model('site.longitude')).sendKeys('12.321321');
            element(by.model('site.siteName')).sendKeys('test scenario data');
            
            element(by.id('btnSave')).click();
            expect(element(by.binding('SQLErrors')).getText()).toEqual('Site already exists with same reference.');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('');
        });

        // TODO : DateBug : Fail, problem of not feeding date, fill back with wrong date...
        it('Testing: Update a site', function() {
            element.all(by.repeater('siteList')).last().click();
            
            element(by.model('site.siteName')).sendKeys('V2');// changed
             
            element(by.id('btnSave')).click();
            expect(element(by.binding('SQLErrors')).getText()).toEqual('');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('Site updated successfully!!!');
        });
        it('Testing: Delete a site', function() {
            element.all(by.repeater('siteList')).last().click();
            
            element(by.id('btnDelete')).click();
            expect(element(by.binding('SQLErrors')).getText()).toEqual('');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('Site deleted successfully!!!');
        });
    });
    
    describe(' - Advance database operation => ', function() {
        // TODO : DateBug : Fail, problem of converting data, it fill back with wrong date...
        it('Testing: Full data validation with database', function() {
            element(by.model('site.reference')).sendKeys('testE2E');
            element(by.model('site.latitude')).sendKeys('12.432132');
            element(by.model('site.longitude')).sendKeys('12.321321');
            element(by.model('site.siteName')).sendKeys('test scenario data');
            element(by.model('site.description')).sendKeys('test description data');
            element(by.model('site.address')).sendKeys('2020 du finfin');
            element(by.model('site.city')).sendKeys('farnahm');
            element(by.model('site.province')).sendKeys('québec');
            element(by.model('site.country')).sendKeys('canada');
            element(by.model('site.postalCode')).sendKeys('R4R 4R4');
            element(by.model('site.role')).sendKeys('E');
            element(by.model('site.isTemporary')).click();
            element(by.model('site.startDate')).sendKeys('01-01-2011');
            element(by.model('site.endDate')).sendKeys('01-01-2020');
            
            element(by.id('btnSave')).click();
            element.all(by.repeater('siteList')).last().click();
            
            expect(element(by.model('site.reference')).getAttribute("value")).toEqual('testE2E');
            expect(element(by.model('site.latitude')).getAttribute("value")).toEqual('12.432132');
            expect(element(by.model('site.longitude')).getAttribute("value")).toEqual('12.321321');
            expect(element(by.model('site.siteName')).getAttribute("value")).toEqual('test scenario data');
            expect(element(by.model('site.description')).getAttribute("value")).toEqual('test description data');
            expect(element(by.model('site.address')).getAttribute("value")).toEqual('2020 du finfin');
            expect(element(by.model('site.city')).getAttribute("value")).toEqual('farnahm');
            expect(element(by.model('site.province')).getAttribute("value")).toEqual('québec');
            expect(element(by.model('site.country')).getAttribute("value")).toEqual('canada');
            expect(element(by.model('site.postalCode')).getAttribute("value")).toEqual('R4R 4R4');
            expect(element(by.model('site.role')).$('option:checked').getText()).toEqual('Edifice');
            expect(element(by.model('site.isTemporary')).isSelected()).toBeTruthy();
            expect(element(by.model('site.startDate')).getAttribute("value")).toEqual('01-01-2011');
            expect(element(by.model('site.endDate')).getAttribute("value")).toEqual('01-01-2020');
            
            element(by.id('btnDelete')).click();
        });
    });
});