import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import {LoginComponent} from './login/login.component';
import {SigninComponent} from './signin/signin.component';
import {HttpClientModule} from '@angular/common/http';
import {CommonDeclarationsModule} from '../common/common-declarations.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
    imports: [
      IonicSelectableModule,
      CommonModule,
      FormsModule,
      IonicModule,
      LoginPageRoutingModule,
      ReactiveFormsModule,
      HttpClientModule,
      CommonDeclarationsModule
    ],
  declarations: [LoginPage,LoginComponent,SigninComponent]
})
export class LoginPageModule {}
