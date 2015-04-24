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
    
    it('Test date toString YMD', function() { // Phantom has a shitty Date Javascript core
        expect(new Date('2002-01-01').toYMD()).toEqual('2001-12-31'); // it's ok, Javascript behavior
        expect(new Date('toto').toYMD()).toEqual('');
        expect(new Date('01-01-2001').toYMD()).toEqual(''); // Javascript bad creator constructor
        expect(new Date('01/01/2001').toYMD()).toEqual('2001-01-01');
        expect(new Date('0000-00-00').toYMD()).toEqual('');
        expect(new Date('30-12-2001').toYMD()).toEqual('');
        expect(new Date('12-30-2001').toYMD()).toEqual(''); // Bad Javascript behavior
    });
    
    it('Test date toString DMY', function() { // Phantom has a shitty Date Javascript core
        expect(new Date('2002-01-01').toDMY()).toEqual('31-12-2001'); // it's ok, Javascript behavior
        expect(new Date('toto').toDMY()).toEqual('');
        expect(new Date('01-01-2001').toDMY()).toEqual(''); // Javascript bad creator constructor
        expect(new Date('01/01/2001').toDMY()).toEqual('01-01-2001');
        expect(new Date('0000-00-00').toDMY()).toEqual('');
        expect(new Date('30-12-2001').toDMY()).toEqual('');
        expect(new Date('12-30-2001').toDMY()).toEqual(''); // Bad Javascript behavior
    });
});