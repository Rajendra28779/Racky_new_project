import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CreatecpdserviceService } from '../application/Services/createcpdservice.service';
import { SnoCLaimDetailsService } from '../application/Services/sno-claim-details.service';
import { JwtService } from '../services/jwt.service';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-cpd-multi-package-blocking',
  templateUrl: './cpd-multi-package-blocking.component.html',
  styleUrls: ['./cpd-multi-package-blocking.component.scss']
})
export class CpdMultiPackageBlockingComponent implements OnInit {

  hospitalCode: any;
  actualDate: any;
  transactionID: any;
  otherMessage: any;
  claimlist1: any;

  authorizedCode: any;
  urnNo: any;
  authData: any;
  token: any;

  constructor(private cpdService: CreatecpdserviceService, public snoService: SnoCLaimDetailsService, private router: Router, private jwtService: JwtService) { }

  ngOnInit(): void {
    //alert('hiii')
   
    this.urnNo = localStorage.getItem("urn");
    this.authorizedCode = localStorage.getItem("authorizedCode");
    this.hospitalCode = localStorage.getItem("hospitalCode");
    this.transactionID = localStorage.getItem("transactionID");
    this.token = localStorage.getItem("token");

    // alert(this.urnNo+" "+this.authorizedCode+" "+this.hospitalCode+" "+this.transactionID)
    this.getMultiPackageDetails();
  }

  action: any;
  preAuthLogList: any = [];
  isPreAuth: boolean = false;
  isLog: boolean = false;
  logList: any = [];
  getMultiPackageDetails() {
    let urno = this.urnNo;
    let authorizedCode = this.authorizedCode;
    let hospitalCode = this.hospitalCode;
    let transactionID = this.transactionID;
    this.cpdService.getMultiPackDtls(urno, authorizedCode, hospitalCode, transactionID).subscribe(data => {
      this.claimlist1 = data;
      this.action = this.claimlist1.result;
      this.preAuthLogList = this.claimlist1.preAuthLogList;
      let authCount = this.preAuthLogList.length;
      if (authCount > 0) {
        this.isPreAuth = true;
      }

      this.logList = this.claimlist1.approvalList;
      let logCount = this.logList.length;
      if (logCount > 0) {
        this.isLog = true;
      }
      console.log(this.action);
      // localStorage.removeItem("urn");
      // localStorage.removeItem("token");
      // localStorage.removeItem("authorizedCode");
      // localStorage.removeItem("hospitalCode");
      // localStorage.removeItem("transactionID");
    })
  }



  downloadAction(event: any, fileName: any, hCode: any, dateOfAdm: any, status) {

    let target = event.target;
    //console.log(target.nodeName);
    if ((target.nodeName == "A" || target.nodeName == "a") || (target.nodeName == "IMG" || target.nodeName == "img") || (target.nodeName == "I" || target.nodeName == "i")) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (fileName != null) {
        let img = this.snoService.downloadFile(fileName, hCode, dateOfAdm);
        window.open(img, '_blank')
      }


    }

  }

  treatmentdetails() {
    localStorage.setItem("urn", this.urnNo)
    localStorage.setItem("token", this.jwtService.getJwtToken())
    //this.router.navigate([]).then(result => { window.open('/bsky_portal/#/treatmenthistory'); });
    this.router.navigate([]).then(result => { window.open(environment.routingUrl + '/treatmenthistory'); });
  }

  preauthLogDetails() {
    let urno = this.urnNo;
    let authorizedCode = this.authorizedCode;
    let hospitalCode = this.hospitalCode;
    localStorage.setItem("urn", urno)
    localStorage.setItem("authorizedCode", authorizedCode)
    localStorage.setItem("hospitalCode", hospitalCode)
    localStorage.setItem("token", this.jwtService.getJwtToken())
    // this.router.navigate([]).then(result => { window.open('/bsky_portal/#/preauthhistory'); });
    this.router.navigate([]).then(result => { window.open(environment.routingUrl + '/preauthhistory'); });
  }

  dtls: any;
  viewDescription(descriptinDtls) {

    this.dtls = descriptinDtls;
    $("#appealDisposal").show();

  }

  modalClose() {

    $("#appealDisposal").hide();

  }



}
