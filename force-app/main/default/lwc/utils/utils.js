/*
sample platform event :

            eventType: PLATFORMEVENTTYPESMAP.POSITIONCHANGEEVENT,
            changedFrom: '0',
            changedTo: '6',
            playerIndex: '0'


*/
const PLATFORMEVENTSUBSCRIPTIONURL = '/event/shivalwc__ludo_Event__e';

const PLAYERCOLORMAP = {
   'Player1' : 'Blue',
   'Player2' : 'Red',
   'Player3' : 'Green',
   'Player4' : 'Yellow'
};

const BLOCKBOXESSIZE = 18;
// single platform event can be of these types
// RERUN event is used to fire next roll by the same player
// POSITIONCHANGE is used to fire change of die's position, includes player cut etc
// NOCHANGEEVENT is used to fire no change event // when player die's number is useless
// GAMESTARTEVENT is used to start the game , from this event player1 makes the move
// PLAYEJOINEVENT is used to joined to the game
// GAMEOVEREVENT is used to end the game and show the winner name to others
const PLATFORMEVENTTYPESMAP = {
    'RERUNEVENT': 'RERUNEVENT',
    'POSITIONCHANGEEVENT': 'POSITIONCHANGEEVENT',
    'NOCHANGEEVENT': 'NOCHANGEEVENT',
    'GAMESTARTEVENT': 'GAMESTARTEVENT',
    'PLAYEJOINEVENT': 'PLAYEJOINEVENT',
    'GAMEOVEREVENT': 'GAMEOVEREVENT'
};

const GENERICCOMPONENTEVENT = 'componentevent';
const COMPONENTEVENTTYPESMAP = {
    'positionchangeevent': 'positionchangeevent',
};
//different Perspective based on player1
const GAMEPERSPECTIVEMAP = {
    'Player1' : 0,
    'Player2' : 13,
    'Player3' : 26,
    'Player3' : 39
}
const COLORLIST = ['Blue', 'Red', 'Green', 'Yellow'];
const PLAYERLIST = ['Player1', 'Player2', 'Player3', 'Player4'];
const COINOBJECTLIST = [
    {'player' : 'Player1',
    'details' : [
        {'name': 'coin1', 'position': -1, 'isEnd': false, 'isStart': false},
        {'name': 'coin2', 'position': -1, 'isEnd': false, 'isStart': false},
        {'name': 'coin3', 'position': -1, 'isEnd': false, 'isStart': false},
        {'name': 'coin4', 'position': -1, 'isEnd': false, 'isStart': false}
    ]},
    {'player' : 'Player2',
    'details' : [
        {'name': 'coin1', 'position': -1, 'isEnd': false, 'isStart': false},
        {'name': 'coin2', 'position': -1, 'isEnd': false, 'isStart': false},
        {'name': 'coin3', 'position': -1, 'isEnd': false, 'isStart': false},
        {'name': 'coin4', 'position': -1, 'isEnd': false, 'isStart': false}
    ]},

    {'player' : 'Player3',
    'details' : [
        {'name': 'coin1', 'position': -1, 'isEnd': false, 'isStart': false},
        {'name': 'coin2', 'position': -1, 'isEnd': false, 'isStart': false},
        {'name': 'coin3', 'position': -1, 'isEnd': false, 'isStart': false},
        {'name': 'coin4', 'position': -1, 'isEnd': false, 'isStart': false}
    ]},

    {'player' : 'Player4',
    'details' : [
        {'name': 'coin1', 'position': -1, 'isEnd': false, 'isStart': false},
        {'name': 'coin2', 'position': -1, 'isEnd': false, 'isStart': false},
        {'name': 'coin3', 'position': -1, 'isEnd': false, 'isStart': false},
        {'name': 'coin4', 'position': -1, 'isEnd': false, 'isStart': false}
    ]}
];

const HARDCODEDBLOCK1VALUESLIST = [ 
                                    18, 12, 1,
                                    17, 11, 2,
                                    16, 10, 3,
                                    15, 9, 4,
                                    14, 8, 5,
                                    13, 7, 6
                                ];
const HARDCODEDBLOCK2VALUESLIST = [ 
                                    31, 32, 33, 34, 35, 36,
                                    25, 26, 27, 28, 29, 30,
                                    24, 23, 22, 21, 20, 19
                                ];
const HARDCODEDBLOCK3VALUESLIST = [ 
                                    42, 43, 49,
                                    41, 44, 50,
                                    40, 45, 51,
                                    39, 46, 52,
                                    38, 47, 53,
                                    37, 48, 54
                                ];
const HARDCODEDBLOCK4VALUESLIST = [ 
                                    55, 56, 57, 58, 59, 60,
                                    61, 62, 63, 64, 65, 66,
                                    67, 68, 69, 70, 71, 72
                                ];

/* functions 
*/

const  setDivCss = function(divEle) {
    divEle.style.background = 'yellow';
    divEle.style.position   = 'absolute';
    divEle.style.width = '2vw';
    divEle.style.height = '2vh';
    divEle.style.top = '50%';
    divEle.style.left = '50%';
    divEle.style.borderRadius = '50%';
    divEle.style.border = '1px solid Black';
}

const fetchHardCodedBlockValues = function(blockName) {
    let data = null
    switch(blockName) {
        case 'block1': 
            data = this.HARDCODEDBLOCK1VALUESLIST;
            break;
        case 'block2': 
            data = this.HARDCODEDBLOCK2VALUESLIST;
            break;
        case 'block3': 
            data = this.HARDCODEDBLOCK3VALUESLIST;
            break;
        case 'block4': 
            data = this.HARDCODEDBLOCK4VALUESLIST;
            break;
        default:
            data = [];
    }
    return data;
 };



//params must be object

// sample component event 
// {data: dataNum, firePlatformEvent: true, eventType: COMPONENTEVENTTYPESMAP.positionchangeevent}

const fireComponentEvent = function( params, reference) {
    console.log('in fire compponent event '+ this.GENERICCOMPONENTEVENT +' '+GENERICCOMPONENTEVENT);
    const eventToFire = new CustomEvent(GENERICCOMPONENTEVENT, { detail: params });
    // Dispatches the event.
    reference.dispatchEvent(eventToFire);
};



export {
    BLOCKBOXESSIZE, PLATFORMEVENTSUBSCRIPTIONURL,
    fireComponentEvent, fetchHardCodedBlockValues, setDivCss,
    HARDCODEDBLOCK1VALUESLIST, HARDCODEDBLOCK2VALUESLIST,
    HARDCODEDBLOCK3VALUESLIST, HARDCODEDBLOCK4VALUESLIST,
    COLORLIST, COINOBJECTLIST, PLAYERLIST, 
    PLAYERCOLORMAP,  GAMEPERSPECTIVEMAP, PLATFORMEVENTTYPESMAP, COMPONENTEVENTTYPESMAP
    
 };