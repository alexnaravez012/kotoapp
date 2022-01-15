import { Injectable } from "@angular/core";
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic";
import { Subject } from "rxjs";
import { Urlbase } from "../utils/urls";
import { HttpClient } from "@angular/common/http";
import { LocalNotifications } from "@ionic-native/local-notifications/ngx";
import { ToastService } from "./ToastService";
import { BillingService, Pedidos } from "./billing.service";
import {
  LoadingController,
  ModalController,
  Platform,
  ToastController,
} from "@ionic/angular";
import { OrderViewerComponent } from "src/app/common/order-viewer/order-viewer.component";
import { async } from "@angular/core/testing";
import { Router } from '@angular/router';

import { LocalStorage } from "../shared/localStorage";
import { AccountService } from './AccountService';
@Injectable({
  providedIn: "root",
})
export class FCMService {
  currentMessage: Subject<{}> = new Subject<{}>();
  TokenUpdate: Subject<{}> = new Subject<{}>();

  ChanelSetup = false;
  FCMtoken = null;
  Pedido: Pedidos = null;
  
  constructor(

    public locStorage: LocalStorage,
    public billingService: BillingService,
    public loadingController: LoadingController,
    public modalController: ModalController,
    private localNotifications: LocalNotifications,
    public toastController: ToastController,
    private http: HttpClient,
    private toastS: ToastService,
    private platform: Platform,
    private router: Router,
    private accountService : AccountService
  ) {

    if(this.accountService.usuarioCompleto===null){
      this.GoToLogin();
    } else {
      
      
   
      this.startFMC();
   


    }


  }


  GoToLogin() {
    this.router.navigateByUrl("/login");
  }

  async toastNotification(data) {
    try {
      //toast
      const toast = await this.toastController.create({
        header: data.titleD + " (" + this.Pedido.numdocumento + ")",
        message: data.bodyD,
        position: "top",
        cssClass: "toast-mess",
        buttons: [
          {
            text: "OK",
            role: "cancel",
            handler: () => {
              toast.dismiss();
             
              this.GoToOrderFromNotification(data);
              
              console.log("Cancel clicked");
              
            },
          },
        ],
      });
      
      await toast.present();
    } catch (error) {
      console.log(error);
    }
  }

