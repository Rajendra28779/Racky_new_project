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
  selector: 'app-oldclmprocessblockrprt',
  templateUrl: './oldclmprocessblockrprt.component.html',
  styleUrls: ['./oldclmprocessblockrprt.component.scss']
})
export class OldclmprocessblockrprtComponent implements OnInit {

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
  documentType:any;
  statu: any;
  statusFlag: any;
  showdropdown: boolean;
  hospCode: any;
  constructor(private mnthWiseDischargeMeService: MnthWiseDischargeMeService,
    public headerService: HeaderService,private sessionService: SessionStorageService,
    private snoService: SnocreateserviceService,
    private route: Router, public fb: FormBuilder, private oldclmblockrprtService: OldclmprocessblockrprtService) { }

  ngOnInit(): void {
    
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId;
    this.headerService.setTitle('Old Claim Process Blocking Report');
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    if (this.user.groupId == 5) {
      this.name = this.user.fullName+'('+this.user.userName+')';
      // this.hospCode=this.user.userName;
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
    // this.auto.clear();
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
    this.oldclmblockrprtService.oldprocessblockData(userId, this.fromdate, this.todate, this.stat, this.dist, this.hospitalCode).subscribe(
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
    window.location.reload();
  }
  
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  report: any = [];
  oldClaimProcessBlockRpt: any = {
    slNo: "",
    urn: "",
    invoiceno: "",
    hospitalStateName: "",
    hospitalDistrictName: "",
    hospitalName: "",
    hospitalCode: "",
    patientName: "",
    packageCode: "",
    packageCatgCode: "",
    procedureName: "",
    dateOfBlocking: "",
    isPreAuthStatus: "",
    totalPackageCost:"",
    blockAmount:"",
    surgicalType:"",
    verificationMode:""
  };
  heading = [['Sl No.', 'URN', 'Invoice No.', 'Hospital State Name ', 'Hospital District Name', 'Hospital Name', 'Patient Name', 'Package Code', 'Procedure Code',
  'Procedure Name', 'Date of Blocking', 'IS Pre Auth', 'Total Package Cost','Blocked Amount','Surgical Type','Verification Mode']];

  downloadReport(type){
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
      this.oldClaimProcessBlockRpt.hospitalStateName = item.hospitalStateName;
      this.oldClaimProcessBlockRpt.hospitalDistrictName = item.hospitalDistrictName;
      this.oldClaimProcessBlockRpt.hospitalName = item.hospitalName+'('+item.hospitalCode+')';
      this.oldClaimProcessBlockRpt.patientName = item.patientName;
      this.oldClaimProcessBlockRpt.packageCode = item.packageCode;
      this.oldClaimProcessBlockRpt.packageCatgCode = item.packageCatgCode;
      this.oldClaimProcessBlockRpt.procedureName = item.procedureName;
      this.oldClaimProcessBlockRpt.dateOfBlocking = this.convertDate1(item.dateOfBlocking);
      this.oldClaimProcessBlockRpt.isPreAuthStatus = item.isPreAuthStatus;
      this.oldClaimProcessBlockRpt.totalPackageCost = this.convertCurrency(item.totalPackageCost);
      this.oldClaimProcessBlockRpt.blockAmount = this.convertCurrency(item.blockAmount);
      this.oldClaimProcessBlockRpt.surgicalType = item.surgicalType;
      this.oldClaimProcessBlockRpt.verificationMode = item.verificationMode;
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
      
      if (this.user.groupId ==1) {
        filter.push([[' Actual Admission Date From :-', this.fromdate]]);
        filter.push([[' Actual Admission Date To :-', this.todate]]);
        filter.push([['State:- ', this.statename]]);
        filter.push([['District Name:-', this.districtName]]); 
        filter.push([['Hospital Name:-',  this.hospitalname]]); 
      } else  if (this.user.groupId ==5){
        filter.push([[' Actual Admission Date From :-', this.fromdate]]);
        filter.push([[' Actual Admission Date To :-', this.todate]]);
        filter.push([['Hospital Name:-', this.name]]);
      }
      TableUtil.exportListToExcelWithFilter(this.report, "Old Claim Process Blocking Report", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [390, 400]);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("Old Claim Process Blocking Report", 150, 10);
      doc.setFontSize(13);
      doc.text(" Actual Admission Date From :-" + this.fromdate, 30, 20);
      doc.text(" Actual Admission Date To :-" + this.todate, 240, 20);
      if (this.user.groupId ==1) {
      doc.text(" Actual Admission Date From :-" + this.fromdate, 30, 20);
      doc.text(" Actual Admission Date To :-" + this.todate, 240, 20);
      doc.text("State :-" + this.statename, 30, 30);
      doc.text("District:-" + this.districtName, 240, 30);
      doc.text("Hospital :-" + this.hospitalname, 30, 40);
      doc.text("Generated On:- " + this.convertDate(new Date()), 240, 40);
      doc.text("Generated By:-" + this.sessionService.decryptSessionData("user").fullName, 30, 50);
      }else  if (this.user.groupId ==5){
        doc.text(" Actual Admission Date From :-" + this.fromdate, 30, 20);
        doc.text(" Actual Admission Date To :-" + this.todate, 240, 20);
        doc.text("Hospital :-" + this.name, 30, 30);
        doc.text("Generated On:- " + this.convertDate(new Date()),240, 30);
        doc.text("Generated By:-" + this.sessionService.decryptSessionData("user").fullName, 30, 40);
      }
     
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.urn;
        pdf[2] = clm.invoiceno;
        pdf[3] = clm.hospitalStateName;
        pdf[4] = clm.hospitalDistrictName;
        pdf[5] = clm.hospitalName;
        pdf[6] = clm.patientName;
        pdf[7] = clm.packageCode;
        pdf[8] = clm.packageCatgCode;
        pdf[9] = clm.procedureName;
        pdf[10] = clm.dateOfBlocking;
        pdf[11] = clm.isPreAuthStatus;
        pdf[12] = clm.totalPackageCost;
        pdf[13] = clm.blockAmount;
        pdf[14] = clm.surgicalType;
        pdf[15] = clm.verificationMode;
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
          0: { cellWidth: 10 },
          1: { cellWidth: 25 },
          2: { cellWidth: 20 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 40 },
          6: { cellWidth: 30 },
          7: { cellWidth: 25 },
          8: { cellWidth: 15 },
          9: { cellWidth: 25 },
          10: { cellWidth: 30 },
          11: { cellWidth: 15 },
          12: { cellWidth: 30 },
          13: { cellWidth: 15 },
          14: { cellWidth: 25 },
          15: { cellWidth: 20},
        }
      });
      doc.save('Bsky_Old Claim Process Blocking Report.pdf');
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
