
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { HospitalpipePipe } from '../pipes/hospitalpipe.pipe';
import { HospitalService } from '../Services/hospital.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { CurrencyPipe, formatDate } from '@angular/common';
import { QcadminServicesService } from '../Services/qcadmin-services.service';
import { NotificationService } from '../Services/notification.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
@Component({
  selector: 'app-qcadminformview',
  templateUrl: './qcadminformview.component.html',
  styleUrls: ['./qcadminformview.component.scss']
})
export class QcadminformviewComponent implements OnInit {

  constructor(public headerService: HeaderService, private route: Router, public qcadminserv: QcadminServicesService, private snoService: SnocreateserviceService, private notificationservice: NotificationService, private sessionService: SessionStorageService) { }

  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  districtList: any = [];
  stateList: any = [];
  catList: any = [];
  Filtered: any;
  stateId: any = '';
  districtId: any = '';
  cpdApprovalRequired: any = '';
  snoTagged: any = '';
  categoryId: any = '';
  deleteDetails: any;
  hospitalData: any = [];
  SearchForm!: FormGroup;
  txtsearchDate: any;
  hospdetails: any;
  tmsActive: any = '';
  user: any;

  // SearchForm!: FormGroup;


  hospitalId: any = "";

  ngOnInit(): void {
    this.headerService.setTitle('Hospital MOU Update');
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.getHospitalListforviewPage();

  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }



