import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { PaidamountserviceService } from '../application/Services/paidamountservice.service';
import { TableUtil } from '../application/util/TableUtil';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-paidinternal',
  templateUrl: './paidinternal.component.html',
  styleUrls: ['./paidinternal.component.scss']
})
export class PaidinternalComponent implements OnInit {
  paymentdate:any
  number:any
  totaldischarge:any
  user: any;
  showPegi: boolean;
  paidList: any=[];
  currentPage: any;
  pageElement: any;
  datavalue: any=[];
  value: any;
  txtsearchDate: any

  constructor(public paidamountserviceService: PaidamountserviceService, 
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.currentPage = 1;
    this.pageElement = 100;
    this.user = this.sessionService.decryptSessionData("user");
    this.paymentdate=this.sessionService.decryptSessionData('paymentdate');
    this.number=this.sessionService.decryptSessionData('number');
    this.totaldischarge=this.sessionService.decryptSessionData('totaldischarge');
    this.onGetdata();
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
    claimno: "",
    urnnumber: "",
    invoicenymber: "",
    hospitalname: "",
    patientname: "",
    packagecode: "",
    ActualdateofDischarge: "",
    paymentdate: "",
    ddcheuenumber: "",
  };
  heading = [['Sl#','Claim No','Urn Number','Invoice Number','Hospital Name','Patient Name','Package Code','Actual Date Of Discharge','Payment Date','DD Cheque Number']];

  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.paidList.length; i++) {
        claim = this.paidList[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.claimno = claim.claim_no!=null?claim.claim_no:"N/A";
        this.sno.urnnumber = claim.urn!=null?claim.urn:"N/A";
        this.sno.invoicenymber = claim.invoiceno!=null?claim.invoiceno:"N/A";
        this.sno.hospitalname = claim.hospitalname!=null ? claim.hospitalcode != null ? claim.hospitalname + "(" + claim.hospitalcode + ")" : "N/A" : "N/A"
        this.sno.patientname = claim.patientname!=null?claim.patientname:"N/A";
        this.sno.packagecode = claim.packagecode!=null ? claim.packagename != null ? claim.packagecode + "(" + claim.packagename + ")" : "N/A" : "N/A"
        this.sno.ActualdateofDischarge = this.convertStringToDate(claim.actualdateofdischarge!=null?claim.actualdateofdischarge:"N/A");
        if(claim.payment_date !='N/A'){
        this.sno.paymentdate =this.convertStringToDate(claim.payment_date != null ? claim.payment_date : "N/A");
        }else if(claim.payment_date =='N/A'){
          this.sno.paymentdate =claim.payment_date != null ? claim.payment_date : "N/A";
        }
        this.sno.ddcheuenumber = claim.DD_CHEQUE_NUMBER!=null?claim.DD_CHEQUE_NUMBER:"N/A";
        this.report.push(this.sno);
      }
      if(this.user.groupId == 1){
        TableUtil.exportListToExcel(this.report, "Admin_Paid_ReportDetails", this.heading);
        }else if(this.user.groupId == 5){
          TableUtil.exportListToExcel(this.report, "HospitalWise_Paid_ReportDetails", this.heading);
        }else if(this.user.groupId == 8){
          TableUtil.exportListToExcel(this.report, "FO_Paid_ReportDetails", this.heading);
        }else if(this.user.groupId == 6){
          TableUtil.exportListToExcel(this.report, "DC_Paid_ReportDetails", this.heading);
        }
    } else if (type == 'pdf') {
      if (this.paidList.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let SlNo = 1;
      this.paidList.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.claim_no!=null?element.claim_no:"N/A");
        rowData.push(element.urn!=null?element.urn:"N/A");
        rowData.push(element.invoiceno!=null?element.invoiceno:"N/A");
        rowData.push(element.hospitalname!=null ? element.hospitalcode != null ? element.hospitalname + "(" + element.hospitalcode + ")" : "N/A" : "N/A");
        rowData.push(element.patientname!=null?element.patientname:"N/A");
        rowData.push(element.packagecode!=null ? element.packagename != null ? element.packagecode + "(" + element.packagename + ")" : "N/A" : "N/A");
        rowData.push(this.convertStringToDate(element.actualdateofdischarge!=null?element.actualdateofdischarge:"N/A"));
        if(element.payment_date !='N/A'){
        rowData.push(this.convertStringToDate(element.payment_date!=null?element.payment_date:"N/A"));
        }else if(element.payment_date =='N/A'){
          rowData.push(element.payment_date!=null?element.payment_date:"N/A");
        }
        rowData.push(element.DD_CHEQUE_NUMBER!=null?element.DD_CHEQUE_NUMBER:"N/A");
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [220, 270]);
      doc.setFontSize(10);
      if(this.user.groupId==1){
      doc.text('Authority Name :-' + this.user.fullName + '(' + (this.user.userName) + ')', 5, 5);
      }else if(this.user.groupId==5){
        doc.text('Hospital Name :-' + this.user.fullName + '(' + (this.user.userName) + ')', 5, 5);
      }else if(this.user.groupId==8){
        doc.text('FO Name :-' + this.user.fullName + '(' + (this.user.userName) + ')', 5, 5);
      }else if(this.user.groupId==6){
        doc.text('DC Name :-' + this.user.fullName + '(' + (this.user.userName) + ')', 5, 5);
      }
      doc.text('Document Generate Date : ' + new Date().getDate() + ' ' + months[new Date().getMonth()] + ' ' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(), 5, 10);
      doc.text('Paid Report', 100, 25);
      doc.setLineWidth(0.7);
      doc.line(100, 26, 120, 26);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 28, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 30 },
          5: { cellWidth: 20 },
          6: { cellWidth: 30 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
        }
      })
      if(this.user.groupId==1){
        doc.save('Admin_Paid_ReportDetails.pdf');
        }else if(this.user.groupId==5){
        doc.save('HospitalWise_Paid_ReportDetails.pdf');
        }else if(this.user.groupId==8){
        doc.save('FO_Paid_ReportDetails.pdf');
        }else if(this.user.groupId==6){
        doc.save('DC_Paid_ReportDetails.pdf');
        }
      }
  }
  convertStringToDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
    }
    pageItemChange() {
      this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
      console.log(this.pageElement);
    }
    onPageBoundsCorrection(number: number) {
      this.currentPage = number;
  }
  onGetdata(){
    this.paidamountserviceService.getcllickdata(this.paymentdate!=undefined?this.paymentdate:'',this.number,this.totaldischarge,this.user.userName,this.user.groupId).subscribe((response)=>{
      this.datavalue=response;
      console.log(this.datavalue);
      this.paidList = JSON.parse(this.datavalue.inside);
      console.log(this.paidList);
      this.value = this.paidList.length;
      if (this.value > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    },
    (error) => {
      console.log(error);
      this.swal('', 'Something went wrong.', 'error');
    }
  );
  }
}
