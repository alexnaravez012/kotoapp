
export class Bill {
    id_bill:number;
    id_bill_father:number;
    id_third_employee:number;
    id_third:number;
    consecutive:string;
    purchase_date: Date;
    subtotal:Number;
    totalprice:number;
    tax:number;
    discount:number;

    id_payment_state:number;
    id_bill_state:number;
    id_bill_type:number;
    id_document:number;

    id_state_bill:number;
    state_bill:number;
    creation_bill:Date;
    update_bill:number;
    
    constructor(
        id_bill:number,
        id_bill_father:number,
        id_third_employee:number,
        id_third:number,
        consecutive:string,
        purchase_date: Date,
        subtotal:Number,
        totalprice:number,
        tax:number,
        discount:number,
    
        id_payment_state:number,
        id_bill_state:number,
        id_bill_type:number,
        id_document:number,
    
        id_state_bill:number,
        state_bill:number,
        creation_bill:Date,
        update_bill:number
    ){/***/}


}