import { stateDTO } from "./stateDTO";

export class paymentDetailDTO{

    id_way_to_pay:number;
    id_payment_method:number;
    payment_value:number;
    aprobation_code:string;
    state:stateDTO;

    constructor(id_way_to_pay:number,
        id_payment_method:number,
        payment_value:number,
        aprobation_code:string,
        state:stateDTO){

    }

}