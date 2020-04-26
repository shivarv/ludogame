import { LightningElement, api } from 'lwc';

export default class LudoMiddlePath extends LightningElement {
    @api isHorizontal;
    count  = 24;
    
    // width: 5.83vw;height: 8vh;background-color:green;position: absolute;left:5.83vw;
    constructor() {
        super();
    }
}