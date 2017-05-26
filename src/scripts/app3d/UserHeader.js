import * as RODIN from 'rodin/core'

export class UserHeader extends RODIN.Sculpt {
    constructor(logged, data) {
        super();
        this.headerBar = new RODIN.Sculpt();
        this.headerBar.position.y = 0.6;
        this.add(this.headerBar);

        /**
         * Not logged in yet
         */
        if (!logged) {
            this.logInBar = new RODIN.Sculpt('/images/app3d/models/control_panel/log_in.obj');
            this.logInBar.on(RODIN.CONST.READY, () => {
                this.logInBar._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                    color: 0xcccccc,
                    side: THREE.DoubleSide,
                });
                this.headerBar.add(this.logInBar);
            });

            this.logInIcon = new RODIN.Plane(0.09, new THREE.MeshBasicMaterial({
                map: RODIN.Loader.loadTexture('/images/app3d/models/control_panel/images/Log_in_icon.png'),
                transparent: true,
                side: THREE.DoubleSide,
            }));
            this.logInIcon.position.set(-0.335, 0, 0.006);
            this.headerBar.add(this.logInIcon);

            this.userName = new RODIN.Text({
                text: 'Log in as developer',
                color: 0x666666,
                fontSize: 0.07
            });
            this.userName.position.set(0.05, 0, 0.006);
            this.headerBar.add(this.userName);

        } else {
            /**
             * Logged in us a User
             */
            this.logInBar = new RODIN.Sculpt('/images/app3d/models/control_panel/user_icon.obj');
            this.logInBar.on(RODIN.CONST.READY, () => {
                this.logInBar._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                    side: THREE.DoubleSide,
                });

                if (data.avatar) {
                    this.logInBar._threeObject.children[0].material.map = RODIN.Loader.loadTexture(data.avatar)
                } else {
                    this.logInBar._threeObject.children[0].material.map = RODIN.Loader.loadTexture('/images/app3d/models/control_panel/images/rodin_icon.jpg')
                }

                this.logInBar.position.x = -0.574;
                this.headerBar.add(this.logInBar);
            });

            if (data.name) {
                this.userName = new RODIN.Text({
                    text: data.name.toString(),
                    color: 0x666666,
                    fontSize: 0.07
                });
                this.userName.position.x = -0.35;
                this.headerBar.add(this.userName);
            } else {
                this.userName = new RODIN.Text({
                    text: 'Rodin team',
                    color: 0x666666,
                    fontSize: 0.07
                });
                this.userName.position.x = -0.35;
                this.headerBar.add(this.userName);
            }

            this.logInIconBG = new RODIN.Sculpt('/images/app3d/models/control_panel/user_icon.obj');
            this.logInIconBG.on(RODIN.CONST.READY, () => {
                this.logInIconBG._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                    color: 0xcccccc,
                    side: THREE.DoubleSide,
                });

                this.logInIconBG.position.x = 0.574;
                this.headerBar.add(this.logInIconBG);

                this.logInIcon = new RODIN.Plane(0.09, new THREE.MeshBasicMaterial({
                    map: RODIN.Loader.loadTexture('/images/app3d/models/control_panel/images/Log_out_icon.png'),
                    transparent: true,
                    side: THREE.DoubleSide,
                }));
                this.logInIcon.position.z = 0.006;
                this.logInIconBG.add(this.logInIcon);
            });
        }
    }
}