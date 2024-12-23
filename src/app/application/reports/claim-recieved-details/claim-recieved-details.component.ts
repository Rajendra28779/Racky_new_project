import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { ReportcountService } from '../../Services/reportcount.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../../util/TableUtil';
import { CurrencyPipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-claim-recieved-details',
  templateUrl: './claim-recieved-details.component.html',
  styleUrls: ['./claim-recieved-details.component.scss']
})
export class ClaimRecievedDetailsComponent implements OnInit {
  token: any;
  eventName: any;
  claimCountDetails: any = [];
  showPegi: boolean;
  record: any;
  currentPage: any;
  pageElement: any;
  txtsearchDate: any;
  userId: any;
  years: string;
  months: string;
  days: string;
  searchtype: any;
  userid: any;
  satedetails: any = []
  districtdetails: any = []
  hospitaldetails: any = []
  innerpagedetails: any = []
  stateName: any = []
  districtName: any = []
  hospitalName: any = []
  user: any ;
  constructor(public headerService: HeaderService, private reportcount: ReportcountService, public route: Router, private jwtService: JwtService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Discharge and Claim Summary Details');
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.years = localStorage.getItem("years");
    this.months = localStorage.getItem("months");
    this.searchtype = localStorage.getItem("Searchtype");
    if (this.searchtype == 1) {
      this.eventName = "Actual Date of Discharge";
    }
    else {
      this.eventName = "Actual Date of Admission";
    }
    this.userid = localStorage.getItem("userId");
    this.satedetails = localStorage.getItem("satate");
    this.districtdetails = localStorage.getItem("district");
    this.hospitaldetails = localStorage.getItem("Hospital");
    this.stateName = localStorage.getItem("stateName");
    this.districtName = localStorage.getItem("districtName");
    this.hospitalName = localStorage.getItem("hospitalName");
    this.token = localStorage.getItem("token");
    this.getdatasummaryclaiminnerpage();
  }
  detailsinner: any = []
  getdatasummaryclaiminnerpage() {
    this.reportcount.getSummarydetailsforinnerpage(this.userid, this.years, this.months, this.searchtype, this.satedetails, this.districtdetails, this.hospitaldetails).subscribe((data: any) => {
      console.log(data);
      this.innerpagedetails.data = data;
      if (this.innerpagedetails.data.status == "success") {
        this.innerpagedetails = this.innerpagedetails.data;
        this.detailsinner = this.innerpagedetails.data.details;
      }
      localStorage.removeItem("years");
      localStorage.removeItem("months");
      localStorage.removeItem("token");
      localStorage.removeItem("Searchtype");
      localStorage.removeItem("satate");
      localStorage.removeItem("district");
      localStorage.removeItem("Hospital");
      localStorage.removeItem("userId");
      localStorage.removeItem("stateName");
      localStorage.removeItem("DistrictName");
      localStorage.removeItem("HospitalName");
    }, (error) => {
      console.log(error);
      this.swal('', 'Something went wrong.', 'error');
    })
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  list: any = [];
  cpd: any = {
    Date: "",
    UniquefamilyTreated: "",
    UniquePatientTreated: "",
    TotalPackageDischarged: "",
    TotalDischargeAmount: "",
    totalclaimsubmitted: "",
    TotalClaimAmount: "",
    TotalPendingForClaimRaise: "",
    TotalPendingForRaiseAmount: "",
    Claimnotsubmitted: "",
    ClaimnotsubmittedAmount: "",
  };
  heading1 = [['Date', 'Unique Family Treated', 'Unique Patient Treated',
    'Total Package Discharged', 'Total Discharge Amount(₹)','Total Claim Submitted',
    'Total Claim Amount(₹)','Total Pending For Claim Raise', 'Total Pending For Raise Amount(₹)',
    'Claim Not Submitted (After 7 days of Discharge)','Claim Not Submitted Amount(After 7 days of Discharge)']];
  downloadList() {
    this.list = [];
    let item: any;
    for (var i = 0; i < this.detailsinner.length; i++) {
      item = this.detailsinner[i];
      this.cpd = [];
      this.cpd.Date = item.dates;
      this.cpd.UniquefamilyTreated = item.uniquefamilytreated;
      this.cpd.UniquePatientTreated = item.uniquepatienttreated;
      this.cpd.TotalPackageDischarged = item.totalpackagedischarged;
      this.cpd.TotalDischargeAmount = this.convertCurrency(item.totaldischargeamount);
      this.cpd.totalclaimsubmitted = item.totalclaimsubmitted;
      this.cpd.TotalClaimAmount = this.convertCurrency(item.totalclaimamount);
      this.cpd.TotalPendingForClaimRaise = item.total_pendingforclaim_raise;
      this.cpd.TotalPendingForRaiseAmount = this.convertCurrency(item.totalpendingraiseamount);
      this.cpd.Claimnotsubmitted = item.claimnotsubmittedafter7daysofdischarge;
      this.cpd.ClaimnotsubmittedAmount = this.convertCurrency(item.cnsamountafter7daysofdischarge);
      this.list.push(this.cpd);
    }
    let filter = [];
    filter.push([['Search By', this.eventName]]);
    if (this.years != null && this.years != undefined && this.years != '') {
      filter.push([['Year', this.years]]);
    } else {
      filter.push([['Year', 'Not Selected']]);
    }
    if (this.stateName != null && this.stateName != undefined && this.stateName != '') {
      filter.push([['State', this.stateName.toString()]]);
    } else {
      filter.push([['State', 'Not Selected']]);
    }
    if (this.districtName != null && this.districtName != undefined && this.districtName != '') {
      filter.push([['District', this.districtName.toString()]]);
    } else {
      filter.push([['District', 'Not Selected']]);
    }
    if (this.hospitalName != null && this.hospitalName != undefined && this.hospitalName != '') {
      filter.push([['Hospital Name', this.hospitalName.toString()]]);
    } else {
      filter.push([['Hospital Name', 'Not Selected']]);
    }
    TableUtil.exportListToExcelWithFilterforadmin(this.list, "Discharge And Claim Summary Details", this.heading1, filter);
  }
  downloadPDF() {
    let heading = [['Date', 'Unique Family Treated', 'Unique Patient Treated',
    'Total Package Discharged', 'Total Discharge Amount','Total Claim Submitted',
    'Total Claim Amount','Total Pending For Claim Raise', 'Total Pending For Raise Amount',
    'Claim Not Submitted (After 7 days of Discharge)','Claim Not Submitted Amount(After 7 days of Discharge)']];
    let report = [];
    if (this.detailsinner.length > 0) {
      this.detailsinner.forEach(element => {
        let rowData = [];
        rowData.push(element.dates);
        rowData.push(element.uniquefamilytreated);
        rowData.push(element.uniquepatienttreated);
        rowData.push(element.totalpackagedischarged);
        rowData.push(this.convertCurrency(element.totaldischargeamount));
        rowData.push(element.totalclaimsubmitted);
        rowData.push(this.convertCurrency(element.totalclaimamount));
        rowData.push(element.total_pendingforclaim_raise);
        rowData.push(this.convertCurrency(element.totalpendingraiseamount));
        rowData.push(element.claimnotsubmittedafter7daysofdischarge);
        rowData.push(this.convertCurrency(element.cnsamountafter7daysofdischarge));
        report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Authority Name :-' + this.user.fullName, 5, 5);
      doc.text('Year : ' + this.years, 5, 10);
      if (this.searchtype==1) {
        doc.text('Search By : ' + 'Actual Date of Discharge', 5, 15);
      } else {
        doc.text('Search By : ' + 'Actual Date of Admission', 5, 15);
      }
      if (this.stateName != null && this.stateName != undefined && this.stateName != '') {
        doc.text('State : ' + this.stateName, 5, 20);
      } else {
        doc.text('State : ' + 'Not Selected', 5, 20);
      }
      if (this.districtName != null && this.districtName != undefined && this.districtName != '') {
        doc.text('District : ' + this.districtName, 5, 25);
      } else {
        doc.text('District : ' + 'Not Selected', 5, 25);
      }
      if (this.hospitalName != null && this.hospitalName != undefined && this.hospitalName != '') {
        doc.text('Hospital Name : ' + this.hospitalName, 5, 30);
      } else {
        doc.text('Hospital Name : ' + 'Not Selected', 5, 30);
      }
      doc.text('Discharge_And_Claim_Summary_Details', 100, 35);
      doc.setLineWidth(0.7);
      doc.line(100, 36, 161, 36);
      autoTable(doc, {
        head: heading, body: report, startY: 37, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 20},
          1: { cellWidth: 18},
          2: { cellWidth: 18},
          3: { cellWidth: 18},
          4: { cellWidth: 18},
          5: { cellWidth: 18},
          6: { cellWidth: 18},
          7: { cellWidth: 18},
          8: { cellWidth: 25},
          9: { cellWidth: 25},
          10: { cellWidth: 25},
        }
      })
      doc.save('Discharge and Claim Summary Details.pdf');
    } else {
      this.swal('Info', 'No Data Found!', 'info');
    }
  }
  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }
}
