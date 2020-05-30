public class LudoEventTypes {
    public enum PLAYERTYPE {
        PLAYER1,
        PLAYER2,
        PLAYER3,
        PLAYER4
    }
    public enum LUDOEVENTENUM {
        RERUNEVENT, POSITIONCHANGEEVENT,
        NOCHANGEEVENT, GAMESTARTEVENT,
        GAMEOVEREVENT, PLAYERJOINEVENT,
        GAMESYNCEVENT, ERROREVENT, DEFAULTEVENT
    } 
    // Sample EVENT  Values , string value for shivalwc__eventData__c
    /* RERUNEVENT, POSITIONCHANGEEVENT
    {
        'positionFrom':, // -1 is the startPoint Position
		'positionTo':,
		'isHome':  // means if the coin is safe
    }
	*/
    /* NOCHANGEEVENT, GAMESTARTEVENT, GAMEOVEREVENT, GAMESYNCEVENT
    {
       // empty data
    }
    */
    
    /* PLAYERJOINEVENT
        {
            'playerName':
            'playerType' :,
            'playerBoardId':,
            'playerJoinedNo':,
            'playerMaxCount':
        }
    */
   
}