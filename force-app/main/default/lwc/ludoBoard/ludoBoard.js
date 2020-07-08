import { LightningElement, track, api } from 'lwc';
import { HOME, MAXVALUEFORHOME,
        PLAYERCOLORMAP,
        COLORLIST, PLAYERLIST, BLOCKLIST, COINOBJECTLIST, BLOCKBOXESSIZE, 
        PLATFORMEVENTTYPESMAP, COMPONENTEVENTTYPESMAP, BLOCKMAP, PLAYERNAMEMAP,
        PLAYERINDEXMAP, 
        getBlockNumberName, getNextPlayerIndex, getNextPlayerName, getPropertyValuesFromObjectList 
} from 'c/utils';

import publishPlatformEventMethod from '@salesforce/apex/LudoUtility.publishPlatformEvent';
import publishGameStartPlatformEventMethod from '@salesforce/apex/LudoCreatePlayer.fireGameStartPlatformEvent';
//Game Rules
//Dice with number 1 can open the game
//Dice with number 6 or 1 can put again


export default class LudoBoard extends LightningElement {

    playerIndex;
    
    recentlyActivatedBlockValueMap;

    @api playerJoinedNo; //player who start the game sets this
    @api playerMaxCount; // it can be two, three or 4 player game

    isGameStarted = false;
    playerCount; // it can be two, three or 4 player game
    _currentPlayerTurn; // which player to move now , Player1, 2 , 3, 4
    diceMoveVal;
    isThisPlayerMove = false; // can this player move noww
    canPlayerClickCoin = false; // after dice is rolled , can player click coins outside board

    isGameOver = false; // go on with the game till the game ends
    coinObjectList;
    @track boardPathBoxList; //path box of the coinboard

    //individual value is needed
    player1Name;
    isPlayer1Move = false;
    isPlayer1Joined = false;
    isPlayer1Last = false;
    player2Name = false
    isPlayer2Move = false;
    isPlayer2Joined = false
    isPlayer2Last = false;
    player3Name = false
    isPlayer3Move = false;
    isPlayer3Joined = false
    isPlayer3Last = false;
    player4Name = false
    isPlayer4Move = false;
    isPlayer4Joined = false;
    isPlayer4Last = false;
    isPlayerLoaded = false;
    
    _isLastPlayer;
    _playerName;
    _playerType;
    _playerBoardId;

    setTurnForOtherPlayers(playerType) {
        console.log('in setTurnForOtherPlayers method');
        if(playerType === PLAYERNAMEMAP.Player1) {
            this.isPlayer1Move = true;
            this.isPlayer2Move = false;
            this.isPlayer3Move = false;
            this.isPlayer4Move = false;
        } else if(playerType === PLAYERNAMEMAP.Player2) {
            this.isPlayer1Move = false;
            this.isPlayer2Move = true;
            this.isPlayer3Move = false;
            this.isPlayer4Move = false;
        } else if(playerType === PLAYERNAMEMAP.Player3) {
            this.isPlayer1Move = false;
            this.isPlayer2Move = false;
            this.isPlayer3Move = true;
            this.isPlayer4Move = false;
        } else if(playerType === PLAYERNAMEMAP.Player4) {
            this.isPlayer1Move = false;
            this.isPlayer2Move = false;
            this.isPlayer3Move = false;
            this.isPlayer4Move = true;
        } else {
            console.log(' improper type ');
        }
        console.log(' isPlayer1Move ' +  this.isPlayer1Move +
        ' isPlayer2Move ' +  this.isPlayer2Move +
        ' isPlayer3Move ' +  this.isPlayer3Move +
        ' isPlayer4Move ' +  this.isPlayer4Move 
        );
    }

    @api
    get currentPlayerTurn() {
        console.log('get currentPlayerTurn Method ');
        return this._currentPlayerTurn;
    }

    set currentPlayerTurn(value) {
        console.log('set currentPlayerTurn Method '+ value);
        this._currentPlayerTurn = value;
        this.isThisPlayerMove = (this._currentPlayerTurn === this.playerType) ? true : false;
        this.setTurnForOtherPlayers(this._currentPlayerTurn);
    }

