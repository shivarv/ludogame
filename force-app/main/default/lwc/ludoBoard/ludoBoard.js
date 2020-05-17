import { LightningElement } from 'lwc';
import { PLAYERCOLORMAP, COLORLIST, PLAYERLIST, COINOBJECTLIST, BLOCKBOXESSIZE,
    PLATFORMEVENTTYPESMAP
} from 'c/utils';

import publishPlatformEvent from '@salesforce/apex/LudoUtility.publishPlatformEvent';


export default class LudoBoard extends LightningElement {

    playerName;
    playerType; // this player typer 
    isGameStarted = false;


    gamePlayerCount; //player who start the game sets this
    playerCount; // it can be two, three or 4 player game
    

    isGameOver = false; // go on with the game till the game ends

    currentPlayerMove; // which player must make move now
    coinObjectList;


    boardPathBoxList;

    constructor() {
        super();
        if(this.playerType == 'Player1') {
            this.playerCount = 1;
        }
        this.coinObjectList = COINOBJECTLIST;
        this.setupBoardList();
    }

    setupBoardList() {
        this.boardPathBoxList = [];
        let colorList = COLORLIST;
        for(let outerI = 1; outerI <= 4; outerI++) {
            for(let i = 0; i < BLOCKBOXESSIZE; i++) {
                this.boardPathBoxList.push(
                    {
                        'path' : 'path' + outerI,
                        'coinsList' : [],
                        'isFilled' : false,
                        'isStartPath' : outerI == 1 ? true : false,
                        'isFinalPath' : outerI == 4 ? true : false,
                        'isSafePath' : false,
                        'safeColorList' : 'ALL'
                    }
    
                );
            }
        }
       
    }

    publishPlatformEventNotification() {
        let data = {
            eventType: PLATFORMEVENTTYPESMAP.POSITIONCHANGEEVENT,
            changedFrom: '0',
            changedTo: '6',
            playerIndex: '0'
        };
        publishPlatformEvent(JSON.stringify(data));
    }

    setGameStart() {
        this.isGameStarted = true;
    }

    // new player joined 
    newPlayerJoined() {
        console.log('new player joined');
        this.playerCount++;
        if(this.playerCount == this.gamePlayerCount) {
            //fire event to startGame
        }
    }


    rollValue(val) {

    }

    removeCoin(name, position, color) {

    }

    coinMove(name, position, color) {
        
    }

    //start the game
    gameStart() {
        this.currentPlayerMove = 'Player1';
    }

    componentEventHandler(event) {
        console.log('component event handler ');
        console.log(event.detail);
        let data = JSON.parse(event.detail);

        switch(data.eventType) {
            case PLATFORMEVENTTYPESMAP.RERUNEVENT:
                console.log('Game RERUNEVENT event type '+data.data);
                break;
            
            case PLATFORMEVENTTYPESMAP.POSITIONCHANGEEVENT:
                console.log('Game POSITIONCHANGEEVENT event type '+data.data);
                break;
            case PLATFORMEVENTTYPESMAP.NOCHANGEEVENT:
                console.log('Game NOCHANGEEVENT event type '+data.data);
                break;        
            case PLATFORMEVENTTYPESMAP.GAMESTARTEVENT:
                console.log('Game GAMESTARTEVENT event type '+data.data);
                break;
            case PLATFORMEVENTTYPESMAP.PLAYEJOINEVENT:
                console.log('Game PLAYEJOINEVENT event type '+data.data);
                break;
            case PLATFORMEVENTTYPESMAP.GAMEOVEREVENT:
                console.log('Game GAMEOVEREVENT event type '+data.data);
                break;
            default:
                console.log('default '+data.eventType + (data.eventType === PLATFORMEVENTTYPESMAP.POSITIONCHANGEEVENT));
                console.log(data.eventType === 'POSITIONCHANGEEVENT');
                break;
            }

        if(data.firePlatformEvent === true) {
            console.log('fire platform event ');
        }

    }

    // ALL HANDLERS
    positionChangeHandler(event) {
        console.log('in position change handler '+ JSON.stringify(event));
        console.log('data '+ event.detail.data);

    }

    // GENERIC PLATFORM EVENT HANLDERS
    //Redirect to the actual handlers
    handlePlatformEvent() {

    }

    // HANDLE POSITION EVENT
    //position change event is to move from one place to another
    handlePositionChangeEvent() {

    }

    // HANDLE RERUNEVENT EVENT
    // this is rerunevent which occurs when 1 or 6 is created
    handleReRunEvent() {
        
    }

    // HANDLE NOCHANGEEVENT EVENT
    // this is the no change event 
    // it means no move is done like all coins are not outside block or cant move 
    handleNoChangeEvent() {
        
    }
    
    // HANDLE GAMESTARTEVENT EVENT
    // this is the game started event , from which the game actually started
    handleGameStartEvent() {
        
    }

    // HANDLE PLAYEJOINEVENT EVENT
    // new player board creation
    handlePlayerJoinEvent() {
        
    }

    // HANDLE GAMEOVEREVENT EVENT
    // terminate the game and popup with winner
    handleGameOverEvent() {
        
    }

}