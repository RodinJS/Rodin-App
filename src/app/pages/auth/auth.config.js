function AuthConfig($stateProvider) {
	'ngInject';

	$stateProvider

		.state('main.login', {
			url: '/login',
			controller: 'AuthCtrl as $ctrl',
			templateUrl: 'pages/auth/auth.html',
			title: 'Sign in',
			resolve: {
				auth: function (User) {
					return User.ensureAuthIs(false);
				}
			}
		})
};

export default AuthConfig;