    @api
    get isLastPlayer() {
        return this._isLastPlayer;
    }

    set isLastPlayer(value) {
        console.log('set isLastPlayer Method '+ value);

        this._isLastPlayer = value;
        //set isLast Player
        this.setIndividualPlayerVariable(this.playerType, this.playerName, true, true);
    }

    @api
    get playerBoardId() {
        return this._playerBoardId;
    }

    set playerBoardId(value) {
        console.log('set playerBoardId Method '+ value)
        this._playerBoardId = value;
    }

    @api
    get playerName() {
        return this._playerName;
    }

    //Set method use to setup greeting message in upper case.
    set playerName(value) {
        console.log('set playerName Method '+ value)
        this._playerName = value;
    }

    @api
    get playerType() {
        return this._playerType;
    }

    set playerType(value) {
        console.log('set playerType Method '+ value)
        this._playerType = value;
        this.setPlayerIndex();
        this.setIndividualPlayerVariable(this._playerType, this._playerName, true, false);
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
        this.canPlayerClickCoin = false;
        this.setupBoardList();
    }

    // only player1 does this last player joined
    publishGameStartPlatformEvent() {
        console.log(' in publishGameStartPlatformEvent ' + this.playerBoardId);
        let mainThis = this;
        console.log(' publish start event ' + JSON.stringify({'data': '', 'eventType': PLATFORMEVENTTYPESMAP.GAMESTARTEVENT,
        'playerType': this.playerType,'playerBoardId': this.playerBoardId}));
        publishPlatformEventMethod({'data': '', 'eventType': PLATFORMEVENTTYPESMAP.GAMESTARTEVENT,
                                        'playerType': this.playerType,'ludoBoardId': this.playerBoardId})
            .then(result => {
            console.log('success publishGameStartPlatformEvent ');
            mainThis.setGameStartAndPlayerMove();
        }).catch(error => {
            console.log('error is '+ error);
        });
       
    }

    setAlreadyJoinedPlayersList() {
        console.log(' in setAlreadyJoinedPlayersList method '+ this._playersJoinedListData);
        let playersData = '';
        if(!this.playersJoinedListData) {
            return;
        }
        playersData = JSON.parse(this.playersJoinedListData);
        for(let i = 0; i < playersData.length; i++) {
            console.log(JSON.stringify(playersData));
            this.setIndividualPlayerVariable(playersData[i].playerType, 
                                    playersData[i].playerName, true, false);
        }
    }

    setPlayerIndex() {
        console.log(' in setPlayerIndex method '+ PLAYERINDEXMAP[this.playerType]);
        this.playerIndex = PLAYERINDEXMAP[this.playerType];
    }

    setIndividualPlayerVariable(playerType, playerName, isJoined, isLastPlayer) {
        console.log('in setIndividualPlayerVariable method');
        if(playerType === PLAYERNAMEMAP.Player1) {
            this.isPlayer1Joined = isJoined;
            this.player1Name = playerName;
            this.isPlayer1Last = isLastPlayer;
        } else if(playerType === PLAYERNAMEMAP.Player2) {
            this.isPlayer2Joined = isJoined;
            this.player2Name = playerName;
            this.isPlayer2Last = isLastPlayer;
        } else if(playerType === PLAYERNAMEMAP.Player3) {
            this.isPlayer3Joined = isJoined;
            this.player3Name = playerName;
            this.isPlayer3Last = isLastPlayer;
        } else if(playerType === PLAYERNAMEMAP.Player4) {
            this.isPlayer4Joined = isJoined;
            this.player4Name = playerName;
            this.isPlayer4Last = isLastPlayer;
        } else {
            console.log('invalid error ');
        }
        console.log('Player 1 data '+ this.player1Name + ' '+this.isPlayer1Joined + ' '+this.isPlayer1Move);
        console.log('Player 2 data '+ this.player2Name + ' '+this.isPlayer2Joined + ' '+this.isPlayer2Move);
        console.log('Player 3 data '+ this.player3Name + ' '+this.isPlayer3Joined + ' '+this.isPlayer3Move);
        console.log('Player 4 data '+ this.player4Name + ' '+this.isPlayer4Joined + ' '+this.isPlayer4Move);

        //if player1 received event on player4 joined, means the game is started
        if(this.playerType === PLAYERNAMEMAP.Player1 && playerType === PLAYERNAMEMAP.Player4) {
            console.log(' current player type is '+ this.playerType + ' and joined player set is '+ playerType );
            this.publishGameStartPlatformEvent();
            //convert to the below approach
            //fire an start platform event with fireplatformevent true
            
        }
        if(this.isLastPlayer === true) {
            this.setGameStartAndPlayerMove();
        }
    }

