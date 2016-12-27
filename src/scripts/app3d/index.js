import {THREE} from 'https://cdn.rodin.space/vendor/three/THREE.GLOBAL.js';
import {SceneManager} from 'https://cdn.rodin.space/rodinjs/scene/SceneManager.js';
import {MouseGamePad} from 'https://cdn.rodin.space/rodinjs/controllers/gamePads/MouseGamePad.js';
import {Element} from 'https://cdn.rodin.space/rodinjs/sculpt/elements/Element.js';
import {THREEObject} from 'https://cdn.rodin.space/rodinjs/sculpt/THREEObject.js';
import {EVENT_NAMES} from 'https://cdn.rodin.space/rodinjs/constants/constants.js';
import * as controllers from './controllers.js';
import './objects/platform.js';
import './objects/lights.js';
import {Helix} from './objects/Helix.js';
import {HelixThumb} from './objects/HelixThumb.js';
import {Popup} from './objects/Popup.js';
import * as icons from './objects/icons.js';

export class APP {
  constructor(params) {
    const helix = new Helix();
    helix.on('ready', (evt) => {
      scene.add(evt.target.object3D);
      evt.target.object3D.position.z = -2.5;
      evt.target.object3D.position.y = scene.controls.userHeight;
    });

    let buttons = MouseGamePad.getInstance().buttons;

    let scene = SceneManager.get();
    scene.setCameraProperty('fov', 70);
    scene.scene.background = new THREE.Color(0xc8c8c8);

    controllers.mouse.onValueChange = function (keyCode) {
      const value = buttons[keyCode - 1].value;
      const direction = value - buttons[keyCode - 1].prevValue > 0 ? 1 : -1;
      helix.concentrate(helix.center + direction);
      buttons[keyCode - 1].prevValue = value;
    };

    let projects = [
      "/images/app3d/img/thumb1.jpg",
      "/images/app3d/img/thumb2.jpg",
      "/images/app3d/img/thumb3.jpg",
      "/images/app3d/img/thumb4.jpg",
      "/images/app3d/img/thumb5.jpg",
      "/images/app3d/img/thumb6.jpg",
      "/images/app3d/img/thumb7.jpg",
      "/images/app3d/img/thumb8.jpg",
      "/images/app3d/img/thumb9.jpg",
      "/images/app3d/img/thumb10.jpg",
      "/images/app3d/img/thumb11.jpg",
      "/images/app3d/img/thumb12.jpg",
      "/images/app3d/img/thumb1.jpg",
      "/images/app3d/img/thumb2.jpg",
      "/images/app3d/img/thumb3.jpg",
      "/images/app3d/img/thumb4.jpg",
      "/images/app3d/img/thumb5.jpg",
      "/images/app3d/img/thumb6.jpg",
      "/images/app3d/img/thumb7.jpg",
      "/images/app3d/img/thumb8.jpg",
      "/images/app3d/img/thumb9.jpg",
    ];

    for (let i = 0; i < projects.length; i++) {
      helix.addThumb(new HelixThumb({
        image: projects[i],
        name: projects[i]
      }));
    }
  }

  getProjects() {
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

  /**
   * Static method init window
   * @param _window
   * @returns {*}
   */
  static initWindow(_window) {
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
