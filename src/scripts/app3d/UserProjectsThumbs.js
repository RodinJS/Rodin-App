import * as RODIN from "rodin/core";
import {Thumbs} from "./Thumbs.js";
import {UserHeader} from "./UserHeader.js";
import {Scrolling} from "./Scrolling.js";

let instance = null;
let _API = null;

export class UserProjectsThumbs extends Thumbs {
    constructor(total, _loggedIn = false) {
        super(2, 2, (params) => {
            return _API.getProjects('me', params).then((data) => {
                return Promise.resolve(data);
            });
        }, total);

        this.loggedInSculpt = new RODIN.Sculpt();
        this.notLoggedInSculpt = new RODIN.Sculpt();

        /**
         * user header data
         */
        this.userHeader = new UserHeader(_loggedIn);
        this.userHeader.notLoggedInBar.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, () => {
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
            color: 0x333333,
            fontSize: 0.05
        });
        this.logInToSeeYourProjectText.position.z = 0.006;
        this.notLoggedInSculpt.add(this.logInToSeeYourProjectText);

        /**
         * Logged in us a User
         */
        const scrollBarLenght = 1.32;
        this.scrollBar = new Scrolling('/images/app3d/models/control_panel/scroll_bar_horizontal_user.obj', scrollBarLenght, total, 2, 2);
        this.scrollBar.on(RODIN.CONST.READY, () => {
            this.scrollBar.position.y = -0.5;
            this.loggedInSculpt.add(this.scrollBar);
        });

        this.scrollBar.on(RODIN.CONST.UPDATE, () => {
            if (this.thumbsBar)
                this.scrollBar.currentPage = this.thumbsBar.start / (total - 3);
        });

        this.noProjectsYet = new RODIN.Sculpt();
        this.loggedInSculpt.add(this.noProjectsYet);
        this.thumbBar = new RODIN.Sculpt('/images/app3d/models/control_panel/not_logged.obj');
        this.thumbBar.on(RODIN.CONST.READY, () => {
            this.thumbBar._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xcccccc
            });
            this.noProjectsYet.add(this.thumbBar)
        });

        this.thumbBarText = new RODIN.Text({
            text: 'No projects yet :(',
            color: 0x999999,
            fontSize: 0.05
        });
        this.thumbBarText.position.z = 0.006;
        this.noProjectsYet.add(this.thumbBarText);

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
            this.add(this.leftScrollThumbs);
            if (this.scrollBar.isReady) {
                this.leftScrollThumbs.visible = this.scrollBar.currentPage !== 1;
            }
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
            this.add(this.rightScrollThumbs);
            if (this.scrollBar.isReady) {
                this.rightScrollThumbs.visible = this.scrollBar.currentPage !== this.scrollBar.pagesNaber;
            }
        });

        this.scrollBar.on('change', () => {
            if (this.leftScrollThumbs.isReady && this.rightScrollThumbs.isReady) {
                this.leftScrollThumbs.visible = this.scrollBar.currentPage !== 1;
                this.rightScrollThumbs.visible = this.scrollBar.currentPage !== this.scrollBar.pagesNaber;
            }
        });
    }

    createThumbs(total) {
        super.createThumbs();

        if (total !== 0)
            this.noProjectsYet.visible = false;
        else
            this.noProjectsYet.visible = true;

    }

    get isUserProjectsThumbs() {
        return true;
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

    static getInstance(API, total) {
        if (!instance) {
            _API = API;
            instance = new UserProjectsThumbs(total);
        }

        return instance;
    }
}