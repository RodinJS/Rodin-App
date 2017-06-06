/**
 * Created by kh.levon98 on 13-Sep-16.
 */

import {APP as VrScene} from "../../../../app3d/index";

function AppRun(AppConstants, $rootScope, Restangular, JWT, $state, $location, $sce, RodinTransitionCanvas, Loader, VRAPI) {
  'ngInject';

  let loader;

  Restangular.addFullRequestInterceptor(function (element, operation, route, url, headers, params, httpConfig) {
    headers["x-access-token"] = JWT.get();
    headers["Access-Control-Allow-Origin"] = "*";
    return {
      headers: headers
    };
  });


  Restangular.setErrorInterceptor(function (response, deferred, responseHandler) {
    if (response.status === 401) {
      JWT.destroy();
      $location.href = this._AppConstants.SITE;
      return false; // error handled
    }

    return true; // error not handled
  });

  $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
      if(fromState.name == 'main.home' && fromState.name !== toState.name){
          angular.element(document.querySelector('canvas')).css('display', 'none');
          window.dispatchEvent(new Event('rodinexithome'));
      }



      if (toState.redirectToWhenAuthenticated && JWT.get()) {
      // User isn’t authenticated
      $state.go(toState.redirectToWhenAuthenticated);
      event.preventDefault();
    }
  });

  // change page title based on state
  $rootScope.$on('$stateChangeSuccess', (event, toState) => {

    $rootScope.setPageTitle(toState.title);

    $rootScope.setPageClass(toState.pageClass);

      if(toState.name == 'main.home'){
          angular.element(document.querySelector('canvas')).css('display', 'block');
          window.dispatchEvent(new Event('rodinenterhome'));
      }

    angular.element(document.querySelectorAll(".webvr-button")).addClass("hidden");
  });


  VrScene.init({
    API: VRAPI
  });

  // Helper method for setting the page's title
  $rootScope.setPageTitle = (title) => {
    $rootScope.pageTitle = '';
    if (title) {
      $rootScope.pageTitle += title;
      $rootScope.pageTitle += ' \u2014 ';
    }
    $rootScope.pageTitle += AppConstants.appName;
  };

  // Helper method for setting the page's class
  $rootScope.setPageClass = (pageClass) => {
    $rootScope.pageClass = pageClass;
  };

  ///
  $rootScope.trustSrc = function (src) {
    return $sce.trustAsResourceUrl(src);
  };

  ///
  $rootScope.trustedHtml = function (html) {
    return $sce.trustedHtml(html);
  };

  if (AppConstants.env !== "prod") {

    ////// debuging /////
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    });
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      console.error('$stateChangeError - fired when an error occurs during transition.');
      console.error(arguments);
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    });
    $rootScope.$on('$viewContentLoading', function (event, viewConfig) {
    });
    $rootScope.$on('$viewContentLoaded', function (event) {
    });
    $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
      console.error('$stateNotFound ----' + unfoundState.to + '---- fired when a state cannot be found by its name.');
      console.error(unfoundState, fromState, fromParams);
    });

  }
}

export default AppRun;
