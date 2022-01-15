import {CommonStoreDTO} from '../../copiados/commons_store/CommonStoreDTO';
import {CommonStateStoreDTO} from '../../copiados/commons_store/CommonStateStoreDTO';

export class ProductDTO{
    
    id_category:number;
    id_tax:number;
    img_url:string;
    code:string;
    common:CommonStoreDTO;
    state:CommonStateStoreDTO;

    constructor(id_category:number,
        id_tax:number,
        img_url:string,
        code:string,
        common:CommonStoreDTO,
        state:CommonStateStoreDTO){/**
         * 
         */}
         
}