    setupBoardList() {
        console.log(' in setupBoardList method ');
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
        console.log(' in publishPlatformEventNotification method ');
        let data = {
            eventType: PLATFORMEVENTTYPESMAP.POSITIONCHANGEEVENT,
            changedFrom: '0',
            changedTo: '6',
            playerIndex: '0'
        };
        publishPlatformEvent(JSON.stringify(data));
    }

    // new player joined 
    newPlayerJoined() {
        console.log('new player joined method');
        this.playerCount++;
        
    }


    rollValue(val) {

    }

    removeCoin(name, position, color) {

    }

    coinMove(name, position, color) {
        
    }

    //start the game
    gameStart() {
       
    }

    componentEventHandler(event) {
        console.log('component event handler method');
        console.log(event.detail);
        let data = JSON.parse(event.detail);
        if(!data) {
            return;
        }
        //need to pass data , instead of data.data becz data.data can be null
        try {
            switch(data.eventType) {
                case PLATFORMEVENTTYPESMAP.RERUNEVENT:
                    console.log('Game RERUNEVENT event type '+data.data);
                    break;
                    
                case  PLATFORMEVENTTYPESMAP.COINCLICKEDEVENT:
                    console.log('Game COINCLICKEDEVENT event type '+data.data);
                    this.handleCoinClickedEvent(data);
                    break;
                
                case PLATFORMEVENTTYPESMAP.POSITIONCHANGEEVENT:
                    //this.positionChangeHandler(data);
                    //this.handlePositionChangeEvent(data);
                    this.handleNoChangeEvent(data);
                    break;

                case PLATFORMEVENTTYPESMAP.NOCHANGEEVENT:
                    console.log('Game NOCHANGEEVENT event type '+data.data);
                    this.handleNoChangeEvent(data);
                    break;        
                case PLATFORMEVENTTYPESMAP.GAMESTARTEVENT:
                    console.log('Game GAMESTARTEVENT event type '+data.data);
                    this.handleGameStartEvent(data);
                    break;
                case PLATFORMEVENTTYPESMAP.PLAYERJOINEVENT:
                    console.log('Game PLAYEJOINEVENT event type '+data.data);
                    this.handlePlayerJoinEvent(data);
                    break;
                case PLATFORMEVENTTYPESMAP.GAMEOVEREVENT:
                    console.log('Game GAMEOVEREVENT event type '+data.data);
                    break;
                case COMPONENTEVENTTYPESMAP.RANDOMNUMBEREVENT:
                    console.log('Comp RANDOMNUMBEREVENT event type '+data.data);
                    //this.handleNoChangeEvent(data);
                    this.handleRandomNumberEvent(data);
                   // this.diceRolledDelegate(data.data);
                    break;
                default:
                    console.log('default '+data.eventType + (data.eventType === PLATFORMEVENTTYPESMAP.POSITIONCHANGEEVENT));
                    break;
            }
        }
        catch(e) {
            console.log('exception in handler '+ e);
        }

    }

    removeCoinIfPresent(position, movedPlayerIndex) {
        console.log(' in removeCoinIfPresent method ');
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
        console.log('in moveCoinsOnBoardUi method');
        let blockReference = this.getBlockReferenceHelper(posData) ;  
        console.log('block reference '+ blockReference.blockType);
        blockReference.reRenderLocation(posData, blockArrayData);
    }

