import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import {IonicStorageModule, Storage} from '@ionic/storage';
import {CommonDeclarationsModule} from '../common/common-declarations.module';
import {StoreInfoComponent} from './store-info/store-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    CommonDeclarationsModule
  ],
  declarations: [HomePage,StoreInfoComponent],
  providers:[]
})
export class HomePageModule {}
