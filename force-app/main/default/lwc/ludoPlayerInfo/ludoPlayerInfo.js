import { LightningElement, api } from 'lwc';

export default class LudoPlayerInfo extends LightningElement {
    @api playerName;
    @api isCurrentMove;
    @api isPlayerJoined;

    constructor() {
        super();
        console.log('in ludopplayerinfo constructor ');
    }

    connectedCallback() {
        console.log('in connectcallback ludoplayerInfo '+ this.playerName + ' '+ this.isCurrentMove);
    }

    componentEventHandler(event) {
        console.log('in event handler of ludoplayer info box');
    }



}