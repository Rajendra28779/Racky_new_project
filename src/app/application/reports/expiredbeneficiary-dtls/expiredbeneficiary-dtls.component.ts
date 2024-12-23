import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { ExpiredBeneficiaryRptService } from '../../Services/expired-beneficiary-rpt.service';
import { PreauthService } from '../../Services/preauth.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { UrnwiseactionReportserviceService } from '../../Services/urnwiseaction-reportservice.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HospitalService } from '../../Services/hospital.service';
import { Location } from '@angular/common'
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-expiredbeneficiary-dtls',
  templateUrl: './expiredbeneficiary-dtls.component.html',
  styleUrls: ['./expiredbeneficiary-dtls.component.scss']
})
export class ExpiredbeneficiaryDtlsComponent implements OnInit {
  childmessage: any;
  userDetails: any;
  currentPage: any;
  pageElement: any;
  user: any;
  check: boolean = false;
  claimDetails: any;
  highEndDrugList: any = [];
  implantDataList: any = [];
  wardDataList: any = [];
  dishounrList: any = [];
  noncomplianceHistory: any = [];
  trtData: any = [];
  multiFlag: boolean = false;
  claimLog: Array<any> = [];
  urnNo: any;
  transId: any;
  record: any;
  showPegi: boolean;
  v: any;
  hospitalCode: string;
  actualDateAdmission: string;
  dateOfAddmission: any;
  response: any;
  result: any;
  clmId: any;
  actionTakenHistory: any = [];
  multiplePackageBlocking: any = [];
  preAuthLog: any = [];
  treatmentHistory: any = [];
  show: boolean;
  basicinformationObj: any;
  dateAdmission: any;
  stat: any;
  dist: any;
  urn: any;
  memberId: any;
  statu: any;
  userId: any;
  fromdate: string;
  todate: string;
  dataa: any;
  timedata: any=60;
  btmdisable:boolean;
  constructor(public headerService: HeaderService, public snoService: SnoCLaimDetailsService,
    private urnwiseactionReportserviceService: UrnwiseactionReportserviceService, public preauthService: PreauthService,
    private expiredBeneficiaryRptService: ExpiredBeneficiaryRptService,
    private route: Router,  private hospitalService: HospitalService,private sessionService: SessionStorageService,
    private location: Location) { }

  ngOnInit(): void {
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId;
    this.clmId = localStorage.getItem('claimId');
    this.stat = localStorage.getItem('stat');
    this.dist = localStorage.getItem('dist');
    this.hospitalCode = localStorage.getItem('hospitalCode');
    this.urnNo = localStorage.getItem('urn');
    this.memberId = localStorage.getItem('memberId');
    this.fromdate = localStorage.getItem('formDate');
    this.todate = localStorage.getItem('toDate');
    let routepage = localStorage.getItem('routepage');
    if(routepage=="1"){
      this.btmdisable=false;
      this.getmortality();
    }else{
      this.btmdisable=true;
      this.getactionloglist();
    }
    this.headerService.setTitle('Expired Beneficiary  Details');
    this.headerService.isIndicate(true);
    this.transId = localStorage.getItem("transDetId");
    this.hospitalCode = localStorage.getItem("hospitalCode");
    this.actualDateAdmission = localStorage.getItem("actualAdmDate");
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.currentPage = 1;
    this.pageElement = 100;
    this.headerService.isBack(false);
    // this.user = JSON.parse(sessionStorage.getItem('user'));
    this.user = this.sessionService.decryptSessionData("user");
    this.urnwiseactionReportserviceService.getDetailsUrn(this.urnNo, this.transId).subscribe(
      (data: any) => {
        console.log(data);
        this.response = data;
        this.show = true;
        this.basicinformationObj = this.response.basicinformationObj
        this.actionTakenHistory = this.response.actionTakenHistory
        this.multiplePackageBlocking = this.response.multiplePackageBlocking
        this.preAuthLog = this.response.preAuthLog
        this.treatmentHistory = this.response.treatmentHistory
        this.noncomplianceHistory = this.response.noncomplianceHistory

      }, (err: any) => {
        console.log(err);
      }
    )
    this.getDishonrDetails();
    this.getWardData();
    this.getHighEndDrugs();
    this.getImplantData();
  }
  goBackToPrevPage(): void {
    this.route.navigate(['/application/makealivereport']);
  }
  getDishonrDetails() {
    let urn = $('#urn').val();
    this.urnwiseactionReportserviceService.getDishonrData(this.urnNo, this.clmId).subscribe(
      (data: any) => {
        this.dishounrList = data;
        this.record = this.dishounrList.length;
        if (this.record > 0) {
          this.showPegi = true;
        }
        else {
          this.showPegi = false;
        }
      }, (err: any) => {
        console.log(err);
      }
    )
  }
  getHighEndDrugs() {
    let urn = $('#urn').val();
    this.urnwiseactionReportserviceService.getHighEndDrug(this.urnNo, this.transId).subscribe(
      (data: any) => {
        this.response = data;
        this.highEndDrugList = data;
      }, (err: any) => {
        console.log(err);
      }
    )
  }
  getImplantData() {
    let urn = $('#urn').val();
    this.urnwiseactionReportserviceService.getImplantData(this.urnNo, this.transId).subscribe(
      (data: any) => {
        console.log(data);
        this.response = data;
        this.implantDataList = data;
      }, (err: any) => {
        console.log(err);
      }
    )
  }
  dtls: any;
  viewDescription(description) {
    this.dtls = description;
    $('#viewDescription').show();
  }
  modalClose() {
    $('#viewDescription').hide();
  }

