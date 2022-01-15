import { Injectable, EventEmitter } from '@angular/core';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';

/** Import Model Data */


/** Import Model Data Transfer Object */
import {Subject, Subscription} from 'rxjs';
import {LocalStorage} from '../shared/localStorage';
import {BillDTO} from '../shared/models/models_billing/billDTO';
import {Urlbase} from '../utils/urls';
import {AccountService} from './AccountService';
import {HomePage} from '../home/home.page';
import {Platform} from '@ionic/angular';


@Injectable({
  providedIn:'root'
})
export class BillingService {
  api_uri_inv = Urlbase.tienda+ "/categories2";
  api_uri_store = Urlbase.tienda + "/store";
  private options;
  private headers = new HttpHeaders();

  public HomeClassRef:HomePage = null;
  public OrderOpen = null;
  public pedidoOpened:Pedidos=null;
  invokeFirstComponentFunction = new EventEmitter();
  subsVar: Subscription;

  ActiveOrdersUpdate: Subject<Pedidos[]> = new Subject<Pedidos[]>();

  ListadoPedidosFinalizados: Pedidos[] = [];
  ListadoPedidosActivos: Pedidos[] = [];

  ProviderInfo:{
    StoreID:number,
    Address:string,
    Name:string,
    Lat:number,
    Lng:number,
    DocType:string,
    DocNumber:string,
    CityName:string,
    CityID:number,
    Email:string,
    Phone:string
  } = {
    DocNumber:"",
    DocType:"",
    StoreID:-1,
    Name:"",
    Address:"",
    Lng:-1,
    Lat:-1,
    CityName:"",
    CityID:-1,
    Email:"",
    Phone:""
  };

  onClick() {
    this.invokeFirstComponentFunction.emit();
  }

