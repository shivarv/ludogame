import { LightningElement, track, api } from 'lwc';
import { fireComponentEvent, COMPONENTEVENTTYPESMAP, fetchHardCodedBlockValues } from 'c/utils';

export default class LudoVerticalPath extends LightningElement {
    @api blockType;
    @track elementCount;
    test = 1;

    constructor() {
        super();
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
        console.log(JSON.stringify(event.target.dataset.val));

        let divEle = document.createElement('div');
        if(this.test == 2) {
            console.log(event.target.querySelectorAll('div'));
            console.log(this.template.querySelectorAll('.divEle'));
            event.target.innerHTML = '';
            this.test = 0;
            return;
        }
        this.test++;

        let dataNum = 0;
        if(event.target.dataset.val) {
            dataNum = event.target.dataset.val;
            fireComponentEvent(COMPONENTEVENTTYPESMAP.positionchangeevent, {data: dataNum}, this);
        }

        console.log('inner html '+event.target.innerHTML);
        console.log(JSON.stringify(event.target.querySelectorAll('div')));
        //divEle.innerHTML = event.target.id;
        divEle.style.background = 'yellow';
        divEle.style.position   = 'absolute';
        divEle.style.width = '2vw';
        divEle.style.height = '2vh';
        divEle.style.top = '50%';
        divEle.style.left = '50%';
        divEle.style.borderRadius = '50%';
        divEle.dataset.player = 'red';
        divEle.className = 'divEle';
        divEle.style.border = '1px solid Black';

        divEle.id ='hardCodeId';
        event.target.appendChild(divEle);
    }


}