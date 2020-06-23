import { LightningElement } from 'lwc';
import {CURRENTORGNAMESPACE} from 'c/utils';
import createPlayerMethod from '@salesforce/apex/LudoCreatePlayer.createPlayer';

import LUDO_OBJECT_NAME from '@salesforce/schema/LudoPlayer__c.Name';
import LUDO_OBJECT_BOARDID from '@salesforce/schema/LudoPlayer__c.ludoBoard__c';
import LUDO_OBJECT_PLAYERTYPE from '@salesforce/schema/LudoPlayer__c.playerType__c';
import LUDO_OBJECT_UNIQUEID from '@salesforce/schema/LudoPlayer__c.unique_Id_Validation__c';


export default class TestComp extends LightningElement {

    testVal = 2;

    testText = 'hello default';

    constructor() {
        super();
        console.log(' LUDO_OBJECT_NAME '+ LUDO_OBJECT_NAME.fieldApiName + ' '  +
                ' LUDO_OBJECT_BOARDID '+ LUDO_OBJECT_BOARDID.fieldApiName + ' '  +
                ' LUDO_OBJECT_PLAYERTYPE '+ LUDO_OBJECT_PLAYERTYPE.fieldApiName + ' '  +
                ' LUDO_OBJECT_UNIQUEID '+ LUDO_OBJECT_UNIQUEID.fieldApiName
        );
    }

    connectedCallback() {
        console.log(' LUDO_OBJECT_NAME '+ JSON.stringify(LUDO_OBJECT_NAME) + ' '  +
                ' LUDO_OBJECT_BOARDID '+ JSON.stringify(LUDO_OBJECT_BOARDID) + ' '  +
                ' LUDO_OBJECT_PLAYERTYPE '+ JSON.stringify(LUDO_OBJECT_PLAYERTYPE) + ' '  +
                ' LUDO_OBJECT_UNIQUEID '+ JSON.stringify(LUDO_OBJECT_UNIQUEID)
        );
    }

    handlePlayerSubmit() {
        console.log(' in handle Player Submit ');
        let objectNameApi = LUDO_OBJECT_NAME.fieldApiName;
        let boardIdApi = LUDO_OBJECT_BOARDID.fieldApiName;
        let playerTypeApi = LUDO_OBJECT_PLAYERTYPE.fieldApiName;
        let uniqueIdApi = LUDO_OBJECT_UNIQUEID.fieldApiName;

        let playerObject = {
            
        };
        playerObject[objectNameApi] = 'sample';
        playerObject[boardIdApi] = '';
        playerObject[playerTypeApi] = 'Player1';
        playerObject[uniqueIdApi] = 'sample';
        console.log('input data '+ JSON.stringify(playerObject));
        
        createPlayerMethod({'recordData': JSON.stringify(playerObject), 'playerCount': 4})
        .then(result => {
           console.log(' result is '+ JSON.stringify(result));
        })
        .catch(error => {
            console.log('error is '+ JSON.stringify(error));
            this.error = error;
        }); 
    }

    changeParentValue() {
        console.log('in changeParentValue ');
        this.testVal = this.testVal + 1;


        this.testText += 'updated';
    }

    changeChildValue() {
        console.log('in changeChildValue ');
        let ele = this.template.querySelector('c-test-get-set-method').setDataMethod();


    }
}