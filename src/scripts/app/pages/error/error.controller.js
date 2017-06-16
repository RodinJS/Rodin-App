import {APP as VrScene} from "../../../app3d/index";

class ErrorCtrl {
    constructor(AppConstants, VRAPI) {
        'ngInject';

        this.appName = AppConstants.appName;

        angular.element(document.querySelector('.main-layout')).on('click mousedown mouseup touchstart touchend', (e) => {
            return e.stopPropagation();
        })

        console.log('VrScene inited', VrScene.inited);
        if(!VrScene.inited){
            VrScene.init({
                API: VRAPI
            });
        }
    }

}

export default ErrorCtrl;