    getBlockArrayData(clickedIndex) {
        console.log(' getBlockArrayData '+ clickedIndex);
        return this.boardPathBoxList[clickedIndex - 1];
    }

    getCurrentPlayerStartBlockReference(playerType) {
        console.log(' in getCurrentPlayerStartBlockReference method');
        let allStartBoxReference = this.template.querySelectorAll('c-ludo-player-start-box');
        if(!allStartBoxReference || allStartBoxReference.length !== 4) {
            console.error(' allStartBoxReference is empty ');
            return null;
        }
        let startBoxReference = null;
        switch(playerType) {
            case PLAYERNAMEMAP.Player1:
                startBoxReference =  allStartBoxReference[0];
                break;
            case PLAYERNAMEMAP.Player2:
                startBoxReference =  allStartBoxReference[1];
                break;
            case PLAYERNAMEMAP.Player3:
                startBoxReference =  allStartBoxReference[2];
                break;
            case PLAYERNAMEMAP.Player4:
                startBoxReference =  allStartBoxReference[3];
                break;
        }
        return startBoxReference;
    }

    getAllPathBlocksNameAndCompRefMap()  {
        console.log(' in getAllPathBlocksNameAndCompRefMap ');
        let verticalPathList = this.template.querySelectorAll('c-ludo-vertical-path'); 
        let horizontalPathList = this.template.querySelectorAll('c-ludo-middle-path');  
        let pathCmpRefMap = {};
        //queryselectorAll returns nodelist, not array , thus  Array.isArray(result) will always be false
        if( !verticalPathList  || verticalPathList.length !== 2
            || !horizontalPathList  || horizontalPathList.length !== 2
            ) {
            console.error('verticalPathList or horizontalPathList is empty or dont have 2 records');
            return pathCmpRefMap;
        }
        for(let i = 0; i < horizontalPathList.length; i++) {
            pathCmpRefMap[horizontalPathList[i].blockType] = horizontalPathList[i];
        }
        for(let i = 0; i < verticalPathList.length; i++) {
            pathCmpRefMap[verticalPathList[i].blockType] = verticalPathList[i];
        }
        return pathCmpRefMap;
    }

    //on passing number from 1 to 72 , it returns the block to update
    getBlockReferenceHelper(clickedIndex) {
        console.log(' in getBlockReferenceHelper ');
        let result = null;  
        let blockVal = getBlockNumberName(clickedIndex);
        let cmpNameRefMap = this.getAllPathBlocksNameAndCompRefMap();
        if(!cmpNameRefMap || cmpNameRefMap[blockVal]) {
            return result;
        }
        result = cmpNameRefMap[blockVal];
        console.log(' all block values '+ cmpNameRefMap[BLOCKMAP.Block1].blockType + ' ' + 
            cmpNameRefMap[BLOCKMAP.Block2].blockType + '    '+ cmpNameRefMap[BLOCKMAP.Block3].blockType
            + '  '+ cmpNameRefMap[BLOCKMAP.Block4].blockType);
        console.log( 'result is '+ result.blockType);
        return result;
    }

