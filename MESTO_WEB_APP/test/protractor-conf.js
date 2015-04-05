exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['e2e/sites_test.js'],
    //capabilities: [{browserName: 'IE'/*, browserName:'chrome'*/}] // TODO: make working IE Selenium plugins
    capabilities: {browserName: 'chrome'}
}