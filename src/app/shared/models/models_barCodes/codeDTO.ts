import {CommonStateStoreDTO} from '../../copiados/commons_store/CommonStateStoreDTO';

export class CodeDTO{

    code:string;
    img:string;
    suggested_price:number;
    id_third_cod:number;
    id_product:number;
    id_measure_unit:number;
    id_attribute_list:number;
    state:CommonStateStoreDTO;

    constructor(code:string,
        img:string,
        suggested_price:number,
        id_third_cod:number,
        id_product:number,
        id_measure_unit:number,
        id_attribute_list:number,
        state:CommonStateStoreDTO){/**
     * 
     */}

}