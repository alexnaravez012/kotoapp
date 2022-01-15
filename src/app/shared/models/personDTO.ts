import { DirectoryDTO } from './directoryDTO'
import { EmployeeDTO } from './employeeDTO'
import { UserThirdDTO } from './userThirdDTO'
import {CommonBasicInfoDTO} from '../copiados/commons/CommonBasicInfoDTO';
import {CommonThirdDTO} from '../copiados/commons/CommonThirdDTO';

export class PersonDTO {

    first_name:string;
    second_name:string;
    first_lastname:string;
    second_lastname:string;
    birthday:Date;
    info:CommonBasicInfoDTO;
    state:CommonThirdDTO;
    directory:DirectoryDTO;
    employee:EmployeeDTO;
    UUID:UserThirdDTO;

    constructor(first_name:string,
    second_name:string,
    first_lastname:string,
    second_lastname:string,
    birthday:Date,
    info:CommonBasicInfoDTO,
    state:CommonThirdDTO,
    directory:DirectoryDTO,
    employee:EmployeeDTO,
    UUID:UserThirdDTO
      ) { }

    }
