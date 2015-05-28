describe('e2e User Autority : ', function () {
    function logUser(pUsername, pPwd) {
        element(by.id('loginButton')).click();
        
        element(by.model('logInfo.username')).clear();
        element(by.model('logInfo.username')).sendKeys(pUsername);
        element(by.model('logInfo.pwd')).clear();
        element(by.model('logInfo.pwd')).sendKeys(pPwd);
        
        element(by.id('login')).click();
    }
    
    beforeAll(function() {
        browser.get('http://localhost/MESTO/MESTO_WEB_APP/#/home');
        
        logUser('tester', 'tester');
        
        // Create a new Role
        //   navigation menu
        element(by.id('mnAdmin')).click();
        browser.actions().mouseMove(element(by.id('mnUser'))).perform();
        browser.sleep(500);
        element(by.id('mnRoles')).click();
        
        element(by.id('btnNewUserRole')).click();
        
        // Create the corresponding Role
        element(by.model('userRole.name')).sendKeys('Full -userMng');
        element(by.model('userRole.description')).sendKeys('this is a role test for Security user object');
        
        element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(0).click();
        element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(1).click();
        //element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(2).click();
        element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(3).click();
        element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(4).click();
        element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(5).click();
        element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(6).click();
        //element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(7).click();
        //element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(8).click();
        element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(9).click();
        element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(10).click();
        element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(11).click();
        element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(12).click();
        //element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(13).click();
        element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(14).click();
        element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(15).click();
        element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(16).click();
        element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(17).click();
        element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(18).click();
        element.all(by.options('avaiPerm.codeName as avaiPerm.name for avaiPerm in lstAvailablePermissions')).get(19).click();
        element(by.id('btnAffectPerm')).click();
        
        element(by.id('btnSave')).click();
        
        // navigate to user 
        browser.actions().mouseMove(element(by.id('mnUser'))).perform();
        browser.sleep(500);
        element(by.id('mnVwUsers')).click();
        element(by.id('btnNewUser')).click();
        
        // create the new user
        element(by.model('user.username')).sendKeys('userSecurity'); // unique & required
        element(by.model('user.email')).sendKeys('inactive@test.ca');
        element(by.model('user.password')).sendKeys('Test$4test');
        element(by.model('user.active')).click();
        element(by.model('user.name')).sendKeys('E2E test');
        
        element(by.model('user.role')).element(by.cssContainingText('option', 'Full -userMng')).click();
        
        element(by.id('btnSave')).click();
        
        // Logout
        element(by.id('logoutButton')).click();
        
        // Log new user
        logUser('userSecurity', 'Test$4test');
    });
    
    it('Testing : creating', function() {
        element(by.id('mnAdmin')).click();
        
        browser.actions().mouseMove(element(by.id('mnUser'))).perform();
        browser.sleep(500);
        element(by.id('mnVwUsers')).click();
        
        expect(browser.getCurrentUrl()).toMatch("#/admin/users");
        expect(element(by.id('btnNewUser')).isPresent()).toBeFalsy();
    });
    
    it('Testing : updating & Deleting', function() {
        browser.actions().mouseMove(element(by.id('mnUser'))).perform();
        browser.sleep(500);
        element(by.id('mnVwUsers')).click();
        
        element.all(by.repeater('userList')).last().click();
        expect(browser.getCurrentUrl()).toMatch("#/admin/user"); // redirect occurs compare to other object
        expect(element(by.id("btnSave")).isPresent()).toBeFalsy();  
        expect(element(by.id("btnDelete")).isPresent()).toBeFalsy();
        expect(element(by.id("btnChgPassword")).isPresent()).toBeFalsy();
    });
    
    afterAll(function() {
        // Logout
        element(by.id('logoutButton')).click();
        
        // Log new user
        logUser('tester', 'tester');
        
        element(by.id('mnAdmin')).click();
        
        // delete the user create
        browser.actions().mouseMove(element(by.id('mnUser'))).perform();
        browser.sleep(500);
        element(by.id('mnVwUsers')).click();
        
        var userData = element.all(by.repeater('userList')).last();
        
        userData.element(by.binding('u.username')).getText().then(function(str) {
            if (str == "userSecurity") {
                // delete user
                element.all(by.repeater('userList')).last().click();
                element(by.id('btnDelete')).click();
                
                // delete the user's role
                browser.actions().mouseMove(element(by.id('mnUser'))).perform();
                browser.sleep(500);
                element(by.id('mnRoles')).click();
                
                element.all(by.repeater('userRoleList')).last().click();
                element(by.id('btnDelete')).click();
            }
        });
        
        // Logout
        element(by.id('logoutButton')).click();
    });
});