import {CommonStateDTO} from '../../copiados/commons_billing/commonStateDTO';

export  class WayToPayDTO {
    name:string;
    state:CommonStateDTO;
    constructor(
        name:string,
        state:CommonStateDTO){

    }

}