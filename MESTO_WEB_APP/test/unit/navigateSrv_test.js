describe('Testing the service Navigate => ', function() {
    var navSrv;
    
    beforeEach(module('MESTO'));
    
    beforeEach(inject(function(_navigateSrv_) {
        navSrv = _navigateSrv_;
    }));
    
    it('Testing: get/set Equip', function() {
        expect(navSrv.getEquip()).toBeNull();
        navSrv.setEquip("test");
        expect(navSrv.getEquip()).toEqual("test");
        expect(navSrv.getRoom()).toBeNull();
        expect(navSrv.getSite()).toBeNull();
    });
    
    it('Testing: get/set Room', function() {
        expect(navSrv.getRoom()).toBeNull();
        navSrv.setRoom("test");
        expect(navSrv.getEquip()).toBeNull();
        expect(navSrv.getRoom()).toEqual("test");
        expect(navSrv.getSite()).toBeNull();
    });
    
    it('Testing: get/set Site', function() {
        expect(navSrv.getSite()).toBeNull();
        navSrv.setSite("test");
        expect(navSrv.getEquip()).toBeNull();
        expect(navSrv.getRoom()).toBeNull();
        expect(navSrv.getSite()).toEqual("test");
    });
    
    it('Testing: cleanMemory', function() {
        navSrv.setEquip("test");
        navSrv.setRoom("test");
        navSrv.setSite("test");
        
        navSrv.cleanMemory();
        
        expect(navSrv.getEquip()).toBeNull();
        expect(navSrv.getRoom()).toBeNull();
        expect(navSrv.getSite()).toBeNull();
    });
});