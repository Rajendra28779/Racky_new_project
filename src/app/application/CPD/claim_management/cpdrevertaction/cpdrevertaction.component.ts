import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../../../header.service';
import { ClaimRaiseServiceService } from '../../../Services/claim-raise-service.service';
import { CreatecpdserviceService } from '../../../Services/createcpdservice.service';
import { SnoCLaimDetailsService } from '../../../Services/sno-claim-details.service';
import { TransactionClass } from '../../../Services/TransactionClass.service';
import { TreatmenthistoryperurnService } from "../../../Services/treatmenthistoryperurn.service";
import { TableUtil } from "../../../util/TableUtil";
import { DynamicreportService } from "../../../Services/dynamicreport.service";
import { ICDSharedServices } from 'src/app/services/ICDSharedServices';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { AuthIrisFingerService } from 'src/app/services/auth-iris-finger.service';
declare let $: any;

@Component({
  selector: 'app-cpdrevertaction',
  templateUrl: './cpdrevertaction.component.html',
  styleUrls: ['./cpdrevertaction.component.scss'],
})
export class CpdrevertactionComponent implements OnInit {
  [x: string]: any;

  childmessage: any;
  id: any = null;
  claimId: string;
  transactionid: any;
  URN: any;
  transClaimId: String;
  hospitalName: String;
  hospitalAddress: String;
  noOfDays: number;
  admissionSlip: string;
  blockedAmount: number;
  documentType: any;
  selectedFile?: File;
  fileToUpload?: FileList;
  triggerList: any = [];
  user: any;
  blockAmount: any;
  maxChars = 500;
  meTrigger: any = [];
  packageCode: any;
  finalRemarks: any;
  pre: any = 'false';
  post: any = 'false';
  intra: any = 'false';
  speciman: any = 'false';
  petient: any = 'false';
  discharge: any = 'false';
  admission: any = 'false';
  aditional: any = 'false';
  aditionalOne: any = 'false';
  aditionalTwo: any = 'false';
  mortalitydoc: any = 'false';
  mortalityauditdoc: any = 'false';
  aditionaldoc2: any = 'false';
  aditionaldoc1: any = 'false';
  imagesArray: any = [];
  docCount = 0;
  disslipcheck: boolean = false;
  disslipuncheck: boolean = true;
  admslipcheck: boolean = false;
  admslipuncheck: boolean = true;
  addslipcheck: boolean = false;
  addslipuncheck: boolean = true;

  preslipcheck: boolean = false;
  preslipuncheck: boolean = true;
  postslipcheck: boolean = false;
  postslipuncheck: boolean = true;
  intraslipcheck: boolean = false;
  intraslipuncheck: boolean = true;

  speslipcheck: boolean = false;
  speslipuncheck: boolean = true;
  patslipcheck: boolean = false;
  patslipuncheck: boolean = true;

  addoconecheck: boolean = false;
  addoconeuncheck: boolean = true;
  addoctwocheck: boolean = false;
  morslipcheck: boolean = false;
  addslip1check: boolean = false;
  addslip2check: boolean = false;
  mortauditcheck: boolean = false;
  addoctwouncheck: boolean = true;
  mortaudituncheck: boolean = true;
  addslip2uncheck: boolean = true;
  addslip1uncheck: boolean = true;
  morslipuncheck: boolean = true;
  authorizedCode: any;
  hospitalCode: any;
  actionAmount: number;
  keyword = 'reasonName';
  modalBody: any;
  modalTitle: any;
  collapse: string = 'Collapse All';

  public claimDetailsForm!: FormGroup;

  otherMessage: any;
  claimlist1: any;
  claimlist: TransactionClass[];
  descriptinDtls: any;
  dtls: any;
  actualDate: any;
  treatmentHistoryList: any = [];
  oldTreatmentHistoryList: any = [];

  highEndDrugList: any = [];
  implantDataList: any = [];
  wardDataList: any = [];

  highEndDrugTotalPrice: any;
  implantTotalPrice: any;
  implantTotalUnitPrice: any;
  implantTotalUnit: any;

  actionTimeObject: any;
  timingLogId: any;
  vitalArray: any = [];
  isDisch: boolean = false;
  preAuthHistory: any = [];
  posdetails: any = [];
  otpdetaiils: any = [];
  irisdetails: any = [];
  facedetails: any = [];
  fingerprintdetails: any = [];
  preauthhistory: any = [];
  imageToShow: any = "./assets/img/male-profile.jpg";
  isImage: boolean;
  finalIcdObj: any;
  ictDetailsArray: any = [];
  ictSubDetailsArray: any = [];
  documents: any = [];

  constructor(
    public headerService: HeaderService,
    private router: Router,
    private readonly route: ActivatedRoute,
    private cpdService: CreatecpdserviceService,
    private claimRaiseService: ClaimRaiseServiceService,
    public fb: FormBuilder,
    private currencyPipe: CurrencyPipe,
    public snoService: SnoCLaimDetailsService,
    private treatmenthistoryperurnService: TreatmenthistoryperurnService,
    private jwtService: JwtService,
    private service: DynamicreportService,
    private msgService: ICDSharedServices,
    private sessionService: SessionStorageService,
    private irisService: AuthIrisFingerService
  ) {
    this.claimDetailsForm = this.fb.group({
      hospitalName: new FormControl(''),
      hospitalAddress: new FormControl(''),
      urn: new FormControl(''),
      invoiceNumber: new FormControl(''),
      patientName: new FormControl(''),
      age: new FormControl(''),
      gender: new FormControl(''),
      telephoneNumber: new FormControl(''),
      Address: new FormControl(''),
      noofdays: new FormControl(''),
      admissiondate: new FormControl(''),
      packageCost: new FormControl(''),
      blockedAmount: new FormControl(''),
      procedureName: new FormControl(''),
      packageName: new FormControl(''),
      mortalityId: new FormControl(''),
      tableData: this.fb.array([
        this.fb.group({
          actionDate: [{ value: '', disabled: true }],
          applicationStatus: [{ value: '', disabled: true }],
          remarks: [{ value: '', disabled: true }],
          documents: [{ value: '', disabled: true }],
        }),
      ]),
      aprrovedtableData: this.fb.array([
        this.fb.group({
          approvedAmount: [{ value: '', disabled: true }],
          approvedDate: [{ value: '', disabled: true }],
          approvalRemarks: [{ value: '', disabled: true }],
        }),
      ]),

      finalRemarks: new FormControl('', [Validators.maxLength(1000)]),
      totalClaimAmount: new FormControl(''),
      reasonId: new FormControl(''),
      blockAmount: new FormControl(''),
    });
  }

  ngOnInit(): void {
    // this.getTriggerList();
    this.headerService.setTitle('SNA Reverted');

    this.headerService.isIndicate(false);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);

    this.id = this.route.snapshot.paramMap.get('id');
    this.otherMessage = localStorage.getItem('cpdActionItems');


