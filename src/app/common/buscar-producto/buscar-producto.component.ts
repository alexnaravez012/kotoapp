import {Component, OnInit, ViewChild} from '@angular/core';
import {LoadingController, ModalController, NavParams, PopoverController} from '@ionic/angular';
import { ColumnMode } from '@swimlane/ngx-datatable';
import {InventoriesService, InventoryName, ProductoTablaDTO} from '../../Services/inventories.service';
import {CartService} from '../../Services/cart.service';
import {CartComponent} from '../cart/cart.component';
import {CommonOperations} from '../../Services/CommonOperations';

@Component({
  selector: 'app-buscar-producto',
  templateUrl: './buscar-producto.component.html',
  styleUrls: ['./buscar-producto.component.scss'],
})
export class BuscarProductoComponent implements OnInit {
  MainClass:any;
  ColumnMode = ColumnMode;
  public VariableSelectorProviders;
  Loading:any = null;

  public ListadoProvidersSeleccionados = [];

  public ProductoEnPopOver:ProductoTablaDTO;
  PopOverProducto:any = null;

  //
  ProductoVisualizando:InventoryName = null;
  //
  CurrentLine = "";
  CurrentCat = "";
  //
  BuscarSoloCurrentCat = true;

  @ViewChild('Buscador') Buscador ;

  constructor(
      public navParams : NavParams,
      public inventoriesService:InventoriesService,
      public CartService:CartService,
      public loadingController: LoadingController,
      public modalController: ModalController,
      private commonOperations:CommonOperations
  ) {
    this.MainClass = this.navParams.get("MainClass");
    this.CurrentLine = this.navParams.get("CurrentLine");
    this.CurrentCat = this.navParams.get("CurrentCat");
  }

  async ngOnInit() {
    this.inventoriesService.BuscadoresAbiertos++;
    //await this.inventoriesService.getInventoryList();
    //En caso de solo tener 1, seleccionarlo
    if(this.GetKeysProviders().length == 1){
      this.ListadoProvidersSeleccionados = [];
      this.ListadoProvidersSeleccionados.push(this.inventoriesService.ProvidersList[this.GetKeysProviders()[0]]);
    }
    await this.CartService.EventoInputBuscadorProductos("",this.CurrentLine,this.CurrentCat);
    console.log("ListaProductosFiltradosBuscador");
    console.log(this.CartService.ListaProductosFiltradosBuscador);
    // setTimeout(() => {
    //   this.Buscador.setFocus();
    // },1000);
  }


  ngOnDestroy() {
    this.inventoriesService.BuscadoresAbiertos--;
  }

  GetItemPrice(item:InventoryName){
    let valor = item.price + (item.price*this.inventoriesService.getPercentTax(item.id_TAX));
    //Ajuste a 50 superior
    let modOpt = valor % 50;
    if(modOpt > 0){
      valor += 50 - modOpt;
    }
    return valor;
  }

  public async ClickProviderBuscador(evento){
    //Muestro loading
    this.Loading = await this.loadingController.create({
      message: 'Filtrando'
    });
    await this.Loading.present();
    this.ListadoProvidersSeleccionados = [];
    for(let n = 0;n<evento.value.length;n++){
      this.ListadoProvidersSeleccionados.push(evento.value[n]);
    }
    await this.CartService.ActualizarFiltroProviders(this.ListadoProvidersSeleccionados);
    await this.Loading.dismiss();
    console.log("VariableSelectorProviders es ");
    console.log(this.VariableSelectorProviders)
  }

  public async ClickQuitarProvider(proveedor){
    //Muestro loading
    this.Loading = await this.loadingController.create({
      message: 'Filtrando'
    });
    await this.Loading.present();
    //Quito el provider de ListadoProvidersSeleccionados
    for(let n = 0;n<this.ListadoProvidersSeleccionados.length;n++){
      if(this.ListadoProvidersSeleccionados[n].id == proveedor.id){
        this.ListadoProvidersSeleccionados.splice(n,1);
        break;
      }
    }
    //Quito el provider de VariableSelectorProviders
    for(let n = 0;n<this.VariableSelectorProviders.length;n++){
      if(this.VariableSelectorProviders[n].id == proveedor.id){
        this.VariableSelectorProviders.splice(n,1);
        break;
      }
    }
    await this.CartService.ActualizarFiltroProviders(this.ListadoProvidersSeleccionados);
    await this.Loading.dismiss();
  }

