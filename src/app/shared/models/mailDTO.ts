import {CommonThirdDTO} from '../copiados/commons/CommonThirdDTO';

export class MailDTO {

    mail:string;
    priority:number;
    state:CommonThirdDTO;

    constructor(mail:string,
        priority:number,
        state:CommonThirdDTO

    ){}

}