    let x = this.otherMessage.split(' ');
    this.claimId = x[0].split(':')[1];
    this.transactionid = x[1].split(':')[1];
    this.URN = x[2].split(':')[1];
    this.transClaimId = x[3].split(':')[1];
    this.authorizedCode = x[4].split(':')[1];
    this.hospitalCode = x[5].split(':')[1];
    this.actualDate = x[6].split(':')[1];
    this.actionTimeObject = JSON.parse(localStorage.getItem('actionTimeObject'));

    this.getCPDClaimRevertDetails(
      this.URN,
      this.transactionid,
      this.claimId,
      this.authorizedCode,
      this.hospitalCode,
      this.actualDate
    );
    // this.user = JSON.parse(sessionStorage.getItem('user'));
    this.user = this.sessionService.decryptSessionData("user");
    $('#appealDisposal').hide();
    this.getTreatmentHistory();
    this.getmultipledocumentthroughcaseno();
    // this.getOldTreatmentHistory();
    this.patienttreatmentlog();
    this.getOnGoingTreatmenthistory();
    this.getwardnextentiondetails();

    if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
      document.getElementsByTagName("section")[0].className += " safari";
    }
    this.msgService.subsVar = this.msgService.
      invokeFirstComponentFunction.subscribe((data) => {
        this.finalIcdObj = data.icdData;
      });

    this.irisService.subsVar = this.irisService.
      invokeFirstComponentFunction.subscribe((data) => {
        this.actionFlag = data.flag;
        this.submitClaimAction();
    });
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
  multiPackage: any = [];
  action: any;
  preAuthLogList: any = [];
  isPreAuth: boolean = false;
  isLog: boolean = false;
  logList: any = [];
  isMultipck: boolean = false;
  reasonList: any = [];
  getCPDClaimRevertDetails(
    URN: String,
    transactionid: String,
    claimId: String,
    authorizedCode: String,
    hospitalCode: String,
    actualDate: String
  ) {
    let caseNo = this.actionTimeObject.caseNo;
    let userId = this.actionTimeObject.userId;
    let claimNo = this.actionTimeObject.claimNo;
    //claimlist =
    this.cpdService
      .getCPDClaimRevertDetails(
        transactionid,
        URN,
        claimId,
        authorizedCode,
        hospitalCode,
        actualDate,
        caseNo,
        userId,
        claimNo
      )
      .subscribe((data) => {
        this.claimlist1 = data;
        this.timingLogId = this.claimlist1.timingLogId;
        this.action = this.claimlist1.result;
        let multiPkg = this.claimlist1.multiPackList;
        multiPkg.forEach((item) => {
          if (item.transctionId != this.transactionid) {
            this.multiPackage.push(item);
          }
        });
        this.multipackthroughcaseno();
        let multiCount = this.multiPackage.length;
        if (multiCount > 0) {
          this.isMultipck = true;
        }
        this.vitalArray = this.claimlist1.vitalArray;
        this.preauthhistory = this.claimlist1.preAuthLogList;
        let procedureName = this.action.procedureName1;
        if (procedureName.length > 30) {
          $('#procedureNameId').text(procedureName.substring(0, 30) + '...');
          $('#showMoreId').empty();
          $('#showMoreId').append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
        } else {
          $('#procedureNameId').text(procedureName);
        }
        this.preAuthLogList = this.claimlist1.preAuthLogList;
        this.triggerList = this.claimlist1.meTrigger;
        this.reasonList = this.claimlist1.reasonList;
        this.ictDetailsArray = this.claimlist1.ictDetailsArray;
        this.ictSubDetailsArray = this.claimlist1.ictSubDetailsArray;
        let icdResponse = {
          ictDetailsArray: this.ictDetailsArray,
          ictSubDetailsArray: this.ictSubDetailsArray
        }
        this.msgService.setMessage(icdResponse);
        let authCount = this.preAuthLogList.length;
        if (authCount > 0) {
          this.isPreAuth = true;
        }

        let txnPackageDetailsId = this.action.txnPackageDetailsId;
        if (txnPackageDetailsId != null)
          this.getPackageDetailsInfoList(txnPackageDetailsId)

        this.logList = this.claimlist1.approvalList;
        let logCount = this.logList.length;
        if (logCount > 0) {
          this.isLog = true;
        }


        this.blockedAmount = this.claimlist1.result.hospitalClaimedAmount;
        this.admissionSlip = this.claimlist1.result.admissionSlip;
        this.claimDetailsForm.controls['urn'].patchValue(this.URN);

        if (this.claimlist1.result.admissionSlip != undefined)
          this.imagesArray.push(this.claimlist1.result.admissionSlip);
        if (this.claimlist1.result.additinalSlip != undefined)
          this.imagesArray.push(this.claimlist1.result.additinalSlip);

        if (this.claimlist1.result.dischargeSlip != undefined)
          this.imagesArray.push(this.claimlist1.result.dischargeSlip);

        if (this.claimlist1.result.mortalitydocument != undefined)
          this.imagesArray.push(this.claimlist1.result.mortalitydocument);

        if (this.claimlist1.result.preSurgerySlip != undefined)
          this.imagesArray.push(this.claimlist1.result.preSurgerySlip);

        if (this.claimlist1.result.postSurgerySlip != undefined)
          this.imagesArray.push(this.claimlist1.result.postSurgerySlip);
        if (this.claimlist1.result.intraSurgery != undefined)
          this.imagesArray.push(this.claimlist1.result.intraSurgery);

        if (this.claimlist1.result.specimenPhoto != undefined)
          this.imagesArray.push(this.claimlist1.result.specimenPhoto);
        if (this.claimlist1.result.patientPhoto != undefined)
          this.imagesArray.push(this.claimlist1.result.patientPhoto);

        if (this.claimlist1.result.otherDocOne != undefined)
          this.imagesArray.push(this.claimlist1.result.otherDocOne);
        if (this.claimlist1.result.otherDocTwo != undefined)
          this.imagesArray.push(this.claimlist1.result.otherDocTwo);

        this.hospitalName = this.claimlist1.result.hospitalName;
        this.hospitalAddress = this.claimlist1.result.hospitalAddress;
        this.noOfDays = this.claimlist1.result.noOfDays;
        this.packageCode = this.claimlist1.result.packageCode;

        this.claimDetailsForm.controls['invoiceNumber'].setValue(
          this.claimlist1.result.invoiceNo
        );
        this.claimDetailsForm.controls['patientName'].setValue(
          this.claimlist1.result.patientName
        );

        this.claimDetailsForm.controls['age'].setValue(
          this.claimlist1.result.age
        );
        this.claimDetailsForm.controls['gender'].setValue(
          this.claimlist1.result.gender
        );

        this.claimDetailsForm.controls['Address'].setValue(
          this.claimlist1.result.patientAddress
        );
        this.claimDetailsForm.controls['noofdays'].setValue(
          this.claimlist1.result.noOfDays
        );

        this.claimDetailsForm.controls['admissiondate'].setValue(
          this.claimlist1.result.dateOfAdmission
        );
        this.claimDetailsForm.controls['packageCost'].setValue(
          this.currencyPipe.transform(this.claimlist1.result.packageCost, 'INR')
        );

        this.claimDetailsForm.controls['blockedAmount'].setValue(
          this.currencyPipe.transform(
            this.claimlist1.result.hospitalClaimedAmount,
            'INR'
          )
        );
        this.claimDetailsForm.controls['procedureName'].setValue(
          this.claimlist1.result.procedureName
        );

        this.claimDetailsForm.controls['packageName'].setValue(
          this.claimlist1.result.packageName
        );
        this.claimDetailsForm.controls['totalClaimAmount'].setValue(
          this.claimlist1.result.hospitalClaimedAmount
        );

        this.actionAmount = this.claimlist1.result.hospitalClaimedAmount

        if (this.claimlist1.result.queryCount > 0) {
          $('#queryid').prop('disabled', true);
        } else {
          $('#queryid').removeAttr('disabled');
        }
        this.showProfilePic();
        this.getCPDTrigger();

      });
  }

  private createImage(image: Blob) {
    if (image && image.size > 0) {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        this.imageToShow = reader.result;
      }, false);
      reader.readAsDataURL(image);
    } else {
      this.isImage = false;
    }
  }

  showProfilePic() {
    this.headerService.getProfilePhoto(this.action.snaUserId).subscribe(data => {
      this.isImage = true;
      this.createImage(data);
    }, error => {
      this.isImage = false;
    });
  }

  getTreatmentHistory() {
    this.treatmenthistoryperurnService.searchbyUrn2(this.URN, this.jwtService.getJwtToken()).subscribe((data) => {
      this.treatmentHistoryList = data;
      if (this.treatmentHistoryList.length > 3) {
        document.getElementById('treatmentTable').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');
      }
    });
  }

  getOldTreatmentHistory() {
    this.treatmenthistoryperurnService.getOldTreatmentHistoryURNCPD(this.URN, this.jwtService.getJwtToken()).subscribe((data) => {
      if (data != null && data.status == 'success') {
        this.oldTreatmentHistoryList = data.data;
        if (this.oldTreatmentHistoryList.length > 3) {
          document.getElementById('oldTreatmentTable').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');
        }
      }
    });
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  submitClaim(actionType: String) {
    var claimID = this.claimId;
    var urnumber = this.URN;
    var userId = this.user.userId;
    var remarks = this.claimDetailsForm.controls['finalRemarks'].value;
    var reasonObj = this.claimDetailsForm.controls['reasonId'].value;
    var cpdApprovalAmnt = this.claimDetailsForm.controls['totalClaimAmount'].value;
    var mortalId = this.claimDetailsForm.controls['mortalityId'].value;
    var action;
    var count = 0;
    let type;
    if (actionType === 'approve') {
      action = 'Approve';
      type = 1;
    }
    else if (actionType === 'reject'){
      action = 'Reject';
      type = 2;
    }
    else if (actionType === 'query'){
      action = 'Query';
      type = 3;
    }
    var gfg = $.isNumeric(cpdApprovalAmnt);

    if (this.claimDetailsForm.controls['reasonId'].value == '') {
      Swal.fire('', 'Please select Remark', 'error');
      $('#reasonId').focus();
      return;
    } else if (
      reasonObj.reasonId == 57 &&
      this.claimDetailsForm.controls['finalRemarks'].value == ''
    ) {
      Swal.fire('', 'Please provide Description', 'error');
      $('#finalRemarksId').focus();
      return;
    } else if (reasonObj.reasonId != 58 && (cpdApprovalAmnt == '' || cpdApprovalAmnt == null)) {
      Swal.fire('', 'Approved Amount should not be left blank', 'error');
      $('#totalClaimAmountId').focus();
    } else if (reasonObj.reasonId != 58 && cpdApprovalAmnt == 0) {
      Swal.fire('', 'Approved Amount should not be zero', 'error');
      $('#totalClaimAmountId').focus();
    } else if (!gfg) {
      Swal.fire('', 'Approved Amount should be Numeric', 'error');
      $('#totalClaimAmountId').focus();
    } else if (Number(cpdApprovalAmnt) > Number(this.blockedAmount)) {
      Swal.fire(
        '',
        'Approved Amount should be less than claim amount',
        'error'
      );
      $('#totalClaimAmountId').focus();
    } else if ((this.claimDetailsForm.controls['mortalityId'].value == '' && action == 'Approve') || this.claimDetailsForm.controls['mortalityId'].value == '' && action == 'Reject') {
      Swal.fire('', 'Please select Mortality', 'error');
      $('#mortalityId').focus();
      return;
    } else if (remarks == '') {
      Swal.fire('', 'Please provide Description', 'error');
      $('#finalRemarksId').focus();
      return;
    } else if (this.action.dischargeSlip != null && this.action.dischargeSlip != undefined && this.discharge != 'true') {
      Swal.fire('', 'Please View Discharge slip', 'error');
      return;
    } else if (this.action.additinalSlip != null && this.action.additinalSlip != undefined && this.aditional != 'true') {
      Swal.fire('', 'Please View Additional Doc', 'error');
      return;
    } else if (this.action.preSurgerySlip != null && this.action.preSurgerySlip != undefined && this.pre != 'true') {
      Swal.fire('', 'Please View Pre Surgery ', 'error');
      return;
    } else if (this.action.postSurgerySlip != null && this.action.postSurgerySlip != undefined && this.post != 'true') {
      Swal.fire('', 'Please View Post Surgery ', 'error');
      return;
    } else if (this.action.intraSurgery != null && this.action.intraSurgery != undefined && this.intra != 'true') {
      Swal.fire('', 'Please View Intra Surgery ', 'error');
      return;
    } else if (this.action.specimenPhoto != null && this.action.specimenPhoto != undefined && this.speciman != 'true') {
      Swal.fire('', 'Please View Specimen Removal ', 'error');
      return;
    } else if (this.action.patientPhoto != null && this.action.patientPhoto != undefined && this.petient != 'true') {
      Swal.fire('', 'Please View Patient Photo', 'error');
      return;
    } else if (this.action.admissionSlip != null && this.action.admissionSlip != undefined && this.admission != 'true') {
      Swal.fire('', 'Please View Admission slip', 'error');
      return;
    } else if ((remarks.length < 30 && cpdApprovalAmnt < this.action.hospitalClaimedAmount && action == 'Approve') || (remarks.length < 30 && action == 'Reject') || (remarks.length < 30 && action == 'Query')) {
      Swal.fire('Info', 'Please provide description of atleast 30 characters', 'info');
      $('#finalRemarksId').focus();
      return;
    } else {
      this.requestedData = {
        claimId: claimID,
        userId: userId,
        actionRemark: action,
        remarks: remarks,
        actionRemarksId: reasonObj.reasonId,
        amount: cpdApprovalAmnt,
        urnNo: urnumber,
        mortality: mortalId,
        timingLogId: this.timingLogId,
        icdFlag: this.finalIcdObj.flag,
        icdFinalData: this.finalIcdObj.icdFinalAry
      };
      let sharedData = {
        claimId: claimID,
        actionType: type,
        claimNo:this.action?.claimNo,
        flag: action
      }

      if (this.action.hospitalClaimedAmount === cpdApprovalAmnt && actionType === 'approve') {
        Swal.fire({
          title: '',
          html: `You are Approving Full Claim Amount of <span style="color: red; font-weight: bold;">₹${this.action.hospitalClaimedAmount}</span>! Are you sure to Approve the Full Amount or Want to Re-Verify the Document?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes,Approve it',
          cancelButtonText: 'No',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: '',
              text: 'Do you want to ' + action + ' ?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
            }).then((result) => {
              if (result.isConfirmed) {
                if(this.isActionAuthAllow()){
                  this.irisService.setMessage(sharedData);
                }else{
                  this.submitClaimAction();
                }
              }
            });

          } else {
            // $('#totalClaimAmountId').focus();
          }
        });
      } else {
        Swal.fire({
          title: '',
          text: 'Do you want to ' + action + ' ?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
        }).then((result) => {
          if (result.isConfirmed) {
            if(this.isActionAuthAllow()){
              this.irisService.setMessage(sharedData);
            }else{
              this.submitClaimAction();
            }
          }
        });
      }
    }
  }

  calculate(event) {
    let data = event.target.value;
    if (data > this.blockedAmount)
      Swal.fire('Please enter amount less than blocked amount', '', 'info');
    else {
      this.claimDetailsForm.controls['totalClaimAmount'].setValue(
        this.currencyPipe.transform(data, ' ')
      );
    }
  }

  changeFormat(event) {
    let data = event.target.value;
    data = this.currencyPipe.transform(data, ' ');
    this.claimDetailsForm.patchValue({ totalClaimAmount: data });
    return data;
  }

  regex_amount_(e, id: string) {
    return (
      e.charCode === 0 ||
      (e.charCode >= 48 && e.charCode <= 57) ||
      (e.charCode == 46 &&
        (<HTMLInputElement>document.getElementById(id)).value.indexOf('.') < 0)
    );
  }
  documnetname: any = [];
  downloadAction(
    event: any,
    fileName: any,
    hCode: any,
    dateOfAdm: any,
    status
  ) {
    this.documnetname = [];
    let docStatus = status;
    this.documnetname.push(fileName);
    this.documentstatus = 0;
    // alert(docStatus);
    if (docStatus == 'discharge') {
      this.discharge = 'true';
      this.docCount++;
      this.disslipcheck = true;
      this.disslipuncheck = false;
    } else if (docStatus == 'speciman') {
      this.speciman = 'true';
      this.docCount++;
      this.speslipcheck = true;
      this.speslipuncheck = false;
    } else if (docStatus == 'post') {
      this.post = 'true';
      this.docCount++;
      this.postslipcheck = true;
      this.postslipuncheck = false;
    } else if (docStatus == 'intra') {
      this.intra = 'true';
      this.docCount++;
      this.intraslipcheck = true;
      this.intraslipuncheck = false;
    } else if (docStatus == 'patient') {
      this.petient = 'true';
      this.docCount++;
      this.patslipcheck = true;
      this.patslipuncheck = false;
    } else if (docStatus == 'admission') {
      this.admission = 'true';
      this.docCount++;
      this.admslipcheck = true;
      this.admslipuncheck = false;
    } else if (docStatus == 'aditional') {
      this.aditional = 'true';
      this.docCount++;
      this.addslipcheck = true;
      this.addslipuncheck = false;
    } else if (docStatus == 'pre') {
      this.pre = 'true';
      this.docCount++;
      this.preslipcheck = true;
      this.preslipuncheck = false;
    } else if (docStatus == 'aditionalOne') {
      this.aditionalOne = 'true';
      this.docCount++;
      this.addoconecheck = true;
      this.addoconeuncheck = false;
    } else if (docStatus == 'aditionalTwo') {
      this.aditionalTwo = 'true';
      this.docCount++;
      this.addoctwocheck = true;
      this.addoctwouncheck = false;
    } else if (docStatus == 'mortalitydoc') {
      this.mortalitydoc = 'true';
      this.docCount++;
      this.morslipcheck = true;
      this.morslipuncheck = false;
    }




    else if (docStatus == 'aditionaldoc1') {
      this.aditionaldoc1 = 'true';
      this.docCount++;
      this.addslip1check = true;
      this.addslip1uncheck = false;
    }
    else if (docStatus == 'aditionaldoc2') {
      this.aditionaldoc2 = 'true';
      this.docCount++;
      this.addslip2check = true;
      this.addslip2uncheck = false;
    }
    else if (docStatus == 'mortalityauditdoc') {
      this.mortalityauditdoc = 'true';
      this.docCount++;
      this.mortauditcheck = true;
      this.mortaudituncheck = false;
    }
    let target = event.target;

    if (
      target.nodeName == 'A' ||
      target.nodeName == 'a' ||
      target.nodeName == 'IMG' ||
      target.nodeName == 'img' ||
      target.nodeName == 'I' ||
      target.nodeName == 'i'
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
            this.DocumnetLog();
          },
          (error) => {
          }
        );
      }
    }
  }

  treatmentdetails() {
    localStorage.setItem('urn', this.URN);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.router.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/treatmenthistoryforcpd');
    });
  }

  packagedetails() {
    let urnNo = this.URN;
    let packagecode = this.packageCode;
    localStorage.setItem('urn', urnNo);
    localStorage.setItem('packagecode', packagecode);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.router.navigate([]).then((result) => {
      window.open('/bsky_portal/#/treatmenthistorypackage');
    });
  }

  OnChangeRemark(item) {
    let id = item.reasonId;
    if (id == '1') {
      $('#queryid').prop('disabled', true);
      $('#rejectid').prop('disabled', true);
      $('#approveid').removeAttr('disabled');
      $('#totalClaimAmountId').removeAttr('disabled');
    } else if (id == '58') {
      $('#queryid').prop('disabled', true);
      $('#approveid').prop('disabled', true);
      $('#rejectid').removeAttr('disabled');
      this.claimDetailsForm.controls['totalClaimAmount'].setValue(0);
      $('#totalClaimAmountId').prop('disabled', true);
    }
    /*    else if (this.claimlist1.result.queryCount > 0) {
          $('#rejectid').removeAttr('disabled');
          $('#approveid').removeAttr('disabled');
          $('#queryid').prop('disabled', true);
          $('#totalClaimAmountId').prop('disabled', true);
      } */
    else {
      // alert("Inside Else Part.")
      $('#queryid').removeAttr('disabled');
      $('#rejectid').removeAttr('disabled');
      $('#approveid').removeAttr('disabled');
      $('#totalClaimAmountId').removeAttr('disabled');
      // this.claimDetailsForm.controls['totalClaimAmount'].setValue(this.action.hospitalClaimedAmount);
    }
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,#%<>()-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  preauthLogDetails(authCode) {
    localStorage.setItem('urn', this.URN);
    localStorage.setItem('authorizedCode', authCode);
    localStorage.setItem('hospitalCode', this.hospitalCode);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.router.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/preauthhistory');
    });
  }

  viewDescription(descriptinDtls) {
    this.dtls = descriptinDtls;
    $('#appealDisposal').show();
  }

  modalClose() {
    $('#appealDisposal').hide();
    $('#triggermodal').hide();
  }

  approved_Amount(event: KeyboardEvent) {
    const pattern = /^[0-9\b]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
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
    this.router.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/multipackage');
    });
  }

  packageDetails(packCode: any, packageCatCode: any) {

    localStorage.setItem('packageCode', packCode);
    localStorage.setItem('packageCatCode', packageCatCode);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.router.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/packageDetails');
    });
  }

  files: any = [];
  documentstatus: any;
  viewAllDocument(dischargeSlip, additionalDoc, preSurgeryPic, postSurgeryPic, intraSurgeryPic, specimenRemovalPic, patientPic, mortalitydocument, additional_doc1, additional_doc2, mortality_audit_report) {
    this.files = [];
    this.documnetname = [];
    this.documentstatus = 1;
    if (dischargeSlip != null || dischargeSlip != undefined) {
      this.discharge = 'true';
      this.disslipcheck = true;
      this.disslipuncheck = false;
      this.documnetname.push(dischargeSlip);
      let jsonObj = {
        'f': dischargeSlip,
        'h': this.action.hospitalCode,
        'd': this.action.dateOfAdmission
      }
      this.files.push(jsonObj);
    }
    if (additionalDoc != null || additionalDoc != undefined) {
      this.aditional = 'true';
      this.addslipcheck = true;
      this.addslipuncheck = false;
      this.documnetname.push(additionalDoc);
      let jsonObj = {
        'f': additionalDoc,
        'h': this.action.hospitalCode,
        'd': this.action.dateOfAdmission
      }
      this.files.push(jsonObj);
    }
    if (preSurgeryPic != null || preSurgeryPic != undefined) {
      this.pre = 'true';
      this.preslipcheck = true;
      this.preslipuncheck = false;
      this.documnetname.push(preSurgeryPic);
      let jsonObj = {
        'f': preSurgeryPic,
        'h': this.action.hospitalCode,
        'd': this.action.dateOfAdmission
      }
      this.files.push(jsonObj);
    }
    if (postSurgeryPic != null || postSurgeryPic != undefined) {
      this.post = 'true';
      this.postslipcheck = true;
      this.postslipuncheck = false;
      this.documnetname.push(postSurgeryPic);
      let jsonObj = {
        'f': postSurgeryPic,
        'h': this.action.hospitalCode,
        'd': this.action.dateOfAdmission
      }
      this.files.push(jsonObj);
    }
    if (intraSurgeryPic != null || intraSurgeryPic != undefined) {
      this.intra = 'true';
      this.intraslipcheck = true;
      this.intraslipuncheck = false;
      this.documnetname.push(intraSurgeryPic);
      let jsonObj = {
        'f': intraSurgeryPic,
        'h': this.action.hospitalCode,
        'd': this.action.dateOfAdmission
      }
      this.files.push(jsonObj);
    }
    if (specimenRemovalPic != null || specimenRemovalPic != undefined) {
      this.speciman = 'true';
      this.speslipcheck = true;
      this.speslipuncheck = false;
      this.documnetname.push(specimenRemovalPic);
      let jsonObj = {
        'f': specimenRemovalPic,
        'h': this.action.hospitalCode,
        'd': this.action.dateOfAdmission
      }
      this.files.push(jsonObj);
    }
    if (patientPic != null || patientPic != undefined) {
      this.petient = 'true';
      this.patslipcheck = true;
      this.patslipuncheck = false;
      this.documnetname.push(patientPic);
      let jsonObj = {
        'f': patientPic,
        'h': this.action.hospitalCode,
        'd': this.action.dateOfAdmission
      }
      this.files.push(jsonObj);
    } if (mortalitydocument != null || mortalitydocument != undefined) {
      this.mortalitydoc = 'true';
      this.morslipcheck = true;
      this.morslipuncheck = false;
      this.documnetname.push(mortalitydocument);
      let jsonObj = {
        'f': mortalitydocument,
        'h': this.action.hospitalCode,
        'd': this.action.dateOfAdmission
      }
      this.files.push(jsonObj);
    } if (additional_doc1 != null || additional_doc1 != undefined) {
      this.aditionaldoc1 = 'true';
      this.addslip1check = true;
      this.addslip1uncheck = false;
      this.documnetname.push(additional_doc1);
      let jsonObj = {
        'f': additional_doc1,
        'h': this.action.hospitalCode,
        'd': this.action.dateOfAdmission
      }
      this.files.push(jsonObj);
    }

    if (additional_doc2 != null || additional_doc2 != undefined) {
      this.aditionaldoc2 = 'true';
      this.addslip2check = true;
      this.addslip2uncheck = false;
      this.documnetname.push(additional_doc2);
      let jsonObj = {
        'f': additional_doc2,
        'h': this.action.hospitalCode,
        'd': this.action.dateOfAdmission
      }
      this.files.push(jsonObj);
    }

    if (mortality_audit_report != null || mortality_audit_report != undefined) {
      this.mortalityauditdoc = 'true';
      this.mortauditcheck = true;
      this.mortaudituncheck = false;
      this.documnetname.push(mortality_audit_report);
      let jsonObj = {
        'f': mortality_audit_report,
        'h': this.action.hospitalCode,
        'd': this.action.dateOfAdmission
      }
      this.files.push(jsonObj);
    }

    this.cpdService.downloadAllDocuments(this.files).subscribe(data => {
      var result = data;
      let blob = new Blob([result], { type: result.type });
      let url = window.URL.createObjectURL(blob);
      window.open(url);
      this.DocumnetLog();
    });
  }

  oldClaimInfo() {
    localStorage.setItem('urn1', this.URN);
    localStorage.setItem('transactionDetailsId1', this.transactionid);
    localStorage.setItem('userId1', this.user.userId);
    localStorage.setItem('token1', this.jwtService.getJwtToken());
    this.router.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/Oldtreatmenthistoryforsna');
    });
  }

  getDetails(transactionId, claimId) {
    let trnsId = transactionId;
    let clmId = claimId;
    if (clmId != null || clmId != undefined) {
      localStorage.setItem("claimid", clmId);
      this.router.navigate([]).then(result => { window.open(environment.routingUrl + '/trackingdetailscpd'); });
    } else {
      localStorage.setItem("trnsId", trnsId);
      this.router.navigate(['/treatmentinfo']);
    }
  }

  downloadExcelTreatmentHistory() {
    let SlNo = 1;
    let report = [];
    let heading = [['Sl#', 'Case No', 'Claim No.', 'Procedure Code', 'Procedure Name', 'Patient Name',
      'Actual Admission Date', 'Discharge Date',
      'Hospital Claim Amount(₹)', 'CPD Approved Amount(₹)', 'SNA Approved Amount(₹)', 'Status']];

    let claim: any;
    this.treatmentHistoryList.forEach(element => {
      claim = {
        "Sl#": SlNo,
        "Case No": element.caseNo,
        "Claim No.": element.claimno,
        "Procedure Code": element.packagecode,
        "Procedure Name": element.packagename,
        "Patient Name": element.patientname,
        "Actual Date of Addmission": element.actualDateofadmission,
        "Actual Date of Discharge": element.actualDateofdischarge,
        "Hospital Claim Amount(₹)": element.totalamount != null ? element.totalamount : 'N/A',
        "CPD Approved Amount(₹)": element.cpdapproveamount != null ? element.cpdapproveamount : 'N/A',
        "SNA Approved Amount(₹)": element.snaapproveamount != null ? element.snaapproveamount : 'N/A',
        "Status": element.status
      }
      report.push(claim);
      SlNo++;
    });
    TableUtil.exportListToExcel(report, "Discharge Treatment Information", heading);
  }

  downloadExcelOldTreatmentHistory() {
    let SlNo = 1;
    let report = [];
    let heading = [['Sl#', 'URN', 'Invoice No.', 'Patient Name', 'Date of Admission', 'Actual Date of Admission', 'Date of Discharge', 'Actual Date of Discharge', 'Claim Status', 'Approved Amount(₹)', 'Approved Date', 'SNA Approved Amount(₹)', 'SNA Approved Date', 'Remarks', 'SNA Remarks']];

    let claim: any;
    this.oldTreatmentHistoryList.forEach(element => {
      claim = {
        "Sl#": SlNo,
        "URN": element.URN,
        "Invoice No.": element.invoiceNo,
        "Patient Name": element.patientName,
        "Date of Admission": element.dateOfAdmission,
        "Actual Date of Admission": element.actualDateOfAdmission,
        "Date of Discharge": element.dateOfDischarge,
        "Actual Date of Discharge": element.actualDateOfDischarge,
        "Claim Status": element.claimStatus,
        "Approved Amount(₹)": element.approvedAmount,
        "Approved Date": element.approvedDate,
        "SNA Approved Amount(₹)": element.SNAApprovedAmount,
        "SNA Approved Date": element.SNAApprovedDate,
        "Remarks": element.remark,
        "SNA Remarks": element.SNARemark
      }
      report.push(claim);
      SlNo++;
    });
    TableUtil.exportListToExcel(report, "Old Claim Information", heading);
  }

  openModal(head: any, body: any) {
    this.modalBody = body;
    this.modalTitle = head;
    $("#modal").show();
    $(".claim-detail").css("filter", "blur(5px)");
  }
  closeModal() {
    $("#modal").hide();
    $(".claim-detail").css("filter", "blur(0px)");
  }

  getPackageDetailsInfoList(txnPackageDetailsId: any) {
    this.cpdService.getPackageDetailsInfoList(txnPackageDetailsId).subscribe(data => {
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

  showProcedureName() {
    $('#procedureNameId').text(this.action.procedureName1);
    $('#showMoreId').empty()
    $('#showMoreId1').append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hideProcedureName() {
    let procedureName = this.action.procedureName1;
    if (procedureName.length > 30) {
      $('#procedureNameId').text(procedureName.substring(0, 30) + '...');
      $('#showMoreId1').empty()
      $('#showMoreId').empty();
      $('#showMoreId').append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  collapseAll() {
    if (this.collapse == 'Collapse All') {
      $('#collapseId').removeClass().addClass('btn bi-arrows-expand')
      this.collapse = 'Expand All';
    } else if (this.collapse == 'Expand All') {
      this.collapse = 'Collapse All';
      $('#collapseId').removeClass().addClass('btn bi-arrows-collapse')
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
  memberid: any
  urn: any
  hospitalcodedata: any
  getAuthenticationdetails(type: any) {
    if (type == 1) {
      this.isDisch = true;
    } else {
      this.isDisch = false;
    }
    this.memberid = this.action.MEMBERID;
    this.urn = this.action.URN;
    this.hospitalcodedata = this.action.hospitalCode;
    this.snoService.getauthentocationdetails(this.urn, this.memberid, type, this.hospitalcodedata, this.action.claimCaseNo).subscribe(
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
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  hospitalcode: any
  overridedetails: any = []
  getOverridedetails(overridecode: any) {
    this.memberid = this.action.MEMBERID;
    this.urn = this.action.URN;
    this.hospitalcode = this.action.hospitalCode;
    this.snoService.getOverridecodedetails(overridecode, this.memberid, this.urn, this.hospitalcode).subscribe(
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
        this.swal('', 'Something went wrong.', 'error');
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
  pkgDetailsData: any = [];
  overAllDetailsData: any = [];
  // modalShow:boolean =false;
  getPackageDetails(packageCode, subPackageCode, procedureCode) {
    this.snoService.getPackageDetails(packageCode, subPackageCode, procedureCode, this.action.hospitalCode).subscribe(
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
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  data: any;
  pagename: any
  userid: any
  insert: any
  DocumnetLog() {
    // this.user = JSON.parse(sessionStorage.getItem("user"))
    this.user = this.sessionService.decryptSessionData("user");
    this.pagename = "SNA Reverted",
      this.userid = this.user.userId,
      this.data = {
        "urnumber": this.URN,
        "documnetname": this.documnetname,
        "claimid": this.claimId,
        "userid": this.userid,
        "groupid": this.user.groupId,
        "documnetStatus": this.documentstatus,
        "pagenameAction": this.pagename,
      }
    this.cpdService.insertdocumnetstatus(this.data).subscribe(
      (data: any) => {
        let resData = data;
        this.insert = resData.data;
        if (this.insert.status == "success") {
          this.documnetname = [];
        } else {
        }
      }
    );
  }

  // getTriggerList(){
  //   this.service.getdynamicconfigurationlist().subscribe((data:any)=>{
  //     this.triggerList=data;
  //   })
  // }
  // tdCheck() {
  //   this.triggerList.forEach((data1:any,index)=>{
  //     this.meTrigger.forEach((data2:any)=>{
  //       if(data1.slno==data2.slNo){
  //         data1.show = true;
  //       }else{
  //         data1.show = false;
  //       }
  //     });
  //   });
  //   this.triggerList = this.triggerList.filter(item => item.show == true);
  // }
  // triggerDetails:any=[];
  // getTriggerDetails(data,claimId){
  //   if(data.show == false){
  //     return;
  //   }
  //   this.triggerDetails = [];
  //   this.snoService.getTriggerDetails(data.slno, claimId).subscribe(
  //       (data: any) => {
  //         let resData = data;
  //         if (resData.status == 'success') {
  //           // let results = resData.details;
  //           if(resData.details != null || resData.details != undefined){
  //             this.triggerDetails.push(resData.details);
  //             $('#triggermodal').show();
  //           }else{
  //             $('#triggermodal').hide();
  //           }
  //         } else {
  //           this.swal('', 'Something went wrong.', 'error');
  //         }
  //       },
  //       (error) => {
  //         this.swal('', 'Something went wrong.', 'error');
  //       }
  //   );
  // }

  triggerDetails: any = [];
  getTriggerDetails(data) {
    // if (data.show == false) {
    //   return;
    // }
    this.triggerDetails = [];
    if (data.slNo == 1 || data.slNo == 2 || data.slNo == 9) {
      this.snoService.getTriggerDetails(data).subscribe(
        (data: any) => {
          let resData = data;
          if (resData.status == 'success') {
            // let results = resData.details;
            if (resData.details != null || resData.details != undefined) {
              this.triggerDetails = resData.details;
              $('#triggermodal').show();
            } else {
              $('#triggermodal').hide();
            }
          } else {
            this.swal('', 'Something went wrong.', 'error');
          }
        },
        (error) => {
          this.swal('', 'Something went wrong.', 'error');
        }
      );
    } else {
      if (data != null && data != undefined) {
        this.triggerDetails.push(data);
        $('#triggermodal').show();
      } else {
        $('#triggermodal').hide();
      }
    }
  }

  checkAmount(event: any) {
    let amountDifference = Number(this.action.hospitalClaimedAmount) - Number(event.target.value);
    Swal.fire(
      'Info',
      'You are Entering ₹' + amountDifference + ' less amount than Hospital claim Amount.',
      'info'
    )
  }

  multiPackListcaseno: any = [];
  sum: number = 0;
  sum1: number = 0;
  sum2: number = 0;
  multipackthroughcaseno() {
    this.multiPackListcaseno = [];
    let caseno = this.action?.claimCaseNo;
    this.treatmenthistoryperurnService.multipackthroughcaseno(caseno).subscribe((data: any) => {
      this.multiPackListcaseno = data.multipackagecaseno;
      let sum = 0;
      let sum1 = 0;
      let sum2 = 0;
      for (let i = 0; i < this.multiPackListcaseno.length; i++) {
        sum += parseInt(this.multiPackListcaseno[i].dischargeAmount);
        sum1 += parseInt(this.multiPackListcaseno[i].cpdappamount);
        sum2 += parseInt(this.multiPackListcaseno[i].snaappamount);
      }
      this.sum = sum;
      this.sum1 = sum1;
      this.sum2 = sum2;
      this.getFamilytreatement();
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  ongointreatmnet: any = [];
  getOnGoingTreatmenthistory() {
    this.ongointreatmnet = [];
    let urno = this.URN;
    this.treatmenthistoryperurnService.getOnGoingTreatmenthistory(urno, this.user.userId).subscribe(data => {
      this.ongointreatmnet = data
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  patienttreatmnetlog: any = [];
  patienttreatmentlog() {
    this.patienttreatmnetlog = [];
    let urno = this.URN;
    this.treatmenthistoryperurnService.patienttreatmnetlog(urno, this.user.userId, this.transactionid).subscribe(data => {
      this.patienttreatmnetlog = data
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  getlistfamilydetails: any = [];
  getFamilytreatement() {
    this.getlistfamilydetails = [];
    let actualdateofadmission = this.Dateconvert(this.action?.ACTUALDATEOFADMISSION);
    let memeberid = this.action?.MEMBERID;
    this.treatmenthistoryperurnService.getFamilytreatement(actualdateofadmission, memeberid, this.URN).subscribe((data: any) => {
      this.getlistfamilydetails = data.famlylist;
      this.getPatientTreatmentLogThroughProcedureCode();
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  logdetails: any = [];
  getPatientTreatmentLogThroughProcedureCode() {
    this.logdetails = [];
    let procedureCode = this.action?.procedureCode1;
    let uidreferencenumber = this.action?.uidreferencenumber;
    this.treatmenthistoryperurnService.getPatientTreatmentLogThroughProcedureCode(procedureCode, uidreferencenumber).subscribe((data: any) => {
      this.logdetails = data.patientlist;
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  showPackagename(text, index) {
    $('#packagename' + index).text(text);
    $('#showMorepacke1' + index).empty()
    $('#showMorepacke2' + index).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hidePackagename(text, index) {
    if (text.length > 15) {
      $('#packagename' + index).text(text.substring(0, 15) + '...');
      $('#showMorepacke2' + index).empty()
      $('#showMorepacke1' + index).empty();
      $('#showMorepacke1' + index).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }


  showPackagenamepatient(text, index) {
    $('#packagenamepatient' + index).text(text);
    $('#showMorepacke3' + index).empty()
    $('#showMorepacke4' + index).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hidePackagenamepatient(text, index) {
    if (text.length > 15) {
      $('#packagenamepatient' + index).text(text.substring(0, 15) + '...');
      $('#showMorepacke4' + index).empty()
      $('#showMorepacke3' + index).empty();
      $('#showMorepacke3' + index).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  showPackagenameMultipack(text, index) {
    $('#packagenamemulti' + index).text(text);
    $('#showMorepacke5' + index).empty()
    $('#showMorepacke6' + index).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hidePackagenameMultipack(text, index) {
    if (text.length > 15) {
      $('#packagenamemulti' + index).text(text.substring(0, 15) + '...');
      $('#showMorepacke6' + index).empty()
      $('#showMorepacke5' + index).empty();
      $('#showMorepacke5' + index).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  showPackagenameongoing(text, index) {
    $('#packagenameongoing' + index).text(text);
    $('#showMorepacke7' + index).empty()
    $('#showMorepacke8' + index).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hidePackagenameongoing(text, index) {
    if (text.length > 15) {
      $('#packagenameongoing' + index).text(text.substring(0, 15) + '...');
      $('#showMorepacke8' + index).empty()
      $('#showMorepacke7' + index).empty();
      $('#showMorepacke7' + index).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  showPackagenametreatment(text, index) {
    $('#packagenametreatment' + index).text(text);
    $('#showMorepacke11' + index).empty()
    $('#showMorepacke12' + index).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hidePackagenametreatemnt(text, index) {
    if (text.length > 15) {
      $('#packagenametreatment' + index).text(text.substring(0, 15) + '...');
      $('#showMorepacke12' + index).empty()
      $('#showMorepacke11' + index).empty();
      $('#showMorepacke11' + index).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  showPackagenamePatientlog(text, index) {
    $('#packagenamepatientlog' + index).text(text);
    $('#showMorepacke13' + index).empty()
    $('#showMorepacke14' + index).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hidePackagenamePatientlog(text, index) {
    if (text.length > 15) {
      $('#packagenamepatientlog' + index).text(text.substring(0, 15) + '...');
      $('#showMorepacke14' + index).empty()
      $('#showMorepacke13' + index).empty();
      $('#showMorepacke13' + index).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }
  Dateconvert(date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy');
  }

  triggerdetails = [];
  triggerdetails1 = [];
  getCPDTrigger() {
    this.triggerdetails = [];
    this.triggerdetails1 = [];
    let hospitalcode = this.action?.hospitalCode;
    let dateofAdmission = this.Dateconvert(this.action?.dateOfAdmission);
    let dateofdischarge = this.Dateconvert(this.action?.dateOfDischarge);
    let procedurecode = this.action?.procedureCode1;
    this.treatmenthistoryperurnService.getCPDTriggerdetails(hospitalcode, dateofAdmission, dateofdischarge, procedurecode).subscribe((data: any) => {
      this.triggerdetails = data.cpdtrigerlist;
      this.triggerdetails1 = data.cpdtrigerlist1;
      console.log(this.triggerdetails);
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  getPackagepattern() {
    let hospitalcode = this.action?.hospitalCode;
    let dateofAdmission = this.Dateconvert(this.action?.dateOfAdmission);
    let dateofdischarge = this.Dateconvert(this.action?.dateOfDischarge);
    let procedurecode = this.action?.procedureCode1;
    let packageName = this.action?.packageName1;
    this.sessionService.encryptSessionData('hospitalcode', hospitalcode);
    this.sessionService.encryptSessionData('dateofAdmission', dateofAdmission);
    this.sessionService.encryptSessionData('dateofdischarge', dateofdischarge);
    this.sessionService.encryptSessionData('procedurecode', procedurecode);
    this.sessionService.encryptSessionData('procedurecode', procedurecode);
    this.sessionService.encryptSessionData('packageName', packageName);
    this.router.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/packagepattern');
    });
  }

  onAction(claimID: any, transactionID: any, URN: any, transClaimId: any, authorizedcode: any, hospitalcode: any, actualDate: any, caseNo: any, claimNo: any) {
    let actionTimeObject = {
      "caseNo": caseNo,
      "userId": this.user.userId,
      "claimNo": claimNo
    }
    var obj = 'claimID:' + claimID + ' transactionID:' + transactionID + ' URN:' + URN + ' transClaimId:' + transClaimId + ' authorizedCode:' + authorizedcode + ' hospitalCode:' + hospitalcode + ' actualDate:' + actualDate;
    console.log(obj);
    // this.router.navigateByUrl('/application/cpdapproval', { skipLocationChange: true }).then(() =>
    //   this.router.navigate(['/application/cpdapproval/action']));
    window.open(environment.routingUrl + '/application/cpdrevert/action');
    localStorage.setItem("cpdActionItems", obj);
    localStorage.setItem("actionTimeObject", JSON.stringify(actionTimeObject));
  }
  // Method to calculate total
  getTotal(property: string): number {
    return this.multiPackListcaseno.reduce((acc, item) => acc + (parseFloat(item[property]) || 0), 0);
  }
  // Method to format numbers as strings with commas
  formatNumber(value: number): string {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  files2: any = [];
  downloadalldocumnet() {
    this.documnetname = [];
    this.files2 = [];
    for (let document of this.documents) {
      this.documnetname.push(document.filename);
      if (document.filename) { // Check if file exists for the document
        let jsonObj = {
          'f': document.filename, // File name
          'h': document.hospitalcode, // Hospital code
          'd': document.dateofadmission // Date of admission
        };
        this.files2.push(jsonObj);
      }
    }
    console.log(this.files2);
    this.cpdService.downloadAllDocuments(this.files2).subscribe(data => {
      var result = data;
      let blob = new Blob([result], { type: result.type });
      let url = window.URL.createObjectURL(blob);
      window.open(url);
      this.DocumnetLog();
    });
  }
  getmultipledocumentthroughcaseno() {
    let caseno = this.action?.claimCaseNo;
    // let caseno = 'CASE/21162002/26022024/002';
    let loginid = this.user.userId;
    this.treatmenthistoryperurnService.getmultipledocumentList(caseno, loginid).subscribe((data: any) => {
      this.documents = data.mdocdata;
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  getdocumentdownload(event: any, filename: any, dateofadmission: any, hospitalcode: any) {
    this.documnetname = [];
    this.documnetname.push(filename);
    let target = event.target;
    if (
      target.nodeName == 'A' ||
      target.nodeName == 'a' ||
      target.nodeName == 'IMG' ||
      target.nodeName == 'img' ||
      target.nodeName == 'I' ||
      target.nodeName == 'i'
    ) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (filename != null) {
        this.snoService.downloadFiles(filename, hospitalcode, dateofadmission).subscribe(
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
  extentiondetails = [];
  warddetails = [];
  getwardnextentiondetails() {
    this.extentiondetails = [];
    this.warddetails = [];
    let claimCaseNo = this.action?.claimCaseNo;
    this.treatmenthistoryperurnService.getwardnextentiondetailsList(claimCaseNo).subscribe((data: any) => {
      this.extentiondetails = data.extenstionlist;
      this.warddetails = data.wardlist;
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  showextionshowlog(text, index) {
    $('#packagenamepatientlog' + index).text(text);
    $('#showMorepacke19' + index).empty()
    $('#showMorepacke20' + index).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  showextionhidelog(text, index) {
    if (text.length > 15) {
      $('#packagenamepatientlog' + index).text(text.substring(0, 15) + '...');
      $('#showMorepacke20' + index).empty()
      $('#showMorepacke19' + index).empty();
      $('#showMorepacke19' + index).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }
  isActionAuthAllow(){
    let isAction = this.user.isActionAuth;
    if(isAction == 0){
      return true;
    }else{
      return false;
    }
  }
  actionFlag:any;
  requestedData:any;
  submitClaimAction(){
    this.cpdService.cpdRevertClaimRequest(this.requestedData).subscribe(
      (response: any) => {
        var result = response;
        if (result.status == 'success') {
          Swal.fire(
            'SUCCESS',
            result.msg,
            'success'
          )
        } else if (result.status == 'info') {
          Swal.fire(
            'INFO',
            result.msg,
            'info'
          )
        }
        this.router.navigate(['/application/cpdrevert']);
      },
      (error) => {
        Swal.fire(
          'Some error occured',
          'Could not ' + this.actionFlag + ' ',
          'error'
        );
      }
    );
  }
}



