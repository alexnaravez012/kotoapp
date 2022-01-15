import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {ModalController, Platform} from '@ionic/angular';

import {InventoriesService} from './Services/inventories.service';
import {CartComponent} from './common/cart/cart.component';
import {CommonOperations} from './Services/CommonOperations';


import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { IonicKeyboardAssist } from 'ionic-keyboard-assist';
//import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
//import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {


  constructor(
    private platform: Platform,
    private keyboardAssist: IonicKeyboardAssist,
    private splashScreen: SplashScreen,
    private keyboard: Keyboard,
    private statusBar: StatusBar,
    public inventoryService:InventoriesService,
    public modalController: ModalController,
    //private firebaseCrashlytics: FirebaseCrashlytics,
    public commonOperations:CommonOperations
  ) {
    this.initializeApp();
    this.keyboardAssist.init({scrollPadding: true, scrollAssist: true});
  }

  initializeApp() {

    try {
      this.platform.ready().then(() => {
        this.statusBar.hide();
        this.splashScreen.hide();
      });
      // const crashlytics = this.firebaseCrashlytics.initialise();
      // crashlytics.logException('my caught exception');
    }catch (e) {
      console.log("crashlytics")
      console.log(e)
    }
  }

  ngOnInit() {
    
  }

  roundnum(num) {
    //return Math.round(num / 50) * 50;
    return Math.round(num);
  }


  async ClickCarrito() {
    console.log("[ClickCarrito]this.inventoryService.CarrosAbiertos es ",this.inventoryService.CarrosAbiertos)
    if(this.inventoryService.CarrosAbiertos > 0){
      this.inventoryService.RefCarrito.ClickSiguiente();
    }else{
      if(this.commonOperations.ModalCarrito != null){await this.commonOperations.ModalCarrito.dismiss();}
      const modal = await this.modalController.create({
        component: CartComponent,
        cssClass: 'my-custom-modal-css',
      });
      this.commonOperations.ModalCarrito = modal;
      modal.onDidDismiss().then(value => {
        this.commonOperations.ModalCarrito = null;
      })
      await modal.present();
    }
  }
}
