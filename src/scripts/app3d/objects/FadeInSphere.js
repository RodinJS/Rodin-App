import * as RODIN from 'https://cdn.rodin.io/v0.0.1/rodinjs/RODIN.js';
import {THREE} from 'https://cdn.rodin.io/v0.0.1/vendor/three/THREE.GLOBAL.js';
import {Animation} from 'https://cdn.rodin.io/v0.0.1/rodinjs/animation/Animation.js';

const fadeInAnimation = new Animation('fadeIn', {material: {opacity: 1}});
fadeInAnimation.duration(300);
const fadeOutAnimation = new Animation('fadeOut', {material: {opacity: 0}});
fadeOutAnimation.duration(1);

export class FadeInSphere extends RODIN.THREEObject {
    constructor() {
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(.1, 10, 10),
            new THREE.MeshBasicMaterial({color: 0x000000, transparent: true, side: THREE.DoubleSide, opacity: 0})
        );
        super(sphere);

        this.animator.add(fadeInAnimation, fadeOutAnimation);
    }

    fadeIn() {
        if (this.animator.isPlaying('fadeIn'))
            return;

        this.animator.stop('fadeOut', false);
        this.animator.start('fadeIn');
    }

    fadeOut() {
        if (this.animator.isPlaying('fadeOut'))
            return;

        this.animator.stop('fadeIn', false);
        this.animator.start('fadeOut');
    }
}