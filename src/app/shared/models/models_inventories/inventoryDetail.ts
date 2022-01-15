import { InventoryDetailSimple } from './inventoryDetailSimple'
import {Product} from '../models_product/product';
import {ProductThirdSimple} from '../models_product_third/productThirdSimple';

export class InventoryDetail{

    detail:InventoryDetailSimple;
    product:Product;
    description:ProductThirdSimple;

    constructor(detail:InventoryDetailSimple,
        product:Product,
        description:ProductThirdSimple){

    }


}