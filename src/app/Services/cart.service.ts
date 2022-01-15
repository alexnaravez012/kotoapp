import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorage} from '../shared/localStorage';
import {CommonStateDTO} from '../shared/copiados/commonStateDTO';
import {InventoriesService} from './inventories.service';

/** Files for auth process  */

@Injectable({
  providedIn:'root'
})
export class CartService {

  private options;
  //
  ListaTablaProductosSeleccionados:Array<ProductoTablaDTO>;
  public DiccionarioIdsProductosSeleccionados = {};
  ValorTotalTabla = 0;
  ValorSubTotalTabla = 0;
  ValorImpuestoTabla = 0;
  public ListaProductosFiltradosBuscador:Array<InventoryName>;
  public inventoriesService: InventoriesService
  //

  constructor(
      private httpClient: HttpClient,
      private locStorage: LocalStorage
  ) {
    this.options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization':  this.locStorage.getTokenValue(),
      })
    };
    this.ListaTablaProductosSeleccionados = [];
    this.ListaProductosFiltradosBuscador = [];
  }

  async AgregarProductoDesdeBuscadorProductos(Producto:InventoryName){
    console.log("Producto es");
    console.log(Producto);
    if(this.DiccionarioIdsProductosSeleccionados[Producto.ownbarcode] != null){//EXISTE, osea que es para quitar
      await this.EliminarProductoPorParametro(Producto);
    }else{//NO EXISTE
      //LO AGREGO
      //EN CASO DE NO EXISTIR, SE HACE TODO EL PROCESO PARA AGREGARLO
      //if(this.inventoriesService.FullInventoryList.length == 0){await this.inventoriesService.getInventoryList();}
      const product = this.inventoriesService.FullInventoryList.find(item => this.findCode(Producto.ownbarcode, item));
      if (product) {
        await this.inventoriesService.getPriceList3(product, Producto.ownbarcode, product.id_PRODUCT_STORE, 1)
      } else {
        alert('Ese codigo no esta asociado a un producto.');
      }
      this.ActualizarTabla();
    }
  }
  findCode(code, item) {
    if (item.ownbarcode == code) {
      return item;
    } else {
      if (String(item.product_STORE_CODE) == code) {
        return item;
      }
    }
  }
  EliminarProductoPorParametro(Producto){
    let ListTemporal = [];
    this.DiccionarioIdsProductosSeleccionados[Producto.ownbarcode] = null;
    for(let n = 0;n < this.ListaTablaProductosSeleccionados.length; n++){
      let Item = this.ListaTablaProductosSeleccionados[n];
      if(Producto.ownbarcode != Item.ownbarcode){
        ListTemporal.push(Item);
      }
    }
    this.ListaTablaProductosSeleccionados = ListTemporal;
    this.ActualizarTabla();
  }
  async ActualizarFiltroProviders(ListadoProvidersSeleccionados:Array<any>){
    this.ListaProductosFiltradosBuscador = [];
    if(ListadoProvidersSeleccionados.length == 0){
      this.ListaProductosFiltradosBuscador = this.deepArrayCopy(this.inventoriesService.FullInventoryList);
    }else{
      this.inventoriesService.FullInventoryList.forEach(element => {
        ListadoProvidersSeleccionados.forEach(provider => {
          if (element.id_PROVIDER == provider.id) {
            this.ListaProductosFiltradosBuscador.push(element);
          }
        });
      });
    }
  }
  ActualizarTabla(){
    this.ValorTotalTabla = 0;
    this.ValorSubTotalTabla = 0;
    this.ValorImpuestoTabla = 0;
    for(let n = 0;n<this.ListaTablaProductosSeleccionados.length;n++){
      let Producto = this.ListaTablaProductosSeleccionados[n];
      this.ValorSubTotalTabla += Math.floor(Producto.quantity)*Producto.price;
      this.ValorImpuestoTabla += (Math.floor(Producto.quantity)*Producto.price)*Producto.tax;
    }
    this.ValorTotalTabla = this.ValorSubTotalTabla + this.ValorImpuestoTabla;
    this.ListaTablaProductosSeleccionados = this.deepArrayCopy(this.ListaTablaProductosSeleccionados);
  }
  public async EventoInputBuscadorProductos(DatoProducto,Linea,Categoria) {
    console.log("DatoProducto es '"+DatoProducto+"' Linea '"+Linea+"' Categoria es '"+Categoria+"'");
    console.log(Linea);
    this.ListaProductosFiltradosBuscador = [];
    if(DatoProducto == "" && Linea == "" && Categoria == ""){
      this.ListaProductosFiltradosBuscador = this.deepArrayCopy(this.inventoriesService.FullInventoryList);
      return;
    }
    let BusquedaSeparada = DatoProducto.split(" ");
    this.inventoriesService.FullInventoryList.forEach(element => {
      let completo = true;
      for(let n = 0;n<BusquedaSeparada.length;n++){
        let palabra:string = BusquedaSeparada[n];
        if (
            ((element.product_STORE_NAME.toLowerCase().includes(palabra.toLowerCase()) || element.ownbarcode == palabra || element.product_STORE_CODE == palabra))
            &&
            (element.linea.toLocaleLowerCase().includes(Linea.toLowerCase()) && element.categoria.toLocaleLowerCase().includes(Categoria.toLowerCase()))
        ) {
        }else{
          completo = false;
          break;
        }
      }
      if(completo){
        this.ListaProductosFiltradosBuscador.push(element);
      }
    });
  }
  LimpiarCarrito(){
    this.ListaTablaProductosSeleccionados = [];
    this.DiccionarioIdsProductosSeleccionados = {};
    this.ActualizarTabla();
  }
  private deepArrayCopy(arr: any[]): any[] {
    const result: any[] = [];
    if (!arr) {
      return result;
    }
    const arrayLength = arr.length;
    for (let i = 0; i <= arrayLength; i++) {
      const item = arr[i];
      if (item) {
        result.push(item);
      }
    }
    return result;
  }
}

