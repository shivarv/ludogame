import { LightningElement, track, api } from 'lwc';
import { PLAYERCOLORMAP, COLORLIST, PLAYERLIST, COINOBJECTLIST, BLOCKBOXESSIZE,
    PLATFORMEVENTTYPESMAP, COMPONENTEVENTTYPESMAP, BLOCKMAP, PLAYERNAMEMAP,
    PLAYERINDEXMAP,
    getBlockNumber
} from 'c/utils';

import publishPlatformEvent from '@salesforce/apex/LudoUtility.publishPlatformEvent';


export default class LudoBoard extends LightningElement {

    playerIndex;

    @api playerBoardId;
    @api playerJoinedNo; //player who start the game sets this
    @api playerMaxCount; // it can be two, three or 4 player game


    isGameStarted = false;
    isRollBoxOpen = false;

    playerCount; // it can be two, three or 4 player game
    currentPlayerMove; // current player to make move
    diceMoveVal;

    isGameOver = false; // go on with the game till the game ends

    currentPlayerMove; // which player must make move now
    coinObjectList;


    @track boardPathBoxList;


    //individual value is needed
    player1Name;
    isPlayer1Move = false;
    isPlayer1Joined = false;
    player2Name = false
    isPlayer2Move = false;
    isPlayer2Joined = false
    player3Name = false
    isPlayer3Move = false;
    isPlayer3Joined = false
    player4Name = false
    isPlayer4Move = false;
    isPlayer4Joined;


    isFirstLoaded = false;

    

    @api
    get playerName(){
        return this._playerName;
    }

    //Set method use to setup greeting message in upper case.
    set playerName(value){
        this._playerName = value;
    }

    @api
    get playerType() {
        return this._playerType;
    }

    set playerType(value){
        this._playerType = value;
        this.setPlayerIndex();
        this.setIndividualPlayerVariable(this._playerType, this._playerName, true);
    }

    //it is a string data
    @api 
    get playersJoinedListData() {
        return this._playersJoinedListData;
    }

    set playersJoinedListData(value) {
        console.log(' in playersJoinedListData method '+ value);
        this._playersJoinedListData = value;
        console.log(' in playersJoinedListData method '+ this._playersJoinedListData);
        if(this._playersJoinedListData) {
            this.setAlreadyJoinedPlayersList();
        }
    }



    
    constructor() {
        super();
        this.coinObjectList = COINOBJECTLIST;
        this.setupBoardList();
    }

    setAlreadyJoinedPlayersList() {
        console.log(' in setAlreadyJoinedPlayersList method '+ this._playersJoinedListData);
        let playersData = '';
        if(!this._playersJoinedListData) {
            return;
        }
        playersData = JSON.parse(this._playersJoinedListData);
        for(let i = 0; i < playersData.length; i++) {
            console.log(JSON.stringify(playersData));
            this.setIndividualPlayerVariable(playersData[i].playerType, 
                                    playersData[i].playerName, true);
        }
    }

    setPlayerIndex() {
        console.log(' in setPlayerIndex method '+ PLAYERINDEXMAP[this._playerType]);
        this.playerIndex = PLAYERINDEXMAP[this._playerType];
    }

    setIndividualPlayerVariable(playerType, playerName, isJoined) {
        console.log('in setIndividualPlayerVariable method');
        if(playerType === PLAYERNAMEMAP.Player1) {
            this.isPlayer1Joined = isJoined;
            this.player1Name = playerName;
        } else if(playerType === PLAYERNAMEMAP.Player2) {
            this.isPlayer2Joined = isJoined;
            this.player2Name = playerName;
        } else if(playerType === PLAYERNAMEMAP.Player3) {
            this.isPlayer3Joined = isJoined;
            this.player3Name = playerName;
        } else if(playerType === PLAYERNAMEMAP.Player4) {
            this.isPlayer4Joined = isJoined;
            this.player4Name = playerName;
        } else {
            console.log('invalid error ');
        }
        console.log('Player 1 data '+ this.player1Name + ' '+this.isPlayer1Joined + ' '+this.isPlayer1Move);
        console.log('Player 2 data '+ this.player2Name + ' '+this.isPlayer2Joined + ' '+this.isPlayer2Move);
        console.log('Player 3 data '+ this.player3Name + ' '+this.isPlayer3Joined + ' '+this.isPlayer3Move);
        console.log('Player 4 data '+ this.player4Name + ' '+this.isPlayer4Joined + ' '+this.isPlayer4Move);
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
        if(this.playerCount == this.playerMaxCount) {
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
                this.positionChangeHandler(data);
                break;

            case PLATFORMEVENTTYPESMAP.NOCHANGEEVENT:
                console.log('Game NOCHANGEEVENT event type '+data.data);
                break;        
            case PLATFORMEVENTTYPESMAP.GAMESTARTEVENT:
                console.log('Game GAMESTARTEVENT event type '+data.data);
                break;
            case PLATFORMEVENTTYPESMAP.PLAYERJOINEVENT:
                console.log('Game PLAYEJOINEVENT event type '+data.data);
                this.handlePlayerJoinEvent(data.data);
                break;
            case PLATFORMEVENTTYPESMAP.GAMEOVEREVENT:
                console.log('Game GAMEOVEREVENT event type '+data.data);
                break;
            case COMPONENTEVENTTYPESMAP.RANDOMNUMBEREVENT:
                console.log('Comp RANDOMNUMBEREVENT event type '+data.data);
                this.diceRolledDelegate(data.data);
                break;
            default:
                console.log('default '+data.eventType + (data.eventType === PLATFORMEVENTTYPESMAP.POSITIONCHANGEEVENT));
                break;
            }

        if(data.firePlatformEvent === true) {
            console.log('fire platform event ');
        }

    }

