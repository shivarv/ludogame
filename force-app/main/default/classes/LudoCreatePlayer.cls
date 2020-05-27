public with sharing class LudoCreatePlayer {
    
    @auraEnabled
    public static shivalwc__LudoPlayer__c createPlayer(String recordData, Integer playerCount) {
        if(String.isBlank(recordData)) {
            return null;
        }
        shivalwc__LudoPlayer__c playerRecord = null;
        try {
           
            playerRecord  = (shivalwc__LudoPlayer__c) JSON.deserialize(recordData,
                                                    shivalwc__LudoPlayer__c.class);
            playerRecord.shivalwc__unique_Id_Validation__c = ((
                playerRecord.shivalwc__ludoBoard__c == null ? '' : playerRecord.shivalwc__ludoBoard__c)
            	    + '-'  +
                (String.isBlank(playerRecord.shivalwc__playerType__c) ? '' : playerRecord.shivalwc__playerType__c)
                );
            if(playerRecord.playerType__c == LudoUtility.player1) {
                playerRecord.shivalwc__ludoBoard__c = createPlayerBoard(playerCount);
            }
            insert playerRecord;
            if(playerRecord.playerType__c != LudoUtility.player1) {
                LudoUtility.publishPlatformEvent('', LudoEventTypes.LUDOEVENTENUM.PLAYERJOINEVENT, playerRecord.playerType__c);
            }
        }
        catch(DMLEXCEPTION e) {

        }
        catch(EXCEPTION e) {

        }
        return playerRecord;
    }

    private static Id createPlayerBoard(Integer playerCount) {
        shivalwc__LudoBoard__c playerBoard = new  shivalwc__LudoBoard__c(shivalwc__playerCount__c = playerCount);
        insert playerBoard;
        return playerBoard.Id;
    }
}
