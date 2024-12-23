import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service'; 
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CreatecpdserviceService } from '../application/Services/createcpdservice.service';
import { SnoCLaimDetailsService } from '../application/Services/sno-claim-details.service';

@Component({
  selector: 'app-sna-package-blocking',
  templateUrl: './sna-package-blocking.component.html',
  styleUrls: ['./sna-package-blocking.component.scss']
})
export class SnaPackageBlockingComponent implements OnInit {
  childmessage: any;
  claimDetails: any;
  preAuth: any = [];
  preAuthHistory: any = [];
  check: boolean = false;
  urnNo: any;
  claimLog: any = [];
  dtls: any;
  authorizedCode:any;
  hospitalCode:any;
  transactionID:any;
  token:any;
  constructor(private cpdService: CreatecpdserviceService,public snoService: SnoCLaimDetailsService, public route: Router, private jwtService: JwtService) { }

  ngOnInit(): void {
    $("#appealDisposal").hide();
    this.urnNo = localStorage.getItem("urn");
    this.authorizedCode = localStorage.getItem("authorizedCode");
    this.hospitalCode = localStorage.getItem("hospitalCode");
    this.transactionID = localStorage.getItem("transactionID");
    this.token = localStorage.getItem("token");
    this.getMultiPackageDetails();
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  multiPackList:any=[];
  multiFlag:boolean=false;
  getMultiPackageDetails(){
    this.snoService.getSnoClaimListById(this.transactionID).subscribe((data: any) => {
      let resData = data;
      if (resData.status == "success") {
        let details = JSON.parse(resData.details);
        console.log(details);
        this.claimDetails = details.actionData;
        this.claimLog = details.actionLog; 
        this.preAuth = details.preAuthHist;
        console.log(this.preAuth);
        if (this.preAuth.length != 0) {
          this.check = true;
        }
        this.preAuthHistory = details.preAuthLog;
        console.log(this.preAuthHistory);
        // localStorage.removeItem("urn");
        // localStorage.removeItem("authorizedCode");
        // localStorage.removeItem("hospitalCode");
        // localStorage.removeItem("transactionID");
      } else {
        this.swal('', 'Something went wrong.', 'error');
      }
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  downloadAction(event: any, fileName: any, hCode: any, dateOfAdm: any) {
    let target = event.target;
    //console.log(target.nodeName);
    if ((target.nodeName == "A" || target.nodeName == "a") || (target.nodeName == "IMG" || target.nodeName == "img") || (target.nodeName == "I" || target.nodeName == "i") || (target.nodeName == "SPAN" || target.nodeName == "span")) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (fileName != null) {
        let img = this.snoService.downloadFile(fileName, hCode, dateOfAdm);
        window.open(img, '_blank')
      }
    }
  }
  preAuthLogDetails(urn, authCode, hosCode) {
    let authCodes = authCode.slice(2);
    localStorage.setItem("urn", urn);
    localStorage.setItem("authorizedCode", authCodes);
    localStorage.setItem("hospitalCode", hosCode);
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/preauthhistory'); });
  }
  treatmentdetails() {
    // localStorage.setItem("click", "Y");
    localStorage.setItem("urn", this.urnNo)
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/treatmenthistory'); });
  }
  modalClose() {
    $("#appealDisposal").hide();
  }
  viewDescription(descriptinDtls) { 
    this.dtls = descriptinDtls;
    $("#appealDisposal").show(); 
  } 
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
}
