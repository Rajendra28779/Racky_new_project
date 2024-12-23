import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { CreatecpdserviceService } from '../../Services/createcpdservice.service';
import { DynamicreportService } from '../../Services/dynamicreport.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { TreatmenthistoryperurnService } from '../../Services/treatmenthistoryperurn.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-dynamicreportclaimdetails',
  templateUrl: './dynamicreportclaimdetails.component.html',
  styleUrls: ['./dynamicreportclaimdetails.component.scss']
})
export class DynamicreportclaimdetailsComponent implements OnInit {
  childmessage: any;
  claimDetails: any;
  allremarks: any;
  txnId: any;
  fileUrl: any;
  claimLog: Array<any> = [];
  pendingAt: any;
  claimStatus: any;
  user: any;
  routeFlag: any;
  urnNo: any;
  preAuth: any = [];
  packageCode: any;
  maxChars = 1000;
  check: boolean = false;
  isQuery: boolean = false;
  isReject: boolean = false;
  isInvestigate: boolean = false;
  isRevert: boolean = false;
  isApproved: boolean = false;
  isHold: boolean = false;
  data: any;
  requestdata: any;
  Redirection: any;
  keyword = 'remarks';
  treat: string;
  treatment: string;
  reconsider: string;
  trtData: any = [];
  oldTrtData: any = [];
  wardimplmenthighenddrugs: any = [];
  highEndDrugList: any = [];
  implantDataList: any = [];
  wardDataList: any = [];
  cpdActionLog: any = [];
  triggerflag: any;
  showage: any;
  highEndDrugTotalPrice: any;
  implantTotalPrice: any;
  implantTotalUnitPrice: any;
  implantTotalUnit: any;
  systemadminsnarejetedroutingvalue: String;
  collapse: string = 'Collapse All';
  vitalArray: any = [];
  posdetails: any = [];
  otpdetaiils: any = [];
  irisdetails: any = [];
  isDisch: boolean = false;
  preAuthHistory: any = [];
  firstList: any = [];
  selectedRemarks: any = [];
  selected: any = [];
  final: any = [];
  description: string = '';
  claimid: any;
  constructor(
    private jwtService: JwtService,
    public headerService: HeaderService,
    public route: Router,
    public snoService: SnoCLaimDetailsService,
    private cpdService: CreatecpdserviceService,
    private treatmenthistoryperurn: TreatmenthistoryperurnService,
    private dynamicservice: DynamicreportService,
    private sessionService: SessionStorageService
  ) {
    //console.log(this.route.getCurrentNavigation().extras.state);
    // this.URN=this.route.getCurrentNavigation().extras.state['Urn'];
    // this.txnId = this.route.getCurrentNavigation().extras.state['transactionId'];
    // this.routeFlag = this.route.getCurrentNavigation().extras.state['flag'];
    // this.urnNo = this.route.getCurrentNavigation().extras.state['URN'];
    // this.packageCode = this.route.getCurrentNavigation().extras.state['packageCode'];
  }

  // active inactive class
  isActiveDischarge: string = "";
  isActiveBlocking: string = "active";

