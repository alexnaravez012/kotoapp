export class InventoryDetailSimple{

     id_inventory_detail:number;
     id_inventory:number;
     id_product_third:number;
     quantity:number;
     code?:string;
     id_state_inv_detail:number;
     state_inv_detail:number;
     creation_inv_detail:Date;
     modify_inv_detail:Date;

     constructor(id_inventory_detail:number,
        id_inventory:number,
        id_product_third:number,
        quantity:number,
        code:string,
        id_state_inv_detail:number,
        state_inv_detail:number,
        creation_inv_detail:Date,
        modify_inv_detail:Date){

     }
}