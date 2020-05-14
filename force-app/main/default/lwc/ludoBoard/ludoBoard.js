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

    coinMove(name, position, color) {
        
    }

    //start the game
    gameStart() {
        this.currentPlayerMove = 'Player1';
    }

    positionChangeHandler(event) {
        console.log('in position change handler '+ JSON.stringify(event));
        console.log('data '+ event.detail.data);

    }
}