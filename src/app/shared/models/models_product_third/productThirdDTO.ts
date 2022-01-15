import {CommonStateStoreDTO} from '../../copiados/commons_store/CommonStateStoreDTO';
import {CodeDTO} from '../models_barCodes/codeDTO';

export class ProductThirdDTO{

    id_third:number;
    min_price:number;
    standard_price:number;
    id_product:number;
    id_measure_unit:number;
    state:CommonStateStoreDTO;    
    id_attribute_list:number;
    id_category_third:number;
    location:string;
    codeDTO:CodeDTO;

    constructor(id_third:number,
        min_price:number,
        standard_price:number,
        id_product:number,
        id_measure_unit:number,
        state:CommonStateStoreDTO,    
        id_attribute_list:number,
        id_category_third:number,
        location:string,
        codeDTO:CodeDTO){/**
     * 
     */}
    

  
   

}