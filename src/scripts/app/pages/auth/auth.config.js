function AuthConfig($stateProvider) {
	'ngInject';

	$stateProvider

		.state('main.login', {
			url: '/login',
			controller: 'AuthCtrl as $ctrl',
			templateUrl: 'pages/auth/auth.html',
			title: 'Sign in',
		})
}

export default AuthConfig;
