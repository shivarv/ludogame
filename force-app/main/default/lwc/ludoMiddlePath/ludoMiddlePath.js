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
    PLAYERLIST,
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
            fireComponentEvent(JSON.stringify(inputVal), this, false, false);
        }

        console.log('inner html ' + event.target.innerHTML);
       // let divEle = document.createElement('div');
       // setDivCss(divEle);
       // event.target.appendChild(divEle);
    }

    @api
    reRenderLocation(locationIndex, coinsList) {
        console.log('  reRenderLocation '+ locationIndex);
        console.log('  details '+ JSON.stringify(coinsList));
        if(!coinsList) {
            return;
        }
        let divToUpdate = this.template.querySelector(`[data-val="${locationIndex}"]`);
        console.log(divToUpdate.innerHTML);
        divToUpdate.innerHTML = '';
        for(let i in coinsList) {
            let newCretedDivEle = document.createElement('div');
            setDivCss(newCretedDivEle, coinsList[i], i, coinsList.length);
            divToUpdate.appendChild(newCretedDivEle);
        }
    }
   
    // method to attach click event listener to the coin elements of current player
    @api
    attachClickEventListener(listOfObjectPosition) {
        console.log(' in attachClickEventListener');
        //find the elements and attach event listener to those
        this.addEventListener('click', this.handleClick);
    }

    // to attach to individual ele block div
    @api
    attachClickEventListenerToIndividualElement(element) {
        console.log(' in attachClickEventListenerToIndividualElement '+ element);
         //find the elements and attach event listener to those
        this.addEventListener('click', this.handleClick);
    }

    handleClick() {
        console.log('in handle click ludoPlayerBox '+this.playerType );
        //this.removeEventListener('click', this.handleClick);
    }

    @api
    removeClickEventListener() {
        console.log(' in removeClickEventListener ');
        this.removeEventListener('click', this.handleClick);
    }
}