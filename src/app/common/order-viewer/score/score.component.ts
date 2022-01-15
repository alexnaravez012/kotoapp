import {Component, Input, OnInit} from '@angular/core';
import {OrderViewerComponent} from '../order-viewer.component';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
})
export class ScoreComponent implements OnInit {

  Score = -1;
  Opinion = "";

  @Input()
  OrderViewer:any;

  constructor(public popoverController: PopoverController) { }

  ngOnInit() {}

  Cerrar(){
    this.popoverController.dismiss();
  }

  async Finalizar(){
    await this.OrderViewer.ConfirmarPedido(this.Score,this.Opinion);
    this.popoverController.dismiss();
  }
}
