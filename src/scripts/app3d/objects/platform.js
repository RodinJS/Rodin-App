import {SceneManager} from 'https://cdn.rodin.io/v0.0.1/rodinjs/scene/SceneManager.js';
import {ModelLoader} from 'https://cdn.rodin.io/v0.0.1/rodinjs/sculpt/ModelLoader.js';
import {Element} from 'https://cdn.rodin.io/v0.0.1/rodinjs/sculpt/elements/Element.js';
import {EVENT_NAMES} from 'https://cdn.rodin.io/v0.0.1/rodinjs/constants/constants.js';
import {Animation} from 'https://cdn.rodin.io/v0.0.1/rodinjs/animation/Animation.js';
import * as RODIN from 'https://cdn.rodin.io/v0.0.1/rodinjs/RODIN.js';
import {THREE} from 'https://cdn.rodin.io/v0.0.1/vendor/three/THREE.GLOBAL.js';

import {about} from './Popup.js';

const scene = SceneManager.get();

export const platform = ModelLoader.load('/images/app3d/models/platform/landscape.obj');

platform.on('ready', () => {
    scene.add(platform.object3D);
    platform.object3D.position.y = -0.25;
});

const aboutButtonParentAnimation = new Animation('rotate', {
    rotation: {
        y: Math.PI / 4
    }
});
aboutButtonParentAnimation.duration(500);

export const aboutButtonParent = new RODIN.THREEObject(new THREE.Object3D());
aboutButtonParent.on('ready', (evt) => {
    scene.add(evt.target.object3D);
    evt.target.animator.add(aboutButtonParentAnimation);
});


export const aboutButton = new Element(
    {
        width: 0.614,
        height: 0.276,
        image: {
            width: 0.614,
            height: 0.276,
            url: '/images/app3d/img/about_button.png',
            opacity: 1,
            position: { h: 50, v: 50 }
        }
    }
);

aboutButton.on('ready', () => {
    aboutButton.object3D.position.z = 2;
    aboutButton.object3D.rotation.y = Math.PI;
    aboutButton.object3D.position.y = scene.controls.userHeight;
    aboutButtonParent.object3D.add(aboutButton.object3D);
    aboutButton.raycastable = true;
});

aboutButton.on(EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
    evt.target.animator.start('hover');
});

aboutButton.on(EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
    evt.target.animator.start('hoverout');
});

aboutButton.on(EVENT_NAMES.CONTROLLER_KEY_UP, () => {
    aboutButton.raycastable = false;
    //aboutButton.object3D.visible = false;
    about.open();
});

about.on('close', (evt) => {
    if(!aboutButton.object3D) return;
    aboutButton.object3D.remove(evt.target.object3D);
    //aboutButton.object3D.visible = true;
    aboutButton.raycastable = true;
});
about.on('open', (evt) => {
    aboutButton.object3D.add(evt.target.object3D);
    console.log(evt.target.object3D);
});

aboutButton.on('update', (evt) => {
    if (!evt.target.destinationZ) return;
    const delta = evt.target.destinationZ - evt.target.object3D.position.z;
    if (Math.abs(delta) < 0.001) {
        delete evt.target.destinationZ;
        return;
    }

    evt.target.object3D.position.z += delta / RODIN.Time.deltaTime();
});

aboutButton.on(EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
    evt.target.destinationZ = 1.9;
});

aboutButton.on(EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
    evt.target.destinationZ = 2;
});

export const poweredBy = new Element({
    width: 0.5,
    height: 0.182,
    image: {
        width: 0.5,
        height: 0.182,
        url: '/images/app3d/img/powered_by.png',
        opacity: 1,
        position: {h: 50, v: 50}
    }
});
poweredBy.on('ready', (evt) => {
    evt.target.object3D.rotation.x = - Math.PI / 2;
    evt.target.object3D.position.y = 0.01;
    scene.add(evt.target.object3D);
});
