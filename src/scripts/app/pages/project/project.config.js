function ProjectConfig($stateProvider) {
  'ngInject';

  $stateProvider
    .state('main.project', {
      url: '/project',
      params: {
        root: "",
        owner: ""
      },
      controller: 'ProjectCtrl',
      controllerAs: '$ctrl',
      templateUrl: 'app/pages/project/project.html',
      title: 'Project',
    });

}

export default ProjectConfig;
