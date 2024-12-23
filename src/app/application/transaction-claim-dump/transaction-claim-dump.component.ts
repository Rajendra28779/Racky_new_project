import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../header.service';
import { SnamasterserviceService } from '../Services/snamasterservice.service';
import { TransationClaimDumpserviceService } from '../Services/transation-claim-dumpservice.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-transaction-claim-dump',
  templateUrl: './transaction-claim-dump.component.html',
  styleUrls: ['./transaction-claim-dump.component.scss']
})
export class TransactionClaimDumpComponent implements OnInit {
  selectedItems: any = [];
  childmessage: any;

  data1: any = [];
  data2:any
  userId: any;
  user: any;
  datavalue:any
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  hospitalId: any;
  districtId: any;
  stateId: any;
  keyword: any = "hospitalName";
  keyword1: any = "districtname";
  keyword2: any = "stateName";
  @ViewChild('auto') auto;
  @ViewChild('auto1') auto1;
  @ViewChild('auto2') auto2;

  data:{
    TOATL_DISCHAGED:any,
    TOTAL_SUBMITTED:any,
    TOTAL_NOTSUBMITTED:any,
  }
  constructor(private sessionService: SessionStorageService,private transationClaimdumpserviceservice: TransationClaimDumpserviceService,private snamasterService: SnamasterserviceService,public headerService:HeaderService) { }

