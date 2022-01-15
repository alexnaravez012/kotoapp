import {Component, Input, OnInit} from '@angular/core';
import {OrderViewerComponent} from '../order-viewer.component';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  @Input()
  MainClass:any

  constructor(
      public popoverController: PopoverController
  ) { }

  ngOnInit() {}

}
