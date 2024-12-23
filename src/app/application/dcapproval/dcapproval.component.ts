import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { DcClaimService } from '../Services/dc-claim.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-dcapproval',
  templateUrl: './dcapproval.component.html',
  styleUrls: ['./dcapproval.component.scss']
})
export class DcapprovalComponent implements OnInit {
  user: any;
  dcClaimList: any = [];
  showPegi: boolean;
  record: any;
  currentPage: any;
  pageElement: any;
  check: boolean = false;
  txtsearchDate: any;
  constructor(public headerService: HeaderService, private dsService: DcClaimService, public route: Router,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('DC Approval');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.user =  this.sessionService.decryptSessionData("user");
    this.getDcClaimList();
    this.currentPage = 1;
    this.pageElement = 10;
  }
  getDcClaimList() {
    let userId = this.user.userId;
    this.dsService.getDcClaimList(userId).subscribe((data: any) => {
      this.dcClaimList = data;
      if (this.dcClaimList.length != 0) {
        this.check = true;
      }
      this.record = this.dcClaimList.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    })
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  onAction(id: any, urn: any, packageCode: any) {
    let state = {
      transactionId: id,
      URN: urn,
      packageCode: packageCode
    }
    localStorage.setItem("actionDatadc", JSON.stringify(state));
    this.route.navigate(['/application/dcapproval/action']);
  }
  report: any = [];
  sno: any = {
    Slno: "",
    claimno: "",
    invoiceno: "",
    URN: "",
    hospitaname: "",
    hospitalcode: "",
    PatientName: "",
    PackageCode: "",
    packageName: "",
    ActualDateOfAdmission: "",
    ActualDateOfDischarge: "",
    ClaimRaisedBy: "",
    Amount: "",
  };
  heading = [['Sl#', 'Claim No', 'Invoice Number', 'URN', 'Hospital Name', 'Hospital Code', 'Patient Name', 'Package Code', 'Package Name', 'Actual Date Of Admission', 'Actual Date Of Discharge', 'Claim Raised By', 'Amount']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.dcClaimList.length; i++) {
        claim = this.dcClaimList[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.claimno = claim.claim_no;
        this.sno.invoiceno = claim.invoiceno;
        this.sno.URN = claim.URN;
        this.sno.hospitaname = claim.hospitalname;
        this.sno.hospitalcode = claim.hospitalcode;
        this.sno.PatientName = claim.PatientName;
        this.sno.PackageCode = claim.PackageCode;
        this.sno.packageName = claim.PackageName;
        this.sno.ActualDateOfAdmission = this.convertStringToDate(claim.actualdateofadmission);
        this.sno.ActualDateOfDischarge = this.convertStringToDate(claim.actualdateofdischarge);
        this.sno.ClaimRaisedBy = this.convertDate(claim.CreatedOn);
        this.sno.Amount = '₹' + claim.CurrentTotalAmount;
        this.report.push(this.sno);
      }
      TableUtil.exportListToExcel(this.report, "DC Approval List", this.heading);
    } else if (type == 'pdf') {
      if (this.dcClaimList.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.dcClaimList.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.claim_no);
        rowData.push(element.invoiceno);
        rowData.push(element.URN);
        rowData.push(element.hospitalname);
        rowData.push(element.hospitalcode);
        rowData.push(element.PatientName);
        rowData.push(element.PackageCode);
        rowData.push(element.PackageName);
        rowData.push(this.convertStringToDate(element.actualdateofadmission));
        rowData.push(this.convertStringToDate(element.actualdateofdischarge));
        rowData.push(this.convertDate(element.CreatedOn));
        rowData.push(element.CurrentTotalAmount);
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [230, 270]);
      doc.setFontSize(10);
      doc.text('DC Approval List', 100, 25);
      doc.setLineWidth(0.7);
      doc.line(100, 26, 128, 26);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 28, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
          10: { cellWidth: 20 },
          11: { cellWidth: 20 },
          12: { cellWidth: 20 },
        }
      })
      doc.save('DC_Approval_List.pdf');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  convertStringToDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
  }
  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }
}
