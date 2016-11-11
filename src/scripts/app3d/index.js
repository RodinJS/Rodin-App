import 'https://cdn.rodinapp.com/three/THREE.GLOBAL.js';

import 'three.js/examples/js/controls/VRControls';
import 'three.js/examples/js/effects/VREffect';


export class APP {
    constructor (params) {
        this.domElement = params.domElement;
        this.API = params.API;

        this.projects = [];
        this.window = params.domElement;

        Object.defineProperty(this.window, "innerWidth", {
            get: function () {
                return this.offsetWidth;
            }
        });
        Object.defineProperty(this.window, "innerHeight", {
            get: function () {
                return this.offsetHeight;
            }
        });

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.window.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.window.innerWidth / this.window.innerHeight, 0.01, 10000);
        this.controls = new THREE.VRControls(this.camera);
        this.controls.standing = true;
        this.effect = new THREE.VREffect(this.renderer);
        this.effect.setSize(this.window.innerWidth, this.window.innerHeight);

        this.getProjects();
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
}
