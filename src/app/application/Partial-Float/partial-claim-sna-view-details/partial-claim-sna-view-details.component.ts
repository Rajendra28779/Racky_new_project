import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { HeaderService } from '../../header.service';
import { Router } from '@angular/router';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { CreatecpdserviceService } from '../../Services/createcpdservice.service';
import { TreatmenthistoryperurnService } from '../../Services/treatmenthistoryperurn.service';
import { DynamicreportService } from '../../Services/dynamicreport.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { PartiallfloatserviceService } from '../../Services/partiallfloatservice.service';
declare let $: any;

@Component({
  selector: 'app-partial-claim-sna-view-details',
  templateUrl: './partial-claim-sna-view-details.component.html',
  styleUrls: ['./partial-claim-sna-view-details.component.scss']
})
export class PartialClaimSnaViewDetailsComponent implements OnInit {
  childmessage: any;
  claimDetails: any;
  allremarks: any;
  txnId: any;
  claimLog: Array<any> = [];
  user: any;
  urnNo: any;
  preAuth: any = [];
  packageCode: any;
  maxChars = 1000;
  check: boolean = false;
  showsnamor: boolean = false;
  data: any;
  requestdata: any;
  keyword = 'remarks';
  treat: string;
  trtData: any = [];
  oldTrtData: any = [];
  highEndDrugList: any = [];
  implantDataList: any = [];
  wardDataList: any = [];
  cpdActionLog: any = [];
  highEndDrugTotalPrice: any;
  implantTotalPrice: any;
  implantTotalUnitPrice: any;
  implantTotalUnit: any;
  collapse: string = 'Collapse All';
  vitalArray: any = [];
  posdetails: any = [];
  otpdetaiils: any = [];
  irisdetails: any = [];
  facedetails: any = [];
  isDisch: boolean = false;
  preAuthHistory: any = [];
  final: any = [];
  description: string = '';
  cardBalanceDetails: any = [];
  partialclaimdetails:any;
  partialclaimlog:any=[];
  constructor(
    private jwtService: JwtService,
    public headerService: HeaderService,
    public route: Router,
    public snoService: SnoCLaimDetailsService,
    private cpdService: CreatecpdserviceService,
    private treatmenthistoryperurn: TreatmenthistoryperurnService,
    private service: DynamicreportService,
    private sessionService: SessionStorageService,
    public partialclaimserv:PartiallfloatserviceService,
  ) {}

  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem('actionData'));
    this.requestdata = this.sessionService.decryptSessionData('requestData');
    this.treat = localStorage.getItem('treat');
    this.txnId = this.data.transactionId;
    this.urnNo = this.data.URN;
    this.headerService.setTitle('SNA Action Taken / Details');

    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.getSnoClaimDetailsById();
    this.user = this.sessionService.decryptSessionData('user');
    $('#appealDisposal').hide();
    $('#triggermodal').hide();
    if (
      navigator.userAgent.search('Safari') >= 0 &&
      navigator.userAgent.search('Chrome') < 0
    ) {
      document.getElementsByTagName('section')[0].className += ' safari';
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
  meTrigger: any = [];
  paymentDetails: any = [];
  getSnoClaimDetailsById() {
    this.snoService.partialClaimSnoDetails(this.txnId).subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          let details = JSON.parse(resData.details);
          this.claimDetails = details.actionData;
          console.log(this.claimDetails);
          this.partialclaimdata(this.claimDetails.CLAIMID);
          let procedureName = this.claimDetails.procedureName1;
          if (procedureName.length > 30) {
            $('#procedureNameId').text(procedureName.substring(0, 30) + '...');
            $('#showMoreId').empty();
            $('#showMoreId').append(
              '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
            );
          } else {
            $('#procedureNameId').text(procedureName);
          }
          this.claimLog = details.actionLog;
          this.cpdActionLog = details.cpdActionLog;
          this.vitalArray = details.vitalArray;
          let multiPkg = details.packageBlock;
          let multipackcasen = details.multipackagecaseno;
          this.cardBalanceDetails = details.cardBalanceArray;
          this.triggerList = details.meTrigger;
          this.paymentDetails = details.paymentDetails;
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
            // if (item.transctionId != this.txnId) {
            this.multiPackListcaseno.push(item);
            // }
          });
          if (this.multiPackListcaseno.length > 0) {
            this.multiFlagcase = true;
          }
          this.preAuth = details.preAuthHist;
          if (this.preAuth.length != 0) {
            this.check = true;
          }
          let prteLog = details.preAuthLog;
          if (prteLog.length > 0) {
            let prteAuth = prteLog[0];
            let prteAuth1: any = {};
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
            let prteAuth2: any = {};
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
            let prteAuth3: any = {};
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
            let prteAuth4: any = {};
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
            let prteAuth5: any = {};
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
            let prteAuth6: any = {};
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
          this.getPackageDetailsInfoList();
          this.getTreatMentHistory();
          this.getOldTreatMentHistory();
          this.getTreatmentHistoryoverpackgae();
          this.getOnGoingTreatmenthistory();
          this.getCPDTrigger();
          this.patienttreatmentlog();
          this.getPatientTreatmentLogThroughProcedureCode();
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
    this.treatmenthistoryperurn
      .searchbyUrnSnaUser(this.urnNo, this.user.userId)
      .subscribe(
        (data) => {
          this.trtData = data;
          // if (this.trtData.length > 3) {
          //   document.getElementById('treatmentTable').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');
          // }
        },
        (error) => {
          console.log(error);
          this.swal('', 'Something went wrong.', 'error');
        }
      );
  }
  getOldTreatMentHistory() {
    let urno = this.urnNo;
    this.treatmenthistoryperurn
      .oldsearchbyUrnSnaUser(urno, this.user.userId)
      .subscribe(
        (data) => {
          this.oldTrtData = data;
          // if (this.oldTrtData.length > 3) {
          //   document.getElementById('oldTreatmentTable').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');
          // }
        },
        (error) => {
          console.log(error);
          this.swal('', 'Something went wrong.', 'error');
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
            this.documentLog();
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  }
  remarks: any;
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });

  amount: any;
  partialClaimAmout: any;
  pendingAt: any;
  claimStatus: any;
  submitDetails(event, claimId: any) {
    this.remarks = $('#remarks').val();
    this.amount = $('#amount').val();
    let userId = this.user.userId;
    this.partialClaimAmout = Number(this.claimDetails.diffAmount);
    if (this.remarks == '' || this.remarks == null) {
      this.swal('', 'Description should not be left blank', 'error');
      return;
    }
    if (this.remarks != '' && this.remarks != null) {
      const pattern = /'/;
      if (pattern.test(this.remarks)) {
        this.swal('', ' Special character is not allowed', 'error');
        return;
      }
    }

    if (event.target.id == 'Approve') {
      this.pendingAt = 3;
      this.claimStatus = 1;
    }
    if (event.target.id == 'Query') {
      this.pendingAt = 0;
      this.claimStatus = 4;
      this.amount = '0';
    }
    if (event.target.id == 'Reject') {
      this.pendingAt = 3;
      this.claimStatus = 2;
      this.amount = '0';
    }
    if (event.target.id == 'Approve') {
      if (Number(this.amount) == 0) {
        this.swal('Info', 'Approved amount should not be zero', 'info');
        return;
      }
    }
    if (event.target.id == 'Investigate') {
      this.pendingAt = 4;
      this.claimStatus = 6;
      this.amount = '0';
    }
    if (this.amount == '' || this.amount == null) {
      this.swal('', 'Amount should not be left blank', 'error');
      // $('#amount').val(this.backUpAmount);
      return;
    }
    if (this.amount > this.partialClaimAmout) {
      this.swal('', 'Amount should be less than claim amount', 'error');
      // $('#amount').val(this.backUpAmount);
      return;
    }
    let data = {
      claimId: claimId,
      userId: userId,
      remarks: this.remarks,
      amount: this.amount,
      pendingAt: this.pendingAt,
      claimStatus: this.claimStatus,
    };
    Swal.fire({
      title: '',
      text: 'Are you sure To ' + event.target.id + '?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.snoService.forwardSnoPartialClaim(data).subscribe(
          (data: any) => {
            if (data.status == 'Success') {
              if (event.target.id == 'Approve') {
                this.swal('Success', data.message, 'success');
              } else if (event.target.id == 'Query') {
                this.swal('Success', data.message, 'info');
              } else if (event.target.id == 'Reject') {
                this.swal('Success', data.message, 'success');
              } else if (event.target.id == 'Investigate') {
                this.swal('Success', data.message, 'success');
              }
              this.route.navigate(['/application/partialclaimraised']);
            } else if (data.status == 'Failed') {
              this.swal('Error', data.message, 'error');
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
    });
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
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

  modalClose() {
    $('#appealDisposal').hide();
    $('#triggermodal').hide();
  }
  multiPackageDetails(
    URN: any,
    authorizedcode: any,
    hospitalCodeOne: any,
    transactionDtlsID: any
  ) {
    //alert(URN+" "+authorizedcode+" "+hospitalCodeOne+" "+transactionDtlsID)
    localStorage.setItem('urn', URN);
    localStorage.setItem('authorizedCode', authorizedcode);
    localStorage.setItem('hospitalCode', hospitalCodeOne);
    localStorage.setItem('transactionID', transactionDtlsID);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/multipackageblock');
    });
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
  documentstatus: any;
  files: any = [];
  viewAllDocument(
    dischargeSlip,
    additionDoc,
    additionalDoc1,
    additionalDoc2,
    preSurgery,
    postSurgery,
    patientPic,
    intraSurgery,
    specimenRemoval,
    mortalityauditreport
  ) {
    this.files = [];
    this.documnetname = [];
    this.documentstatus = 1;
    if (dischargeSlip != null || dischargeSlip != undefined) {
      this.documnetname.push(dischargeSlip);
      let jsonObj = {
        f: dischargeSlip,
        h: this.claimDetails.HOSPITALCODE,
        d: this.claimDetails.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }
    if (additionDoc != null || additionDoc != undefined) {
      this.documnetname.push(additionDoc);
      let jsonObj = {
        f: additionDoc,
        h: this.claimDetails.HOSPITALCODE,
        d: this.claimDetails.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }
    if (additionalDoc1 != null || additionalDoc1 != undefined) {
      this.documnetname.push(additionalDoc1);
      let jsonObj = {
        f: additionalDoc1,
        h: this.claimDetails.HOSPITALCODE,
        d: this.claimDetails.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }
    if (additionalDoc2 != null || additionalDoc2 != undefined) {
      this.documnetname.push(additionalDoc2);
      let jsonObj = {
        f: additionalDoc2,
        h: this.claimDetails.HOSPITALCODE,
        d: this.claimDetails.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }

    if (preSurgery != null || preSurgery != undefined) {
      this.documnetname.push(preSurgery);
      let jsonObj = {
        f: preSurgery,
        h: this.claimDetails.HOSPITALCODE,
        d: this.claimDetails.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }

    if (postSurgery != null || postSurgery != undefined) {
      this.documnetname.push(postSurgery);
      let jsonObj = {
        f: postSurgery,
        h: this.claimDetails.HOSPITALCODE,
        d: this.claimDetails.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }

    if (patientPic != null || patientPic != undefined) {
      this.documnetname.push(patientPic);
      let jsonObj = {
        f: patientPic,
        h: this.claimDetails.HOSPITALCODE,
        d: this.claimDetails.DATEOFADMISSION,
      };
      this.files.push(jsonObj);

      if (intraSurgery != null || intraSurgery != undefined) {
        this.documnetname.push(intraSurgery);
        let jsonObj = {
          f: intraSurgery,
          h: this.claimDetails.HOSPITALCODE,
          d: this.claimDetails.DATEOFADMISSION,
        };
        this.files.push(jsonObj);
      }
    }
    if (specimenRemoval != null || specimenRemoval != undefined) {
      this.documnetname.push(specimenRemoval);
      let jsonObj = {
        f: specimenRemoval,
        h: this.claimDetails.HOSPITALCODE,
        d: this.claimDetails.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }
    if (mortalityauditreport != null || mortalityauditreport != undefined) {
      this.documnetname.push(mortalityauditreport);
      let jsonObj = {
        f: mortalityauditreport,
        h: this.claimDetails.HOSPITALCODE,
        d: this.claimDetails.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }
    this.snoService.downloadAllDocuments(this.files).subscribe((data) => {
      var result = data;
      let blob = new Blob([result], { type: result.type });
      let url = window.URL.createObjectURL(blob);
      window.open(url);
      this.documentLog();
    });
  }
  getDetails(transactionId, claimId, claimRaiseStatus, urn, packagecode) {
    if (claimRaiseStatus == 1) {
      let trnsId = transactionId;
      let clmId = claimId;
      if (clmId != null || clmId != undefined) {
        let state = {
          Urn: urn,
        };
        localStorage.setItem('claimid', clmId);
        localStorage.setItem('trackingdetails', JSON.stringify(state));
        localStorage.setItem('token', this.jwtService.getJwtToken());
        this.route.navigate([]).then((result) => {
          window.open(environment.routingUrl + '/trackingdetails');
        });
      } else {
        localStorage.setItem('trnsId', trnsId);
        this.route.navigate(['/treatmentinfo']);
      }
    }
    if (claimRaiseStatus == 0) {
      let state = {
        txnid: transactionId,
        //  authcode:authorizedcode,
        //  hospitalcode:hospitalcode,
        urn: urn,
      };
      localStorage.setItem('history', JSON.stringify(state));
      localStorage.setItem('token', this.jwtService.getJwtToken());
      this.route.navigate([]).then((result) => {
        window.open(environment.routingUrl + '/dischargelistHistoryHospital');
      });
    }
  }
  getPackageDetailsInfoList() {
    let txnpackagedetailid = this.claimDetails.txnPackageDetailId;
    this.cpdService
      .getPackageDetailsInfoList(txnpackagedetailid)
      .subscribe((data) => {
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
      });
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
    $('#showMoreId').empty();
    $('#showMoreId1').append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }

  hideProcedureName() {
    let procedureName = this.claimDetails.procedureName1;
    if (procedureName.length > 30) {
      $('#procedureNameId').text(procedureName.substring(0, 30) + '...');
      $('#showMoreId1').empty();
      $('#showMoreId').empty();
      $('#showMoreId').append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }

  showPreDoc(id, text) {
    $('#preAuthDocId' + id).text(text);
    $('#showMoreId2' + id).empty();
    $('#showMoreId3' + id).append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }

  hidePreDoc(id, text) {
    if (text.length > 30) {
      $('#preAuthDocId' + id).text(text.substring(0, 30) + '...');
      $('#showMoreId3' + id).empty();
      $('#showMoreId2' + id).empty();
      $('#showMoreId2' + id).append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }

  showClaimDoc(id, text) {
    $('#claimProcessDocId' + id).text(text);
    $('#showMoreId4' + id).empty();
    $('#showMoreId5' + id).append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }

  hideClaimDoc(id, text) {
    if (text.length > 30) {
      $('#claimProcessDocId' + id).text(text.substring(0, 30) + '...');
      $('#showMoreId5' + id).empty();
      $('#showMoreId4' + id).empty();
      $('#showMoreId4' + id).append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }

  showPreDoc1(text) {
    $('#preAuthDocId').text(text);
    $('#showMoreId6').empty();
    $('#showMoreId7').append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }

  hidePreDoc1(text) {
    if (text.length > 30) {
      $('#preAuthDocId').text(text.substring(0, 30) + '...');
      $('#showMoreId7').empty();
      $('#showMoreId6').empty();
      $('#showMoreId6').append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }

  showClaimDoc1(text) {
    $('#claimProcessDocId').text(text);
    $('#showMoreId8').empty();
    $('#showMoreId9').append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }

  hideClaimDoc1(text) {
    if (text.length > 30) {
      $('#claimProcessDocId').text(text.substring(0, 30) + '...');
      $('#showMoreId9').empty();
      $('#showMoreId8').empty();
      $('#showMoreId8').append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }

  pkgDetailsData: any = [];
  overAllDetailsData: any = [];
  // modalShow:boolean =false;
  getPackageDetails(packageCode, subPackageCode, procedureCode) {
    this.snoService
      .getPackageDetails(
        packageCode,
        subPackageCode,
        procedureCode,
        this.claimDetails.HOSPITALCODE
      )
      .subscribe(
        (data: any) => {
          let resData = data;
          if (resData.status == 'success') {
            let packgeInfo = resData.data;
            let overallInfo = resData.data1;
            this.pkgDetailsData = JSON.parse(packgeInfo);
            this.overAllDetailsData = JSON.parse(overallInfo);
            // this.pkgDetailsData = packgeInfo.packageInfo;
            // this.modalShow = true;
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

  memberid: any;
  urn: any;
  hospitalcodedata: any;
  getAuthenticationdetails(type: any) {
    if (type == 1) {
      this.isDisch = true;
    } else {
      this.isDisch = false;
    }
    this.memberid = this.claimDetails.MEMBERID;
    this.urn = this.claimDetails.URN;
    this.hospitalcodedata = this.claimDetails.HOSPITALCODE;
    this.snoService
      .getauthentocationdetails(
        this.urn,
        this.memberid,
        type,
        this.hospitalcodedata,
        this.claimDetails.claimCaseNo
      )
      .subscribe(
        (data: any) => {
          let resData = data;
          if (resData.status == 'success') {
            let details = resData.data;
            details = JSON.parse(details);
            this.posdetails = details.posdetails;
            this.otpdetaiils = details.otpdetaiils;
            this.irisdetails = details.irisdetails;
            this.facedetails = details.facedetails;
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
  hospitalcode: any;
  overridedetails: any = [];
  getOverrideDetails(overridecode: any) {
    this.memberid = this.claimDetails.MEMBERID;
    this.urn = this.claimDetails.URN;
    this.hospitalcode = this.claimDetails.HOSPITALCODE;
    this.snoService
      .getOverridecodedetails(
        overridecode,
        this.memberid,
        this.urn,
        this.hospitalcode
      )
      .subscribe(
        (data: any) => {
          let resData = data;
          if (resData.status == 'success') {
            let results = resData.data;
            results = JSON.parse(results);
            this.overridedetails = results.overridecodedetails;
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
  pagename: any;
  userid: any;
  insert: any;
  documentLog() {
    // this.user = JSON.parse(sessionStorage.getItem("user"))
    (this.pagename = 'CPD Approved in SNA'),
      (this.userid = this.user.userId),
      (this.data1 = {
        urnumber: this.urnNo,
        documnetname: this.documnetname,
        claimid: this.claimDetails.CLAIMID,
        userid: this.userid,
        groupid: this.user.groupId,
        documnetStatus: this.documentstatus,
        pagenameAction: this.pagename,
      });
    this.cpdService.insertdocumnetstatus(this.data1).subscribe((data: any) => {
      let resData = data;
      this.insert = resData.data;
      if (this.insert.status == 'success') {
        this.documnetname = [];
      } else {
        console.log(
          'something went worng at the time of documnet status submission'
        );
      }
    });
  }
  caseno: any;
  claimno: any;
  uidreferencenumber: any;
  hscode: any;
  totalnumberofpackage: any;
  totalnumberofmember: any;
  totalnumberofpackageforhospital: any;
  totalnumberofmemberforhospital: any;
  totalNoOfBloackedamount: any;
  packageblockedforpatient: any;
  sumofpackageblockedamount: any;
  treatmentpackage: any = [];
  getdata: any;
  getTreatmentHistoryoverpackgae() {
    this.treatmentpackage = [];
    this.hscode = this.claimDetails.HOSPITALCODE;
    this.caseno = this.claimDetails.claimCaseNo;
    this.uidreferencenumber =
      this.claimDetails.uidreferencenumber != undefined
        ? this.claimDetails.uidreferencenumber
        : '';
    this.snoService
      .getTreatmentHistoryoverpackgae(
        this.txnId,
        this.urnNo,
        this.hscode,
        this.caseno,
        this.uidreferencenumber,
        this.user.userId
      )
      .subscribe((data: any) => {
        this.treatmentpackage = data;
        this.totalnumberofpackage =
          this.treatmentpackage[0].totalnumberofpackage;
        this.totalnumberofmember = this.treatmentpackage[0].totalnumberofmember;
        this.totalnumberofpackageforhospital =
          this.treatmentpackage[0].totalnumberofpackageforhospital;
        this.totalnumberofmemberforhospital =
          this.treatmentpackage[0].totalnumberofmemberforhospital;
        this.totalNoOfBloackedamount =
          this.treatmentpackage[0].totalNoOfBloackedamount;
        this.packageblockedforpatient =
          this.treatmentpackage[0].packageblockedforpatient;
        this.sumofpackageblockedamount =
          this.treatmentpackage[0].sumofpackageblockedamount;
      });
  }
  modalClosedd() {
    $('#manetrigger').hide();
  }
  getmandedata() {
    $('#manetrigger').Show();
  }
  triggerList: any = [];
  getTriggerList() {
    this.service.getdynamicconfigurationlist().subscribe((data: any) => {
      this.triggerList = data;
    });
  }

  // tdCheck() {
  //   this.triggerList.forEach((data1: any, index) => {
  //     this.meTrigger.forEach((data2: any) => {
  //       if (data1.slno == data2.slNo) {
  //         data1.show = true;
  //       } else {
  //         data1.show = false;
  //       }
  //     });
  //   });
  //   this.triggerList = this.triggerList.filter(item => item.show == true);
  // }

  triggerDetails: any = [];
  list: any = [];
  header: any = [];
  reportName: any;
  getTriggerDetails(data) {
    this.triggerDetails = [];
    this.header = [];
    this.list = [];
    let slnumber = data.slNo;
    if (slnumber != null || slnumber != undefined || slnumber != '') {
      this.snoService.getTriggerDetails(data).subscribe(
        (data: any) => {
          let resData = data;
          if (resData.status == 200) {
            this.header = data.header;
            this.list = data.data;
            this.reportName = data.ReportName;
            if (this.list != null || this.list != undefined) {
              // this.triggerDetails = resData.details;
              $('#triggermodal').show();
              // $("#modalOpen").click(function () {
              //   $("#triggermodal").modal("show");
              // });
            } else {
              $('#triggermodal').hide();
            }
          } else {
            this.swal('', 'Something went wrong.', 'error');
          }
        },
        (error) => {
          console.log(error);
          this.swal('', 'Something went wrong.', 'error');
        }
      );
    } else {
      $('#triggermodal').hide();
      // if(data != null && data != undefined) {
      //     this.triggerDetails.push(data);
      //     $('#triggermodal').show();
      //   }else{
      //     $('#triggermodal').hide();
      //   }
    }
  }
  ongointreatmnet: any = [];
  getOnGoingTreatmenthistory() {
    this.ongointreatmnet = [];
    let urno = this.urnNo;
    this.treatmenthistoryperurn
      .getOnGoingTreatmenthistory(urno, this.user.userId)
      .subscribe(
        (data) => {
          this.ongointreatmnet = data;
        },
        (error) => {
          console.log(error);
          this.swal('', 'Something went wrong.', 'error');
        }
      );
  }

  triggerdetails = [];
  triggerdetails1 = [];
  getCPDTrigger() {
    this.triggerdetails = [];
    this.triggerdetails1 = [];
    let hospitalcode = this.claimDetails?.HOSPITALCODE;
    let dateofAdmission = this.Dateconvert(this.claimDetails?.DATEOFADMISSION1);
    let dateofdischarge = this.Dateconvert(this.claimDetails?.DATEOFDISCHARGE1);
    let procedurecode = this.claimDetails?.procedureCode1;
    this.treatmenthistoryperurn
      .getCPDTriggerdetails(
        hospitalcode,
        dateofAdmission,
        dateofdischarge,
        procedurecode
      )
      .subscribe(
        (data: any) => {
          this.triggerdetails = data.cpdtrigerlist;
          this.triggerdetails1 = data.cpdtrigerlist1;
          // console.log(this.triggerdetails);
        },
        (error) => {
          console.log(error);
          this.swal('', 'Something went wrong.', 'error');
        }
      );
  }

  getPackagepattern() {
    let hospitalcode = this.claimDetails?.HOSPITALCODE;
    let dateofAdmission = this.Dateconvert(this.claimDetails?.DATEOFADMISSION1);
    let dateofdischarge = this.Dateconvert(this.claimDetails?.DATEOFDISCHARGE1);
    let procedurecode = this.claimDetails?.procedureCode1;
    let packageName = this.claimDetails?.packageName1;
    this.sessionService.encryptSessionData('hospitalcode', hospitalcode);
    this.sessionService.encryptSessionData('dateofAdmission', dateofAdmission);
    this.sessionService.encryptSessionData('dateofdischarge', dateofdischarge);
    this.sessionService.encryptSessionData('procedurecode', procedurecode);
    this.sessionService.encryptSessionData('procedurecode', procedurecode);
    this.sessionService.encryptSessionData('packageName', packageName);
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/packagepattern');
    });
  }

  Dateconvert(date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy');
  }

  patienttreatmnetlog: any = [];
  patienttreatmentlog() {
    this.patienttreatmnetlog = [];
    let urno = this.urnNo;
    this.treatmenthistoryperurn
      .patienttreatmnetlog(urno, this.user.userId, this.txnId)
      .subscribe(
        (data) => {
          this.patienttreatmnetlog = data;
        },
        (error) => {
          console.log(error);
          this.swal('', 'Something went wrong.', 'error');
        }
      );
  }

  showPackagenamePatientlog(text, index) {
    $('#packagenamepatientlog' + index).text(text);
    $('#showMorepacke13' + index).empty();
    $('#showMorepacke14' + index).append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }

  hidePackagenamePatientlog(text, index) {
    if (text.length > 15) {
      $('#packagenamepatientlog' + index).text(text.substring(0, 15) + '...');
      $('#showMorepacke14' + index).empty();
      $('#showMorepacke13' + index).empty();
      $('#showMorepacke13' + index).append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }

  logdetails: any = [];
  getPatientTreatmentLogThroughProcedureCode() {
    this.logdetails = [];
    let procedureCode = this.claimDetails?.procedureCode1;
    let uidreferencenumber = this.claimDetails?.uidreferencenumber;
    this.treatmenthistoryperurn
      .getPatientTreatmentLogThroughProcedureCode(
        procedureCode,
        uidreferencenumber
      )
      .subscribe(
        (data: any) => {
          this.logdetails = data.patientlist;
        },
        (error) => {
          console.log(error);
          this.swal('', 'Something went wrong.', 'error');
        }
      );
  }

  showPackagenamepatient(text, index) {
    $('#packagenamepatient' + index).text(text);
    $('#showMorepacke3' + index).empty();
    $('#showMorepacke4' + index).append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }

  hidePackagenamepatient(text, index) {
    if (text.length > 15) {
      $('#packagenamepatient' + index).text(text.substring(0, 15) + '...');
      $('#showMorepacke4' + index).empty();
      $('#showMorepacke3' + index).empty();
      $('#showMorepacke3' + index).append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }
  // Method to calculate total
  getTotal(property: string): number {
    return this.multiPackListcaseno.reduce(
      (acc, item) => acc + (parseFloat(item[property]) || 0),
      0
    );
  }
  // Method to format numbers as strings with commas
  formatNumber(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  approvedAmount(event: KeyboardEvent) {
    const pattern = /^[0-9.\b]+$/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  checkAmount() {
    let amountValue = $('#amount').val();
    let amount = Number(amountValue);
    let diffAmount = Number(this.claimDetails.diffAmount);
    if (amount < diffAmount) {
      let lessAmount = diffAmount - amount;
      this.swal(
        '',
        'You are Entering ₹ ' +
          lessAmount +
          ' less amount than Hospital claim Amount.',
        'info'
      );
    }
  }

  partialclaimdata(claimId:any){
    this.partialclaimserv.getpartialclaimlogdetails(claimId).subscribe((data: any) => {
      if(data.status==200){
        this.partialclaimdetails=data.partialclaimdata;
        this.partialclaimlog=data.partialclaimlog;
      }
    },
      (error) => console.log(error)
    );
  }
}

