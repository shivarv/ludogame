import { LightningElement, track } from 'lwc';

export default class LudoVerticalPath extends LightningElement {
    @track elementCount;
    test = 1;
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
            console.log(event.target.querySelectorAll('div'));
            console.log(this.template.querySelectorAll('.divEle'));
            event.target.innerHTML = '';
            this.test = 0;
            return;
        }
        this.test++;
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
        divEle.id ='hardCodeId';
        event.target.appendChild(divEle);
    }


}