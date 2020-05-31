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

    componentEventHandler(event) {
        console.log('in ludoGame comp component event handler ');
        let data = JSON.parse(event.detail);
        console.log(JSON.stringify(data));
        //set boardId here
        //return if isGameSetupDone is true or if data is empty
        if(this.isGameSetupDone || !data || !data.eventType || data.eventType !== COMPONENTEVENTTYPESMAP.BOARDSETUPEVENT) {
            return;
        }
        this.playerName = data.playerName;
        this.playerType = data.playerType;
        this.playerBoardId = data.playerBoardId;
        this.playerJoinedNo = data.playerJoinedNo;
        this.playerMaxCount = data.playerMaxCount;
        this.isGameSetupDone = true;
    }
}