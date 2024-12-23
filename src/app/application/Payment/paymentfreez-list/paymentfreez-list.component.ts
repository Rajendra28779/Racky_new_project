import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { TableUtil } from '../../util/TableUtil';
import { PaymentfreezeserviceService } from '../../Services/paymentfreezeservice.service';
import { DatePipe, formatDate } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Router } from '@angular/router';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/services/jwt.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare var $: any;

@Component({
  selector: 'app-paymentfreez-list',
  templateUrl: './paymentfreez-list.component.html',
  styleUrls: ['./paymentfreez-list.component.scss']
})
export class PaymentfreezListComponent implements OnInit {

  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  Filtered: any;
  user: any;
  paymentList: any = [];
  foremarks: any = [];
  paymentDetails: any = [];
  modaldata: any = [];
  foremarkdetails: any = [];
  public snoList: any = [];
  txtsearchDate: any;
  txtsearch: any;
  header: any;
  headervalue: any
  snoUserId: any;
  keyword: any = 'fullName';
  months: any;
  year: any;
  months2: any;
  frstDay: string;
  status: any
  secondDay: string;
  isVerifyCEO: boolean = true;
  isClarifyCEO: boolean = true;
  isVerifyJoinCEO: boolean = true;
  isClarifyJointCEO: boolean = true;
  snadoctornamehidestatus: Boolean = true;
  isActive1: boolean = false;
  isActive2: boolean = true;
  isActive3: boolean = false;
  isActive4: boolean = false;
  state: any;
  feildname: any;
  backPageName: string = "zero";

