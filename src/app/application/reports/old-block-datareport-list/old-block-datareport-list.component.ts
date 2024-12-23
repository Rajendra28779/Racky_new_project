import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import { OldBlockDataService } from '../../Services/old-block-data.service';
import { TableUtil } from '../../util/TableUtil';
import autoTable from 'jspdf-autotable';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-old-block-datareport-list',
  templateUrl: './old-block-datareport-list.component.html',
  styleUrls: ['./old-block-datareport-list.component.scss']
})
export class OldBlockDatareportListComponent implements OnInit {
  districtName:any;
  blockName:any;
  txtsearchDate:any;
  gramwisedata:any=[];
  pageElement:any;
  currentPage:any;
  showPegi:boolean;
  stat: any;
  dist: any;
  hospitalCode: any;
  stateName: any;
  distName: any;
  hospitalName: any;
  formDate: any;
  toDate: any;
  user: any;
  userId: any;
  record: any;
  name: any;
  showdropdown: any;
  reportData: any;
  constructor(private oldBlockDataService: OldBlockDataService, private route: Router,private sessionService: SessionStorageService,) { }

  ngOnInit(): void {
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId;
    this.stat = localStorage.getItem('stat');
    this.dist = localStorage.getItem('dist');
    this.hospitalCode = localStorage.getItem('hospitalCode');
    this.stateName = localStorage.getItem('stateName');
    this.distName = localStorage.getItem('distName');
    this.hospitalName = localStorage.getItem('hospitalName');
    this.formDate = localStorage.getItem('formDate');
    this.toDate = localStorage.getItem('toDate');
    this.name = localStorage.getItem('name');
    this.reportData=localStorage.getItem('reportData');
    if (this.user.groupId == 4) {
      this.name = this.user.fullName;
      this.showdropdown = true;
    } else {
      this.showdropdown = false;
    }
    this.search();
  }
  search() {
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId;
    this.oldBlockDataService.oldBlockDataList(this.userId, this.reportData, this.stat, this.dist, this.hospitalCode).subscribe(
        (result) => {
          console.log(result);
          this.gramwisedata = [];
          this.gramwisedata = result;
          this.record = this.gramwisedata.length;
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

  report: any = [];
  snaPendingClaimList: any = {
    slNo: "",
    stateName: "",
    districtName: "",
    hospitalName: "",
    hospitalCode: "",
    patientName: "",
    urn:"",
    actualAdmissionDate: "",
    invoiceNo: "",
    amountBlocked: "",
    latestStatus: ""
  };

  heading = [['Sl No.', 'State Name', 'District Name', 'Hospital Name', 'Patient Name','URN','Actual Admission Date' , 'Invoice No.','Amount', 'Current Status']];



  downloadReport(type) {
    if (this.gramwisedata == null || this.gramwisedata.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    this.report = [];
    let item: any;
    for (var i = 0; i < this.gramwisedata.length; i++) {
      item = this.gramwisedata[i];
      this.snaPendingClaimList = [];
      this.snaPendingClaimList.slNo = i + 1;
      this.snaPendingClaimList.stateName = item.stateName;
      this.snaPendingClaimList.districtName = item.districtName;
      this.snaPendingClaimList.hospitalName = item.hospitalName + '(' + item.hospitalCode + ')';;
      this.snaPendingClaimList.patientName = item.patientName;
      this.snaPendingClaimList.urn = item.urn;
      this.snaPendingClaimList.actualAdmissionDate = this.convertDate1(item.actualAdmissionDate);
      this.snaPendingClaimList.invoiceNo = item.invoiceNo;
      this.snaPendingClaimList.amountBlocked = this.convertCurrency3(item.amountBlocked);
      this.snaPendingClaimList.latestStatus = item.latestStatus;
      this.report.push(this.snaPendingClaimList);
      console.log(this.report);
    }

    if (type == 1) {
      let filter = [];
      filter.push([['From Date :-', this.formDate]]);
      filter.push([['To Date:-', this.toDate]]);
      filter.push([['State Name:-',this.stateName]]);
      filter.push([['District Name:-', this.distName]]);
      filter.push([['Hospital Name :-', this.hospitalName]]);
      TableUtil.exportListToExcelWithFilter(this.report, "Old Block Data Report List", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [380, 360]);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text("Old Block Data Report List", 110, 10);
      doc.setFontSize(13);
      doc.text("From Date :-" + this.formDate, 50, 25);
      doc.text("To Date:-" + this.toDate, 210, 25);
      doc.text("State Name :-" + this.stateName, 50, 33);
      doc.text("District Name:-" + this.distName, 210, 33);
      doc.text("Hospital Name:-" + this.hospitalName, 50, 41);
      doc.text("Generated On:-" + this.convertDate(new Date()), 210, 49);
      doc.text("Generated By:-" + this.sessionService.decryptSessionData("user").fullName, 50, 49);

      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.stateName;
        pdf[2] = clm.districtName;
        pdf[3] = clm.hospitalName;
        pdf[4] = clm.patientName;
        pdf[5] = clm.urn;
        pdf[6] = clm.actualAdmissionDate;
        pdf[7] = clm.invoiceNo;
        pdf[8] = clm.amountBlocked;
        pdf[9] = clm.latestStatus;

        rows.push(pdf);
      }
      console.log(rows);
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
          1: { cellWidth: 30 },
          2: { cellWidth: 35 },
          3: { cellWidth: 60 },
          4: { cellWidth: 30 },
          5: { cellWidth: 35 },
          6: { cellWidth: 30 },
          7: { cellWidth: 30 },
          8: { cellWidth: 35 },
          9: { cellWidth: 30 }
        }
      });
      doc.save('GJAY_Old Block Data Report List.pdf');

    }
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
  convertDate1(actualAdmissionDate) {
    var datePipe = new DatePipe("en-US");
    actualAdmissionDate = datePipe.transform(actualAdmissionDate, 'dd-MMM-yyyy');
    return actualAdmissionDate;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  convertCurrency3(amountBlocked: any) {
    var formatter = new CurrencyPipe('en-US');
    amountBlocked = formatter.transform(amountBlocked, '', '');
    return amountBlocked;
  }

  details(transactionId: any, txnPackageId: any) {
    localStorage.setItem("txnid", transactionId);
    localStorage.setItem("pkgid", txnPackageId);
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/downloadadmissiondumpdata'); });
  }

}
