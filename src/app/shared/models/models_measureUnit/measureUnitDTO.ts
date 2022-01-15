import {CommonStoreDTO} from '../../copiados/commons_store/CommonStoreDTO';
import {CommonStateStoreDTO} from '../../copiados/commons_store/CommonStateStoreDTO';

export class MeasureUnitDTO{
    id_measure_unit_father:number;
    common:CommonStoreDTO;
    state:CommonStateStoreDTO;

    constructor( id_measure_unit_father:number,
        common:CommonStoreDTO,
        state:CommonStateStoreDTO) { }
}