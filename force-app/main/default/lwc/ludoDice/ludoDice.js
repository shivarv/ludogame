import { LightningElement, api } from 'lwc';

export default class LudoDice extends LightningElement {
    @api isOpen;

    generateDice(event) {
        console.log('in ggenerate Dice ');
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
        fireComponentEvent(JSON.stringify(inputData), this, true, false);
    }
}