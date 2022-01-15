import { Menu } from './menu'
import { Rol } from './rol'
export class Token {
    id_usuario:number;
    id_aplicacion:number;
    id_third:number;
    id_third_father:number;

    TOKE:string;
    usuario:string;
    menus:Menu[];
    roles:Rol[];

  constructor(
        id_usuario:number,
        id_aplicacion:number,
        id_third:number,
        id_third_father:number,
        TOKE:string,
        usuario:string,
        menus:Menu[],
        roles:Rol[],
  ) {}

}
