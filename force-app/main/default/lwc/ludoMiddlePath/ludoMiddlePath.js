import { LightningElement, api, track } from 'lwc';
import { fireComponentEvent, COMPONENTEVENTTYPESMAP, fetchHardCodedBlockValues } from 'c/utils';

export default class LudoMiddlePath extends LightningElement {
    @api isHorizontal;
    @track elementCount;
    @api blockType;
    test = 1;
    // width: 5.83vw;height: 8vh;background-color:green;position: absolute;left:5.83vw;
    constructor() {
        super();
       // this.blockType = 'block1';
    }

    connectedCallback() {
        console.log(this.blockType);
        this.setupBlockData();
    }


    setupBlockData() {
        let data = fetchHardCodedBlockValues(this.blockType);
        this.elementCount = [];
        if( !(data && Array.isArray(data) && data.length > 0)) {
            return;
        }        
        for(let val of data) {
            this.elementCount.push(val);
        }
    }

    itemChosen(event) {
        console.log(JSON.stringify(event.target.id));
        //val is the custom data-set value
        console.log(event.target.dataset.val);
        let divEle = document.createElement('div');
        if(this.test == 2) {
            event.target.innerHTML = '';
            return;
        }
        let dataNum = 0;
        if(event.target.dataset.val) {
            dataNum = event.target.dataset.val;
            let inputVal = {data: dataNum, firePlatformEvent: true, eventType: COMPONENTEVENTTYPESMAP.positionchangeevent};
            fireComponentEvent(JSON.stringify(inputVal), this);        }
        
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