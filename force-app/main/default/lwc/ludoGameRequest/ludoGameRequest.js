import { LightningElement, track } from 'lwc';
import {
    PLAYERLIST, fireComponentEvent, COMPONENTEVENTTYPESMAP 
} from 'c/utils';
import createPlayerMethod from '@salesforce/apex/LudoCreatePlayer.createPlayer';
import requestToJoinMethod from '@salesforce/apex/LudoCreatePlayer.requestToJoin';

import LUDO_OBJECT_NAME from '@salesforce/schema/LudoPlayer__c.Name';
import LUDO_OBJECT_BOARDID from '@salesforce/schema/LudoPlayer__c.ludoBoard__c';

export default class LudoGameRequest extends LightningElement {

    playerName;
    @track ludoBoardId;

    isSpinnerOpen;

    chosenRequestType;
    requestOptions;

    maxPlayerCount;
    playerNumbersList;

    @track canShowCreate;

    constructor() {
        super();
        this.requestOptions = [
            {'label': 'Create Board', 'value': 'create'},
            {'label': 'Join The Game', 'value': 'join'}
        ];

        this.playerNumbersList = [  
                        { label: '2', value: '2' },
                        { label: '3', value: '3' },
                        { label: '4', value: '4' }
        ];
        this.maxPlayerCount = this.playerNumbersList[2].value;
        this.chosenRequestType = this.requestOptions[0].value;
        this.canShowCreate = true;
        this.isSpinnerOpen = false;
    }

    handleMaxPlayerCountChange(event) {
        this.maxPlayerCount = event.detail.value;
    }

    handleRequestTypeChange(event) {
        console.log('in handleRequestTypeChange method '+ event.detail.value);
        this.chosenRequestType = event.detail.value;
        this.canShowCreate  =  this.chosenRequestType === 'create' ? true : false;
    }
    

    handleNameChange(event) {
        this.playerName = event.target.value;
    }

    handleLudoIdChange(event) {
        this.ludoBoardId = event.target.value;
    }

    requestToJoinSubmit(event) {
        console.log('in requestToJoinSubmit ');
        this.isSpinnerOpen = true;
        let objectNameApi = LUDO_OBJECT_NAME.fieldApiName;
        let boardIdApi = LUDO_OBJECT_BOARDID.fieldApiName;
        let mainThis = this;
        let playerObject = {
            
        };
        playerObject[objectNameApi] = this.playerName;
        playerObject[boardIdApi] = this.ludoBoardId;
        console.log('input data '+ JSON.stringify(playerObject));
        
        requestToJoinMethod({'recordData': JSON.stringify(playerObject)})
        .then(result => {
            console.log('success result data is '+ JSON.stringify(result));
            mainThis.isSpinnerOpen = false;
            mainThis.fireSetupEvent(result.outputData);
        }).catch(error => {
            console.log('error is '+ JSON.stringify(error));
            mainThis.isSpinnerOpen = false;
        });

    }

    createGameSubmit(event) {
        console.log('in createGameSubmit ');
        let mainThis = this;
        createPlayerMethod({'playerName': this.playerName, 'maxPlayerCount': parseInt(this.maxPlayerCount)})
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
        }); 
    }

    fireSetupEvent(resultString) {
        console.log('in fire setup event '+ resultString);
        let result = JSON.parse(resultString);
        let playersListText = (!result.playersJoinedList) ? null :  result.playersJoinedList;
        // list of players [{playerType, name, isJoined} must be passed from here
        let inputVal = {data: {playerName : result.playerName, playerType: result.playerType,
            playersJoinedList: playersListText,  
            playerBoardId: result.playerBoardId, playerJoinedNo: result.playerJoinedNo,
            playerMaxCount: result.playerMaxCount,
            isLastPlayer: result.isLastPlayer
        }, eventType: COMPONENTEVENTTYPESMAP.BOARDSETUPEVENT};
        fireComponentEvent(JSON.stringify(inputVal), this, false, false);
    }
}