import { Component, OnInit } from '@angular/core';
import { TrackingTransistServiceService } from '../../Services/tracking-transist-service.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { JwtService } from 'src/app/services/jwt.service';
import { Router } from '@angular/router';
import { CreatecpdserviceService } from '../../Services/createcpdservice.service';
import { TreatmenthistoryperurnService } from '../../Services/treatmenthistoryperurn.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-oldclaimtrackingdetails',
  templateUrl: './oldclaimtrackingdetails.component.html',
  styleUrls: ['./oldclaimtrackingdetails.component.scss']
})
export class OldclaimtrackingdetailsComponent implements OnInit {

  dataDisplay:any;
  transid: any;
  authorizedcode:any;
  hospitalcode:any;
  trtData: any = [];
  token: any;
  recordhistory:any=[];
  preAuth: any;
  preAuthdata: any;
  check: boolean = false;

  ispreAuthLength: boolean=true;
  tableData: any=[];
  item: any=[];
  isTableData: boolean;
  desc:any;
  URN:any;
  AUTHORIZEDCODE:any;
  HOSPITALCODE:any;
  actiontable:any=[];
  isactiontable: boolean=false;
  urn:any
  claimlist1: any;
  actualdate:any;
  txnid:any;
  urnNUmber:any
  hospitalCodenumber:any
  authorizedcodenumber:any
  actiontable2: any=[];
  tableDatalength: any;
  tracking:any;
  // ispreAuthLength:boolean=true;
  user:any;
  treatmentHistoryList: any = [];
  oldTreatmentHistoryList: any = [];
  refundedBy: any;
  groupId: any;

  constructor(private trackingtransistReport:TrackingTransistServiceService,
    public snoservice: SnoCLaimDetailsService,
    private jwtService: JwtService,
    private route:Router,
    private treatmenthistoryperurn: TreatmenthistoryperurnService,
    private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.user =this.sessionService.decryptSessionData("user");
    console.log(this.user);
    this.groupId=this.user.groupId;
    this.tracking = JSON.parse(localStorage.getItem("trackingdetails"));
    this.transid = localStorage.getItem("claimid")
    this.token = localStorage.getItem("token");
    this.urn=this.tracking.Urn;
    this.trackingdetails();
    $("#appealDisposal").hide();
  }


  preAuthLogDetails(urn, authCode, hosCode) {
    let authCodes = authCode;
    localStorage.setItem('urn', urn);
    localStorage.setItem('authorizedCode', authCodes);
    localStorage.setItem('hospitalCode', hosCode);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/preauthhistory');
    });
  }
  claimDetails: any;
  claimLog: any;
  trackingdetails(){
    this.snoservice.getOldClaimTrackingById(this.transid).subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          let details = JSON.parse(resData.details);
          this.claimDetails = details.actionData;
          console.log(this.claimDetails);
          this.claimLog = details.actionLog;
          this.preAuth = details.preAuthHist;
          // console.log(this.preAuth);
          if (this.preAuth.length != 0) {
            this.check = true;
          }
          // this.getTreatMentHistory();
          this.getOldTreatMentHistory();
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  downloadAction(event: any, fileName: any, hCode: any, dateOfAdm: any) {
    let target = event.target;
    //console.log(target.nodeName);
    if (
      target.nodeName == 'A' ||
      target.nodeName == 'a' ||
      target.nodeName == 'IMG' ||
      target.nodeName == 'img' ||
      target.nodeName == 'I' ||
      target.nodeName == 'i' ||
      target.nodeName == 'SPAN' ||
      target.nodeName == 'span'
    ) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (fileName != null) {
        // let img = this.snoService.downloadFile(fileName, hCode, dateOfAdm);
        // window.open(img, '_blank');
        this.snoservice.downloadFiles(fileName, hCode, dateOfAdm).subscribe(
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
  OlddownloadAction(event: any, fileName: any, hCode: any, year: any) {
    let target = event.target;
    if (
      target.nodeName == 'A' ||
      target.nodeName == 'a' ||
      target.nodeName == 'IMG' ||
      target.nodeName == 'img' ||
      target.nodeName == 'I' ||
      target.nodeName == 'i' ||
      target.nodeName == 'SPAN' ||
      target.nodeName == 'span'
    ) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (fileName != null) {
        this.snoservice.downloadOldFiles(fileName, hCode, year).subscribe(
          (response: any) => {
            var result = response;
            let blob = new Blob([result],{ type: result.type});
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
  oldTrtData:any;
  getOldTreatMentHistory() {
    let urno = this.urn;
    this.treatmenthistoryperurn.oldsearchbyUrnSnaUser(urno,this.user.userId).subscribe(data => {
      this.oldTrtData = data;
      if (this.oldTrtData.length > 3) {
        document.getElementById('oldTreatmentTable').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');
      }
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  dtls: any;
  viewDescription(descriptinDtls) {
    this.dtls = descriptinDtls;
    $("#appealDisposal").show();
  }
  modalClose() {
    $("#appealDisposal").hide();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
}
