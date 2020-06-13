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
        String playersListString = '';
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
            playersListString = joinedPlayerDetailsString(playerBoard.Id);
            //fire platform to let players know that new player has joined
            LudoUtility.publishPlatformEvent(JSON.serialize(outputMap), 
                LudoEventTypes.LUDOEVENTENUM.PLAYERJOINEVENT, playerRecord.shivalwc__playerType__c,
                playerRecord.shivalwc__ludoBoard__c
                );
            // only new playerwho joins need this data
            outputMap.put(LudoUtility.playersJoinedListText, playersListString);
            outputData.setOutputDatas(JSON.serialize(outputMap), false, '');
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

    private static String joinedPlayerDetailsString(Id ludoBoardId) {
        List<Map<String, String>> outputList = new List<Map<String, String>>();
        List<shivalwc__LudoPlayer__c> playersList = [SELECT id, shivalwc__playerType__c, Name FROM shivalwc__LudoPlayer__c WHERE
                                    shivalwc__ludoBoard__c = :ludoBoardId];
        if(playersList == null || playersList.isEmpty()) {
            return '';
        }
        for(shivalwc__LudoPlayer__c indPlayer: playersList) {
            Map<String, String> indOutputMap = new Map<String, String>();
            indOutputMap.put(LudoUtility.playerNameText, indPlayer.Name);
            indOutputMap.put(LudoUtility.playerTypeText, indPlayer.shivalwc__playerType__c);
            outputList.add(indOutputMap);
        }
        return JSON.serialize(outputList);
    }

    private static Map<String, String>  createOutputMap(String playerName,
        String playerType, String playerBoardId, Integer playerJoinedNo, Integer maxPlayerCount
    ) {
        Map<String, String> outputMap = new Map<String, String> ();
        outputMap.put(LudoConstants.PLAYERNAMETEXT, playerName);
        outputMap.put(LudoConstants.PLAYERTYPETEXT, playerType);
        outputMap.put(LudoConstants.PLAYERBOARDIDTEXT, playerBoardId);
        outputMap.put(LudoConstants.PLAYERJOINEDNOTEXT, String.valueOf(playerJoinedNo));
        outputMap.put(LudoConstants.MAXPLAYERCOUNTTEXT, String.valueOf(maxPlayerCount));
        outputMap.put(LudoConstants.ISLASTPLAYERTEXT, String.valueOf(playerJoinedNo == maxPlayerCount));

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

    @auraEnabled
    public static void fireGameStartPlatformEvent(String eventData, String ludoBoardId) {
        String playerType = LudoUtility.player1; // player1 will start the game event
        System.debug('in fireGameStartPlatformEvent method ');
        LudoUtility.publishPlatformEvent(eventData, LudoEventTypes.LUDOEVENTENUM.GAMESTARTEVENT,
                                            playerType, ludoBoardId);
    }

    private static Id createPlayerBoard(Integer playerCount) {
        shivalwc__LudoBoard__c playerBoard = new  shivalwc__LudoBoard__c(
            shivalwc__joinedPlayerCount__c = 1,    
            shivalwc__playerCount__c = playerCount);
        insert playerBoard;
        return playerBoard.Id;
    }



}
