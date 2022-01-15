import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CurrencyPipe} from '@angular/common';
import {HomePageRoutingModule} from './home/home-routing.module';
import {IonicStorageModule} from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import {CustomInterceptor} from './utils/CustomInterceptor';
import {Diagnostic} from '@ionic-native/diagnostic/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

import {CommonDeclarationsModule} from './common/common-declarations.module';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { IonicKeyboardAssist } from 'ionic-keyboard-assist';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
//import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      scrollPadding: false,
      scrollAssist: false
    }),
    AppRoutingModule,
    HttpClientModule,
    CommonDeclarationsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    IonicStorageModule.forRoot()
  ],
  providers: [
    LocalNotifications, 
    IonicKeyboardAssist ,
    Keyboard,
    SplashScreen,
    StatusBar,
    CurrencyPipe,
    Diagnostic,
    AndroidPermissions,
    Geolocation,
    LocationAccuracy,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    File,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor ,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
