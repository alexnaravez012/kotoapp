
import { InventoryDetailDTO } from './inventoryDetailDTO'
import {CommonStoreDTO} from '../../copiados/commons_store/CommonStoreDTO';
import {CommonStateStoreDTO} from '../../copiados/commons_store/CommonStateStoreDTO';


export class InventoryDTO{
    id_third:number;
    common:CommonStoreDTO;
    state:CommonStateStoreDTO;
    details?:InventoryDetailDTO[];

    constructor(id_third:number,
        common:CommonStoreDTO,
        state:CommonStateStoreDTO,
        details?:InventoryDetailDTO[]){

    }


}