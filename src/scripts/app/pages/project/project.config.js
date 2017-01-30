function ProjectConfig($stateProvider) {
  'ngInject';

  $stateProvider
    .state('main.project', {
      url: '/project/:owner/:root?no_fullscreen=&start_mode=',
      controller: 'ProjectCtrl',
      controllerAs: '$ctrl',
      templateUrl: 'app/pages/project/project.html',
      title: 'Project',
    });

}

export default ProjectConfig;
