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
    
    public static Boolean isValidEnumEventType(String eventTypeString) {
        List<LudoEventTypes.LUDOEVENTENUM> enumList = LudoEventTypes.LUDOEVENTENUM.values();

        for(Integer i = 0; i < enumList.size(); i++) {
            if(enumList.get(i).name() == eventTypeString) {
                return true;
            }
        }
        return false;
    }

    @AuraEnabled
    public static void publishPlatformEvent(String data, String eventType, String playerType,
                                                    String ludoBoardId ) {
        List<shivalwc__LudoEvent__e> platformGameEvent = new List<shivalwc__LudoEvent__e>();
        System.debug('in publishPlatform event '+ data + ' '+eventType +' '+playerType + ' '+ ludoBoardId);
        platformGameEvent.add(new shivalwc__LudoEvent__e(shivalwc__eventData__c = data,
                                shivalwc__eventType__c = eventType,
                                shivalwc__playerType__c	= playerType,
                                shivalwc__ludoBoardId__c = ludoBoardId
        
        ));
        // Call method to publish events
        List<Database.SaveResult> results = EventBus.publish(platformGameEvent);
        
        // Inspect publishing result for each event
        for (Database.SaveResult sr : results) {
            if (sr.isSuccess()) {
                System.debug('Successfully published event. shivalwc__LudoEvent__e, eventype '+eventType + ' ludoBoardId '+ludoBoardId);
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

    public static void publishPlatformEvent(String data, LudoEventTypes.LUDOEVENTENUM eventType, String playerType,
    String ludoBoardId
    ) {
        if(eventType == null) {
            return;
        }
        publishPlatformEvent(data, eventType.name(), playerType, ludoBoardId);
    }
}