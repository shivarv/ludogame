import { LightningElement, api } from 'lwc';

export default class LudoPlayerStartBox extends LightningElement {
    @api boxColor;
    @api boxPosition;

    get colorClass() { 
        console.log(' in colorClass '+ this.boxColor);
        if(!this.boxColor) {
            return 'grey-background';
        }
        return this.boxColor + '-background';
    }

    get innerDivTopLeft() {
        console.log('default-innerdiv smalldiv-top smalldiv-left '+ this.colorClass);
        return 'default-innerdiv smalldiv-top smalldiv-left '+ this.colorClass;
    }

    get innerDivTopRight() {
        return 'default-innerdiv smalldiv-top smalldiv-right '+ this.colorClass;
    }

    get innerDivBottomLeft() {
        return 'default-innerdiv smalldiv-bottom smalldiv-left '+ this.colorClass;
    }

    get innerDivBottomRight() {
        return 'default-innerdiv smalldiv-bottom smalldiv-right '+ this.colorClass;
    }


    get positionClass() { 
        console.log(' in positionClass '+ this.boxPosition);
        if(!this.boxPosition) {
            return 'default-box top-left';
        }
        if( this.boxPosition == 'top-left') {
            return 'default-box top-left';
        } else if( this.boxPosition == 'top-right') {
            return 'default-box top-right';
        } else if (this.boxPosition == 'bottom-left') {
            return 'default-box bottom-left';
        } else if(this.boxPosition == 'bottom-right') {
            return 'default-box bottom-right';
        } 
        return 'default-box top-left';
    }
}