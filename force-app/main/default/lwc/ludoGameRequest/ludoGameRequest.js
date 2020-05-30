import { LightningElement, track } from 'lwc';
import {
    PLAYERLIST, fireComponentEvent, COMPONENTEVENTTYPESMAP 
} from 'c/utils';
import createPlayerMethod from '@salesforce/apex/LudoCreatePlayer.createPlayer';
import requestToJoinMethod from '@salesforce/apex/LudoCreatePlayer.requestToJoin';

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


    handleLudoIdChange(event) {
        this.ludoId = event.target.value;
    }

    requestToJoinSubmit(event) {
        console.log('in requestToJoinSubmit ');

    }

    createGameSubmit(event) {
        console.log('in createGameSubmit ');
        let objectNameApi = LUDO_OBJECT_NAME.fieldApiName;
        let boardIdApi = LUDO_OBJECT_BOARDID.fieldApiName;
        let playerTypeApi = LUDO_OBJECT_PLAYERTYPE.fieldApiName;
        let uniqueIdApi = LUDO_OBJECT_UNIQUEID.fieldApiName;
        let mainThis = this;
        let playerObject = {
            
        };
        playerObject[objectNameApi] = this.name;
        playerObject[boardIdApi] = '';
        playerObject[uniqueIdApi] = '';
        console.log('input data '+ JSON.stringify(playerObject));
        
        createPlayerMethod({'recordData': JSON.stringify(playerObject), 'playerCount': 4})
        .then(result => {
           console.log(' result is '+ JSON.stringify(result));
           if(result.isError) {
               alert(' error in create player '+ result.errorMessage);
               return;
           }
           mainThis.fireSetupEvent(result.outputData);
        })
        .catch(error => {
            console.log('error is '+ JSON.stringify(error));
            mainThis.error = error;
        }); 
    }

    fireSetupEvent(resultString) {
        let result = JSON.parse(resultString);
        let inputVal = {data: {playerName : result.playerName, playerType: result.playerType,
            playerBoardId: result.playerBoardId, playerJoinedNo: result.playerJoinedNo,
            playerMaxCount: result.playerMaxCount
        }, eventType: COMPONENTEVENTTYPESMAP.BOARDSETUPEVENT};
        fireComponentEvent(JSON.stringify(inputVal), this);
    }
}