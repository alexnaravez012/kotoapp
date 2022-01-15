import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BillingService, Pedidos} from '../../Services/billing.service';
import {ModalController} from '@ionic/angular';
import {OrderViewerComponent} from '../../common/order-viewer/order-viewer.component';
import * as moment from 'moment';
import {AccountService} from '../../Services/AccountService';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  constructor(
    private router:Router,
    private httpClient: HttpClient,
    public billingService : BillingService,
    public modalController: ModalController,
    private accountService: AccountService
  ) { }

  async ngOnInit() {
    this.ActualizarActivos(null);
    this.ActualizarFinalizadas(null);
    console.log("ListFinalizados", this.billingService.ListadoPedidosFinalizados)
    setInterval(async ()=>{
      // console.log("set interval list pedidos")
       this.updatePedidoOpen();
     },2000)
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
  async ActualizarActivos(evento){
    this.billingService.ListadoPedidosActivos = [];
    await this.billingService.GetActiveOrderList(this.accountService.usuarioCompleto.third.id_third);
    if(evento != null){evento.target.complete();}
  }


  async ActualizarFinalizadas(evento){
    await this.billingService.GetEndedOrderList(this.accountService.usuarioCompleto.third.id_third);
    if(evento != null){evento.target.complete();}
  }

  GoToHome(){
    this.router.navigateByUrl("/home");
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
      case 902: return "Alistando el pedido"
      case 705: return "Calificado";
      case 99: return "Cancelado";
      default: return id;
    }
  }

  FormatedDate(fecha:Date){
    return moment(fecha).format("YYYY-MM-DD hh:mm a");
  }

  async ClickOrder(pedido:Pedidos,From:number){//from 0 es normal, from 1 es repetir, from 2 es calificar

    this.billingService.pedidoOpened = pedido;
    const modal = await this.modalController.create({
      component: OrderViewerComponent,
      componentProps:{
        From:From,
        Pedido:pedido,
      }
    });

    modal.onDidDismiss().then(value => {

      this.billingService.pedidoOpened=null;
    })


    return await modal.present();


    
  }
}
