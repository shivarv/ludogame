public without sharing class LudoUtility {
    @AuraEnabled
    public static string getSessionId() {
        return UserInfo.getSessionId();
    }
}
