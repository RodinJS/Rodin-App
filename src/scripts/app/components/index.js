/**
 * Created by kh.levon98 on 13-Sep-16.
 */
import angular from 'angular/index';

const MODULE_NAME = 'app.components';

const componentsModule = angular.module(MODULE_NAME, []);

import Compile from './compile/index';
componentsModule.directive('compile', Compile);


import LoaderFactory from './loader/factory';
componentsModule.factory('Loader', LoaderFactory);

import Loader from './loader/index';
componentsModule.directive('loader', Loader);

/*
 * Modals modules
 */

import ModalFactory from './modal/factory';
componentsModule.factory('Modal', ModalFactory);

/// login-modal module

import LoginModal from './modal/login/index';
componentsModule.component('loginModal', LoginModal);


/*
 * Rodin modules
 * */

import RodinVrSceneFactory from './rodin/vrscene/factory';
componentsModule.factory('RodinVrScene', RodinVrSceneFactory);

import RodinVrScene from './rodin/vrscene/index';
componentsModule.directive('rodinVrScene', RodinVrScene);

import RodinTransitionCanvasFactory from './rodin/transitionCanvas/factory';
componentsModule.factory('RodinTransitionCanvas', RodinTransitionCanvasFactory);

import RodinTransitionCanvas from './rodin/transitionCanvas/index';
componentsModule.directive('rodinTransitionCanvas', RodinTransitionCanvas);

/*
 * End of Rodin modules
 * */


export default MODULE_NAME;
