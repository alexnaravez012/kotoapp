

export class DetailBill {
    id_detail_bill:number;
    id_bill:number; /// It can be null, if The Bill does not exist, or It can given the id Biling exist
    id_product_third:number;
    quantity:number;
    price:number;
    tax_product:number;
    tax:number;

    id_state_detail_bill:number;
    state_detail_bill:number;
    creation_detail_bill:Date;
    update_detail_bill:Date;
    
    constructor(
        id_detail_bill:number,
        id_bill:number, /// It can be null, if The Bill does not exist, or It can given the id Biling exist
        id_product_third:number,
        quantity:number,
        price:number,
        tax_product:number,
        tax:number,
    
        id_state_detail_bill:number,
        state_detail_bill:number,
        creation_detail_bill:Date,
        update_detail_bill:Date
    ){/***/}


}