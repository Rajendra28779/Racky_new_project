import { CurrencyPipe, DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { TableUtil } from '../../util/TableUtil';
import { DynamicreportService } from '../../Services/dynamicreport.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
declare let $: any;
@Component({
  selector: 'app-partial-claim-dc-compliance',
  templateUrl: './partial-claim-dc-compliance.component.html',
  styleUrls: ['./partial-claim-dc-compliance.component.scss'],
})
export class PartialClaimDcComplianceComponent implements OnInit {
  childmessage: any;
  user: any;
  txtsearchDate: any;
  statelist: Array<any> = [];
  stateCode: any;
  userId: any;
  distList: Array<any> = [];
  distCode: any;
  snoclaimlist: any = [];
  record: any;
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalClaimCount: any;
  dataRequest: any;
  stateId: any = '';
  fromDate: any;
  toDate: any;
  stateCode1: any;
  distCode1: any;
  hospitalCode: any;
  currentPagenNum: any;
  month: any;
  year: any;
  schemeidvalue: any = 1;
  schemeName: any;
  constructor(
    public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    public route: Router,
    private sessionService: SessionStorageService,
    private encryptionService: EncryptionService,
    public packageDetailsMasterService: PackageDetailsMasterService,
  ) {}

  ngOnInit(): void {
    // dynamic title
    this.getSchemeData();
    this.user = this.sessionService.decryptSessionData('user');
    this.dataRequest = this.sessionService.decryptSessionData('requestData');
    this.currentPagenNum =
      this.sessionService.decryptSessionData('currentPageNum');
    this.headerService.setTitle('Partial Claim DC Compliance');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.currentPage = 1;
    this.pageElement = 20;
    var compnent = this;
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
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let months: any = date.getMonth() - 1;
    if (months == -1) {
      this.month = 'Dec';
      this.year = year - 1;
    } else {
      this.month = this.getMonthFrom(months);
      this.year = year;
    }
    var frstDay = date1 + '-' + this.month + '-' + this.year;

    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');

    $('input[name="toDate"]').attr('placeholder', 'To Date *');

    if (
      this.dataRequest == null ||
      this.dataRequest == undefined ||
      this.dataRequest == ''
    ) {
    } else {
      let date = new Date(this.dataRequest.fromDate);
      let fromDate = this.getDate(date);
      $('input[name="fromDate"]').val(fromDate);
      let date1 = new Date(this.dataRequest.toDate);
      let toDate = this.getDate(date1);
      $('input[name="toDate"]').val(toDate);
    }
    this.getSnoClaimDetails();
  }
  getDate(date) {
    let year = date.getFullYear();
    let date1 = date.getDate();
    if (date1.toString().length === 1) {
      date1 = '0' + date1;
    }
    let months = date.getMonth();
    let month = this.getMonthFrom(months);
    var frstDay = date1 + '-' + month + '-' + year;
    return frstDay;
  }
  getMonthFrom(month) {
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
    return month;
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  getSnoClaimDetails() {
    let userId = this.user.userId;
    this.fromDate = $('#datepicker13').val();
    this.toDate = $('#datepicker14').val();
    this.stateCode1 = this.stateId;
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'From Date should be less than To Date', 'error');
      return;
    }
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (
      schemecategoryid == null ||
      schemecategoryid == undefined ||
      schemecategoryid == ''
    ) {
      schemecategoryid = '';
    } else {
      schemecategoryid = schemecategoryid;
    }
    let requestData = {
      userId: userId,
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
      schemeid: schemeid,
      schemecategoryid: schemecategoryid,
    };
    this.sessionService.encryptSessionData('requestData', requestData);
    this.snoService.getSnoDCApprovedPartialClaimList(requestData).subscribe(
      (data) => {
        this.snoclaimlist = data;
        this.totalClaimCount = this.snoclaimlist?.length;
        this.traverseToRequiredPage();
        this.record = this.snoclaimlist?.length;
        if (this.record > 0) {
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  onAction(id: any, urn: any, packageCode: any) {
    let state = {
      transactionId: id,
      URN: urn,
      packageCode: packageCode,
    };
    localStorage.setItem('actionData', JSON.stringify(state));
    this.sessionService.encryptSessionData('currentPageNum', this.currentPage);
    this.route.navigate(['/application/partialdccompliance/action']);
  }

  resetField() {
    sessionStorage.removeItem('requestData');
    window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  traverseToRequiredPage() {
    if (this.currentPagenNum != null && this.currentPagenNum != undefined) {
      this.currentPage = this.currentPagenNum;
      sessionStorage.removeItem('currentPageNum');
    } else {
      this.currentPage = 1;
    }
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  GetDate(str) {
    var arr = str.split('-');
    var months = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ];

    var month = months.indexOf(arr[1].toLowerCase());

    return new Date(parseInt(arr[2]), month, parseInt(arr[0]));
  }
  //convert string to date
  convertStringToDate(date) {
    var datePipe = new DatePipe('en-US');
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }
  //convert timestamp to date
  convertDate(date) {
    var datePipe = new DatePipe('en-US');
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
  }
  //convert number to currency
  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }

  heading = [
    ['Sl No.', 'URN', 'Patient Name', 'Case Number', 'Invoice Number',
     'Package Code', 'Actual Date Of Admission','Actual Date Of Discharge',
     'Claim Amount(₹)','Partial Claim Amount(₹)',]
  ];
  report:any=[];
  sno:any
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];

    for (let i = 0; i < this.snoclaimlist.length; i++) {
      let claim = this.snoclaimlist[i];
      this.sno = [];
      this.sno.push(i + 1); // Sl No.
      this.sno.push(claim.urn); // URN
      this.sno.push(claim.patientName); // Patient Name
      this.sno.push(claim.caseno); // Case Number
      this.sno.push(claim.invoiceno); // Invoice Number
      this.sno.push(claim.packageCode); // Package Code
      this.sno.push(claim.dateofadmission); // Admission Date
      // this.sno.push(claim.actualdateofadmission); // Actual Date Of Admission
      this.sno.push(claim.dateOfDischarge); // Discharge Date
      // this.sno.push(claim.actualdateofdischarge); // Actual Date Of Discharge
      // this.sno.push(claim.claimRaiseby); // Claim Raised By
      this.sno.push(this.convertCurrency(claim.currentTotalAmount)); // Claim Amount(₹)
      // this.sno.push(this.convertCurrency(claim.snaApprovedAmount)); // Approved Amount(₹)
      this.sno.push(this.convertCurrency(claim.partialAmount)); // Partial Claim Amount(₹)
      this.report.push(this.sno);
    }

    if (no == 1) {
      let filter = [];
      filter.push([['From Date', this.fromDate]]);
      filter.push([['To Date', this.toDate]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Partial Claim Dc Compliance',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('l', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Partial Claim Dc Compliance", 120, 15);
      doc.setFontSize(13);
      doc.text('Actual Date of Discharge From :- ' + this.fromDate, 15, 25);
      doc.text('Actual Date of Discharge To :- ' + this.toDate, 190, 25);
      doc.text('GeneratedOn :- ' + generatedOn, 190, 32);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 32);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 50,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Partial Claim Dc Compliance.pdf');
    }
  }


  Findmortality(value: any) {
    if (value == 'Y') {
      value = 'Yes';
    } else if (value == 'N') {
      value = 'No';
    } else {
      value = 'N/A';
    }
    return value;
  }
  scheme: any = [];
  getSchemeData() {
    let data = {
      action: 'A',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe(
      (res: any) => {
        let resData = this.encryptionService.getDecryptedData(res);
        if (resData.status == 'success') {
          this.scheme = resData.data;
          for (let i = 0; i < this.scheme.length; i++) {
            this.schemeidvalue = this.scheme[i].schemeId;
            this.schemeName = this.scheme[i].schemeName;
          }
          this.getSchemeDetails();
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }

  schemeList: any = [];
  getSchemeDetails() {
    let data = {
      action: 'B',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe(
      (res: any) => {
        let resData = this.encryptionService.getDecryptedData(res);
        if (resData.status == 'success') {
          this.schemeList = resData.data;
          //  this.InclusionofsearchingforschemePackageData();
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }

  schemecategoryidvalue: any;
  schemecategoryName: any;
  getschemacategoryid(event: any) {
    if (event != null && event != undefined && event != '' && event != '') {
      for (let i = 0; i < this.schemeList.length; i++) {
        if (event == this.schemeList[i].schemeCategoryId)
          this.schemecategoryidvalue = this.schemeList[i].schemeCategoryId;
        this.schemecategoryName = this.schemeList[i].categoryName;
      }
    } else {
      this.schemecategoryidvalue = '';
      this.schemecategoryName = 'All';
    }
  }
}
