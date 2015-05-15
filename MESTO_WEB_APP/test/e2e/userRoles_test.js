describe('E2E: UserRole => ', function() {
    function getLastUserRole() {
        browser.actions().mouseMove(element(by.id('mnUser'))).perform();
        browser.sleep(500);
        element(by.id('mnRoles')).click();
        
        element.all(by.repeater('userRoleList')).last().click();
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
        browser.actions().mouseMove(element(by.id('mnUser'))).perform();
        browser.sleep(500);
        element(by.id('mnRoles')).click();
        
        element(by.id('btnNewUserRole')).click();
    });
    
    beforeEach(function() {
        element(by.model('userRole.description')).sendKeys('t'); // be sure that Reset is active
        element(by.id('btnReset')).click();
    });
    
    describe('Field Validation => ', function() {
        it('Testing: Required form fields', function() {
            element(by.model('userRole.description')).sendKeys('t'); // started state
            
            //Expected 'ng-pristine ng-untouched ng-invalid ng-invalid-required' to equal 'ng-dirty'.
            expect(element(by.model('userRole.name')).getAttribute("class")).toMatch("ng-invalid-required");
        });
    });
    
    describe('basic operation => ', function() {
        it('Testing: State of Saving button', function() {
            var btn = element(by.id('btnSave'));
            
            expect(btn.isEnabled()).toBeFalsy();
            
            element(by.model('userRole.description')).sendKeys('t');
            expect(btn.isEnabled()).toBeFalsy();
            
            element(by.model('userRole.name')).sendKeys('test');
            
            expect(btn.isEnabled()).toBeTruthy();
        });
        
        it('Testing: State of Delete button', function() {
            var btn = element(by.id('btnDelete'));
            
            expect(btn.isEnabled()).toBeFalsy();
            
            element(by.model('userRole.description')).sendKeys('t');
            expect(btn.isEnabled()).toBeFalsy();
            
            getLastUserRole();
            expect(btn.isEnabled()).toBeTruthy();
        });
        
        it('Testing: State of Reset button', function() {
            var btn = element(by.id('btnReset'));
            
            expect(btn.isEnabled()).toBeFalsy();
            
            element(by.model('userRole.description')).sendKeys('t');
            expect(btn.isEnabled()).toBeTruthy();
        });
    });
    
    describe(' - Basic Database Operation => ', function() {
        it('Testing: Save a site', function() {
            element(by.model('userRole.name')).sendKeys('testE2E');
            element(by.model('userRole.description')).sendKeys('test descr');
            
            element(by.id('btnSave')).click();
            
            expect(element(by.binding('SQLErrors')).getText()).toEqual('');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('Role created successfully!!!');
        });
        it('Testing: Save a site, already exist', function() {
            element(by.model('userRole.name')).sendKeys('testE2E');// unique 
            element(by.model('userRole.description')).sendKeys('test descr');
            
            element(by.id('btnSave')).click();
            expect(element(by.binding('SQLErrors')).getText()).toEqual('Role already exists with same name.');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('');
        });

        it('Testing: Update a site', function() {
            getLastUserRole();
            
            element(by.model('userRole.description')).sendKeys('V2');// changed
             
            element(by.id('btnSave')).click();
            expect(element(by.binding('SQLErrors')).getText()).toEqual('');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('Role updated successfully!!!');
        });
        
        it('Testing: Associate permission', function() {
            element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(5).click();
            element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(8).click();
            
            element(by.id('btnAffectPerm')).click();
            
            expect(element.all(by.options('perm.codeName as perm.name for perm in lstSelectedPermissionsObj')).count()).toEqual(2);
            expect(element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).count()).toEqual(22);
        });
        
        it('Testing: Remove a associate permission', function() {
            element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(5).click();
            element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(8).click();
            
            element(by.id('btnAffectPerm')).click();
            
            element.all(by.options('perm.codeName as perm.name for perm in lstSelectedPermissionsObj')).get(0).click();
            
            element(by.id('btnUnaffectPerm')).click();
            
            expect(element.all(by.options('perm.codeName as perm.name for perm in lstSelectedPermissionsObj')).count()).toEqual(1);
            expect(element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).count()).toEqual(23);
        });
        
        it('Testing: Delete a Role', function() {
            getLastUserRole();
            
            element(by.id('btnDelete')).click();
            expect(element(by.binding('SQLErrors')).getText()).toEqual('');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('Role deleted successfully!!!');
        });
    });
    
    describe(' - Advance database operation => ', function() {
        it('Testing: Update a userRole with a other existing unique reference value', function() {
            element(by.model('userRole.name')).sendKeys('testE2E_V2');
            element(by.model('userRole.description')).sendKeys('test descr');
            
            element(by.id('btnSave')).click();
            expect(element(by.binding('SQLErrors')).getText()).toEqual('');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('Role created successfully!!!');
            
            element(by.model('userRole.name')).sendKeys('testE2E_V3');
            element(by.model('userRole.description')).sendKeys('test descr');
            
            element(by.id('btnSave')).click();
            expect(element(by.binding('SQLErrors')).getText()).toEqual('');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('Role created successfully!!!');
            
            getLastUserRole();
            
            element(by.model('userRole.name')).clear();
            element(by.model('userRole.name')).sendKeys('testE2E_V2');
            element(by.id('btnSave')).click();
            
            expect(element(by.binding('SQLErrors')).getText()).toEqual('Update failed: Role already exists with same name.');
            expect(element(by.binding('SQLMsgs')).getText()).toEqual('');
            
            getLastUserRole();
            element(by.id('btnDelete')).click();
            getLastUserRole();
            element(by.id('btnDelete')).click();
        });
        
        it('Testing: Full data validation with database', function() {
            element(by.model('userRole.name')).sendKeys('testE2E');
            element(by.model('userRole.description')).sendKeys('description');
            element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(8).click();
            element(by.id('btnAffectPerm')).click();
            
            element(by.id('btnSave')).click();
            getLastUserRole();
            
            expect(element(by.model('userRole.name')).getAttribute("value")).toEqual('testE2E');
            expect(element(by.model('userRole.description')).getAttribute("value")).toEqual('description');
            expect(element.all(by.options('perm.codeName as perm.name for perm in lstSelectedPermissionsObj')).count()).toEqual(1);
            
            element(by.id('btnDelete')).click();
        });
    });
});