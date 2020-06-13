import { LightningElement, api } from 'lwc';

import {
    fireComponentEvent,
    COMPONENTEVENTTYPESMAP
} from 'c/utils';

export default class LudoRollModal extends LightningElement {

    connectedCallback() {
        console.log('LudoRollModal connectedcallback ' +this.isopen);
    }

    fireRandomNumberEvent() {
        console.log('in fireRandomNumberEvent');
        let randNum = Math.floor(Math.random() * 5) + 1;
        let inputData = {data: randNum, isPlatformEvent: false, eventType: COMPONENTEVENTTYPESMAP.RANDOMNUMBEREVENT};
        fireComponentEvent(JSON.stringify(inputData), this, false, false);
    }
}