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

    constructor() {
        super();
        if(this.playerType == 'Player1') {
            this.playerCount = 1;
        }
        this.coinObjectList = COINOBJECTLIST;
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
}