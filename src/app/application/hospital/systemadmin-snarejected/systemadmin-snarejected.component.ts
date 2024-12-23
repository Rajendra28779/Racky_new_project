import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { PendingService } from '../../pending.service';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SystemadminsnaadminService } from '../../Services/systemadminsnaadmin.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../../util/TableUtil';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/services/jwt.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-systemadmin-snarejected',
  templateUrl: './systemadmin-snarejected.component.html',
  styleUrls: ['./systemadmin-snarejected.component.scss']
})
export class SystemadminSnarejectedComponent implements OnInit {
  showPegi: boolean;
  pageElement: any;
  currentPage: any;
  public serachdata: any = [];
  txtsearchDate: any
  packgaeNAme: any;
  packagecode: any;
  packageName: any;
  packageId: any;
  packagependingdata: any
  user: any;
  fromDate: any;
  toDate: any;
  getdatadetais: any = [];
  getdata: any = [];
  snareport: boolean = false;
  record: any;
  urnnumber: any;
  constructor(public headerService: HeaderService, private pendingService: PendingService,
    private LoginServ: ClaimRaiseServiceService, public router: Router, private systemadminsnaadminService: SystemadminsnaadminService, private jwtService: JwtService, private route: Router, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('System Admin - SNA Rejected List');
    this.currentPage = 1;
    this.pageElement = 50;
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
    let month: any
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    if (date.getMonth() == 0) {
      year = year - 1;
      month = 11;
    } else {
      month = date.getMonth() - 1;
    }
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
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.Ongetlist();
    this.Inclusionofsearchingforpackagedetails();
  }
  Ongetlist() {
    this.user =  this.sessionService.decryptSessionData("user");
    var hospitalcode = this.user.userName;
    this.fromDate = $('#datepickerforreject').val();
    this.toDate = $('#datepickerfortoreject').val();
    let Package = this.packageName;
    this.packagecode = $('#PackageName').val();
    this.urnnumber = $('#actionType').val();
    if (Package == undefined) {
      Package = "";
    }
    if (this.packagecode == undefined) {
      this.packagecode = "";
    }
    if (this.urnnumber == undefined) {
      this.urnnumber = "";
    }
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'Discharge Date From should be Less Than Discharge Date To', 'error');
      return;
    }
    let requestdata = {
      "fromdate": this.fromDate,
      "todate": this.toDate,
      "hospitalcode": hospitalcode,
      "packagecode": this.packagecode,
      "packageanme": Package,
      "urnnumber": this.urnnumber
    };
    this.systemadminsnaadminService.getlistdata(requestdata).subscribe((data: any) => {
      this.getdatadetais = data;
      this.getdata = this.getdatadetais.data;
      if (this.getdata.length == 0) {
        this.snareport = true;
      }
      this.record = this.getdata.length;
      if (this.record > 0) {
        this.showPegi = true;
        this.snareport = false;
      }
      else {
        this.showPegi = false;
        this.snareport = true;
      }
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  Inclusionofsearchingforpackagedetails() {
    this.LoginServ.getsearcdetails().subscribe(data => {
      this.serachdata = data;
    });
  }
  getPackageName(event: any) {
    for (let i = 0; i < this.serachdata.length; i++) {
      if (this.serachdata[i].id == event) {
        this.packageName = this.serachdata[i].procedurecode;
        this.LoginServ.getdatapackgaename(this.packageName).subscribe(data => {
          this.packagependingdata = data;
        });
      }
    }
  }
  restedata() {
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
  sno: any = {
    Slno: "",
    URN: "",
    PatientName: "",
    caseno: "",
    InvoiceNumber: "",
    PackageCode: "",
    packageName: "",
    ActualDateOfAdmission: "",
    ActualDateOfDischarge: "",
    LastDateOfRaiseClaim: "",
    Amount: "",
  };
  heading = [['Sl#', 'URN', 'Patient Name', 'Case Number', 'Invoice Number', 'Package Code', 'Package Name', 'Actual Date Of Admision', 'Actual Date Of Discharge', 'Last Date Of Raise Claim', 'Amount']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      this.report = [];
      let claim: any;
      for (var i = 0; i < this.getdata.length; i++) {
        claim = this.getdata[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.URN = claim.urn;
        this.sno.PatientName = claim.patientname;
        this.sno.caseno = claim.caseno;
        this.sno.InvoiceNumber = claim.invoiceno;
        this.sno.PackageCode = claim.packagecode;
        this.sno.packageName = claim.packagename;
        this.sno.ActualDateOfAdmission = this.dateconvert(claim.actualdateofadmission);
        this.sno.ActualDateOfDischarge = this.dateconvert(claim.actualdateofdischarge)
        this.sno.LastDateOfRaiseClaim = claim.claimraiseby;
        this.sno.Amount = "₹" + claim.totalamountclaimed;
        this.report.push(this.sno);
      }
      let valuedate: any;
      let todate: any;
      valuedate = this.fromDate;
      todate = this.toDate;
      if (valuedate == undefined || valuedate == null || valuedate == '') {
        valuedate = $('#datepickerforreject').val();
      }
      if (todate == undefined || todate == null || todate == '') {
        todate = $('#datepickerfortoreject').val();
      }
      let filter1 = [];
      filter1.push([['Actual Date of Discharge From:-', valuedate]]);
      filter1.push([['To Date :-', todate]]);
      TableUtil.exportListToExcelWithFilterforhospitals(this.report, "System Admin SNA Rejected List", this.heading, filter1);
    } else if (type == 'pdf') {
      let SlNo = 1;
      if (this.getdata.length == 0) {
        this.swal('', 'No Records Found', 'info');
        return;
      }
      let valuedate: any;
      let todate: any;
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      valuedate = this.fromDate;
      todate = this.toDate;
      if (valuedate == undefined || valuedate == null || valuedate == '') {
        valuedate = $('#datepickerforreject').val();
      }
      if (todate == undefined || todate == null || todate == '') {
        todate = $('#datepickerfortoreject').val();
      }
      this.getdata.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.urn);
        rowData.push(element.patientname);
        rowData.push(element.caseno);
        rowData.push(element.invoiceno);
        rowData.push(element.packagecode);
        rowData.push(element.packagename);
        rowData.push(this.dateconvert(element.actualdateofadmission));
        rowData.push(this.dateconvert(element.actualdateofdischarge));
        rowData.push(element.claimraiseby);
        rowData.push(element.totalamountclaimed);
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [240, 272]);
      doc.setFontSize(10);
      doc.text('Hospital Name :-' + this.user.fullName, 5, 5);
      doc.text('Actual Date of Discharge From:-' + valuedate, 5, 10);
      doc.text('To:-' + todate, 5, 15);
      doc.text('Document Generate Date : ' + new Date().toLocaleString(), 5, 20);;
      doc.text('System Admin-SNA Rejected List', 100, 25);
      doc.line(100, 26, 150, 26);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 30, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 18 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 },
          9: { cellWidth: 18 },
          10: { cellWidth: 20 },
        }
      })
      doc.save('System_Admin_SNA_Rejected_List.pdf');
    }
  }
  dateconvert(date: any) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy');
  }
  OnDetails(transactiondetailsid: any, authorizedcode: any, hospitalcode: any, urn) {
    let state = {
      txnid: transactiondetailsid,
      authcode: authorizedcode,
      hospitalcode: hospitalcode,
      urn: urn
    }
    localStorage.setItem("history", JSON.stringify(state));
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/dischargelistHistoryHospital'); });
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItems")).value;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
}
