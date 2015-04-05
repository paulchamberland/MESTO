describe('E2E: Site', function() {
    beforeEach(function() {
        browser.get('http://localhost/MESTO/MESTO_WEB_APP/sites.html');
    });
    
    it('should have a title', function() {
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
        
        element(by.repeater('s in siteList').row(0)).click();
        expect(btn.isEnabled()).toBeTruthy();
    });
    
    it('Testing: State of Reset button', function() {
        var btn = element(by.id('btnReset'));
        
        expect(btn.isEnabled()).toBeFalsy();
        
        element(by.model('site.city')).sendKeys('t');
        expect(btn.isEnabled()).toBeTruthy();
    });
});