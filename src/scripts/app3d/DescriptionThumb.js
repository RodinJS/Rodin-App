import * as RODIN from 'rodin/core';
import {Popup} from './Popup.js';

export class DescriptionThumb extends Popup {
    constructor(data) {
        super();

        this.bgThumb = new RODIN.Sculpt('/images/app3d/models/control_panel/description_thumb.obj');
        this.bgThumb.on(RODIN.CONST.READY, () => {
            this.bgThumb._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xcccccc
            });
            this.add(this.bgThumb);
        });

        this.projectName = new RODIN.Text({
            text: data.displayName || 'Project name',
            color: 0x333333,
            fontSize: 0.09
        });
        this.projectName.position.set(-0.3, 0.42, 0.006);
        this.add(this.projectName);


        this.projectDescription = new RODIN.DynamicText({
            text: data.description || 'There is no description',
            color: 0x333333,
            width: 1.2,
            fontSize: 0.04,
            lineHeight: 0.076
        });
        this.projectDescription.position.set(-0.3, 0, 0.006);
        this.add(this.projectDescription);


        const widthRight = 0.66;

        this.imageThumb = new RODIN.Sculpt('/images/app3d/models/control_panel/thumb_project.obj');
        this.imageThumb.on(RODIN.CONST.READY, () => {
            this.imageThumb._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                map: RODIN.Loader.loadTexture(data.thumbnail)
            });
            this.imageThumb.scale.multiplyScalar(0.9);
            this.imageThumb.position.set(widthRight, 0.335, 0.006);
            this.add(this.imageThumb);
        });

        this.userIcon = new RODIN.Sculpt('/images/app3d/models/control_panel/user_icon.obj');
        this.userIcon.on(RODIN.CONST.READY, () => {
            this.userIcon._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
            });

            if (data.avatar) {
                this.userIcon._threeObject.children[0].material.map = RODIN.Loader.loadTexture(data.avatar)
            } else {
                this.userIcon._threeObject.children[0].material.map = RODIN.Loader.loadTexture('/images/app3d/models/control_panel/images/rodin_icon.jpg')
            }
            this.userIcon.scale.set(0.75, 0.75, 0.75);
            this.userIcon.position.set(widthRight, 0.05, 0.006);
            this.add(this.userIcon);
        });

        this.createBy = new RODIN.Text({
            text: 'Create by',
            color: 0x808080,
            fontSize: 0.03,
        });
        this.createBy.position.set(widthRight, -0.05, 0.006);
        this.add(this.createBy);

        this.userName = new RODIN.Text({
            text: data.name || 'Rodin team',
            color: 0x333333,
            fontSize: 0.06,
            width: 0.5
        });
        this.userName.position.set(widthRight, -0.12, 0.006);
        this.add(this.userName);


        this.startExperience = new RODIN.Sculpt('/images/app3d/models/control_panel/log_in.obj');
        this.startExperience.on(RODIN.CONST.READY, () => {
            this.startExperience._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0x2668ef
            });
            this.startExperience.scale.set(0.6, 0.6, 0.6);
            this.startExperience.position.set(widthRight, -0.45, 0.006);
            this.add(this.startExperience);

            this.startExp = new RODIN.Text({
                text: 'START EXPERIENCE',
                color: 0xFFFFFF,
                fontSize: 0.06
            });
            this.startExp.position.set(0, 0, 0.006);
            this.startExperience.add(this.startExp);
        });
        this.startExperience.on(RODIN.CONST.GAMEPAD_HOVER, () => {
            this.startExperience._threeObject.children[0].material.color = new THREE.Color(0x3d7dff);
        });
        this.startExperience.on(RODIN.CONST.GAMEPAD_HOVER_OUT, () => {
            this.startExperience._threeObject.children[0].material.color = new THREE.Color(0x2668ef);
        });

        this.backBtn = new RODIN.Sculpt('/images/app3d/models/control_panel/log_in.obj');
        this.backBtn.on(RODIN.CONST.READY, () => {
            this.backBtn._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xb2b2b2
            });
            this.backBtn.scale.set(0.6, 0.6, 0.6);
            this.backBtn.position.set(0, -0.65, 0.006);
            this.add(this.backBtn);

            this.back = new RODIN.Text({
                text: 'BACK',
                color: 0xFFFFFF,
                fontSize: 0.06
            });
            this.back.position.set(0, 0, 0.006);
            this.backBtn.add(this.back);
        });
        this.backBtn.on(RODIN.CONST.GAMEPAD_HOVER, () => {
            this.backBtn._threeObject.children[0].material.color = new THREE.Color(0xbfbfbf);
        });
        this.backBtn.on(RODIN.CONST.GAMEPAD_HOVER_OUT, () => {
            this.backBtn._threeObject.children[0].material.color = new THREE.Color(0xb2b2b2);
        });
        this.backBtn.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, () => {
            this.close();
        });

        this.on('open', () => {
            RODIN.messenger.post('popupopened', {popupName: 'description'});
        });

        this.on('close', () => {
            // todo: dispose it
            this.parent.remove(this);
            RODIN.messenger.post('popupclosed', {popupName: 'description'});
        });
    }
}
