import {CommonStateDTO} from '../../copiados/commons_billing/commonStateDTO';

export class DetailBillIdDTO {
    id_detail_bill:number;
    quantity:number;
    price:number;
    tax_product:number;
    id_product_third:number;
    tax:number;
    state:CommonStateDTO;
    
    constructor(id_detail_bill:number,
        quantity:number,
        price:number,
        tax_product:number,
        id_product_third:number,
        tax:number,
        state:CommonStateDTO
    ){/***/}


}