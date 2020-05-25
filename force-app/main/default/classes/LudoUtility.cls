public without sharing class LudoUtility {

    @AuraEnabled
    public static string getSessionId() {
        return UserInfo.getSessionId();
    }

    @AuraEnabled
    public static void publishPlatformEvent(String data) {
        List<shivalwc__LudoEvent__e> platformGameEvent = new List<shivalwc__LudoEvent__e>();
        platformGameEvent.add(new shivalwc__LudoEvent__e(shivalwc__eventData__c = data));
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