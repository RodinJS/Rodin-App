function ProjectConfig($stateProvider) {
	'ngInject';

	$stateProvider
		.state('landing.project', {
			url: '/project',
			controller: 'ProjectCtrl',
			controllerAs: '$ctrl',
			templateUrl: 'pages/project/project.html',
			title: 'Project',
			resolve: {
				auth: function (User) {
					return User.ensureAuthIs(false);
				}
			}
		});

}

export default ProjectConfig;
