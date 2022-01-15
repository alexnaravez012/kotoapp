import { Component, OnInit } from '@angular/core';
import {InventoriesService} from '../../Services/inventories.service';
import {LoadingController, ModalController, NavParams, Platform, PopoverController} from '@ionic/angular';
import {BuscarProductoComponent} from '../buscar-producto/buscar-producto.component';
import {CommonOperations} from '../../Services/CommonOperations';

@Component({
  selector: 'app-categoryviewer',
  templateUrl: './categoryviewer.component.html',
  styleUrls: ['./categoryviewer.component.scss'],
})
export class CategoryviewerComponent implements OnInit {

  ListadoKeysCategorias = [];
  Loading:any = null;
  ModalBuscarProducto:any = null
  CurrentLineaID = -1;

  constructor(
      public inventoriesService:InventoriesService,
      public navParams : NavParams,
      public loadingController: LoadingController,
      public modalController: ModalController,
      public commonOperations:CommonOperations,
      public platform: Platform
  ) {
    this.CurrentLineaID = this.navParams.get("idLinea");
    console.log("this.CurrentLineaID",this.CurrentLineaID)
    this.ListadoKeysCategorias = Object.keys(this.inventoriesService.LineaList[this.CurrentLineaID].categorias);
  }

  ngOnInit() {}

  async ClickCategoria(categoria){
    //la idea acá es que muestre el buscador pero solo filtro de la linea y la categoria
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
        CurrentLine: this.inventoriesService.LineaList[this.CurrentLineaID].nombre,
        CurrentCat: this.inventoriesService.LineaList[this.CurrentLineaID].categorias[categoria].nombre
      },
    });
    this.commonOperations.ModalBuscadorProductos = this.ModalBuscarProducto;
    let TempRef = this;
    this.ModalBuscarProducto.onDidDismiss().then((data) => {
      this.commonOperations.ModalBuscadorProductos = null;
      if(data.data != null){
        setTimeout(function() {
          TempRef.CerrarModal();
        },100);
      }
    });
    await this.ModalBuscarProducto.present();
    this.Loading.dismiss();
  }

  async AbrirBuscadorProductos() {
    //la idea acá es que muestre el buscador pero solo filtro de la linea
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
        CurrentLine: this.inventoriesService.LineaList[this.CurrentLineaID].nombre,
        CurrentCat: ""
      },
    });
    this.commonOperations.ModalBuscadorProductos = this.ModalBuscarProducto;
    this.ModalBuscarProducto.onDidDismiss().then((data) => {
      this.commonOperations.ModalBuscadorProductos = null;
    });
    await this.ModalBuscarProducto.present();
    this.Loading.dismiss();
  }

  CerrarModal(){
    this.modalController.dismiss();
  }

  // GetFontSizeByString(text:string){
  //   let calculo = (((this.platform.width()*0.33)-12)/text.length);
  //   if(calculo > (this.platform.width()*0.037)){
  //     calculo = this.platform.width()*0.037;
  //   }
  //   if(calculo < (this.platform.width()*0.02)){
  //     calculo = calculo*1.8;
  //   }
  //   return calculo +'px';
  // }
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
}
