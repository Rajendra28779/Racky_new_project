import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { ExpiredBeneficiaryRptService } from '../../Services/expired-beneficiary-rpt.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
declare let $: any;
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-make-alive-beneficiary-rpt',
  templateUrl: './make-alive-beneficiary-rpt.component.html',
  styleUrls: ['./make-alive-beneficiary-rpt.component.scss']
})
export class MakeAliveBeneficiaryRptComponent implements OnInit {
  @ViewChild('auto') auto;
  @ViewChild('autocopy') autocopy;
  hospitalCode: any;
  selectedItems: any = [];
  stateList: any = [];
  districtList: any = [];
  hospitalList: any;
  txtsearchDate: any;
  keyword: any = 'hospitalName';
  user: any;
  userId: any;
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
  gramwisedata: any
  tod: any;
  hospitalname: any = 'All';
  statename: any = 'All';
  distname: any = 'All';
  constructor(private snoService: SnocreateserviceService, public fb: FormBuilder,private sessionService: SessionStorageService,
    public headerService: HeaderService, private expiredBeneficiaryRptService: ExpiredBeneficiaryRptService,
    private route: Router) { }

  ngOnInit(): void {
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId;
    this.headerService.setTitle('Make Alive Report');
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
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
    $('input[name="fromDate"]').val("01-Apr-2023").attr('placeholder', 'From Date *');
    $('#aliveStatus').hide();
    this.getStateList()
    this.search();
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
    this.hospitalCode = "";
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
    this.expiredBeneficiaryRptService.makeAliveData(userId, this.fromdate, this.todate, this.stat, this.dist, this.hospitalCode).subscribe(
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
  districtWisePackage: any = {
    slNo: "",
    urn: "",
    claimNo: "",
    caseNo: "",
    patientName: "",
    patientPhone: "",
    hospitalName: "",
    hospitalCode: "",
    packageCode: "",
    packageName: "",
    makeAliveDate: "",
    actualDateAdmission: "",
    actualDischargeDate: "",
    totalclaimed: ""
  };
  heading = [['Sl No.', 'URN', 'Claim No.', 'Case No. ', 'Patient Name', 'Patient Phone', 'Hospital Name', 'Package Code',
    'Package Name', 'Alive Date', 'Actual Date of Admission', 'Actual Date of Discharge', 'Total Amount Claimed']];
  downloadReport(type) {
    if (this.hospitalWisePackage == null || this.hospitalWisePackage.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    this.report = [];
    let item: any;
    for (var i = 0; i < this.hospitalWisePackage.length; i++) {
      item = this.hospitalWisePackage[i];
      this.districtWisePackage = [];
      this.districtWisePackage.slNo = i + 1;
      this.districtWisePackage.urn = item.urn;
      this.districtWisePackage.claimNo = item.claimNo;
      this.districtWisePackage.caseNo = item.caseNo;
      this.districtWisePackage.patientName = item.patientName;
      this.districtWisePackage.patientPhone = item.patientPhone;
      this.districtWisePackage.hospitalName = item.hospitalName + '(' + item.hospitalCode + ')';
      this.districtWisePackage.packageCode = item.packageCode;
      this.districtWisePackage.packageName = item.packageName;
      this.districtWisePackage.makeAliveDate = this.convertDate(item.makeAliveDate);
      this.districtWisePackage.actualDateAdmission = this.convertDate1(item.actualDateAdmission);
      this.districtWisePackage.actualDischargeDate = this.convertDate1(item.actualDischargeDate);
      this.districtWisePackage.totalclaimed = this.convertCurrency(item.totalclaimed);
      this.report.push(this.districtWisePackage);
    }
    for (let i = 0; i < this.stateList.length; i++) {
      if (this.stateList[i].stateCode == this.stat) {
        this.statename = this.stateList[i].stateName
      }
    }
    for (let i = 0; i < this.districtList.length; i++) {
      if (this.districtList[i].districtcode == this.dist) {
        this.distname = this.districtList[i].districtname;
      }
    }

    if (type == 1) {
      let filter = [];
      filter.push([['Actual Discharge From :-', this.fromdate]]);
      filter.push([['To :-', this.todate]]);
      filter.push([['State:- ', this.statename]]);
      filter.push([['District Name:-', this.distname]]);
      filter.push([['Hospital Name:-', this.hospitalname]]);
      TableUtil.exportListToExcelWithFilter(this.report, "Alive Report", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [350, 360]);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text("Alive Report", 150, 10);
      doc.setFontSize(13);
      doc.text("Actual Date Of Discharge From :-" + this.fromdate, 20, 32);
      doc.text("Actual Date Of Discharge To :-" + this.todate, 210, 33);
      doc.text("State :-" + this.statename, 20, 39);
      doc.text("District:-" + this.distname, 210, 40);
      doc.text("Hospital :-" + this.hospitalname, 20, 47);
      doc.text("Generated On:- " + this.convertDate(new Date()), 210, 50);
      doc.text("Generated By:-" + this.sessionService.decryptSessionData("user").fullName, 20, 55);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.urn;
        pdf[2] = clm.claimNo;
        pdf[3] = clm.caseNo;
        pdf[4] = clm.patientName;
        pdf[5] = clm.patientPhone;
        pdf[6] = clm.hospitalName;
        pdf[7] = clm.packageCode;
        pdf[8] = clm.packageName;
        pdf[9] = clm.makeAliveDate;
        pdf[10] = clm.actualDateAdmission;
        pdf[11] = clm.actualDischargeDate;
        pdf[12] = clm.totalclaimed;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 65,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 35 },
          4: { cellWidth: 40 },
          5: { cellWidth: 25 },
          6: { cellWidth: 40 },
          7: { cellWidth: 20 },
          8: { cellWidth: 45 },
          9: { cellWidth: 20 },
          10: { cellWidth: 18 },
          11: { cellWidth: 18 },
          12: { cellWidth: 18 },
        }
      });
      doc.save('GJAY Alive Report.pdf');
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

  details(claimId: any, urn: any, memberId: any, transDetId: any, actualAdmDate: any) {
    localStorage.setItem("stat", this.stat)
    localStorage.setItem("dist", this.dist)
    localStorage.setItem("hospitalCode", this.hospitalCode)
    localStorage.setItem("formDate", this.fromdate)
    localStorage.setItem("toDate", this.todate)
    localStorage.setItem("hospitalName", this.hospitalname);
    localStorage.setItem("claimId", claimId);
    localStorage.setItem("urn", urn);
    localStorage.setItem("memberId", memberId);
    localStorage.setItem("transDetId", transDetId);
    localStorage.setItem("actualAdmDate", actualAdmDate);
    localStorage.setItem("routepage", "2");
    this.route.navigate(['/application/expiredbeneficiaryreport/expiredbeneficiarydetails']);
  }
}
