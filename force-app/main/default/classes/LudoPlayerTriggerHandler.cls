public class LudoPlayerTriggerHandler {
    public static void  setUniqueValidation(List<shivalwc__LudoPlayer__c> playerRecordList) {
        if(playerRecordList == null || playerRecordList.isEmpty()) {
            return;
        }
        for(shivalwc__LudoPlayer__c playerRecord : playerRecordList) {
            playerRecord.shivalwc__unique_Id_Validation__c = ((
                playerRecord.shivalwc__ludoBoard__c == null ? '' : playerRecord.shivalwc__ludoBoard__c)
            	+ '-'  +
                (String.isBlank(playerRecord.shivalwc__playerType__c) ? '' : playerRecord.shivalwc__playerType__c)
            );      
        }
    }
}