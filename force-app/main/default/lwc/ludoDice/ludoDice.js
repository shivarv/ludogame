import { LightningElement, api } from 'lwc';
import {
    fireComponentEvent, COMPONENTEVENTTYPESMAP 
} from 'c/utils';
export default class LudoDice extends LightningElement {
    @api isOpen;

    constructor() {
        console.log('in constructor of ludodice ');
        super();
    }
    generateDice(event) {
        console.log('in generate Dice ');
        if(!this.isOpen) {
            return;
        }
        this.isOpen = false;
        this.fireRandomNumberEvent();
    }

    fireRandomNumberEvent() {
        console.log('in fireRandomNumberEvent');
        let randNum = Math.floor(Math.random() * 5) + 1;
        let inputData = {data: randNum, isPlatformEvent: false, eventType: COMPONENTEVENTTYPESMAP.RANDOMNUMBEREVENT};
        fireComponentEvent(JSON.stringify(inputData), this, true, true);
    }
}