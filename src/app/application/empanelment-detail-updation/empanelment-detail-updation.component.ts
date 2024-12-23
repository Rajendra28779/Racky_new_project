import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { EmpanelmentdtlupdationservService } from '../Services/empanelmentdtlupdationserv.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
@Component({
  selector: 'app-empanelment-detail-updation',
  templateUrl: './empanelment-detail-updation.component.html',
  styleUrls: ['./empanelment-detail-updation.component.scss']
})
export class EmpanelmentDetailUpdationComponent implements OnInit {

  constructor(public headerService:HeaderService,public Empanelmentserv:EmpanelmentdtlupdationservService,private route:Router,
    private encDec: EncrypyDecrpyService,
    private sessionService: SessionStorageService) { }

  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  txtsearchDate:any;
  user: any;
  hospitalData: any ;
  record: any;
  hospitalCode:any;
  url:any;
  tempurlformapply:any;
  tempurlforsummary:any;
  ngOnInit(): void {
    $('#exampleOtpModal').hide();
    this.minutes = 0;
    this.seconds = 0;
    this.headerService.setTitle('Empanelment Details Updation');
    this.user = this.sessionService.decryptSessionData("user");
    this.url=location.href
    if( this.url.includes('bskyhe.odisha.gov.in')){   //Prod
      console.log("Prod true");
      this.tempurlformapply='https://bskyhe.odisha.gov.in/#/website/formapply/';
      this.tempurlforsummary='https://bskyhe.odisha.gov.in/#/website/applicationSummary/';
    }
    if( this.url.includes('localhost')){
      console.log("true");
      this.tempurlformapply='http://localhost:4200/#/website/formapply/';
      this.tempurlforsummary='http://localhost:4200/#/website/applicationSummary/';
    }
    if( this.url.includes('192.168.10.46')){
        console.log("Testing true");
        this.tempurlformapply='http://192.168.10.46/bsky_HE_testI/#/website/formapply/';
        this.tempurlforsummary='http://192.168.10.46/bsky_HE_testI/#/website/applicationSummary/';
    } 
    if( this.url.includes('bskystg.csmpl.com')){  
      console.log("Staging true");
      this.tempurlformapply='https://bskyhepp.odisha.gov.in:8443/#/website/formapply/';
      this.tempurlforsummary='https://bskyhepp.odisha.gov.in:8443/#/website/applicationSummary/';
    }
    this.hospitalCode=this.user.userName;
    this.getHospitalListforUpdation();
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
}


  getHospitalListforUpdation() {
   // debugger;
    //this.hospitalcode=this.user.userName;
    this.Empanelmentserv.getListHospfordetailUpdation(this.hospitalCode).subscribe(
      (allData) => {
        this.hospitalData = allData[0];
        console.log(this.hospitalData);
        this.record = this.hospitalData.length;
        if(this.record > 0) {
          this.currentPage = 1;
          this.pageElement = 100;
          this.showPegi = true;
        }
        else {
          this.showPegi = false;
        }
      }
    );
  }

