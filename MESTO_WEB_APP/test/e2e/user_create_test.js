describe('E2E: Create User => ', function() {
    function getLastUser() {
        browser.actions().mouseMove(element(by.id('mnUser'))).perform();
        browser.sleep(500);
        element(by.id('mnVwUsers')).click();
        
        element.all(by.repeater('userList')).last().click();
    };
    
    function logTesterUser() {
        element(by.id('loginButton')).click();
        
        element(by.model('logInfo.username')).clear();
        element(by.model('logInfo.username')).sendKeys('tester');
        element(by.model('logInfo.pwd')).clear();
        element(by.model('logInfo.pwd')).sendKeys('tester');
        
        element(by.id('login')).click();
        
        element(by.id('mnAdmin')).click();
        browser.actions().mouseMove(element(by.id('mnUser'))).perform();
        browser.sleep(500);
        element(by.id('mnVwUsers')).click();
        element(by.id('btnNewUser')).click();
    }
    
    beforeAll(function() {
        browser.get('http://localhost/MESTO/MESTO_WEB_APP/#/home');
        
        element(by.id('signUpButton')).click();
    });
    
    afterAll(function() {
        element(by.id('logoutButton')).click();
    });
 
    describe('Field Validation => ', function() {
        beforeEach(function() {
            element(by.model('user.name')).sendKeys('t'); // just to be sure btnReset is actif
            element(by.id('btnReset')).click();
        });
    
        it('Testing: Required form fields', function() {
            element(by.model('user.name')).sendKeys('t'); // started state
            
            //Expected 'ng-pristine ng-untouched ng-invalid ng-invalid-required' to equal 'ng-dirty'.
            expect(element(by.model('user.username')).getAttribute("class")).toMatch("ng-invalid-required");
            expect(element(by.model('user.email')).getAttribute("class")).toMatch("ng-invalid-required");
            expect(element(by.model('user.password')).getAttribute("class")).toMatch("ng-invalid-required");
            expect(element(by.model('user.role')).getAttribute("class")).toMatch("ng-invalid-required");
        });
        
        it('Testing: Validation pattern of email', function() {
            var input = element(by.model('user.email'));
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
            element(by.model('user.name')).sendKeys('t'); // just to be sure btnReset is actif
            element(by.id('btnReset')).click();
        });
    
        it('Testing: State of Saving(Sign up) button', function() {
            var btn = element(by.id('btnSave'));
            
            expect(btn.isEnabled()).toBeFalsy();
            
            element(by.model('user.name')).sendKeys('t');
            expect(btn.isEnabled()).toBeFalsy();
            
            element(by.model('user.username')).sendKeys('test');
            element(by.model('user.email')).sendKeys('test@e2e.ca');
            element(by.model('user.password')).sendKeys('Test$4test');
            element(by.model('user.role')).sendKeys('A');
            
            expect(btn.isEnabled()).toBeTruthy();
        });
        
        it('Testing: State of Reset button', function() {
            var btn = element(by.id('btnReset'));
            
            expect(btn.isEnabled()).toBeFalsy();
            
            element(by.model('user.name')).sendKeys('t');
            expect(btn.isEnabled()).toBeTruthy();
        });
    });

    describe(' - Basic Database Operation => ', function() {
        afterAll(function() {
            browser.get('http://localhost/MESTO/MESTO_WEB_APP/#/home');
            logTesterUser();
            getLastUser();
            element(by.id('btnDelete')).click();
            element(by.id('logoutButton')).click();
        });
        
        it('Testing: Save a user', function() {
            element(by.model('user.name')).sendKeys('t'); // just to be sure btnReset is actif
            element(by.id('btnReset')).click();
            
            element(by.model('user.username')).sendKeys('testE2E'); // unique & required
            element(by.model('user.name')).sendKeys('test');
            element(by.model('user.email')).sendKeys('tester@tett.ca');
            element(by.model('user.password')).sendKeys('Test$4test');
            element(by.model('user.phone')).sendKeys('514-555-1401');
            element(by.model('user.role')).sendKeys('A');
            
            element(by.id('btnSave')).click();
            browser.sleep(500);
            
            expect(browser.getCurrentUrl()).toMatch("#/createUser");
            expect(element(by.id('form')).getAttribute("class")).toMatch("ng-hide");
            expect(element(by.id('result')).getAttribute("class")).not.toMatch("ng-hide");
            expect(element(by.binding('SQLErrors')).getText()).toEqual('');
        });
        it('Testing: Save a user, already exist', function() {
            browser.get('http://localhost/MESTO/MESTO_WEB_APP/#/home');
            element(by.id('signUpButton')).click();
            
            element(by.model('user.username')).sendKeys('testE2E'); // unique & required
            element(by.model('user.name')).sendKeys('test');
            element(by.model('user.email')).sendKeys('tester@tett.ca');
            element(by.model('user.password')).sendKeys('Test$4test');
            element(by.model('user.phone')).sendKeys('514-555-1401');
            element(by.model('user.role')).sendKeys('A');
            
            element(by.id('btnSave')).click();
            expect(browser.getCurrentUrl()).toMatch("#/createUser");
            expect(element(by.binding('SQLErrors')).getText()).toEqual('User already exists with same username or email.');
        });
        
        it('Testing: Test the security approval system', function() {
            browser.get('http://localhost/MESTO/MESTO_WEB_APP/#/home');
            
            element(by.id('loginButton')).click();
        
            element(by.model('logInfo.username')).clear();
            element(by.model('logInfo.username')).sendKeys('testE2E');
            element(by.model('logInfo.pwd')).clear();
            element(by.model('logInfo.pwd')).sendKeys('Test$4test');
            
            element(by.id('login')).click();
            
            expect(element(by.model('logInfo.username')).getAttribute("class")).toMatch("ng-invalid-wrong");
            expect(element(by.model('logInfo.pwd')).getAttribute("class")).toMatch("ng-invalid-wrong");
        });
    });
    
    describe(' - Advance database operation => ', function() {
        it('Testing: Full data validation with database', function() {
            browser.get('http://localhost/MESTO/MESTO_WEB_APP/#/home');
            element(by.id('signUpButton')).click();
            
            element(by.model('user.username')).sendKeys('testE2E'); // unique & required
            element(by.model('user.name')).sendKeys('test');
            element(by.model('user.email')).sendKeys('tester@tett.ca');
            element(by.model('user.password')).sendKeys('Test$4test');
            element(by.model('user.phone')).sendKeys('514-555-1401');
            element(by.model('user.supervisor')).sendKeys('test s');
            element(by.model('user.role')).sendKeys('A');
            element(by.model('user.title')).sendKeys('test title');
            element(by.model('user.address')).sendKeys('test adr');
                    
            element(by.id('btnSave')).click();
            
            browser.get('http://localhost/MESTO/MESTO_WEB_APP/#/home');
            logTesterUser();
            getLastUser();
            
            expect(element(by.model('user.username')).getAttribute("value")).toEqual('testE2E');
            expect(element(by.model('user.name')).getAttribute("value")).toEqual('test');
            expect(element(by.model('user.email')).getAttribute("value")).toEqual('tester@tett.ca');
            //expect(element(by.model('user.password')).getAttribute("value")).toEqual('test$4test');
            expect(element(by.model('user.phone')).getAttribute("value")).toEqual('514-555-1401');
            expect(element(by.model('user.supervisor')).getAttribute("value")).toEqual('test s');
            expect(element(by.model('user.role')).$('option:checked').getText()).toEqual('Admin');
            expect(element(by.model('user.title')).getAttribute("value")).toEqual('test title');
            expect(element(by.model('user.active')).isSelected()).toBeFalsy();
            expect(element(by.css('[data-ng-switch]')).getText()).toEqual("Pending");
            expect(element(by.model('user.address')).getAttribute("value")).toEqual('test adr');
                    
            element(by.id('btnDelete')).click();
        });
    });
});