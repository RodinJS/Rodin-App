import 'https://cdn.rodinapp.com/three/THREE.GLOBAL.js';

import 'three.js/examples/js/controls/VRControls';
import 'three.js/examples/js/effects/VREffect';

export class Scene extends THREE.Scene {
    constructor (_window) {
        super();

        this.window = _window;
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.camera = new THREE.PerspectiveCamera(75, this.window.innerWidth / this.window.innerHeight, 0.01, 10000);
        this.window.appendChild(this.renderer.domElement);
        this.controls = new THREE.VRControls(this.camera);
        this.controls.standing = true;
        this.effect = new THREE.VREffect(this.renderer);
        this.effect.setSize(this.window.innerWidth, this.window.innerHeight);

        window.addEventListener('resize', this.onResize.bind(this), true);
        window.addEventListener('vrdisplaypresentchange', this.onResize.bind(this), true);
    }

    onResize () {
        this.effect.setSize(this.window.innerWidth, this.window.innerHeight);
        this.camera.aspect = this.window.innerWidth / this.window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}
