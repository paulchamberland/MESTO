describe('E2E: Profile => ', function() {
    function getLastUser() {
        element(by.id('mnAdmin')).click();
        
        browser.actions().mouseMove(element(by.id('mnUser'))).perform();
        browser.sleep(500);
        element(by.id('mnVwUsers')).click();
        
        element.all(by.repeater('userList')).last().click();
    }
    
    function logUser(pUser, pPwd) {
        element(by.id('loginButton')).click();
        
        element(by.model('logInfo.username')).clear();
        element(by.model('logInfo.username')).sendKeys(pUser);
        element(by.model('logInfo.pwd')).clear();
        element(by.model('logInfo.pwd')).sendKeys(pPwd);
        
        element(by.id('login')).click();
    }
    
    function getCurrentLogUserProfile() {
        browser.get('http://localhost/MESTO/MESTO_WEB_APP/#/home');
        element(by.binding('loginCTL.getUserName')).click();
    }
    
    beforeAll(function() {
        browser.get('http://localhost/MESTO/MESTO_WEB_APP/#/home');
        element(by.id('signUpButton')).click();
        
        element(by.model('user.name')).sendKeys('testing');
        element(by.model('user.username')).sendKeys('testProfile');
        element(by.model('user.email')).sendKeys('test@e2e.ca');
        element(by.model('user.password')).sendKeys('Test$4test');
        element(by.model('user.role')).sendKeys('A');
            
        element(by.id('btnSave')).click();
        browser.get('http://localhost/MESTO/MESTO_WEB_APP/#/home');
        
        logUser('tester', 'tester');
        
        getLastUser();
    });
    
    afterAll(function() {
        element(by.id('logoutButton')).click();
        browser.get('http://localhost/MESTO/MESTO_WEB_APP/#/home');
        logUser('tester', 'tester');
        getLastUser();
        element(by.id('btnDelete')).click();
        element(by.id('logoutButton')).click();
    });
    
    describe('Activate/Approved user =>', function() {
        it('Activated', function() {
            element(by.model('user.active')).click();
            element(by.model('user.supervisor')).sendKeys('s'); // BUG on Prestine when clicking only a checkbox. Modified another field to be able to save
            
            expect(element(by.css('[data-ng-switch]')).getText()).toEqual("Approved");
            
            element(by.id('btnSave')).click();
            expect(browser.getCurrentUrl()).toMatch("#/admin/users");
        });
        
        afterAll(function() {
            element(by.id('logoutButton')).click();
        });
    });
 
    describe('Field Validation => ', function() {
        beforeAll(function() {
            logUser('testProfile', 'Test$4test');
            getCurrentLogUserProfile();
        });
        
        beforeEach(function() {
            getCurrentLogUserProfile(); // reload page do a king of reset
        });
    
        it('Testing: Required available form fields', function() {
            element(by.model('user.email')).clear();
            element(by.model('user.password')).clear();
            
            //Expected 'ng-pristine ng-untouched ng-invalid ng-invalid-required' to equal 'ng-dirty'.
            expect(element(by.model('user.email')).getAttribute("class")).toMatch("ng-invalid-required");
            expect(element(by.model('user.password')).getAttribute("class")).toMatch("ng-invalid-required");
        });
        
        it('Testing: Validation pattern of email', function() {
            var input = element(by.model('user.email'));
            input.clear();
            
            input.sendKeys('t');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('test@test,com');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('test@test.comcom');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('tes%tt&es$tte!st*6773232@test.ca');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('Test@test.ca');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('test@test.qc.ca');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
        });
        
        it('Testing: Validation pattern of password', function() {
            var input = element(by.model('user.password'));
            input.clear();
            
            input.sendKeys('t');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('testtest');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('test$test');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('test$t3st');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('Tt$t3st');
            expect(input.getAttribute("class")).toMatch("ng-invalid-pattern");
            
            input.clear();
            input.sendKeys('Test!$%?&*+-/=#t3st');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
            
            input.clear();
            input.sendKeys('Test$t3st');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
            
            input.clear();
            input.sendKeys('Test!$%?&*#t3st');
            expect(input.getAttribute("class")).toMatch("ng-valid-pattern");
        });
        
        it('Testing: Validation pattern of phone number', function() {
            var input = element(by.model('user.phone'));
            input.clear();
            
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
            getCurrentLogUserProfile();
        });
    
        it('Testing: State of Saving button', function() {
            var btn = element(by.id('btnSave'));
            
            expect(btn.isEnabled()).toBeFalsy();
            
            element(by.model('user.name')).sendKeys('t');
            expect(btn.isEnabled()).toBeTruthy();
        });
        
        it('Testing: State of Change password button', function() {
            var btn = element(by.id('btnSavePwd'));
            
            expect(btn.isEnabled()).toBeFalsy();
            
            element(by.model('user.password')).sendKeys('Test$4test');
            
            expect(btn.isEnabled()).toBeTruthy();
        });
    });

    describe(' - Basic Database Operation => ', function() {
        beforeEach(function() {
            getCurrentLogUserProfile();
        });
        
        it('Testing: Modified the user', function() {
            element(by.model('user.name')).clear();
            element(by.model('user.name')).sendKeys('test');
            element(by.model('user.email')).clear();
            element(by.model('user.email')).sendKeys('tester@tett.qc.ca');
            element(by.model('user.phone')).clear();
            element(by.model('user.phone')).sendKeys('514-555-1401');
            
            element(by.id('btnSave')).click();
            
            expect(element(by.binding('SQLErrors')).getText()).toEqual('');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('User updated successfully!!!');
        });
        it('Testing: Modified a user, already exist', function() {
            element(by.model('user.email')).clear();
            element(by.model('user.email')).sendKeys('test@mesto.qc.ca');
            
            element(by.id('btnSave')).click();
            expect(element(by.binding('SQLErrors')).getText()).toEqual('Update failed: User already exists with same username or email.');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('');
        });
        
        it('Testing: change a user password', function() {
            element(by.model('user.password')).sendKeys('Test%5test');// changed
             
            element(by.id('btnSavePwd')).click();
            
            expect(element(by.binding('SQLPwdErrors')).getText()).toEqual('');
            expect(element(by.binding('SQLPwdMsgs')).getText()).toEqual('User password updated successfully!!!');
            expect(element(by.model('user.password')).getText()).toEqual('');
        });
    });
    
    describe(' - Advance database operation => ', function() {
        it('Testing: Full data validation with database', function() {
            getCurrentLogUserProfile();
            
            element(by.model('user.name')).clear();
            element(by.model('user.name')).sendKeys('test2');
            element(by.model('user.email')).clear();
            element(by.model('user.email')).sendKeys('tester2@tett.ca');
            element(by.model('user.phone')).clear();
            element(by.model('user.phone')).sendKeys('514-555-2222');
            element(by.model('user.supervisor')).clear();
            element(by.model('user.supervisor')).sendKeys('test s2');
            element(by.model('user.title')).clear();
            element(by.model('user.title')).sendKeys('test title2');
            element(by.model('user.address')).clear();
            element(by.model('user.address')).sendKeys('test adr2');
                    
            element(by.id('btnSave')).click();
            
            getCurrentLogUserProfile();
            
            expect(element(by.model('user.username')).getAttribute("value")).toEqual('testProfile');
            expect(element(by.model('user.name')).getAttribute("value")).toEqual('test2');
            expect(element(by.model('user.email')).getAttribute("value")).toEqual('tester2@tett.ca');
            expect(element(by.model('user.phone')).getAttribute("value")).toEqual('514-555-2222');
            expect(element(by.model('user.supervisor')).getAttribute("value")).toEqual('test s2');
            expect(element(by.model('user.title')).getAttribute("value")).toEqual('test title2');
            expect(element(by.model('user.address')).getAttribute("value")).toEqual('test adr2');
        });
    });
});