  constructor(private http: HttpClient, private locStorage: LocalStorage, private accountService:AccountService,private platform:Platform) {
    let token = localStorage.getItem('currentUser');
    this.options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization':  this.locStorage.getTokenValue(),
      })
    };
    if(!this.platform.is('cordova') || true) {//Es PC
      setInterval(function(MainClass:BillingService){
        if(localStorage.getItem("FullUser") != null && MainClass.accountService.usuarioCompleto != null && MainClass.accountService.usuarioCompleto.uuid != "" && MainClass.accountService.usuarioCompleto.uuid != "-1"){
          MainClass.GetActiveOrderList(MainClass.accountService.usuarioCompleto.third.id_third);
          MainClass.GetEndedOrderList(MainClass.accountService.usuarioCompleto.third.id_third);
        }
      }, 10000,this);
    }
    if(localStorage.getItem("TiendaProv") != null && localStorage.getItem("TiendaProv") != ""){
      this.SetProv(localStorage.getItem("TiendaProv"),false);
    }
  }

  //AJUSTAR TIENDA PROV
  SetProv(idProv:string,resetDate = true){
    let Dividido = idProv.split("|");
    this.ProviderInfo = {
      StoreID:parseInt(Dividido[0]),
      DocType:Dividido[1],
      DocNumber:Dividido[2],
      Name:Dividido[3],
      Address:Dividido[4],
      Lat:parseFloat(Dividido[5]),
      Lng:parseFloat(Dividido[6]),
      CityName:Dividido[7],
      CityID:parseFloat(Dividido[8]),
      Email:Dividido[9],
      Phone:Dividido[10]

    }
    ///////////
    localStorage.setItem("TiendaProv",idProv+"");
    if(resetDate){localStorage.setItem("LastCheckClosestProv",Date.now()+"");}
  }

  ///////////////////////////////////////////////////////
  ////////////// ACTUALIZAR PEDIDOS APP /////////////////
  ///////////////////////////////////////////////////////
  public async CANCELAR_PEDIDO_APP(idbillpedidoprov,notes,ESTADOORIGENPROV,IDTHIRDUSER){//Esto es solo cuando está en camino
    return new Promise((resolve,reject) => {
      this.http.post(Urlbase.facturacion+"/pedidos/cancelarPedidoApp?" +
          "idbillpedidoprov="+idbillpedidoprov +
          "&notes="+notes +
          "&ESTADOORIGENPROV="+ESTADOORIGENPROV +
          "&IDTHIRDUSER="+IDTHIRDUSER +
          "&ACTOR=C",{

        }, this.options).subscribe((data:any) => {
        resolve(data);
      },error => {
        console.log("[CANCELAR_PEDIDO_APP] ");
        console.log(error)
        reject(error);
      });
    })
  }

  public async ACTUALIZAR_ESTADO_PEDIDOAPP(ID_Bill,Id_Third,notas,EstadoOrigen,idbillstateclient,idbillstateprov){//Todos los estados excepto en camino
    return new Promise((resolve,reject) => {
      this.http.post(Urlbase.facturacion+"/pedidos/actualizarEstadoPedidoApp?" +
          "idbillpedidoprov="+ID_Bill +
          "&idbillstateclient="+idbillstateclient +
          "&idbillstateprov="+idbillstateprov +
          "&notas="+notas +
          "&ESTADOORIGENPROV="+EstadoOrigen +
          "&IDTHIRDUSER="+Id_Third +
          "&ACTOR=C"
          , this.options).subscribe((data:any) => {
        resolve(data);
      },error => {
        console.log("[ACTUALIZAR_ESTADO_PEDIDOAPP] ");
        console.log(error)
        reject(error);
      });
    })
  }

  ////////////////////////////////////////////////////////
  ////////////// OBTENER ORDENES TERCERO /////////////////
  ////////////////////////////////////////////////////////
  public GetActiveOrderList(id_third:number){
    return new Promise((resolve,reject) => {
      this.http.get(Urlbase.facturacion+"/pedidos/getPedidos/third?idapp=26&idthirdclient="+id_third+"&id_bill_type=86&id_bill_state=801|902|807|802|803"
          , this.options).subscribe((data:any) => {
        let OldListadoPedidosActivos = this.ListadoPedidosActivos;
        this.ListadoPedidosActivos = data;
        this.ActiveOrdersUpdate.next(OldListadoPedidosActivos);
        resolve(data);
      },error => {
        console.log("[GetOrdersList] ");
        console.log(error)
        reject(error);
      });
    })
  }

  public GetEndedOrderList(id_third:number){
    this.ListadoPedidosFinalizados = [];
    return new Promise((resolve,reject) => {
      this.http.get(Urlbase.facturacion+"/pedidos/getPedidos/third?idapp=26&idthirdclient="+id_third+"&id_bill_type=86&id_bill_state=808|804|806|705|99"
          , this.options).subscribe((data:any) => {
        this.ListadoPedidosFinalizados = data;
        resolve(data);
      },error => {
        console.log("[GetOrdersList] ");
        console.log(error)
        reject(error);
      });
    })
  }

  public GetOrderDetails(id_bill:number){
    return new Promise((resolve,reject) => {
      this.http.get(Urlbase.facturacion+"/billing/detail?id_bill="+id_bill
          , this.options).subscribe((data:any) => {
        resolve(data);
      },error => {
        console.log("[GetOrderDetails] ");
        console.log(error)
        reject(error);
      });
    })
  }
  ////////////////////////////////////////////////////////
  public postBillResource(body:BillDTO, disc){
    console.log("this is my body: ",body);
    return new Promise(resolve => {
      let params = new HttpParams();
      if(disc == 1){
        if(String(this.locStorage.getIdCaja()) != null){
          params = params.append('id_caja',  String(this.locStorage.getIdCaja()));
        }
      }
      this.options.params = params;
      this.http.post(Urlbase[3]+"/billing", body, this.options).subscribe(data => {
        console.log("data es: ");
        console.log(data)
        resolve(data ? data:null);
      },error => {
        console.log("[ERROR EN LOGIN] ");
        console.log(error)
        resolve(error);
      });
    })
  }

  //----------------------------------------------------------------------------------------------
  //METODOS PARA MUN, BRAND, CATEGORIES AND PRODUCTS
  //----------------------------------------------------------------------------------------------

  public async getGeneralCategories(){
    const lista = this.locStorage.getTipo();

    const body = {
      'listaTipos': lista
    };
    //console.log("asd",body)
    return new Promise((resolve, reject) => {
      this.http.post(this.api_uri_inv+"/get",body).subscribe(value => {
        resolve(value);
      },error => {
        reject(error);
      })
    })
  }

  getStoresByThird(id_third){
    return new Promise(resolve => {
      this.http.get<any>(this.api_uri_store+"?id_third="+String(id_third), this.options ).subscribe(data => {
        console.log("getStoresByThird data es ");
        console.log(data)
        resolve(data);
      },error => {
        console.log("[ERROR EN getStoresByThird] ");
        console.log(error)
        resolve(error);
      });
    });
  }
}

export interface Pedidos{
  idthirdcliente: number;
  id_STORE_CLIENT: number;
  phone: number;
  address: string;
  mail: string;
  longitud: number;
  id_BILL: number;
  latitud: number;
  longitudp: number;
  numdocumento: string;
  addressp: string;
  fecha: Date;
  mailp: string;
  tienda: string;
  id_PAYMENT: number;
  phonep: number;
  cliente: string;
  latitudp: number;
  body: string;
  id_STORE: number;
  numpedido: string;
  totalprice: number;
  id_BILL_STATE:number;
}
