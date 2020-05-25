trigger LudoPlayerTrigger on shivalwc__LudoPlayer__c (before insert) {

    if(Trigger.isInsert && Trigger.isBefore) {
        LudoPlayerTriggerHandler.setUniqueValidation(Trigger.new);
    }
}