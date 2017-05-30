import * as RODIN from 'rodin/core'
import {Thumbs} from './Thumbs.js';
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

let instance = null;

export class UserProjectsThumbs extends Thumbs {
    constructor(_loggedIn = true) {
        super(2, 2);

        this.loggedInSculpt = new RODIN.Sculpt();
        this.notLoggedInSculpt = new RODIN.Sculpt();

        /**
         * user header data
         */
        const data = userData[0];
        this.userHeader = new UserHeader(_loggedIn, data);
        this.userHeader.logInBar.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, () => {
            this.emit('login', new RODIN.RodinEvent(this));
        });
        this.userHeader.on('logout', () => {
            this.emit('logout', new RODIN.RodinEvent(this));
        });

        this.userHeader.position.y = 0.6;
        this.add(this.userHeader);

        /**
         * Not logged in yet
         */
        this.logInToSeeYourProject = new RODIN.Sculpt('/images/app3d/models/control_panel/not_logged.obj');
        this.logInToSeeYourProject.on(RODIN.CONST.READY, () => {
            this.logInToSeeYourProject._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xb2b2b2
            });

            this.notLoggedInSculpt.add(this.logInToSeeYourProject)
        });

        this.logInToSeeYourProjectText = new RODIN.Text({
            text: 'Log in to see your projects',
            color: 0x999999,
            fontSize: 0.05
        });
        this.logInToSeeYourProjectText.position.z = 0.006;
        this.notLoggedInSculpt.add(this.logInToSeeYourProjectText);

        /**
         * Logged in us a User
         */
        const scrollBarLenght = 1.32;
        this.scrollBar = new ScrollBarHorizontal('/images/app3d/models/control_panel/scroll_bar_horizontal_user.obj',
            scrollBarLenght, 5/*userData.length*/, 4);
        this.scrollBar.on(RODIN.CONST.READY, () => {
            this.scrollBar.position.y = -0.5;
            this.loggedInSculpt.add(this.scrollBar);
        });

        if (data.thumbnail) {
            // TODO: implement logic
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

        this.remove(this.thumbsBar.sculpt);
        this.loggedInSculpt.add(this.thumbsBar.sculpt);
        this.loggedIn = _loggedIn;

        /**
         * leftScrollThumbs
         */
        this.leftScrollThumbs = new RODIN.Sculpt('/images/app3d/models/control_panel/scroll_thumbs.obj');
        this.leftScrollThumbs.on(RODIN.CONST.READY, () => {
            this.leftScrollThumbs.position.set(-0.525, 0, -0.1);
            this.leftScrollThumbs._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xaaaaaa,
                transparent: true,
                opacity: 0.65,
            });
            this.add(this.leftScrollThumbs)
        });

        /**
         * rightScrollThumbs
         */
        this.rightScrollThumbs = new RODIN.Sculpt('/images/app3d/models/control_panel/scroll_thumbs.obj');
        this.rightScrollThumbs.on(RODIN.CONST.READY, () => {
            this.rightScrollThumbs.position.set(0.525, 0, -0.1);
            this.rightScrollThumbs._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xaaaaaa,
                transparent: true,
                opacity: 0.65,
            });
            this.add(this.rightScrollThumbs)
        });

        this.scrollBar.on('change', () => {
            this.leftScrollThumbs.visible = this.scrollBar.currentPage !== 1;
            this.rightScrollThumbs.visible = this.scrollBar.currentPage !== this.scrollBar.pagesNaber;
        });
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

    set userData(value) {
        this._userData = value;
        this.userHeader.userData = value;
    }

    get userData() {
        return this._userData;
    }

    static getInstance() {
        if(!instance) {
            instance = new UserProjectsThumbs();
        }

        return instance;
    }
}