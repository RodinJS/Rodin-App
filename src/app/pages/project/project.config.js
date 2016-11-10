function ProjectConfig($stateProvider) {
	'ngInject';

	$stateProvider
		.state('main.project', {
			url: '/project',
			params: {
				projectUrl: null
			},
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
