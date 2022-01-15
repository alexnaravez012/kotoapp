//import { CommonThird } from '../../tienda724/dashboard/business/commons/CommonThird'
import { Mail } from './mail'
import { Phone } from './phone'
import {CommonThird} from '../copiados/commons/CommonThird';

export class Directory {

  id_directory: number;
  address: string;
  country: string;
  city: string;
  webpage: string;
  state: CommonThird;
  mails: Mail[];
  phones: Phone[];

  constructor(
    id_directory: number,
    address: string,
    country: string,
    city: string,
    webpage: string,
    state: CommonThird,
    mails: Mail[],
    phones: Phone[]
  ) { }

}
