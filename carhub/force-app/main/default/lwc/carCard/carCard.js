import { LightningElement,wire} from 'lwc';
import { getFieldValue } from 'lightning/uiRecordApi';
import CAR_OBJ from '@salesforce/schema/Car__c'
import NAME_FIELD from '@salesforce/schema/Car__c.Name'
import PICTURE_URL_FIELD from '@salesforce/schema/Car__c.Picture_URL__c'
import MSRP_FIELD from '@salesforce/schema/Car__c.MSRP__c'
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c'
import FUEL_FIELD from '@salesforce/schema/Car__c.Fuel_Type__c'
import SEATS_FIELD from '@salesforce/schema/Car__c.Number_of_seats__c'
import CONTROL_FIELD from '@salesforce/schema/Car__c.Control__c'
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c'
import{subscribe,MessageContext,unsubscribe} from 'lightning/messageService'
import CARS_SELECTED_MESSAGE from '@salesforce/messageChannel/CarSelected__c'
import {NavigationMixin} from 'lightning/navigation'
export default class CarCard extends NavigationMixin(LightningElement) {

    @wire(MessageContext)
    messageContext;

    categoryField = CATEGORY_FIELD
    makeField = MAKE_FIELD
    msrpField = MSRP_FIELD
    fuelField = FUEL_FIELD
    seatsField = SEATS_FIELD
    controlField = CONTROL_FIELD
    carName
    carPictureUrl
    carIdSubscription
    recordId

    handleRecordLoaded(event){
        const{records} = event.detail
        const recordData = records[this.recordId]
        this.carName = getFieldValue(recordData,NAME_FIELD)
        this.carPictureUrl = getFieldValue(recordData,PICTURE_URL_FIELD)
    }

    connectedCallback(){
        this.subscribeHandler()
    }

    subscribeHandler(){
        this.carIdSubscription=subscribe(this.messageContext,CARS_SELECTED_MESSAGE,(message)=>{this.messageHandler(message)})
    }

    messageHandler(message){
        this.recordId = message.carId.id
    }

    disconnectedCallback(){
        unsubscribe(this.carIdSubscription)
        this.carIdSubscription=null
    }

    handleNavigateToRecord(){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: CAR_OBJ.objectApiName,
                actionName: 'view'
            }
        })
    }
}