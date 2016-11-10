angular.module('templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('layout/app/app-view.html','<!--<app-header class="header"></app-header>-->\r\n\r\n<div data-ui-view class="clearfix layout app-layout"></div>\r\n\r\n<!-- <app-footer></app-footer> -->\r\n');
$templateCache.put('layout/app/footer.html','<footer>\r\n  <div class="container">\r\n    <a class="logo-font" data-ng-bind="::$ctrl.appName | lowercase"></a>\r\n    <span class="attribution">\r\n      &copy; {{::$ctrl.date | date:\'yyyy\'}}.\r\n    </span>\r\n  </div>\r\n</footer>\r\n');
$templateCache.put('layout/app/header.html','<header>aaa</header>');
$templateCache.put('layout/main/footer.html','<footer>\r\n  <div class="container">\r\n    <a class="logo-font" data-ui-sref="main.home" data-ng-bind="::$ctrl.appName | lowercase"></a>\r\n    <span class="attribution">\r\n      &copy; {{::$ctrl.date | date:\'yyyy\'}}.\r\n    </span>\r\n  </div>\r\n</footer>\r\n');
$templateCache.put('layout/main/header.html','<header>\r\n\r\n</header>');
$templateCache.put('layout/main/main-view.html','<!--<main-header class="header"></main-header>-->\r\n\r\n<div data-ui-view class="clearfix layout main-layout"></div>\r\n\r\n<!-- <main-footer></main-footer> -->\r\n');
$templateCache.put('pages/auth/auth.html','<div class="page clearfix auth-page">\r\n\r\n  <form>\r\n    <div class="form-group">\r\n      <label for="exampleInputEmail1">Email address</label>\r\n      <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email">\r\n    </div>\r\n    <div class="form-group">\r\n      <label for="exampleInputPassword1">Password</label>\r\n      <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">\r\n    </div>\r\n    <div class="form-group">\r\n      <label for="exampleInputFile">File input</label>\r\n      <input type="file" id="exampleInputFile">\r\n      <p class="help-block">Example block-level help text here.</p>\r\n    </div>\r\n    <div class="checkbox">\r\n      <label>\r\n        <input type="checkbox"> Check me out\r\n      </label>\r\n    </div>\r\n    <button type="submit" class="btn btn-default">Submit</button>\r\n  </form>\r\n\r\n</div>\r\n');
$templateCache.put('pages/error/error.html','<div class="page clearfix error-page">\r\n  <div class="main-container">\r\n    <div class="page-404-content">\r\n      <h1>404</h1>\r\n      <h5>The page you looking for cannot be found.</h5>\r\n      <a data-ui-sref="main.home" class="btn btn-primary btn-orange">GO HOME PAGE</a>\r\n    </div>\r\n  </div>\r\n</div>\r\n');
$templateCache.put('pages/home/home.html','<div class="page clearfix home-page" data-vr-scene>\r\n</div>\r\n');
$templateCache.put('pages/project/project.html','<div class="page clearfix project-page">\r\n</div>\r\n');}]);