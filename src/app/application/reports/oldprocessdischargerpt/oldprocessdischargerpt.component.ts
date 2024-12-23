import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { MnthWiseDischargeMeService } from '../../Services/mnth-wise-discharge-me.service';
import { OldclmprocessblockrprtService } from '../../Services/oldclmprocessblockrprt.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
declare let $: any;
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';


@Component({
  selector: 'app-oldprocessdischargerpt',
  templateUrl: './oldprocessdischargerpt.component.html',
  styleUrls: ['./oldprocessdischargerpt.component.scss']
})
export class OldprocessdischargerptComponent implements OnInit {

  @ViewChild('auto') auto;
  @ViewChild('autocopy') autocopy;
  stickyear: any;
  searchby: any;
  selectedYear: any;
  years: any[] = [];
  Months: any;
  txtsearchDate: any;
  hospitalWisePackage: any = [];
  showPegi: boolean;
  pageElement: any;
  currentPage: any;
  user: any;
  selectedItems: any = [];
  stateList: any = [];
  districtList: any = [];
  hospitalList: any;
  hospitalCode: any;
  fromdate: any;
  todate: any;
  keyword: any = 'hospitalName';
  record: any = 0;
  stat: any;
  dist: any;
  showsdh: any = true;
  gramwisedata: any = [];
  showdischarge: any;
  userId: any;
  hospitalname: any = 'All';
  name: any;
  data: any;
  valuedata: string;
  statename: any = 'All';
  districtName: any = 'All';
  searchName: string;
  public serachdata: any = [];
  packagenamedata: any
  packageName: any;
  totaldays: number;
  dump: any;
  hospitalwise: any;
  documentType: any;
  statu: any;
  statusFlag: any;
  showdropdown: boolean;
  constructor(private mnthWiseDischargeMeService: MnthWiseDischargeMeService,
    public headerService: HeaderService,private sessionService: SessionStorageService,
    private snoService: SnocreateserviceService,
    private route: Router, public fb: FormBuilder, private oldclmblockrprtService: OldclmprocessblockrprtService) { }

