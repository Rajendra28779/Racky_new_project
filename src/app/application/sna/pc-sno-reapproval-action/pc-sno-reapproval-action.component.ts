import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { CreatecpdserviceService } from '../../Services/createcpdservice.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { TreatmenthistoryperurnService } from '../../Services/treatmenthistoryperurn.service';
import { DynamicreportService } from '../../Services/dynamicreport.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { DatePipe } from '@angular/common';
import { PartiallfloatserviceService } from '../../Services/partiallfloatservice.service';

@Component({
  selector: 'app-pc-sno-reapproval-action',
  templateUrl: './pc-sno-reapproval-action.component.html',
  styleUrls: ['./pc-sno-reapproval-action.component.scss']
})
export class PcSnoReapprovalActionComponent implements OnInit {
  childmessage: any;
  claimDetails: any;
  allremarks: any;
  textRemak: any;
  txnId: any;
  // fileUrl: any;
  claimLog: Array<any> = [];
  pendingAt: any;
  claimStatus: any;
  user: any;
  // routeFlag: any;
  urnNo: any;
  preAuth: any = [];
  packageCode: any;
  maxChars = 500;
  check: boolean = false;
  isQuery: boolean = false;
  isReject: boolean = false;
  isInvestigate: boolean = false;
  isApproved: boolean = false;
  isHold: boolean = false;
  data: any;
  keyword = 'remarks';
  // treatment: string;
  trtData: any = [];
  oldTrtData: any = [];
  // wardimplmenthighenddrugs: any = [];
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
  isDisch: boolean = false;
  preAuthHistory: any = [];
  posdetails: any = [];
  otpdetaiils: any = [];
  irisdetails: any = [];
  facedetails: any = [];
  fingerprintdetails: any = [];
  partialclaimdetails:any;
  partialclaimlog:any=[];
  constructor(
    private jwtService: JwtService,
    public headerService: HeaderService,
    public route: Router,
    public snoService: SnoCLaimDetailsService,
    private treatmenthistoryperurn: TreatmenthistoryperurnService,
    private cpdService: CreatecpdserviceService,
    private service: DynamicreportService,
    private sessionService: SessionStorageService,
    public partialclaimserv:PartiallfloatserviceService,
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('SNA Re-Settlement / Details');
    this.getTriggerList();
    this.user = this.sessionService.decryptSessionData('user');
    this.data = JSON.parse(localStorage.getItem('actionData'));
    this.txnId = this.data.transactionId;
    this.urnNo = this.data.URN;
    this.packageCode = this.data.packageCode;
    $('#appealDisposal').hide();
    $('#triggermodal').hide();
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.getRemarks();
    this.getSnoClaimDetailsById();
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
  multiFlag: boolean = false;
  backUpAmount: any;
  multiPackListcaseno: any = [];
  multiFlagcase: boolean = false;
  meTrigger: any = [];
  cardBalanceDetails: any = [];
  paymentDetails :any = [];
  getSnoClaimDetailsById() {
    this.snoService.partialClaimSnoDetails(this.txnId).subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          let details = JSON.parse(resData.details);
          this.claimDetails = details.actionData;
          console.log(this.claimDetails);
          this.partialclaimdata(this.claimDetails.CLAIMID);
          let procedureName = this.claimDetails?.procedureName1;
          if (procedureName?.length > 30) {
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
          let multiPkg = details.packageBlock;
          this.vitalArray = details.vitalArray;
          let multipackcasen = details.multipackagecaseno;
          this.triggerList = details.meTrigger;
          this.cardBalanceDetails = details.cardBalanceArray;
          this.paymentDetails = details.paymentDetails;
          multiPkg?.forEach((item) => {
            if (item.transctionId != this.txnId) {
              this.multiPackList.push(item);
            }
          });
          if (this.multiPackList?.length > 0) {
            this.multiFlag = true;
          }
          multipackcasen?.forEach((item) => {
            // if (item.transctionId != this.txnId) {
            this.multiPackListcaseno.push(item);
            // }
          });
          if (this.multiPackListcaseno?.length > 0) {
            this.multiFlagcase = true;
          }
          this.preAuth = details.preAuthHist;
          if (this.preAuth?.length != 0) {
            this.check = true;
          }
          this.preAuthHistory = details.preAuthLog;
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
  getRemarks() {
    this.snoService.getRemarks().subscribe(
      (data1: any) => {
        let remarkData = data1;
        this.allremarks = remarkData;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  documnetname: any = [];
  downloadAction(event: any, fileName: any, hCode: any, dateOfAdm: any) {
    let target = event.target;
    this.documnetname = [];
    this.documnetname.push(fileName);
    this.documentstatus = 0;
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

  approvedAmount(event: KeyboardEvent) {
    const pattern = /^\d+(\.\d{1,2})?$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  remarks: any;
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });
  amount: any;
  claimAmout: any;
  submitDetails(event: any, claimId: any) {
    this.remarks = $('#remarks').val();
    this.amount = $('#amount').val();
    let userId = this.user.userId;
    this.claimAmout = Number(this.claimDetails?.diffAmount);

    if (event.target.id == 'Approve') {
      this.pendingAt = 3;
      this.claimStatus = 1;
      if (Number(this.amount) == 0) {
        this.swal('Info', 'Partial Claim Amount cannot be zero', 'info');
        return;
      }
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
    if (event.target.id == 'Investigate') {
      this.pendingAt = 6;
      this.claimStatus = 6;
      this.amount = '0';
    }
    if (this.remarks == '' || this.remarks == null) {
      this.swal('', 'Remarks should not be left blank', 'error');
      return;
    }
    if (this.remarks != '' && this.remarks != null) {
      const pattern = /'/;
      if (pattern.test(this.remarks)) {
        this.swal('', 'Special character is not allowed', 'error');
        return;
      }
    }
    if (this.amount > this.claimAmout) {
      this.swal('', 'Partial Claim Amount should be less than Claim Amount', 'error');
      return;
    }
    let data = {
      claimId: claimId,
      userId: userId,
      amount: this.amount,
      remarks: this.remarks,
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
        this.snoService.savePartialClaimresetelment(data).subscribe(
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
              localStorage.removeItem('actionData');
              this.route.navigate(['/application/partialclaimreapproval']);
            } else if (data.status == 'Failed') {
              this.swal('Error', data.message, 'error');
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
  getTreatMentHistory() {
    this.treatmenthistoryperurn
      .searchbyUrnSnaUser(this.urnNo, this.user.userId)
      .subscribe(
        (data) => {
          this.trtData = data;
          if (this.trtData.length > 3) {
            document
              .getElementById('treatmentTable')
              .classList.add(
                'treatment-history-table-class',
                'treatment-history-table-head-class'
              );
          }
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
          if (this.oldTrtData.length > 3) {
            document
              .getElementById('oldTreatmentTable')
              .classList.add(
                'treatment-history-table-class',
                'treatment-history-table-head-class'
              );
          }
        },
        (error) => {
          console.log(error);
          this.swal('', 'Something went wrong.', 'error');
        }
      );
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
    const pattern = /'/;
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
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
    investigationdocs,
    investigationdocs2,
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
        h: this.claimDetails?.HOSPITALCODE,
        d: this.claimDetails?.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }
    if (additionDoc != null || additionDoc != undefined) {
      this.documnetname.push(additionDoc);
      let jsonObj = {
        f: additionDoc,
        h: this.claimDetails?.HOSPITALCODE,
        d: this.claimDetails?.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }
    if (additionalDoc1 != null || additionalDoc1 != undefined) {
      this.documnetname.push(additionalDoc1);
      let jsonObj = {
        f: additionalDoc1,
        h: this.claimDetails?.HOSPITALCODE,
        d: this.claimDetails?.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }
    if (additionalDoc2 != null || additionalDoc2 != undefined) {
      this.documnetname.push(additionalDoc2);
      let jsonObj = {
        f: additionalDoc2,
        h: this.claimDetails?.HOSPITALCODE,
        d: this.claimDetails?.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }
    if (investigationdocs != null || investigationdocs != undefined) {
      this.documnetname.push(investigationdocs);
      let jsonObj = {
        f: investigationdocs,
        h: this.claimDetails?.HOSPITALCODE,
        d: this.claimDetails?.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }
    if (investigationdocs2 != null || investigationdocs2 != undefined) {
      this.documnetname.push(investigationdocs2);
      let jsonObj = {
        f: investigationdocs2,
        h: this.claimDetails?.HOSPITALCODE,
        d: this.claimDetails?.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }
    if (preSurgery != null || preSurgery != undefined) {
      this.documnetname.push(preSurgery);
      let jsonObj = {
        f: preSurgery,
        h: this.claimDetails?.HOSPITALCODE,
        d: this.claimDetails?.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }

    if (postSurgery != null || postSurgery != undefined) {
      this.documnetname.push(postSurgery);
      let jsonObj = {
        f: postSurgery,
        h: this.claimDetails?.HOSPITALCODE,
        d: this.claimDetails?.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }

    if (patientPic != null || patientPic != undefined) {
      this.documnetname.push(patientPic);
      let jsonObj = {
        f: patientPic,
        h: this.claimDetails?.HOSPITALCODE,
        d: this.claimDetails?.DATEOFADMISSION,
      };
      this.files.push(jsonObj);

      if (intraSurgery != null || intraSurgery != undefined) {
        this.documnetname.push(intraSurgery);
        let jsonObj = {
          f: intraSurgery,
          h: this.claimDetails?.HOSPITALCODE,
          d: this.claimDetails?.DATEOFADMISSION,
        };
        this.files.push(jsonObj);
      }
    }

    if (specimenRemoval != null || specimenRemoval != undefined) {
      this.documnetname.push(specimenRemoval);
      let jsonObj = {
        f: specimenRemoval,
        h: this.claimDetails?.HOSPITALCODE,
        d: this.claimDetails?.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }
    if (mortalityauditreport != null || mortalityauditreport != undefined) {
      this.documnetname.push(mortalityauditreport);
      let jsonObj = {
        f: mortalityauditreport,
        h: this.claimDetails?.HOSPITALCODE,
        d: this.claimDetails?.DATEOFADMISSION,
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

  getDetails(transactionId, claimId, claimRaiseStatus, urn) {
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
    let txnpackagedetailid = this.claimDetails?.txnPackageDetailId;
    this.cpdService.getPackageDetailsInfoList(12).subscribe((data) => {
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
    } else if (this.collapse == 'Expand All') {
      this.collapse = 'Collapse All';
    }
  }
  pkgDetailsData: any = [];
  overAllDetailsData: any = [];
  getPackageDetails(packageCode, subPackageCode, procedureCode) {
    this.snoService
      .getPackageDetails(
        packageCode,
        subPackageCode,
        procedureCode,
        this.claimDetails?.HOSPITALCODE
      )
      .subscribe(
        (data: any) => {
          let resData = data;
          if (resData.status == 'success') {
            let packgeInfo = resData.data;
            let overallInfo = resData.data1;
            this.pkgDetailsData = JSON.parse(packgeInfo);
            this.overAllDetailsData = JSON.parse(overallInfo);
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

  showProcedureName() {
    $('#procedureNameId').text(this.claimDetails?.procedureName1);
    $('#showMoreId').empty();
    $('#showMoreId1').append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }

  hideProcedureName() {
    let procedureName = this.claimDetails?.procedureName1;
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
  memberid: any;
  urn: any;
  hospitalcodedata: any;
  getAuthenticationdetails(type: any) {
    if (type == 1) {
      this.isDisch = true;
    } else {
      this.isDisch = false;
    }
    this.memberid = this.claimDetails?.MEMBERID;
    this.urn = this.claimDetails?.URN;
    this.hospitalcodedata = this.claimDetails?.HOSPITALCODE;
    this.snoService
      .getauthentocationdetails(
        this.urn,
        this.memberid,
        type,
        this.hospitalcodedata,
        this.claimDetails?.claimCaseNo
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
            this.fingerprintdetails = details.fingerprintdetails;
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
  getOverridedetails(overridecode: any) {
    this.memberid = this.claimDetails?.MEMBERID;
    this.urn = this.claimDetails?.URN;
    this.hospitalcode = this.claimDetails?.HOSPITALCODE;
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
    (this.pagename = 'DC Compliance'),
      (this.userid = this.user.userId),
      (this.data1 = {
        urnumber: this.urnNo,
        documnetname: this.documnetname,
        claimid: this.claimDetails?.CLAIMID,
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
    this.hscode = this.claimDetails?.HOSPITALCODE;
    this.caseno = this.claimDetails?.claimCaseNo;
    this.uidreferencenumber =
      this.claimDetails?.uidreferencenumber != undefined
        ? this.claimDetails?.uidreferencenumber
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
  triggerList: any = [];
  getTriggerList() {
    this.service.getdynamicconfigurationlist().subscribe((data: any) => {
      this.triggerList = data;
    });
  }

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
              $('#triggermodal').show();
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
          console.log(this.triggerdetails);
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

  snamortstatus: any = '';
  getsnamortalitystatus(claimid: any) {
    this.snoService.getsnamortalitystatus(claimid).subscribe((data: any) => {
      this.snamortstatus = data.mortality;
    });
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
