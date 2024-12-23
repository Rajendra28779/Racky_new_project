import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/application/header.service';
import { FreshCaseAllocationService } from 'src/app/application/Services/freshcaseallocation.service';
import { PackageDetailsMasterService } from 'src/app/application/Services/package-details-master.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
declare let $: any;
@Component({
  selector: 'app-cpd-case-reconsider',
  templateUrl: './cpd-case-reconsider.component.html',
  styleUrls: ['./cpd-case-reconsider.component.scss'],
})
export class CpdCaseReconsiderComponent implements OnInit {
  constructor(
    private encryptionService: EncryptionService,
    public allocateService: FreshCaseAllocationService,
    public headerService: HeaderService,
    private sessionService: SessionStorageService,
    public packageDetailsMasterService: PackageDetailsMasterService,
    public route: Router
  ) {}
  months: any;
  months2: any;
  year: any;
  secoundDay: any;
  frstDay: any;
  user: any;
  showPegi: boolean;

  ngOnInit(): void {
    this.headerService.setTitle('Case Draft Application');
    this.user = this.sessionService.decryptSessionData('user');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
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
    // sessionStorage.removeItem('searchFilterParameters');
    // let date = new Date();
    // let year = date.getFullYear();
    // let date1 = '01';
    // let month: any = date.getMonth() - 2;
    // if (month == -1) {
    //   this.months = 'Dec';
    //   this.year = year - 1;
    // } else if (month == -2) {
    //   this.months = 'Nov';
    //   this.year = year - 1;
    // } else {
    //   this.months = this.getMonthFrom(month);
    //   this.year = year;
    // }
    // let date2 = date.getDate();
    // this.months2 = this.getMonthFrom(date.getMonth());
    // this.frstDay = date1 + '-' + 'Jan' + '-' + 2018;
    // this.secoundDay = date2 + '-' + this.months2 + '-' + year;
    // $('input[name="fromDate"]').attr('placeholder', 'From Date *');
    // $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.currentPage = 1;
    this.pageElement = 10;
    this.getSchemeData();
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
  responseData: any;
  caseList: any = [];
  txtsearchDate: any;
  currentPage: any;
  pageElement: any;
  record: any;
  getCaseList() {
    let userId = this.user.userId;
    this.caseList = [];
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    let requestData = {
      userId: userId,
      schemeid:schemeid,
      schemecategoryid:schemecategoryid
    };
    this.allocateService.getCPDDraftCase(requestData).subscribe(
      (response) => {
        this.responseData = response;
        console.log(this.responseData);
        if (this.responseData.status == 'success') {
          this.caseList = this.responseData.data;
          this.record = this.caseList.length;
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
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }
  ResetField() {
    window.location.reload();
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
  scheme: any = [];
  schemeidvalue: any
  schemeName: any
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
          this.getCaseList();
          this.getSchemeDetails();
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
        console.log(this.scheme);
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
  onAction(id: any, urn: any, caseNo: any) {
    let state = {
      caseId: id,
      urn: urn,
      caseNo: caseNo,
    };
    localStorage.setItem('actionData', JSON.stringify(state));
    this.route.navigate(['/application/cpdcasereconsideraction']);
  }
}
