import { LightningElement,wire} from 'lwc';
import { getObjectInfo,getPicklistValuesByRecordType} from 'lightning/uiObjectInfoApi';
import CARHUB from '@salesforce/schema/Car__c'
const CATEGORY_ERROR = "Error in Loading Category"
const MAKE_ERROR = "Error in Loading  Make"
import{publish,MessageContext} from 'lightning/messageService'
import CARS_FILTERED_MESSAGE from '@salesforce/messageChannel/CarsFiltered__c'
export default class CarFilter extends LightningElement {

    filters={
        searchKey:'',
        maxPrice: 999999
    }
    categoryOptions = []
    makeOptions = []
    categoryError = CATEGORY_ERROR
    makeError = MAKE_ERROR
    timer

    @wire(MessageContext)
    messageContext

    @wire(getObjectInfo,{objectApiName : CARHUB})
    objInfo;

    @wire(getPicklistValuesByRecordType,{objectApiName : CARHUB , recordTypeId:'$objInfo.data.defaultRecordTypeId'})
    pickListHandler({data,error}){
        if(data){
            this.categoryOptions = this.pickListGenerator(data.picklistFieldValues.Category__c)
            this.makeOptions = this.pickListGenerator(data.picklistFieldValues.Make__c)
        }
        if(error){
            console.log(error)
        }
    }
    pickListGenerator(data){
        return data.values.map(item=>({"label" : item.label,"value" : item.value}))
    }


    handleSearchKeyChange(event){
        console.log(event.target.value)
        this.filters.searchKey = event.target.value;
        this.sendDataToCarList()
    }
    handleMaxPriceChange(event){
        console.log(event.target.value)
        this.filters.maxPrice = event.target.value;
        this.sendDataToCarList()    
    }
    handleChange(event) {
        if(!this.filters.categories){
            const categories = this.categoryOptions.map(item=>(item.value))
            const makeType = this.makeOptions.map(item=>(item.value))
            this.filters = {...this.filters,categories:categories,makeType:makeType}
        }

        const {name,value} = event.target.dataset

        if(event.target.checked){
            if(!this.filters[name].includes(value)){
                this.filters[name] = [...this.filters[name],value]
            }
        }else{
            this.filters[name] = this.filters[name].filter(item=>(item !== value))
        }
        this.sendDataToCarList()
    }

    sendDataToCarList(){
        window.clearTimeout(this.timer)
        this.timer = window.setTimeout(()=>{
            publish(this.messageContext,CARS_FILTERED_MESSAGE,{filters: this.filters})
        },400)              
    }
}