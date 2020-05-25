import { LightningElement, track } from 'lwc';
import {
    PLAYERLIST, fireComponentEvent, COMPONENTEVENTTYPESMAP 
} from 'c/utils';
export default class LudoGameRequest extends LightningElement {

    name;
    playerTypeList;
    @track chosenPlayerType;
    @track ludoId;

    constructor() {
        super();
        this.playerTypeList = [];
        for(let index in PLAYERLIST) {
            this.playerTypeList.push({label: PLAYERLIST[index], value: PLAYERLIST[index]});
        }
        this.chosenPlayerType =  !this.playerTypeList || this.playerTypeList.length === 0 ? 
                                            '' : this.playerTypeList[0]; 

    }
    handleNameChange(event) {
        this.name = event.target.value;
    }

    handlePlayerChange(event) {
        this.chosenPlayerType = event.detail.value;
    }

    handleLudoIdChange(event) {
        this.ludoId = event.target.value;
    }

    handlePlayerSubmit(event) {
        console.log('in handle Player Submit ');
        let inputVal = {data: {name: this.name, playerType: this.chosenPlayerType,
            boardId: this.boardId}, eventType: COMPONENTEVENTTYPESMAP.BOARDSETUPEVENT};
        fireComponentEvent(JSON.stringify(inputVal), this);
    }
}