import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { BankMasterServiceService } from '../../Services/bank-master-service.service';
import { HeaderService } from '../../header.service';

@Component({
  selector: 'app-bank-master-view',
  templateUrl: './bank-master-view.component.html',
  styleUrls: ['./bank-master-view.component.scss']
})
export class BankMasterViewComponent implements OnInit {
  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  txtsearchDate: any;
  bankList: any = [];
  deleteDetails: any;
  status: any;
  childmessage: any;

  constructor(private bankMasterServiceService: BankMasterServiceService, private route: Router, private headerService: HeaderService) { }

  ngOnInit(): void {
    this.headerService.setTitle("View Bank Master");
    this.currentPage = 1;
    this.pageElement = 100;
    this.getBankMasterDetails();
  }
  details: any;
  getBankMasterDetails() {
    this.bankMasterServiceService.getBankMasterDetail().subscribe((alldata) => {
      this.details = alldata;

      this.bankList = this.details.details;
      this.record = this.bankList.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    })
  }

  edit(item: any) {
    let objToSend: NavigationExtras = {
      state: {
        bankId: item
      }
    };
    this.route.navigate(['/application/addbankmaster'], objToSend);
  }

}
