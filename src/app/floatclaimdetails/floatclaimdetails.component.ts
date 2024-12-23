import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../application/header.service';
import { SnoCLaimDetailsService } from '../application/Services/sno-claim-details.service';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';
import { HospitalPackageMappingService } from '../application/Services/hospital-package-mapping.service';
import { SnocreateserviceService } from '../application/Services/snocreateservice.service';
import { CreatecpdserviceService } from '../application/Services/createcpdservice.service';
import { TreatmenthistoryperurnService } from '../application/Services/treatmenthistoryperurn.service';
import { TableUtil } from '../application/util/TableUtil';
import { TrackingTransistServiceService } from '../application/Services/tracking-transist-service.service';
import { SessionStorageService } from '../services/session-storage.service';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { PaymentfreezeserviceService } from '../application/Services/paymentfreezeservice.service';
declare let $: any;

@Component({
  selector: 'app-floatclaimdetails',
  templateUrl: './floatclaimdetails.component.html',
  styleUrls: ['./floatclaimdetails.component.scss'],
})
export class FloatclaimdetailsComponent implements OnInit {
  floatclaimdetails: any;
  floatclaim: any = [];
  record: any;
  authorizedcode: any;
  hospitalcode: any;
  floatnumber: any;
  floatid: any;
  createdon: any;
  createby: any;
  user: any;
  checkSna: boolean = false;
  constructor(
    public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    public route: Router,
    private jwtService: JwtService,
    private cpdService: CreatecpdserviceService,
    private treatmenthistoryperurnService: TreatmenthistoryperurnService,
    private trackingtransistReport: TrackingTransistServiceService,
    private sessionService: SessionStorageService,
    public paymentfreezeService: PaymentfreezeserviceService,
  ) {}
  ngOnInit(): void {
    this.floatclaimdetails = JSON.parse(
      localStorage.getItem('floatclaimdetails')
    );
    this.user = this.sessionService.decryptSessionData('user');
    this.floatnumber = this.floatclaimdetails.Floatnumber;
    if (this.user.groupId == 4) {
      this.checkSna = true;
    }
    this.getRemarks();
    this.getdetailsonfloatclaimdetails();
    $('#appealDisposal').hide();
    $('#triggermodal').hide();
  }
  txnId: any;
  cardBalanceDetails: any = [];
  getdetailsonfloatclaimdetails() {
    this.snoService
      .getSnaFloatClaimDetails(
        this.floatclaimdetails.Urn,
        this.floatclaimdetails.Claimid,
        this.floatclaimdetails.Floatnumber
      )
      .subscribe(
        (data: any) => {
          // this.floatclaim = data;
          // this.record = this.floatclaim[0];
          // this.authorizedcode = this.floatclaim[0]?.authorizedcode;
          // this.hospitalcode = this.floatclaim[0]?.hospitalcode;
          // this.floatid = this.floatclaim[0]?.floatid;
          // this.getPreAuthdata();
          // this.getTreatmentHistory();
          // this.getfloatloghistory();
          // this.trackingdetails();
          // this.getOldTreatmentHistory();
          let resData = data;
          if (resData.status == 'success') {
            let details = JSON.parse(resData.details);
            console.log(details);
            this.claimDetails = details.actionData;
            this.txnId = this.claimDetails.transactionId;
            this.floatid = this.claimDetails.floatId;
            let procedureName = this.claimDetails.procedureName1;
            this.urnNo = this.claimDetails.URN;
            if (procedureName.length > 30) {
              $('#procedureNameId').text(
                procedureName.substring(0, 30) + '...'
              );
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
            // this.floatdetails = details.floatDetails;
            // this.createdon= this.floatdetails[0].createdOn;
            // this.createby= this.floatdetails[0].actionByName;
            // this.floatAmount = this.floatdetails.at(-1).amount;
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
            this.getfloatloghistory();
            this.getPackageDetailsInfoList();
            this.getTreatMentHistory();
            this.getOldTreatMentHistory();
            this.getTreatmentHistoryoverpackgae();
            this.getOnGoingTreatmenthistory();
          } else {
            this.swal('', 'Something went wrong.', 'error');
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
  claimlist1: any;
  preAuth: any;
  preAuthdata: any;
  check: boolean = false;
  getPreAuthdata() {
    let URNnumber = this.floatclaimdetails.Urn;
    let Authroziedcode = this.authorizedcode;
    let Hospitalcode = this.hospitalcode;
    this.cpdService
      .getPreAuthHistory(URNnumber, Authroziedcode, Hospitalcode)
      .subscribe((data) => {
        console.log(data);
        this.claimlist1 = data;
        this.preAuth = this.claimlist1.preAuthLogList;
        console.log(this.preAuth);
        if (this.preAuth.length != 0) {
          this.check = true;
        } else {
          this.check = false;
        }
      });
  }
  treatmentHistoryList: any = [];
  getTreatmentHistory() {
    this.treatmenthistoryperurnService
      .searchbyUrn2(this.floatclaimdetails.Urn, this.jwtService.getJwtToken())
      .subscribe((data) => {
        this.treatmentHistoryList = data;
        if (this.treatmentHistoryList.length > 3) {
          document
            .getElementById('treatmentTable')
            .classList.add(
              'treatment-history-table-class',
              'treatment-history-table-head-class'
            );
        }
      });
  }
  downloadExcelTreatmentHistory() {
    console.log('Inside Download Report');
    let SlNo = 1;
    let report = [];
    let heading = [
      [
        'Sl#',
        'URN',
        'Invoice No.',
        'Hospital Name',
        'Package Code',
        'Patient Name',
        'Date of Admission',
        'Actual Date of Admission',
        'Date of Discharge',
        'Actual Date of Discharge',
        'Action Amount(₹)',
        'CPD Approved Amount(₹)',
        'SNA Approved Amount(₹)',
        'Status',
      ],
    ];
    let claim: any;
    this.treatmentHistoryList.forEach((element) => {
      claim = {
        'Sl#': SlNo,
        URN: element.urnno,
        'Invoice No.': element.invoiceNo,
        'Hospital Name': element.hospitalname,
        'Package Code': element.packagecode,
        'Patient Name': element.patientname,
        'Date of Admission': element.dateofadmission,
        'Actual Date of Addmission': element.actualDateofadmission,
        'Date of Discharge': element.dateofdischarge,
        'Actual Date of Discharge': element.actualDateofdischarge,
        'Action Amount(₹)':
          element.totalamount != null ? element.totalamount : 'N/A',
        'CPD Approved Amount(₹)':
          element.cpdapproveamount != null ? element.cpdapproveamount : 'N/A',
        'SNA Approved Amount(₹)':
          element.snaapproveamount != null ? element.snaapproveamount : 'N/A',
        Status: element.status,
      };
      report.push(claim);
      SlNo++;
    });
    TableUtil.exportListToExcel(
      report,
      'Discharge Treatment Information',
      heading
    );
  }
  floatdetails: any = [];
  floatAmount: any;
  getfloatloghistory() {
    let floatid = this.floatid;
    this.snoService.getfloatlist(floatid).subscribe((data: any) => {
      console.log(data);
      this.floatdetails = data;
      console.log(this.floatdetails);
      if (this.floatdetails.status == 'success') {
        this.floatdetails = this.floatdetails.data;
        this.createdon = this.floatdetails[0].createon;
        this.createby = this.floatdetails[0].createby.fullname;
        this.floatAmount = this.floatdetails.at(-1).amount;
      } else {
        this.floatdetails = [];
      }
    });
  }
  actiontable: any = [];
  actiontable2: any = [];
  tableData: any = [];
  item: any = [];
  urn: any;
  tableDatalength: any;
  trackingdetails() {
    this.trackingtransistReport
      .gettrackingdetails(this.floatclaimdetails.Claimid)
      .subscribe((data) => {
        this.item = data[0];
        this.urn = this.item.URN;
        this.actiontable2 = data;
        console.log('Data Action Details.');
        this.tableDatalength = this.actiontable2.length;
        let i: any;
        for (i = 1; i < this.tableDatalength; i++) {
          this.actiontable.push(data[i]);
        }
        console.log(this.actiontable);
        if (this.actiontable.length != 0) {
        }
      });
  }
  downloadExcelOldTreatmentHistory() {
    console.log('Inside Download Report');
    let SlNo = 1;
    let report = [];
    let heading = [
      [
        'Sl#',
        'URN',
        'Invoice No.',
        'Patient Name',
        'Date of Admission',
        'Actual Date of Admission',
        'Date of Discharge',
        'Actual Date of Discharge',
        'Claim Status',
        'Approved Amount(₹)',
        'Approved Date',
        'SNA Approved Amount(₹)',
        'SNA Approved Date',
        'Remarks',
        'SNA Remarks',
      ],
    ];

    let claim: any;
    this.oldTreatmentHistoryList.forEach((element) => {
      claim = {
        'Sl#': SlNo,
        URN: element.URN,
        'Invoice No.': element.invoiceNo,
        'Patient Name': element.patientName,
        'Date of Admission': element.dateOfAdmission,
        'Actual Date of Admission': element.actualDateOfAdmission,
        'Date of Discharge': element.dateOfDischarge,
        'Actual Date of Discharge': element.actualDateOfDischarge,
        'Claim Status': element.claimStatus,
        'Approved Amount(₹)': element.approvedAmount,
        'Approved Date': element.approvedDate,
        'SNA Approved Amount(₹)': element.SNAApprovedAmount,
        'SNA Approved Date': element.SNAApprovedDate,
        Remarks: element.remark,
        'SNA Remarks': element.SNARemark,
      };
      report.push(claim);
      SlNo++;
    });
    TableUtil.exportListToExcel(report, 'Old Claim Information', heading);
  }
  oldTreatmentHistoryList: any = [];
  getOldTreatmentHistory() {
    console.log('Old Treatment History');
    this.treatmenthistoryperurnService
      .getOldTreatmentHistoryURNCPD(
        this.floatclaimdetails.Urn,
        this.jwtService.getJwtToken()
      )
      .subscribe((data) => {
        if (data != null && data.status == 'success') {
          this.oldTreatmentHistoryList = data.data;
          if (this.oldTreatmentHistoryList.length > 3) {
            document
              .getElementById('oldTreatmentTable')
              .classList.add(
                'treatment-history-table-class',
                'treatment-history-table-head-class'
              );
          }
        }
      });
  }
  dtls: any;
  viewDescription(descriptinDtls) {
    this.dtls = descriptinDtls;
    // alert(this.dtls)
    $('#appealDisposal').show();
  }
  modalClose() {
    $('#appealDisposal').hide();
  }
  downloadAction(event: any, fileName: any, hCode: any, dateOfAdm: any) {
    // this.documnetname = [];
    // this.documnetname.push(fileName);
    // this.documentstatus = 0;
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
            // this.documentLog();
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  }
  isQuery: boolean = false;
  isReject: boolean = false;
  isInvestigate: boolean = false;
  isRevert: boolean = false;
  isApproved: boolean = false;
  isHold: boolean = false;
  actionRemarkId: any;
  description: string = '';
  claimDetails: any;
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
      this.description =
        this.description + ', ' + this.toProperCase(item.remarks);
    }
  }
  clearEvent() {
    this.actionRemarkId = '';
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
  keyPress(event: KeyboardEvent) {
    const pattern = /'/;
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  maxChars = 1000;
  checkAmount() {
    let amountValue = $('#amount').val();
    let amount = Number(amountValue);
    let totalAmountClaimed = Number(this.claimDetails.TOTALAMOUNTCLAIMED);
    if (amount < totalAmountClaimed) {
      let lessAmount = totalAmountClaimed - amount;
      this.swal(
        '',
        'You are Entering ₹ ' +
          lessAmount +
          ' less amount than Hospital claim Amount.',
        'info'
      );
    }
  }
  remarks: any;
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });
  allremarks: any;
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
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  toProperCase(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  }
  multiPackList: any = [];
  multiPackListcaseno: any = [];
  multiFlag: boolean = false;
  multiFlagcase: boolean = false;
  backUpAmount: any;
  meTrigger: any = [];
  overridedetails: any = [];
  facedetails: any = [];
  posdetails: any = [];
  irisdetails: any = [];
  otpdetaiils: any = [];
  overAllDetailsData: any = [];
  pkgDetailsData: any = [];
  triggerList: any = [];
  ongointreatmnet: any = [];
  cpdActionLog: any = [];
  claimLog: any = [];
  oldTrtData: any = [];
  trtData: any = [];
  wardDataList: any = [];
  implantDataList: any = [];
  highEndDrugList: any = [];
  preAuthHistory: any = [];
  vitalArray: any = [];
  amount:any;
  pendingAt: any;
  claimStatus: any;
  claimAmout: any;

  submitDetails(event, claimId) {
     this.remarks = $('#remarks').val();
     this.amount = $('#amount').val();
     this.claimAmout = Number(this.claimDetails.TOTALAMOUNTCLAIMED);
     if (event.target.id == 'Approve') {
       this.pendingAt = 3;
       this.claimStatus = 1;
     }
     if (event.target.id == 'Query') {
       this.pendingAt = 0;
       this.claimStatus = 4;
       this.amount = "";//Changes on 29/12/2023 By Rajendra with santanu sir and gyana sir and ashok sir porpose:- issue fixing in postpayment updation
     }
     if (event.target.id == 'Reject') {
       this.pendingAt = 3;
       this.claimStatus = 2;
       this.amount = '0';
     }
     if (event.target.id == 'Investigate') {
       this.pendingAt = 4;
       this.claimStatus = 6;
       this.amount = '0';
     }
     if (event.target.id == 'Hold') {
       this.pendingAt = 2;
       this.claimStatus = 13;
       this.amount = '0';
     }
    //  if (event.target.id == 'Revert') {
    //    this.pendingAt = 1;
    //    this.claimStatus = 8;
    //    this.amount = '0';
    //  }
     if (event.target.id == 'Revert') {
     } else if (this.actionRemarkId == 0 || this.actionRemarkId == null || this.actionRemarkId == '' || this.actionRemarkId == undefined) {
       this.swal('', ' Please Select Remark', 'error');
       return;
     }
     if (
       this.actionRemarkId == 57 ||
       event.target.id == 'Revert' ||
       event.target.id == 'Reject'
     ) {
       if (this.remarks == '' || this.remarks == null) {
         this.swal('', 'Description should not be left blank', 'error');
         return;
       }
     }
     if (event.target.id == 'Approve') {
       if (Number(this.amount) == 0) {
         this.swal('Info', 'Approved amount cannot be zero', 'info');
         return;
       }
     }
     if (this.remarks != '' && this.remarks != null) {
       const pattern = /'/;
       if (pattern.test(this.remarks)) {
         this.swal('', ' Special character is not allowed', 'error');
         return;
       }
     }
     if (event.target.id != 'Query') {
       if (this.amount == '' || this.amount == null) {
         this.swal('', 'Amount should not be left blank', 'error');
         // $('#amount').val(this.backUpAmount);
         return;
       }
       var gfg = $.isNumeric(this.amount);
       if (!gfg) {
         this.swal('', 'Amount should be Numeric', 'error');
         // $('#amount').val(this.backUpAmount);
         return;
       }
     }

     if (this.actionRemarkId == 1) {
       if (this.amount == 0) {
         this.swal('', 'Amount should not be zero', 'error');
         // $('#amount').val(this.backUpAmount);
         return;
       }
     }

     if (this.amount > this.claimAmout) {
       this.swal(
         '',
         ' Approved Amount should be less than claim amount',
         'error'
       );
       // $('#amount').val(this.backUpAmount);
       return;
     }

     let data = {
       claimId: claimId,
       amount: this.amount,
       remarks: this.remarks,
       actionRemarksId: this.actionRemarkId,
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
       confirmButtonText: 'Yes, ' + event.target.id + ' It',
     }).then((result) => {
       if (result.isConfirmed) {
         this.paymentfreezeService.saveFloatClaimAction(data).subscribe(
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
               } else if (event.target.id == 'Revert') {
                 this.swal('Success', data.message, 'success');
               } else if (event.target.id == 'Hold') {
                 this.swal('Success', data.message, 'success');
               }
              const broadcastChannel = new BroadcastChannel('floatClaimActionChannel');
              broadcastChannel.postMessage('checksuccess');
              window.close();
             } else if (data.status == 'Failed') {
               this.swal('Error', data.message, 'error');
             }
             localStorage.removeItem('actionData');
           },
           (error) => {
             console.log(error);
             this.swal('', 'Something went wrong.', 'error');
           }
         );
       }
     });
  }
  documentstatus: any;
  files: any = [];
  documnetname: any = [];
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
  keyword = 'remarks';

  collapse: string = 'Collapse All';
  totalnumberofpackage: any;
  totalnumberofmember: any;
  totalnumberofpackageforhospital: any;
  totalnumberofmemberforhospital: any;
  totalNoOfBloackedamount: any;
  packageblockedforpatient: any;
  sumofpackageblockedamount: any;
  collapseAll() {}
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
  data1: any;
  pagename: any;
  userid: any;
  insert: any;
  urnNo: any;
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
  highEndDrugTotalPrice: any;
  implantTotalPrice: any;
  implantTotalUnitPrice: any;
  implantTotalUnit: any;
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
  getTreatMentHistory() {
    this.treatmenthistoryperurnService
      .searchbyUrnSnaUser(this.urnNo, this.user.userId)
      .subscribe(
        (data) => {
          this.trtData = data;
        },
        (error) => {
          console.log(error);
          this.swal('', 'Something went wrong.', 'error');
        }
      );
  }
  getOldTreatMentHistory() {
    let urno = this.urnNo;
    this.treatmenthistoryperurnService
      .oldsearchbyUrnSnaUser(urno, this.user.userId)
      .subscribe(
        (data) => {
          this.oldTrtData = data;
        },
        (error) => {
          console.log(error);
          this.swal('', 'Something went wrong.', 'error');
        }
      );
  }
  caseno: any;
  claimno: any;
  uidreferencenumber: any;
  hscode: any;
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
  // ongointreatmnet: any = [];
  getOnGoingTreatmenthistory() {
    this.ongointreatmnet = [];
    let urno = this.urnNo;
    this.treatmenthistoryperurnService
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
  hospitalcodedata: any;
  isDisch: boolean = false;
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
}