  ngOnInit(): void {

    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId;
    this.headerService.setTitle('Old Claim Process Discharge Report');
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");

    if (this.user.groupId == 5) {
      this.name = this.user.fullName + '(' + this.user.userName + ')';
      this.showdropdown = true;
      $('#hospital').hide();
      $('#hospitalstate').hide();
    } else {
      this.showdropdown = false;
      $('#hospital').show();
      $('#hospitalstate').show();
    }
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
    this.getStateList();
  }

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = [];
        this.stateList = response;
        this.record = this.stateList.length;
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    $("#districtId").val("");
    this.auto.clear();
    this.hospitalCode = "";
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = [];
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }
  OnChangeDistrict(id) {
    this.auto.clear();
    this.hospitalCode = "";
    this.selectedItems = [];
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitalList = [];
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }

  selectEvent1(item) {
    this.hospitalCode = "";
    this.hospitalCode = item.hospitalCode;
    this.hospitalname = item.hospitalName;
  }
  onReset2() {
    this.auto.clear();
    this.hospitalCode = "";
    this.hospitalname = "All";
  }
  search() {
    let userId = this.user.userId;
    let fromDate = $('#fromDate').val();
    let toDate = $('#toDate').val();
    let stateId = $('#stateId').val();
    let districtId = $('#districtId').val();
    this.fromdate = new Date(fromDate);
    this.todate = new Date(toDate);
    this.fromdate = this.fromdate.getTime();
    this.todate = this.todate.getTime();
    let singleDay = 1000 * 60 * 60 * 24;
    this.totaldays = (this.todate - this.fromdate) / singleDay + 1;

    if (fromDate == null || fromDate == "" || fromDate == undefined) {
      this.swal("Info", "Please Select Actual Date of Discharge From", 'info');
      return;
    }
    if (toDate == null || toDate == "" || toDate == undefined) {
      this.swal("Info", "Please Select Actual Date of Discharge To", 'info');
      return;
    }
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('Info', ' From Date should be less than To Date', 'info');
      return;
    }

    if (stateId == undefined) {
      stateId = "";
    }
    if (districtId == undefined) {
      districtId = "";
    }
    if (this.hospitalCode == undefined) {
      this.hospitalCode = "";
    }
    this.stat = stateId;
    this.dist = districtId;
    this.fromdate = fromDate;
    this.todate = toDate;
    this.oldclmblockrprtService.oldprocessdischargeData(userId, this.fromdate, this.todate, this.stat, this.dist, this.hospitalCode).subscribe(
      (result) => {
        this.hospitalWisePackage = [];
        this.hospitalWisePackage = result;
        $('#tableopen').show();
        this.record = this.hospitalWisePackage.length;
        if (this.record > 0) {
          this.currentPage = 1;
          this.pageElement = 100;
          this.showPegi = true;
        }
        else {
          this.showPegi = false;
        }
      },
      (error) => console.log(error)
    )
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  getReset() {
    window.location.reload();
  }
  report: any = [];
  oldClaimProcessBlockRpt: any = {
    urn: "",
    invoiceno: "",
    claimno: "",
    hospitalname: "",
    hospitalCode: "",
    hospitalDistrictName: "",
    incentiveStatus: "",
    patientname: "",
    gender: "",
    packageCode: "",
    packageCost: "",
    packageProcedurename: "",
    actualdateofadmission: "",
    actualdateofdischarge: "",
    mortality: "",
    cpdMortality: "",
    hospitalclaimedamount: "",
    implantData: "",
    cpdclaimstatus: "",
    cpdremarks: "",
    cpdApprovedAmount: "",
    snaremarks: "",
    snaApprovedAmount: ""
  };
  heading = [['Sl No.', 'URN', 'Invoice No.', 'Claim No. ', 'Hospital Name ', 'District', 'GJAY Incentive Status', 'Patient Name ', 'Gender', 'Package Code', 'Package Cost',
    'Package Procedure', 'Actual Date Of Admission', 'Actual Date Of Discharge ', 'Mortality (Hospital)', 'Mortality (CPD)', 'Hospital Claimed Amount', 'Implant Data ',
    'CPD Claim Status', 'CPD Remarks', 'CPD Approved Amount', 'SNA Remarks', 'SNA Approved Amount']];
  downloadReport(type) {
    if (this.hospitalWisePackage == null || this.hospitalWisePackage.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    this.report = [];
    let item: any;
    for (var i = 0; i < this.hospitalWisePackage.length; i++) {
      item = this.hospitalWisePackage[i];
      this.oldClaimProcessBlockRpt = [];
      this.oldClaimProcessBlockRpt.slNo = i + 1;
      this.oldClaimProcessBlockRpt.urn = item.urn;
      this.oldClaimProcessBlockRpt.invoiceno = item.invoiceno;
      this.oldClaimProcessBlockRpt.claimno = item.claimno;
      this.oldClaimProcessBlockRpt.hospitalName = item.hospitalname + '(' + item.hospitalCode + ')';
      this.oldClaimProcessBlockRpt.hospitalDistrictName = item.hospitalDistrictName;
      this.oldClaimProcessBlockRpt.incentiveStatus = item.incentiveStatus;
      this.oldClaimProcessBlockRpt.patientname = item.patientname;
      this.oldClaimProcessBlockRpt.gender = item.gender;
      this.oldClaimProcessBlockRpt.packageCode = item.packageCode;
      this.oldClaimProcessBlockRpt.packageCost = this.convertCurrency(item.packageCost);
      this.oldClaimProcessBlockRpt.packageProcedurename = item.packageProcedurename;
      this.oldClaimProcessBlockRpt.actualdateofadmission = this.convertDate1(item.actualdateofadmission);
      this.oldClaimProcessBlockRpt.actualdateofdischarge = this.convertDate1(item.actualdateofdischarge);
      this.oldClaimProcessBlockRpt.mortality = item.mortality;
      this.oldClaimProcessBlockRpt.cpdMortality = item.cpdMortality;
      if (item.hospitalclaimedamount != null) {
        this.oldClaimProcessBlockRpt.hospitalclaimedamount = this.convertCurrency(item.hospitalclaimedamount);
      } else {
        this.oldClaimProcessBlockRpt.hospitalclaimedamount = "N/A";
      }
      this.oldClaimProcessBlockRpt.implantData = item.implantData;
      this.oldClaimProcessBlockRpt.cpdclaimstatus = item.cpdclaimstatus;
      this.oldClaimProcessBlockRpt.cpdremarks = item.cpdremarks;
      if (item.cpdApprovedAmount != null) {
        this.oldClaimProcessBlockRpt.cpdApprovedAmount = this.convertCurrency(item.cpdApprovedAmount);
      } else {
        this.oldClaimProcessBlockRpt.cpdApprovedAmount = "N/A";
      }
      this.oldClaimProcessBlockRpt.snaremarks = item.snaremarks;
      if (item.snaApprovedAmount != null) {
        this.oldClaimProcessBlockRpt.snaApprovedAmount = this.convertCurrency(item.snaApprovedAmount);
      } else {
        this.oldClaimProcessBlockRpt.snaApprovedAmount = "N/A";
      }
      this.report.push(this.oldClaimProcessBlockRpt);
    }

    for (let i = 0; i < this.stateList.length; i++) {
      if (this.stateList[i].stateCode == this.stat) {
        this.statename = this.stateList[i].stateName
      }
    }
    for (let i = 0; i < this.districtList.length; i++) {
      if (this.districtList[i].districtcode == this.dist) {
        this.districtName = this.districtList[i].districtname;
      }
    }
    if (type == 1) {
      let filter = [];
      if (this.user.groupId == 1) {
        filter.push([[' Actual Admission Date From :-', this.fromdate]]);
        filter.push([[' Actual Admission Date To :-', this.todate]]);
        filter.push([['State:- ', this.statename]]);
        filter.push([['District Name:-', this.districtName]]);
        filter.push([['Hospital Name:-', this.hospitalname]]);
      }else  if (this.user.groupId ==5){
        filter.push([[' Actual Admission Date From :-', this.fromdate]]);
        filter.push([[' Actual Admission Date To :-', this.todate]]);
        filter.push([['Hospital Name:-', this.name]]);
      }
      TableUtil.exportListToExcelWithFilter(this.report, "Old Claim Process Discharge Report", this.heading, filter);
    }
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }

  convertDate1(actualDisDate) {
    var datePipe = new DatePipe("en-US");
    actualDisDate = datePipe.transform(actualDisDate, 'dd-MMM-yyyy ');
    return actualDisDate;
  }

  convertCurrency(totalAmtClaimed: any): any {
    var formatter = new CurrencyPipe('en-US');
    totalAmtClaimed = formatter.transform(totalAmtClaimed, '', '');
    return totalAmtClaimed;
  }

}
