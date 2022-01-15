import { ProductThirdSimple } from './productThirdSimple'
import {Product} from '../models_product/product';
import {Code} from '../models_barCodes/code';

export class ProductThird{
    
     product:Product;
     description:ProductThirdSimple;
     code:Code;

     constructor( product:Product,
        description:ProductThirdSimple,
        code:Code){

     }

}