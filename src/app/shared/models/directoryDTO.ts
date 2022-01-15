import { MailDTO } from './mailDTO'
import { PhoneDTO } from './phoneDTO'
import {CommonThirdDTO} from '../copiados/commons/CommonThirdDTO';

export class DirectoryDTO {

  address: string;
  country: string;
  city: string;
  webpage: string;
  state: CommonThirdDTO;
  mails: MailDTO[];
  phones: PhoneDTO[];

  constructor(address: string,
    country: string,
    city: string,
    webpage: string,
    state: CommonThirdDTO,
    mails: MailDTO[],
    phones: PhoneDTO[]
  ) { }

}
