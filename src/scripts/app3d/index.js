import 'https://cdn.rodinapp.com/three/THREE.GLOBAL.js';
import {Scene} from './scene/scene';
import {Skybox} from './skybox/skybox';

import 'three.js/examples/js/controls/VRControls';
import 'three.js/examples/js/effects/VREffect';


export class APP {
    constructor (params) {
        this.domElement = params.domElement;
        this.API = params.API;

        this.projects = [];
        this.window = APP.initWindow(params.domElement);

        this.scene = new Scene(this.window);
        this.skybox = new Skybox('images/skybox.jpg', 3400);

        this.scene.add(this.skybox);

        this.manager = new WebVRManager(
            this.scene.renderer,
            this.scene.effect,
            {
                hideButton: false,
                isUndistorted: false
            }
        );

        requestAnimationFrame(this.animate.bind(this));
        // this.getProjects();
    }

    getProjects () {
        let filters = {
            skip: 0,
            limit: 20
        };

        this.API.getProjects('all', filters).then(
            data => {
                console.log(data);
            },
            err => {
                console.log(err);
            }
        )
    }

    animate (timestamp) {
        this.scene.controls.update();
        this.manager.render(this.scene, this.scene.camera, timestamp);
        requestAnimationFrame(this.animate.bind(this));
    }

    /**
     * Static method init window
     * @param _window
     * @returns {*}
     */
    static initWindow (_window) {
        Object.defineProperty(_window, "innerWidth", {
            get: function () {
                return this.offsetWidth;
            }
        });
        Object.defineProperty(_window, "innerHeight", {
            get: function () {
                return this.offsetHeight;
            }
        });

        return _window;
    }
}
