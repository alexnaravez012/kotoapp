import {Component, OnInit, ViewChild} from '@angular/core';
import {CartService} from '../../Services/cart.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import {InventoriesService, ProductoTablaDTO} from '../../Services/inventories.service';
import {LoadingController, ModalController, Platform, PopoverController} from '@ionic/angular';
import {HereMapComponent} from '../here-map/here-map.component';
import {AccountService} from '../../Services/AccountService';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Urlbase} from '../../utils/urls';
import {BillingService} from '../../Services/billing.service';
import {Router} from '@angular/router';
import {FCMService} from '../../Services/fcm.service';
import {CommonOperations} from '../../Services/CommonOperations';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  reorderable = true;

  ColumnMode = ColumnMode;

  Loading:any = null;

  //VARIABLES PARA COMPLETAR ORDEN
  EstadoCompletarCompra = -1;
  MetodosPago = [
    ["0","Efectivo",1],
    ["1","Tarjeta de Crédito (Datáfono)",2],
    ["2","Tarjeta de Débito (Datáfono)",3],
    ["3","Transferencia",4]
  ]
  MetodoPagoSeleccionado = "0";

  @ViewChild('ElMap', {static: false}) private ElMap: HereMapComponent;
  CargandoMapa = true;
  ///////////

  constructor(
      //public CartService:CartService,
      public inventoriesService:InventoriesService,
      public popoverController: PopoverController,
      public modalController: ModalController,
      public accountService:AccountService,
      public loadingController: LoadingController,
      public http:HttpClient,
      public toastr: ToastrService,
      public platform: Platform,
      public billing:BillingService,
      private router:Router,
      public commonOperations:CommonOperations,
      private fcmService:FCMService
  ) { }

  ngOnInit() {
    if(this.inventoriesService.RefCarrito == null){
      console.log("[ngOnInit] 1 this.inventoryService.CarrosAbiertos es ",this.inventoriesService.CarrosAbiertos)
      this.inventoriesService.CarrosAbiertos++;
      console.log("[ngOnInit] 2 this.inventoryService.CarrosAbiertos es ",this.inventoriesService.CarrosAbiertos)
      this.EstadoCompletarCompra = -1;
      this.inventoriesService.CarritoEnFinal = false;
      this.inventoriesService.RefCarrito = this;
    }else{
      this.CerrarModal();
    }
  }
  ngOnDestroy() {
    this.inventoriesService.CarrosAbiertos--;
    this.inventoriesService.RefCarrito = null;
  }

  //////////////////////////////////////////////
  ////////// TODO CARRITO COMPRAS //////////////
  //////////////////////////////////////////////
  CerrarModal(retorno?){
    this.inventoriesService.CarritoEnFinal = false;
    this.modalController.dismiss(retorno);
  }

  async EliminarProducto(Producto:ProductoTablaDTO){
    await this.inventoriesService.cartService.EliminarProductoPorParametro(Producto);
  }

  Distancia = -1;
  async ClickSiguiente(){
    this.EstadoCompletarCompra = 1;
    this.inventoriesService.CarritoEnFinal = true;
    setTimeout(async ()=>{
      this.CargandoMapa = true;
      // this.ElMap.Reload();
      // this.ElMap.SetCenter(
      //     {
      //       lat:this.accountService.usuarioCompleto.latitud,
      //       lng:this.accountService.usuarioCompleto.longitud
      //     });
      await this.ElMap.ReturnWhenReady();
      this.ElMap.ClearMarkers();
      this.ElMap.SetMarker({lat:this.accountService.usuarioCompleto.latitud,lng:this.accountService.usuarioCompleto.longitud},0)
      this.ElMap.SetMarker({lat:this.billing.ProviderInfo.Lat,lng:this.billing.ProviderInfo.Lng},0)
      this.ElMap.CentrarMapaEnMarcadores();
      //Mostrar Ruta
      this.Distancia = await this.ElMap.SetRoute(this.accountService.usuarioCompleto.latitud,this.accountService.usuarioCompleto.longitud,this.billing.ProviderInfo.Lat,this.billing.ProviderInfo.Lng);
      this.CargandoMapa = false;
    }, 300);
  }

  focusCarrito(evento){
    console.log(evento)
  }

  roundnum(num) {
    //return Math.round(num / 50) * 50;
    return Math.round(num);
  }


  BlurInputCarrito(evento){
    setTimeout(()=>{
      let encontro = false;
      for(let n = 0;n<this.inventoriesService.cartService.ListaTablaProductosSeleccionados.length;n++){
        let producto = this.inventoriesService.cartService.ListaTablaProductosSeleccionados[n];
        let quantityINT = parseInt(producto.quantity+"");
        if(isNaN(quantityINT)){quantityINT = 1;}
        producto.quantity = quantityINT;
        if(producto.quantity == null || producto.quantity < 1){
          producto.quantity = 1;
          encontro = true;
        }
      }
      if(encontro){this.inventoriesService.cartService.ActualizarTabla()}
    },100);
  }

  DesdeBotonesLaterales = false;
  AjustarCantidadInput(evento,Producto:ProductoTablaDTO){
    if(this.DesdeBotonesLaterales == true){
      this.DesdeBotonesLaterales = false;
      return;
    }
    let cantidad = evento.detail.value;
    if(cantidad == ""){return;}
    cantidad = parseInt(cantidad);
    if(cantidad < 1){
      return;
    }
    this.inventoriesService.cartService.ActualizarTabla()
  }

  ClickSubir(Producto:ProductoTablaDTO){
    this.DesdeBotonesLaterales = true;
    Producto.quantity += 1;
    this.inventoriesService.cartService.ActualizarTabla()
  }

  ClickBajar(Producto:ProductoTablaDTO){
    this.DesdeBotonesLaterales = true;
    Producto.quantity -= 1;
    if(Producto.quantity < 1){
      //this.EliminarProducto(Producto);
      Producto.quantity = 1;
    }else{
      this.inventoriesService.cartService.ActualizarTabla()
    }
  }

  ClickBorrar(Producto:ProductoTablaDTO){
    this.EliminarProducto(Producto);
    if(this.inventoriesService.cartService.ListaTablaProductosSeleccionados.length == 0){
      this.CerrarModal();
    }
  }

  // CheckInvalidQuantity(){
  //   let retorno = true;
  //   for(){
  //
  //   }
  // }

  ///////////////////////////////////////////////
  ////////// TODO COMPLETAR PEDIDO //////////////
  ///////////////////////////////////////////////

  async ClickCompletarPedido(){
    //Muestro loading
    this.Loading = await this.loadingController.create({
      message: 'Procesando'
    });
    await this.Loading.present();
    //Postear pedido
    let detailList = '';
    //GENERO LA LISTA DE DTOs DE DETALLES
    this.inventoriesService.cartService.ListaTablaProductosSeleccionados.forEach(item => {
      console.log(item);
      detailList = detailList+ "{"+item.id_product_third+","+(item.price-(item.price*(0)/100))+","+item.tax_product+","+item.quantity+"},"
    });
    this.http.post(Urlbase.facturacion+ "/pedidos/crearPedidoApp?idapp=26&idstoreclient=10&idthirduseraapp="+this.accountService.usuarioCompleto.third.id_third+"&idstoreprov="+this.billing.ProviderInfo.StoreID+"&detallepedido="+detailList.substring(0, detailList.length - 1)+"&descuento="+0,{}).subscribe(async (item) => {
      if(item==1){
        this.toastr.success('Pedido creado con exito');
        //this.CerrarModal("Algo");
        this.inventoriesService.CarritoEnFinal = false;
        this.commonOperations.ModalBuscadorProductos.dismiss();
        this.commonOperations.ModalCarrito.dismiss();
        while(this.commonOperations.ModalesLineas.length > 0){
          await this.commonOperations.ModalesLineas.pop().dismiss();
        }
        this.router.navigateByUrl("/home");
        this.inventoriesService.cartService.LimpiarCarrito();
        await this.billing.GetActiveOrderList(this.accountService.usuarioCompleto.third.id_third);
        let lastOrder = this.billing.ListadoPedidosActivos[0];
        this.fcmService.SendFCMpushFromClient("Orden '"+lastOrder.numdocumento+"' creada","El usuario '"+this.accountService.GetFullName()+"' ha creado una orden",
            {
              id_bill:lastOrder.id_BILL,stateC:701,stateP:801,prevState:lastOrder.id_BILL_STATE
            },this.billing.ProviderInfo.StoreID,"");
        //const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        this.http.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+lastOrder.id_BILL+"&pdf=1",{responseType: 'text' as 'json'}).subscribe(value => {
          console.log("[UniversalPDF] "+value)
        },error => {
          console.log("[UniversalPDF] ERROR: "+error)
        })
      }else{
        this.toastr.error('Se presento un error al crear el pedido');
      }
      await this.Loading.dismiss();
    },async (error) => {
      this.toastr.error('Se presento un error al crear el pedido');
    })
  }
}
