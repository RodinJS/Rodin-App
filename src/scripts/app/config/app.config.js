/**
 * Created by kh.levon98 on 13-Sep-16.
 */

function AppConfig(RestangularProvider, $stateProvider, $locationProvider, $urlRouterProvider, AppConstants, $logProvider) {
  'ngInject';

  RestangularProvider.setBaseUrl(AppConstants.API);

  // In this case we are mapping the id of each element to the _id field.
  RestangularProvider.setRestangularFields({
    id: "_id"
  });

  if (AppConstants.env !== "local") {
    $locationProvider.html5Mode(true);

    if (AppConstants.env === "prod") {

      $logProvider.debugEnabled(false);

      console.log = ()=> {

      };

      console.warn = ()=> {

      };

      console.info = ()=> {

      };

      /*
       console.error = ()=> {

       }
       */

    }
  }


  $stateProvider
    .state('app', {
      abstract: true,
      templateUrl: 'app/layout/main/app-view.html',
      resolve: {
        auth: function (User) {
          return User.verifyAuth(true);
        }
      }
    })
    .state('main', {
      abstract: true,
      templateUrl: 'app/layout/main/main-view.html',
      resolve: {
        auth: function (User) {
          return User.verifyAuth(false);
        }
      }
    });


  $urlRouterProvider.otherwise('/error');

}

export default AppConfig;
