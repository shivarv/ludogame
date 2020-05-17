import {
    LightningElement,
    api,
    track
} from 'lwc';
import {
    fireComponentEvent,
    COMPONENTEVENTTYPESMAP,
    PLATFORMEVENTTYPESMAP,
    PLAYERCOLORMAP,
    fetchHardCodedBlockValues,
    setDivCss
} from 'c/utils';

export default class LudoMiddlePath extends LightningElement {
    @api isHorizontal;
    @track elementCount;
    @api blockType;
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
        if (!(data && Array.isArray(data) && data.length > 0)) {
            return;
        }
        for (let val of data) {
            this.elementCount.push(val);
        }
    }

    itemChosen(event) {
        console.log(JSON.stringify(event.target.id));
        //val is the custom data-set value
        console.log(event.target.dataset.val);
        let dataNum = 0;
        if (event.target.dataset.val) {
            dataNum = event.target.dataset.val;
            let inputVal = {
                data: dataNum,
                firePlatformEvent: true,
                eventType: PLATFORMEVENTTYPESMAP.POSITIONCHANGEEVENT
            };
            fireComponentEvent(JSON.stringify(inputVal), this);
        }

        console.log('inner html ' + event.target.innerHTML);
       // let divEle = document.createElement('div');
       // setDivCss(divEle);
       // event.target.appendChild(divEle);
    }

    @api
    reRenderLocation(locationIndex, details) {
        console.log('  reRenderLocation '+ locationIndex);
        console.log('  details '+ details);

        let divElements = this.template.querySelectorAll('div');
        console.log(JSON.stringify(divElements));
        let divEle = document.createElement('div');
        setDivCss(divEle, PLAYERLIST[this.playerIndex]);
      //  event.target.appendChild(divEle);
    }
}