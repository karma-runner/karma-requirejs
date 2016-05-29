/* globals createPatchedLoad, normalizePath */
describe('adapter requirejs', function () {
  var load
  var originalLoadSpy
  var karma

  beforeEach(function () {
    spyOn(console, 'error')
    karma = {
      files: {
        '/base/some/file.js': '12345'
      },
      config: {}
    }
    originalLoadSpy = jasmine.createSpy('requirejs.load')
    load = createPatchedLoad(karma, originalLoadSpy, '/')
  })

  it('should add timestamp', function () {
    load('context', 'module', '/base/some/file.js')

    expect(originalLoadSpy).toHaveBeenCalled()
    expect(originalLoadSpy.calls.mostRecent().args[2]).toBe('/base/some/file.js?12345')
  })

  it('should not append timestamp if not found', function () {
    load('context', 'module', '/base/other/file.js')

    expect(originalLoadSpy).toHaveBeenCalled()
    expect(originalLoadSpy.calls.mostRecent().args[2]).toBe('/base/other/file.js')
  })

  it('should not append timestamp when running in debug mode', function () {
    load = createPatchedLoad(karma, originalLoadSpy, '/debug.html')
    load(null, null, '/base/some/file.js')

    expect(originalLoadSpy).toHaveBeenCalled()
    expect(originalLoadSpy.calls.mostRecent().args[2]).toBe('/base/some/file.js')
  })

  it('should ignore when config.requireJsShowNoTimestampsError exists and is falsy', function () {
    karma.config.requireJsShowNoTimestampsError = false
    load = createPatchedLoad(karma, originalLoadSpy, '/')
    load('context', 'module', '/base/other/file.js')

    expect(console.error).not.toHaveBeenCalled()
  })

  it('should ignore absolute paths with domains', function () {
    load('context', 'module', 'http://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js')

    expect(console.error).not.toHaveBeenCalled()
  })

  it('should log errors when the file is not found', function () {
    load('context', 'module', '/base/other/file.js')

    expect(console.error).toHaveBeenCalled()
    expect(console.error.calls.mostRecent().args[0]).toMatch(/^There is no timestamp for /)
  })

  describe('normalizePath', function () {
    it('should normalize . and .. in the path', function () {
      expect(normalizePath('/base/a/../b/./../x.js')).toBe('/base/x.js')
    })

    it('should log errors when the file is not found', function () {
      load('context', 'module', '/base/other/file.js')

      expect(console.error).toHaveBeenCalled()
      expect(console.error.calls.mostRecent().args[0]).toMatch(/^There is no timestamp for /)
    })

    describe('normalizePath', function () {
      it('should normalize . and .. in the path', function () {
        expect(normalizePath('/base/a/../b/./../x.js')).toBe('/base/x.js')
      })

      it('should preserve .. in the beginning of the path', function () {
        expect(normalizePath('../../a/file.js')).toBe('../../a/file.js')
      })

      it('should remove query parameters', function () {
        expect(normalizePath('/base/a/../b/./../x.js?noext=1')).toBe('/base/x.js')
        expect(normalizePath('../../a/file.js?noext=1')).toBe('../../a/file.js')
        expect(normalizePath('/base/a.js?noext=1')).toEqual('/base/a.js')
      })
    })
  })
})
