import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { PaymentfreezeserviceService } from '../../Services/paymentfreezeservice.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { TableUtil } from '../../util/TableUtil';
import { SnamasterserviceService } from '../../Services/snamasterservice.service';
import { CurrencyPipe, formatDate } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
declare let $: any;

@Component({
  selector: 'app-paymentfreeze',
  templateUrl: './ClaimProcessedComponent.html',
  styleUrls: ['./ClaimProcessedComponent.scss'],
})
export class ClaimProcessedComponent implements OnInit {
  statelist: any = [];
  user: any;
  stateCode: any;
  userId: any;
  distList: any = [];
  distCode: any;
  hospitalList: any = [];
  paymentlist: any = [];
  txtsearchDate: any;
  pageElement: any;
  currentPage: any;
  record: any;
  childmessage: any;
  hospitalId: any = '';
  districtId: any = '';
  stateId: any = '';
  fromDate: any;
  toDate: any;
  dataRequest: any;
  status: any = "";
  statename: any = "";
  distname: any = "";
  hospital: any = "";
  schemeidvalue: any = 1;
  schemeName: any
  constructor(
    public headerService: HeaderService,
    public paymentfreezeService: PaymentfreezeserviceService,
    public snoService: SnamasterserviceService,
    public snoServices: SnoCLaimDetailsService,
    private jwtService: JwtService,
    public route: Router,
    private sessionService: SessionStorageService,
    private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService, private LoginServ: ClaimRaiseServiceService
  ) { }
  showPegi: boolean;

