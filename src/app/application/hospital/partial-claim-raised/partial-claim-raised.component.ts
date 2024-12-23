import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EncryptionService } from 'src/app/services/encryption.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
declare let $: any;

@Component({
  selector: 'app-partial-claim-raised',
  templateUrl: './partial-claim-raised.component.html',
  styleUrls: ['./partial-claim-raised.component.scss'],
})
export class PartialClaimRaisedComponent implements OnInit {
  panelOptionState = false;
  datemodelFrom: any;
  datemodelTo: any;
  record: any;
  AddForm: FormGroup;
  currentPage: any;
  pageElement: any;
  claimlist: any = [];
  public serachdata: any = [];
  public empData: Object;
  public temp: Object = false;
  showPegi: boolean;
  user: any;
  txtsearchDate: any;
  check: boolean = false;
  packageName: any;
  packageId: any;
  datepicker4: any;
  packagenamedata: any;
  query: boolean = false;
  packgaeNAme: any;
  currentPagenNum: any;
  doc: any;
  Packagecode: any;
  packageCodedata: any;
  preauthdocs: any;
  claimdocs: any;
  schemeidvalue: any;
  schemeName: any;
  packageheadecode: any;

  constructor(
    private encryptionService: EncryptionService,
    private headerService: HeaderService,
    public packageDetailsMasterService: PackageDetailsMasterService,
    private sessionService: SessionStorageService,
    private claimRaise: ClaimRaiseServiceService
  ) {}

  ngOnInit(): void {
    this.currentPagenNum = JSON.parse(localStorage.getItem('currentPageNum'));
    this.headerService.setTitle('Partial Claim Raised');
    this.currentPage = 1;
    this.pageElement = 50;
    this.getSchemeData();
    // this.Inclusionofsearchingforpackagedetails();
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
    let month: any;
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    if (date.getMonth() == 0) {
      year = year - 1;
      month = 11;
    } else {
      month = date.getMonth() - 1;
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
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
  }
  schemecategoryidvalue: any;
  schemecategoryName: any;
  schemeList: any = [];
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
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
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
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  getRestdata() {}
  downloadReport(type) {}
  fromDate: any;
  toDate: any;
  getClaimDetails() {
    this.user = this.sessionService.decryptSessionData('user');
    let userId = this.user.userId;
    this.fromDate = $('#datepicker4').val();
    this.toDate = $('#datepicker3').val();
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
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal(
        '',
        'Actual Date of Discharge From  should be Less Than To.',
        'error'
      );
      return;
    }
    this.claimRaise
      .getPartialClaimList(userId,this.fromDate,this.toDate,schemeid,schemecategoryid).subscribe((data) => {
          if (data != null || data != '') {
            this.claimlist = data;
            console.log(this.claimlist);
            this.record = this.claimlist.length;
          } else {
            this.swal('', 'No Data Found', 'info');
          }
          if (this.record > 0) {
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        },
        (error) => {
          this.swal('', 'Something went wrong.', 'error');
        }
      );
  }
  onclaim() {}
}