    diceRolledDelegate(diceMoveVal) {
        // if its 1, attach event to startbox , else attach event to the location on the boardbox
        console.log('in diceRolledDelegate, the rolled dice value is '+ diceMoveVal);
        let mainThis = this;
        this.diceMoveVal = diceMoveVal;
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
            return;
        }
        // call the attach event
        eleRef.attachClickEventListener([]);
    }

    isMovePresentForPlayer(diceMoveVal) {
        console.log(' in isMovePresentForPlayer method '+diceMoveVal);
        let currentPlayerCoinsList = this.getCurrentPlayerCoins();
        let isMoveAllowed = false;
        let nonStartedCoinsList;
        let startedAndNonEndedCoinsList;

        let isAnyAtStartBox = true;
        let i = 0;
        let startedElementslen;
        nonStartedCoinsList = currentPlayerCoinsList.filter(function(indCoin) {
                                    return indCoin.isStart === false;
                            });
        startedAndNonEndedCoinsList  = currentPlayerCoinsList.filter(function(indCoin) {
            return (indCoin.isEnd === false && indCoin.isStart === true);
        });
        startedElementslen = startedAndNonEndedCoinsList.length;
        isAnyAtStartBox = (nonStartedCoinsList.length > 0);
        if(isAnyAtStartBox && diceMoveVal === 1) {
            isMoveAllowed = true;
            return isMoveAllowed;
        }
        while(i < startedElementslen) {
            if(startedAndNonEndedCoinsList[i].position + diceMoveVal <= MAXVALUEFORHOME) {
                isMoveAllowed = true;
                break;
            }
        }
        console.log(' in isMovePresentForPlayer '+ isMoveAllowed);
        return isMoveAllowed;
    }

    getCurrentPlayerCoins() {
        console.log(' in getCurrentPlayerCoins method ');
        let currentPlayerType = this.playerType;
        if(!this.coinObjectList || this.coinObjectList.length == 0 || !currentPlayerType) {
            return null;
        }
       let currentPlayerCoinsList = this.coinObjectList.filter(function(indCoin) {
                                        return indCoin.playerType === currentPlayerType;
                                    });
        return currentPlayerCoinsList;
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
            console.log( ' exception '+ e);
        }
    }

    // HANDLE RANDOMNUMBEREVENT or for diceClick event
    handleRandomNumberEvent(data) {
        console.log(' in handleRandomNumberEvent method');
        this.canPlayerClickCoin = true;
        if(!data || !data.data) {
            console.error(' no data value or data.data value');
        }
        let numberValue = parseInt(data.data);
        this.diceMoveVal = numberValue;
        if(this.isMovePresentForPlayer(numberValue)) {
            this.changePlayerTurnToNextPlayer();
            this.activateActionListenerToPlayer(numberValue);
        } else {
            this.canPlayerClickCoin = false;
        }
        if(data.firePlatformEvent === true) {
            if( this.canPlayerClickCoin === false) {
                this.publishPlatformEventHelper('', PLATFORMEVENTTYPESMAP.NOCHANGEEVENT, 
                    this.playerType, this.playerBoardId, null);
            }
        }        
    }

    deactivateActionListenerToPlayer() {
        console.log('in deactivateActionListenerToPlayer method');

        //after deactivating , clear the recentlyactivatedList
        this.canPlayerClickCoin = false;
    }

    dummyTest(event) {
        console.log('in dummy test method ');
        this.activateActionListenerToPlayer(1);
    }

    //this method is used to activate click event to all coins for this player to make his move
    activateActionListenerToPlayer(numEle) {
        console.log('in activateActionListenerToPlayer method '+numEle);
        let posValueOfCoinsList;
        let blockNameListValMap;
        let allBlockNameCmpRef;
        //contains Map grouped by blockName and list of elementNums in it
        posValueOfCoinsList = this.getCurrentPlayerCoinPositionList(numEle);
        if(!posValueOfCoinsList || posValueOfCoinsList.length === 0) {
            // this shouldnt happen because empty check is already made
            console.error('error no posValueOfCoinsList ');
            return false;
        }
        blockNameListValMap = this.getBlockReferenceValueMap(posValueOfCoinsList);
        if(!blockNameListValMap) {
            console.error('error no blockRefListFound ');
            return false;
        }
        allBlockNameCmpRef = this.getAllPathBlocksNameAndCompRefMap();
        allBlockNameCmpRef[HOME] = this.getCurrentPlayerStartBlockReference(this.playerType);
        if(!allBlockNameCmpRef) {
            console.error('error no allBlockNameCmpRef ');
            return false;
        }
        console.log(' blockRefList[i] ' +JSON.stringify(allBlockNameCmpRef));
        for(let key in blockNameListValMap) {
            console.log('blockNameListValMap[key] : key : ' + key + ' : value : '+
                        JSON.stringify(blockNameListValMap[key]));
            if(!allBlockNameCmpRef[key]) {
                console.error(' error in ref map ');
            }
            let blockCmpRef = allBlockNameCmpRef[key];
            blockCmpRef.attachClickEventListener(blockNameListValMap[key]);
        }
        return true;
    }

    //this return blockName and list of values including home reference
    // this is each coin path location which is not in end
    getBlockReferenceValueMap(posValueOfCoinsList) {
        console.log(' in getBlockReferenceValueMap methd '+ posValueOfCoinsList);
        let blockAndPositionMap = {};
        let isHomeElePresent = false;
        let homeEleList = [];
        let len;
        if(!posValueOfCoinsList || posValueOfCoinsList.length === 0) {
            return blockAndPositionMap;
        }
        len = posValueOfCoinsList.length;
        for(let i = 0; i < len; i++) {
            if(posValueOfCoinsList[i] === -1) {
                isHomeElePresent = true;
                homeEleList.push(-1);
                continue;
            }
            let blockName = getBlockNumberName(posValueOfCoinsList[i]);
            let valueList = !blockAndPositionMap[blockName] ? [] : blockAndPositionMap[blockName];
            valueList.push(posValueOfCoinsList[i]);
            blockAndPositionMap[blockName] = valueList;
        }
        if(isHomeElePresent) {
            blockAndPositionMap[HOME] = homeEleList;
        }
        return blockAndPositionMap;
    }

    //if numEle has 1  then collect home element too
    //this method all the coins which are eligible to move
    getCurrentPlayerCoinPositionList(numEle) {
        console.log('in getPlayerPositionDataList method');
        let currentPlayerCoinsList = this.getCurrentPlayerCoins();
        let nonStartedCoinsList;
        let startedAndNonEndedCoinsList;
        let posValueOfCoinsList = [];
        if(!currentPlayerCoinsList) {
            console.log('current player coin list is empty');
            return posValueOfCoinsList;
        }
        //all coins in start area
        nonStartedCoinsList = currentPlayerCoinsList.filter(function(indCoin) {
                                    return indCoin.isStart === false;
                            });
        //all coins which are started and not in home area
        startedAndNonEndedCoinsList  = currentPlayerCoinsList.filter(function(indCoin) {
                                    return indCoin.isEnd === false && indCoin.isStart === true;
                            });
        if(startedAndNonEndedCoinsList && startedAndNonEndedCoinsList.length !== 0) {
            posValueOfCoinList = getPropertyValuesFromObjectList(startedAndNonEndedCoinsList, 'position');
        }
        if(numEle === 1) {
            let startArrayLength = !nonStartedCoinsList ? 0 : nonStartedCoinsList.length;
            for(let i = 1; i <= startArrayLength; i++) {
                posValueOfCoinsList.push(-1);
            }
        }
        return posValueOfCoinsList;
    }

    changePlayerTurnToNextPlayer() {
        console.log('in changePlayerTurnToNextPlayer metthod ');
        this.currentPlayerTurn = getNextPlayerName(this.currentPlayerTurn);
    }


    // HANDLE POSITION EVENT
    //position change event is to move from one place to another
    handlePositionChangeEvent(data) {
        console.log('in handlePositionChangeEvent method');
    }

    // HANDLE RERUNEVENT EVENT
    // this is rerunevent which occurs when 1 or 6 is created
    handleReRunEvent() {
        
    }

    // HANDLE COINCLICKED EVENT
    // this is the event that gets triggered when player clicks on coin
    handleCoinClickedEvent(data) {
        console.log('in handleCoinClickedEvent method ' + JSON.stringify(data));
        this.changePlayerTurnToNextPlayer();
        if(!data) {
            console.error(' empty error in handleCoinClickedEvent '+ data);
            return;
        }
        // render move the element position
        if(data.firePlatformEvent) {
            console.log('before calling publish event '+ this.playerBoardId);
            this.publishPlatformEventHelper(data.data, PLATFORMEVENTTYPESMAP.RANDOMNUMBEREVENT, 
                            this.playerType, this.playerBoardId, null);
        }
    }

    // HANDLE NOCHANGEEVENT EVENT
    // this is the no change event 
    // it means no move is done like all coins are not outside block or cant move 
    handleNoChangeEvent(data) {
        console.log('in handleNoChangeEvent method ' + JSON.stringify(data));
        this.changePlayerTurnToNextPlayer();
        if(data.firePlatformEvent) {
            console.log('before calling publish eevent '+ this.playerBoardId);
            this.publishPlatformEventHelper('', PLATFORMEVENTTYPESMAP.NOCHANGEEVENT, 
                            this.playerType, this.playerBoardId, null);
        }
    }
    
    // HANDLE GAMESTARTEVENT EVENT
    // this is the game started event , from which the game actually started
    gameStartEventHelper() {
        console.log(' in gameStartEventHelper method');
        this.setGameStartAndPlayerMove();
        function callbackCheck(data) {
            console.log('in callbackCheck '+ this.playerType +' '+ JSON.stringify(data));
        }
        console.log('before calling publish eevent '+ this.playerBoardId);

        this.publishPlatformEventHelper('', PLATFORMEVENTTYPESMAP.GAMESTARTEVENT, 
                            this.playerType, this.playerBoardId, callbackCheck);
    }

    // HANDLE PLAYEJOINEVENT EVENT
    // new player board creation
    // sample data format
    //"{"maxPlayerCount":"4",
    //"playerJoinedNo":"2",
    //"playerBoardId":"a062v00001fWxo0AAC",
    //"playerType":"Player2","playerName":"shiv2"} // all in string
    handlePlayerJoinEvent(data) {
        console.log('in player join vent handler '+ JSON.stringify(data));
        let parsedInputData = JSON.parse(data.data);
        let playerTypeValue = parsedInputData.playerType;
        let playerNameValue = parsedInputData.playerName;
        let playerIsJoined = true;
        let isLastPlayer = (!parsedInputData || !parsedInputData.isLastPlayer || parsedInputData.isLastPlayer.toLowerCase() !== 'true') ? 
                                    false : true;
        this.setIndividualPlayerVariable(playerTypeValue, playerNameValue, playerIsJoined, isLastPlayer);        
    }

    // HANDLE GAMEOVEREVENT EVENT
    // terminate the game and popup with winner
    handleGameOverEvent() {
        
    }

    // HANDLE GAMESTARTEVENT EVENT
    // this is the game started event , from which the game actually started
    handleGameStartEvent(data) {
        console.log('in handleGameStartEvent handler ');
        this.setGameStartAndPlayerMove();
    }


    setPlayerCoinNewPosition(coinRef, newPosition) {
        console.log('in setPlayerCoinNewPosition method ' + JSON.stringify(coinRef) + ' '+newPosition);
        // need to handle the coin cut here
        
        if(newPosition == -1) {
            coinRef.isStart = false;
            coinRef.isEnd = false;
        }
        coinRef.position = newPosition;
    }

    setGameStartAndPlayerMove() {
        console.log(' in setGameStartAndPlayerMove method ');
        this.isGameStarted = true;
        // if playerType == player1 , then its your playermove
        this.currentPlayerTurn = PLAYERNAMEMAP.Player1;
    }


    // only player1 does this last player joined
    publishPlatformEventHelper(data, eventType, playerType, playerBoardId, callback) {
        console.log(' in publishPlatformEventHelper ' + playerBoardId);
        let mainThis = this;
        console.log('before calling publish eevent '+ this.playerBoardId);
        publishPlatformEventMethod({'data': '', 'eventType': eventType,
                            'playerType': playerType, 'ludoBoardId': playerBoardId})
                            .then(result => {
            console.log('success publishPlatformEventHelper ');
            if(callback) {
                callback(result);
            }
        }).catch(error => {
            console.log('error is '+ error);
        });
       
    }


}