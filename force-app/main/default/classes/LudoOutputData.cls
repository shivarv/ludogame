public class LudoOutputData {
    @AuraEnabled
    public String outputData{get; set;}
    @AuraEnabled
    public Boolean isError{get; set;}
    @AuraEnabled
    public String errorMessage{get; set;}

    public LudoOutputData() {
        this.outputData = '';
        this.isError = false;
        this.errorMessage = '';
    }

    public LudoOutputData(String outputData, Boolean isError, String errorMessage) {
        this.outputData = outputData;
        this.isError = isError;
        this.errorMessage = errorMessage;
    }

    public void setOutputDatas(String outputData, Boolean isError, String errorMessage) {
        this.outputData = outputData;
        this.isError = isError;
        this.errorMessage = errorMessage;
    }
}