  @ViewChild('closebutton') closebutton;
  @ViewChild('closebutton1') closebutton1;
  constructor(private sessionService: SessionStorageService, private paymentService: PaymentfreezeserviceService, public headerService: HeaderService, public datepipe: DatePipe,
    public router: Router, private snoConfigService: SnocreateserviceService, private jwtService: JwtService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.backPageName = this.sessionService.decryptSessionData("backPageName");
    sessionStorage.removeItem("backPageName");
    this.headerService.setTitle('Payment Freeze List');
    this.currentPage = 1;
    this.pageElement = 50;
    this.isVerifyCEO = true;
    this.isClarifyCEO = false;
    this.isVerifyJoinCEO = false;
    this.isClarifyJointCEO = false;
    localStorage.removeItem("floatclaimdetails")
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
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth() - 1;
    if (month == -1) {
      this.months = 'Dec';
      this.year = year - 1;
    } else {
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    let date2 = date.getDate();
    this.months2 = this.getMonthFrom(date.getMonth());
    this.frstDay = date1 + '-' + this.months + '-' + this.year;
    this.secondDay = date2 + '-' + this.months2 + '-' + year;
    $('input[name="fromDate"]').val(this.frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.state = JSON.parse(localStorage.getItem('revertdata'));
    if (!this.state) {
      this.isActive1 = false;
      this.isActive2 = false;
      this.isActive3 = false;
      this.isActive4 = true;
    } else {
      this.isActive1 = this.state.isActive1;
      this.isActive2 = this.state.isActive2;
      this.isActive3 = this.state.isActive3;
      this.isActive4 = this.state.isActive4;
    }

    if (this.backPageName != "zero" && this.backPageName != "" && this.backPageName != null && this.backPageName != undefined) {
      (this.backPageName == "one" ? this.isActive1 = true
        : (this.backPageName == "two" ? this.isActive2 = true
          : (this.backPageName == "three" ? this.isActive3 = true
            : this.backPageName == "four" ? this.isActive4 = true : false)));
    }

    if (this.user.groupId == 4) {
      this.snadoctornamehidestatus = false;
      this.snoUserId = this.user.userId;
      if (this.backPageName != "zero" && this.backPageName != "" && this.backPageName != null && this.backPageName != undefined) {
        (this.backPageName == "one" ? (this.isActive1 = true, this.getVerifyFloatList())
          : (this.backPageName == "two" ? (this.isActive2 = true, this.OnFoRemarks())
            : (this.backPageName == "three" ? (this.isActive3 = true, this.getClarifyFromCEO())
              : this.backPageName == "four" ? (this.isActive4 = true, this.verifyFromDyCEO()) : false)));
      } else {
        this.verifyFromDyCEO();
      }
    }
    this.getSNOList();
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

  getVerifyFloatList() {
    this.feildname = 'Verified From CEO';
    this.isActive1 = true;
    this.isActive2 = false;
    this.isActive3 = false;
    this.isActive4 = false;
    localStorage.removeItem('revertdata');
    let userId = this.snoUserId;
    this.status = 'P';

    this.isVerifyCEO = true;
    this.isClarifyCEO = false;
    this.isVerifyJoinCEO = false;
    this.isClarifyJointCEO = false;

    this.formdate = $('#datepicker1').val();
    this.todate = $('#datepicker2').val();
    $('#value1').show();
    $('#value2').hide();
    $('#value3').hide();
    if (Date.parse(this.formdate) > Date.parse(this.todate)) {
      this.swal('', 'From Date Should Be Less Than To Date', 'error');
      return;
    }
    if (userId == undefined || userId == null || userId == '') {
      this.swal('', 'Please Select SNA Doctor', 'info');
      return;
    }
    this.paymentList = [];
    let pendingAt = 14;
    this.paymentService.getPaymentFrzDtlsList(userId, this.formdate, this.todate, pendingAt).subscribe((alldata) => {
      this.paymentList = alldata;
      this.record = this.paymentList.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    });
  }

  formdate: any;
  todate: any;
  OnFoRemarks() {
    this.feildname = 'Remark By FO';
    this.forwardPending = 5;
    this.isActive1 = false;
    this.isActive2 = true;
    this.isActive3 = false;
    this.isActive4 = false;
    localStorage.removeItem('revertdata');
    let userId = this.snoUserId;
    this.status = 'R';

    this.isVerifyCEO = false;
    this.isClarifyCEO = false;
    this.isVerifyJoinCEO = false;
    this.isClarifyJointCEO = true;

    $('#value1').hide();
    $('#value2').show();
    $('#value3').hide();
    this.formdate = $('#datepicker1').val();
    this.todate = $('#datepicker2').val();
    if (Date.parse(this.formdate) > Date.parse(this.todate)) {
      this.swal('', 'Float Generation Date From should be Less Than Float Generation Date To', 'error');
      return;
    }

    if (userId == undefined || userId == null || userId == '') {
      this.swal('', 'Please Select SNA Doctor', 'info');
      return;
    }
    this.foremarks = [];
    let pendingAt = 4;
    this.paymentService.getforemarkslist(userId, this.formdate, this.todate, pendingAt).subscribe((res) => {
      this.foremarks = res;
      this.record = this.foremarks.length;
      if (this.record > 0) {
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    });
  }
  detailsData: any = [];
  getPaymentFreezeDetails(floatNo: any) {
    this.detailsData = [];
    this.paymentService.getFloatClaimDetails(floatNo).subscribe((alldata) => {
      this.paymentDetails = alldata;
      this.paymentDetails.forEach(element => {
        if (element.foRemarks != undefined) {
          this.detailsData.push(element);
        }
      });
      if (this.detailsData.length == 0) {
        $('#forward').hide();
        $('#Cancel').hide();
      }
    });
  }

  getActionDetails(claimid, urn: any) {
    localStorage.setItem('claimid', claimid);
    let state = {
      Urn: urn
    }
    localStorage.setItem("trackingdetails", JSON.stringify(state));
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.router.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/trackingdetails');
    });
  }
  forwardPending: any;
  view(item: any,floatId:any) {
    let state = {
      floatId:floatId,
      Action: item,
      isActive1: this.isActive1,
      isActive2: this.isActive2,
      isActive3: this.isActive3,
      isActive4: this.isActive4,
      pendingAt: this.forwardPending
    }
    localStorage.setItem("revertdata", JSON.stringify(state));
    this.sessionService.encryptSessionData('backPageName', (this.isActive1 ? "one" : (this.isActive2 ? "two" : (this.isActive3 ? "three" : (this.isActive4 ? "four" : "zero")))));
    this.router.navigate(['/application/revertedfloatdetails']);
  }

  view1(item: any,floatId:any) {
    let state = {
      floatId:floatId,
      Action: item,
      isActive1: this.isActive1,
      isActive2: this.isActive2,
      isActive3: this.isActive3,
      isActive4: this.isActive4,
    }
    localStorage.setItem("freezedata", JSON.stringify(state));
    this.sessionService.encryptSessionData('backPageName', (this.isActive1 ? "one" : (this.isActive2 ? "two" : (this.isActive3 ? "three" : (this.isActive4 ? "four" : "zero")))));
    this.router.navigate(['/application/paymentFreezeDetails']);
  }

  viewreport(floatNumber) {
    sessionStorage.removeItem('Searchtype');
    sessionStorage.removeItem('floatNumber');
    sessionStorage.removeItem('currentPageNum');
    sessionStorage.removeItem('fullname');
    sessionStorage.removeItem('snaName');
    let Searchtype = $('#authMode').val();
    this.sessionService.encryptSessionData('Searchtype', Searchtype);
    this.sessionService.encryptSessionData('floatNumber', floatNumber);
    this.sessionService.encryptSessionData('fullname', this.user.fullName);
    this.sessionService.encryptSessionData('snaName', this.user.fullName);
    this.sessionService.encryptSessionData('currentPageNum', this.currentPage);
    this.sessionService.encryptSessionData('backPageName', (this.isActive1 ? "one" : (this.isActive2 ? "two" : (this.isActive3 ? "three" : (this.isActive4 ? "four" : "zero")))));
    this.router.navigate(['/application/floatReport']);
  }

  getfloatdetailsHospitalwise(floatnumber: any) {
    this.sessionService.encryptSessionData('hospitalwisefloatnumber', floatnumber);
    this.sessionService.encryptSessionData('Date', this.formdate);
    this.router.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/hospitalwisefloatnumberDetails');
    });
  }

