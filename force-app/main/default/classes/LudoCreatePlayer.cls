public with sharing class LudoCreatePlayer {
    
    // recordData 
    /* {
        name: this.name;
        shivalwc__ludoBoard__c: '';
    }   */
    @auraEnabled
    public static LudoOutputData requestToJoin(String recordData) {
        Integer maxPlayerCount;
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
            maxPlayerCount = Integer.valueOf(playerBoard.shivalwc__playerCount__c);
            playerBoard.shivalwc__joinedPlayerCount__c = playerJoinedNo;
            if(playerJoinedNo == maxPlayerCount) {
                playerBoard.shivalwc__isGameStarted__c = true;
            }
            playerRecord.shivalwc__playerType__c = (LudoUtility.player	+ playerJoinedNo);
            insert playerRecord;
            update playerBoard;
            outputMap = createOutputMap(playerRecord.name,  playerRecord.shivalwc__playerType__c,
                playerRecord.shivalwc__ludoBoard__c, playerJoinedNo, maxPlayerCount
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
            System.debug(e.getStackTraceString());
            System.debug(e.getLineNumber());

            outputData.setOutputDatas('', true, e.getMessage() + ' '+e.getLineNumber()
            + e.getStackTraceString()
            );
        }
        return outputData;
    }

    private static Map<String, String>  createOutputMap(String playerName,
        String playerType, String playerBoardId, Integer playerJoinedNo, Integer maxPlayerCount
    ) {
        Map<String, String> outputMap = new Map<String, String> ();
        outputMap.put('playerName', playerName);
        outputMap.put('playerType', playerType);
        outputMap.put('playerBoardId', playerBoardId);
        outputMap.put('playerJoinedNo', String.valueOf(playerJoinedNo));
        outputMap.put('maxPlayerCount', String.valueOf(maxPlayerCount));
        return outputMap;
    }

    @auraEnabled
    public static LudoOutputData createPlayer(String playerName, Integer maxPlayerCount) {
        Map<String, String> outputMap = null;
        LudoOutputData outputData = new LudoOutputData();
        Integer playerJoinedNo = 1;
        if(String.isBlank(playerName) || maxPlayerCount == null) {
            return null;
        }
        shivalwc__LudoPlayer__c playerRecord = new shivalwc__LudoPlayer__c();
        Id ludoBoardId = null;
        try {
            ludoBoardId = createPlayerBoard(maxPlayerCount);
            playerRecord.Name = playerName;
            playerRecord.playerType__c = LudoUtility.player1;
            playerRecord.shivalwc__ludoBoard__c = ludoBoardId;
            insert playerRecord;
            outputMap = createOutputMap(playerRecord.name,  playerRecord.shivalwc__playerType__c,
                playerRecord.shivalwc__ludoBoard__c, playerJoinedNo, maxPlayerCount
            );
            System.debug(JSON.serialize(outputMap));
            outputData.setOutputDatas(JSON.serialize(outputMap), false, '');
        }
        catch(DMLEXCEPTION e) {
            outputData.setOutputDatas('', true, e.getMessage());
        }
        catch(EXCEPTION e) {
            outputData.setOutputDatas('', true, e.getMessage());
        }
        return outputData;
    }

    private static Id createPlayerBoard(Integer playerCount) {
        shivalwc__LudoBoard__c playerBoard = new  shivalwc__LudoBoard__c(
            shivalwc__joinedPlayerCount__c = 1,    
            shivalwc__playerCount__c = playerCount);
        insert playerBoard;
        return playerBoard.Id;
    }
}