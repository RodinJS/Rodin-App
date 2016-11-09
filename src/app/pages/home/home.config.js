function HomeConfig($stateProvider) {
	'ngInject';

	$stateProvider
		.state('landing.home', {
			url: '/',
			controller: 'HomeCtrl',
			controllerAs: '$ctrl',
			templateUrl: 'pages/home/home.html',
			title: 'Home'
		});

}

export default HomeConfig;