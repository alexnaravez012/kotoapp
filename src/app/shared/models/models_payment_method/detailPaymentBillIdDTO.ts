import {CommonStateDTO} from '../../copiados/commons_billing/commonStateDTO';

export class DetailPaymentBillIdDTO{
    
    id_detail_payment_bill:number;
    id_way_to_pay:number;
    id_payment_method:number;
    payment_value:number;
    aprobation_code:string;
    state:CommonStateDTO;

    
    constructor(){

    }
}