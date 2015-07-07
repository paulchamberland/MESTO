describe('E2E: Site => ', function() {
    function getLastSite() {
        element(by.id('mnSites')).click();
        
        openLastSite();
    };
    
    function openLastSite() {
        browser.sleep(500);
        
        browser.executeScript('window.scrollTo(0,2000);').then(function () {
            browser.sleep(500);
            element.all(by.repeater('siteList')).last().click();
        })
        
        browser.sleep(500);
    }
    
    beforeAll(function() {
        browser.get('http://localhost/MESTO/MESTO_WEB_APP/#/home');
        
        element(by.id('loginButton')).click();
        
        element(by.model('logInfo.username')).clear();
        element(by.model('logInfo.username')).sendKeys('tester');
        element(by.model('logInfo.pwd')).clear();
        element(by.model('logInfo.pwd')).sendKeys('tester');
        
        element(by.id('login')).click();
        
        element(by.id('mnAdmin')).click();
        element(by.id('mnSites')).click();
        
        element(by.id('btnNewSite')).click();
    });
    
    afterAll(function() {
        element(by.id('logoutButton')).click();
    });
    
    describe('Field Validation => ', function() {
        beforeEach(function() {
            element(by.model('site.city')).sendKeys('t'); // be sure that Reset is active
            element(by.id('btnReset')).click();
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
            input.sendKeys('2.32132');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('2,332132');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('-.332132');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('-332132');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('2.332132');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
            
            input.clear();
            input.sendKeys('12.321321');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
            
            input.clear();
            input.sendKeys('212.321321');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
            
            input.clear();
            input.sendKeys('-212.321321');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
            
            input.clear();
            input.sendKeys('12.321321');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
            
            input.clear();
            input.sendKeys('-12.321321');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
            
            input.clear();
            input.sendKeys('-2.321321');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
        });
        
        it('Testing: Validation pattern of longitude', function() {
            var input = element(by.model('site.longitude'));
            input.sendKeys('t');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('2.32132');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('2,332132');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('-.332132');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('-332132');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('2.332132');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
            
            input.clear();
            input.sendKeys('12.321321');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
            
            input.clear();
            input.sendKeys('212.321321');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
            
            input.clear();
            input.sendKeys('-212.321321');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
            
            input.clear();
            input.sendKeys('12.321321');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
            
            input.clear();
            input.sendKeys('-12.321321');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
            
            input.clear();
            input.sendKeys('-2.321321');
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
            expect(input.getAttribute("class")).toMatch("ng-invalid-date");
            
            input.clear();
            input.sendKeys('27-02-2008');
            expect(input.getAttribute("class")).toMatch("ng-invalid-date");
            
            /*
            TODO: Bug on the validation date
            input.clear();
            input.sendKeys('2008-02-31');
            expect(input.getAttribute("class")).toMatch("ng-invalid-date");
            
            input.clear();
            input.sendKeys('2007-02-29');
            expect(input.getAttribute("class")).toMatch("ng-invalid-date");*/
            
            input.clear();
            input.sendKeys('2008-02-29');
            expect(input.getAttribute("class")).toMatch("ng-valid-date");
            
            input.clear();
            input.sendKeys('2000/12/30');
            expect(input.getAttribute("class")).toMatch("ng-valid-date");
        });
        
        it('Testing: Validation pattern of endDate', function() {
            var input = element(by.model('site.endDate'));
            input.sendKeys('t');
            expect(input.getAttribute("class")).toMatch("ng-invalid-date");
            
             input.clear();
            input.sendKeys('27-02-2008');
            expect(input.getAttribute("class")).toMatch("ng-invalid-date");
            
            /*
            TODO: Bug on the validation date
            input.clear();
            input.sendKeys('2008-02-31');
            expect(input.getAttribute("class")).toMatch("ng-invalid-date");
            
            input.clear();
            input.sendKeys('2007-02-29');
            expect(input.getAttribute("class")).toMatch("ng-invalid-date");*/
            
            input.clear();
            input.sendKeys('2008-02-29');
            expect(input.getAttribute("class")).toMatch("ng-valid-date");
            
            input.clear();
            input.sendKeys('2000/12/30');
            expect(input.getAttribute("class")).toMatch("ng-valid-date");
        });
        
        it('Testing: Required field conditionnal of endDate', function() {
            element(by.model('site.isTemporary')).click(); // started state
            
            var input = element(by.model('site.endDate'));
            
            expect(element(by.model('site.endDate')).getAttribute("class")).toMatch("ng-invalid-required");
        });
        
        // TODO: Validation of valid-date, failed, when it's write with keyboard.
        xit('Testing: Validation of time between startDate and endDate', function() {
            var inputSD = element(by.model('site.startDate'));
            var inputED = element(by.model('site.endDate'));
            
            inputSD.sendKeys('2002-01-01');
            
            inputED.sendKeys('1998-01-02');
            expect(inputED.getAttribute("class")).toMatch("ng-invalid-greater-than");
            
            inputED.clear();
            inputED.sendKeys('2008-01-02');
            expect(inputED.getAttribute("class")).toMatch("ng-valid-greater-than");
            
            inputSD.clear();
            inputED.clear();
            inputED.sendKeys('2008-01-02');
            expect(inputED.getAttribute("class")).toMatch("ng-valid-greater-than");
        });
        
        it('Testing: Validation pattern of phone number of PoC', function() {
            var input = element(by.model('site.phoneNumberPoC'));
            input.sendKeys('t');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('54343223243');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('514 555 2321');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('514-541-4324');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
            
            input.clear();
            input.sendKeys('000-000-0000');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
        });
        
        it('Testing: Validation pattern of phone number of TechPoC', function() {
            var input = element(by.model('site.phoneTechPoC'));
            input.sendKeys('t');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('54343223243');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('514 555 2321');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('514-541-4324');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
            
            input.clear();
            input.sendKeys('000-000-0000');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
        });
    });
    
    describe('basic operation => ', function() {
        beforeEach(function() {
            element(by.model('site.city')).sendKeys('t'); // be sure that Reset is active
            element(by.id('btnReset')).click();
        });
    
        it('Testing: State of Saving button', function() {
            var btn = element(by.id('btnSave'));
            
            expect(btn.getAttribute('disabled')).toBeTruthy();
            
            element(by.model('site.city')).sendKeys('t');
            browser.sleep(500);
            expect(btn.getAttribute('disabled')).toBeTruthy();
            
            element(by.model('site.reference')).sendKeys('test');
            element(by.model('site.latitude')).sendKeys('12.432132');
            element(by.model('site.longitude')).sendKeys('12.321321');
            element(by.model('site.siteName')).sendKeys('t');
            element(by.model('site.endDate')).sendKeys('2000/12/30');
            
            browser.sleep(500);
            expect(btn.getAttribute('disabled')).toBeFalsy();
            
            element(by.id('btnSave')).click();// Saving to have a Test data
            browser.get('http://localhost/MESTO/MESTO_WEB_APP/#/admin/site');
        });
        
        it('Testing: State of Reset button', function() {
            
            var btn = element(by.id('btnReset'));
            
            expect(btn.getAttribute('disabled')).toBeTruthy();
            
            element(by.model('site.city')).sendKeys('t');
            expect(btn.getAttribute('disabled')).toBeFalsy();
        });
        
        it('Testing: State of Get equipement button', function() {
            expect(element(by.id('btnOpenFreeLstEquip')).isPresent()).toBeFalsy();
            
            getLastSite();
            
            expect(element(by.id('btnOpenFreeLstEquip')).isPresent()).toBeTruthy();
        });
        
        it('Testing: State of Get room button', function() {
            expect(element(by.id('btnOpenFreeLstRoom')).isPresent()).toBeFalsy();
            
            getLastSite();
            
            expect(element(by.id('btnOpenFreeLstRoom')).isPresent()).toBeTruthy();
        });
        
        it('Testing: State of Delete button', function() {
            var btn = element(by.id('btnDelete'));
            
            expect(btn.getAttribute('disabled')).toBeTruthy();
            
            element(by.model('site.city')).sendKeys('t');
            expect(btn.getAttribute('disabled')).toBeTruthy();
            
            getLastSite();
            expect(btn.getAttribute('disabled')).toBeFalsy();
            
            btn.click(); // delete the test
        });
    });
    
    describe(' - Basic Database Operation => ', function() {
        it('Testing: Save a site', function() {
            element(by.id('btnNewSite')).click();
            
            element(by.model('site.reference')).sendKeys('testE2E');
            element(by.model('site.latitude')).sendKeys('12.432132');
            element(by.model('site.longitude')).sendKeys('12.321321');
            element(by.model('site.siteName')).sendKeys('test scenario data');
            
            element(by.id('btnSave')).click();
            expect(browser.getCurrentUrl()).toMatch("#/admin/sites");
        });
        it('Testing: Save a site, already exist', function() {
            element(by.id('btnNewSite')).click();
            
            element(by.model('site.reference')).sendKeys('testE2E'); // unique 
            element(by.model('site.latitude')).sendKeys('12.432132');
            element(by.model('site.longitude')).sendKeys('12.321321');
            element(by.model('site.siteName')).sendKeys('test scenario data');
            
            element(by.id('btnSave')).click();
            expect(browser.getCurrentUrl()).toMatch("#/admin/site");
            expect(element(by.binding('SQLErrors')).getText()).toEqual('Site already exists with same reference.');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('');
        });

        it('Testing: Update a site', function() {
            getLastSite();
            
            element(by.model('site.siteName')).sendKeys('V2');// changed
             
            element(by.id('btnSave')).click();
            expect(browser.getCurrentUrl()).toMatch("#/admin/sites");
        });
        
        it('Testing: Associate a room to a Site', function() {
            openLastSite();
            element(by.id('btnOpenFreeLstRoom')).click();
            
            element.all(by.repeater('lstFreeRooms')).get(0).element(by.model('r.adding')).click();
            element(by.id('btnAddLstRooms')).click();
            
            expect(element.all(by.repeater('lstRooms')).count()).toEqual(1);
        });
        
        it('Testing: Remove a associate room to a Site', function() {
            getLastSite();
            
            element.all(by.repeater('lstRooms')).get(0).element(by.id('btnRemoveRoom')).click();
            
            expect(element.all(by.repeater('lstRooms')).count()).toEqual(0);
        });
        
        it('Testing: Associate an equipement to a Site', function() {
            getLastSite();
            element(by.id('btnOpenFreeLstEquip')).click();
            
            element.all(by.repeater('lstFreeEquips')).get(0).element(by.model('e.adding')).click();
            element(by.id('btnAddLstEquips')).click();
            
            expect(element.all(by.repeater('lstEquips')).count()).toEqual(1);
        });
        
        it('Testing: Remove an associate equipement to a Site', function() {
            getLastSite();
            
            element.all(by.repeater('lstEquips')).get(0).element(by.id('btnRemoveEquip')).click();
            
            expect(element.all(by.repeater('lstEquips')).count()).toEqual(0);
        });
        
        it('Testing: Delete a site', function() {
            getLastSite();
            
            element(by.id('btnDelete')).click();
            expect(browser.getCurrentUrl()).toMatch("#/admin/sites");
        });
    });
    
    describe(' - Advance database operation => ', function() {
        it('Testing: Update a site with a other existing unique reference value', function() {
            element(by.id('btnNewSite')).click();
            
            element(by.model('site.reference')).sendKeys('testE2E_V3');
            element(by.model('site.latitude')).sendKeys('12.432132');
            element(by.model('site.longitude')).sendKeys('12.321321');
            element(by.model('site.siteName')).sendKeys('test scenario data 3');
            
            element(by.id('btnSave')).click();
            expect(browser.getCurrentUrl()).toMatch("#/admin/sites");
            
            element(by.id('btnNewSite')).click();
            
            element(by.model('site.reference')).sendKeys('testE2E_V4');
            element(by.model('site.latitude')).sendKeys('12.432132');
            element(by.model('site.longitude')).sendKeys('12.321321');
            element(by.model('site.siteName')).sendKeys('test scenario data 4');
            
            element(by.id('btnSave')).click();
            expect(browser.getCurrentUrl()).toMatch("#/admin/sites");
            
            openLastSite();
            
            element(by.model('site.reference')).clear();
            element(by.model('site.reference')).sendKeys('testE2E_V3');
            element(by.id('btnSave')).click();
            
            expect(element(by.binding('SQLErrors')).getText()).toEqual('Update Failed: Site already exists with same reference.');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('');
            
            getLastSite();
            element(by.id('btnDelete')).click();
            openLastSite();
            element(by.id('btnDelete')).click();
        });
        
        it('Testing: Full data validation with database', function() {
            element(by.id('btnNewSite')).click();
            
            element(by.model('site.reference')).sendKeys('testE2E');
            element(by.model('site.latitude')).sendKeys('12.432132');
            element(by.model('site.longitude')).sendKeys('12.321321');
            element(by.model('site.siteName')).sendKeys('test scenario data');
            element(by.model('site.description')).sendKeys('test description data');
            element(by.model('site.address')).sendKeys('90 du vieux');
            element(by.model('site.city')).sendKeys('farnahm');
            element(by.model('site.province')).sendKeys('québec');
            element(by.model('site.country')).sendKeys('canada');
            element(by.model('site.postalCode')).sendKeys('R4R 4R4');
            element(by.model('site.role')).sendKeys('E');
            element(by.model('site.isTemporary')).click();
            element(by.model('site.startDate')).sendKeys('01-01-2011');
            element(by.model('site.endDate')).sendKeys('01-01-2020');
            element(by.model('site.pointOfContact')).sendKeys('Lt. Bariton');
            element(by.model('site.phoneNumberPoC')).sendKeys('514-555-4321');
            element(by.model('site.organization')).sendKeys('T');
            element(by.model('site.techPoC')).sendKeys('Sgt. Soprano');
            element(by.model('site.phoneTechPoC')).sendKeys('514-555-4321');
            element(by.model('site.employesNumber')).sendKeys('200');
            
            element(by.id('btnSave')).click();
            openLastSite();
            
            expect(element(by.model('site.reference')).getAttribute("value")).toEqual('testE2E');
            expect(element(by.model('site.latitude')).getAttribute("value")).toEqual('12.432132');
            expect(element(by.model('site.longitude')).getAttribute("value")).toEqual('12.321321');
            expect(element(by.model('site.siteName')).getAttribute("value")).toEqual('test scenario data');
            expect(element(by.model('site.description')).getAttribute("value")).toEqual('test description data');
            expect(element(by.model('site.address')).getAttribute("value")).toEqual('90 du vieux');
            expect(element(by.model('site.city')).getAttribute("value")).toEqual('farnahm');
            expect(element(by.model('site.province')).getAttribute("value")).toEqual('québec');
            expect(element(by.model('site.country')).getAttribute("value")).toEqual('canada');
            expect(element(by.model('site.postalCode')).getAttribute("value")).toEqual('R4R 4R4');
            expect(element(by.model('site.role')).$('option:checked').getText()).toEqual('Edifice');
            expect(element(by.model('site.isTemporary')).isSelected()).toBeTruthy();
            expect(element(by.model('site.startDate')).getAttribute("value")).toEqual('01-01-2011');
            expect(element(by.model('site.endDate')).getAttribute("value")).toEqual('01-01-2020');
            expect(element(by.model('site.pointOfContact')).getAttribute("value")).toEqual('Lt. Bariton');
            expect(element(by.model('site.phoneNumberPoC')).getAttribute("value")).toEqual('514-555-4321');
            expect(element(by.model('site.organization')).$('option:checked').getText()).toEqual('TC');
            expect(element(by.model('site.techPoC')).getAttribute("value")).toEqual('Sgt. Soprano');
            expect(element(by.model('site.phoneTechPoC')).getAttribute("value")).toEqual('514-555-4321');
            expect(element(by.model('site.employesNumber')).getAttribute("value")).toEqual('200');
            expect(element(by.binding('site.updateBy')).getText()).toMatch('Protractor');
            
            element(by.id('btnDelete')).click();
        });
    });
});