import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../../header.service';
import { CreatecpdserviceService } from '../../../Services/createcpdservice.service';
import { Router } from '@angular/router';
import Swal from "sweetalert2";
import { TableUtil } from "../../../util/TableUtil";
declare let $: any;
import jsPDF from 'jspdf'
import autoTable from "jspdf-autotable";
import { DynamicreportService } from "../../../Services/dynamicreport.service";
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { PackageDetailsMasterService } from 'src/app/application/Services/package-details-master.service';
import { EncryptionService } from 'src/app/services/encryption.service';

@Component({
  selector: 'app-cpdreapproval',
  templateUrl: './cpdreapproval.component.html',
  styleUrls: ['./cpdreapproval.component.scss']
})
export class CpdreapprovalComponent implements OnInit {

  childmessage: any;
  claimlist: any = [];
  userId: string;
  user: any;
  trigger: any
  triggerList: any[] = [];
  txtsearchDate: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  record: any;
  currentPagenNum: any;
  months: any;
  year: any;
  months2: any;
  frstDay: any;
  secoundDay: any;
  logo: any = "assets/img/bsky-logo-lg.png";
  reClaimCount: any;
  authMode: any;
  allRecordsSize: any;
  schemeidvalue: any = 1
  schemeName: any
  constructor(private cpdService: CreatecpdserviceService, public headerService: HeaderService, public router: Router, private service: DynamicreportService, private sessionService: SessionStorageService, public packageDetailsMasterService: PackageDetailsMasterService, private encryptionService: EncryptionService) { }