  async getNamePedido(data) {
    let id_bill = data.id_bill;
    while (this.billingService.HomeClassRef.ActualizandoOrdenes) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 100);
      });
    }
    let pedido: Pedidos = null;
    //lo buscamos en los pedidos activos
    for (let n = 0; n < this.billingService.ListadoPedidosActivos.length; n++) {
      let tempPedido = this.billingService.ListadoPedidosActivos[n];
      if (tempPedido.id_BILL == id_bill) {
        pedido = tempPedido;
        break;
      }
    }
    //lo buscamos en los pedisos finalizados en caso de no encontrarlo en los pedidos activos
    if (pedido == null) {
      for (
        let n = 0;
        n < this.billingService.ListadoPedidosFinalizados.length;
        n++
      ) {
        let tempPedido = this.billingService.ListadoPedidosFinalizados[n];
        if (tempPedido.id_BILL == id_bill) {
          pedido = tempPedido;
          break;
        }
      }
    }
    if (pedido == null) {
      this.toastS.error("Ocurrió un error inesperado name");
    } else {
      this.Pedido = pedido;
      console.log("PEDIDO  buscado FROM NOT", this.Pedido);
    }
  }

  async GoToOrderFromNotification(data) {

    let id_bill = data.id_bill;
   
    while (this.billingService.HomeClassRef.ActualizandoOrdenes) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 100);
      });
    }
    let pedido: Pedidos = null;
    //lo buscamos en los pedidos activos
    for (let n = 0; n < this.billingService.ListadoPedidosActivos.length; n++) {
      let tempPedido = this.billingService.ListadoPedidosActivos[n];
      if (tempPedido.id_BILL == id_bill) {
        pedido = tempPedido;
        break;
      }
    }
    //lo buscamos en los pedisos finalizados en caso de no encontrarlo en los pedidos activos
    if (pedido == null) {
      for (
        let n = 0;
        n < this.billingService.ListadoPedidosFinalizados.length;
        n++
      ) {
        let tempPedido = this.billingService.ListadoPedidosFinalizados[n];
        if (tempPedido.id_BILL == id_bill) {
          pedido = tempPedido;
          break;
        }
      }
    }
    if (pedido == null) {
      this.toastS.error("Ocurrió un error inesperado gonot");
      this.Pedido = null;
    } else {
      this.Pedido = null;
      this.ClickOrder(pedido);
    }
  }
  async ClickOrder(pedido: Pedidos) {
    //from 0 es normal, from 1 es repetir, from 2 es calificar
    this.Pedido = null;
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

  async startFMC() {
    try {
      if (this.platform.is("cordova")) {
        FCM.getToken().then((token) => {
          console.log("FMC TOKENS HERE", token);
          this.FCMtoken = token;
          this.TokenUpdate.next(token);
          this.UpdateFCMtoken(token);
        });
        FCM.onNotification().subscribe((data) => {

          if(this.FCMtoken!=null){
      
          this.getNamePedido(data);

          console.log("NOTIFICATION HERE", data);
          console.log("PEdido not encontrado", this.Pedido)
          // Schedule a single notification
          this.localNotifications.schedule({
            id: 1,
            title: data.title + " (" + this.Pedido?.numdocumento + ")",
            text: data.message,
            data: { mydata: data.body, secret:data.id_bill },
          });
         
          this.localNotifications.on("click").subscribe((res) => {
        

              let order = {
                mydata: res.data.mydata,
                id_bill: res.data.secret
              }

         
            this.GoToOrderFromNotification(order);
            
          });

          this.toastNotification(data);

          this.currentMessage.next(data);

        }
        });
      }
      console.log("CONSTRUCTOR FCM SERVICE");

      this.TokenUpdate.subscribe(async (value) => {
        try {
          if (this.ChanelSetup) {
            return;
          }
          if (value != null && value != "") {
            this.ChanelSetup = true;
            this.FCMtoken = value;
          }
        } catch (e) {
          console.log("TokenUpdate.subscribe", e.toString());
        }
      });
    } catch (error) {}
  }

  async cleanFMC() {
    try {
      if (this.platform.is("cordova")) {
      await FCM.clearAllNotifications();
      await FCM.deleteInstanceId();
      
    }
    
      await this.TokenUpdate.next(null);
      this.FCMtoken = null;

      console.log("FCM DELETE")
      // await  this.UpdateFCMtoken("tokencanceladoaca");
    } catch (error) {
      console.log(error);
    }
  }

  async UpdateFCMtoken(token: string) {
    console.log("UpdateFCMtoken - token: ", token);
    try {
      let resultado = await new Promise((resolve, reject) => {
        console.log("POST UpdateFCMtoken");
        this.http
          .post(Urlbase.auth + "/UpdateFCMtoken", { token: token || "-1" })
          .subscribe(
            (value1) => {
              console.log("resolve UpdateFCMtoken");
              resolve(value1);
            },
            (error2) => {
              console.log("reject UpdateFCMtoken");
              reject(error2);
            }
          );
      });
      console.log("OK - resultado");
      console.log(resultado);
    } catch (e) {
      console.log("ERRRO FCMupdate: ");
      console.log(e);
      console.log(JSON.stringify(e));
    }
  }

  async SendFCMpushFromClient(title, body, data, id_store, nombre) {
    try {
      console.log("title");
      console.log(title);
      console.log("body");
      console.log(body);
      console.log("data");
      console.log(data);
      console.log("id_store");
      console.log(id_store);
      //Ajuste
      let Llaves = Object.keys(data);
      for (let n = 0; n < Llaves.length; n++) {
        data[Llaves[n]] += ""; //esto es para estar seguros de que todo se vaya como string
      }
      //
      let Resultado = await new Promise((resolve, reject) => {
        this.http
          .post(Urlbase.auth + "/SendFCMpushFromClient", {
            id_store: id_store,
            title: title,
            body: body,
            data: data,
          })
          .subscribe(
            (value) => resolve(value),
            (error) => reject(error)
          );
      });
      if (Resultado != "Empty") {
        //enviado
      }
    } catch (e) {
      //Error
      console.log("ERROR AL ENVIAR FCM");
      console.log(e.toString());
      console.log(JSON.stringify(e));
    }
  }
}

// // get FCM token
// this.fcm.getToken().then(token => {
//   localStorage.setItem("FCMtoken",token);
//   console.log(token);
//   this.http.post(Urlbase.auth+"/UpdateFCMtoken",{token:token||"-1"}).subscribe(value1 => {
//     console.log("OK");console.log(value1);
//   },error2 => {
//     console.log("ERRRO FCMupdate: ");console.log(error2);
//   })
// });
//
// // ionic push notification example
// this.fcm.onNotification().subscribe(data => {
//   console.log(data);
//   if (data.wasTapped) {
//     console.log('Received in background');
//   } else {
//     console.log('Received in foreground');
//   }
//   this.currentMessage.next(data);
// });
//
// // refresh the FCM token
// this.fcm.onTokenRefresh().subscribe(token => {
//   console.log(token);
// });
