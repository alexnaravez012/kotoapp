import {CommonStateDTO} from '../../copiados/commons_billing/commonStateDTO';
import { DetailBillDTO } from './detailBillDTO'

import {DetailPaymentBillDTO} from '../models_payment_method/detailPaymentBillDTO';
import {DocumentDTO} from '../../copiados/commons_billing/documentDTO';

export class BillDTO { 
    id_store:number
    id_bill_father:number;
    id_third_employee:number;
    id_third:number;
    id_payment_state:number;
    id_bill_state:number;
    id_bill_type:number;
    purchase_date:Date;
    subtotal:number;
    tax:number;
    totalprice:number;
    discount:number;
    id_third_destiny:number;

    state:CommonStateDTO;


    // Attributes optionals
    payments:DetailPaymentBillDTO[];
    details:DetailBillDTO[];
    documentDTO:DocumentDTO;

    constructor(
        id_store:number,
        id_bill_father:number,
        id_third_employee:number,
        id_third:number,
        id_payment_state:number,
        id_bill_state:number,
        id_bill_type:number,
        purchase_date:Date,
        subtotal:number,
        tax:number,
        totalprice:number,
        discount:number,
        id_third_destiny,
        state:CommonStateDTO,
    
    
        // Attributes optionals
        payments:DetailPaymentBillDTO[],
        details:DetailBillDTO[],
        documentDTO:DocumentDTO
    ){
        
    }



}