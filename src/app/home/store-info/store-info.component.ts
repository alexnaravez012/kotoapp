import { Component, OnInit } from '@angular/core';
import {BillingService} from '../../Services/billing.service';

@Component({
  selector: 'app-store-info',
  templateUrl: './store-info.component.html',
  styleUrls: ['./store-info.component.scss'],
})
export class StoreInfoComponent implements OnInit {

  constructor(public billingService:BillingService) { }

  ngOnInit() {}

}
