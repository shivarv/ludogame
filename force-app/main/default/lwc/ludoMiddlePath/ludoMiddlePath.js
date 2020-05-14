import { LightningElement, api, track } from 'lwc';
import { fireComponentEvent, COMPONENTEVENTTYPES } from 'c/utils';

export default class LudoMiddlePath extends LightningElement {
    @api isHorizontal;
    @track elementCount;
    test = 1;
    // width: 5.83vw;height: 8vh;background-color:green;position: absolute;left:5.83vw;
    constructor() {
        super();
        this.elementCount = [];
        for(let i = 18; i >= 1; i--) {
            this.elementCount.push(i);
        }
    }

    itemChosen(event) {
        console.log(JSON.stringify(event.target.id));
        console.log(JSON.stringify(event.target.key));
        let divEle = document.createElement('div');
        if(this.test == 2) {
            event.target.innerHTML = '';
            return;
        }
        let dataNum = 0;
        if(event.target.id) {
            dataNum = event.target.id;
            this.dispatchEvent(new CustomEvent(COMPONENTEVENTTYPES.positionchangeevent, 
                { detail: {data: dataNum} }
                ));
            //fireComponentEvent(COMPONENTEVENTTYPES.PositionChangeEvent, {data: dataNum}, this);
        }
        
        console.log('inner html '+event.target.innerHTML);
        //divEle.innerHTML = event.target.id;
        divEle.style.background = 'yellow';
        divEle.style.position   = 'absolute';
        divEle.style.width = '2vw';
        divEle.style.height = '2vh';
        divEle.style.top = '50%';
        divEle.style.left = '50%';
        divEle.style.borderRadius = '50%';
        divEle.style.border = '1px solid Black';
        event.target.appendChild(divEle);
    }
}