const PLAYERCOLORMAP = {
   'Player1' : 'Blue',
   'Player2' : 'Red',
   'Player3' : 'Green',
   'Player4' : 'Yellow'
};

// single platform event can be of these types
// RERUN event is used to fire next roll by the same player
// POSITIONCHANGE is used to fire change of die's position, includes player cut etc
// NOCHANGEEVENT is used to fire no change event // when player die's number is useless
// GAMESTARTEVENT is used to start the game , from this event player1 makes the move
// PLAYEJOINEVENT is used to joined to the game
// GAMEOVEREVENT is used to end the game and show the winner name to others
const PLATFORMEVENTTYPES = {
    'RERUNEVENT': 'RERUNEVENT',
    'POSITIONCHANGEEVENT': 'POSITIONCHANGEEVENT',
    'NOCHANGEEVENT': 'NOCHANGEEVENT',
    'GAMESTARTEVENT': 'GAMESTARTEVENT',
    'PLAYEJOINEVENT': 'PLAYEJOINEVENT',
    'GAMEOVEREVENT': 'GAMEOVEREVENT'
};

const COMPONENTEVENTTYPES = {
    'positionchangeevent': 'positionchangeevent'
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

const HARDCODEDBLOCK1VALUES = [1, 2 , 3 , 4 , 5 , 6,
                                7, 8, 9, 10, 11, 12,
                                13, 14, 15, 16, 17, 18
                            ];
const HARDCODEDBLOCK2VALUES = [36, 35, 34, 33, 32, 31,
                                30, 29, 28, 27, 26, 25,
                                24, 23, 22, 21, 20, 19
                            ];
const HARDCODEDBLOCK3VALUES = [36, 35, 34, 33, 32, 31,
                                30, 29, 28, 27, 26, 25,
                                24, 23, 22, 21, 20, 19
                            ];
const HARDCODEDBLOCK4VALUES = [1, 2 , 3 , 4 , 5 , 6,
    7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18
];

//params must be object
const fireComponentEvent = function(eventName, params, reference) {
    const eventToFire = new CustomEvent(eventName, { detail: params });
    // Dispatches the event.
    reference.dispatchEvent(eventToFire);
};


export {
    fireComponentEvent,
    HARDCODEDBLOCK1VALUES, HARDCODEDBLOCK2VALUES, HARDCODEDBLOCK3VALUES, HARDCODEDBLOCK4VALUES,
    PLAYERCOLORMAP, COLORLIST, COINOBJECTLIST, PLAYERLIST, PLATFORMEVENTTYPES, GAMEPERSPECTIVEMAP,
    COMPONENTEVENTTYPES
 };