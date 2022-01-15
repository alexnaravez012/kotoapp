import {PaymentState} from '../models_payment/paymentState';
import {BillState} from '../models_billstate/billState';
import {BillType} from '../models_billtype/billType';
import {Document} from '../../copiados/commons_billing/document';

export class BillComplete{

    id_bill:number;
    id_bill_father:number;
    id_third_employee:number;
    id_third:number;
    consecutive:string;

    purchase_date:Date;
    subtotal:number;
    totalprice:number;
    tax:number;
    discount:number;

    payment_state:PaymentState;
    bill_state:BillState;
    bill_type:BillType;
    document:Document

    id_state_bill:number;
    state_bill:number;
    creation_bill:Date;
    update_bill:Date;


    constructor(id_bill:number,
        id_bill_father:number,
        id_third_employee:number,
        id_third:number,
        consecutive:string,
    
        purchase_date:Date,
        subtotal:number,
        totalprice:number,
        tax:number,
        discount:number,
    
        payment_state:PaymentState,
        bill_state:BillState,
        bill_type:BillType,
        document:Document,
    
        id_state_bill:number,
        state_bill:number,
        creation_bill:Date,
        update_bill:Date){/**
     * 
     */

    }
}