import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { PackagewisedischargeclaimService } from '../../Services/packagewisedischargeclaim.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
declare let $: any;
import { environment } from 'src/environments/environment';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-packagewisedischargeclaim',
  templateUrl: './packagewisedischargeclaim.component.html',
  styleUrls: ['./packagewisedischargeclaim.component.scss']
})
export class PackagewisedischargeclaimComponent implements OnInit {
  txtsearchDate: any;
  showPegi: boolean;
  stateList: any = [];
  districtList: any = [];
  hospitalWisePackage: any = [];
  selectedItems: any = [];
  hospitalList: any = [];
  @ViewChild('auto') auto;
  @ViewChild('autocopy') autocopy;
  hospitalCode: any;
  keyword: any = 'hospitalName';
  currentPage: any;
  pageElement: any;
  user: any;
  record: any;
  stat: any;
  dist: any;
  fromdate: any;
  todate: any;
  showsdh: any = true;
  stateId: any;

  constructor(public headerService: HeaderService, private snoService: SnocreateserviceService,private sessionService: SessionStorageService,
    private packagewisedischargeclaimService: PackagewisedischargeclaimService, private route: Router) { }

  ngOnInit(): void {
    this.headerService.setTitle('Package Wise Discharge Claim Report');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.currentPage = 1;
    this.pageElement = 50;
    this.headerService.isBack(false);
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
    if (this.user.groupId == 5) {
      this.hospitalCode = this.user.username;
      this.showsdh = false;
    } else {
      this.showsdh = true;
    }
    this.getStateList();
    let stateId = null;
    let districtId = null;
    this.hospitalCode = null;
  }

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = [];
        this.stateList = response;
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

  search() {
    let userId = this.user.userId;
    let fromDate = $('#fromDate').val();
    let toDate = $('#toDate').val();
    let stateId = $('#stateId').val();
    let districtId = $('#districtId').val();
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    if (this.user.groupId == 5) {
      this.hospitalCode = this.user.userName;
      this.showsdh = false;
    } else {
      this.showsdh = true;
    }
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
    if (stateId == undefined || stateId == null) {
      stateId = "";
    }
    if (districtId == undefined || districtId == null) {
      districtId = "";
    }
    if (this.hospitalCode == undefined || this.hospitalCode == null) {
      this.hospitalCode = "";
    }
    this.stat = stateId;
    this.dist = districtId;
    let hospitalCode = this.hospitalCode;
    this.fromdate = fromDate;
    this.todate = toDate;
    this.packagewisedischargeclaimService.packagedetails(userId, this.fromdate, this.todate, this.stat, this.dist, this.hospitalCode).subscribe(
      (result) => {
        this.hospitalWisePackage = [];
        this.hospitalWisePackage = result;
        this.record = this.hospitalWisePackage.length;
        if (this.record > 0) {
          this.currentPage = 1;
          this.pageElement = 50;
          this.showPegi = true;
        }
        else {
          this.showPegi = false;
        }
      },
      (error) => console.log(error)
    )
  }


