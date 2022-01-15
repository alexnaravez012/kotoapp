import {Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {BillingService, Pedidos} from '../../Services/billing.service';
import {AlertController, LoadingController, ModalController, PopoverController} from '@ionic/angular';
import {AccountService} from '../../Services/AccountService';
import {HereMapComponent} from '../here-map/here-map.component';

import * as moment from 'moment';
import {MenuComponent} from './menu/menu.component';
import {ScoreComponent} from './score/score.component';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-order-viewer',
  templateUrl: './order-viewer.component.html',
  styleUrls: ['./order-viewer.component.scss'],
})
export class OrderViewerComponent implements OnInit {

  @Input() From: number;
  @Input() Pedido: Pedidos;

  @ViewChild('ElMap', {static: false}) private ElMap: HereMapComponent;
  @ViewChildren('Progress') private Progress: QueryList<ElementRef>;
  CargandoMapa = true;
  
  DetallesPedido = [];
  //0 Cantidad
  //1 nombre
  //2 Valor
  //3 Codigo de barras
  //4 porcentaje IVA
  //5 precio sin iva
  //6 precio con IVA
  //7 y el ID TAX
  //8 en ese orden

  ReferenciaProgresBar:any[] = [];
  CurrentIndexReferencia = -1;

  ValorActual = 100;
  EtapaAvance = 0;
  Distancia = -1;

  FirstStartShowReason = true;

  loading;

  constructor(
      public billingService : BillingService,
      public modalController: ModalController,
      public accountService:AccountService,
      public popoverController: PopoverController,
      public alertController: AlertController,
      public loadingController: LoadingController,
      private httpClient:HttpClient
  ) { }

  async ngOnInit() {
    try {

      this.billingService.OrderOpen = true;

      this.billingService.HomeClassRef.OrderViwer = this;
      this.DetallesPedido = <[]>await this.billingService.GetOrderDetails(this.Pedido.id_BILL);
      console.log("this.DetallesPedido es")
      console.log(this.DetallesPedido)
    }catch (e) {
      console.log("No se pudieron obtener los detalles")
      console.log(e)
    }

    let Colores = [
      "#EAEAEA,#FAD263,1",//normal
      "#EAEAEA,#bf1757,10",//cancelado
      "#EAEAEA,#01B6B2,10",//finalizado
      "#EAEAEA,#FAD263,1"//normal
    ];
    // if(this.Pedido.id_BILL_STATE == 99){
    //   Colores = "#EAEAEA,#bf1757";
    // }
    // console.log("this.Progress es ")
    // console.log(this.Progress)
    for(let n = 0;n<this.Progress.toArray().length;n++){
      let progress_temp = this.Progress.toArray()[n];
      // console.log("progress_temp es ")
      // console.log(progress_temp)
      // @ts-ignore
      this.ReferenciaProgresBar[n] = new ldBar(progress_temp.nativeElement, {
        "stroke": 'data:ldbar/res,stripe('+Colores[n]+')',
        "value": 0,
      });
    }
    this.CurrentIndexReferencia = 0;
    setTimeout(async ()=>{
      this.CargandoMapa = true;
      await this.ElMap.ReturnWhenReady();
      this.ElMap.ClearMarkers();
      this.ElMap.SetMarker({lat:this.Pedido.latitud,lng:this.Pedido.longitud},0)
      this.ElMap.SetMarker({lat:this.Pedido.latitudp,lng:this.Pedido.longitudp},0)
      this.ElMap.CentrarMapaEnMarcadores();
      //Mostrar Ruta
      this.Distancia = await this.ElMap.SetRoute(this.Pedido.latitud,this.Pedido.longitud,this.Pedido.latitudp,this.Pedido.longitudp);
      ///////////////
      this.CargandoMapa = false;
      this.ActualizarEstadoOrden();
      this.FirstStartShowReason = false;
    }, 50);
    setInterval(async ()=>{
      //   console.log("set interval order actualizando pedido..00.")
         if(this.billingService.pedidoOpened!=null){
        
           console.log("set interval order actualizando pedido...")
           this.Pedido=this.billingService.pedidoOpened;
           this.ActualizarEstadoOrden();
        
       }
       },2000)
  }

