import { LightningElement, track } from 'lwc';
import {
    PLAYERLIST, fireComponentEvent, COMPONENTEVENTTYPESMAP 
} from 'c/utils';
import createPlayerMethod from '@salesforce/apex/LudoCreatePlayer.createPlayer';
import LUDO_OBJECT_NAME from '@salesforce/schema/LudoPlayer__c.Name';
import LUDO_OBJECT_BOARDID from '@salesforce/schema/LudoPlayer__c.ludoBoard__c';
import LUDO_OBJECT_PLAYERTYPE from '@salesforce/schema/LudoPlayer__c.playerType__c';
import LUDO_OBJECT_UNIQUEID from '@salesforce/schema/LudoPlayer__c.unique_Id_Validation__c';

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
        let objectNameApi = LUDO_OBJECT_NAME.fieldApiName;
        let boardIdApi = LUDO_OBJECT_BOARDID.fieldApiName;
        let playerTypeApi = LUDO_OBJECT_PLAYERTYPE.fieldApiName;
        let uniqueIdApi = LUDO_OBJECT_UNIQUEID.fieldApiName;
        let mainThis = this;
        let playerObject = {
            
        };
        playerObject[objectNameApi] = this.name;
        playerObject[boardIdApi] = '';
        playerObject[playerTypeApi] = this.chosenPlayerType;
        playerObject[uniqueIdApi] = '';
        console.log('input data '+ JSON.stringify(playerObject));
        
        createPlayerMethod({'recordData': JSON.stringify(playerObject), 'playerCount': 4})
        .then(result => {
           console.log(' result is '+ JSON.stringify(result));
           mainThis.fireSetupEvent();
        })
        .catch(error => {
            console.log('error is '+ JSON.stringify(error));
            mainThis.error = error;
        }); 
    }

    fireSetupEvent() {
        let inputVal = {data: {name: this.name, playerType: this.chosenPlayerType,
            boardId: this.boardId}, eventType: COMPONENTEVENTTYPESMAP.BOARDSETUPEVENT};
        fireComponentEvent(JSON.stringify(inputVal), this);

    }
}