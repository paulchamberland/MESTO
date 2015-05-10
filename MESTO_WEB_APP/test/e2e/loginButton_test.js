describe('E2E: Login Pop-up =>', function() {
    beforeEach(function() {
        browser.get('http://localhost/MESTO/MESTO_WEB_APP/#/home');
    });
    
    it('Testing: Open the popup and log with error', function() {
        element(by.id('loginButton')).click();
        
        element(by.model('logInfo.username')).clear();
        element(by.model('logInfo.username')).sendKeys('test');
        element(by.model('logInfo.pwd')).clear();
        element(by.model('logInfo.pwd')).sendKeys('test');
        
        element(by.id('login')).click();
        
        expect(element(by.model('logInfo.username')).getAttribute("class")).toMatch("ng-invalid-wrong");
        expect(element(by.model('logInfo.pwd')).getAttribute("class")).toMatch("ng-invalid-wrong");
    });
    
    it('Testing: Open the popup and log with success', function() {
        element(by.id('loginButton')).click();
        
        element(by.model('logInfo.username')).clear();
        element(by.model('logInfo.username')).sendKeys('tester');
        element(by.model('logInfo.pwd')).clear();
        element(by.model('logInfo.pwd')).sendKeys('tester');
        
        element(by.id('login')).click();
        
        expect(browser.getCurrentUrl()).not.toContain('#/admin');
        
        element(by.id('mnAdmin')).click();
        
        expect(browser.getCurrentUrl()).toContain('#/admin/home');
    });
    
    it('Testing: Open login page and failed to log', function() {
        browser.get('http://localhost/MESTO/MESTO_WEB_APP/#/admin');
        expect(browser.getCurrentUrl()).toContain('#/admin');
        
        element(by.model('logInfo.username')).clear();
        element(by.model('logInfo.username')).sendKeys('test');
        element(by.model('logInfo.pwd')).clear();
        element(by.model('logInfo.pwd')).sendKeys('test');
        
        element(by.id('login')).click();
        
        expect(element(by.model('logInfo.username')).getAttribute("class")).toMatch("ng-invalid-wrong");
        expect(element(by.model('logInfo.pwd')).getAttribute("class")).toMatch("ng-invalid-wrong");
        
        expect(browser.getCurrentUrl()).toContain('#/admin');
    });
    it('Testing: Open login page and log with success', function() {
        browser.get('http://localhost/MESTO/MESTO_WEB_APP/#/admin');
        expect(browser.getCurrentUrl()).toContain('#/admin');
        
        element(by.model('logInfo.username')).clear();
        element(by.model('logInfo.username')).sendKeys('tester');
        element(by.model('logInfo.pwd')).clear();
        element(by.model('logInfo.pwd')).sendKeys('tester');
        
        element(by.id('login')).click();
        
        expect(browser.getCurrentUrl()).toContain('#/admin/home');
    });
});