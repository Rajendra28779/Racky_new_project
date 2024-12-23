import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HeaderService } from '../application/header.service';
import { SnoCLaimDetailsService } from '../application/Services/sno-claim-details.service';

@Component({
  selector: 'app-discharged-treatment-info',
  templateUrl: './discharged-treatment-info.component.html',
  styleUrls: ['./discharged-treatment-info.component.scss']
})
export class DischargedTreatmentInfoComponent implements OnInit {
  childmessage: any;
  data: any;
  txnId: any;
  claimDetails: any;
  claimLog: any = [];
  multiPackList: any = [];
  multiFlag: boolean = false;
  preAuth: any;
  check: boolean = false;

  constructor(public headerService: HeaderService, public snoService: SnoCLaimDetailsService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Approval by SNA');
    this.txnId = localStorage.getItem("trnsId");
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.getDischargeDetails();
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  getDischargeDetails() {
    console.log(this.txnId);
    this.snoService.getDischargeDetails(this.txnId).subscribe((data: any) => {
      let resData = data;
      if (resData.status == "success") {
        let details = JSON.parse(resData.details);
        this.claimDetails = details.actionData;
        localStorage.removeItem("trnsId"); 
        // this.claimLog = details.actionLog;
        // let multiPkg = details.packageBlock
        // multiPkg.forEach(item => {
        //   if (item.transctionId != this.txnId) {
        //     this.multiPackList.push(item);
        //   }
        // })
        // if (this.multiPackList.length > 0) {
        //   this.multiFlag = true;
        // }
        // this.preAuth = details.preAuthHist;
        // console.log(this.preAuth);
        // if (this.preAuth.length != 0) {
        //   this.check = true;
        // }
      } else {
        this.swal('', 'Something went wrong.', 'error');
      }
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
}
