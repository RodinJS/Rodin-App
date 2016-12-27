function ErrorConfig($stateProvider) {
	'ngInject';

	$stateProvider
		.state('main.error', {
			url: '/error',
			controller: 'ErrorCtrl',
			controllerAs: '$ctrl',
			templateUrl: 'app/pages/error/error.html',
			title: 'Error',
			pageClass: 'page-404',
		});

}

export default ErrorConfig;
