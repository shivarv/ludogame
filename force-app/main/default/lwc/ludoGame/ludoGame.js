import { LightningElement, api, track } from 'lwc';
import {
    COMPONENTEVENTTYPESMAP
} from 'c/utils';


export default class LudoGame extends LightningElement {
    @track isGameSetupDone = false;
    playerName;
    playerType;
    playerBoardId;
    playerJoinedNo;
    playerMaxCount;
    playersJoinedDataString;
    isLastPlayer;

    componentEventHandler(event) {
        console.log('in ludoGame comp component event handler ');
        let parsedObject = JSON.parse(event.detail);
        console.log(JSON.stringify(parsedObject));
        //set boardId here
        //return if isGameSetupDone is true or if data is empty
        if(this.isGameSetupDone || !parsedObject || !parsedObject.eventType || parsedObject.eventType !== COMPONENTEVENTTYPESMAP.BOARDSETUPEVENT) {
            return;
        }
        this.playerName = parsedObject.data.playerName;
        this.playerType = parsedObject.data.playerType;
        this.playerBoardId = parsedObject.data.playerBoardId;
        this.playerJoinedNo = parsedObject.data.playerJoinedNo;
        this.playerMaxCount = parsedObject.data.maxPlayerCount;
        this.playersJoinedDataString = parsedObject.data.playersJoinedList;
        this.isLastPlayer = parsedObject.data.isLastPlayer;
        console.log('players joined data string '+ this.playersJoinedDataString);
        console.log('in ludoGame method '+ this.playerName + ' '+
        this.playerType + ' '+ this.playerBoardId + ' '+ this.playerJoinedNo
        + ' '+ this.playerMaxCount
        );
        this.isGameSetupDone = true;
    }
}