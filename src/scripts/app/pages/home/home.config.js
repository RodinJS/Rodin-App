function HomeConfig($stateProvider) {
  'ngInject';

  $stateProvider
    .state('main.home', {
      url: '/',
      controller: 'HomeCtrl',
      controllerAs: '$ctrl',
      templateUrl: 'app/pages/home/home.html',
      title: 'Home',
    });

}

export default HomeConfig;