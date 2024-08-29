import { LightningElement,wire} from 'lwc';
import getCars from  '@salesforce/apex/carController.getCars'
import{publish,subscribe,MessageContext,unsubscribe} from 'lightning/messageService'
import CARS_FILTERED_MESSAGE from '@salesforce/messageChannel/CarsFiltered__c'
import CARS_SELECTED_MESSAGE from '@salesforce/messageChannel/CarSelected__c'
export default class CarTileList extends LightningElement {
    cars=[] 
    error
    filters = {};
    carFilterSubscription

    @wire(getCars,{filters:'$filters'})
    carsHandler({data,error}){
        if(data){
            this.cars = data
        }
        if(error){
            this.error = error
        }
    }

    @wire(MessageContext)
    messageContext

    connectedCallback(){
        this.subscribeHandler()
    }

    subscribeHandler(){
        this.carFilterSubscription = subscribe(this.messageContext, CARS_FILTERED_MESSAGE, (message)=>{
            this.handleFilterChanges(message)
        })
    }

    handleFilterChanges(message){
        console.log(message.filters)
        this.filters = {...message.filters}
    }

    handleCarSelected(event){
        const carIdMessage={
            id : event.detail
        }
        publish(this.messageContext,CARS_SELECTED_MESSAGE,{carId:carIdMessage})
    }

    disconnectedCallback(){
        unsubscribe(this.carFilterSubscription)
        this.carFilterSubscription=null
    }
}