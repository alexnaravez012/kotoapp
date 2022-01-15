export class DetailPaymentBill{

    id_detail_payment_bill:number;
    id_bill:number; 
    id_way_to_pay:number;
    id_payment_method:number;
    payment_value:number;
    aprobation_code:string;

    id_state_det_pay:number;
    state_det_pay:number;
    creation_det_pay:Date;
    update_det_pay:Date;

    constructor (
        id_detail_payment_bill:number,
        id_bill:number, 
        id_way_to_pay:number,
        id_payment_method:number,
        payment_value:number,
        aprobation_code:string,
    
        id_state_det_pay:number,
        state_det_pay:number,
        creation_det_pay:Date,
        update_det_pay:Date
    ){
        /**
         * 
         */
    }
}