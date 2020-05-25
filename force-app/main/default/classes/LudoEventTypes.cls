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
        GAMEOVEREVENT, PLAYEJOINEVENT,
        GAMESYNCEVENT
    } 
    // Sample EVENT  Values , string value for shivalwc__eventData__c
    /* RERUNEVENT, POSITIONCHANGEEVENT
    {
        'positionFrom':, // -1 is the startPoint Position
		'positionTo':,
		'isHome':  // means if the coin is safe
    }
	*/
    /* NOCHANGEEVENT, GAMESTARTEVENT, GAMEOVEREVENT, GAMESYNCEVENT, PLAYEJOINEVENT
    {
       // empty data
    }
	*/
   
}