  SumarCantidad(){
    this.ProductoEnPopOver.quantity += 1;
    this.CartService.ActualizarTabla()
  }

  AjustarCantidad(cantidad){
    this.ProductoEnPopOver.quantity = cantidad;
    this.CartService.ActualizarTabla()
  }

  CerrarPopOver(){
    this.PopOverProducto.dismiss();
  }

  DisminuirCantidad(){
    this.ProductoEnPopOver.quantity -= 1;
    if(this.ProductoEnPopOver.quantity < 1){
      this.ProductoEnPopOver.quantity = 1;
    }
    this.CartService.ActualizarTabla()
  }

  async EliminarProducto(){
    await this.CartService.EliminarProductoPorParametro(this.ProductoEnPopOver);
    this.PopOverProducto.dismiss();
  }

  GetKeysProviders(){
    return Object.keys(this.inventoriesService.ProvidersList);
  }

  TimeOurRef:any = null;
  ValorEncolado = "";
  TimeOurRef_Encolado:any = null;
  Buscando = false;
  async filterList(evento){
    if(this.TimeOurRef == -1){
      this.ValorEncolado = evento;
      if(this.TimeOurRef_Encolado != null){return;}
      this.TimeOurRef_Encolado = setTimeout(async function(MainClass){
        MainClass.TimeOurRef_Encolado = null;
        MainClass.filterList(MainClass.ValorEncolado);
      },400,this);
    }
    if(this.TimeOurRef != null){
      clearTimeout(this.TimeOurRef);
    }
    this.TimeOurRef = setTimeout(async function(MainClass) {
      MainClass.TimeOurRef = -1;
      //Muestro Loading
      MainClass.Buscando = true;
      await new Promise(resolve => {
        setTimeout(resolve,100)
      })
      if(evento.target.value == ""){
        MainClass.BuscarSoloCurrentCat = true;
      }else{
        MainClass.BuscarSoloCurrentCat = false;
      }
      await MainClass.CartService.EventoInputBuscadorProductos(evento.target.value,MainClass.BuscarSoloCurrentCat ? MainClass.CurrentLine:'',MainClass.BuscarSoloCurrentCat ? MainClass.CurrentCat:'')
      MainClass.Buscando = false;
      MainClass.TimeOurRef = null;
    }, 400,this);
  }

  async AddProducto(Producto){
    //Muestro Loading
    this.Loading = await this.loadingController.create({
      message: 'Un Momento'
    });
    await this.Loading.present();
    await this.CartService.AgregarProductoDesdeBuscadorProductos(Producto);
    await this.Loading.dismiss();
  }

  calculateTotalPrice(Producto:ProductoTablaDTO) {
    return (Producto.price + (Producto.tax * Producto.price)) * Math.floor(Producto.quantity)
  }

  ClickCerrar(retorno?){
    this.modalController.dismiss(retorno);
  }

  async ClickCarrito() {
    if(this.commonOperations.ModalCarrito != null){await this.commonOperations.ModalCarrito.dismiss();}
    const modal = await this.modalController.create({
      component: CartComponent,
      cssClass: 'my-custom-modal-css',
    });
    this.commonOperations.ModalCarrito = modal;
    modal.onDidDismiss().then(value => {
      this.commonOperations.ModalCarrito = null;
    })
    // let TempRef = this;
    // modal.onDidDismiss().then((data) => {
    //       if(data.data != null){
    //         setTimeout(function() {
    //           TempRef.ClickCerrar("Algov2");
    //         },100);
    //       }
    //       console.log("data")
    //       console.log(data)
    //     });
    await modal.present();
  }
}
