import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { RejectRequestService } from '../Services/reject-request.service';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../Services/package-details-master.service';
import { ClaimRaiseServiceService } from '../Services/claim-raise-service.service';
declare let $: any;

@Component({
  selector: 'app-rejectrequestsna',
  templateUrl: './rejectrequestsna.component.html',
  styleUrls: ['./rejectrequestsna.component.scss']
})
export class RejectrequestsnaComponent implements OnInit {
  totalCount: any;
  rejectRequestList: any = [];
  txtsearchDate: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  user: any;
  record: any;
  months: any;
  year: number;
  schemeidvalue: any = 1;
  schemeName: any
  constructor(public headerService: HeaderService, public snoService: SnoCLaimDetailsService, public rejectedrequest: RejectRequestService, public route: Router,
    private sessionService: SessionStorageService, private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService, private LoginServ: ClaimRaiseServiceService) { }

  ngOnInit(): void {
    this.headerService.setTitle('System Rejected Request Approval');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 10;
    this.getSchemeData();
    this.getStateList();
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
    let month: any = date.getMonth();
    if (month == -1) {
      this.months = 'Dec';
      this.year = year - 1;
    } else {
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    var frstDay = date1 + '-' + this.months + '-' + this.year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.getRejectedRequestList();
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
  getDate(date) {
    let year = date.getFullYear();
    let date1 = date.getDate();
    let months = date.getMonth();
    let month = this.getMonthFrom(months);
    var frstDay = date1 + '-' + month + '-' + year;
    return frstDay;
  }
  stateData: any = [];
  statelist: Array<any> = [];
  stateCode: any;
  userId: any;
  distList: any;
  distCode: any;
  hospitalList: any;
  getStateList() {
    this.snoService.getStateList().subscribe((data: any) => {
      this.stateData = data;
      this.stateData.sort((a, b) => a.stateName.localeCompare(b.stateName));
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
    })
  }
  OnChangeState(event) {
    this.stateCode = event.target.value;
    this.userId = this.user.userId;
    this.snoService.getDistrictListByState(this.userId, this.stateCode).subscribe((data) => {
      this.distList = data;
      this.distList.sort((a, b) => a.DISTRICTNAME.localeCompare(b.DISTRICTNAME));
    })
  }
  OnChangeDist(event) {
    this.distCode = event.target.value;
    this.userId = this.user.userId;
    this.snoService.getHospitalByDist(this.userId, this.stateCode, this.distCode).subscribe((data) => {
      this.hospitalList = data;
    })
  }

  getRejectedRequestList() {
    let userId = this.user.userId;
    let fromDate = $('#datepicker9').val();
    let toDate = $('#datepicker10').val();
    let stateCode1 = $('#statecode1').val();
    let distCode1 = $('#distcode1').val();
    let hospitalCode = $('#hospitalcode').val();
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less than To Date', 'error');
      return;
    }
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    this.rejectedrequest.getRejectedClaimList(userId, fromDate, toDate, stateCode1, distCode1, hospitalCode, schemeid, schemecategoryid).subscribe(data => {
      this.rejectRequestList = data;
      this.totalCount = this.rejectRequestList.length;
      this.record = this.rejectRequestList.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  ResetField() {
    window.location.reload();
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
  onAction(id: any, urn: any, packageCode: any) {
    let state = {
      transactionId: id,
      URN: urn,
      packageCode: packageCode
    }
    localStorage.setItem("RejectedData", JSON.stringify(state));
    this.route.navigate(['/application/SystemRejectedClaimRequest/action']);
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  report: any = [];
  sno: any = {
    Slno: "",
    URN: "",
    PatientName: "",
    PackageID: "",
    RequestedOn: "",
    ClaimRaiesdBy: "",
    amount: ""
  };
  heading = [['Sl#', 'URN', 'Patient Name', 'Package ID', 'Requested On', 'Claim Raiesd By', '	Amount (₹)']];
  downloadReport() {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.rejectRequestList.length; i++) {
      claim = this.rejectRequestList[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.URN = claim.urn;
      this.sno.PatientName = claim.patientName;
      this.sno.PackageID = claim.packageCode;
      this.sno.RequestedOn = this.convertDate(claim.createdOn);
      this.sno.ClaimRaiesdBy = this.GetDate(claim.claimRaisedBy);
      this.sno.amount = this.convertCurrency(claim.currentTotalAmount);
      this.report.push(this.sno);
    }
    TableUtil.exportListToExcel(this.report, "System Rejected Request List", this.heading);
  }
  GetDate(date) {
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




