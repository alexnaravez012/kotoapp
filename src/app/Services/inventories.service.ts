import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorage} from '../shared/localStorage';
import {Urlbase} from '../utils/urls';
import {CommonStateDTO} from '../shared/copiados/commonStateDTO';
import {CartService} from './cart.service';

/** Files for auth process  */
import { File } from '@ionic-native/file/ngx';
import {CartComponent} from '../common/cart/cart.component';

@Injectable({
  providedIn:'root'
})
export class InventoriesService {

  private options:{};
  FullInventoryList: Array<InventoryName>;
  storageList;
  commonStateDTO: CommonStateDTO;

  public BuscadoresAbiertos = 0;
  public CarrosAbiertos = 0;
  public CarritoEnFinal = false;
  public RefCarrito:CartComponent = null;

  LineaList: {[key: number]:{nombre:string,img:string,id:number,categorias:{
        [key: number]:{nombre:string,img:string,productos:Array<InventoryName>}
  }}} = {};
  CatList: {[key: number]:{nombre:string,img:string,productos:Array<InventoryName>}} = {};
  ProvidersList:{[key:number]:string} = {};
  taxesList: any;

  headers = new Headers();

  constructor(
      private httpClient: HttpClient,
      private locStorage: LocalStorage,
      public cartService:CartService,
      private file: File
  ) {
    this.options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization':  this.locStorage.getTokenValue(),
      }),
      withCredentials: true
    };

    this.commonStateDTO = new CommonStateDTO(1, null, null);
  }

  public GetFilePathForCategoryIMG(cat:string,img:string){
    if(img != null && img != ""){
      return img;
    }else{
      let retorno = "";
      //quito espacios
      let nombreAjustado = cat.split(" ").join("").toLowerCase();
      //quito tildes de a
      nombreAjustado = nombreAjustado.split("á").join("a");
      //quito tildes de e
      nombreAjustado = nombreAjustado.split("é").join("e");
      //quito tildes de i
      nombreAjustado = nombreAjustado.split("í").join("i");
      //quito tildes de o
      nombreAjustado = nombreAjustado.split("ó").join("o");
      //quito tildes de u
      nombreAjustado = nombreAjustado.split("ú").join("u");

      retorno = "/assets/categorias/"+nombreAjustado+".jpg";
      return retorno;
    }
  }

  async getInventoryList(SelectedTiendaProveedor) {
    console.log("getInventoryList: 1");
    this.cartService.inventoriesService = this;
    //Esto es debido a un delay en localstorage, entonces espero hasta que se inicialice para continuar
    while(1==1){
      await new Promise(resolve => setTimeout(resolve, 100));
      if(this.locStorage.getIdStore() != 1){break;}
    }
    console.log("getInventoryList: 2");
    let Promesa = <Array<InventoryName>>await new Promise(resolve => {
      console.log("this.id_store es");
      console.log(this.locStorage.getIdStore());
      console.log("this.SelectedTiendaProveedor es");
      console.log(SelectedTiendaProveedor);
      this.httpClient.get<Array<InventoryName>>(Urlbase.facturacion+"/pedidos/inventoryPedido?id_store=" + this.locStorage.getIdStore()+"&id_store_prov="+SelectedTiendaProveedor).subscribe((res) => {
        resolve(res);
      },error => {console.log("[ERROR] "+error);resolve(error)});
    });
    //
    this.LineaList = {}
    this.CatList = {}
    this.FullInventoryList = [];
    this.ProvidersList = {};
    //
    console.log("This is InventoryList: ");
    console.log(Promesa);
    //Buscar en caso de productos repetidos, dejar el mas caro
    let tmpDict = {};
    for(let n = 0;n<Promesa.length;n++){
      let item = Promesa[n];
      if(tmpDict[item.product_STORE_CODE] != null){
        if(item.price > tmpDict[item.product_STORE_CODE].price){
          tmpDict[item.product_STORE_CODE] = item;
        }
      }else{
        tmpDict[item.product_STORE_CODE] = item;
      }
    }
    let tmpList:InventoryName[] = [];
    for(let n = 0;n<Promesa.length;n++){
      if(tmpDict[Promesa[n].product_STORE_CODE] == null){continue;}
      tmpList.push(tmpDict[Promesa[n].product_STORE_CODE]);
      tmpDict[Promesa[n].product_STORE_CODE] = null;
    }
    /////////////////////////////////////////////////////////////
    this.FullInventoryList = tmpList;
    //SACO LOS PROVIDERS
    for(let n = 0;n<this.FullInventoryList.length;n++){
      let IdProvider = this.FullInventoryList[n].id_PROVIDER;
      let NombreProvider = this.FullInventoryList[n].provider;
      let IdLinea = this.FullInventoryList[n].id_LINEA;
      let NombreLinea = this.FullInventoryList[n].linea;
      let IdCat = this.FullInventoryList[n].id_CAT;
      let NombreCat = this.FullInventoryList[n].categoria;
      let ImgCat = this.FullInventoryList[n].imgcat;
      let ImgLinea = this.FullInventoryList[n].imglinea;
      //
      if(this.LineaList[IdLinea] == null){
        this.LineaList[IdLinea] = {id:IdLinea,img:ImgLinea,nombre:NombreLinea,categorias:{}};
      }
      if(this.LineaList[IdLinea].categorias[IdCat] == null){
        this.LineaList[IdLinea].categorias[IdCat] = {nombre:NombreCat,img:ImgCat,productos:[]}
      }
      if(this.CatList[IdCat] == null){
        this.CatList[IdCat] = {nombre:NombreCat,img:ImgLinea,productos:[]}
      }
      this.CatList[IdCat].productos.push(this.FullInventoryList[n]);
      this.LineaList[IdLinea].categorias[IdCat].productos.push(this.FullInventoryList[n]);
      //Para tener el listado de providers
      this.ProvidersList[IdProvider] = NombreProvider;
      //let CantidadVendida = this.inventoryList[n].cantidadvendida;//a la espera de un uso
    }
    //
    await this.getStorages();
    await this.getTaxes();
    //
  }
  async getStorages() {
    this.storageList = await new Promise(resolve => {
      console.log("this.id_store es");
      console.log(this.locStorage.getIdStore());
      this.httpClient.get(Urlbase.tienda + "/store/s?id_store=" + this.locStorage.getIdStore()).subscribe((res) => {
        resolve(res);
      }, error => {
        console.log("[ERROR] " + error);
        resolve(error)
      });
    });
    console.log("this.storageList es");
    console.log(this.storageList)
  }
  async getTaxes() {
    this.taxesList = await new Promise(resolve => {
      this.httpClient.get(Urlbase.tienda + '/tax-tariff').subscribe((res) => {
        resolve(res);
      }, error => {
        console.log("[ERROR] " + error)
      });
    });
  }

  async getPriceList3(product:InventoryName, code, id, quantity) {
    console.log("id is: ", id);
    let Promesa = await new Promise(resolve => {
      this.httpClient.get(Urlbase.tienda+"/store/pricelist?id_product_store=" + id).subscribe(value => {resolve(value);},error => {console.log("[ERROR] "+error)});
    });
    console.log("This is picked price list: ", Promesa);
    console.log("this is datos: ", Promesa);
    console.log("this.storageList en getPriceList3 es");
    console.log(this.storageList);
    let new_product = {
      quantity: quantity,
      id_storage: this.storageList[0].id_storage,
      price: product.price,
      tax: this.getPercentTax(product.id_TAX),
      id_product_third: product.id_PRODUCT_STORE,
      tax_product: product.id_TAX,
      state: this.commonStateDTO,
      description: product.product_STORE_NAME,
      code: "SinDefinir",
      id_inventory_detail: -1,
      ownbarcode: product.ownbarcode,
      product_store_code: String(product.product_STORE_CODE),
      pricelist: Promesa
    };
    console.log("new_product es: ", new_product);
    this.cartService.DiccionarioIdsProductosSeleccionados[new_product.ownbarcode] = true;
    this.cartService.ListaTablaProductosSeleccionados.unshift(new_product);
  }

  getPercentTax(idTaxProd) {
    let thisTax;
    let taxToUse;

    for (thisTax in this.taxesList) {
      // noinspection JSUnfilteredForInLoop
      if (idTaxProd == this.taxesList[thisTax].id_tax_tariff) {
        taxToUse = this.taxesList[thisTax].percent / 100;
      }
    }
    return taxToUse;
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
  id_CAT: number;
  img:string;
  categoria: string;
  cantidadvendida: number;
  imgcat:string;
  imglinea:string;

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
