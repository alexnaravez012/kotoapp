export class Menu {
   id_menu:number;
   id_aplicacion:number;
   nombre:string;
   tipo:number;
   ruta:string;
   icono:string;
   avatar:string;
   background:string;
   estado:number;
   dispositivo:string;
   id_menu_padre:number;
   activo:boolean;

   constructor(
   id_menu:number,
   id_aplicacion:number,
   nombre:string,
   tipo:number,
   ruta:string,
   icono:string,
   avatar:string,
   background:string,
   estado:number,
   dispositivo:string,
   id_menu_padre:number,
   ){
      this.activo = false;
   }
}
