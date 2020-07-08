import { LightningElement, api } from 'lwc';
import {
    fireComponentEvent, COMPONENTEVENTTYPESMAP 
} from 'c/utils';

export default class LudoPlayerStartBox extends LightningElement {
    @api boxColor;
    @api boxPosition;
    @api playerType;

    MAXPOINTINBOX = 4;
    MINPOINTINBOX = 0;

    canUserClick = false;

    @api
    countPointInBox;
    
    constructor() {
        super();
        this.countPointInBox = this.MAXPOINTINBOX;
        // console.log(this.playerType);
    }

    connectedCallback() {
        console.log('in connected callback ' );
        this.countPointInBox = this.MAXPOINTINBOX;
        console.log(this.playerType);
    }
    get canShow4() {
        return this.countPointInBox > 3;
    }

    get canShow3() {
        return this.countPointInBox > 2;
    }

    get canShow2() {
        return this.countPointInBox > 1;
    }

    get canShow1() {
        return this.countPointInBox > 0;
    }

    get colorClass() { 
       // console.log(' in colorClass '+ this.boxColor);
        if(!this.boxColor) {
            return 'grey-background';
        }
        return this.boxColor + '-background';
    }

    get innerDivTopLeft() {
        //console.log('default-innerdiv smalldiv-top smalldiv-left '+ this.colorClass);
        return 'default-innerdiv smalldiv-top smalldiv-left '+ this.colorClass;
    }

    get innerDivTopRight() {
        return 'default-innerdiv smalldiv-top smalldiv-right '+ this.colorClass;
    }

    get innerDivBottomLeft() {
        return 'default-innerdiv smalldiv-bottom smalldiv-left '+ this.colorClass;
    }

    get innerDivBottomRight() {
        return 'default-innerdiv smalldiv-bottom smalldiv-right '+ this.colorClass;
    }


    get positionClass() { 
        //console.log(' in positionClass '+ this.boxPosition);
        if(!this.boxPosition) {
            return 'default-box top-left';
        }
        if( this.boxPosition == 'top-left') {
            return 'default-box top-left';
        } else if( this.boxPosition == 'top-right') {
            return 'default-box top-right';
        } else if (this.boxPosition == 'bottom-left') {
            return 'default-box bottom-left';
        } else if(this.boxPosition == 'bottom-right') {
            return 'default-box bottom-right';
        } 
        return 'default-box top-left';
    }

    @api
    decrementCountIndex() {
        if(this.countPointInBox === this.MINPOINTINBOX) {
            return;
        }
        this.countPointInBox--;
    }

    @api
    incrementCountIndex() {
        if(this.countPointInBox === this.MAXPOINTINBOX) {
            return;
        }
        this.countPointInBox++;
    }

    @api
    attachClickEventListener(listOfObjectPosition) {
        console.log(' in attachClickEventListener ');
        this.canUserClick = true;
        this.addEventListener('click', this.handleClick);
    }

    @api
    attachClickEventListenerToIndividualElement(element) {
        console.log(' in attachClickEventListenerToIndividualElement '+ element);
         //find the elements and attach event listener to those
        this.addEventListener('click', this.handleClick);
    }

    handleClick() {
        console.log('in handle click ludoPlayerBox '+this.playerType );
        if(!this.canUserClick) {
            return;
        }
        let inputData = {data: {positionFrom: -1, positionTo: 0, isHome: false},
            isPlatformEvent: true, eventType: COMPONENTEVENTTYPESMAP.COINCLICKEDEVENT};
        fireComponentEvent(JSON.stringify(inputData), this, false, false);
        this.removeEventListener('click', this.handleClick);
    }

    removeClickEventListener() {
        console.log(' in removeClickEventListener ');
        this.canUserClick = false;
        this.removeEventListener('click', this.handleClick);
    }

    @api
    decrementCountIndexValue() {
        console.log(' in decrementCountIndexValue ' + this.countPointInBox);
        this.countPointInBox--;
        if(this.countPointInBox < this.MINPOINTINBOX) {
            console.error(' countPointInBox cant be less than '+this.MINPOINTINBOX);
        }
    }

    @api
    incrementCountIndexValue() {
        console.log(' in decrementCountIndexValue ' + this.countPointInBox);
        this.countPointInBox++;
        if(this.countPointInBox > this.MAXPOINTINBOX) {
            console.error(' countPointInBox cant be more than '+this.MAXPOINTINBOX);
        }
    }
}