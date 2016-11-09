import angular from 'angular/index';

const MODULE_NAME = 'app.services';

// Create the module where our functionality can attach to
let servicesModule = angular.module(MODULE_NAME, []);


import UtilsService from './utils.service';
servicesModule.service('Utils', UtilsService);

import ValidatorService from './validator.service';
servicesModule.factory('Validator', ValidatorService);

import AnalyserService from './analyser.service';
servicesModule.factory('Analyser', AnalyserService);

import ErrorService from './error.service';
servicesModule.service('Error', ErrorService);

import JwtService from './jwt.service';
servicesModule.service('JWT', JwtService);

import UserService from './user.service';
servicesModule.service('User', UserService);

import ProjectService from './project.service';
servicesModule.service('Project', ProjectService);

import StorageService from './storage.service';
servicesModule.service('Storage', StorageService);


export default MODULE_NAME;