    removeCoinIfPresent(position, movedPlayerIndex) {
        let fromCoinList = this.boardPathBoxList[position - 1].coinsList;
        if(fromCoinList && Array.isArray(fromCoinList)) {
            let coinPlayerPosIndex = fromCoinList.indexOf(movedPlayerIndex);
            if(coinPlayerPosIndex != -1) {
                fromCoinList.splice(coinPlayerPosIndex, 1);
            }
        }
        console.log('after sliced val is '+ fromCoinList);
        console.log('after sliced val is '+ this.boardPathBoxList[position - 1].coinsList);
    }

    calcNewCoinListData(fromPosition, toPosition, movedPlayerIndex) {
        console.log(' in calcNewCoinListData method');
        //calculate the new coin position, board coinslist logics here
        this.removeCoinIfPresent(fromPosition, movedPlayerIndex);
        this.removeCoinIfPresent(toPosition, movedPlayerIndex);
    }

    moveCoinsOnBoardUi(posData, blockArrayData) {
        let blockReference = this.getBlockReferenceHelper(posData) ;  
        console.log('block reference '+ blockReference.blockType);
        blockReference.reRenderLocation(posData, blockArrayData);
    }

    getBlockArrayData(clickedIndex) {
        console.log(' getBlockArrayData '+ clickedIndex);
        return this.boardPathBoxList[clickedIndex - 1];
    }

    //on passing number from 1 to 72 , it returns the block to update
    getBlockReferenceHelper(clickedIndex) {
        
        let result;  
        let blockVal = getBlockNumber(clickedIndex);
        if(blockVal === BLOCKMAP.Block1 || blockVal === BLOCKMAP.Block3) {
            result = this.template.querySelectorAll('c-ludo-vertical-path');  
        } else if(blockVal === BLOCKMAP.Block2 || blockVal === BLOCKMAP.Block4) {
            result = this.template.querySelectorAll('c-ludo-middle-path');  
        }

        //queryselecttorAll returns nodelist, not array , thus  Array.isArray(result) will be false
        console.log('is true '+Array.isArray(result));
        if(!(result  && result.length === 2)) {
            console.log('in result null ');
            return null;
        }
        console.log(' all block values '+ result[0].blockType + ' '+ result[1].blockType);
        return result[0].blockType === blockVal ? result[0] : result[1];
        //return result[0].blockType === blockVal ? result[0] : (result[1].blockType === blockVal ? result[1] : null);
    }

    diceRolledDelegate(diceMoveVal) {
        console.log('in diceRolledDelegate, the rolled dice value is '+ diceMoveVal);
        let mainThis = this;
        this.isRollBoxOpen = false;
        this.diceMoveVal = diceMoveVal;
        if(! (diceMoveVal === 1 || diceMoveVal === 6) ) {
            return;
        }
        let result = this.template.querySelectorAll('c-ludo-player-start-box');  
        let eleRef;
        console.log(this.playerType);
        if(!this.playerType || !result || result.length === 0) {
            return null;
        }
        
        result.forEach(function(element) {
            console.log(JSON.stringify(element) + ' '+element.playerType);
            
            if(element.playerType === mainThis.playerType) {
                eleRef = element;
            }
               
        }, this);
        if(!eleRef) {
            console.log('no ref obtained ');
        }
        eleRef.attachClickEventListener();
    }


    // ALL HANDLERS
    positionChangeHandler(data) {
        console.log('in position change handler '+ JSON.stringify(data));
        try {
            console.log('Game POSITIONCHANGEEVENT event type '+ data.data);
            //block reference points to the block component onwhich update is necessary now
            //let blockReference = this.getBlockReferenceHelper(data.data) ;  
            //console.log('block reference '+ blockReference.blockType);
            let blockArrayData =  this.getBlockArrayData(data.data);
            //dummy coin
            blockArrayData.coinsList = [0, 0, 1];
            let blockArrayData2 = this.getBlockArrayData(parseInt(data.data) + parseInt(this.diceMoveVal) );
            blockArrayData2.coinsList = [0, 0, 1];
            this.calcNewCoinListData(data.data, parseInt(data.data) + parseInt(this.diceMoveVal), this.playerIndex);
            this.moveCoinsOnBoardUi(data.data, blockArrayData);
            this.moveCoinsOnBoardUi(parseInt(data.data) + parseInt(this.diceMoveVal), blockArrayData);
            //console.log(JSON.stringify(blockReference));
            } catch(e) {
                console.log( ' exception '+ JSON.stringify(e));
            }

    }

    // GENERIC PLATFORM EVENT HANLDERS
    //Redirect to the actual handlers
    PlatformEventHandler(event) {
        console.log('in handle platform event '+ JSON.stringify(event));

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
    // sample data format
    //"{"maxPlayerCount":"4",
    //"playerJoinedNo":"2",
    //"playerBoardId":"a062v00001fWxo0AAC",
    //"playerType":"Player2","playerName":"shiv2"} // all in string
    handlePlayerJoinEvent(data) {
        console.log('in player join vent handler '+ data);
        let parsedInputData = JSON.parse(data);
        let playerTypeValue = parsedInputData.playerType;
        let playerNameValue = parsedInputData.playerName;
        let playerIsJoined = true;
        this.setIndividualPlayerVariable(playerTypeValue, playerNameValue, playerIsJoined);        
    }

    // HANDLE GAMEOVEREVENT EVENT
    // terminate the game and popup with winner
    handleGameOverEvent() {
        
    }

}