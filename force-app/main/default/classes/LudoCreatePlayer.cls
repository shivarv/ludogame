public with sharing class LudoCreatePlayer {
    
    // recordData 
    /* {
        name: this.name;
        shivalwc__ludoBoard__c: '';
    }   */
    @auraEnabled
    public static LudoOutputData requestToJoin(String recordData) {
        Integer playerMaxCount;
        Integer playerJoinedNo;

        Map<String, String> outputMap = null;
        // playerStreamed - Player1
        // playerType - Player2
        // boardId - playerBoardId
        // playerCount - total Number of player
        // playerJoined - total Number of playerJoined
        LudoOutputData outputData = new LudoOutputData();
        if(String.isBlank(recordData)) {
            return null;
        }
        shivalwc__LudoPlayer__c playerRecord = null;
        shivalwc__LudoBoard__c playerBoard = null;
        try {
            playerRecord  = (shivalwc__LudoPlayer__c) JSON.deserialize(recordData,
                                                    shivalwc__LudoPlayer__c.class);  
            if(playerRecord == null || String.isBlank(playerRecord.shivalwc__ludoBoard__c)) {
                outputData.setOutputDatas('', true, 'empty ludoBoard , boardId is required ');
                return outputData;
            }
              
            playerBoard  =  [SELECT id, shivalwc__joinedPlayerCount__c, shivalwc__isGameStarted__c, 
                                    shivalwc__playerCount__c FROM shivalwc__LudoBoard__c WHERE
                                    id = :playerRecord.shivalwc__ludoBoard__c LIMIT 1];
            if(playerBoard.shivalwc__isGameStarted__c == true ||
                (playerBoard.shivalwc__playerCount__c == playerBoard.shivalwc__joinedPlayerCount__c)) {
                    outputData.setOutputDatas('', true, 'Game is already started or max count is reached');
                return outputData;
            }
            playerJoinedNo = Integer.valueOf(playerBoard.shivalwc__joinedPlayerCount__c) + 1;
            playerMaxCount = Integer.valueOf(playerBoard.shivalwc__playerCount__c);
            playerBoard.shivalwc__joinedPlayerCount__c = playerJoinedNo;
            if(playerJoinedNo == playerMaxCount) {
                playerBoard.shivalwc__isGameStarted__c = true;
            }
            playerRecord.shivalwc__playerType__c = (LudoUtility.player	+ playerJoinedNo);
            insert playerRecord;
            update playerBoard;
            outputMap = createOutputMap(playerRecord.name,  playerRecord.shivalwc__playerType__c,
                playerRecord.shivalwc__ludoBoard__c, playerJoinedNo, playerMaxCount
            );
            System.debug(JSON.serialize(outputMap));
            outputData.setOutputDatas(JSON.serialize(outputMap), false, '');
            if(playerBoard.shivalwc__isGameStarted__c == true) {
                //fire platform event for sync
                LudoUtility.publishPlatformEvent(JSON.serialize(outputMap), 
                    LudoEventTypes.LUDOEVENTENUM.PLAYERJOINEVENT, playerRecord.shivalwc__playerType__c);
            }
        }
        
        catch(EXCEPTION e) {
            outputData.setOutputDatas('', true, e.getMessage());
        }
        return outputData;
    }

    private static Map<String, String>  createOutputMap(String playerName,
        String playerType, String playerBoardId, Integer playerJoinedNo, Integer playerMaxCount
    ) {
        Map<String, String> outputMap = new Map<String, String> ();
        outputMap.put('playerName', playerName);
        outputMap.put('playerType', playerType);
        outputMap.put('playerBoardId', playerBoardId);
        outputMap.put('playerJoinedNo', String.valueOf(playerJoinedNo));
        outputMap.put('playerMaxCount', String.valueOf(playerMaxCount));
        return outputMap;
    }

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