  ngOnInit(): void {
    this.headerService.setTitle('Claim Processed');
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 20;
    localStorage.removeItem("consider");
    localStorage.removeItem("reconsider");
    this.getSchemeData();
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
      format: 'DD-MM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth() - 1;
    if (month == -1) {
      month = 11;
      year = year - 1;
    }

    var frstDay = date1 + '-' + this.getMonthFrom(month) + '-' + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.dataRequest = this.sessionService.decryptSessionData("claimprocessdata");
    if (
      this.dataRequest == null ||
      this.dataRequest == undefined ||
      this.dataRequest == ''
    ) { }
    else {
      let date = new Date(this.dataRequest.fromDate);
      let fromDate = this.getDate(date);
      $('input[name="fromDate"]').val(fromDate);
      let date1 = new Date(this.dataRequest.toDate);
      let toDate = this.getDate(date1);
      $('input[name="toDate"]').val(toDate);
      this.status = this.dataRequest.flag;
      this.statename = this.dataRequest.stateCode
      this.OnChangeState(this.statename);
      this.distname = this.dataRequest.distCode
      this.OnChangeDist(this.distname);
      this.hospital = this.dataRequest.hospitalCode
    }
    this.getStateList();
    this.getPaymentfreezeDetails();
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

  stateData: any = [];
  getStateList() {
    this.statelist = [];
    this.snoService.getStateList(this.user.userId).subscribe((data: any) => {
      this.stateData = data;
      for (let j = 0; j < this.stateData.length; j++) {
        if (this.stateData[j].stateCode == '21') {
          this.statelist.push(this.stateData[j]);
        }
      }
      for (let i = 0; i < this.stateData.length; i++) {
        if (this.stateData[i].stateCode != '21') {
          this.statelist.push(this.stateData[i]);
        }
      }
    });
  }

  OnChangeState(event) {
    $('#dist').val("");
    this.distCode = "";
    $('#hospital').val("");
    this.hospitalList = [];
    this.stateCode = event;
    this.snoService.getDistrictListByStateId(this.user.userId, this.stateCode).subscribe((data) => {
      this.distList = data;
    });
  }

  OnChangeDist(event) {
    $('#hospital').val("");
    this.distCode = event;
    this.snoService.getHospitalbyDistrictId(this.user.userId, this.distCode, this.stateCode).subscribe((data) => {
      this.hospitalList = data;
    });
  }

  resData: any;
  getPaymentfreezeDetails() {
    let userId = this.user.userId;
    // let flag = 'APRV';
    // if(this.dataRequest!=null || this.dataRequest !=undefined) {
    //   this.fromDate = this.dataRequest.fromDate;
    //   this.toDate = this.dataRequest.toDate;
    //   this.stateId = this.dataRequest.stateCode;
    //   this.districtId = this.dataRequest.distCode;
    //   this.hospitalId = this.dataRequest.hospitalCode;
    //   this.status=this.dataRequest.flag
    // } else {
    let flag = this.status;
    let fromDate = $('#formdate').val();
    let distCode1 = this.distname;
    let hospitalCode = this.hospital;
    let toDate = $('#todate').val();
    let stateCode1 = this.statename;
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('Error', ' From Date should be less than To Date', 'error');
      return;
    }
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.stateId = stateCode1;
    this.districtId = distCode1;
    this.hospitalId = hospitalCode;
    this.status = flag
    this.paymentlist = [];
    let requestData = {
      userId: userId,
      flag: this.status,
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
      stateCode: this.stateId,
      distCode: this.districtId,
      hospitalCode: this.hospitalId,
      schemeid: schemeid,
      schemecategoryid: schemecategoryid,
    };
    sessionStorage.removeItem('claimprocessdata');
    this.sessionService.encryptSessionData('claimprocessdata', requestData);
    this.paymentfreezeService.getpaymentlist(requestData).subscribe(
      (data) => {
        this.resData = data;
        if (this.resData.status == 'success') {
          this.paymentlist = this.resData.data;
          this.record = this.paymentlist.length;
          if (this.record > 0) {
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        } else {
          this.swal('Error', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }

  resetField() {
    sessionStorage.removeItem('claimprocessdata');
    window.location.reload();
  }
  getActionDetails(claimid, urn: any) {
    localStorage.setItem('claimid', claimid);
    let state = {
      Urn: urn
    }
    localStorage.setItem("trackingdetails", JSON.stringify(state));
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/trackingdetails');
    });
  }

  onAction(id: any, urn: any, packageCode: any, txnpackagedetailid: any) {
    let state = {
      transactionId: id,
      // flag: 'RECON',
      URN: urn,
      packageCode: packageCode,
      txnpackagedetailid: txnpackagedetailid ? txnpackagedetailid : ''
    };
    localStorage.setItem('actionData', JSON.stringify(state));
    this.route.navigate(['/application/claimprocessedaction']);
  }

  onRefund(claim) {
    let state = {
      transactionId: claim.transactionDetailsId,
      claimid: claim.claimid,
      URN: claim.urn,
      packageCode: claim.packageCode,
      blockamount: claim.totalAmountBlocked,
      snaapprvamount: claim.snaApprovedAmount,
      balanceamount: claim.amountDifference
    };
    localStorage.setItem('actionData', JSON.stringify(state));
    this.route.navigate(['/application/claimprocessed/walletrefund']);
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-IN');
    amount = formatter.transform(amount, '', '');
    return amount;
  }

  report: any = [];
  sno: any = {
    Slno: '',
    URN: '',
    ClaimNo: '',
    hospitalName: '',
    hospitalCode: '',
    actualdateofadmission: '',
    actualdateofdischarge: '',
    invoiceNo: '',
    PatientName: '',
    PackageID: '',
    packageName: '',
    ClaimRaisedOn: '',
    BlockedAmount: '',
    ApprovedAmount: '',
    AmountDiff: ''
  };

  heading = [
    [
      'Sl No',
      'URN',
      'Claim No',
      'Hospital Name',
      'Hospital Code',
      'Actual Date Of Admission',
      'Actual Date Of Discharge',
      'Invoice No',
      'Patient Name',
      'Package ID',
      'Package Name',
      'Claim Raised On',
      'Hospital Blocked Amount (₹)',
      'SNA Approved Amount (₹)',
      'Balance Amount (₹)'
    ],
  ];

  downloadReport(type) {
    this.report = [];
    let claim: any;
    if (this.paymentlist == null || this.paymentlist.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    let stateName = 'All', districtName = 'All', hospitalName = 'All';
    for (var i = 0; i < this.statelist.length; i++) {
      if (this.stateId == this.statelist[i].stateCode) {
        stateName = this.statelist[i].stateName;
      }
    }
    for (var i = 0; i < this.distList.length; i++) {
      if (this.districtId == this.distList[i].districtcode) {
        districtName = this.distList[i].districtname;
      }
    }
    for (var i = 0; i < this.hospitalList.length; i++) {
      if (this.hospitalId == this.hospitalList[i].hospitalCode) {
        hospitalName = this.hospitalList[i].hospitalName;
      }
    }
    if (type == 'xcl') {
      for (var i = 0; i < this.paymentlist.length; i++) {
        claim = this.paymentlist[i];
        this.sno = [];
        this.sno.Slno = (i + 1).toString();
        this.sno.URN = claim.urn;
        this.sno.ClaimNo = claim.claimNo;
        this.sno.hospitalName = claim.hospitalname;
        this.sno.hospitalCode = claim.hospitalcode;
        this.sno.actualdateofadmission = claim.actualDateOfAdmission;
        this.sno.actualdateofdischarge = claim.actualDateOfDischarge;
        this.sno.invoiceNo = claim.invoiceNumber;
        this.sno.PatientName = claim.patientName;
        this.sno.PackageID = claim.packageCode;
        this.sno.packageName = claim.packageName;
        this.sno.ClaimRaisedOn = claim.createdOn;
        this.sno.BlockedAmount = this.convertCurrency(claim.totalAmountBlocked);
        this.sno.ApprovedAmount = this.convertCurrency(claim.snaApprovedAmount);
        this.sno.AmountDiff = this.convertCurrency(claim.amountDifference);
        this.report.push(this.sno);
      }
      let filter = [];
      filter.push([['Scheme Name', "GJAY"]]);
      filter.push([['Scheme Category Name', this.schemecategoryName]]);
      filter.push([['Discharge Date From', this.fromDate]]);
      filter.push([['Discharge Date To', this.toDate]]);
      filter.push([['State', stateName]]);
      filter.push([['District', districtName]]);
      filter.push([['Hospital', hospitalName]]);
      TableUtil.exportListToExcelWithFilter(this.report, 'Claim Processed List', this.heading, filter);
    } else if (type == 'pdf') {
      var doc = new jsPDF('l', 'mm', [450, 260]);
      doc.text("Claim Processed List", 14, 20);
      doc.setFontSize(10);
      doc.text('Scheme Name:' + "GJAY", 14, 10);
      if (this.schemecategoryName == undefined || this.schemecategoryName == null || this.schemecategoryName == '') {
        doc.text('Scheme Category Name:' + "All", 14, 15);
      } else {
        doc.text('Scheme Category Name:' + this.schemecategoryName, 14, 15);
      }
      doc.text("Actual Date Of Discharge From: " + this.fromDate + "\t Actual Date Of Discharge To: " + this.toDate, 14, 30);
      doc.text("State: " + stateName + "\t District: " + districtName + "\t Hospital: " + hospitalName, 14, 40);
      doc.text("Generated By: " + this.user.fullName + "\tGenerated On: " + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 14, 50);
      doc.setFontSize(12);
      for (var i = 0; i < this.paymentlist.length; i++) {
        var clm = this.paymentlist[i];
        var pdf = [];
        pdf[0] = (i + 1).toString();
        pdf[1] = clm.urn;
        pdf[2] = clm.claimNo;
        pdf[3] = clm.hospitalname;
        pdf[4] = clm.hospitalcode;
        pdf[5] = clm.actualDateOfAdmission;
        pdf[6] = clm.actualDateOfDischarge;
        pdf[7] = clm.invoiceNumber;
        pdf[8] = clm.patientName;
        pdf[9] = clm.packageCode;
        pdf[10] = clm.packageName;
        pdf[11] = clm.createdOn;
        pdf[12] = this.convertCurrency(clm.totalAmountBlocked);
        pdf[13] = this.convertCurrency(clm.snaApprovedAmount);
        pdf[14] = this.convertCurrency(clm.amountDifference);
        this.report.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 60,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
          6: { cellWidth: 25 },
          7: { cellWidth: 20 },
          8: { cellWidth: 30 },
          9: { cellWidth: 30 },
          10: { cellWidth: 50 },
          11: { cellWidth: 25 },
          12: { cellWidth: 30 },
          13: { cellWidth: 30 },
          14: { cellWidth: 30 }
        }
      });
      doc.save('Bsky_Claim Processed List.pdf');
    }
  }

  // submitPayment() {
  //   this.userId = this.user.userId;
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You want to Freeze the Payment',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes!!',
  //   }).then((result) => {
  //     let fromDate = $('#formdate').val();
  //     let toDate = $('#todate').val();
  //     let distCode1 = $('#dist').val();
  //     let hospitalCode = $('#hospital').val();
  //     let stateCode1 = $('#state').val();
  //     let requestData = {
  //       userId: this.userId,
  //       fromDate: new Date(fromDate),
  //       toDate: new Date(toDate),
  //       stateCode1: stateCode1,
  //       distCode1: distCode1,
  //       hospitalCode: hospitalCode,
  //     };
  //     this.paymentfreezeService.paymentfreeze(requestData).subscribe(
  //       (data) => {
  //         this.dataa = data;
  //         this.getPaymentfreezeDetails();
  //         if (this.dataa.status == 'success') {
  //           if (this.dataa.data.status == 'Success') {
  //             this.swal('Success', this.dataa.data.message, 'success');
  //           } else if (this.dataa.data.status == 'Failed') {
  //             this.swal('Error', this.dataa.data.message, 'error');
  //           }
  //         } else {
  //           this.swal('', 'Something went wrong.', 'error');
  //         }
  //       },
  //       (error) => {
  //         console.log(error);
  //         this.swal('', 'Something went wrong.', 'error');
  //       }
  //     );
  //   });
  // }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  claimDetails: any = [];
  gethistoryclaimno(claimno: any) {
    this.claimDetails = []
    this.snoServices.getclaimnodetails(claimno).subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          let details = JSON.parse(resData.details);
          this.claimDetails = details;
        } else {
          this.swal('error', 'Something Went Wrong', 'error')
          this.claimDetails = []
        }
      }
    )
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
        //  this.InclusionofsearchingforschemePackageData();
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
      this.schemecategoryName = "All";
    }

    // if (this.schemecategoryidvalue == null || this.schemecategoryidvalue == undefined || this.schemecategoryidvalue == '') {
    //   return;
    // } else {
    //   this.InclusionofsearchingforschemePackageData();
    // }
  }
  // //for procedure for Selected Scheme Data
  // packageschemename: any = [];
  // text: any;
  // InclusionofsearchingforschemePackageData() {
  //   let schemeid = this.schemeidvalue;
  //   let schemecategoryid = this.schemecategoryidvalue;
  //   if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
  //     schemecategoryid = "";
  //   } else {
  //     schemecategoryid = schemecategoryid;
  //   }
  //   this.LoginServ.InclusionofsearchingforschemePackageData(schemeid, schemecategoryid).subscribe(data => {
  //     if (data != null || data != '') {
  //       this.packageschemename = data;
  //       this.packageHeaderItem = [];

  //       for (let i = 0; i < this.packageschemename.length; i++) {
  //         let packageheadername = this.packageschemename[i].packageheader;
  //         this.text = this.packageschemename[i].packageheader;
  //         const matches = this.text.match(/\((.*)\)/);
  //         let packageheadercode = matches ? matches[1] : '';
  //         let data = {
  //           packageheadername: packageheadername,
  //           packageheadercode: packageheadercode
  //         }
  //         this.packageHeaderItem.push(data);
  //       }
  //     } else {
  //       this.swal('', 'Something went wrong.', 'error');
  //     }

  //   });
  // }

  // packagenamescheme: any = [];
  // getPackageSchemeName(procedurecode: any) {
  //   this.auto1.clear();
  //   this.package = '';
  //   this.packageList = [];
  //   let schemeid = this.schemeidvalue;
  //   let schemecategoryid = this.schemecategoryidvalue;
  //   if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
  //     schemecategoryid = "";
  //   } else {
  //     schemecategoryid = schemecategoryid;
  //   }
  //   this.LoginServ.getPackageProcedurecodeSchemeWise(schemeid, schemecategoryid, procedurecode).subscribe(data => {
  //     if (data != null || data != '') {
  //       this.packagenamescheme = data;
  //       for (let i = 0; i < this.packagenamescheme.length; i++) {
  //         let procedureDescription = this.packagenamescheme[i].packagename;
  //         this.text = this.packagenamescheme[i].packagename;
  //         const matches = this.text.match(/\((.*)\)/);
  //         let procedureCode = matches ? matches[1] : '';
  //         let data = {
  //           procedureDescription: procedureDescription,
  //           procedureCode: procedureCode
  //         }
  //         this.packageList.push(data);
  //       }
  //       if (this.dataRequest) {
  //         this.package = this.dataRequest.packages;
  //       }
  //     } else {
  //       this.swal('', 'Something went wrong.', 'error');
  //     }
  //   });
  // }
}



