import { Component, OnInit } from '@angular/core';
import {HeaderService} from "../../header.service";
import {TableUtil} from "../../util/TableUtil";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {CpdPaymentCalculationService} from "../../Services/cpd-payment-calculation.service";
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-cpd-payment-calculation',
  templateUrl: './cpd-payment-calculation.component.html',
  styleUrls: ['./cpd-payment-calculation.component.scss']
})
export class CpdPaymentCalculationComponent implements OnInit {

  user: any;
  currentPage: any;
  frstDay: any;
  secoundDay: any;
  months: any;
  months2: any;
  year: any;
  txtsearchDate: any;
  cpdUserList: any;
  keyword = 'fullname';
  cpdUserId: any;
  responseData: any;

  constructor(
    private headerService: HeaderService,
    private cpdPaymentCalculation: CpdPaymentCalculationService,private sessionService: SessionStorageService,
    private router: Router) { }

  ngOnInit(): void {
    this.headerService.setTitle('CPD Payment Calculation');
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.setDate();
    this.getCPDUserList();
  }

  setDate() {
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

    sessionStorage.removeItem('searchFilterParameters');

    let currentDate = new Date();

    // let firstDate = new Date(currentDate);
    // firstDate.setDate(currentDate.getDate() - 30);

    const firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

    this.frstDay = this.formatDate(firstDate);

    let secondDate = new Date(currentDate);
    this.secoundDay = this.formatDate(secondDate);

    $('input[name="fromDate"]').val(this.frstDay).attr('placeholder', 'From Date *');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
  }

  formatDate(date) {
    const monthsArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let day = date.getDate();
    let month = monthsArray[date.getMonth()];
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  resetField() {
    window.location.reload();
  }

  downloadReport(type: string) {
    let SlNo = 1;
    let report = [];
    let heading = [['Sl#','CPD Full Name','Claim Desc.','Total Claims','Total Amount Paid']];
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (type == 'excel') {
      let claim: any;
      this.responseData.responseList.forEach(element => {
        claim = {
          'Sl#': SlNo,
          'CPD Full Name': element.fullName,
          'Claim Desc.': element.claimDesc,
          'Total Claims': element.totalClaims,
          'Total Amount Paid': element.totalAmountPaid
        }
        report.push(claim);
        SlNo++;
      });
      claim = {
        'Sl#': 'Total',
        'CPD Full Name': '',
        'Claim Desc.': '',
        'Total Claims': this.responseData.totalClaimsCount,
        'Total Amount Paid': this.responseData.totalAmount
      }
      report.push(claim);
      TableUtil.exportListToExcel(report, "CPD Payment Calculation", heading);
    } else if (type == 'pdf') {
      if (this.responseData.responseList.length > 0) {
        this.responseData.responseList.forEach(element => {
          let rowData = [];
          rowData.push(SlNo);
          rowData.push(element.fullName);
          rowData.push(element.claimDesc);
          rowData.push(element.totalClaims);
          rowData.push(element.totalAmountPaid);
          report.push(rowData);
          SlNo++;
        });
        let rowData = [];
        rowData.push('Total');
        rowData.push('');
        rowData.push('');
        rowData.push(this.responseData.totalClaimsCount);
        rowData.push(this.responseData.totalAmount);
        report.push(rowData);
        let doc = new jsPDF('p', 'pt');
        doc.setFontSize(20);
        doc.setTextColor(26, 99, 54);
        doc.setFont('helvetica', 'bold');
        doc.text('CPD Payment Calculation', 200, 30);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text('Document Generate Date : ' + new Date().getDate() + ' ' + months[new Date().getMonth()] + ' ' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(), 280, 50);
        doc.text('CPD Allotted Date From : ' + $('#fromDate').val(), 50, 70);
        doc.text('CPD Allotted Date To : ' + $('#toDate').val(), 350, 70);

        autoTable(doc,
          {
            head: heading,
            body: report,
            startY: 80,
            theme: 'grid',
            styles: {overflow: 'linebreak', fontSize: 8, valign: 'middle', halign: 'left', font: 'helvetica'},
            headStyles: {fillColor: [26, 99, 54], textColor: 255, fontStyle: 'bold', fontSize: 8},
            bodyStyles: {textColor: 0, fontSize: 8, overflow: 'linebreak'}
          });

        doc.save('CPD Payment Calculation.pdf');
      } else {
        Swal.fire({
          title: 'No Data Found',
          icon: 'warning'
        });
      }
    }
  }

  getCPDUserList() {
    this.cpdPaymentCalculation.getCPDUserList().subscribe(res => {
      this.cpdUserList = res;
      if (this.cpdUserList.length > 0) {
        this.getPaymentCalculationList();
      }
    });
  }

  data: any;
  getPaymentCalculationList() {
    let fromDate = $('input[name="fromDate"]').val();
    let toDate = $('input[name="toDate"]').val();
    this.cpdPaymentCalculation.getCPDPaymentCalculationList(fromDate, toDate, this.cpdUserId).subscribe((res : any) => {
    if (this.cpdUserId == undefined) {
      let responseList = res.responseList;
      if (responseList.length > 0) {
        this.cpdUserId = responseList[0].userId;
        this.getPaymentCalculationList();
        this.cpdUserList.forEach((element: any) => {
          if (element.userId == this.cpdUserId)
            this.data = element;
        });
      }
    } else
      this.responseData = res;
    });
  }

  searchFilter() {
    let fromDate = $('input[name="fromDate"]').val();
    let toDate = $('input[name="toDate"]').val();

    if(new Date(fromDate) >= new Date(toDate)){
      Swal.fire({
        title: 'Warning',
        text: 'From Date should be less than To Date',
        icon: 'warning'
      });
      return;
    }

    let dateDifferenceInDays = Math.floor(
      (
        Date.UTC(
          new Date(toDate).getFullYear(),
          new Date(toDate).getMonth(),
          new Date(toDate).getDate()
        )
        -
        Date.UTC(
          new Date(fromDate).getFullYear(),
          new Date(fromDate).getMonth(),
          new Date(fromDate).getDate())
      ) /(1000 * 60 * 60 * 24));

    if (dateDifferenceInDays > 30) {
      Swal.fire({
        title: 'Warning',
        text: 'Date Difference should not be more than 30 days',
        icon: 'warning'
      });
      return;
    }

    this.cpdPaymentCalculation.getCPDPaymentCalculationList(fromDate, toDate, this.cpdUserId).subscribe(res => {
      this.responseData = res;
    });
  }

  OnChangeRemark(event: any) {
    this.cpdUserId = event.userId;
  }

  showPaymentOfUser(userId: any, actionCode: any, cpdName: any, processDescription: any) {
    let data = {
      userId: userId,
      cpdName: cpdName,
      processDescription: processDescription,
      fromDate: $('input[name="fromDate"]').val(),
      toDate: $('input[name="toDate"]').val(),
      actionCode: actionCode
    }

    // sessionStorage.setItem('searchFilterParameters', JSON.stringify(data));
    this.sessionService.encryptSessionData("searchFilterParameters", data);
    this.router.navigate(['/cpdPaymentCalculationDetails']);
  }
}
