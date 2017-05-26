import * as RODIN from 'rodin/core'
import {UserHeader} from './UserHeader.js';
import {ThumbBar} from './ThumbBar.js';
import {ScrollBarHorizontal} from './ScrollBarHorizontal.js';

const userData = [{
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.',
    displayName: 'xmas',
    id: '58ac5ca8f3dc8436926f97cc',
    name: 'xmas',
    owner: 'example',
    root: 'xmas',
    thumbnail: '/images/app3d/models/control_panel/images/01.jpg',
    avatar: '/images/app3d/models/control_panel/images/01.jpg'
}];

export class UserProjectsThumbs extends RODIN.Sculpt {
    constructor(_loggedIn = true) {
        super();

        this.loggedInSculpt = new RODIN.Sculpt();
        this.notLoggedInSculpt = new RODIN.Sculpt();

        /**
         * user header data
         */
        const data = userData[0];
        this.userHeader = new UserHeader(_loggedIn, data);
        this.userHeader.position.y = 0.6;
        this.add(this.userHeader);

        /**
         * Not logged in yet
         */
        this.seeYourProject = new RODIN.Sculpt('/images/app3d/models/control_panel/not_logged.obj');
        this.seeYourProject.on(RODIN.CONST.READY, () => {
            this.seeYourProject._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xcccccc
            });

            this.notLoggedInSculpt.add(this.seeYourProject)
        });

        this.seeYourProjectText = new RODIN.Text({
            text: 'Log in to see your projects',
            color: 0x999999,
            fontSize: 0.05
        });
        this.seeYourProjectText.position.z = 0.006;
        this.notLoggedInSculpt.add(this.seeYourProjectText);

        /**
         * Logged in us a User
         */
        const scrollBarLenght = 1.32;
        this.scrollBar = new ScrollBarHorizontal('/images/app3d/models/control_panel/scroll_bar_horizontal_user.obj',
            scrollBarLenght, userData.length, 4);
        this.scrollBar.on(RODIN.CONST.READY, () => {
            this.scrollBar.position.y = -0.5;
            this.loggedInSculpt.add(this.scrollBar);
        });

        if (data.thumbnail) {
            this.thumbBar = new RODIN.Sculpt();
            this.loggedInSculpt.add(this.thumbBar);

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

                this.loggedInSculpt.add(this.thumbBar)
            });

            this.thumbBarText = new RODIN.Text({
                text: 'No projects yet :(',
                color: 0x999999,
                fontSize: 0.05
            });
            this.thumbBarText.position.z = 0.006;
            this.loggedInSculpt.add(this.thumbBarText);
        }

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

        this.userHeader.loggedIn = value;
    }
}