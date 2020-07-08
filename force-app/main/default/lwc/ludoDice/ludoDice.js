import { LightningElement, api } from 'lwc';
import {
    fireComponentEvent, COMPONENTEVENTTYPESMAP 
} from 'c/utils';
export default class LudoDice extends LightningElement {
    @api isOpen;
    @api currentPlayerTypeTurn;
    @api thisPlayerType;


    constructor() {
        console.log('in constructor of ludodice ');
        super();
    }
    generateDice(event) {
        console.log('in generate Dice ');
        //return if currentplayerturn or thisplayertype is null or
        // currentPlayerTypeTurn !== thisPlayerType
        if(!this.currentPlayerTypeTurn || !this.thisPlayerType
            || this.currentPlayerTypeTurn !== this.thisPlayerType
            ) {
            console.log('in currentPlayerTypeTurn or thisPlayerType empty or not equals'
            + ' : cpt :'+this.currentPlayerTypeTurn + ' : pt : '+this.currentPlayerTypeTurn);
            return;
        }

        if(!this.isOpen) {
            return;
        }
        this.isOpen = false;
        this.fireRandomNumberEvent();
    }

    fireRandomNumberEvent() {
        console.log('in fireRandomNumberEvent');
        let randNum = Math.floor(Math.random() * 5) + 1;
        randNum = 1; // hardCodedValue
        //need to fire platform event after handling
        let inputData = {data: randNum, firePlatformEvent: true, eventType: COMPONENTEVENTTYPESMAP.RANDOMNUMBEREVENT};
        fireComponentEvent(JSON.stringify(inputData), this, true, true);
    }
}