  edit(item:any){
    let otpValue=Math.floor(100000 + Math.random() * 900000);
    if(item.mobile==null || item.mobile=="" || item.mobile=="null" || item.mobile=="undefined"){
      this.swal("info","Please Update your Mobile number","info");
      return;
    }
    this.Empanelmentserv.checkMobileNumberDuplicate(item.mobile,item.intprofileId).subscribe(
      (data: any) => {
        console.log(data);
        if (data.status == 'Success') {
          this.swal1('info', data.message, 'info');
          return;
        } 
         
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
    let requestData={
      "hospitalName":item.hospitalName,
      "stateName":item.stateName,
      "districtName":item.districtName,
      "mobile":item.mobile,
      "intonlineserviceId":item.intonlineserviceId,
      "intprofileId":item.intprofileId,
      "hospitalId":item.hospitalId,
      "otpValue":otpValue
    }
    console.log(requestData);
    Swal.fire({
      title: '',
      text: 'Are You Sure To Proceed To Update Details For Empanelment ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(requestData);
        this.Empanelmentserv.UpdateDetails(requestData).subscribe(
          (data: any) => {
            console.log(data);
            if (data.status == 'Success') {
              let mobile=requestData.mobile;
              console.log(mobile);
              this.SendOtp(mobile);
            } else if (data.status == 'Failed') {
              this.swal('Error', data.message, 'error');
            }
          },
          (error) => {
            console.log(error);
            this.swal('', 'Something went wrong.', 'error');
          }
        );
      }
    });
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  closemodeal(){
    $('#exampleOtpModal').hide();
    this.minutes = 0;
    this.seconds = 0;
  }
  validateOtp() {
    let otpId = $('#otpId').val();
    let phone=$('#userId').val();
    if (otpId == "" || otpId == undefined || otpId == null || otpId.toString().length < 6) {
      this.swal("", "Please enter valid OTP", 'info');
      return;
    } else {
      let data = {
        "otp": otpId,
        "mobile": phone,
      }
      // console.log(data);
      this.Empanelmentserv.ValidateOtpEmp(data).subscribe((res: any) => {
        console.log(res);
        if (res.status == '200') {
          $('#exampleOtpModal').hide();
          this.minutes = 0;
          this.seconds = 0;
          let hospitalName = res.hospitalName;
          let mobileNumber = res.mobileNumber;
          let profileId = res.profileId;
          let approvalStatus = res.approvalStatus;
          let applicationstatus = res.applicationStatus;
          let applicationserviceid = res.applicationserviceid;
          let approvalserviceid = res.approvalserviceid;
          if (applicationstatus == 1) {
            let userSesnArr: any = {};
          userSesnArr["PROFILE_ID"] = profileId;
          userSesnArr["HOSPITAL_NAME"] = hospitalName;
          userSesnArr["MOBILE_NUMBER"] = mobileNumber;
          userSesnArr["SERVICEID"] = applicationserviceid;
          this.sessionService.encryptSessionData("WEB_SESSION", userSesnArr);
            let formParms = 142 + ':' + 0 + ':' + 0;
            let encSchemeStr = this.encDec.encText(formParms.toString());
            // this.router.navigate(['/website/applicationSummary', encSchemeStr]);
            window.location.href=this.tempurlforsummary+encSchemeStr;
          } else {
            let userSesnArr: any = {};
          userSesnArr["PROFILE_ID"] = profileId;
          userSesnArr["HOSPITAL_NAME"] = hospitalName;
          userSesnArr["MOBILE_NUMBER"] = mobileNumber;
          userSesnArr["SERVICEID"] = applicationserviceid;
          this.sessionService.encryptSessionData("WEB_SESSION", userSesnArr);
            let formParms = 142 + ':' + applicationserviceid + ':' + 0;
            let encSchemeStr = this.encDec.encText(formParms.toString());
            // this.router.navigate(['/website/formapply', encSchemeStr]);
            window.location.href=this.tempurlformapply+encSchemeStr;

          }

          

        }
        else if (res.status == '404') {
          Swal.fire({
            icon: 'error',
            text: "Invalid OTP",
          });
        }
        else if (res.status == '401') {
          Swal.fire({
            icon: 'error',
            text: "Maximum Limit Excide Please  Generate New OTP ",
          });
        }
        else {
          Swal.fire({
            icon: 'error',
            text: "Something Went Wrong",
          });
        }
      });
    }
  }
  onResendOtp() {
    let phone = $('#userId').val();
    if (phone == "" || phone == undefined || phone == null) {
      this.swal("Warning", "Some error occured could not resend OTP.Please try again late", 'error');
      return;
    } else {
      let data = {
        "mobile": phone,
      }
      // console.log(data);
      this.Empanelmentserv.OtpForEmpanelLogin(data).subscribe((response: any) => {
        console.log(response);
        this.userDetails = response;
          if (this.userDetails.status == "success") {
          $('#timeDivId').show();
          $('#exampleOtpModal').show();
          $('#sendId').show();
          $('#reSendId').hide();
          $('#timerdivId').show();
          $('#timeCounter').show();
          $('#mobileNoId').show();
          $('#phoneId').show();
          $('#userId').val(this.userDetails.rePhone);

          let phoneNo = this.userDetails.phone;
          this.minutes = 10;
          this.seconds = 0;
          this.timedata = setInterval(() => {
            if (this.minutes <= 0 && this.seconds <= 0) {
              clearInterval(this.timedata);
              // Hide elements
              $('#sendId').hide();
              $('#reSendId').show();
              $('#timeCounter').hide();
              $('#timerdivId').hide();
              $('#mobileNoId').hide();
              $('#phoneId').hide();
            } else {
              if (this.seconds === 0) {
                this.minutes--;
                this.seconds = 59;
              } else {
                this.seconds--;
              }
              // Update input values
              $('#timeCounter').val(this.getTime(this.minutes, this.seconds) + ' seconds remaining');
              $('#mobileNoId').val("OTP is sent to your " +phoneNo+ " mobile number");
            }
          }, 1000);

          }else{
          $('#exampleOtpModal').hide();
          this.minutes = 0;
          this.seconds = 0;
          this.swal('Warning',this.userDetails.message, 'error');
          }
      });
    }
  }
  userDetails: any;
  timedata: any;
  minutes: number;
  seconds: number;
  SendOtp(phone:any){
        let data = {
          "mobile": phone,
        }
        this.Empanelmentserv.OtpForEmpanelLogin(data).subscribe((response: any) => {
          console.log(response);
          this.userDetails = response;
            if (this.userDetails.status == "success") {
            $('#exampleOtpModal').show();
            $('#sendId').show();
            $('#reSendId').hide();
            $('#timerdivId').show();
            $('#timeCounter').show();
            $('#mobileNoId').show();
            $('#phoneId').show();
            $('#userId').val(this.userDetails.rePhone);
            // localStorage.setItem("un",this.userDetails.userName);
            let phoneNo = this.userDetails.phone;
            this.minutes = 10;
            this.seconds = 0;
            this.timedata = setInterval(() => {
              if (this.minutes <= 0 && this.seconds <= 0) {
                clearInterval(this.timedata);
                // Hide elements
                $('#sendId').hide();
                $('#reSendId').show();
                $('#timeCounter').hide();
                $('#timerdivId').hide();
                $('#mobileNoId').hide();
                $('#phoneId').hide();
              } else {
                if (this.seconds === 0) {
                  this.minutes--;
                  this.seconds = 59;
                } else {
                  this.seconds--;
                }
                // Update input values
                $('#timeCounter').val(this.getTime(this.minutes, this.seconds) + ' seconds remaining');
                $('#mobileNoId').val("OTP is sent to your " +phoneNo+ " mobile number");
              }
            }, 1000);
  
            }else{
            $('#exampleOtpModal').hide();
            this.minutes = 0;
            this.seconds = 0;
            this.swal('Warning',this.userDetails.message, 'error');
            }
        });
  }
  getTime(minutes: number, seconds: number): string {
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  swal1(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  }
}
