import { Directory } from '../models/directory'
import {TypeThirdComponent} from './type-third.component';
import {CommonThird} from './commons/CommonThird';
import {CommonBasicInfo} from './commons/CommonBasicInfo';

export class Third {

    id_third: number;
    id_third_father: number;
    profile: any;
    type: TypeThirdComponent;
    state: CommonThird;
    info: CommonBasicInfo;
    directory: Directory;

    constructor(

        id_third: number,
        id_third_father: number,
        profile: any,
        type: TypeThirdComponent,
        state: CommonThird,
        info: CommonBasicInfo,
        directory: Directory

    ) { }

}
