import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../services/session-storage.service';
import { HeaderService } from '../application/header.service';
import { TreatmenthistoryperurnService } from '../application/Services/treatmenthistoryperurn.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../application/util/TableUtil';
import jsPDF from 'jspdf';
import { formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-packagepattern',
  templateUrl: './packagepattern.component.html',
  styleUrls: ['./packagepattern.component.scss']
})
export class PackagepatternComponent implements OnInit {
  hospitalcode: any;
  dateofAdmission: any;
  dateofdischarge: any;
  procedurecode: any;
  user: any;
  showPegi: boolean;
  pageElement: any;
  currentPage: any;
  txtsearchDate: any;
  record: any;
  packageName: any;
  groupedTriggerDetails: any[] = [];
  constructor(private sessionService: SessionStorageService, public headerService: HeaderService, private treatmenthistoryperurnService: TreatmenthistoryperurnService,) { }

  ngOnInit(): void {
    this.headerService.setTitle('Package Pattern List');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.user = this.sessionService.decryptSessionData('user');
    this.currentPage = 1;
    this.pageElement = 100;
    this.hospitalcode = this.sessionService.decryptSessionData('hospitalcode');
    this.dateofAdmission = this.sessionService.decryptSessionData('dateofAdmission');
    this.dateofdischarge = this.sessionService.decryptSessionData('dateofdischarge');
    this.procedurecode = this.sessionService.decryptSessionData('procedurecode');
    this.packageName = this.sessionService.decryptSessionData('packageName');
    this.getPackagePatternDetails();
  }
  triggerdetails = [];
  triggerdetails1 = [];
  getPackagePatternDetails() {
    this.triggerdetails = [];
    this.triggerdetails1 = [];
    let hospitalcode = this.hospitalcode
    let dateofAdmission = this.dateofAdmission
    let dateofdischarge = this.dateofdischarge
    let procedurecode = this.procedurecode
    this.treatmenthistoryperurnService.getCPDTriggerdetails(hospitalcode, dateofAdmission, dateofdischarge, procedurecode).subscribe((data: any) => {
      this.triggerdetails = data.cpdtrigerlist;
      this.triggerdetails1 = data.cpdtrigerlist1;
      console.log(this.triggerdetails);
      this.record = this.triggerdetails1.length;
      if (this.record > 0) {
        this.showPegi = true;
        this.groupDataByAdmissionDate();
      } else {
        this.showPegi = false;
      }
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>(
      document.getElementById('pageItem')
    )).value;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  report: any = [];
  sno: any = {
    Slno: "",
    URN: "",
    caseno: "",
    memberbname: "",
    procedurename: "",
    packageName: "",
    PackageCode: "",
    ActualDateOfAdmission: "",
    ActualDateOfDischarge: "",
    totalAmount: "",
  };
  heading = [['Sl#', 'URN', 'Member Name', 'Procedure Name', 'Package Name', 'Package Code',
    'Actual Date Of Admission', 'Actual Date Of Discharge', 'Total Amount']];
  packagepatternexcel(type: any) {
    if (type == 'excel') {
      let claim: any;
      this.report = [];
      for (var i = 0; i < this.triggerdetails1.length; i++) {
        claim = this.triggerdetails1[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.URN = claim.urn;
        this.sno.caseno = claim.caseno;
        this.sno.memberbname = claim.membername;
        this.sno.procedurename = claim.procedurename;
        this.sno.packageName = claim.packagename;
        this.sno.PackageCode = claim.packagecode;
        this.sno.ActualDateOfAdmission = claim.Actualdateofadmission;
        this.sno.ActualDateOfDischarge = claim.Actualdateofadischarge;
        this.sno.totalAmount = claim.totalamount;
        this.report.push(this.sno);
      }
      let filter1 = [];
      filter1.push([['Data Showing for other URN taken treatment in this Hospital who have been treated in this package for'+'('+this.packageName+')'+ 'and' +'('+this.procedurecode+')']]);
      TableUtil.exportListToExcelWithFilterforadmin(this.report, "Package Pattern List", this.heading, filter1);
    }
  }
  packagepatternpdf(type: any) {
    if (type == 'pdf') {
      if (this.triggerdetails1.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.report = [];
      this.triggerdetails1.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.urn);
        rowData.push(element.caseno);
        rowData.push(element.membername);
        rowData.push(element.procedurename);
        rowData.push(element.packagename);
        rowData.push(element.packagecode);
        rowData.push(element.Actualdateofadmission);
        rowData.push(element.Actualdateofadischarge);
        rowData.push(element.totalamount);
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Authority Name :-' + this.user.fullName, 5, 5);
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 10);
      doc.text('Data Showing for other URN taken treatment in this Hospital who have been treated in this package for'+'('+this.packageName+')'+ 'and' +'('+this.procedurecode+')', 5, 15);
      doc.text('Package Pattern List', 100, 19);
      doc.setLineWidth(0.7);
      doc.line(100, 21, 133, 21);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 23, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 30 },
          2: { cellWidth: 50 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 30 },
          6: { cellWidth: 30 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
        }
      })
      doc.save('Package_Pattern_List.pdf');
    }
  }

  groupDataByAdmissionDate() {
    const grouped = this.triggerdetails1.reduce((acc, item) => {
      const date = item.Actualdateofadmission;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});

    this.groupedTriggerDetails = Object.keys(grouped).map(date => {
      return { date, items: grouped[date] };
    });
  }

  getLetter(index: number): string {
    return String.fromCharCode(97 + index);
  }

  getRowIdentifier(groupIndex: number, itemIndex: number): string {
    return `${groupIndex + 1}(${this.getLetter(itemIndex)})`;
  }

  getRowColor(groupIndex: number, itemIndex: number): string {
    // Example logic to alternate colors based on groupIndex
    return groupIndex % 2 === 0 ? 'lightblue' : 'lightgreen';
  }
}
