describe('adapter requirejs', function() {
  var load, originalLoadSpy;
  var files = {
    '/base/some/file.js': '12345'
  };

  beforeEach(function() {
    spyOn(console, 'error');
    originalLoadSpy = jasmine.createSpy('requirejs.load');
    load = createPatchedLoad(files, originalLoadSpy, '/');
  });


  it('should add timestamp', function() {
    load('context', 'module', '/base/some/file.js');

    expect(originalLoadSpy).toHaveBeenCalled();
    expect(originalLoadSpy.argsForCall[0][2]).toBe('/base/some/file.js?12345');
  });


  it('should not append timestamp if not found', function() {
    load('context', 'module', '/base/other/file.js');

    expect(originalLoadSpy).toHaveBeenCalled();
    expect(originalLoadSpy.argsForCall[0][2]).toBe('/base/other/file.js');
  });


  it('should not append timestamp when running in debug mode', function() {
    load = createPatchedLoad(files, originalLoadSpy, '/debug.html');
    load(null, null, '/base/some/file.js');

    expect(originalLoadSpy).toHaveBeenCalled();
    expect(originalLoadSpy.argsForCall[0][2]).toBe('/base/some/file.js');
  });

  it('should ignore absolute paths with domains', function() {
    load('context', 'module', 'http://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js');

    expect(console.error).not.toHaveBeenCalled();
  });

  it('should log errors when the file is not found', function() {
    load('context', 'module', '/base/other/file.js');

    expect(console.error).toHaveBeenCalled();
    expect(console.error.mostRecentCall.args[0]).toMatch(/^There is no timestamp for /);
  });


  describe('normalizePath', function() {

    it('should normalize . and .. in the path', function() {
      expect(normalizePath('/base/a/../b/./../x.js')).toBe('/base/x.js');
    });


    it('should preserve .. in the beginning of the path', function() {
      expect(normalizePath('../../a/file.js')).toBe('../../a/file.js');
    });
  });
});
