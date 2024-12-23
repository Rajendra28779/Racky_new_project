import { Component, OnInit, ViewChild } from '@angular/core';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
declare let $: any;
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HeaderService } from '../../header.service';
import Swal from 'sweetalert2';
import { MnthWiseDischargeMeService } from '../../Services/mnth-wise-discharge-me.service';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { window } from 'rxjs';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-mnth-wise-floatdtls-rert',
  templateUrl: './mnth-wise-floatdtls-rert.component.html',
  styleUrls: ['./mnth-wise-floatdtls-rert.component.scss']
})
export class MnthWiseFloatdtlsRertComponent implements OnInit {
  @ViewChild('auto') auto;
  @ViewChild('autocopy') autocopy;

  showhide: any;
  showdropdown: any;
  hospitalCode: any;
  selectedItems: any = [];
  stateList: any = [];
  districtList: any = [];
  hospitalList: any;

  keyword: any = 'hospitalName';
  user: any;
  userId: any;
  form: FormGroup;
  record: any;
  name: any;
  hospitalWisePackage: any = [];
  stat: any;
  dist: any;
  fromdate: any;
  todate: any;
  currentPage: number;
  pageElement: number;
  showPegi: boolean;
  distName: string;
  totaldays: any;
  from: any;
  tod: any;
  constructor(private snoService: SnocreateserviceService, public fb: FormBuilder, public headerService: HeaderService,private sessionService: SessionStorageService,
     private mnthWiseDischargeMeService: MnthWiseDischargeMeService) { }

