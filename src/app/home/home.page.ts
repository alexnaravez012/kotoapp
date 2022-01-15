import {Component, OnInit, ViewChild} from '@angular/core';
import {LocalStorage} from '../shared/localStorage';
import {HttpClient} from '@angular/common/http';
import {Third} from '../shared/copiados/third';
import {BillingService, Pedidos} from '../Services/billing.service';
import {Storage} from '@ionic/storage';
import {Urlbase} from '../utils/urls';
import {CommonOperations} from '../Services/CommonOperations';
import {AccountService} from '../Services/AccountService';
import {InventoriesService} from '../Services/inventories.service';
import {
  AlertController, IonMenu,
  LoadingController,
  MenuController,
  ModalController,
  Platform, ToastController
} from '@ionic/angular';
import {Router} from '@angular/router';
import {CategoryviewerComponent} from '../common/categoryviewer/categoryviewer.component';
import {BuscarProductoComponent} from '../common/buscar-producto/buscar-producto.component';
import {CartComponent} from '../common/cart/cart.component';
import * as moment from 'moment';
import {OrderViewerComponent} from '../common/order-viewer/order-viewer.component';
import {StoreInfoComponent} from './store-info/store-info.component';
import {FCMService} from '../Services/fcm.service';
import {ToastrService} from 'ngx-toastr';
//import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  BuscadorProductosAbierto = false;

  ProvInvalido = false;

  @ViewChild("elMenu",{static:false}) elMenu:IonMenu;

  constructor(
      public accountService:AccountService,
      public inventoryService:InventoriesService,
      public modalController: ModalController,
      public loadingController: LoadingController,
      public platform: Platform,
      public alertController: AlertController,
      public commonOperations:CommonOperations,
      public toastr: ToastrService,
      public toastController:ToastController,
      public menu: MenuController,
      private router:Router,
      public locStorage: LocalStorage,
      private httpClient: HttpClient,
      public billingService : BillingService,
      public fcmService:FCMService,
      //private localNotifications: LocalNotifications
  ) {
  }

  GoToPedidos(){
    this.router.navigateByUrl("/home/orders");
  }

  BillStateToText(id:number){
    switch (id) {
      case 801: return "Recibido";
      case 807: return "Procesado Con Novedad";
      case 802: return "Procesado";
      case 803: return "En Camino";
      case 808: return "Entregado Con Novedad";
      case 804: return "Entregado";
      case 806: return "Finalizado";
      case 705: return "Calificado";
      case 902: return "Alistando el pedido"
      case 99: return "Cancelado";
      default: return id;
    }
  }

  FormatedDate(fecha:Date){
    return moment(fecha).format("YYYY-MM-DD hh:mm a");
  }


  async ClickOrder(pedido: Pedidos) {
    //from 0 es normal, from 1 es repetir, from 2 es calificar
  
    if (this.billingService.OrderOpen != null) {
      return;
    }
    const loading = await this.loadingController.create({
      message: "Actualizando...",
      duration: 2000,
    });
    await loading.present();
    this.billingService.pedidoOpened = pedido;
    const modal = await this.modalController.create({
      component: OrderViewerComponent,
      componentProps: {
        From: 0,
        Pedido: pedido,
      },
    });
    modal.onDidDismiss().then((value) => {
   
      this.billingService.OrderOpen = null;
      this.billingService.pedidoOpened = null;
    });
    await modal.present();
    return await loading.dismiss();
  }

  VariableSuscriptorFCM:any = null;

  VariableSuscriptor:any = null;
  public OrderViwer:OrderViewerComponent = null;

  PanelTienda = false;

  PanelMiPerfil = false;

  ActualizandoOrdenes = false;

  ngOnDestroy() {
    console.log("Se elimina el suscribe")
    //prevent memory leak when component destroyed
    this.VariableSuscriptor.unsubscribe();
    this.VariableSuscriptorFCM.unsubscribe();
  }

  async VerificarOrdenes(OldLisadoOrdenesActivas:Pedidos[]){
    this.ActualizandoOrdenes = true;
    if(OldLisadoOrdenesActivas.length != this.billingService.ListadoPedidosActivos.length){
      let PedidosNoEncontrados:Pedidos[] = [];
      let PedidoEnViewerEncontrado = false;

      console.log("this.OrderViwer es ")
      console.log(this.OrderViwer)

      for(let n = 0;n<OldLisadoOrdenesActivas.length;n++){
        let PedidoViejo = OldLisadoOrdenesActivas[n];
        let Encontrado = false;
        for(let m = 0;m<this.billingService.ListadoPedidosActivos.length;m++){
          let PedidoNuevo = this.billingService.ListadoPedidosActivos[m];
          if(this.OrderViwer !=null && this.OrderViwer.Pedido != null && !PedidoEnViewerEncontrado){
            if(PedidoNuevo.id_BILL == this.OrderViwer.Pedido.id_BILL){
              PedidoEnViewerEncontrado = true;
            }
          }
          if(PedidoNuevo.id_BILL == PedidoViejo.id_BILL){
            Encontrado = true;
            break;
          }
        }
        if(!Encontrado){
          PedidosNoEncontrados.push(PedidoViejo);
        }
      }
      let EjecutaActualizadoViejos = false;
      if(PedidosNoEncontrados.length > 0){
        console.log("No se encontró el pedido en activos, buscamos en finalizados")
        //Actualizo los pedidos finalizados y lo busco
        await this.billingService.GetEndedOrderList(this.accountService.usuarioCompleto.third.id_third);
        EjecutaActualizadoViejos = true;
        for(let m = 0;m<PedidosNoEncontrados.length;m++) {
          let PedidoNoEncontrado = PedidosNoEncontrados[m];
          for(let n = 0;n<this.billingService.ListadoPedidosFinalizados.length;n++) {
            let PedidoFinalizado = this.billingService.ListadoPedidosFinalizados[n];
            if (PedidoFinalizado.id_BILL == PedidoNoEncontrado.id_BILL) {
              if(this.OrderViwer != null && this.OrderViwer.Pedido != null){
                if(this.OrderViwer.Pedido.id_BILL == PedidoFinalizado.id_BILL){
                  continue;
                }
              }
              if(PedidoFinalizado.id_BILL_STATE == 804) {
                const alert = await this.alertController.create({
                  header: 'Entregado',
                  message: "Pedido '"+PedidoFinalizado.numdocumento+"' entregado exitosamente",
                  buttons: ['OK']
                });
                await alert.present();
              }else if(PedidoFinalizado.id_BILL_STATE == 808) {
                const alert = await this.alertController.create({
                  header: 'Entregado con novedad',
                  message: "Pedido '"+PedidoFinalizado.numdocumento+"' entregado con la novedad: "+PedidoFinalizado.body,
                  buttons: ['OK']
                });
                await alert.present();

              }else if(PedidoFinalizado.id_BILL_STATE == 99) {
                const alert = await this.alertController.create({
                  header: 'Pedido Cancelado',
                  message: PedidoFinalizado.body.substr(42,PedidoFinalizado.body.length),
                  buttons: ['OK']
                });
                await alert.present();
              }
            }
          }
        }
      }
      if(this.OrderViwer !=null && this.OrderViwer.Pedido != null && !PedidoEnViewerEncontrado){
        let encontrado = false;
        const loading = await this.loadingController.create({
          message: 'Actualizando...',
          duration: 2000
        });
        await loading.present();
        if(!EjecutaActualizadoViejos){
          await this.billingService.GetEndedOrderList(this.accountService.usuarioCompleto.third.id_third);
        }
        for(let n = 0;n<this.billingService.ListadoPedidosFinalizados.length;n++) {
          let PedidoFinalizado = this.billingService.ListadoPedidosFinalizados[n];
          if(PedidoFinalizado.id_BILL == this.OrderViwer.Pedido.id_BILL){
            encontrado = true;
            this.OrderViwer.Pedido = PedidoFinalizado;
            this.OrderViwer.ActualizarEstadoOrden();
            try {
              this.OrderViwer.DetallesPedido = <[]>await this.billingService.GetOrderDetails(PedidoFinalizado.id_BILL);
              console.log("this.DetallesPedido es")
              console.log(this.OrderViwer.DetallesPedido)
            }catch (e) {
              console.log("No se pudieron obtener los detalles")
              console.log(e)
            }
            await loading.dismiss();
          }
        }
        /////////////////////////////
        if(!encontrado){//no encuentra el pedido por ningun lado
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Ocurrió un error desconocido, reinicie la app por favor.',
            buttons: ['OK']
          });

          await alert.present();
        }
      }
    }else{//lista es igual
      if(this.OrderViwer != null && this.OrderViwer.Pedido != null){//
        for(let n = 0;n<this.billingService.ListadoPedidosActivos.length;n++){
          let Pedido = this.billingService.ListadoPedidosActivos[n];
          if(this.OrderViwer.Pedido.id_BILL == Pedido.id_BILL){
            this.OrderViwer.Pedido = Pedido;
            this.OrderViwer.ActualizarEstadoOrden();
            break;
          }
        }
      }
    }
    this.ActualizandoOrdenes = false;
  }

  async ShowStoreInfo(ev){
    this.PanelTienda = true;
    // const popover = await this.popoverController.create({
    //   component: StoreInfoComponent,
    //   event: ev,
    //   translucent: true
    // });
    // return await popover.present();
  }

  async GoToOrderFromNotification(data){
    let id_bill = data.id_bill;
    while(this.ActualizandoOrdenes){
      await new Promise(resolve => {
        setTimeout(() => {
          resolve();
        },100);
      })
    }
    let pedido:Pedidos = null;
    //lo buscamos en los pedidos activos
    for(let n = 0;n<this.billingService.ListadoPedidosActivos.length;n++){
      let tempPedido = this.billingService.ListadoPedidosActivos[n];
      if(tempPedido.id_BILL == id_bill){
        pedido = tempPedido;
        break;
      }
    }
    //lo buscamos en los pedisos finalizados en caso de no encontrarlo en los pedidos activos
    if(pedido == null){
      for(let n = 0;n<this.billingService.ListadoPedidosFinalizados.length;n++){
        let tempPedido = this.billingService.ListadoPedidosFinalizados[n];
        if(tempPedido.id_BILL == id_bill){
          pedido = tempPedido;
          break;
        }
      }
    }
    if(pedido == null){
      this.toastr.error("Ocurrió un error inesperado");
    }else{
      this.ClickOrder(pedido)
    }
  }

  async ngOnInit() {
    try {
      setTimeout(async ()=>{
        while(true){
          if(this.fcmService.FCMtoken != null ){//ya lo intentó obtener
  
              await this.fcmService.UpdateFCMtoken(this.fcmService.FCMtoken);
            
            break;
          }else{//aun no lo ha obtenido
            await this.fcmService.startFMC();
           
          
            break;
          }
        }
      },200);
      let alertRef = this.alertController;
      //
      console.log("Se agrega el suscribe")
      this.VariableSuscriptor = this.billingService.ActiveOrdersUpdate.subscribe((OldLisadoOrdenesActivas) => {
        console.log("Se ejecuta el update de las ordenes")
        this.VerificarOrdenes(OldLisadoOrdenesActivas);
      });
      this.VariableSuscriptorFCM = this.fcmService.currentMessage.subscribe(async (value:any) => {
        this.ActualizandoOrdenes = true;

        console.log("Se ejecuta el update de las ordenes POR NOTIFICATION")
        this.billingService.GetActiveOrderList(this.accountService.usuarioCompleto.third.id_third);
        this.billingService.GetEndedOrderList(this.accountService.usuarioCompleto.third.id_third);
        this.ActualizandoOrdenes = false;
      });
      //
      let mainRef = this;
      document.addEventListener("backbutton",async function(e) {
        if(mainRef.BuscadorProductosAbierto || mainRef.commonOperations.ModalCarrito != null || mainRef.commonOperations.ModalBuscadorProductos != null || mainRef.billingService.HomeClassRef.OrderViwer != null){return;}
        const alert = await alertRef.create({
          header: 'Confirmar',
          message: '¿Cerrar la app?',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
              }
            }, {
              text: 'Cerrar',
              handler: () => {
                navigator['app'].exitApp()
              }
            }
          ]
        });

        await alert.present();
      }, false);
      this.billingService.HomeClassRef = this;

      console.log("this.billingService.ProviderInfo es ")
      console.log(this.billingService.ProviderInfo)
      setInterval(async ()=>{
        // console.log("set interval list pedidos")
         this.updatePedidoOpen();
       },2000)
    }catch (e) {
      this.toastr.error(e.toString());
    }
  }
  updatePedidoOpen(){
    //    console.log("order opn",this.billingService.pedidoOpened)
        if(this.billingService.pedidoOpened != null){
     //     console.log("order opn exist",this.billingService.OrderOpen)
      //    console.log("pedido hijo", this.billingService.pedidoOpened)
      for (let index = 0; index <this.billingService.ListadoPedidosActivos.length; index++) {
       const element = this.billingService.ListadoPedidosActivos[index];
       if(  this.billingService.pedidoOpened.id_BILL == element.id_BILL ){
         console.log("existe en activos")
         if(this.billingService.pedidoOpened.id_BILL_STATE != element.id_BILL_STATE){
           console.log("Actualizar Pedido")
           this.billingService.pedidoOpened=element;
           return;
           
         }
        
       }
   
   
     
     }
   
     console.log("ListFinalizados", this.billingService.ListadoPedidosFinalizados)
   
     for (let index = 0; index <this.billingService.ListadoPedidosFinalizados.length; index++) {
       const element = this.billingService.ListadoPedidosFinalizados[index];
       if(  this.billingService.pedidoOpened.id_BILL == element.id_BILL ){
         console.log("existe en finalizados")
         if(this.billingService.pedidoOpened.id_BILL_STATE != element.id_BILL_STATE){
           console.log("Actualizar Pedido")
           this.billingService.pedidoOpened=element;
           return;
           
         }
        
       }
   
   
     
     }
    
    
    
        }
    
    
      }

      GoToLogin(){
        this.router.navigateByUrl("/login");
      }
  async ionViewDidEnter(){
    try {
      if(this.accountService.usuarioCompleto == null || this.accountService.usuarioCompleto.uuid == "" || this.accountService.usuarioCompleto.uuid == "-1"){
        return;
      }


      
      if(this.accountService.usuarioCompleto===null){
        this.GoToLogin();
      } else {
        
        
        
        if(this.fcmService.FCMtoken == null){
          console.log("token in service",this.fcmService.FCMtoken);

          this.fcmService.startFMC();

          console.log("Se agrega el suscribe")
          this.VariableSuscriptor = this.billingService.ActiveOrdersUpdate.subscribe((OldLisadoOrdenesActivas) => {
            console.log("Se ejecuta el update de las ordenes")
            this.VerificarOrdenes(OldLisadoOrdenesActivas);
          });
          this.VariableSuscriptorFCM = this.fcmService.currentMessage.subscribe(async (value:any) => {
            this.ActualizandoOrdenes = true;
        
    
            console.log("Se ejecuta el update de las ordenes POR NOTIFICATION")
            this.billingService.GetActiveOrderList(this.accountService.usuarioCompleto.third.id_third);
            this.billingService.GetEndedOrderList(this.accountService.usuarioCompleto.third.id_third);
          });
        }




        
     
       
     
  
  
      }
      //
      console.log("se ejecuta el ionViewDidEnter")
      //ESTO SE DEBE CAMBIAR EN UN FUTURO YA QUE NO VAN ACÁ ESTOS METODOS
      //this.getStores();
      this.getStores3();
      //
      this.commonOperations.mostrandoCargando = true;
      console.log("ionViewDidEnter de home2 ");
      let idProv = await this.accountService.CheckClosestProv();
      console.log("idProv ",idProv);
      if(idProv == "-1"){
        this.ProvInvalido = true;
        this.commonOperations.mostrandoCargando = false;
      }else{
        this.ProvInvalido = false;
        console.log("idProv es ");
        console.log(idProv);
        this.billingService.SetProv(idProv);
        await this.inventoryService.getInventoryList(this.billingService.ProviderInfo.StoreID);
        console.log("ListadoKeysLineas es ");
        this.ListadoKeysLineas = Object.keys(this.inventoryService.LineaList);
        console.log(this.ListadoKeysLineas);
        this.commonOperations.mostrandoCargando = false;
        setTimeout(()=>{
          //mensaje de bienvenida
          if(localStorage.getItem("WelcomeMSG") == null || localStorage.getItem("WelcomeMSG") == ""){
            localStorage.setItem("WelcomeMSG","true");
            this.PanelTienda = true;
          }
        },1000);
        //Obtengo los pedidos
        await this.billingService.GetEndedOrderList(this.accountService.usuarioCompleto.third.id_third);
        await this.billingService.GetActiveOrderList(this.accountService.usuarioCompleto.third.id_third);
      }
    }catch (e) {
      this.toastr.error(e.toString());
      console.log("idProv es ERROR  ")
      console.log(e)
      const alert = await this.alertController.create({
        header: 'Problemas',
        subHeader: 'No se pudo conectar al servidor',
        message: 'Por favor cierre la app e intente de nuevo.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  roundnum(num) {
    //return Math.round(num / 50) * 50;
    return Math.round(num);
  }

  async getStores3() {
    //Obtengo listado
    let store = 10;
    ////////
    this.getStoreType(store);
    this.locStorage.setBoxStatus(false);
    this.locStorage.setIdStore(store)
  }

  getStoreType(id_store){
    //@ts-ignore
    this.httpClient.get(Urlbase.tienda+"/store/tipoStore?id_store="+id_store).subscribe( response => {
      this.locStorage.setTipo(response);
      console.log("ID CAJA: ",this.locStorage.getIdCaja())
      console.log("ID STORE: ",this.locStorage.getIdStore())
      console.log("STORE TYPE: ",this.locStorage.getTipo())
      console.log("BOX TYPE: ",this.locStorage.getBoxStatus())
    })
  }

  ////
  Loading:any = null;
  ModalBuscarProducto:any = null

  LimitadorLineas = true;

  ListadoKeysLineas = [];

  OpenMenu() {
    console.log("click abrir menu")
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  CloseMenu() {
    console.log("click cerrar menu")
    this.menu.enable(false, 'first');
    this.menu.close('first');
  }

  async LogOut(){
    //Muestro loading
    this.Loading = await this.loadingController.create({
      message: 'Un Momento'
    });
    await this.Loading.present();
    try {
      let resultado = await this.accountService.ClearUserData();
      this.commonOperations.ModalesLineas = [];
      this.commonOperations.ModalBuscadorProductos = null;
      this.commonOperations.ModalCarrito = null;
      this.inventoryService.FullInventoryList = [];
      this.inventoryService.cartService.ListaTablaProductosSeleccionados = [];
      this.inventoryService.cartService.DiccionarioIdsProductosSeleccionados = {};
      this.inventoryService.cartService.ValorImpuestoTabla = 0;
      this.inventoryService.cartService.ValorSubTotalTabla = 0;
      this.inventoryService.cartService.ValorTotalTabla = 0;
      this.inventoryService.cartService.ListaProductosFiltradosBuscador = [];

      

      this.fcmService.cleanFMC();
    }catch (e) {

    }
    // if(resultado[0] || resultado[1].includes("Not authenticated")){
    //   this.CloseMenu();
    //   this.router.navigate(['/']);
    // }else{
    //   this.toastr.error('Revisa tu conexión');
    // }
    this.CloseMenu();
    this.router.navigate(['/']);
    await this.Loading.dismiss();
  }

  CalcularTamMaximoContenedorLineas(){
    return "calc( "+Math.ceil((this.ListadoKeysLineas.length + 1)/3)*15 +"vh + "+ Math.ceil((this.ListadoKeysLineas.length + 1)/3)*12+"px )";
  }

  CalcularSizeFont(text:string){
    let constante = (this.platform.width()/100)*2.2;
    let sizeBase = 13;
    let anchoTexto = text.length*constante
    let anchoParent = this.platform.width()/2.45;
    if(anchoTexto > anchoParent){
      //sizeBase = sizeBase / ((anchoTexto-anchoParent)/anchoParent);
      sizeBase = sizeBase * (anchoParent/anchoTexto);
    }
    return sizeBase +'px'
  }

  // GetFontSizeByString(text:string){
  //   text = text.trim()
  //   let calculo = (((this.platform.width()*0.33)-12)/text.length);
  //   if(calculo > (this.platform.width()*0.034)){
  //     calculo = this.platform.width()*0.034;
  //   }
  //   if(calculo < (this.platform.width()*0.02)){
  //     calculo = calculo*1.8;
  //   }
  //   return calculo +'px';
  // }

  ClickAlternarLineas(){
    this.LimitadorLineas = !this.LimitadorLineas;
  }

  filterList(evento) {
    if (evento.key != "Enter") {
      return;
    }
    //evento.target.value
  }

  async ClickLinea(idLinea){
    const modal = await this.modalController.create({
      component: CategoryviewerComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        idLinea: idLinea
      },
    });
    this.commonOperations.ModalesLineas.push(modal);
    await modal.present();
  }

  async AbrirBuscadorProductos() {
    //Muestro loading
    this.Loading = await this.loadingController.create({
      message: 'Cargando'
    });
    await this.Loading.present();
    if(this.commonOperations.ModalBuscadorProductos != null){await this.commonOperations.ModalBuscadorProductos.dismiss();}
    this.ModalBuscarProducto = await this.modalController.create({
      component: BuscarProductoComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        MainClass: this,
        CurrentLine: "",
        CurrentCat: ""
      },
    });
    this.commonOperations.ModalBuscadorProductos = this.ModalBuscarProducto;
    this.ModalBuscarProducto.onDidDismiss().then((data) => {
      this.BuscadorProductosAbierto = false;
      this.commonOperations.ModalBuscadorProductos = null;
    });
    await this.ModalBuscarProducto.present();
    this.Loading.dismiss();
    this.BuscadorProductosAbierto = true;
  }
}
