import * as RODIN from 'rodin/core'
import {UserHeader} from './UserHeader.js';
import {ThumbBar} from './ThumbBar.js';
import {ScrollBarHorizontal} from './ScrollBarHorizontal.js';

const userData = [{
    description: 'xmas',
    displayName: 'xmas',
    id: '58ac5ca8f3dc8436926f97cc',
    name: 'xmas',
    owner: 'example',
    root: 'xmas',
    thumbnail: '/images/app3d/models/control_panel/images/01.jpg',
    avatar: '/images/app3d/models/control_panel/images/01.jpg'
}];

export class UserProjectsThumbs extends RODIN.Sculpt {
    constructor() {
        super();

        let logged = false;
        if (userData.length) {
            logged = true;
        }
        /**
         * user header data
         */
        const data = userData[0];
        this.userHeader = new UserHeader(logged, data);
        this.add(this.userHeader);

        /**
         *
         */
        this.userProjects = new RODIN.Sculpt();
        this.add(this.userProjects);

        if (!logged) {
            this.thumbBar = new RODIN.Sculpt('/images/app3d/models/control_panel/not_logged.obj');
            this.thumbBar.on(RODIN.CONST.READY, () => {
                this.thumbBar._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                    side: THREE.DoubleSide,
                    color: 0xcccccc
                });

                this.userProjects.add(this.thumbBar)
            });

            this.thumbBarText = new RODIN.Text({
                text: 'Log in to see your projects',
                color: 0x999999,
                fontSize: 0.05
            });
            this.thumbBarText.position.z = 0.006;
            this.userProjects.add(this.thumbBarText);

        } else {
            const scrollBarLenght = 1.32;
            this.scrollBar = new ScrollBarHorizontal('/images/app3d/models/control_panel/scroll_bar_horizontal_user.obj',
                scrollBarLenght, userData.length, 4);
            this.scrollBar.on(RODIN.CONST.READY, () => {
                this.scrollBar.position.y = -0.5;
                this.add(this.scrollBar);
            });

            if (data.thumbnail) {
                this.thumbBar = new RODIN.Sculpt();
                this.userProjects.add(this.thumbBar);

                for (let i = 0; i < userData.length; i++) {
                    const thumb = new ThumbBar('/images/app3d/models/control_panel/thumb_project.obj', data);
                    thumb.on(RODIN.CONST.READY, () => {
                        this.thumbBar.add(thumb)
                    });
                }

            } else {
                this.thumbBar = new RODIN.Sculpt('/images/app3d/models/control_panel/not_logged.obj');
                this.thumbBar.on(RODIN.CONST.READY, () => {
                    this.thumbBar._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        color: 0xcccccc
                    });

                    this.userProjects.add(this.thumbBar)
                });

                this.thumbBarText = new RODIN.Text({
                    text: 'No projects yet :(',
                    color: 0x999999,
                    fontSize: 0.05
                });
                this.thumbBarText.position.z = 0.006;
                this.userProjects.add(this.thumbBarText);
            }
        }
    }
}

