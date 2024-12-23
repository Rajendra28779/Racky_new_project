import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'ng2-charts';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { HealthDeptDtlAdauthServiceService } from '../../Services/health-dept-dtl-adauth-service.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';

@Component({
  selector: 'app-chechbeneficiary',
  templateUrl: './chechbeneficiary.component.html',
  styleUrls: ['./chechbeneficiary.component.scss'],
})
export class ChechbeneficiaryComponent implements OnInit {
  showmodal: any = true;
  showotpmodal: any = false;
  showmainpage: any = false;
  userDetails: any;
  timedata: any;
  user: any;
  userName: any;
  userlist: any = [];
  accessuserid: any;
  otpvalidate: any;
  urn: any;
  search: any;
  response: any;
  cardbalance: any = [];
  family: any = [];
  benific: any = [];
  show: any = false;

  constructor(
    public headerService: HeaderService,
    public Service: HealthDeptDtlAdauthServiceService,
    private sessionService: SessionStorageService,
    private encryptionService: EncryptionService,
    public packageDetailsMasterService: PackageDetailsMasterService
  ) {}

  ngOnInit(): void {
    this.timedata = 60;
    this.headerService.setTitle('Check Beneficiary');
    this.user = this.sessionService.decryptSessionData('user');
    this.Service.getaccessuserlist().subscribe((data: any) => {
      this.userlist = data;
    });
    this.getSchemeData();
    this.getSchemeDetails();
  }

  Login() {
    this.accessuserid = $('#search').val();
    if (
      this.accessuserid == '' ||
      this.accessuserid == null ||
      this.accessuserid == undefined
    ) {
      this.swal('', 'Please Select Name .', 'error');
      return;
    }
    this.generateotp(this.accessuserid);
  }

  generateotp(id: any) {
    this.Service.generateotp(id).subscribe(
      (data: any) => {
        console.log(data);
        this.userDetails = data;
        if (this.userDetails.status == 'success') {
          $('#exampleOtpModal').show();
          this.showmodal = false;
          $('#sendId').show();
          $('#reSendId').hide();
          $('#timeCounter').show();
          $('#timerdivId').show();
          $('#mobileNoId').show();
          $('#phoneId').show();
          let phoneNo = this.userDetails.phone;
          let timeleft = this.timedata;
          let downloadTimer = setInterval(function () {
            if (timeleft <= 0) {
              clearInterval(downloadTimer);
              $('#sendId').hide();
              $('#reSendId').show();
              $('#timeCounter').hide();
              $('#timerdivId').hide();
              $('#mobileNoId').hide();
              $('#phoneId').hide();
            } else {
              $('#timeCounter').val(timeleft + ' seconds remaining');
              $('#mobileNoId').val(
                'OTP is sent to your ' + phoneNo + ' mobile number'
              );
            }
            timeleft -= 1;
          }, 1000);
        } else {
          this.swal('Error', this.userDetails.message, 'error');
        }
      },
      (error) => console.log(error)
    );
  }

  closemodeal() {
    $('#exampleOtpModal').hide();
  }
  validateOtp() {
    let otp = $('#otpId').val();
    if (otp == '' || otp == null || otp == undefined) {
      this.swal('', 'Please Provide Otp !', 'error');
      return;
    }
    this.Service.validateotp(otp, this.accessuserid).subscribe(
      (data: any) => {
        this.otpvalidate = data;
        if (this.otpvalidate.status == 'success') {
          $('#exampleOtpModal').hide();
          this.showmainpage = true;
        } else {
          this.swal('Error', this.otpvalidate.message, 'error');
        }
      },
      (error) => console.log(error)
    );
  }
  onResendOtp() {
    this.generateotp(this.accessuserid);
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  Search() {
    this.search = $('#search').val();
    if (this.search == '' || this.search == null || this.search == undefined) {
      this.swal('', 'Please Fill Search Type !', 'error');
      return;
    }
    this.urn = $('#urn').val();
    if (this.urn == '' || this.urn == null || this.urn == undefined) {
      if (this.search == 'A') {
        this.swal('', 'Please Fill URN/Ration Card No. !', 'error');
      } else if (this.search == 'B') {
        this.swal('', 'Please Fill Aadhaar Card No.', 'error');
      } else {
        this.swal('', 'Please Fill Search Type !', 'error');
      }
      return;
    }
    this.Service.checkbeneficry(
      this.urn,
      this.search,
      this.accessuserid,
      this.schemeidvalue,
      this.schemeCategoryIdValue
    ).subscribe((data: any) => {
      console.log(data);
      this.response = data;
      this.show = true;
      this.family = this.response.family;
      this.benific = this.response.benificiary;
    });
  }
  getReset() {
    $('#urn').val('');
    $('#search').val('');
    this.show = false;
  }
  scheme: any;
  schemeidvalue: any;
  schemeName: any;
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
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }


  schemeCategoryIdValue: any
  schemecategoryName: any;
  getschemacategoryid(event: any) {
    if (event != null && event != undefined && event != '' && event != "") {
      for (let i = 0; i < this.schemeList.length; i++) {
        if (event == this.schemeList[i].schemeCategoryId)
          this.schemeCategoryIdValue = this.schemeList[i].schemeCategoryId;
        this.schemecategoryName = this.schemeList[i].categoryName;
      }
    } else {
      this.schemeCategoryIdValue = '';
      this.schemecategoryName = "All"
    }
  }
}
