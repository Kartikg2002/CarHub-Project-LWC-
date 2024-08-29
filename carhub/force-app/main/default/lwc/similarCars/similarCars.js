import { LightningElement,api,wire} from 'lwc';
import getSimilarCars from "@salesforce/apex/carController.getSimilarCars"
import { getRecord } from 'lightning/uiRecordApi';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c'
import CAR_OBJ from '@salesforce/schema/Car__c'
import {NavigationMixin} from 'lightning/navigation'
export default class SimilarCars extends NavigationMixin(LightningElement) {
    @api recordId

    similarCars

    @wire(getRecord,{recordId : '$recordId',fields:[MAKE_FIELD]})
    car

    fetchSimilarCar(){
        getSimilarCars({
            carId : this.recordId,
            makeType : this.car.data.fields.Make__c.value
        }).then(result=>{
            this.similarCars = result
        }).catch(error=>{
            console.error(error)
        })
    }

    handleDetailsClick(event){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.target.dataset.id,
                objectApiName: CAR_OBJ.objectApiName,
                actionName: 'view'
            }
        })
    }
}