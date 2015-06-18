var path = require('path');

function createPattern(path) {
    return {pattern: path, included: true, served: true, watched: false};
}

function requirejsPath() {
    return path.dirname(require.resolve('requirejs')) + '/../require.js';
}

var initRequireJs = function(files, config, base) {
    var requirejs = config && config.path ? path.resolve(base, config.path) : requirejsPath();

    files.unshift(createPattern(__dirname + '/adapter.js'));
    files.unshift(createPattern(config && config.path ? (base + '/' + config.path) : requirejsPath));
};

initRequireJs.$inject = ['config.files', 'config.requirejsFramework', 'config.basePath'];

module.exports = {
    'framework:requirejs': ['factory', initRequireJs]
};