  ngOnInit(): void {
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId;
    this.form = this.fb.group({
      name: new FormControl(''),
    })
    this.headerService.setTitle('Month Wise Finance Details Report');
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");

    if (this.user.groupId == 4) {
      this.name = this.user.fullName;
      this.showdropdown = true;
    } else {
      this.showdropdown = false;
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
    $('#tableopen').hide();
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
    // this.auto.clear();
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
    // this.auto.clear();
    this.hospitalCode = "";

  }
  getcountlist() {

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
    if (this.totaldays > 31) {
      this.swal('', 'You can Search maximum 31 days', 'error');
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
    this.mnthWiseDischargeMeService.monthWiseFloatData(userId, this.fromdate, this.todate, this.stat, this.dist, this.hospitalCode).subscribe(
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

  getReset() {
    history.go(0);
  }
  report: any = [];

  snaPendingClaimList: any = {
    slNo: "",
    hospitalCode: "",
    hospitalName: "",
    hospStateName: "",
    hospDistrictName: "",
    month: "",
    year: "",
    patientDistName: "",
    urn: "",
    invoiceNo: "",
    claimNo: "",
    caseNo: "",
    patientName: "",
    gender: "",
    procedureName: "",
    packageName: "",
    packageCatgCode: "",
    packageId: "",
    packageCost: "",
    actualDischargeDate: "",
    mortalityHospital: "",
    mortalityCpd: "",
    hospitalClaimAmt: "",
    implantData: "",
    cpdClaimStatus: "",
    cpdRemark: "",
    cpdApproveAmt: "",
    snaClaimStatus: "",
    snaRemark: "",
    snaApproveAmt: ""
  };

  heading = [['Sl No.', 'Hospital Name', 'Hospital Code', 'Hospital State Name', ' Hospital District Name', 'Month', 'Year', 'URN', 'Invoice No.', 'Claim No.', 'Case No.', 'Patient Name',
    'Gender', 'Patient District Name', 'Procedure Name', 'Package Name', 'Package Category Code', 'Package Id', 'Package Cost',
    'Actual Date of Discharge', 'Mortality Hospital', 'Mortality CPD', 'Hospital Claim Amount', 'Implant Data', 'CPD Claim Status', 'CPD Remark', 'CPD Approve Amount', 'SNA Claim Status', 'SNA Remark', 'SNA Approve Amount'
  ]];

  statename: any = "ALL";
  districtName: any = "ALL";
  hospitalname = "ALL";

  downloadReport(type) {
    if (this.hospitalWisePackage == null || this.hospitalWisePackage.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    this.report = [];
    let item: any;
    for (var i = 0; i < this.hospitalWisePackage.length; i++) {
      item = this.hospitalWisePackage[i];
      this.snaPendingClaimList = [];
      this.snaPendingClaimList.slNo = i + 1;
      this.snaPendingClaimList.hospitalName = item.hospitalName
      this.snaPendingClaimList.hospitalCode = item.hospitalCode;
      this.snaPendingClaimList.hospStateName = item.hospStateName;
      this.snaPendingClaimList.hospDistrictName = item.hospDistrictName;
      this.snaPendingClaimList.month = item.month;
      this.snaPendingClaimList.year = item.year;
      this.snaPendingClaimList.urn = item.urn;
      this.snaPendingClaimList.invoiceNo = item.invoiceNo;
      this.snaPendingClaimList.claimNo = item.claimNo;
      this.snaPendingClaimList.caseNo = item.caseNo;
      this.snaPendingClaimList.patientName = item.patientName;
      this.snaPendingClaimList.gender = item.gender;
      this.snaPendingClaimList.patientDistName = item.patientDistName;
      this.snaPendingClaimList.procedureName = item.procedureName;
      this.snaPendingClaimList.packageName = item.packageName;
      this.snaPendingClaimList.packageCatgCode = item.packageCatgCode;
      this.snaPendingClaimList.packageId = item.packageId;
      this.snaPendingClaimList.packageCost = this.convertAmt(item.packageCost);
      this.snaPendingClaimList.actualDischargeDate = this.convertDate1(item.actualDischargeDate);
      this.snaPendingClaimList.mortalityHospital = item.mortalityHospital;
      this.snaPendingClaimList.mortalityCpd = item.mortalityCpd;
      this.snaPendingClaimList.hospitalClaimAmt = this.convertAmt(item.hospitalClaimAmt);
      this.snaPendingClaimList.implantData = item.implantData;
      this.snaPendingClaimList.cpdClaimStatus = item.cpdClaimStatus;
      this.snaPendingClaimList.cpdRemark = item.cpdRemark;
      this.snaPendingClaimList.cpdApproveAmt = this.convertAmt(item.cpdApproveAmt)
      this.snaPendingClaimList.snaClaimStatus = item.snaClaimStatus;
      this.snaPendingClaimList.snaRemark = item.snaRemark;
      this.snaPendingClaimList.snaApproveAmt = this.convertAmt(item.snaApproveAmt)
      this.report.push(this.snaPendingClaimList);
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
    for (let i = 0; i < this.hospitalList; i++) {
      if (this.hospitalCode == this.hospitalList[i].hospitalCode) {
        this.hospitalname = this.hospitalList[i].hospitalName;
      }
    }
    if (type == 1) {
      let filter = [];
      filter.push([['From Date :-', this.fromdate]]);
      filter.push([['To Date:-', this.todate]]);
      filter.push([['State Name:-', this.statename]]);
      filter.push([['District Name:-', this.districtName]]);
      filter.push([['Hospital Name :-', this.hospitalname]]);
      TableUtil.exportListToExcelWithFilter(this.report, "Month Wise Finance Details Report", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [380, 360]);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text("Month Wise Finance Details Report", 110, 10);
      doc.setFontSize(13);
      doc.text("From Date :-" + this.fromdate, 50, 25);
      doc.text("To Date:-" + this.todate, 210, 25);
      doc.text("State Name :-" + this.statename, 50, 33);
      doc.text("District Name:-" + this.distName, 210, 33);
      doc.text("Hospital Name:-" + this.hospitalname, 50, 41);
      doc.text("Generated On:-" + this.convertDate(new Date()), 210, 49);
      doc.text("Generated By:-" + this.sessionService.decryptSessionData("user").fullName, 50, 49);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.hospitalName;
        pdf[2] = clm.hospStateName;
        pdf[3] = clm.hospDistrictName;
        pdf[4] = clm.month;
        pdf[5] = clm.year;
        pdf[6] = clm.urn;
        pdf[7] = clm.invoiceNo;
        pdf[8] = clm.claimNo;
        pdf[9] = clm.caseNo;
        pdf[10] = clm.patientName;
        pdf[11] = clm.gender;
        pdf[12] = clm.patientDistName;
        pdf[13] = clm.packageCatgCode;
        pdf[14] = clm.packageName;
        pdf[14] = clm.procedureName;
        pdf[15] = clm.packageId;
        pdf[16] = clm.packageCost;
        pdf[17] = clm.actualDischargeDate;
        pdf[18] = clm.mortalityHospital;
        pdf[19] = clm.mortalityCpd;
        pdf[20] = clm.hospitalClaimAmt;
        pdf[21] = clm.implantData;
        pdf[22] = clm.cpdClaimStatus;
        pdf[23] = clm.cpdRemark;
        pdf[24] = clm.cpdApproveAmt;
        pdf[25] = clm.snaClaimStatus;
        pdf[26] = clm.snaRemark;
        pdf[27] = clm.snaApproveAmt;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 60,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 20 },
          2: { cellWidth: 35 },
          3: { cellWidth: 30 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 30 },
          8: { cellWidth: 25 },
          9: { cellWidth: 20 },
          10: { cellWidth: 20 },
          11: { cellWidth: 20 },
          12: { cellWidth: 20 },
          13: { cellWidth: 20 },
          14: { cellWidth: 20 },
          15: { cellWidth: 30 },
          16: { cellWidth: 30 },
          17: { cellWidth: 30 },
          18: { cellWidth: 30 },
          19: { cellWidth: 30 },
          20: { cellWidth: 30 },
          21: { cellWidth: 30 },
          22: { cellWidth: 30 },
          23: { cellWidth: 20 },
          24: { cellWidth: 20 },
          25: { cellWidth: 20 },
          26: { cellWidth: 20 },
          27: { cellWidth: 20 },
        }
      });
      doc.save('GJAY_Month Wise Finance Details Report.pdf');

    }
  }
  convertAmt(hospitalClaimAmt: any) {
    var formatter = new CurrencyPipe('en-US');
    hospitalClaimAmt = formatter.transform(hospitalClaimAmt, '', '');
    return hospitalClaimAmt;
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
  convertDate1(actualDischargeDate: any): any {
    var datePipe = new DatePipe("en-US");
    actualDischargeDate = datePipe.transform(actualDischargeDate, 'dd-MMM-yyyy');
    return actualDischargeDate;
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
}