  ActualizarEstadoOrden(){
    this.ValorActual = 100;
    this.EtapaAvance = 0;
    if(this.Pedido.id_BILL_STATE == 801){
      this.ValorActual = (100/3);
      this.EtapaAvance = 1;
      this.CurrentIndexReferencia = 0;
    }else if(this.Pedido.id_BILL_STATE == 807 || this.Pedido.id_BILL_STATE == 802 || this.Pedido.id_BILL_STATE == 902){
      this.ValorActual = (100/3) * 2;
      this.EtapaAvance = 2;
      this.CurrentIndexReferencia = 0;
    }else if(this.Pedido.id_BILL_STATE == 803){
      this.ValorActual = (100/3) * 3;
      this.EtapaAvance = 3;
      this.CurrentIndexReferencia = 0;
    }else if(this.Pedido.id_BILL_STATE == 99){
      this.ValorActual = (100/3) * 3;
      this.EtapaAvance = 3;
      this.CurrentIndexReferencia = 1;
     
      //Cambio de color
    }else if(this.Pedido.id_BILL_STATE == 808 || this.Pedido.id_BILL_STATE == 804 || this.Pedido.id_BILL_STATE == 705){
      this.ValorActual = 100;
      this.EtapaAvance = 3;
      this.CurrentIndexReferencia = 2;
    }
    for(let n = 0;n<this.ReferenciaProgresBar.length;n++){
      let ref = this.ReferenciaProgresBar[n];
      let elemento = this.Progress.toArray()[n].nativeElement;
      if(this.CurrentIndexReferencia == n){
        ref.set(this.ValorActual);
        elemento.classList = "EstiloProgressBar label-center ldBar";
      }else{
        elemento.classList = "EstiloProgressBar label-center ldBar Ocultar";
      }
    }
  }

  async ShowCancelReason(){
    const alert = await this.alertController.create({
      header: 'Razón cancelación',
      message: this.Pedido.body.substr(42,this.Pedido.body.length),
      buttons: ['OK']
    });
    await alert.present();
  }

  FormatedDate(){
    return moment(this.Pedido.fecha).format("YYYY-MM-DD hh:mm a");
  }

  roundnum(num) {
    //return Math.round(num / 50) * 50;
    return Math.round(num);
  }

  CloseModal(){
    this.billingService.OrderOpen = null;
    this.billingService.HomeClassRef.OrderViwer = null;
    this.Pedido = null;
    this.modalController.dismiss();
  }

  async ClickMenu(event){
    this.loading = true;
    setTimeout(async ()=>{
      const popover = await this.popoverController.create({
        component: MenuComponent,
        event: event,
        translucent: true,
        componentProps:{
          MainClass:this
        }
      });
      await popover.present();
      this.loading = false;
    },50);
  }

  PedidoActivo(){
    return [801, 807, 802, 803].includes(this.Pedido.id_BILL_STATE);
  }

