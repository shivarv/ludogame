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
const PLATFORMEVENTTYPES = [
    'RERUNEVENT',
    'POSITIONCHANGEEVENT',
    'NOCHANGEEVENT',
    'GAMESTARTEVENT',
    'PLAYEJOINEVENT',
    'GAMEOVEREVENT'
];
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


export {  PLAYERCOLORMAP, COLORLIST, COINOBJECTLIST, PLAYERLIST, PLATFORMEVENTTYPES };