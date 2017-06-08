import * as RODIN from 'rodin/core';
import {Popup} from './Popup.js';

export class DescriptionThumb extends Popup {
    constructor(data) {
        super();

        this.bgThumb = new RODIN.Element({
            width: 2,
            height: 1.1,
            border: {
                radius: 0.02
            },
            background: {
                color: 0xcccccc
            },
            transparent: false
        });
        this.popupSculpt.add(this.bgThumb);

        const widthLeft = -0.9;
        const widthTop = 0.4;
        /**
         * on bgThumb ready load other elements
         */
        this.projectName = new RODIN.Text({
            text: data.displayName || 'Project name',
            color: 0x333333,
            fontSize: 0.07,
            fontStyle: 'bold'
        });
        this.projectName.position.set(widthLeft + this.projectName._threeObject.geometry.parameters.width / 2, widthTop, 0.006);
        this.popupSculpt.add(this.projectName);

        this.projectDescription = new RODIN.DynamicText({
            text: data.description || 'There is no description',
            color: 0x333333,
            width: 1.2,
            fontSize: 0.04,
            lineHeight: 0.07
        });
        this.projectDescription.position.set(widthLeft + this.projectDescription.width / 2, widthTop - 0.1 - this.projectDescription._threeObject.geometry.parameters.height / 2, 0.006);
        this.popupSculpt.add(this.projectDescription);

        const widthRight = 0.36;

        /**
         * Image Thumb
         * @type {RODIN.Element}
         */
        this.imageThumb = new RODIN.Element({
            width: 0.6,
            height: 0.35,
            border: {
                radius: 0.01
            },
            background: {
                image: {
                    url: data.thumbnail || '/images/app3d/models/control_panel/images/No_Thumb.png'
                }
            },
            transparent: false
        });

        this.imageThumb.on(RODIN.CONST.READY, () => {
            this.imageThumb.position.set(widthRight + this.imageThumb.width / 2, 0.335, 0.006);
            this.popupSculpt.add(this.imageThumb);
        });


        /**
         * User Icon
         * @type {RODIN.Element}
         */
        this.userIcon = new RODIN.Element({
            width: 0.13,
            height: 0.13,
            border: {
                radius: 0.08
            },
            background: {
                image: {
                    url: data.avatar || '/images/app3d/models/control_panel/images/rodin_icon.jpg'
                }
            }
        });

        this.userIcon.on(RODIN.CONST.READY, () => {
            this.userIcon.position.set(widthRight + this.userIcon.width / 2, 0.05, 0.008);
            this.popupSculpt.add(this.userIcon);
        });


        /**
         * Created By
         * @type {RODIN.Text}
         */
        this.createBy = new RODIN.Text({
            text: 'Created by',
            color: 0x808080,
            fontSize: 0.03,
        });
        this.createBy.position.set(widthRight + this.userIcon.width + 0.05 + this.createBy._threeObject.geometry.parameters.width / 2, 0.08, 0.006);
        this.popupSculpt.add(this.createBy);

        /**
         * Username
         * @type {RODIN.Text}
         */
        this.username = new RODIN.Text({
            text: data.owner || 'Rodin team',
            color: 0x333333,
            fontSize: 0.05
        });
        this.username.position.set(widthRight + this.userIcon.width + 0.05 + this.username._threeObject.geometry.parameters.width / 2, 0.02, 0.006);
        this.popupSculpt.add(this.username);

        /**
         * Start experience
         * @type {RODIN.Sculpt}
         */
        this.startExperience = new RODIN.Element({
            width: 0.6,
            height: 0.1,
            border: {
                radius: 0.08
            },
            background: {
                color: 0x2668ef
            },
            label: {
                text: 'START EXPERIENCE',
                color: 0xffffff,
                fontSize: 0.04,
                position: {v: 52, h: 50},
            },
            ppm: 2000
        });

        this.startExperience.on(RODIN.CONST.READY, () => {
            this.startExperience.position.set(widthRight + this.startExperience.width / 2, -0.45, 0.006);
            this.popupSculpt.add(this.startExperience);
        });
        this.startExperience.on(RODIN.CONST.GAMEPAD_HOVER, () => {
            this.startExperience._threeObject.material.opacity = 0.8;
        });
        this.startExperience.on(RODIN.CONST.GAMEPAD_HOVER_OUT, () => {
            this.startExperience._threeObject.material.opacity = 1;
        });
        this.startExperience.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, () => {
            RODIN.messenger.post('startexperience', data);
        });


        /**
         * Back Button
         * @type {RODIN.Sculpt}
         */
        this.backBtn = new RODIN.Element({
            width: 0.6,
            height: 0.1,
            border: {
                radius: 0.08
            },
            background: {
                color: 0x8d8d8d
            },
            label: {
                text: 'BACK',
                color: 0xffffff,
                fontSize: 0.04,
                position: {v: 52, h: 50},
            },
            ppm: 2000
        });

        this.backBtn.on(RODIN.CONST.READY, () => {
            this.backBtn.position.set(0, -0.65, 0.006);
            this.popupSculpt.add(this.backBtn);
        });
        this.backBtn.on(RODIN.CONST.GAMEPAD_HOVER, () => {
            this.backBtn._threeObject.material.opacity = 0.8;
        });
        this.backBtn.on(RODIN.CONST.GAMEPAD_HOVER_OUT, () => {
            this.backBtn._threeObject.material.opacity = 1;
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
