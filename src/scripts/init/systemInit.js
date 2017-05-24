  window.SCENE_MANAGER_AUTO_CREATE = false;
  function getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1]);
      }
    }

    return 'desktop';
  }
  window.device = getQueryVariable('device');
  window.showBackButtonOnProjectPage = getQueryVariable('backbutton');

  (function (System) {
    var systemnormalize = System.normalize;
    var blacklist = ['systemjs-json'];

    function shouldReverse(parts) {
      return parts.every(function (part) {
        return blacklist.indexOf(part) === -1;
      });
    }

    System.normalize = function (name, parentName) {
      var parts = name.split('!');

      if (parts.length > 1 && shouldReverse(parts)) {
        name = parts.reverse().join('!');
      }

      return systemnormalize.call(this, name, parentName);
    };
  })(System);

  var systemLocate = System.locate;
  System.locate = function (load) {
    var System = this;
    return Promise.resolve(systemLocate.call(this, load)).then(function (address) {
      return address + System.cacheBust;
    });
  };
  System.cacheBust = '?v=0.0.1';

  // System.config({
  //   map: {
  //     css: '/scripts/vendor/systemjs-module/css.js',
  //     glsl: 'https://cdn.rodin.io/v0.0.1/systemjs/glsl.js'  // path to glsl.js file
  //   },
  //   meta: {
  //     'https://cdn.rodin.io/v0.0.1/*.glsl': {
  //       loader: 'glsl'
  //     },
  //     '*': {authorization: true}
  //   },
  //   paths: {
  //     '*': 'scripts/vendor/*',
  //     'app/*': 'app/*',
  //     'app3d/*': 'app3d/*',
  //     'scripts/*': 'scripts/*'
  //   },
  //   packages: {
  //     "https://cdn.rodin.io/v0.0.1/": {  // path to your project root
  //       "defaultJSExtensions": true,
  //       meta: {
  //         '*.glsl': {loader: 'glsl'}
  //       }
  //     },
  //     "/scripts": {  // path to your project root
  //       "defaultJSExtensions": true,
  //       meta: {
  //         '*.css': {loader: 'css'}
  //       }
  //     },
  //     "/": {  // path to your project root
  //       "defaultJSExtensions": true
  //     }
  //   }
  // });

  


(function (global) {

    var paths = {
        'npm:': 'https://cdn.rodin.io/v0.0.6/',
        '*': 'scripts/vendor/*',
        'app/*': 'app/*',
        'app3d/*': 'app3d/*',
        'scripts/*': 'scripts/*'
    };

    var map = {
        'rodin/core': 'npm:core',
        'css': '/scripts/vendor/systemjs-module/css.js',
    };

    var packages = {
        'dist': {main: 'index.js', defaultExtension: 'js'},
        'rodin/core': {main: 'index.js', defaultExtension: 'js'},
        "/scripts": {
          "defaultJSExtensions": true,
          meta: {
            '*.css': {loader: 'css'}
          }
        },
        "/": {
          "defaultJSExtensions": true
        }
    };

    var moduleNames = [
        'core/error',
        'core/time',
        'core/scene',
        'core/sculpt',
        'core/sculpt/elements',
        'core/messenger',
        'core/eventEmitter',
        'core/set',
        'core/initializer',
        'core/constants',
        'core/rodinEvent',
        'core/raycaster',
        'core/controllers',
        'core/animation',
        'core/video',
        'core/button',
        'core/gamePad',
        'core/utils',
        'core/loader',
        'core/plugin',
        'core/particleSystem',
        'core/color',
        'core/camera',
        'core/avatar',
        'core/math'
    ];

    function packIndex(moduleName) {
        packages['' + paths['npm:'] + moduleName + ''] = {main: 'index.js', defaultExtension: 'js'};
    }

    moduleNames.forEach(packIndex);

    var config = {
        paths: paths,
        map: map,
        packages: packages,
        meta: {
            '*': {
                authorization: true
            }
        }
    };

    System.config(config);

})(this);