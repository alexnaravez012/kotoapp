export class  UsuarioDTO{

    id_aplicacion:number;
    usuario:String;
    clave:String;
    id_roles:number[];

    constructor(
      id_aplicacion:number,
      usuario:String,
      clave:String,
      id_roles:number[]
    ){}

  }
