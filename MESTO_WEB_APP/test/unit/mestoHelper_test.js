describe('Test mestoHelper', function() {
    it('Test date parser', function() {
        expect(Date.parseToDMY('2001-01-01')).toEqual('01-01-2001');
        expect(Date.parseToDMY('20-01-01')).toEqual('');
        expect(Date.parseToDMY('toto')).toEqual('');
        expect(Date.parseToDMY('01-01-2001')).toEqual('01-01-2001');
        expect(Date.parseToDMY('')).toEqual('');
        expect(Date.parseToDMY()).toEqual('');
        expect(Date.parseToDMY('00-00-0000')).toEqual('');
        expect(Date.parseToDMY('0000-00-00')).toEqual('');
    });
});