import {PaymentMethod} from './paymentMethod'
import {WayToPay} from '../models_way_to_pay/wayToPay';

export class DetailPaymentBillComplete{
    id_detail_payment_bill:number;
    payment_value:number;
    id_bill:number;
    aprobation_code:string;

    payment_method:PaymentMethod;
    way_pay:WayToPay;
    id_state_det_pay:number;
    state_det_pay:number;
    creation_det_pay:Date;
    update_det_pay:Date;

    constructor(id_detail_payment_bill:number,
        payment_value:number,
        id_bill:number,
        aprobation_code:string,
    
        payment_method:PaymentMethod,
        way_pay:WayToPay,
        id_state_det_pay:number,
        state_det_pay:number,
        creation_det_pay:Date,
        update_det_pay:Date){
        /**
         * 
         */
    }
}