  toggleActive(elementName: string): void {
    if (elementName == "Blocking") {
      this.isActiveDischarge = "";
      this.isActiveBlocking = "active"
    }

    if (elementName == "Discharge") {
      this.isActiveDischarge = "active";
      this.isActiveBlocking = ""
    }
  }
  // active inactive class

  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem('actionData'));
    this.requestdata = this.sessionService.decryptSessionData("requestData");
    this.treat = localStorage.getItem('treat');
    this.treatment = localStorage.getItem('treatment');
    // this.reconsider = localStorage.getItem('consider');
    let consider = localStorage.getItem('reconsider');
    this.systemadminsnarejetedroutingvalue = localStorage.getItem('Systemadminsnarejected');
    let hold = localStorage.getItem('hold');
    this.txnId = this.data.transactionId;
    this.claimid = this.data.claimid;
    this.routeFlag = this.data.flag;
    this.urnNo = this.data.URN;
    this.packageCode = this.data.packageCode;
    this.Redirection = this.data.Redirection;

    this.triggerflag = localStorage.getItem("flag");
    this.getnolist();
    if (this.triggerflag == 5 || this.triggerflag == 6 || this.triggerflag == 7) {
      this.showage = true;
    } else {
      this.showage = false;
    }
    // dynamic title

    this.headerService.setTitle('ME Trigger Claim Details');
    // this.getremark();
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.getRemarks();
    this.getSnoClaimDetailsById();
    this.user = this.sessionService.decryptSessionData("user");
    $('#appealDisposal').hide();
    if (consider == 'Y') {
      $('#Revert').hide();
    }
    if (this.requestdata.cpdFlag == '1') {
      this.isRevert = true;
    }

    if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
      document.getElementsByTagName("section")[0].className += " safari";
    }


  }

  nolist: any = [];
  getnolist() {
    for (let i = 1; i <= 125; i++) {
      this.nolist.push(i);
    }
  }
  approved_Amount(event: KeyboardEvent) {
    const pattern = /^[0-9\b]+$/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  multiPackList: any = [];
  multiPackListcaseno: any = [];
  multiFlag: boolean = false;
  multiFlagcase: boolean = false;
  backUpAmount: any;
  getSnoClaimDetailsById() {
    console.log('txnid->');
    console.log(this.txnId);
    this.snoService.getMultiPackage(this.txnId).subscribe(
      (data: any) => {
        let resData = data;
        //console.log(resData);
        if (resData.status == 'success') {
          let details = JSON.parse(resData.details);
          this.claimDetails = details.actionData;
          let procedureName = this.claimDetails.procedureName1;
          if (procedureName.length > 30) {
            $('#procedureNameId').text(procedureName.substring(0, 30) + '...');
            $('#showMoreId').empty();
            $('#showMoreId').append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
          } else {
            $('#procedureNameId').text(procedureName);
          }
          console.log(this.claimDetails);
          this.claimLog = details.actionLog;
          this.cpdActionLog = details.cpdActionLog;
          this.vitalArray = details.vitalArray;
          let multiPkg = details.packageBlock;
          let multipackcasen = details.multipackagecaseno;
          // this.backUpAmount = this.claimDetails.TOTALAMOUNTBLOCKED;
          console.log(details.actionData);
          console.log(details.actionLog);
          console.log(details.packageBlock);
          console.log(details.vitalArray);
          if (
            details.actionData.pendingat == 3 &&
            details.actionData.claimstatus == 1
          ) {
            this.isApproved = true;
          }
          else {
            this.isApproved = false;
          }

          if (
            details.actionData.pendingat == 3 &&
            details.actionData.claimstatus == 2
          ) {
            this.isReject = true;
          } else {
            this.isReject = false;
          }

          multiPkg.forEach((item) => {
            if (item.transctionId != this.txnId) {
              this.multiPackList.push(item);
            }
          });
          if (this.multiPackList.length > 0) {
            this.multiFlag = true;
          }
          //chnages multipackages data for case number
          multipackcasen.forEach((item) => {
            if (item.transctionId != this.txnId) {
              this.multiPackListcaseno.push(item);
            }
          });
          if (this.multiPackListcaseno.length > 0) {
            this.multiFlagcase = true;
          }
          this.preAuth = details.preAuthHist;
          console.log(this.preAuth);
          if (this.preAuth.length != 0) {
            this.check = true;
          }
          let prteLog = details.preAuthLog;
          console.log('log-> ');
          console.log(prteLog);
          if (prteLog.length > 0) {
            let prteAuth = prteLog[0];
            let prteAuth1: any = {}
            prteAuth1.actionType = 'Hospital Request';
            prteAuth1.actionOn = prteAuth?.REQUESTDATE;
            prteAuth1.remarks = '--';
            prteAuth1.description = prteAuth?.HOSPITALREQUESTDESCRIPTION;
            prteAuth1.amount = prteAuth?.REQUESTAMOUNT;
            prteAuth1.document = prteAuth?.DOC1;
            prteAuth1.sdate = prteAuth?.sdate;
            prteAuth1.hospitaluploaddate = prteAuth?.hospitaluploaddate;
            if (prteAuth?.REQUESTDATE != '--') {
              this.preAuthHistory.push(prteAuth1);
            }
            let prteAuth2: any = {}
            prteAuth2.actionType = 'SNA First Query';
            prteAuth2.actionOn = prteAuth?.QUERY1DATE;
            prteAuth2.remarks = prteAuth?.SNAQUERY1REMARK;
            prteAuth2.description = prteAuth?.SNAQUERY1DESCRIPTION;
            prteAuth2.amount = '--';
            prteAuth2.document = '--';
            prteAuth2.sdate = prteAuth?.sdate;
            prteAuth2.hospitaluploaddate = prteAuth?.hospitaluploaddate;
            if (prteAuth?.QUERY1DATE != '--') {
              this.preAuthHistory.push(prteAuth2);
            }
            let prteAuth3: any = {}
            prteAuth3.actionType = 'First Query Reply By Hospital';
            prteAuth3.actionOn = prteAuth?.QUERYREPLAYBYHOSDATE1;
            prteAuth3.remarks = '--';
            prteAuth3.description = prteAuth?.QUERYREPLAYBYHOS1;
            prteAuth3.amount = '--';
            prteAuth3.document = prteAuth?.DOC2;
            prteAuth3.sdate = prteAuth?.sdate;
            prteAuth3.hospitaluploaddate = prteAuth?.hospitaluploaddate;
            if (prteAuth?.QUERYREPLAYBYHOSDATE1 != '--') {
              this.preAuthHistory.push(prteAuth3);
            }
            let prteAuth4: any = {}
            prteAuth4.actionType = 'SNA Second Query';
            prteAuth4.actionOn = prteAuth?.QUERY2DATE;
            prteAuth4.remarks = prteAuth?.SNAQUERY2REMARK;
            prteAuth4.description = prteAuth?.MOREDOCSDESCRIPTION2;
            prteAuth4.amount = '--';
            prteAuth4.document = '--';
            prteAuth4.sdate = prteAuth?.sdate;
            prteAuth4.hospitaluploaddate = prteAuth?.hospitaluploaddate;
            if (prteAuth?.QUERY2DATE != '--') {
              this.preAuthHistory.push(prteAuth4);
            }
            let prteAuth5: any = {}
            prteAuth5.actionType = 'Second Query Reply By Hospital';
            prteAuth5.actionOn = prteAuth?.QUERYREPLAYBYHOSDATE2;
            prteAuth5.remarks = '--';
            prteAuth5.description = prteAuth?.QUERYREPLAYBYHOS2;
            prteAuth5.amount = '--';
            prteAuth5.document = prteAuth?.DOC3;
            prteAuth5.sdate = prteAuth?.sdate;
            prteAuth5.hospitaluploaddate = prteAuth?.hospitaluploaddate;
            if (prteAuth?.QUERYREPLAYBYHOSDATE2 != '--') {
              this.preAuthHistory.push(prteAuth5);
            }
            let prteAuth6: any = {}
            prteAuth6.actionType = 'SNA Final Action';
            prteAuth6.actionOn = prteAuth?.APPROVEDDATE;
            prteAuth6.remarks = prteAuth?.SNAREMARK;
            prteAuth6.description = prteAuth?.SNADESCRIPTION;
            prteAuth6.amount = prteAuth?.APPROVEDAMOUNT;
            prteAuth6.document = '--';
            prteAuth6.sdate = prteAuth?.sdate;
            prteAuth6.hospitaluploaddate = prteAuth?.hospitaluploaddate;
            if (prteAuth?.APPROVEDDATE != '--') {
              this.preAuthHistory.push(prteAuth6);
            }
          }
          console.log(this.preAuthHistory);
          // this.claimLog.shift();
          // this.cpdService.getPreAuthHistory(this.urnNo, this.claimDetails.AUTHORIZEDCODE, this.claimDetails.HOSPITALCODE).subscribe((authData: any) => {
          //   this.preAuth = authData;
          //   console.log(this.preAuth);
          //   if (this.preAuth.length != 0) {
          //     this.check = true;
          //   }
          // })
          // localStorage.removeItem('reconsider');
          this.getPackageDetailsInfoList();
          this.getTreatMentHistory();
          this.getOldTreatMentHistory();
          this.getTreatmentHistoryoverpackgae();
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
  getTreatMentHistory() {
    this.treatmenthistoryperurn.searchbyUrnSnaUser(this.urnNo, this.user.userId).subscribe(data => {
      this.trtData = data;
      console.log(this.trtData);
      // if (this.trtData.length > 3) {
      //   document.getElementById('treatmentTable').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');
      // }
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  getOldTreatMentHistory() {
    let urno = this.urnNo;
    this.treatmenthistoryperurn.oldsearchbyUrnSnaUser(urno, this.user.userId).subscribe(data => {
      this.oldTrtData = data
      // if (this.oldTrtData.length > 3) {
      //   document.getElementById('oldTreatmentTable').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');
      // }
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  getRemarks() {
    this.snoService.getRemarks().subscribe(
      (data1: any) => {
        let remarkData = data1;
        this.allremarks = remarkData;
        // this.firstList = this.allremarks;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  documnetname: any = [];
  downloadAction(event: any, fileName: any, hCode: any, dateOfAdm: any) {
    this.documnetname = [];
    this.documnetname.push(fileName);
    this.documentstatus = 0;
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
        // let img = this.snoService.downloadFile(fileName, hCode, dateOfAdm);
        // window.open(img, '_blank');
        this.snoService.downloadFiles(fileName, hCode, dateOfAdm).subscribe(
          (response: any) => {
            var result = response;
            let blob = new Blob([result], { type: result.type });
            let url = window.URL.createObjectURL(blob);
            window.open(url);
            this.DocumnetLog();
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  }
  remarks: any;
  amount: any;
  claimAmout: any;
  actionRemarkId: any;
  submitDetails() {
    let remark = $('#remarks').val();
    let year = $('#year').val();
    // let month=$('#month').val();
    let month = "";
    if (year == undefined) { year = ""; }
    // if(month==undefined){month="";}
    if (remark == null || remark == "" || remark == undefined) {
      this.swal("Info", "Please Enter Remark", 'info');
      return;
    }
    let flag
    if (this.routeFlag == 1 || this.routeFlag == 3) {
      flag = localStorage.getItem("flag");
    } else {
      flag = 0
    }

    Swal.fire({
      title: 'Are you sure?',
      text: this.swal1,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.swal2
    }).then((result) => {
      if (result.isConfirmed) {
        this.dynamicservice.sumbitmeremark(this.txnId, remark, this.user.userId, this.urnNo, this.claimid, flag, year, month).subscribe((data: any) => {
          console.log(data);
          if (data.status == 200) {
            this.swal("Success", data.message, 'success');
            if (this.routeFlag == 1) {
              this.route.navigate(['/application/mereportdetails']);
            } else if (this.routeFlag == 2){
              this.route.navigate(['/application/mecasespecificremark']);
            }else{
              this.route.navigate(['/application/meactiontakenlist']);
            }
          } else {
            this.swal("Error", data.message, 'error');
          }
        },
          (error) => console.log(error)
        );
      }
    });
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  treatmentdetails() {
    localStorage.setItem('urn', this.urnNo);
    localStorage.setItem('transactionDetailsId', this.txnId);
    localStorage.setItem('userId', this.user.userId);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/treatmenthistoryforsna');
    });
  }
  Oldtreatmentdetails() {
    localStorage.setItem('urn1', this.urnNo);
    localStorage.setItem('transactionDetailsId1', this.txnId);
    localStorage.setItem('userId1', this.user.userId);
    localStorage.setItem('token1', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/Oldtreatmenthistoryforsna');
    });
  }
  clearEvent() {
    this.actionRemarkId = '';
  }
  preAuthLogDetail(urn: any, authCode: any, hosCode: any) {
    // let authCodes = authCode.slice(2);
    localStorage.setItem('urn', urn);
    localStorage.setItem('authorizedCode', authCode);
    localStorage.setItem('hospitalCode', hosCode);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/preauthhistory');
    });
  }
  dtls: any;
  viewDescription(descriptinDtls) {
    this.dtls = descriptinDtls;
    $('#appealDisposal').show();
  }
  packagedetails() {
    // localStorage.setItem("click1", "Y");
    let urnNo = this.urnNo;
    let packagecode = this.packageCode;
    localStorage.setItem('urn', urnNo);
    localStorage.setItem('packagecode', packagecode);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/treatmenthistorypackage');
    });
  }
  modalClose() {
    $('#appealDisposal').hide();
  }
  multiPackageDetails(
    URN: any,
    authorizedcode: any,
    hospitalCodeOne: any,
    transactionDtlsID: any
  ) {
    localStorage.setItem('urn', URN);
    localStorage.setItem('authorizedCode', authorizedcode);
    localStorage.setItem('hospitalCode', hospitalCodeOne);
    localStorage.setItem('transactionID', transactionDtlsID);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/multipackageblock');
    });
  }
  getId(item) {
    let id = item.id;
    this.actionRemarkId = id;
    // let id = $('#actionRemark').val();
    if (id == 1) {
      this.isQuery = true;
      this.isReject = true;
      this.isInvestigate = true;
      this.isRevert = true;
      this.isHold = true;
      this.isApproved = false;
      // $('#amount').val(this.backUpAmount);
      $('#amount').prop('disabled', false);
    } else if (id == 58) {
      this.isQuery = true;
      this.isApproved = true;
      this.isInvestigate = true;
      this.isRevert = true;
      this.isHold = true;
      this.isReject = false;
      $('#amount').val(0);
      $('#amount').prop('disabled', true);
    } else {
      this.isApproved = false;
      this.isQuery = false;
      this.isReject = false;
      this.isInvestigate = false;
      this.isRevert = false;
      this.isHold = false;
      // $('#amount').val(this.backUpAmount);
      $('#amount').prop('disabled', false);
    }
    if (this.description.length === 0) {
      this.description = this.toProperCase(item.remarks);
    } else {
      this.description = this.description + ', ' + this.toProperCase(item.remarks);
    }
  }

  toProperCase(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  };

  addToList() {
    for (var i = 0; i < this.selected.length; i++) {
      var id = this.selected[i];
      for (var j = 0; j < this.firstList.length; j++) {
        var rem = this.firstList[j];
        if (rem.id == id) {
          this.selectedRemarks.push(rem);
          this.selectedRemarks.sort((a, b) => (a.id < b.id ? -1 : 1));
          var index = this.firstList.indexOf(rem);
          if (index !== -1) {
            this.firstList.splice(index, 1);
          }
        }
      }
    }
    console.log(this.selectedRemarks);
  }

  removeFromList() {
    for (var i = 0; i < this.final.length; i++) {
      var id = this.final[i];
      for (var j = 0; j < this.selectedRemarks.length; j++) {
        var rem = this.selectedRemarks[j];
        if (rem.id == id) {
          this.firstList.push(rem);
          this.firstList.sort((a, b) => (a.id < b.id ? -1 : 1));
          var index = this.selectedRemarks.indexOf(rem);
          if (index !== -1) {
            this.selectedRemarks.splice(index, 1);
          }
        }
      }
    }
    console.log(this.firstList);
  }

  keyPress(event: KeyboardEvent) {
    // const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    // const pattern = /^[A-Za-z0-9.,#%<>()-_ \\s]+$/;
    const pattern = /'/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    // if (!pattern.test(inputChar)) {
    if (pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  fileArray: any = [];
  downloadAllFile(dischargeSlip, additionaldoc, additionaldoc1, additionaldoc2) {
    this.fileArray = [];
    if (dischargeSlip != null || dischargeSlip != undefined) {
      let jsonObj = {
        'f': dischargeSlip,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.ACTUALDATEOFADMISSION
      }
      this.fileArray.push(jsonObj);
    }
    if (additionaldoc != null || additionaldoc != undefined) {
      let jsonObj = {
        'f': additionaldoc,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.ACTUALDATEOFADMISSION
      }
      this.fileArray.push(jsonObj);
    }
    if (additionaldoc1 != null || additionaldoc1 != undefined) {
      let jsonObj = {
        'f': additionaldoc1,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.ACTUALDATEOFADMISSION
      }
      this.fileArray.push(jsonObj);
    }
    if (additionaldoc2 != null || additionaldoc2 != undefined) {
      let jsonObj = {
        'f': additionaldoc2,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.ACTUALDATEOFADMISSION
      }
      this.fileArray.push(jsonObj);
    }
    this.snoService.downloadAllFiles(this.fileArray).subscribe(
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

  documentstatus: any;
  files: any = [];
  viewAllDocument(dischargeSlip, additionDoc, additionalDoc1, additionalDoc2, preSurgery, postSurgery, patientPic, intraSurgery, specimenRemoval) {
    this.files = [];
    this.documnetname = [];
    this.documentstatus = 1
    console.log("Inside View All Document");
    console.log("dischargeSlip: " + dischargeSlip);
    console.log("additionDoc: " + additionDoc);
    console.log("additionalDoc1: " + additionalDoc1);
    console.log("additionalDoc2: " + additionalDoc2);
    console.log("preSurgery: " + preSurgery);
    console.log("postSurgery: " + postSurgery);
    console.log("patientPic: " + patientPic);
    console.log("intraSurgery: " + intraSurgery);
    console.log("specimenRemoval: " + specimenRemoval);


    if (dischargeSlip != null || dischargeSlip != undefined) {
      this.documnetname.push(dischargeSlip);
      let jsonObj = {
        'f': dischargeSlip,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }
    if (additionDoc != null || additionDoc != undefined) {
      this.documnetname.push(additionDoc);
      let jsonObj = {
        'f': additionDoc,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }
    if (additionalDoc1 != null || additionalDoc1 != undefined) {
      this.documnetname.push(additionalDoc1);
      let jsonObj = {
        'f': additionalDoc1,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }
    if (additionalDoc2 != null || additionalDoc2 != undefined) {
      this.documnetname.push(additionalDoc2);
      let jsonObj = {
        'f': additionalDoc2,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }

    if (preSurgery != null || preSurgery != undefined) {
      this.documnetname.push(preSurgery);
      let jsonObj = {
        'f': preSurgery,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }

    if (postSurgery != null || postSurgery != undefined) {
      this.documnetname.push(postSurgery);
      let jsonObj = {
        'f': postSurgery,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }

    if (patientPic != null || patientPic != undefined) {
      this.documnetname.push(patientPic);
      let jsonObj = {
        'f': patientPic,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);

      if (intraSurgery != null || intraSurgery != undefined) {
        this.documnetname.push(intraSurgery);
        let jsonObj = {
          'f': intraSurgery,
          'h': this.claimDetails.HOSPITALCODE,
          'd': this.claimDetails.DATEOFADMISSION
        }
        this.files.push(jsonObj);
      }
    }

    if (specimenRemoval != null || specimenRemoval != undefined) {
      this.documnetname.push(specimenRemoval);
      let jsonObj = {
        'f': specimenRemoval,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }
    this.snoService.downloadAllDocuments(this.files).subscribe(data => {
      var result = data;
      let blob = new Blob([result], { type: result.type });
      let url = window.URL.createObjectURL(blob);
      window.open(url);
      this.DocumnetLog();
    });
  }
  getDetails(transactionId, claimId, claimRaiseStatus, urn, packagecode) {
    if (claimRaiseStatus == 1) {
      let trnsId = transactionId;
      let clmId = claimId;
      if (clmId != null || clmId != undefined) {
        let state = {
          Urn: urn
        }
        localStorage.setItem("claimid", clmId);
        localStorage.setItem("trackingdetails", JSON.stringify(state));
        localStorage.setItem("token", this.jwtService.getJwtToken());
        this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/trackingdetails'); });
      } else {
        localStorage.setItem("trnsId", trnsId);
        this.route.navigate(['/treatmentinfo']);
      }
    }
    if (claimRaiseStatus == 0) {
      let state = {
        txnid: transactionId,
        //  authcode:authorizedcode,
        //  hospitalcode:hospitalcode,
        urn: urn
      }
      localStorage.setItem("history", JSON.stringify(state));
      localStorage.setItem("token", this.jwtService.getJwtToken())
      this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/dischargelistHistoryHospital'); });
    }
  }
  onAction(id: any, urn: any, packageCode: any, claimStatus: any, txnpackagedetailid: any) {
    let tempActionData = localStorage.getItem('actionData');
    localStorage.removeItem("submitStatus");
    if (claimStatus == 1) {
      let state = {
        transactionId: id,
        flag: 'APRV',
        URN: urn,
        packageCode: packageCode,
        txnpackagedetailid: txnpackagedetailid,
      };
      // localStorage.setItem('treat', 'Y');
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(environment.routingUrl + '/application/snoapproval/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          // localStorage.removeItem('submitStatus');
          window.location.reload();
        }
      }
    }
    if (claimStatus == 2) {
      let state = {
        transactionId: id,
        URN: urn,
        packageCode: packageCode,
        txnpackagedetailid: txnpackagedetailid,
      }
      // localStorage.setItem('treat', 'Y');
      localStorage.setItem("actionData", JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(environment.routingUrl + '/application/cpdrejectedaction/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          // localStorage.removeItem('submitStatus');
          window.location.reload();
        }
      }
    }
    if (claimStatus == 3) {
      let state = {
        transactionId: id,
        URN: urn,
        packageCode: packageCode,
        txnpackagedetailid: txnpackagedetailid,
      }
      localStorage.setItem("actionData", JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(environment.routingUrl + '/application/NonComplianceQueryCPDToSNA/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          window.location.reload();
        }
      }
    }
    if (claimStatus == 4) {
      let state = {
        transactionId: id,
        flag: 'REAPRV',
        URN: urn,
        packageCode: packageCode,
        txnpackagedetailid: txnpackagedetailid,
      };
      // localStorage.setItem('treat', 'Y');
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(environment.routingUrl + '/application/snoreapproval/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          // localStorage.removeItem('submitStatus');
          window.location.reload();
        }
      }
    }
    if (claimStatus == 7) {
      let state = {
        transactionId: id,
        URN: urn,
        packageCode: packageCode,
        txnpackagedetailid: txnpackagedetailid,
      };
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(environment.routingUrl + '/application/unProcessedClaimList/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          window.location.reload();
        }
      }
    }
    if (claimStatus == 9) {
      let state = {
        transactionId: id,
        flag: 'DC',
        URN: urn,
        packageCode: packageCode,
        txnpackagedetailid: txnpackagedetailid,
      };
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(environment.routingUrl + '/application/dcCompliance/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          window.location.reload();
        }
      }
    }
  }
  getPackageDetailsInfoList() {
    let txnpackagedetailid = this.claimDetails.txnPackageDetailId;
    console.log('here-> ' + txnpackagedetailid);
    this.cpdService.getPackageDetailsInfoList(txnpackagedetailid).subscribe(data => {
      let result: any = data;
      if (result != null && result.statusCode == 200) {
        this.highEndDrugList = result.highEndDrugList;
        this.implantDataList = result.implantDataList;
        this.wardDataList = result.wardDataList;
        this.highEndDrugTotalPrice = result.highEndDrugTotalPrice;
        this.implantTotalPrice = result.implantTotalPrice;
        this.implantTotalUnit = result.implantTotalUnit;
        this.implantTotalUnitPrice = result.implantTotalUnitPrice;
      }
    })
  }

  collapseAll() {
    if (this.collapse == 'Collapse All') {
      this.collapse = 'Expand All';
      // $('#collapseThree').hide();
    } else if (this.collapse == 'Expand All') {
      this.collapse = 'Collapse All';
      // $('#collapseThree').show();
    }
  }

  showProcedureName() {
    $('#procedureNameId').text(this.claimDetails.procedureName1);
    $('#showMoreId').empty()
    $('#showMoreId1').append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hideProcedureName() {
    let procedureName = this.claimDetails.procedureName1;
    if (procedureName.length > 30) {
      $('#procedureNameId').text(procedureName.substring(0, 30) + '...');
      $('#showMoreId1').empty()
      $('#showMoreId').empty();
      $('#showMoreId').append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  showPreDoc(id, text) {
    $('#preAuthDocId' + id).text(text);
    $('#showMoreId2' + id).empty()
    $('#showMoreId3' + id).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hidePreDoc(id, text) {
    if (text.length > 30) {
      $('#preAuthDocId' + id).text(text.substring(0, 30) + '...');
      $('#showMoreId3' + id).empty()
      $('#showMoreId2' + id).empty();
      $('#showMoreId2' + id).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  showClaimDoc(id, text) {
    $('#claimProcessDocId' + id).text(text);
    $('#showMoreId4' + id).empty()
    $('#showMoreId5' + id).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hideClaimDoc(id, text) {
    if (text.length > 30) {
      $('#claimProcessDocId' + id).text(text.substring(0, 30) + '...');
      $('#showMoreId5' + id).empty()
      $('#showMoreId4' + id).empty();
      $('#showMoreId4' + id).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  showPreDoc1(text) {
    $('#preAuthDocId').text(text);
    $('#showMoreId6').empty()
    $('#showMoreId7').append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hidePreDoc1(text) {
    if (text.length > 30) {
      $('#preAuthDocId').text(text.substring(0, 30) + '...');
      $('#showMoreId7').empty()
      $('#showMoreId6').empty();
      $('#showMoreId6').append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  showClaimDoc1(text) {
    $('#claimProcessDocId').text(text);
    $('#showMoreId8').empty()
    $('#showMoreId9').append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hideClaimDoc1(text) {
    if (text.length > 30) {
      $('#claimProcessDocId').text(text.substring(0, 30) + '...');
      $('#showMoreId9').empty()
      $('#showMoreId8').empty();
      $('#showMoreId8').append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  checkAmount() {
    let amountValue = $('#amount').val();
    let amount = Number(amountValue);
    let totalAmountClaimed = Number(this.claimDetails.TOTALAMOUNTCLAIMED);
    if (amount < totalAmountClaimed) {
      let lessAmount = totalAmountClaimed - amount;
      this.swal(
        '',
        'You are Entering ₹ ' + lessAmount + ' less amount than Hospital claim Amount.',
        'info'
      );
    }
  }
  pkgDetailsData: any = [];
  overAllDetailsData: any = [];
  // modalShow:boolean =false;
  getPackageDetails(packageCode, subPackageCode, procedureCode) {
    console.log(packageCode, subPackageCode, procedureCode, this.claimDetails.HOSPITALCODE);
    this.snoService.getPackageDetails(packageCode, subPackageCode, procedureCode, this.claimDetails.HOSPITALCODE).subscribe(
      (data: any) => {
        let resData = data;
        console.log(resData);
        if (resData.status == 'success') {
          let packgeInfo = resData.data;
          let overallInfo = resData.data1;
          this.pkgDetailsData = JSON.parse(packgeInfo);
          this.overAllDetailsData = JSON.parse(overallInfo);
          // this.pkgDetailsData = packgeInfo.packageInfo;
          // this.modalShow = true;
          console.log(this.pkgDetailsData);
          console.log(this.overAllDetailsData);
          // $("#packageDetailsModal").show();
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

  memberid: any
  urn: any
  hospitalcodedata: any
  getAuthenticationdetails(type: any) {
    if (type == 1) {
      this.isDisch = true;
    } else {
      this.isDisch = false;
    }
    this.memberid = this.claimDetails.MEMBERID;
    this.urn = this.claimDetails.URN;
    this.hospitalcodedata = this.claimDetails.HOSPITALCODE;
    this.snoService.getauthentocationdetails(this.urn, this.memberid, type, this.hospitalcodedata,this.claimDetails.claimCaseNo).subscribe(
      (data: any) => {
        let resData = data;
        console.log(resData);
        if (resData.status == 'success') {
          let details = resData.data;
          details = JSON.parse(details);
          this.posdetails = details.posdetails;
          this.otpdetaiils = details.otpdetaiils;
          this.irisdetails = details.irisdetails;
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
  hospitalcode: any
  overridedetails: any = []
  getOverridedetails(overridecode: any) {
    this.memberid = this.claimDetails.MEMBERID;
    this.urn = this.claimDetails.URN;
    this.hospitalcode = this.claimDetails.HOSPITALCODE;
    this.snoService.getOverridecodedetails(overridecode, this.memberid, this.urn, this.hospitalcode).subscribe(
      (data: any) => {
        let resData = data;
        console.log(resData);
        if (resData.status == 'success') {
          let results = resData.data;
          results = JSON.parse(results);
          this.overridedetails = results.overridecodedetails;
          console.log(this.overridedetails);
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
  data1: any;
  pagename: any
  userid: any
  insert: any
  DocumnetLog() {
    this.user = this.sessionService.decryptSessionData("user");
    this.pagename = "CPD Approved in SNA",
      this.userid = this.user.userId,
      this.data1 = {
        "urnumber": this.urnNo,
        "documnetname": this.documnetname,
        "claimid": this.claimDetails.CLAIMID,
        "userid": this.userid,
        "groupid": this.user.groupId,
        "documnetStatus": this.documentstatus,
        "pagenameAction": this.pagename,
      }
    this.cpdService.insertdocumnetstatus(this.data1).subscribe(
      (data: any) => {
        let resData = data;
        console.log(resData);
        this.insert = resData.data;
        if (this.insert.status == "success") {
          console.log("inserted successfully");
          this.documnetname = [];
        } else {
          console.log("something went worng at the time of documnet status submission");
        }
      }
    );
  }
  caseno: any
  claimno: any
  uidreferencenumber: any
  hscode: any
  totalnumberofpackage: any
  totalnumberofmember: any
  totalnumberofpackageforhospital: any
  totalnumberofmemberforhospital: any
  totalNoOfBloackedamount: any
  packageblockedforpatient: any
  sumofpackageblockedamount: any
  treatmentpackage: any = []
  getdata: any
  getTreatmentHistoryoverpackgae() {
    this.treatmentpackage = []
    this.hscode = this.claimDetails.HOSPITALCODE;
    this.caseno = this.claimDetails.claimCaseNo;
    this.uidreferencenumber = this.claimDetails.uidreferencenumber != undefined ? this.claimDetails.uidreferencenumber : '';
    this.dynamicservice.getmeTreatmentHistoryoverpackgae(this.txnId, this.urnNo, this.hscode, this.caseno, this.uidreferencenumber, this.user.userId).subscribe(
      (data: any) => {
        console.log(data);
        this.treatmentpackage = data;
        this.totalnumberofpackage = this.treatmentpackage[0].totalnumberofpackage;
        this.totalnumberofmember = this.treatmentpackage[0].totalnumberofmember;
        this.totalnumberofpackageforhospital = this.treatmentpackage[0].totalnumberofpackageforhospital;
        this.totalnumberofmemberforhospital = this.treatmentpackage[0].totalnumberofmemberforhospital;
        this.totalNoOfBloackedamount = this.treatmentpackage[0].totalNoOfBloackedamount;
        this.packageblockedforpatient = this.treatmentpackage[0].packageblockedforpatient;
        this.sumofpackageblockedamount = this.treatmentpackage[0].sumofpackageblockedamount;
      }
    );
  }

  remark: any;
  showremark: boolean = true;
  snaname: any;
  swal1: any="You want to Submit it!";
  swal2: any="Yes, Submit it!";
  desablebtn: any;
  year: any = "";
  month: any = "";
  getremark() {
    this.dynamicservice.getremark(this.txnId).subscribe((data: any) => {
      console.log(data);
      this.snaname = data.snaname;
      if (data.status == 200) {
        this.remark = data.message;
        this.showremark = false;
        this.year = data.year;
        if (this.year == null) { this.year = ""; }
        // this.month=data.month;
      } else {
        this.remark = "";
        this.showremark = true;

      }
      if (this.showremark == false) {
        this.swal1 = "You want to Update it!";
        this.swal2 = "Yes, Update it!";
        if (this.triggerflag == 1 || this.triggerflag == 6 || this.triggerflag == 4) {
          this.desablebtn = true;
        } else {
          this.desablebtn = false;
        }
      } else {
        this.swal1 = "You want to Submit it!"
        this.swal2 = "Yes, Submit it!"
      }
    },
      (error) => console.log(error)
    );
  }
}