  async ConfirmarPedido(puntaje,obs){
    try {
      const loading = await this.loadingController.create({
        message: 'Confirmando...',
      });
      await loading.present();
      let estadoC = 704;
      let estadoP = 804;
      let notas = "ENTREGADO";
      let titulo = "entregada";
      let Asunto = "finalizado";
      if(puntaje != -1 || obs != ""){
        estadoC = 705;
        estadoP = 705;
        notas = "CALIFICADO|Score:"+puntaje+"|Obs:"+obs
        titulo = "calificada";
        Asunto = "calificado";
      }
      let pedido = this.Pedido;
      await this.billingService.ACTUALIZAR_ESTADO_PEDIDOAPP(this.Pedido.id_BILL,this.accountService.usuarioCompleto.third.id_third,notas,this.Pedido.id_BILL_STATE,estadoC,estadoP)
      await this.billingService.GetActiveOrderList(this.accountService.usuarioCompleto.third.id_third);
      this.billingService.HomeClassRef.fcmService.SendFCMpushFromClient("Orden '"+pedido.numdocumento+"' "+titulo,"El usuario '"+this.accountService.GetFullName()+"' ha '"+Asunto+"' una orden",{
        id_bill:pedido.id_BILL,stateC:estadoC,stateP:estadoP,prevState:pedido.id_BILL_STATE
      },this.billingService.ProviderInfo.StoreID,"");
      await loading.dismiss();
    }catch (e) {
      const alert = await this.alertController.create({
        header: 'Error',
        subHeader: 'No se pudo confirmar la entrega',
        message: e.toString(),
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async AceptarNovedad(){
    try {
      const loading = await this.loadingController.create({
        message: 'Confirmando...',
      });
      await loading.present();
      let estadoC = 801;
      let estadoP = 802;
      let pedido = this.Pedido;
      await this.billingService.ACTUALIZAR_ESTADO_PEDIDOAPP(this.Pedido.id_BILL,this.accountService.usuarioCompleto.third.id_third,"Pedido "+pedido.numdocumento+" Novedad Aceptada",
          this.Pedido.id_BILL_STATE,estadoC,estadoP)
      await this.billingService.GetActiveOrderList(this.accountService.usuarioCompleto.third.id_third);
      this.billingService.HomeClassRef.fcmService.SendFCMpushFromClient("Orden '"+pedido.numdocumento+"' aceptada",
          "El usuario '"+this.accountService.GetFullName()+"' ha 'aceptado la novedad' de la orden",{
        id_bill:pedido.id_BILL,stateC:estadoC,stateP:estadoP,prevState:pedido.id_BILL_STATE
      },this.billingService.ProviderInfo.StoreID,"");
      await loading.dismiss();
    }catch (e) {
      const alert = await this.alertController.create({
        header: 'Error',
        subHeader: 'No se pudo aceptar la novedad',
        message: e.toString(),
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async CancelarPedidoProcesadoConNovedad(){
    const alert = await this.alertController.create({
      header: 'Confirmar',
      subHeader:"¿Confirma cancelar la orden?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: async (data) => {
            try {
              if(this.Pedido.id_BILL_STATE == 803){
                await this.billingService.CANCELAR_PEDIDO_APP(this.Pedido.id_BILL,"PEDIDO CANCELADO -  PROCESADO CON NOVEDAD",this.Pedido.id_BILL_STATE,this.accountService.usuarioCompleto.third.id_third);
              }else{
                await this.billingService.ACTUALIZAR_ESTADO_PEDIDOAPP(this.Pedido.id_BILL,this.accountService.usuarioCompleto.third.id_third,"PEDIDO CANCELADO -  PROCESADO CON NOVEDAD",this.Pedido.id_BILL_STATE,99,99)
              }
              let pedido = this.Pedido;
              this.Pedido = null;
              this.modalController.dismiss();
              this.billingService.GetActiveOrderList(this.accountService.usuarioCompleto.third.id_third);
              this.billingService.HomeClassRef.fcmService.SendFCMpushFromClient("Orden '"+pedido.numdocumento+"' cancelada","El usuario '"+this.accountService.GetFullName()+"' ha cancelado una orden",{
                id_bill:pedido.id_BILL,stateC:99,stateP:99,prevState:pedido.id_BILL_STATE
              },this.billingService.ProviderInfo.StoreID,"");
            }catch (e) {

            }
          }
        }
      ]
    });

    await alert.present();
  }

  async CancelarPedido(){
    const alert = await this.alertController.create({
      header: 'Escribenos porque quieres cancelar la orden',
      inputs: [
        {
          name: 'note',
          type: 'text',
          placeholder: 'Ingrese una razón',
          min: 5
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: async (data) => {
            console.log('Confirm Ok');
            console.log(data);
            if(data.note.length > 5){
              try {
                if(this.Pedido.id_BILL_STATE == 803){
                  await this.billingService.CANCELAR_PEDIDO_APP(this.Pedido.id_BILL,data.note,this.Pedido.id_BILL_STATE,this.accountService.usuarioCompleto.third.id_third);
                }else{
                  await this.billingService.ACTUALIZAR_ESTADO_PEDIDOAPP(this.Pedido.id_BILL,this.accountService.usuarioCompleto.third.id_third,data.note,this.Pedido.id_BILL_STATE,99,99)
                }
                let pedido = this.Pedido;
                this.Pedido = null;
                this.modalController.dismiss();
                this.billingService.GetActiveOrderList(this.accountService.usuarioCompleto.third.id_third);
                this.billingService.HomeClassRef.fcmService.SendFCMpushFromClient("Orden '"+pedido.numdocumento+"' cancelada","El usuario '"+this.accountService.GetFullName()+"' ha cancelado una orden",{
                  id_bill:pedido.id_BILL,stateC:99,stateP:99,prevState:pedido.id_BILL_STATE
                },this.billingService.ProviderInfo.StoreID,"");
              }catch (e) {

              }
            }else{
              const alert = await this.alertController.create({
                header: 'Error',
                message: 'Debes ingresar una razón (mínimo 5 caracteres) para cancelar la orden.',
                buttons: ['OK']
              });
              await alert.present()
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async ConfirmarEntrega(ev){
    const popover = await this.popoverController.create({
      component: ScoreComponent,
      translucent: true,
      componentProps:{
        OrderViewer:this
      }
    });
    return await popover.present();
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
}