  view(packageHeader: any) {
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

    // this.user = JSON.parse(sessionStorage.getItem("user"));
    // if(this.user.groupId==5){
    //   this.hospitalCode=this.user.userName;
    //   for (let i = 0; i < this.hospitalList; i++) {
    //     if (this.hospitalCode == this.hospitalList[i].hospitalCode) {
    //       this.hospitalName = this.hospitalList[i].hospitalName;
    //     }
    //   }
    //   this.showsdh=false;
    // }else{
    //   this.showsdh=true;
    // }
    // alert( this.hospitalname);
    if (this.user.groupId == 5) {
      this.hospitalName = this.user.fullName;
      this.showsdh = false;
    } else {
      for (let i = 0; i < this.hospitalList; i++) {
        if (this.hospitalCode == this.hospitalList[i].hospitalCode) {
          this.hospitalName = this.hospitalList[i].hospitalName;
        }
      }
    }
    let state = {
      stat: this.stat,
      stateName: this.statename,
      distName: this.districtName,
      hospName: this.hospitalName,
      dist: this.dist,
      hosp: this.hospitalCode,
      fromdate: this.fromdate,
      todate: this.todate,
      packageHeader: packageHeader

    }
    localStorage.setItem("actionDataforpackage", JSON.stringify(state));
    this.route.navigate([]).then(result => {
      window.open(environment.routingUrl + '/packagewisedischargeclaimdetails');
    });
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  Reset() {
    window.location.reload();
  }

  selectEvent1(item) {
    this.hospitalCode = "";
    this.hospitalCode = item.hospitalCode;
    this.hospitalName = item.hospitalName;
  }

  onReset2() {
    this.auto.clear();
    this.hospitalCode = "";
    this.hospitalName = "";
  }
  report: any = [];
  snaPendingClaimList: any = {
    slNo: "",
    packageHeader: "",
    packageName: "",
    noOfDischrge: "",
    dischargeAmt: "",
    noOfClaim: "",
    claimedAmt: "",
    paidAmt: ""
  };

  heading = [['Sl No.', 'Package Header', 'Package Name', 'No of Discharge', 'Discharge Amount', 'No of Claim', 'Claimed  Amount', 'Paid Amount']];
  statename: any = "ALL";
  districtName: any = "ALL";
  hospitalName: any = "ALL";
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
      this.snaPendingClaimList.packageHeader = item.packageHeader;
      this.snaPendingClaimList.packageName = item.packageName;
      this.snaPendingClaimList.noOfDischrge = item.noOfDischrge;
      this.snaPendingClaimList.dischargeAmt = this.convertCurrency(item.dischargeAmt);
      this.snaPendingClaimList.noOfClaim = item.noOfClaim;
      this.snaPendingClaimList.claimedAmt = this.convertCurrency1(item.claimedAmt);
      this.snaPendingClaimList.paidAmt = this.convertCurrency2(item.paidAmt);
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
        this.hospitalName = this.hospitalList[i].hospitalName;
      }
    }
    if (type == 1) {
      let filter = [];
      filter.push([['Actual Date of Discharge From:-', this.fromdate]]);
      filter.push([['Actual Date of Discharge To:-', this.todate]]);
      if (this.user.groupId != 5) {
        filter.push([['State Name:-', this.statename]]);
        filter.push([['District Name:-', this.districtName]]);
        filter.push([['Hospital Name :-', this.hospitalName]]);
      }
      this.hospitalName = this.user.fullName;
      filter.push([['Hospital Name :-', this.hospitalName]]);
      TableUtil.exportListToExcelWithFilter(this.report, "Package Wise Discharge Claim Report", this.heading, filter);
    }
    else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [340, 240]);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text("Package Wise Discharge Claim Report", 70, 10);
      doc.setFontSize(12);
      if (this.user.groupId != 5) {
        doc.text("State Name :-" + this.statename, 20, 25);
        doc.text("District Name:-" + this.districtName, 140, 25);
        doc.text("Hospital Name:-" + this.hospitalName, 20, 33);
      }
      else {
        this.hospitalName = this.user.fullName;
        doc.text("Hospital Name:-" + this.hospitalName, 20, 33);
      }

      doc.text("Actual Date of Discharge From :-" + this.fromdate, 140, 33);
      doc.text("Actual Date of Discharge To:-" + this.todate, 20, 41);
      doc.text("Generated On:-" + this.convertDate(new Date()), 140, 41);
      doc.text("Generated By:-" + this.sessionService.decryptSessionData("user").fullName, 20, 49);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.packageHeader;
        pdf[2] = clm.packageName;
        pdf[3] = clm.noOfDischrge;
        pdf[4] = clm.dischargeAmt;
        pdf[5] = clm.noOfClaim;
        pdf[6] = clm.claimedAmt;
        pdf[7] = clm.paidAmt;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 55,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 15 },
          2: { cellWidth: 45 },
          3: { cellWidth: 25 },
          4: { cellWidth: 30 },
          5: { cellWidth: 20 },
          6: { cellWidth: 25 },
          7: { cellWidth: 20 },
        }
      });
      doc.save('GJAY_Package Wise Discharge Claim Report.pdf');
    }
  }

  convertCurrency2(paidAmt: any) {
    var formatter = new CurrencyPipe('en-US');
    paidAmt = formatter.transform(paidAmt, '', '');
    return paidAmt;
  }
  convertCurrency1(claimedAmt: any) {
    var formatter = new CurrencyPipe('en-US');
    claimedAmt = formatter.transform(claimedAmt, '', '');
    return claimedAmt;
  }

  convertCurrency(dischargeAmt: any) {
    var formatter = new CurrencyPipe('en-US');
    dischargeAmt = formatter.transform(dischargeAmt, '', '');
    return dischargeAmt;
  }

  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }

}
