

import { DetailBillDTO } from './detailBillDTO'
import {CommonStateDTO} from '../../copiados/commons_billing/commonStateDTO';
import {DetailPaymentBillDTO} from '../models_payment_method/detailPaymentBillDTO';

export class BillCompleteDTO{

    id_bill_father:number;
    id_third_employee:number;
    id_third:number;
    id_payment_state:number;
    id_bill_state:number;
    id_bill_type:number;


    consecutive:string;
     purchase_date:Date;
    subtotal:number;
    tax:number;
    totalprice:number;
    state= CommonStateDTO;


      // Attributes optionals
      detailPaymentBillDTO:DetailPaymentBillDTO;
      detailBillDTOS:DetailBillDTO[];


    constructor(
        id_bill_father:number,
        id_third_employee:number,
        id_third:number,
        id_payment_state:number,
        id_bill_state:number,
        id_bill_type:number,
    
    
        consecutive:string,
         purchase_date:Date,
        subtotal:number,
        tax:number,
        totalprice:number,
        state= CommonStateDTO,
    
    
          // Attributes optionals
          detailPaymentBillDTO:DetailPaymentBillDTO,
          detailBillDTOS:DetailBillDTO[]){/**
     * 
     */

    }
}