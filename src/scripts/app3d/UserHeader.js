import * as RODIN from 'rodin/core'

export class UserHeader extends RODIN.Sculpt {
    constructor(_loggedIn = false, data) {
        super();

        this.loggedInSculpt = new RODIN.Sculpt();
        this.notLoggedInSculpt = new RODIN.Sculpt();


        /**
         * Not logged in yet
         */
        this.logInBar = new RODIN.Sculpt('/images/app3d/models/control_panel/log_in.obj');
        this.logInBar.on(RODIN.CONST.READY, () => {
            this.logInBar._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                color: 0xcccccc,
                side: THREE.DoubleSide,
            });
            this.notLoggedInSculpt.add(this.logInBar);
        });

        this.logOutIcon = new RODIN.Plane(0.09, new THREE.MeshBasicMaterial({
            map: RODIN.Loader.loadTexture('/images/app3d/models/control_panel/images/Log_in_icon.png'),
            transparent: true,
            side: THREE.DoubleSide,
        }));
        this.logOutIcon.position.set(-0.335, 0, 0.006);
        this.notLoggedInSculpt.add(this.logOutIcon);

        this.asDev = new RODIN.Text({
            text: 'Log in as developer',
            color: 0x666666,
            fontSize: 0.07
        });
        this.asDev.position.set(0.05, 0, 0.006);
        this.notLoggedInSculpt.add(this.asDev);

        /**
         * Logged in us a User
         */
        this.userInfoBar = new RODIN.Sculpt('/images/app3d/models/control_panel/user_icon.obj');
        this.userInfoBar.on(RODIN.CONST.READY, () => {
            this.userInfoBar._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
            });

            if (data.avatar) {
                this.userInfoBar._threeObject.children[0].material.map = RODIN.Loader.loadTexture(data.avatar)
            } else {
                this.userInfoBar._threeObject.children[0].material.map = RODIN.Loader.loadTexture('/images/app3d/models/control_panel/images/rodin_icon.jpg')
            }

            this.userInfoBar.position.x = -0.574;
            this.loggedInSculpt.add(this.userInfoBar);
        });

        if (data.name) {
            this.userName = new RODIN.Text({
                text: data.name.toString(),
                color: 0x666666,
                fontSize: 0.07
            });
            this.userName.position.x = -0.35;
            this.loggedInSculpt.add(this.userName);
        } else {
            this.userName = new RODIN.Text({
                text: 'Rodin team',
                color: 0x666666,
                fontSize: 0.07
            });
            this.userName.position.x = -0.35;
            this.loggedInSculpt.add(this.userName);
        }

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
            color: 0x666666,
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
}