import * as RODIN from 'rodin/core'
import {LogOut} from './LogOut.js';

export class UserHeader extends RODIN.Sculpt {
    constructor(_loggedIn = false) {
        super();

        this.notLoggedInSculpt = new RODIN.Sculpt();
        this.loggedInSculpt = new RODIN.Sculpt();

        /**
         * Not logged in yet
         */
        this.notLoggedInBar = new RODIN.Sculpt('/images/app3d/models/control_panel/log_in.obj');
        this.notLoggedInBar.on(RODIN.CONST.READY, () => {
            this.notLoggedInBar._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                color: 0xcccccc,
                side: THREE.DoubleSide,
            });
            this.notLoggedInSculpt.add(this.notLoggedInBar);
        });

        this.notLoggedInBar.on(RODIN.CONST.GAMEPAD_HOVER, () => {
            this.notLoggedInBar._threeObject.children[0].material.color = new THREE.Color(0xd8d8d8);
        });
        this.notLoggedInBar.on(RODIN.CONST.GAMEPAD_HOVER_OUT, () => {
            this.notLoggedInBar._threeObject.children[0].material.color = new THREE.Color(0xcccccc);
        });

        /**
         * Login Icon
         * @type {*}
         */
        this.notLoggedInIcon = new RODIN.Plane(0.09, new THREE.MeshBasicMaterial({
            map: RODIN.Loader.loadTexture('/images/app3d/models/control_panel/images/Log_in_icon.png'),
            transparent: true,
            side: THREE.DoubleSide,
        }));
        this.notLoggedInIcon.position.set(-0.335, 0, 0.006);
        this.notLoggedInSculpt.add(this.notLoggedInIcon);

        /**
         * Loading icon
         * @type {*}
         */
        this.loginIcon = new RODIN.Plane(0.09, new THREE.MeshBasicMaterial({
            map: RODIN.Loader.loadTexture('/images/app3d/models/control_panel/images/loader.png'),
            transparent: true,
            side: THREE.DoubleSide
        }));

        this.loginIcon.on(RODIN.CONST.UPDATE, () => {
            this.loginIcon.rotation.z += RODIN.Time.delta * .005;
        });

        this.loginIcon.position.set(-0.335, 0, 0.006);

        /**
         * Login as Dev
         * @type {RODIN.Text}
         */
        this.asDev = new RODIN.Text({
            text: 'Log in as a developer',
            color: 0x666666,
            fontSize: 0.065
        });
        this.asDev.position.set(0.05, 0, 0.006);
        this.notLoggedInSculpt.add(this.asDev);

        /**
         * Logged in us a User
         */
        this.logOutIconBG = new RODIN.Sculpt('/images/app3d/models/control_panel/user_icon.obj');
        this.logOutIconBG.on(RODIN.CONST.READY, () => {
            this.logOutIconBG._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                color: 0xcccccc,
                side: THREE.DoubleSide,
            });

            this.logOutIconBG.position.x = 0.574;
            this.loggedInSculpt.add(this.logOutIconBG);

            this.logOutIcon = new RODIN.Plane(0.09, new THREE.MeshBasicMaterial({
                map: RODIN.Loader.loadTexture('/images/app3d/models/control_panel/images/Log_out_icon.png'),
                transparent: true,
                side: THREE.DoubleSide,
            }));
            this.logOutIcon.position.z = 0.006;
            this.logOutIconBG.add(this.logOutIcon);
        });

        const logOut = new RODIN.Text({
            text: 'Log Out',
            color: 0x333333,
            fontSize: 0.06
        });
        logOut.position.x = 0.35;
        logOut.visible = false;
        this.add(logOut);

        this.logOutIconBG.on(RODIN.CONST.GAMEPAD_HOVER, () => {
            logOut.visible = true;
            this.logOutIconBG._threeObject.children[0].material.color = new THREE.Color(0xd8d8d8);
        });
        this.logOutIconBG.on(RODIN.CONST.GAMEPAD_HOVER_OUT, () => {
            logOut.visible = false;
            this.logOutIconBG._threeObject.children[0].material.color = new THREE.Color(0xcccccc);
        });
        this.logOutIconBG.on(RODIN.CONST.GAMEPAD_BUTTON_UP, () => {
            const logOutBar = LogOut.getInstance();
            logOutBar.open();
            RODIN.Scene.add(logOutBar);
            logOutBar.on('submit', () => {
                this.emit('logout', new RODIN.RodinEvent(this));
            })
        });

        this.loggedIn = _loggedIn;
    }

    set loggedIn(value) {
        if (value) {
            this.remove(this.notLoggedInSculpt);
            this.add(this.loggedInSculpt);
        } else {
            this.add(this.notLoggedInSculpt);
            this.remove(this.loggedInSculpt);
        }
    }

    showLoading() {
        this.notLoggedInIcon.parent && this.notLoggedInIcon.parent.remove(this.notLoggedInIcon);
        this.notLoggedInSculpt.add(this.loginIcon);
    }

    hideLoading() {
        this.loginIcon.parent && this.loginIcon.parent.remove(this.loginIcon);
        this.notLoggedInSculpt.add(this.notLoggedInIcon);
    }

    set userData(data) {
        if(this.userName)
            this.userName.parent.remove(this.userName);
        
        this.userName = new RODIN.Text({
            text: data.username || 'Rodin team',
            color: 0x333333,
            fontSize: 0.07
        });
        this.userName._threeObject.geometry.computeBoundingSphere();
        this.userName.position.x = (0.17 + 0.062 + this.userName._threeObject.geometry.boundingSphere.radius) - 0.66;
        this.loggedInSculpt.add(this.userName);

        if(this.userAvatar)
            this.userAvatar.parent.remove(this.userAvatar);

        this.userAvatar = new RODIN.Sculpt('/images/app3d/models/control_panel/user_icon.obj');
        this.userAvatar.on(RODIN.CONST.READY, () => {
            this.userAvatar._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
            });

            this.userAvatar._threeObject.children[0].material.map = RODIN.Loader.loadTexture(data.avatar || '/images/app3d/models/control_panel/images/rodin_icon.jpg');
            this.userAvatar.position.x = -0.574;
            this.loggedInSculpt.add(this.userAvatar);
        });
    }
}