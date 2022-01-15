export class InventoryQuantityDTO{
    id_inventory_detail:number;
    id_product_third:number;
    quantity:number;
    code:string;
    id_storage: number;

    constructor(id_inventory_detail:number,
        id_product_third:number,
        quantity:number,
        code:string,
        id_storage:number){}
}