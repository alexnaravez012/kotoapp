import {CommonStateDTO} from '../../copiados/commons_billing/commonStateDTO';

export class DetailBillDTO {
   
    quantity:number;
    price:number;
    tax:number;
    id_product_third:number;
    tax_product:number;
    state:CommonStateDTO;
    id_storage: number;
    
    constructor(quantity:number,
        price:number,
        tax_product:number,
        id_product_third:number,
        tax:number,
        state:CommonStateDTO,
        id_storage: number
    ){/***/}


}