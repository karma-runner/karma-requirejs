module.exports = (grunt) ->
  grunt.initConfig
    pkgFile: 'package.json'

    files:
      adapter: ['src/adapter.js']

    build:
      adapter: '<%= files.adapter %>'

    eslint:
      target: [
        'lib/index.js',
        'src/*.js',
        'karma.conf.js',
        'tasks/*.js',
        'test/*.js'
      ]
    karma:
      adapter:
        configFile: 'karma-v0.8.conf.js'
        autoWatch: false
        singleRun: true
        reporters: ['dots']

    'npm-publish':
      options:
        requires: ['build']

    'npm-contributors':
      options:
        commitMessage: 'chore: update contributors'

    bump:
      options:
        commitMessage: 'chore: release v%VERSION%'
        pushTo: 'upstream'


  grunt.loadTasks 'tasks'
  grunt.loadNpmTasks 'grunt-karma'
  grunt.loadNpmTasks 'grunt-bump'
  grunt.loadNpmTasks 'grunt-npm'
  grunt.loadNpmTasks 'grunt-auto-release'
  grunt.loadNpmTasks 'grunt-eslint'

  grunt.registerTask 'default', ['build', 'eslint', 'test']
  grunt.registerTask 'test', ['karma']

  grunt.registerTask 'release', 'Build, bump and publish to NPM.', (type) ->
    grunt.task.run [
      'build',
      'npm-contributors',
      "bump:#{type||'patch'}",
      'npm-publish'
    ]