  ngOnInit(): void {
    this.headerService.setTitle('CPD Re-Settlement');
    this.currentPagenNum = this.sessionService.decryptSessionData("currentPageNum");
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.currentPage = 1;
    this.pageElement = 10;
    this.getSchemeData();
    this.getTriggerList();
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
    let searchFilterParameters = this.sessionService.decryptSessionData("searchFilterParameters");
    if (searchFilterParameters != null && searchFilterParameters.type == 'REAPPROVAL') {
      $('input[name="fromDate"]').val(searchFilterParameters.fromDate);
      $('input[name="toDate"]').val(searchFilterParameters.toDate);
      $('#orderValue').val(searchFilterParameters.orderValue);
      $('#authMode').val(searchFilterParameters.authMode);
      this.searchFilter();
    } else {
      sessionStorage.removeItem('searchFilterParameters');
      let date = new Date();
      let year = date.getFullYear();
      let date1 = '01';
      let month: any = date.getMonth() - 2;

      if (month == -1) {
        this.months = 'Dec';
        this.year = year - 1;
      } else if (month == -2) {
        this.months = 'Nov';
        this.year = year - 1;
      } else {
        this.months = this.getMonthFrom(month);
        this.year = year;
      }
      let date2 = date.getDate();
      this.months2 = this.getMonthFrom(date.getMonth())
      this.frstDay = date1 + '-' + 'Jan' + '-' + 2018;
      this.secoundDay = date2 + "-" + this.months2 + "-" + year;
      $('input[name="fromDate"]').val(this.frstDay).attr('placeholder', 'From Date *');
      $('input[name="toDate"]').attr('placeholder', 'To Date *');
      this.getCPDReapprovalClaimList();
      this.getCPDReApprovalClaimListCountData();
    }
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

  getCPDReApprovalClaimListCount(userId, orderValue, fromDate, toDate, authMode, trigger: any, schemeid: any, schemecategoryid: any) {
    this.cpdService.getCPDReApprovalClaimListCount(userId, orderValue, fromDate, toDate, authMode, trigger, schemeid, schemecategoryid).subscribe(data => {
      if (data != null && data.status == 'success') {
        this.reClaimCount = data.data.reClaimCount;
      } else {
        this.swal('Error', 'Failed to Fetch Re-Claim Count!', 'error');
        this.reClaimCount = 0;
      }
    });
  }

  getCPDReapprovalClaimList() {
    let orderValue = $('#orderValue').val();
    let fromDate = $('#fromDate').val();
    let toDate = $('#toDate').val();
    let authMode = $('#authMode').val();
    let trigger = $('#trigger').val();
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    this.cpdService.getCPDReapprovalClaimListSearchFilter(this.user.userId, orderValue, fromDate, toDate, authMode, trigger, schemeid, schemecategoryid).subscribe(data => {
      this.claimlist = data;
      this.allRecordsSize = this.claimlist.length;
      this.record = this.claimlist.length;
      if (this.record > 0) {
        this.showPegi = true;
        this.traverseToRequiredPage();
      }
      else {
        this.showPegi = false;
      }
    });
  }

  getCPDReApprovalClaimListCountData() {
    let orderValue = $('#orderValue').val();
    let fromDate = $('#fromDate').val();
    let toDate = $('#toDate').val();
    let authMode = $('#authMode').val();
    let trigger = $('#trigger').val();
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    this.getCPDReApprovalClaimListCount(this.user.userId, orderValue, fromDate, toDate, authMode, trigger, schemeid, schemecategoryid);
  }

  onAction(claimID: any, transactionID: any, URN: any, transClaimId: any, authorizedcode: any, hospitalcode: any, actualDate: any, caseNo: any, claimNo: any) {
    let actionTimeObject = {
      "caseNo": caseNo,
      "userId": this.user.userId,
      "claimNo": claimNo
    }
    var obj = 'claimID:' + claimID + ' transactionID:' + transactionID + ' URN:' + URN + ' transClaimId:' + transClaimId + ' authorizedCode:' + authorizedcode + ' hospitalCode:' + hospitalcode + ' actualDate:' + actualDate;//[claimID, transactionID, URN];
    this.router.navigateByUrl('/application/cpdreapproval', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/application/cpdreapproval/action']));
    localStorage.setItem("cpdActionItems", obj);
    localStorage.setItem("actionTimeObject", JSON.stringify(actionTimeObject));
    this.sessionService.encryptSessionData("currentPageNum", this.currentPage);
    this.cpdService.exchangeData(obj);
  }


  traverseToRequiredPage() {
    if (this.currentPagenNum != null && this.currentPagenNum != undefined) {
      this.currentPage = this.currentPagenNum;
      sessionStorage.removeItem('currentPageNum');
    } else {
      this.currentPage = 1;
    }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  searchFilter() {
    let orderValue = $('#orderValue').val();
    let fromDate = $('#fromDate').val();
    let toDate = $('#toDate').val();
    let authMode = $('#authMode').val();
    let trigger = $('#trigger').val();

    let searchFilterParameters1 = {
      orderValue: orderValue,
      fromDate: fromDate,
      toDate: toDate,
      authMode: authMode,
      trigger: trigger,
      type: 'REAPPROVAL'
    }
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }

    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', 'Actual Date of Discharge From Must be Less Than Actual Date of Discharge To!', 'info');
      return;
    }

    this.cpdService.getCPDReapprovalClaimListSearchFilter(this.user.userId, orderValue, fromDate, toDate, authMode, trigger, schemeid, schemecategoryid).subscribe(data => {
      this.getCPDReApprovalClaimListCount(this.user.userId, orderValue, fromDate, toDate, authMode, trigger, schemeid, schemecategoryid);
      this.claimlist = data;
      this.allRecordsSize = this.claimlist.length;
      this.showPegi = this.claimlist.length > 0;
    });
    this.sessionService.encryptSessionData("searchFilterParameters", searchFilterParameters1);
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  ResetField() {
    window.location.reload();
    sessionStorage.removeItem('searchFilterParameters');
  }

  formatDate(date: any) {
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return date.substring(8, 10) + '-' + months[parseInt(date.substring(5, 7)) - 1] + '-' + date.substring(0, 4)
  }

  downloadReport(type: any) {
    let SlNo = 1;
    let report = [];
    let heading = [['Sl#', 'Claim No', 'URN', 'Case No', 'Invoice No', 'Patient Name', 'Actual Date of Admission', 'Actual Date of Discharge', 'Re-Apply Date', 'Action to be Taken By']];
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (type == 'excel') {
      let claim: any;
      this.claimlist.forEach(element => {
        claim = {
          "Sl#": SlNo,
          "Claim No": element.claimNo,
          "URN": element.URN,
          "Case No": element.caseNo,
          "Invoice No": element.invoiceNo,
          "Patient Name": element.patientName,
          "Actual Date of Admission": this.formatDate(element.actualDate),
          "Actual Date of Discharge": this.formatDate(element.actualDateOfDischarge),
          "Re-Apply Date": this.formatDate(element.revisedDate),
          "Action to be Taken By": this.formatDate(element.takenDate)
        }
        report.push(claim);
        SlNo++;
      });
      TableUtil.exportListToExcel(report, "CPD Re-Approval List", heading);
    } else if (type == 'pdf') {
      if (this.claimlist.length > 0) {
        this.claimlist.forEach(element => {
          let rowData = [];
          rowData.push(SlNo);
          rowData.push(element.claimNo);
          rowData.push(element.URN);
          rowData.push(element.caseNo);
          rowData.push(element.invoiceNo);
          rowData.push(element.patientName);
          rowData.push(this.formatDate(element.actualDate));
          rowData.push(this.formatDate(element.actualDateOfDischarge));
          rowData.push(this.formatDate(element.revisedDate));
          rowData.push(this.formatDate(element.takenDate));
          report.push(rowData);
          SlNo++;
        })
        let doc = new jsPDF('p', 'pt');
        doc.setFontSize(20);
        doc.setTextColor(26, 99, 54);
        doc.setFont('helvetica', 'bold');
        doc.text('CPD Re-Approval List', 220, 30);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text('Document Generate Date : ' + new Date().getDate() + ' ' + months[new Date().getMonth()] + ' ' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(), 210, 50);
        doc.text('Actual Date of Discharge From : ' + $('#fromDate').val(), 50, 70);
        doc.text('Actual Date of Discharge To : ' + $('#toDate').val(), 350, 70);
        autoTable(doc,
          {
            head: heading,
            body: report,
            startY: 80,
            theme: 'grid',
            styles: { overflow: 'linebreak', fontSize: 8, valign: 'middle', halign: 'left', font: 'helvetica' },
            headStyles: { fillColor: [26, 99, 54], textColor: 255, fontStyle: 'bold', fontSize: 8 },
            bodyStyles: { textColor: 0, fontSize: 8, overflow: 'linebreak' }
          });
        doc.save('CPD Re-Approval List.pdf');
      } else {
        this.swal('', 'No Records Found', 'info');
      }
    }
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  changeAuthMode(event: any) {
    this.authMode = event.target.value;
  }

  getTriggerList() {
    this.service.findAllActiveTrigger().subscribe((data: any) => {
      this.triggerList = data;
    })
  }

  onChangemamdetrigger(trigger) {
    this.trigger = trigger;
  }

  ///scheme
  scheme: any = [];
  getSchemeData() {
    let data = {
      action: 'A',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe((res: any) => {
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
      console.log(this.scheme);
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  schemeList: any = [];
  getSchemeDetails() {
    let data = {
      action: 'B',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe((res: any) => {
      let resData = this.encryptionService.getDecryptedData(res);
      if (resData.status == 'success') {
        this.schemeList = resData.data;
      } else {
        this.swal('', 'Something went wrong.', 'error');

      }
      console.log(this.schemeList);
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  schemecategoryidvalue: any
  schemecategoryName: any;
  getschemacategoryid(event: any) {
    if (event != null && event != undefined && event != '' && event != "") {
      for (let i = 0; i < this.schemeList.length; i++) {
        if (event == this.schemeList[i].schemeCategoryId)
          this.schemecategoryidvalue = this.schemeList[i].schemeCategoryId;
        this.schemecategoryName = this.schemeList[i].categoryName;
      }
    } else {
      this.schemecategoryidvalue = '';
      this.schemecategoryName = "All"
    }
  }
}
