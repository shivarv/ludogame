import { LightningElement, api, track } from 'lwc';

export default class LudoMiddlePath extends LightningElement {
    @api isHorizontal;
    @track elementCount;
    test = 1;
    // width: 5.83vw;height: 8vh;background-color:green;position: absolute;left:5.83vw;
    constructor() {
        super();
        this.elementCount = [];
        for(let i = 1; i <= 18; i++) {
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
        this.test++;
        //divEle.innerHTML = event.target.id;
        divEle.style.background = 'yellow';
        divEle.style.position   = 'absolute';
        divEle.style.width = '2vw';
        divEle.style.height = '2vh';
        divEle.style.top = '50%';
        divEle.style.left = '50%';
        divEle.style.borderRadius = '50%';
        event.target.appendChild(divEle);
    }
}