  ngOnInit(): void {
    this.headerService.setTitle(' Transation Claim Dump Report');
    this.user = this.sessionService.decryptSessionData("user");
    // this.userId=this.user.userId
    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let date2=date.getDate();
    let month: any = date.getMonth();
    let month1: any = date.getMonth()-1;
    if (month == 0) {
      month = 'Jan';
    } else if (month == 1) {
      month = 'Feb';
    } else if (month == 2) {
      month = 'Mar';
    } else if (month == 3) {
      month = 'Apr';
    } else if (month == 4) {
      month = 'May';
    } else if (month == 5) {
      month = 'Jun';
    } else if (month == 6) {
      month = 'Jul';
    } else if (month == 7) {
      month = 'Aug';
    } else if (month == 8) {
      month = 'Sep';
    } else if (month == 9) {
      month = 'Oct';
    } else if (month == 10) {
      month = 'Nov';
    } else if (month == 11) {
      month = 'Dec';
    }
    var frstDay = date1 + "-" + month + "-" + year;
    var secoundDay = date2 + "-" + month + "-" + year;

    //Date input placeholder
    $('input[name="fromDate"]').val(secoundDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");

     $('input[name="toDate"]').val(secoundDay);
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.getStateList();
    this.Search();
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  getStateList() {
    this.snamasterService.getStateList(this.user.userId).subscribe(
      (response) => {
        this.stateList = response;
        console.log(this.stateList);
      },
      (error) => console.log(error)
    )
  }
  OnChangeState(id) {
    this.auto1.clear();
    this.auto.clear();
    this.districtId = '';
    this.hospitalId = '';
    this.auto.clear();
    this.hospitalList = [];
    localStorage.setItem("stateCode", id);
    this.snamasterService.getDistrictListByStateId(this.user.userId, id).subscribe(
      (response) => {
        this.districtList = response;
        console.log(response);
      },
      (error) => console.log(error)
    )
  }
  OnChangeDistrict(id) {
    this.hospitalId = '';
    this.auto.clear();
    var stateCode = localStorage.getItem("stateCode");
    this.snamasterService.getHospitalbyDistrictId(this.user.userId, id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
        console.log(response);
      },
      (error) => console.log(error)
    )
  }
  selectEvent(item) {
    // do something with selected item
    this.hospitalId = item.hospitalCode;
  }

  clearEvent() {
    this.hospitalId = '';
  }

  selectEvent1(item) {
    // do something with selected item
    this.districtId = item.districtcode;
    this.OnChangeDistrict(this.districtId);
  }

  clearEvent1() {
    this.districtId = '';
    this.OnChangeDistrict(this.districtId);
  }

  selectEvent2(item) {
    // do something with selected item
    this.stateId = item.stateCode;
    this.OnChangeState(this.stateId);
  }

  clearEvent2() {
    this.stateId = '';
    this.OnChangeState(this.stateId);
  }
  Search(){
    let userID=this.user.userId;
    let formdate=$('#datepicker1').val().toString().trim();
    let toDate=$('#datepicker2').val().toString().trim();
     this.stateId = this.stateId;
    this.districtId = this.districtId;
    this.hospitalId = this.hospitalId;
    if (this.stateId == null  || this.stateId == undefined) {
      this.stateId="";
    }
    if (this.districtId == null  || this.districtId == undefined) {
      this.districtId="";
    }
    if (this.hospitalId == null  || this.hospitalId == undefined) {
      this.hospitalId="";
    }
    this.transationClaimdumpserviceservice.transactionclaimdumpreport(userID,formdate,toDate,this.stateId,this.districtId,this.hospitalId).subscribe(
      (response) => {
        this.data1=response;
        for(let i=0;i<this.data1.length;i++){
          this.datavalue=this.data1[i];
        }
      },
      (error) => console.log(error)
    )
  }
  resetTable() {
    window.location.reload();
  }
  Details(){
    let formdate=$('#datepicker1').val().toString().trim();
    let toDate=$('#datepicker2').val().toString().trim();
    this.transationClaimdumpserviceservice.transactionclaimdumpreportdetails(formdate,toDate).subscribe(
      (response) => {

        this.data2=response;
        if(this.data2.length>0){
          this.downloadReport();
        }

        console.log(response);
      },
      (error) => console.log(error)
    )

  }
  report: any = [];
  sno: any = {
    Slno: '',
    TRANSACTIONID: '',
    INVOICENO: '',
    URN: '',
    STATECODE: '',
    DISTRICTCODE: '',
    MEMBERID: '',
    FPVERIFIERID: '',
    HOSPITALCODE: '',
    HOSPITALAUTHORITYID: '',
    TRANSACTIONCODE: '',
    TRANSACTIONTYPE: '',
    TRANSACTIONDATE: '',
    TRANSACTIONTIME: '',
    PACKAGECODE: '',
    TOTALAMOUNTCLAIMED: '',
    TOTALAMOUNTBLOCKED: '',
    INSUFFCIENTFUND: '',
    INSUFFCIENTAMT: '',
    NOOFDAYS: '',
    DATEOFADMISSION: '',
    DATEOFDISCHARGE: '',
    MORTALITY: '',
    TRANSACTIONDESCRIPTION: '',
    AMOUNTCLAIMED: '',
    TRAVELAMOUNTCLAIMED: '',
    CURRENTTOTALAMOUNT: '',
    REVISEDDATE: '',
    ID: '',
    PATIENTNAME: '',
    FAMILYHEADNAME: '',
    VERIFIERNAME: '',
    TRAVELAMOUNT: '',
    GENDER: '',
    UPLOADSTATUS: '',
    TRANSACTION_DATE: '',
    UNBLOCKAMOUNT: '',
    ROUND: '',
    BLOCKCODE: '',
    PANCHAYATCODE: '',
    VILLAGECODE: '',
    AGE: '',
    STATENAME: '',
    DISTRICTNAME: '',
    BLOCKNAME: '',
    PANCHAYATNAME: '',
    VILLAGENAME: '',
    ACTUALDATEOFDISCHARGE: '',
    REGISTRATIONNO: '',
    POLICYSTARTDATE: '',
    POLICYENDDATE: '',
    HOSPITALNAME: '',
    PROCEDURENAME: '',
    PACKAGENAME: '',
    PACKAGECATEGORYCODE: '',
    PACKAGEID: '',
    HOSPITALSTATECODE: '',
    HOSPITALDISTRICTCODE: '',
    ACTUALDATEOFADMISSION: '',
    AUTHORIZEDCODE: '',
    MANUALTRANSACTION: '',
    CLAIMID: '',
    TRIGGERFLAG: '',
    REFERRALCODE: '',
    NABH: '',
    HOSPITALCLAIMEDAMOUNT: '',
    CLAIMRAISESTATUS: '',
    TRANSACTIONDETAILSID: '',
    DISCHARGE_DOC: '',
    STATUSFLAG: '',
    CREATEDON: '',
    CLAIM_ID: '',
    IMPLANT_DATA: '',
    DATEOFDISCHARGE_TEMP: '',
    CLAIM_RAISED_BY: '',
    DATEOFADMISSION_TEMP: '',
    PATIENTPHONENO: '',
    SYS_REJ_STATUS: '',
    SEQUENCE_ID: '',
    TRANID_PK: '',
    REC_CR_DTN: '',
    BATCH_NO: '',
    REJECTED_STATUS: '',
    CLAIMSUBMITTED: '',
    CLAIMSTATUS: '',
 };
  heading = [
    [
      'Sl#',
      'TRANSACTION ID',
      'INVOICE NO',
      'URN',
      'STATE CODE',
      'DISTRICT CODE',
      'MEMBER ID',
      'FPVERIFIER ID',
      'HOSPITAL CODE',
      'HOSPITAL AUTHORITY ID',
      'TRANSACTION CODE',
      'TRANSACTION TYPE',
      'TRANSACTION DATE',
      'TRANSACTION TIME',
      'PACKAGE CODE',
      'TOTAL AMOUNT CLAIMED',
      'TOTAL AMOUNT BLOCKED',
      'INSUFFCIENT FUND',
      'INSUFFCIENT AMT',
      'NO OF DAYS',
      'DATE OF ADMISSION',
      'DATE OF DISCHARGE',
      'MORTALITY',
      'TRANSACTION DESCRIPTION',
      'AMOUNT CLAIMED',
      'TRAVEL AMOUNT CLAIMED',
      'CURRENT TOTAL AMOUNT',
      'REVISED DATE',
      'ID',
      'PATIENT NAME',
      'FAMILY HEAD NAME',
      'VERIFIER NAME',
      'TRAVEL AMOUNT',
      'GENDER',
      'UPLOAD STATUS',
      'TRANSACTION DATE',
      'UNBLOCK AMOUNT',
      'ROUND',
      'BLOCKCODE',
      'PANCHAYAT CODE',
      'VILLAGE CODE',
      'AGE',
      'STATE NAME',
      'DISTRICT NAME',
      'BLOCK NAME',
      'PANCHAYAT NAME',
      'VILLAGE NAME',
      'ACTUAL DATE OF DISCHARGE',
      'REGISTRATION NO',
      'POLICYSTART DATE',
      'POLICYEND DATE',
      'HOSPITAL NAME',
      'PROCEDURENAME',
      'PACKAGENAME',
      'PACKAGECATEGORYCODE',
      'PACKAGEID',
      'HOSPITALSTATECODE',
      'HOSPITAL DISTRICT CODE',
      'ACTUAL DATE OF ADMISSION',
      'AUTHORIZED CODE',
      'MANUAL TRANSACTION',
      'CLAIMID',
      'TRIGGER FLAG',
      'REFERRAL CODE',
      'NABH',
      'HOSPITALCLAIMEDAMOUNT',
      'CLAIMRAISESTATUS',
      'TRANSACTIONDETAILSID',
      'DISCHARGE_DOC',
      'STATUSFLAG',
      'CREATED ON',
      'URCLAIM_IDN',
      'IMPLANT_DATA',
      'DATEOFDISCHARGE_TEMP',
      'CLAIM_RAISED_BY',
      'DATEOFADMISSION_TEMP',
      'PATIENT PHONE NO',
      'SYS_REJ_STATUS',
      'SEQUENCE_ID',
      'TRANID_PK',
      'REC_CR_DT',
      'BATCH_NO',
      'CLAIMSUBMITTED',
      'CLAIMRAISESTATUS',
       ],
  ];
  downloadReport(){
    this.report = [];
    let claim: any;


    for (var i = 0; i < this.data2.length; i++) {
      claim = this.data2[i];
      console.log(claim);
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.TRANSACTIONID = claim.transactionid;
      this.sno.INVOICENO = claim.invoiceno;
      this.sno.URN = claim.urn;
      this.sno.STATECODE = claim.statecode;

      this.sno.DISTRICTCODE= claim.districtcode;

      this.sno.MEMBERID = claim.memberid;
      this.sno.FPVERIFIERID = claim.fpverifierid;
      this.sno.HOSPITALCODE = claim.hospitalcode;
      this.sno.HOSPITALAUTHORITYID = claim.hospitalauthorityid;
      this.sno.TRANSACTIONCODE = claim.transactioncode;
      this.sno.TRANSACTIONTYPE = claim.transactiontype;
      this.sno.TRANSACTIONDATE = claim.transactiondate;
      this.sno.TRANSACTIONTIME = claim.transactiontime;
      this.sno.PACKAGECODE = claim.packagecode;
      this.sno.TOTALAMOUNTCLAIMED = claim.totalamountclaimed;
      this.sno.TOTALAMOUNTBLOCKED = claim.totalamountblocked;
      this.sno.INSUFFCIENTFUND = claim.insuffcientfund;
      this.sno.INSUFFCIENTAMT = claim.insuffcientamt;
      this.sno.NOOFDAYS = claim.noofdays;
      this.sno.DATEOFADMISSION = claim.dateofadmission;
      this.sno.DATEOFDISCHARGE = claim.dateofdischarge;
      this.sno.MORTALITY = claim.mortality;
      this.sno.TRANSACTIONDESCRIPTION = claim.transactiondescription;
      this.sno.AMOUNTCLAIMED = claim.amountclaimed;
      this.sno.TRAVELAMOUNTCLAIMED = claim.travelamountclaimed;
      this.sno.CURRENTTOTALAMOUNT = claim.currenttotalamount;
      this.sno.REVISEDDATE = claim.revised_DATE;
      this.sno.ID = claim.id;
      this.sno.PATIENTNAME = claim.patientname;
      this.sno.FAMILYHEADNAME = claim.familyheadname;
      this.sno.VERIFIERNAME = claim.verifiername;
      this.sno.TRAVELAMOUNT = claim.travelamount;
      this.sno.GENDER = claim.gender;
      this.sno.UPLOADSTATUS = claim.uploadstatus;
      this.sno.TRANSACTION_DATE = claim.round;
      this.sno.UNBLOCKAMOUNT = claim.unblockamount;
      this.sno.ROUND = claim.age;
      this.sno.BLOCKCODE = claim.blockcode;
      this.sno.PANCHAYATCODE = claim.panchayatcode;
      this.sno.VILLAGECODE = claim.villagecode;
      this.sno.AGE = claim.age;
      this.sno.STATENAME = claim.statename;
      this.sno.DISTRICTNAME = claim.districtname;
      this.sno.BLOCKNAME = claim.blockname;
      this.sno.PANCHAYATNAME = claim.panchayatname;
      this.sno.VILLAGENAME = claim.villagename;
      this.sno.ACTUALDATEOFDISCHARGE = claim.actualdateofdischarge;
      this.sno.REGISTRATIONNO = claim.registrationno;
      this.sno.POLICYSTARTDATE = claim.policystartdate;
      this.sno.POLICYENDDATE = claim.policyenddate;
      this.sno.HOSPITALNAME = claim.hospitalname;
      this.sno.PROCEDURENAME = claim.procedurename;
      this.sno.PACKAGENAME = claim.packagename;
      this.sno.PACKAGECATEGORYCODE = claim.packagecategorycode;
      this.sno.PACKAGEID = claim.packageid;
      this.sno.HOSPITALSTATECODE = claim.hospitalstatecode;
      this.sno.HOSPITALDISTRICTCODE = claim.hospitaldistrictcode;
      this.sno.ACTUALDATEOFADMISSION = claim.actualdateofadmission;
      this.sno.AUTHORIZEDCODE = claim.authorizedcode;
      this.sno.MANUALTRANSACTION = claim.manualtransaction;
      this.sno.CLAIMID = claim.claimid;
      this.sno.TRIGGERFLAG = claim.triggerflag;
      this.sno.REFERRALCODE = claim.referralcode;
      this.sno.NABH = claim.nabh;
      this.sno.HOSPITALCLAIMEDAMOUNT = claim.hospitalclaimedamount;
      this.sno.CLAIMRAISESTATUS = claim.claimraisestatus;
      this.sno.TRANSACTIONDETAILSID = claim.transactiondetailsid;
      this.sno.DISCHARGE_DOC = claim.discharge_DOC;
      this.sno.STATUSFLAG = claim.statusflag;
      this.sno.CREATEDON = claim.createdon;
      this.sno.CLAIM_ID = claim.claim_ID;
      this.sno.IMPLANT_DATA = claim.implant_DATA;
      this.sno.DATEOFDISCHARGE_TEMP = claim.dateofdischarge_TEMP;
      this.sno.CLAIM_RAISED_BY = claim.claim_RAISED_BY;
      this.sno.DATEOFADMISSION_TEMP = claim.dateofadmission_TEMP;
      this.sno.PATIENTPHONENO = claim.patientphoneno;
      this.sno.SYS_REJ_STATUS = claim.sys_REJ_STATUS;
      this.sno.SEQUENCE_ID = claim.sequence_ID;
      this.sno.TRANID_PK = claim.tranid_PK;
      this.sno.REC_CR_DT = claim.rec_CR_DT;
      this.sno.BATCH_NO = claim.batch_NO;
      this.sno.REJECTED_STATUS = claim.rejected_STATUS;
      this.sno.CLAIMSUBMITTED = claim.claimsubmitted;
      this.sno.CLAIMSTATUS = claim.claimraisestatus;





      this.report.push(this.sno);
      console.log(this.report);
      console.log(this.sno);
    }
    TableUtil.exportListToExcel(
      this.report,
      'CPD Received Count Report',
      this.heading
    );
  }

}
