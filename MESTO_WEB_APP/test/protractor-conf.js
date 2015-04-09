exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['e2e/sites_test.js',
            'e2e/rooms_test.js',
            'e2e/equipments_test.js'],
    //capabilities: [{browserName: 'IE'/*, browserName:'chrome'*/}] // TODO: make working IE Selenium plugins
    capabilities: {browserName: 'chrome'}
}