import { LightningElement } from 'lwc';
import { PLAYERCOLORMAP, COLORLIST, PLAYERLIST, COINOBJECTLIST } from 'c/utils';




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
    }

    setupBoardList() {
        this.boardPathBoxList = [];
        let colorList = COLORLIST;
        for(let outerI = 1; outerI <= 4; outerI++) {
            for(let i = 0; i < 16; i++) {
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