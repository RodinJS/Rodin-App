import 'https://cdn.rodinapp.com/three/THREE.GLOBAL.js';

export class Skybox extends THREE.Mesh {
    constructor (img, sphereSize) {
        let material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(img)
        });

        let geometry = new THREE.SphereBufferGeometry(sphereSize, 18, 12);
        geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

        super(geometry, material);

        this.castShadow = false;
    }
}