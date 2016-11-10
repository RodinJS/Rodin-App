import * as THREE from './three/three';

import 'three.js/examples/js/controls/VRControls';
import 'three.js/examples/js/controls/VRControls';
import 'three.js/examples/js/effects/VREffect';


class APP {
    constructor (params) {
        this.domElement = params.domElement;
        this.API = params.API;

        this.projects = [];
        this.window = params.domElement;

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.window.appendChild(renderer.domElement);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.window.innerWidth / this.window.innerHeight, 0.01, 10000);
        this.controls = new THREE.VRControls(camera);
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

export {APP};