import { LightningElement, track, api } from 'lwc';
import { fireComponentEvent, COMPONENTEVENTTYPESMAP,PLATFORMEVENTTYPESMAP, PLAYERCOLORMAP,
    PLAYERLIST,
    fetchHardCodedBlockValues, setDivCss } from 'c/utils';

export default class LudoVerticalPath extends LightningElement {
    @api blockType;
    @track elementCount;
    test = 1;
    @api playerType;
    @api playerIndex;
    constructor() {
        super();
        this.playerIndex = 0;
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
        /*
        let divEle = document.createElement('div');
        if(this.test == 2) {
            console.log(event.target.querySelectorAll('div'));
            console.log(this.template.querySelectorAll('.divEle'));
            event.target.innerHTML = '';
            this.test = 0;
            return;
        }
        this.test++; */

        let dataNum = 0;
        if(event.target.dataset.val) {
            dataNum = event.target.dataset.val;
            let inputVal = {data: dataNum, firePlatformEvent: true, eventType: PLATFORMEVENTTYPESMAP.POSITIONCHANGEEVENT};
            fireComponentEvent(JSON.stringify(inputVal), this);
        }
        console.log('inner html '+event.target.innerHTML);
        let divEle = docuent.createElement('div');
        setDivCss(divEle);
        event.target.appendChild(divEle);
    }

    @api
    reRenderLocation(locationIndex, details) {
        console.log('  reRenderLocation '+ locationIndex);
        console.log('  details '+ details);

        let divToUpdate = this.template.querySelector(`[data-val="${locationIndex}"]`);
        console.log(divToUpdate.innerHTML);
        
        let newCretedDivEle = document.createElement('div');
        setDivCss(newCretedDivEle, PLAYERLIST[this.playerIndex]);
        divToUpdate.appendChild(newCretedDivEle);
    }


}