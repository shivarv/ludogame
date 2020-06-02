public without sharing class LudoUtility {

    public static final String player1 = 'Player1';
    public static final String player2 = 'Player2';
    public static final String player3 = 'Player3';
    public static final String player4 = 'Player4';

    public static final String player = 'Player';
    public static final String playersJoinedListText = 'playersJoinedList';
    public static final String playerTypeText = 'playerType';
    public static final String playerNameText = 'playerName';

    @AuraEnabled
    public static String getSessionId() {
        return UserInfo.getSessionId();
    }

    @AuraEnabled
    public static void publishPlatformEvent(String data, LudoEventTypes.LUDOEVENTENUM eventType, String playerType,
    String ludoBoardId
    ) {
        List<shivalwc__LudoEvent__e> platformGameEvent = new List<shivalwc__LudoEvent__e>();
        platformGameEvent.add(new shivalwc__LudoEvent__e(shivalwc__eventData__c = data,
                                shivalwc__eventType__c = eventType.name(),
                                shivalwc__playerType__c	= playerType,
                                shivalwc__ludoBoardId__c = ludoBoardId
        
        ));
        // Call method to publish events
        List<Database.SaveResult> results = EventBus.publish(platformGameEvent);
        
        // Inspect publishing result for each event
        for (Database.SaveResult sr : results) {
            if (sr.isSuccess()) {
                System.debug('Successfully published event.');
            } else {
                for(Database.Error err : sr.getErrors()) {
                    System.debug('Error returned: ' +
                                err.getStatusCode() +
                                ' - ' +
                                err.getMessage());
                }
            }       
        }
    }
}