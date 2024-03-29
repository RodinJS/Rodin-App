function AuthConfig($stateProvider) {
  'ngInject';

  $stateProvider

    .state('main.login', {
      url: '/login',
      controller: 'AuthCtrl as $ctrl',
      templateUrl: 'app/pages/auth/auth.html',
      title: 'Sign in',
      redirectToWhenAuthenticated: "main.home"
    })
}

export default AuthConfig;
