import { LightningElement, api } from 'lwc';
import { fireComponentEvent, PLATFORMEVENTSUBSCRIPTIONURL} from 'c/utils';

import getSessionId from '@salesforce/apex/LudoUtility.getSessionId';
import { loadScript } from 'lightning/platformResourceLoader';
import StreamingAPI from '@salesforce/resourceUrl/StreamingAPI';


export default class LudoPlatformEventSubscription extends LightningElement {
       //Channle Name
    @api channel;

    //Override the version of api to use cometd. By default it will use 45.
    @api apiVersion = '40.0';

    //If true then user can see console logs with data.
    @api debug = false;

    cometd;
    subscription;

    connectedCallback(){
       this.loadCometdScript();
    }

   
    loadCometdScript(){
        let mainThis = this;
        if( !this.subscription ){
            this.subscription = true;
            Promise.all([
                loadScript(mainThis, StreamingAPI + '/StreamingAPI/Cometd.js'),
                loadScript(mainThis, StreamingAPI + '/StreamingAPI/jquery_1.5.2.min.js'),
                loadScript(mainThis, StreamingAPI + '/StreamingAPI/json2.js')


            ])
            .then(() => {
                console.log('event connected1 ');

                Promise.all([loadScript(mainThis, StreamingAPI + '/StreamingAPI/jquery.cometd.js')])
                    .then(() => {
                        console.log('event connected2 ');
                        this.loadSessionId();
                }).catch(error => {
                    console.log('errror at last script '+ error);
                });

                
                
            })
            .catch(error => {
                console.log('error '+ JSON.stringify(error));
            });
        }
        else{
            this.consoleLog('(LWC Streaming API) Error: Subscription already exists.');
        }
    }

    firePlatformComponentEvent(data, eventType) {
        console.log('in fireRandomNumberEvent');
        let inputData = {data: data, isPlatformEvent: true, eventType: eventType};
        fireComponentEvent(JSON.stringify(inputData), this)
    }
    loadSessionId() {
        let mainThis = this;
       console.log(' in loadSessionId method ');
       getSessionId().then(sessionId => {
           console.log('(LWC Streaming API) Session ID: '+sessionId);
           let authstring = "OAuth " + sessionId;

           //authenticate to the Streaming API
           $.cometd.init({
               url: window.location.protocol + '//' + window.location.hostname + '/cometd/'+this.apiVersion +'/',
               requestHeaders: { Authorization: authstring },
               appendMessageTypeToURL : false
           });
          
           console.log('after init');
           $.cometd.subscribe(PLATFORMEVENTSUBSCRIPTIONURL, function (message){
                console.log(JSON.stringify(message));
                mainThis.firePlatformComponentEvent(JSON.stringify(message));
           });
       });
    }
}