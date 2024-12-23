import { Component, OnInit } from '@angular/core';
import {HeaderService} from "../application/Services/header.service";
import {CpdPaymentCalculationService} from "../application/Services/cpd-payment-calculation.service";
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-cpd-payment-calculation-details',
  templateUrl: './cpd-payment-calculation-details.component.html',
  styleUrls: ['./cpd-payment-calculation-details.component.scss']
})
export class CpdPaymentCalculationDetailsComponent implements OnInit {

  user: any;
  searchFilterParam: any;
  txtsearchDate:any;
  responseData:any;

  constructor(
              private cpdPaymentCalculationService: CpdPaymentCalculationService,  private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.searchFilterParam =this.sessionService.decryptSessionData("searchFilterParameters");

    this.getPaymentCalculationData();
  }

  getPaymentCalculationData() {
    console.log(this.searchFilterParam);
    this.cpdPaymentCalculationService.getCPDPaymentDetailsUserId(this.searchFilterParam.fromDate, this.searchFilterParam.toDate, this.searchFilterParam.userId, this.searchFilterParam.actionCode)
      .subscribe((res: any) => {

      });
  }

  downloadReport(type: any) {

  }

  searchFilter() {

  }

  resetField() {

  }
}