export class ProductoTablaDTO{
  quantity: number;
  id_storage: number;
  price: number;
  tax: number;
  id_product_third: number;
  tax_product: number;
  state: CommonStateDTO;
  description: string;
  code: string;
  id_inventory_detail: number;
  ownbarcode: string;
  product_store_code: string;
  pricelist: any;
}


export class InventoryName {
  id_TAX: number;//
  tax: number;//
  price: number;//
  id_PRODUCT_STORE: number;//
  product_STORE_NAME: string;//
  ownbarcode: string;//
  product_STORE_CODE: string;//
  id_PROVIDER: number;//
  provider: string;//
  id_LINEA: number;
  linea: string;
  img:string;
  id_CAT: number;
  categoria: string;
  cantidadvendida: number;

  constructor(ID_TAX: number,
              PRICE: number,
              ID_PRODUCT_STORE: number,
              PRODUCT_STORE_NAME: string,
              OWNBARCODE: string,
              PRODUCT_STORE_CODE: string,
              TAX: number,
              provider: string,
              id_PROVIDER: number,
              id_LINEA: number,
              linea: string,
              id_CAT: number,
              categoria: string,
              cantidadvendida: number
  ) {
    this.id_TAX = ID_TAX;
    this.tax = TAX;
    this.id_PROVIDER = id_PROVIDER;
    this.provider = provider;
    this.price = PRICE;
    this.id_PRODUCT_STORE = ID_PRODUCT_STORE;
    this.product_STORE_NAME = PRODUCT_STORE_NAME;
    this.ownbarcode = OWNBARCODE;
    this.product_STORE_CODE = PRODUCT_STORE_CODE;
    this.id_LINEA = id_LINEA;
    this.linea = linea;
    this.id_CAT = id_CAT;
    this.categoria = categoria;
    this.cantidadvendida = cantidadvendida;
  }
}
