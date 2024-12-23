import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import { HeaderService } from '../../header.service';
import { CreatecpdserviceService } from '../../Services/createcpdservice.service';
import { DynamicreportService } from '../../Services/dynamicreport.service';
import { PaidServiceService } from '../../Services/paid-service.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dischargedetails-history',
  templateUrl: './dischargedetails-history.component.html',
  styleUrls: ['./dischargedetails-history.component.scss']
})
export class DischargedetailsHistoryComponent implements OnInit {
  dataDisplay: any;
  claimid: any;
  authorizedcode: any;
  hospitalcode: any;
  trtData: any = [];
  token: any;
  recordhistory: any = [];
  preAuth: any;
  preAuthdata: any;
  check: boolean = false;
  ispreAuthLength: boolean = true;
  tableData: any = [];
  item: any = [];
  itemvalue: any;
  isTableData: boolean;
  desc: any;
  URN: any;
  AUTHORIZEDCODE: any;
  HOSPITALCODE: any;
  actiontable: any = [];
  isactiontable: boolean = false;
  urn: any
  claimlist1: any;
  actualdate: any;
  txnid: any;
  urnNUmber: any
  hospitalCodenumber: any
  authorizedcodenumber: any
  actiontable2: any = [];
  tableDatalength: any;
  tracking: any;
  datavalue: any;
  query: boolean = false;
  caseno: string;
  claimno: string;
  hopitalclmcaseno: string;
  hidedocs: boolean;
  hidedocsdata: any;
  constructor(public paid: PaidServiceService, private cpdService: CreatecpdserviceService, private jwtService: JwtService,
    private route: Router, public headerService: HeaderService, private SnoCLaimDetailsServ: SnoCLaimDetailsService, private dynamicservice: DynamicreportService) { }

  ngOnInit(): void {
    this.caseno = localStorage.getItem("caseno");
    this.claimno = localStorage.getItem("claimno");
    this.hidedocsdata = localStorage.getItem("hidedocs");
    this.hopitalclmcaseno = localStorage.getItem("hopitalclmcaseno");
    this.headerService.setTitle('Discharge List Report History');
    this.trackingdetails();
    this.ongetpreAuthdata();
    this.getremark();
  }
  trackingdetails() {
    this.tracking = JSON.parse(localStorage.getItem("history"));
    this.paid.gettrackingdetails(this.tracking.txnid).subscribe((data) => {
      this.item = data;
      this.itemvalue = this.item[0];
      console.log(JSON.stringify(this.itemvalue));
      if (this.hidedocsdata == 'hidedocs') {
        console.log("inside hidedocs");
        this.hidedocs = false;
      } else {
        console.log("ouside hidedocs");
        this.hidedocs = true;
      }
    })
  }
  treatmentdetails() {
    localStorage.setItem("urn", this.item.URN)
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/treatmenthistory'); });
  }
  ongetpreAuthdata() {
    var URNnumber = this.tracking.urn;
    var Authroziedcode = this.tracking.authcode;
    var Hospitalcode = this.tracking.hospitalcode;
    console.log(URNnumber, Authroziedcode, Hospitalcode);
    this.cpdService.getPreAuthHistory(URNnumber, Authroziedcode, Hospitalcode).subscribe(data => {
      this.preAuth = data;
      this.datavalue = this.preAuth.preAuthLogList;
      if (this.preAuth.preAuthLogList.length > 0) {
        this.query = true;
      } else {
        this.query = false;
      }
    },
      error => {
        console.log("error", error);
      }
    );
  }
  preauthLogDetails(urn: any, authCode: any, hospitalCode: any) {
    localStorage.setItem("urn", urn);
    localStorage.setItem("authorizedCode", authCode);
    localStorage.setItem("hospitalCode", hospitalCode);
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/preauthhistory'); });
  }
  downloadActionforDischarge(event: any, fileName: any, hospitalCode: any, dateOfAdm: any) {
    let target = event.target;
    console.log(target.nodeName);
    console.log(dateOfAdm);
    // /07-02-2019
    let dateofadminssion=this.Dateconvert(dateOfAdm);
    console.log(dateofadminssion);
    if ((target.nodeName == "A" || target.nodeName == "a") || (target.nodeName == "IMG" || target.nodeName == "img") || (target.nodeName == "I" || target.nodeName == "i")) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (fileName != null) {
        this.SnoCLaimDetailsServ.downloadFiles(fileName, hospitalCode, dateofadminssion).subscribe(
          (response: any) => {
            var result = response;
            let blob = new Blob([result], { type: result.type });
            let url = window.URL.createObjectURL(blob);
            window.open(url);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  }
  claimLog; any = [];
  getremark() {
    this.dynamicservice.getremark(this.tracking.txnid).subscribe((data: any) => {
      console.log(data);
      this.claimLog = data.meactionlog;
    },
      (error) => console.log(error)
    );
  }
  Dateconvert(date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MM-yyyy');
  }
}
