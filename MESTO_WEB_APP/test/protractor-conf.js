exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    framework: 'jasmine2',
    specs: [
            'e2e/loginButton_test.js',
            'e2e/sites_test.js',
            'e2e/rooms_test.js',
            'e2e/equipments_test.js',
            'e2e/users_test.js',
            
            'e2e/securityUser_test.js',
            'e2e/securityEquipement_test.js',
            'e2e/securityRoom_test.js',
            'e2e/securitySite_test.js'
            ],
    //capabilities: [{browserName: 'IE'/*, browserName:'chrome'*/}] // TODO: make working IE Selenium plugins
    capabilities: {browserName: 'chrome'}
}