import { CurrencyPipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { PaymentfreezeserviceService } from '../../Services/paymentfreezeservice.service';
import { SnamasterserviceService } from '../../Services/snamasterservice.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
declare let $: any;

@Component({
  selector: 'app-payment-freeze-view',
  templateUrl: './payment-freeze-view.component.html',
  styleUrls: ['./payment-freeze-view.component.scss']
})
export class PaymentFreezeViewComponent implements OnInit {

  childmessage: any;
  user: any;
  txtsearchDate: any;
  txtSearch: any;
  pageElement: any;
  currentPage: any;
  record: any;
  showPegi: boolean;
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  floatList: any =[];
  claimList: any =[];
  summary: any;
  hospitalId: any;
  districtId: any;
  stateId: any;
  keyword: any = "hospitalName";
  keyword1: any = "districtname";
  keyword2: any = "stateName";
  search:any;
  @ViewChild('auto') auto;
  @ViewChild('auto1') auto1;
  @ViewChild('auto2') auto2;
  constructor(private sessionService: SessionStorageService,private pymntFrzSrvc: PaymentfreezeserviceService, public headerService: HeaderService,
    private snamasterService: SnamasterserviceService, public route: Router,
    private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService) { }

  ngOnInit(): void {
    this.getSchemeData();
    this.headerService.setTitle('Payment Freeze Reports');
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 20;

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
      format: 'YYYY-MM-DD LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();

    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth() - 1;
    if(month==-1) {
      year = year - 1;
      month = 11;
    }

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
    var frstDay = date1 + '-' + month + '-' + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');

    // $('input[name="toDate"]').val('');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.getStateList();
    this.getGeneratedReports();
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  getStateList() {
    this.snamasterService.getStateList(this.user.userId).subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    this.auto1.clear();
    this.auto.clear();
    this.districtId = '';
    this.hospitalId = '';
    this.auto.clear();
    this.hospitalList = [];
    localStorage.setItem("stateCode", id);
    this.snamasterService.getDistrictListByStateId(this.user.userId, id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeDistrict(id) {
    this.hospitalId = '';
    this.auto.clear();
    var stateCode = localStorage.getItem("stateCode");
    this.snamasterService.getHospitalbyDistrictId(this.user.userId, id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }

  selectEvent(item) {
    // do something with selected item
    this.hospitalId = item.hospitalCode;
  }

  clearEvent() {
    this.hospitalId = '';
  }

  selectEvent1(item) {
    // do something with selected item
    this.districtId = item.districtcode;
    this.OnChangeDistrict(this.districtId);
  }

  clearEvent1() {
    this.districtId = '';
    this.OnChangeDistrict(this.districtId);
  }

  selectEvent2(item) {
    // do something with selected item
    this.stateId = item.stateCode;
    this.OnChangeState(this.stateId);
  }

  clearEvent2() {
    this.stateId = '';
    this.OnChangeState(this.stateId);
  }

  pageItemChange() {
    this.pageElement = $("#pageItem").val();
  }

  getGeneratedReports() {
    this.txtsearchDate = '';
    let userId = this.user.userId;
    let fromDate = $('#formdate').val();
    let toDate = $('#todate').val();
    let stateId = this.stateId;
    let districtId = this.districtId;
    let hospitalId = this.hospitalId;
    let mortality = $('#mortality').val();
    let Search = $('#search').val();
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    if (fromDate == null || fromDate == "" || fromDate == undefined) {
      this.swal("Info", "Please Select Actual Date of Discharge From", 'info');
      return;
    }
    if (toDate == null || toDate == "" || toDate == undefined) {
      this.swal("Info", "Please Select Actual Date of Discharge To", 'info');
      return;
    }
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('Info', ' From Date should be less than To Date', 'info');
      return;
    }

    this.floatList = [];
    this.currentPage = 1;
    this.pageElement = 20;
    this.search=Search;
    let requestData = {
      userId: userId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      stateId: stateId,
      districtId: districtId,
      hospitalId: hospitalId,
      mortality: mortality,
      searchtype: Search,
      schemecategoryid:schemecategoryid
    };
    this.pymntFrzSrvc.paymentFreezeView(requestData).subscribe(
      (data) => {
        this.floatList = data;
        if (this.floatList.length>0) {
          this.record = this.floatList.length;
          if (this.record > 0) {
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        } else {
          this.swal('Info', 'No Data Found', 'info');
        }
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }

  download(filename) {
    let img = this.pymntFrzSrvc.downloadPfzFile(filename, this.user.userId);
    window.open(img, '_blank');
  }

  resetTable() {
    window.location.reload();
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  convertCurrency(amount: any){
    var formatter = new CurrencyPipe('en-IN');
    amount = formatter.transform(amount, '', '');
    return amount;
  }

  claimdetails(claim) {
    let fdate=claim.actualDateOfDischargeFrom;
    let tdate=claim.actualDateOfDischargeTo;
    let mortality=claim.cpdMortality=='All'?'':claim.cpdMortality;
    let stateId=claim.stateCode==undefined?'':claim.stateCode;
    let districtId=claim.districtCode==undefined?'':claim.districtCode;
    let hospitalId=claim.hospitalCode==undefined?'':claim.hospitalCode;

    this.claimList = [];
    this.pymntFrzSrvc.paymentFreezeDetails(fdate, tdate, stateId, districtId, hospitalId, mortality).subscribe(
      (data) => {
        this.claimList = data;
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }

  report: any = [];
  sno: any = {
    Slno: "",
    hospitalname: "",
    hospitalcode: "",
    urn: "",
    InvoiceNumber: "",
    claimno: "",
    caseno: "",
    PatientName: "",
    packagecode: "",
    packagename: "",
    packageprocedure: "",
    ActualDateOfAdmission: "",
    ActualDateOfDischarge: "",
    mortality: "",
    cmortality: "",
    hospitalclaimedamount: "",
    approvedAmount: ""
  };
  heading = [[
    'Sl No',
    'Hospital Name',
    'Hospital Code',
    'URN',
    'Invoice Number',
    'Claim Number',
    'Case Number',
    'Patient Name',
    'Package Code',
    'Package Name',
    'Package Procedure',
    'Actual Date Of Admission',
    'Actual Date Of Discharge',
    'Mortality (Hospital)',
    'Mortality (CPD)',
    'Hospital Claim Amount',
    'Approved Amount (SNA/CPD)'
  ]];

  downloadReport(type: any) {
    this.report = [];
    if (type == 'xcl') {
      let claim: any;
      for (var i = 0; i < this.claimList.length; i++) {
        claim = this.claimList[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.hospitalname = claim.hospitalname;
        this.sno.hospitalcode = claim.hospitalcode;
        this.sno.urn = claim.urn;
        this.sno.InvoiceNumber = claim.invoiceno;
        this.sno.claimno = claim.claimno;
        this.sno.caseno = claim.caseno != null ? claim.caseno : "N/A";
        this.sno.PatientName = claim.patientname;
        this.sno.packagecode = claim.packagecode;
        this.sno.packagename = claim.packagename;
        this.sno.packageprocedure = claim.procedurename;
        this.sno.ActualDateOfAdmission = claim.actualdateofadmission;
        this.sno.ActualDateOfDischarge = claim.actualdateofdischarge;
        this.sno.mortality = claim.mortality;
        this.sno.cmortality = claim.cmortality;
        this.sno.hospitalclaimedamount = claim.totalamountclaimed != null ? this.convertCurrency(claim.totalamountclaimed) : "N/A";
        this.sno.approvedAmount = claim.snoapprovedamount != null ? this.convertCurrency(claim.snoapprovedamount) : "N/A";
        this.report.push(this.sno);
      }
      let filter = [];
      TableUtil.exportListToExcelWithFilter(this.report, "Payment Freeze Claim Details", this.heading, filter);
    } else if (type == 'pdf') {
      if (this.claimList.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.claimList.forEach(claim => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(claim.hospitalname);
        rowData.push(claim.hospitalcode);
        rowData.push(claim.urn);
        rowData.push(claim.invoiceno);
        rowData.push(claim.claimno);
        rowData.push(claim.caseno != null ? claim.caseno : "N/A");
        rowData.push(claim.patientname);
        rowData.push(claim.packagecode);
        rowData.push(claim.packagename);
        rowData.push(claim.procedurename);
        rowData.push(claim.actualdateofadmission);
        rowData.push(claim.actualdateofdischarge);
        rowData.push(claim.mortality);
        rowData.push(claim.cmortality);
        rowData.push(claim.totalamountclaimed != null ? this.convertCurrency(claim.totalamountclaimed) : "N/A");
        rowData.push(claim.snoapprovedamount != null ? this.convertCurrency(claim.snoapprovedamount) : "N/A");
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [230, 520]);
      doc.setFontSize(10);
      doc.text('Generated By :-' + this.user.fullName, 5, 5);
      doc.text('Generated On : ' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 5, 10);
      doc.text('Payment Freeze Claim Details', 100, 25);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 28, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 15},
          1: { cellWidth: 30 },
          2: { cellWidth: 30},
          3: { cellWidth: 30},
          4: { cellWidth: 30 },
          5: { cellWidth: 30 },
          6: { cellWidth: 45 },
          7: { cellWidth: 40 },
          8: { cellWidth: 20 },
          9: { cellWidth: 30 },
          10: { cellWidth: 30 },
          11: { cellWidth: 30 },
          12: { cellWidth: 30 },
          13: { cellWidth: 20 },
          14: { cellWidth: 20 },
          15: { cellWidth: 30 },
          16: { cellWidth: 30 },
        }
      });
      doc.save('GJAY_Payment Freeze Claim Details.pdf');
    }
  }


  ///scheme
  scheme: any = [];
  schemeidvalue: any = 1;
  schemeName: any = ''
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