  paymentFreeze(item) {
    Swal.fire({
      title: item,
      text: 'Are you sure you want to freeze this payment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Freeze it!'
    }).then((res) => {
      if (res.isConfirmed) {
        this.paymentService.paymentFreeze(item, this.snoUserId).subscribe(data => {
          if (data.status == 'Success') {
            this.closebutton.nativeElement.click();
            this.getVerifyFloatList();
            this.swal("Info", data.message, "info");
          } else if (data.status == 'Failed') {
            this.swal("Error", data.message, "error");
          }
        });
      }
    });
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  });

  list: any = [];
  float: any = {
    slNo: "",
    floatno: "",
    generatedOn: "",
    amount: ""
  };
  heading1 = [['Sl No', 'Float No', 'Generated On', 'Remark', 'Totalclaimcount', 'Amount']];

  downloadList() {
    this.list = [];
    if (this.status == 'P') {
      let item: any;
      for (var i = 0; i < this.paymentList.length; i++) {
        item = this.paymentList[i];
        this.float = [];
        this.float.slNo = i + 1;
        this.float.floatno = item.floatNo;
        this.float.generatedOn = this.datepipe.transform(item.createdOn, 'dd-MMM-yyyy hh:mm:ss a');
        this.float.remark = item.remark;
        this.float.totalclaimcount = item.count;
        if (item.amount) {
          this.float.amount = this.formatter.format(item.amount);
        } else {
          this.float.amount = this.formatter.format(0);
        }
        this.list.push(this.float);
      }
      let filter = [];
      filter.push([['Payment From Date', this.formdate]]);
      filter.push([['Payment To Date', this.todate]]);
      TableUtil.exportListToExcelWithFilter(this.list, this.feildname, this.heading1, filter);
    }
    else if (this.status == 'R') {
      this.list = [];
      let item: any;
      for (var i = 0; i < this.foremarks.length; i++) {
        item = this.foremarks[i];
        this.float = [];
        this.float.slNo = i + 1;
        this.float.floatno = item.floatNo;
        this.float.generatedOn = this.datepipe.transform(item.created_on, 'dd-MMM-yyyy hh:mm:ss a');
        if (item.amount) {
          this.float.amount = this.formatter.format(item.amount);
        } else {
          this.float.amount = this.formatter.format(0);
        }
        this.list.push(this.float);
      }
      let filter = [];
      filter.push([['Payment From Date', this.formdate]]);
      filter.push([['Payment To Date', this.todate]]);
      TableUtil.exportListToExcelWithFilter(this.list, "Remark By Fo List", this.heading1, filter);
    }
  }

  report: any = [];
  sno: any = {
    slNo: "",
    floatNo: "",
    urn: "",
    claimNo: "",
    ptnt: "",
    amount: "",
    remarks: "",
  };
  heading = [['Sl No.', 'Float Number', 'URN', 'Claim No.', 'Patient Name', 'Amount (₹)', 'FO Remarks']];

  downloadReport() {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.paymentDetails.length; i++) {
      item = this.paymentDetails[i];
      this.sno = [];
      this.sno.slNo = i + 1;
      this.sno.floatNo = item.floatNo;
      this.sno.urn = item.urn;
      this.sno.claimNo = item.claimNo;
      this.sno.ptnt = item.patientname;
      if (item.totalamountclaimed) {
        this.sno.amount = this.formatter.format(item.totalamountclaimed);
      } else {
        this.sno.amount = this.formatter.format(0);
      }
      this.sno.remarks = item.foRemarks != null ? item.foRemarks : "-NA-";
      this.report.push(this.sno);

    }
    let filter = [];
    filter.push([['Payment From Date', this.formdate]]);
    filter.push([['Payment To Date', this.todate]]);
    TableUtil.exportListToExcelWithFilter(this.report, this.header + " Details", this.heading, filter);
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  reports: any = [];
  snos: any = {
    slNo: "",
    floatNo: "",
    urn: "",
    claimNo: "",
    invoicenumber: "",
    patientname: "",
    actualdateofadmission: "",
    actualdateofdischarge: "",
    claimamount: "",
    cpdapprovedamount: "",
    snaapprovedamount: "",
    foremarks: "",
  };
  headings = [['Sl No.', 'Float Number', 'URN', 'Claim No.', 'Invoice Number', 'Patient Name', 'Actual Date of Admission', 'Actual Date of Discharge', 'Claim Amount', 'CPD Approved Amount', 'SNA Approved Amount', 'FO Remarks']];
  downloadexcel(type: any) {
    this.reports = [];
    if (type == 'excel') {
      let item: any;
      for (var i = 0; i < this.detailsData.length; i++) {
        item = this.detailsData[i];
        this.snos = [];
        this.snos.slNo = i + 1;
        this.snos.floatNo = item.floatNo;
        this.snos.urn = item.urn;
        this.snos.claimNo = item.claimNo;
        this.snos.invoicenumber = item.invoiceNo;
        this.snos.patientname = item.patientname;
        this.snos.actualdateofadmission = this.datepipe.transform(item.actualDateOfAdmission, 'dd-MMM-yyyy');
        this.snos.actualdateofdischarge = this.datepipe.transform(item.actualDateOfDischarge, 'dd-MMM-yyyy');
        if (item.totalAmountClaimed) {
          this.snos.claimamount = this.formatter.format(item.totalAmountClaimed);
        } else {
          this.snos.claimamount = this.formatter.format(0);
        }
        if (item.cpdApprovedAmount) {
          this.snos.cpdapprovedamount = this.formatter.format(item.cpdApprovedAmount);
        } else {
          this.snos.cpdapprovedamount = this.formatter.format(0);
        }
        if (item.snaApprovedAmount) {
          this.snos.snaapprovedamount = this.formatter.format(item.snaApprovedAmount);
        }
        else {
          this.snos.snaapprovedamount = this.formatter.format(0);
        }
        this.snos.foremarks = item.foRemarks != null ? item.foRemarks : "-NA-";
        this.reports.push(this.snos);
      }
      let filter = [];
      filter.push([['Payment From Date', this.formdate]]);
      filter.push([['Payment To Date', this.todate]]);
      TableUtil.exportListToExcelWithFilter(this.reports, this.header + " Details", this.headings, filter);
    } else if (type == 'pdf') {
      if (this.detailsData.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      let SlNo = 1;
      this.detailsData.forEach(element => {
        let rowDatavalue = [];
        rowDatavalue.push(SlNo++);
        rowDatavalue.push(element.floatNo);
        rowDatavalue.push(element.urn);
        rowDatavalue.push(element.claimNo);
        rowDatavalue.push(element.invoiceNo);
        rowDatavalue.push(element.patientname);
        rowDatavalue.push(this.datepipe.transform(element.actualDateOfAdmission, 'dd-MMM-yyyy'));
        rowDatavalue.push(this.datepipe.transform(element.actualDateOfDischarge, 'dd-MMM-yyyy'));
        if (element.totalAmountClaimed) {
          rowDatavalue.push((element.totalAmountClaimed));
        } else {
          rowDatavalue.push((0));
        }
        if (element.cpdApprovedAmount) {
          rowDatavalue.push((element.cpdApprovedAmount));
        } else {
          rowDatavalue.push((0));
        }
        if (element.snaApprovedAmount) {
          rowDatavalue.push((element.snaApprovedAmount));
        }
        else {
          rowDatavalue.push((0));
        }
        rowDatavalue.push(element.foRemarks != null ? element.foRemarks : "-NA-");
        this.report = [];
        this.report.push(rowDatavalue);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Authority Name :-' + this.user.fullName, 5, 5);
      doc.text('Document Generate Date : ' + generatedOn, 5, 10);
      doc.text('Payment Freeze Details', 100, 25);
      doc.setLineWidth(0.7);
      doc.line(100, 26, 138, 26);
      autoTable(doc, {
        head: this.headings, body: this.report, startY: 28, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 40 },
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
        }
      })
      doc.save('Payment Freeze Details".pdf');
    }
  }
  details(item: any) {
    this.headervalue = item.float_no;
    this.getdataonforemarks(this.headervalue);
  }
  getdataonforemarks(float_no: any) {
    this.paymentService.getforemarksdetails(float_no).subscribe((response) => {
      this.foremarkdetails = response;
    });
  }

  forward(header: any) {
  }

  downloalpdf() {
    this.report = [];
    if (this.status == 'P') {
      if (this.paymentList.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      let SlNo = 1;
      this.paymentList.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.floatNo);
        rowData.push(this.datepipe.transform(element.createdOn, 'dd-MMM-yyyy hh:mm:ss a'));
        rowData.push(element.remark);
        rowData.push(element.count);
        rowData.push(element.amount);
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Generate By : ' + this.user.fullName, 5, 5);
      doc.text('Document Generate Date : ' + generatedOn, 5, 10);
      doc.text('Float Generation Date From :-' + this.formdate, 5, 15);
      doc.text('Float Generation Date To:-' + this.todate, 5, 20);
      doc.text(this.feildname, 100, 25);
      doc.setLineWidth(0.7);
      autoTable(doc, {
        head: this.heading1, body: this.report, startY: 28, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 50 },
          2: { cellWidth: 40 },
          3: { cellWidth: 40 },
        }
      })
      doc.save(this.feildname + ".pdf");
    }
    else if (this.status == 'R') {
      this.report = [];
      if (this.foremarks.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      let SlNo = 1;
      this.foremarks.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.floatNo);
        rowData.push(this.datepipe.transform(element.created_on, 'dd-MMM-yyyy hh:mm:ss a'));
        rowData.push(element.amount);
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Generated Float From :-' + this.formdate, 5, 5);
      doc.text('Generated Float To:-' + this.todate, 5, 10);
      doc.text('Generated By :-' + this.user.fullName, 5, 15);
      doc.text('Document Generate Date : ' + generatedOn, 5, 20);
      doc.text('Remark By Fo', 100, 25);
      doc.setLineWidth(0.7);
      autoTable(doc, {
        head: this.heading1, body: this.report, startY: 28, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 50 },
          2: { cellWidth: 40 },
          3: { cellWidth: 40 },
        }
      })
      doc.save('Remark_By_Fo_List.pdf');
    }

  }
  viewDescription(claimid: any) {
    this.paymentService.modalvalue(claimid).subscribe((alldata) => {
      this.modaldata = alldata;
      $('#modaldatabindnng').show();
    });
  }
  responseData: any;
  getSNOList() {
    let userid = this.user.userId;
    this.snoConfigService.getSNOListByExecutive(userid).subscribe(
      (response) => {
        this.responseData = response;
        if (this.responseData.status == "success") {
          this.snoList = JSON.parse(this.responseData.data);
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => console.log(error)
    )
  }
  clearEvent() {
    this.snoUserId = '';
  }
  selectEvent(item) {
    this.snoUserId = item.snaUserId;
  }
  onresetrecordReverted() {
    this.paymentList = [];
    this.foremarks = [];
    $('input[name="fromDate"]').val(this.frstDay);
    $('input[name="toDate"]').val(this.secondDay);
  }

  getClarifyFromCEO() {
    this.feildname = 'Observation From CEO';
    this.forwardPending = 13;
    this.isActive1 = false;
    this.isActive2 = false;
    this.isActive3 = true;
    this.isActive4 = false;
    localStorage.removeItem('revertdata');
    let userId = this.snoUserId;
    this.status = 'P';
    this.isVerifyCEO = false;
    this.isClarifyCEO = true;
    this.isVerifyJoinCEO = false;
    this.isClarifyJointCEO = false;
    this.formdate = $('#datepicker1').val();
    this.todate = $('#datepicker2').val();
    $('#value1').hide();
    $('#value2').hide();
    $('#value3').show();
    if (Date.parse(this.formdate) > Date.parse(this.todate)) {
      this.swal('', 'Float Generation Date From should be Less Than Float Generation Date To', 'error');
      return;
    }
    if (userId == undefined || userId == null || userId == '') {
      this.swal('', 'Please Select SNA Doctor', 'info');
      return;
    }
    this.paymentList = [];
    let pendingAt = 12;
    this.paymentService.getPaymentFrzDtlsList(userId, this.formdate, this.todate, pendingAt).subscribe((alldata) => {
      this.paymentList = alldata;
      this.record = this.paymentList.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    });
  }
  verifyFromDyCEO() {
    this.feildname = 'Verified From Joint CEO'
    this.forwardPending = 11;
    this.isActive1 = false;
    this.isActive2 = false;
    this.isActive3 = false;
    this.isActive4 = true;
    localStorage.removeItem('revertdata');
    let userId = this.snoUserId;
    this.status = 'P';
    this.isVerifyCEO = false;
    this.isClarifyCEO = false;
    this.isVerifyJoinCEO = true;
    this.isClarifyJointCEO = false;
    this.formdate = $('#datepicker1').val();
    this.todate = $('#datepicker2').val();
    $('#value1').hide();
    $('#value3').show();
    $('#value2').hide();
    if (Date.parse(this.formdate) > Date.parse(this.todate)) {
      this.swal('', 'Float Generation Date From should be Less Than Float Generation Date To', 'error');
      return;
    }
    if (userId == undefined || userId == null || userId == '') {
      this.swal('', 'Please Select SNA Doctor', 'info');
      return;
    }
    this.paymentList = [];
    let pendingAt = 10;
    this.paymentService.getPaymentFrzDtlsList(userId, this.formdate, this.todate, pendingAt).subscribe((alldata) => {
      this.paymentList = alldata;
      this.record = this.paymentList.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    });
  }
  floatHistoryList: any = [];
  floatNum: any;
  resData: any;
  floatCreatedBy: any;
  floatAmount: any;
  createdOn: any;
  viewHistory(floatData) {
    let floatId = floatData.floatId;
    $('#historyModal').show();
    this.paymentService.getFloatLogList(floatId).subscribe(
      (data) => {
        this.resData = data;
        if (this.resData.status == 'success') {
          this.floatHistoryList = this.resData.data;
          this.floatNum = this.floatHistoryList[0].floateno;
          this.floatCreatedBy = this.floatHistoryList[0].createby.fullname;
          this.floatAmount = this.floatHistoryList.at(-1).amount;
          this.createdOn = this.floatHistoryList[0].createon;
        } else if (this.resData.status == 'failed') {
          this.swal('', this.resData.msg, 'error');
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  cancel() {
    $('#historyModal').hide();
  }
  floatDocDownload(event, data) {
    let target = event.target;
    if (
      target.nodeName == 'A' ||
      target.nodeName == 'a' ||
      target.nodeName == 'IMG' ||
      target.nodeName == 'img' ||
      target.nodeName == 'I' ||
      target.nodeName == 'i' ||
      target.nodeName == 'SPAN' ||
      target.nodeName == 'span'
    ) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (data.floatDoc != null) {
        let img = this.paymentService.downloadFloatFiles(data);
        window.open(img, '_blank');
      }
    }
  }
}
