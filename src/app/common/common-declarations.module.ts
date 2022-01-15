import { NgModule } from '@angular/core';
import {HereMapComponent} from './here-map/here-map.component';
import {BuscarProductoComponent} from './buscar-producto/buscar-producto.component';
import {IonicSelectableModule} from 'ionic-selectable';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {NgxDatatableModule, ScrollbarHelper} from '@swimlane/ngx-datatable';
import {CommonModule} from '@angular/common';
import {CartComponent} from './cart/cart.component';
import {CategoryviewerComponent} from './categoryviewer/categoryviewer.component';
import {OrderViewerComponent} from './order-viewer/order-viewer.component';
import {MenuComponent} from './order-viewer/menu/menu.component';
import {ScoreComponent} from './order-viewer/score/score.component';


@NgModule({
  declarations: [
    HereMapComponent,
    BuscarProductoComponent,
    CartComponent,
    CategoryviewerComponent,
    OrderViewerComponent,
    MenuComponent,
    ScoreComponent
  ],
  imports: [
    CommonModule,
    IonicSelectableModule,
    NgxDatatableModule,
    IonicModule,
    FormsModule
  ],
  entryComponents:[BuscarProductoComponent],
  exports:[
    HereMapComponent,
    BuscarProductoComponent,
    NgxDatatableModule,
    OrderViewerComponent,
    MenuComponent,
    ScoreComponent
  ]
})
export class CommonDeclarationsModule { }
