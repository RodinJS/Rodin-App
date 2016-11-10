import angular from 'angular/index';

const MODULE_NAME = 'app.project';

// Create the module where our functionality can attach to
let projectModule = angular.module(MODULE_NAME, []);

// Include our UI-Router config settings
import ProjectConfig from './project.config';
projectModule.config(ProjectConfig);


// Controllers
import ProjectCtrl from './project.controller';
projectModule.controller('ProjectCtrl', ProjectCtrl);


export default MODULE_NAME;
