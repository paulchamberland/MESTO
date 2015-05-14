describe('E2E: User => ', function() {
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
        
        logTesterUser();
    });
    
    beforeEach(function() {
        element(by.model('user.name')).sendKeys('t'); // just to be sure btnReset is actif
        element(by.id('btnReset')).click();
    });
 
    describe('Field Validation => ', function() {
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
        it('Testing: State of Saving button', function() {
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
        
        it('Testing: State of Delete button', function() {
            var btn = element(by.id('btnDelete'));
            
            expect(btn.isEnabled()).toBeFalsy();
            
            element(by.model('user.name')).sendKeys('t');
            expect(btn.isEnabled()).toBeFalsy();
            
            getLastUser();
            expect(btn.isEnabled()).toBeTruthy();
        });
    });

    describe(' - Basic Database Operation => ', function() {
        it('Testing: Save a user', function() {
            element(by.model('user.username')).sendKeys('testE2E'); // unique & required
            element(by.model('user.name')).sendKeys('test');
            element(by.model('user.email')).sendKeys('tester@tett.ca');
            element(by.model('user.password')).sendKeys('Test$4test');
            element(by.model('user.phone')).sendKeys('514-555-1401');
            element(by.model('user.role')).sendKeys('A');
            element(by.model('user.active')).click();
            
            element(by.id('btnSave')).click();
            expect(element(by.binding('SQLErrors')).getText()).toEqual('');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('User created successfully!!!');
        });
        it('Testing: Save a user, already exist', function() {
            element(by.model('user.username')).sendKeys('testE2E'); // unique & required
            element(by.model('user.name')).sendKeys('test');
            element(by.model('user.email')).sendKeys('tester@tett.ca');
            element(by.model('user.password')).sendKeys('Test$4test');
            element(by.model('user.phone')).sendKeys('514-555-1401');
            element(by.model('user.role')).sendKeys('A');
            
            element(by.id('btnSave')).click();
            expect(element(by.binding('SQLErrors')).getText()).toEqual('User already exists with same username or email.');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('');
        });
        
        it('Testing: Update a user', function() {
            getLastUser();
            
            element(by.model('user.name')).sendKeys('V2');// changed
             
            element(by.id('btnSave')).click();
            expect(element(by.binding('SQLErrors')).getText()).toEqual('');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('User updated successfully!!!');
        });
        
        it('Testing: change a user password and test this password', function() {
            getLastUser();
            element(by.id('btnChgPassword')).click();
            
            element(by.model('user.password')).sendKeys('Test%5test');// changed
             
            element(by.id('btnSave')).click();
            expect(element(by.binding('SQLErrors')).getText()).toEqual('');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('User updated successfully!!!');
            
            element(by.id('logoutButton')).click();
            element(by.id('loginButton')).click();
        
            element(by.model('logInfo.username')).clear();
            element(by.model('logInfo.username')).sendKeys('testE2E');
            element(by.model('logInfo.pwd')).clear();
            element(by.model('logInfo.pwd')).sendKeys('Test%5test');
            
            element(by.id('login')).click();
            
            expect(element(by.binding('loginCTL.getUserName()')).getText()).toEqual('Welcome testV2');
            
            element(by.id('logoutButton')).click();
            logTesterUser();
        });
        
        
        it('Testing: Delete an user', function() {
            getLastUser();
            
            element(by.id('btnDelete')).click();
            expect(element(by.binding('SQLErrors')).getText()).toEqual('');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('User deleted successfully!!!');
        });
    });
    
    describe(' - Advance database operation => ', function() {
        it('Testing: Updating an user with a other existing unique username value', function() {
            element(by.model('user.username')).sendKeys('testE2E_V3'); // unique & required
            element(by.model('user.email')).sendKeys('tester3@tett.ca'); // unique & required
            element(by.model('user.password')).sendKeys('Test$4test'); // required
            element(by.model('user.role')).sendKeys('A'); // required
            
            element(by.id('btnSave')).click();
            expect(element(by.binding('SQLErrors')).getText()).toEqual('');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('User created successfully!!!');
            
            element(by.model('user.username')).sendKeys('testE2E_V4'); // unique & required
            element(by.model('user.email')).sendKeys('tester4@tett.ca'); // unique & required
            element(by.model('user.password')).sendKeys('Test$4test'); // required
            element(by.model('user.role')).sendKeys('A'); // required
            
            element(by.id('btnSave')).click();
            expect(element(by.binding('SQLErrors')).getText()).toEqual('');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('User created successfully!!!');
            
            getLastUser();
            
            element(by.model('user.username')).clear();
            element(by.model('user.username')).sendKeys('testE2E_V3'); // unique & required
             
            element(by.id('btnSave')).click();
            expect(element(by.binding('SQLErrors')).getText()).toEqual('Update failed: User already exists with same username or email.');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('');
            
            element(by.model('user.email')).clear();
            element(by.model('user.email')).sendKeys('tester3@tett.ca'); // unique & required
             
            element(by.id('btnSave')).click();
            expect(element(by.binding('SQLErrors')).getText()).toEqual('Update failed: User already exists with same username or email.');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('');
            
            getLastUser();
            element(by.id('btnDelete')).click();
            
            getLastUser();
            element(by.id('btnDelete')).click();
        });
        
        it('Testing: Full data validation with database', function() {
            element(by.model('user.username')).sendKeys('testE2E'); // unique & required
            element(by.model('user.name')).sendKeys('test');
            element(by.model('user.email')).sendKeys('tester@tett.ca');
            element(by.model('user.password')).sendKeys('Test$4test');
            element(by.model('user.phone')).sendKeys('514-555-1401');
            element(by.model('user.supervisor')).sendKeys('test s');
            element(by.model('user.role')).sendKeys('A');
            element(by.model('user.title')).sendKeys('test title');
            element(by.model('user.active')).click();
            element(by.model('user.address')).sendKeys('test adr');
                    
            element(by.id('btnSave')).click();
            getLastUser();
            
            expect(element(by.model('user.username')).getAttribute("value")).toEqual('testE2E');
            expect(element(by.model('user.name')).getAttribute("value")).toEqual('test');
            expect(element(by.model('user.email')).getAttribute("value")).toEqual('tester@tett.ca');
            //expect(element(by.model('user.password')).getAttribute("value")).toEqual('test$4test');
            expect(element(by.model('user.phone')).getAttribute("value")).toEqual('514-555-1401');
            expect(element(by.model('user.supervisor')).getAttribute("value")).toEqual('test s');
            expect(element(by.model('user.role')).$('option:checked').getText()).toEqual('Admin');
            expect(element(by.model('user.title')).getAttribute("value")).toEqual('test title');
            expect(element(by.model('user.active')).isSelected()).toBeTruthy();
            expect(element(by.model('user.address')).getAttribute("value")).toEqual('test adr');
                    
            element(by.id('btnDelete')).click();
        });
        
        it('Testing: Inactive a user and try to log', function() {
            element(by.model('user.username')).sendKeys('testE2E'); // unique & required
            element(by.model('user.email')).sendKeys('inactive@tett.ca');
            element(by.model('user.password')).sendKeys('Test$4test');
            element(by.model('user.role')).sendKeys('A');
            
            element(by.id('btnSave')).click();
            
            element(by.id('logoutButton')).click();
            element(by.id('loginButton')).click();
            
            element(by.model('logInfo.username')).clear();
            element(by.model('logInfo.username')).sendKeys('testE2E');
            element(by.model('logInfo.pwd')).clear();
            element(by.model('logInfo.pwd')).sendKeys('Test$4test');
            
            element(by.id('login')).click();
            
            expect(element(by.model('logInfo.username')).getAttribute("class")).toMatch("ng-invalid-wrong");
            expect(element(by.model('logInfo.pwd')).getAttribute("class")).toMatch("ng-invalid-wrong");
            
            element(by.id('loginButton')).click(); // close to open popup login
            logTesterUser();
            
            getLastUser();
            element(by.id('btnDelete')).click();
        });
    });
});