import { LightningElement, api } from 'lwc';
import getSessionId from '@salesforce/apex/LudoUtility.getSessionId';
import { loadScript } from 'lightning/platformResourceLoader';
import cometdStaticResource from '@salesforce/resourceUrl/cometd';

import cometdStaticResourceZip from '@salesforce/resourceUrl/cometd1';


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
         if( !this.subscription ){
             Promise.all([
                 loadScript(this, cometdStaticResource)
             ])
             .then(() => {
                 console.log('event connected ');
                 this.loadSessionId();
                 
             })
             .catch(error => {
                 console.log('error '+ JSON.stringify(error));
                 let message = error.message || error.body.message;
             });
         }
         else{
             this.consoleLog('(LWC Streaming API) Error: Subscription already exists.');
         }
     }

     loadSessionId() {
        console.log(' in loadSessionId method ');
        getSessionId().then(sessionId => {
            console.log('(LWC Streaming API) Session ID: '+sessionId);
            this.cometd = new window.org.cometd.CometD();

            //Configuring Cometd
             this.cometd.configure({
                url: window.location.protocol + '//' + window.location.hostname + '/cometd/',
                requestHeaders: { Authorization: 'OAuth ' + sessionId},
                appendMessageTypeToURL : false
            });
            this.cometd.websocketEnabled = false;

            console.log('after coonfigure ');

            this.cometd.handshake( (status) => {
                if (status.successful) {
                    console.log('(LWC Streaming API) Handshake Successful on : '+ this.channel );
                    console.log('(LWC Streaming API) Handshake Status: '+ JSON.stringify(status) );

                    //Subscribe to channel
                    this.subscription = this.cometd.subscribe( this.channel , (message) => {
                        console.log('(LWC Streaming API) Message: '+ JSON.stringify(message) );
                    });
                }
                else{
                    console.log('(LWC Streaming API) Error in Handshake: '+ JSON.stringify(status) );
                }
            });
            

        }).catch(error => {
            console.log(' error in subscription '+ JSON.stringify(error));
            let message = error.message || error.body.message;
            //Initiating Cometd 
        });
     }
     /*
     loadSessionId(){
         console.log(' in loadSessionId method ');
         getSessionId()
         .then(sessionId => {
             this.consoleLog('(LWC Streaming API) Session ID: '+sessionId);
 
             //Initiating Cometd 
             this.cometd = new window.org.cometd.CometD();
 
             //Configuring Cometd
             this.cometd.configure({
                 url: window.location.protocol + '//' + window.location.hostname + '/cometd/'+this.apiVersion+'/',
                 requestHeaders: { Authorization: 'OAuth ' + sessionId},
                 appendMessageTypeToURL : false
             });
             this.cometd.websocketEnabled = false;
 
             //Initiating Cometd Handshake
             this.cometd.handshake( (status) => {
                 if (status.successful) {
                     this.consoleLog('(LWC Streaming API) Handshake Successful on : '+ this.channel );
                     this.consoleLog('(LWC Streaming API) Handshake Status: '+ JSON.stringify(status) );
 
                     //Subscribe to channel
                     this.subscription = this.cometd.subscribe( this.channel , (message) => {
                         this.consoleLog('(LWC Streaming API) Message: '+ JSON.stringify(message) );
                      //   this.fireMessageEvent(message);
                     });
                 }
                 else{
                     this.consoleLog('(LWC Streaming API) Error in Handshake: '+ JSON.stringify(status) );
                    // this.fireErrorEvent(status);
                 }
             });
 
         })
         .catch(error => {
             console.log(' error in subscription '+ JSON.stringify(error));
             let message = error.message || error.body.message;
            // this.fireErrorEvent('Error: '+ message);
         });
     }
 
    /*
    fireErrorEvent(logMsg){
         this.dispatchEvent( 
             new CustomEvent('error', {
                 detail: {error: logMsg}
             })
         );
     }
 
    
     fireMessageEvent(payload){
         this.dispatchEvent( 
             new CustomEvent('message', {
                 detail: {payload: payload}
             })
         );
     }
     

     @api
     unsubscribe(){
         //Unsubscribing Cometd
         this.cometd.unsubscribe( this.subscription, {}, (unsubResult) => {
             
             if( unsubResult.successful ) {
                 this.consoleLog('(LWC Streaming API) unsubscribed successfully.');
 
                 //Disconnecting Cometd
                 this.cometd.disconnect((disResult) => { 
                     if(disResult.successful) {
                         this.consoleLog('(LWC Streaming API) disconnected.');
                     }
                     else{
                         this.consoleLog('(LWC Streaming API) disconnection unsuccessful.');                
                     }
                 });
             }
             else{
                 this.consoleLog('(LWC Streaming API) unsubscription failed.');
             }
         });
         
         this.subscription = undefined;
     }
 
     
     @api
     subscribe(){
         this.loadCometdScript();
     }
 
     
     checkConnection(){
         if( this.subscription ){
             return true;
         }
 
         return false;
     }
 
    
     consoleLog(msg){
         if( this.debug ){
             console.log(msg);
         }
     }
     */
}