  files: any = [];
  viewAllDocument(dischargeDoc, additDocs, additDocs1
    , additionalDocs2, preSurgery, postSurgery, patientPhoto, intSurPhoto, specimanPhoto) {
    // console.log("Inside View All Document");

    this.files = [];
    if (dischargeDoc != null || dischargeDoc != undefined) {
      let jsonObj = {
        'f': dischargeDoc,
        'h': this.basicinformationObj.hospitalCode,
        'd': this.basicinformationObj.actualDateAdm
      }
      this.files.push(jsonObj);
    }
    if (additDocs != null || additDocs != undefined) {
      let jsonObj = {
        'f': additDocs,
        'h': this.basicinformationObj.hospitalCode,
        'd': this.basicinformationObj.actualDateAdm
      }
      this.files.push(jsonObj);
    }
    if (additDocs1
      != null || additDocs1
      != undefined) {
      let jsonObj = {
        'f': additDocs1
        ,
        'h': this.basicinformationObj.hospitalCode,
        'd': this.basicinformationObj.actualDateAdm
      }
      this.files.push(jsonObj);
    }
    if (additionalDocs2 != null || additionalDocs2 != undefined) {
      let jsonObj = {
        'f': additionalDocs2,
        'h': this.basicinformationObj.hospitalCode,
        'd': this.basicinformationObj.actualDateAdm
      }
      this.files.push(jsonObj);
    }
    if (preSurgery != null || preSurgery != undefined) {
      let jsonObj = {
        'f': preSurgery,
        'h': this.basicinformationObj.hospitalCode,
        'd': this.basicinformationObj.actualDateAdm
      }
      this.files.push(jsonObj);
    }
    if (postSurgery != null || postSurgery != undefined) {
      let jsonObj = {
        'f': postSurgery,
        'h': this.basicinformationObj.hospitalCode,
        'd': this.basicinformationObj.actualDateAdm
      }
      this.files.push(jsonObj);
    }
    if (patientPhoto != null || patientPhoto != undefined) {
      let jsonObj = {
        'f': patientPhoto,
        'h': this.basicinformationObj.hospitalCode,
        'd': this.basicinformationObj.actualDateAdm
      }
      this.files.push(jsonObj);
      if (intSurPhoto != null || intSurPhoto != undefined) {
        let jsonObj = {
          'f': intSurPhoto,
          'h': this.basicinformationObj.hospitalCode,
          'd': this.basicinformationObj.actualDateAdm
        }
        this.files.push(jsonObj);
      }
    }
    if (specimanPhoto != null || specimanPhoto != undefined) {
      let jsonObj = {
        'f': specimanPhoto,
        'h': this.basicinformationObj.hospitalCode,
        'd': this.basicinformationObj.actualDateAdm
      }
      this.files.push(jsonObj);
    }
    this.snoService.downloadAllDocuments(this.files).subscribe(data => {
      var result = data;
      let blob = new Blob([result], { type: result.type });
      let url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }
  downloadAction(event: any, fileName: any, hospitalCode: any, dateAdmission: any) {

    //dateAdmission = this.actualDateAdmission;

    // dateAdmission = this.actualDateAdmission;
    // alert(fileName+hospitalCode+dateAdmission);
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
      if (fileName != null) {
        this.snoService.downloadFiles(fileName, hospitalCode, dateAdmission).subscribe(
          (response: any) => {
            var result = response;
            let blob = new Blob([result], { type: result.type });
            let url = window.URL.createObjectURL(blob);
            window.open(url);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  }

  getWardData() {
    let urn = $('#urn').val();
    this.urnwiseactionReportserviceService.getWardDetail(this.urnNo, this.transId).subscribe(
      (data: any) => {
        this.response = data;
        // console.log("Response For Ward Details.")
        console.log(this.response);
        this.wardDataList = this.response;

      }, (err: any) => {
        console.log(err);
      }
    )
  }
  findStatus(event: any) {
    this.statu = event;
    // alert(this.statu);
  }
  submit() {
    Swal.fire({
      title: 'Are you sure to make Alive?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Alive it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.expiredBeneficiaryRptService.aliveBeneficiary(this.userId, this.clmId, this.urnNo, this.memberId, this.stat, this.dist, this.fromdate, this.todate, this.hospitalCode).subscribe(
          (result) => {
            this.dataa = result;
            if (this.dataa.status == 200) {
              this.swal("Success",this. dataa.message, 'success');
            } else {
              this.swal("Error", "Something went wrong", 'error');
            }
          }
        );
      }
    })
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  sendOtp() {
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId;
    this.expiredBeneficiaryRptService.generateotp(this.userId).subscribe((data: any) => {
      console.log(data);
      this.userDetails = data;
      if (this.userDetails.status == 'success') {
        $('#OtpModal').show();
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
            // document.getElementById("countdown").innerHTML = "Finished";
            $('#sendId').hide();
            $('#reSendId').show();
            $('#timeCounter').hide();
            $('#timerdivId').hide();
            $('#mobileNoId').hide();
            $('#phoneId').hide();
          } else {
            $('#timeCounter').val(timeleft + " seconds remaining");
            $('#mobileNoId').val("OTP is sent to your " + phoneNo + " mobile number");
            // let timercuont = timeleft + " seconds remaining";
            //  $('#counter').append("<span class='badge'>"+timercuont+"</span>&nbsp;&nbsp;&nbsp;&nbsp;");
          }
          timeleft -= 1;
        }, 1000);
      } else {
        this.swal('Error', this.userDetails.message, 'error')
      }
    },
      (error) => console.log(error)
    );

  }
  otpvalidate: any;
  validateOtp() {
    let otp = $('#otpId').val();
    if (otp == '' || otp == null || otp == undefined) {
      this.swal('', 'Please Provide Otp !', 'error');
      return;
    }

    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId;
    this.expiredBeneficiaryRptService.validateotpforhosp(otp,this.userId).subscribe((data: any) => {
      this.otpvalidate = data;
      if (this.otpvalidate.status == 'success') {
        Swal.fire({
          title: "OTP validated successfully",
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            $('#OtpModal').hide();
            this.submit();
          }
        });
      } else {
        this.swal('Error', this.otpvalidate.message, 'error')
      }
    },
      (error) => console.log(error)
    );
  }
  onResendOtp() {
    this.sendOtp();
  }
  close() {
    $('#OtpModal').hide();
  }

  actionloglist:any=[];
  getactionloglist(){
    this.expiredBeneficiaryRptService.getactionloglist(this.clmId).subscribe((actionloglist:any) =>{
      this.actionloglist=actionloglist;
    });
  }

  mortalitystatus:any;
  getmortality(){
    this.expiredBeneficiaryRptService.getmortality(this.clmId).subscribe((mortalitystatus:any) =>{
      this.mortalitystatus=mortalitystatus;
    });
  }
}