  getHospitalListforviewPage() {
    this.qcadminserv.getListAfterUpdate().subscribe(
      (allData) => {
        this.hospitalData = allData;
        console.log("all data for view page of qcadmin")
        console.log(this.hospitalData);
        this.record = this.hospitalData.length;
        if (this.record > 0) {
          this.currentPage = 1;
          this.pageElement = 100;
          this.showPegi = true;
        }
        else {
          this.showPegi = false;
        }
      }
    );
  }

  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-IN');
    amount = formatter.transform(amount, '', '');
    return amount;
  }

  report: any = [];
  empanelhospData: any = {
    slNo: "",
    hospitalName: "",
    stateName: "",
    districtName: "",
    mobile: "",
    emailId: "",
    hospitalCategoryid: "",
    hosCValidDateFrom: "",
    hosCValidDateTo: "",
    mou: "",
    mouStartDt: "",
    mouEndDt: "",
    //status:"",
    mouStatus: "",
    empanelmentstatus: "",
    isBlockActive: "",
    preauthapprovalrequired: "",

    certification: "",
    validateFrom1: "",
    validateFrom2: "",
    hospitalregistration: "",
    validateFrom3: "",
    validateFrom4: "",

  };
  heading = [['Sl No.', 'Hospital', 'State', 'District', 'Mobile No.', 'Email Id', 'Hospital Category', 'Valid Date From', 'Valid Date To', 'Mou', 'MOU Start Date', 'MOU End Date', 'Empanel Status', 'MOU Status', 'Hospital Status', 'PreAuth', 'Is CPD Approval required'
    , 'Certification Number', 'Certification Number Validate From', 'Certification Number Validate To', 'Hospital Registration Case No', 'Hospital Registration Case No Validate From', 'Hospital Registration Case No Validate To'
  ]];



  downloadReport(type: any) {
    if (this.record == 0) {
      this.swal('', 'No Data Found', 'info');
      return;
    }
    this.report = [];
    let item: any;
    for (var i = 0; i < this.hospitalData.length; i++) {
      item = this.hospitalData[i];
      // console.log("items of excel are"+item);
      this.empanelhospData = [];
      this.empanelhospData.slNo = i + 1;
      this.empanelhospData.hospitalName = item.hospitalName;
      this.empanelhospData.stateName = item.stateName;
      this.empanelhospData.districtName = item.districtName;
      this.empanelhospData.mobile = item.mobile;
      this.empanelhospData.emailId = item.emailId;
      this.empanelhospData.hospitalCategoryid = item.hospitalCategoryid;
      this.empanelhospData.hosCValidDateFrom = item.hosCValidDateFrom;
      this.empanelhospData.hosCValidDateTo = item.hosCValidDateTo;
      this.empanelhospData.mou = item.mou;
      this.empanelhospData.mouStartDt = item.mouStartDt;
      this.empanelhospData.mouEndDt = item.mouEndDt;

      if (item.empanelmentstatus == '0') {
        this.empanelhospData.empanelmentstatus = "Empanel";
      } else {
        this.empanelhospData.empanelmentstatus = "De-Empanel";
      }
      if (item.mouStatus == '0') {
        this.empanelhospData.mouStatus = "Active";
      } else {
        this.empanelhospData.mouStatus = "InActive";
      }
      if (item.isBlockActive == '0') {
        this.empanelhospData.isBlockActive = "Active";
      } else {
        this.empanelhospData.isBlockActive = "InActive";
      }

      if (item.preauthapprovalrequired == '0') {
        this.empanelhospData.preauthapprovalrequired = "No Exception";
      }
      if (item.preauthapprovalrequired == '1') {
        this.empanelhospData.preauthapprovalrequired = "Exception 1";
      }
      if (item.preauthapprovalrequired == '2') {

        this.empanelhospData.preauthapprovalrequired = "Exception 2";
      }

      if (item.cpdApprovalRequired == '0') {
        this.empanelhospData.cpdApprovalRequired = "Yes";
      } else {
        this.empanelhospData.cpdApprovalRequired = "NO";
      }
      this.empanelhospData.certification = item.certification;
      if (item.validateFrom1 != 'NA') {
        this.empanelhospData.validateFrom1 = item.validateFrom1;
      } else {
        this.empanelhospData.validateFrom1 = 'N/A'
      }
      if (item.validateFrom2 != 'NA') {
        this.empanelhospData.validateFrom2 = item.validateFrom2;
      } else {
        this.empanelhospData.validateFrom2 = 'N/A'
      }
      this.empanelhospData.hospitalregistration = item.hospitalregistration;
      if (item.validateFrom3 != 'NA') {
        this.empanelhospData.validateFrom3 = item.validateFrom3;
      } else {
        this.empanelhospData.validateFrom3 = 'N/A'
      }
      if (item.validateFrom3 != 'NA') {
        this.empanelhospData.validateFrom4 = item.validateFrom4;
      } else {
        this.empanelhospData.validateFrom4 = 'N/A';
      }
      this.report.push(this.empanelhospData);
    }

    this.empanelhospData = [];
    this.empanelhospData.procedurename = "Total";
    this.report.push(this.empanelhospData);
    if (type == 'excel') {
      let filter = [];
      TableUtil.exportListToExcelWithFilter(this.report, "QC Admin", this.heading, filter);
    }
    else if (type == 'pdf') {
      const doc = new jsPDF('l', 'mm', [330, 420]);
      doc.setFontSize(12);
      doc.text("QC Admin", 14, 8);
      doc.text("Generated By: " + this.user.fullName + "\tGenerated On: " + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 14, 16);

      let pdfRpt = [];
      for (var x = 0; x < this.report.length; x++) {
        var flt = this.report[x];
        var pdf = [];
        pdf[0] = x + 1;
        pdf[1] = flt.hospitalName;
        pdf[2] = flt.stateName;
        pdf[3] = flt.districtName;
        pdf[4] = flt.mobile;
        pdf[5] = flt.emailId;
        pdf[6] = flt.hospitalCategoryid;
        pdf[7] = flt.hosCValidDateFrom;
        pdf[8] = flt.hosCValidDateTo;
        pdf[9] = flt.mou;
        pdf[10] = flt.mouStartDt;
        pdf[11] = flt.mouEndDt;
        pdf[12] = flt.empanelmentstatus;
        pdf[13] = flt.mouStatus;
        pdf[14] = flt.isBlockActive;
        pdf[15] = flt.preauthapprovalrequired;
        pdf[16] = flt.cpdApprovalRequired;

        pdfRpt.push(pdf);
      }
      console.log(pdfRpt);
      autoTable(doc, {
        head: this.heading,
        body: pdfRpt,
        theme: 'grid',
        startY: 24,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 30 },
          2: { cellWidth: 25 },
          3: { cellWidth: 20 },
          4: { cellWidth: 26 },
          5: { cellWidth: 30 },
          6: { cellWidth: 20 },
          7: { cellWidth: 23 },
          8: { cellWidth: 23 },
          9: { cellWidth: 40 },
          10: { cellWidth: 23 },
          11: { cellWidth: 23 },
          12: { cellWidth: 17 },
          13: { cellWidth: 17 },
          14: { cellWidth: 17 },
          15: { cellWidth: 25 },
          16: { cellWidth: 25 },
        }
      });
      doc.save('QCAdmin_' + '.pdf');
      //doc.output('dataurlnewwindow');
    }

  }


  downlordnotification(event: any, docpath: any) {
    console.log('file: ' + docpath);

    if (docpath != null && docpath != '' && docpath != undefined) {
      let img = this.notificationservice.downloadFile(docpath);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'There Is No File', 'info');
    }

  }

  downlordnotification1(event: any, docpath: any, flag: any, subFolder: any) {
    console.log('file: ' + docpath);

    if (docpath != null && docpath != '' && docpath != undefined) {
      let img = this.notificationservice.downloadFileSeedownloadfiletreatFireDistinguisher(docpath, flag, subFolder);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'There Is No File', 'info');
    }

  }




  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  Dateconversion(date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy');
  }

  Dateconversion1(date: string): string | null {
    if (!date) {
      return null; // Handle empty or null values gracefully
    }

    try {
      // Convert the string into a Date object (adjust based on the input format)
      const [day, month, year] = date.split('-');
      const parsedDate = new Date(+`20${year}`, +month - 1, +day); // Assuming year is in 'yy' format (e.g., 22 for 2022)

      const datePipe = new DatePipe('en-US');
      return datePipe.transform(parsedDate, 'dd-MMM-yyyy');
    } catch (error) {
      console.error('Error parsing date:', error);
      return null; // Return null or handle the error as needed
    }
  }



}
