import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { DcserviceService } from '../Services/dcservice.service';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-dcaction',
  templateUrl: './dcaction.component.html',
  styleUrls: ['./dcaction.component.scss']
})
export class DcactionComponent implements OnInit {
  childmessage: any;
  claimDetails: any;
  allremarks: any;
  txnId: any;
  fileUrl: any;
  claimLog: Array<any> = [];
  pendingAt: any;
  claimStatus: any;
  user: any;
  routeFlag: any;
  urnNo: any;
  preAuth: any;
  packageCode: any;
  maxChars = 500;
  check: boolean = false;
  isQuery: boolean = false;
  isReject: boolean = false;
  isInvestigate: boolean = false;
  actionhistory: boolean = false;
  data: any;
  investigation1: any;
  Investigationfile2: any;
  selectedFile: any;
  documentType: any;
  selectedFileinvestigation2: any;
  constructor(private jwtService: JwtService, public headerService: HeaderService,
    public route: Router, public snoService: SnoCLaimDetailsService, private activatedRoute: ActivatedRoute,
    public router: Router, public dcserviceService: DcserviceService,private sessionService: SessionStorageService) {
  }

  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem("actionDatadc"));
    this.txnId = this.data.transactionId;
    this.routeFlag = this.data.flag;
    this.urnNo = this.data.URN;
    this.packageCode = this.data.packageCode;
    this.headerService.setTitle('DC Approval');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.getDcClaimById();
    this.user =  this.sessionService.decryptSessionData("user");
    $("#appealDisposal").hide();
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  multiPackList: any = [];
  multiFlag: boolean = false;
  getDcClaimById() {
    this.snoService.getDetails(this.txnId).subscribe((data: any) => {
      let resData = data;
      if (resData.status == "success") {
        let details = JSON.parse(resData.details);
        this.claimDetails = details.actionData;
        this.claimLog = details.actionLog;
        let multiPkg = details.packageBlock
        multiPkg.forEach(item => {
          if (item.transctionId != this.txnId) {
            this.multiPackList.push(item);
          }
        })
        if (this.multiPackList.length > 0) {
          this.multiFlag = true;
        }
        this.preAuth = details.preAuthHist;
        if (this.preAuth.length != 0) {
          this.check = true;
        }
        if (this.claimLog.length != 0) {
          this.actionhistory = true;
        }
      } else {
        this.swal('', 'Something went wrong.', 'error');
      }
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  treatmentdetails() {
    localStorage.setItem("urn", this.urnNo)
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/treatmenthistory'); });
  }
  preAuthLogDetail(urn: any, authCode: any, hosCode: any) {
    localStorage.setItem("urn", urn);
    localStorage.setItem("authorizedCode", authCode);
    localStorage.setItem("hospitalCode", hosCode);
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/preauthhistory'); });
  }
  downloadAction(event: any, fileName: any, hCode: any, dateOfAdm: any) {
    let target = event.target;
    if ((target.nodeName == "A" || target.nodeName == "a") || (target.nodeName == "IMG" || target.nodeName == "img") || (target.nodeName == "I" || target.nodeName == "i") || (target.nodeName == "SPAN" || target.nodeName == "span")) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (fileName != null) {
        this.snoService.downloadFiles(fileName, hCode, dateOfAdm).subscribe(
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

  dtls: any;
  viewDescription(descriptinDtls) {
    this.dtls = descriptinDtls;
    $("#appealDisposal").show();
  }
  multiPackageDetails(URN: any, authorizedcode: any, hospitalCodeOne: any, transactionDtlsID: any) {
    localStorage.setItem("urn", URN)
    localStorage.setItem("authorizedCode", authorizedcode)
    localStorage.setItem("hospitalCode", hospitalCodeOne)
    localStorage.setItem("transactionID", transactionDtlsID)
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/multipackageblock'); });
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  modalClose() {
    $("#appealDisposal").hide();
  }
  investigationlenghth: any;
  investigationvalue: string = '';
  Investigation1(files: any) {
    this.investigation1 = files.target.files;
    $("#investigation").css("border-color", "green");
    for (var i = 0; i < this.investigation1.length; i++) {
      var filename = files.target.files[0];
      var extension = filename.name.split('.').pop();
    }
    var allowedExtensions = /(\jpg|\jpeg|pdf)$/i;
    if (!allowedExtensions.exec(extension)) {
      this.swal('Warning', 'Only JPG/JPEG/PDF Are Allowed!', 'warning');
      $("#investigation").css("border-color", "red");
      $('#invested').val('');
      this.investigationvalue = "Select a file to upload";
      this.selectedFile = null;
      return;
    } else
      this.selectedFile = files.target.files[0];
    $("#investigation").css("border-color", "green");
    this.investigationlenghth = files.target.files.length;
    this.investigationvalue = this.selectedFile.name;
    if (Math.round(this.selectedFile.size / 1024) >= 8192) {
      this.swal('Warning', 'Please provide Investigation1 Slip  with Limited Size', 'warning');
      $("#investigation").css("border-color", "red");
      $('#invested').val('');
      this.investigationvalue = "Select a file to upload";
      this.selectedFile = undefined;
    }
  }

  nameoffile: string = '';
  lengthfile: any;
  Investigation2(files: any) {
    this.Investigationfile2 = files.target.files;
    $("#invest").css("border-color", "green");
    for (var i = 0; i < this.Investigationfile2.length; i++) {
      var filename = files.target.files[0];
      var extension = filename.name.split('.').pop();
    }
    var allowedExtensions = /(\jpg|\jpeg|pdf)$/i;
    if (!allowedExtensions.exec(extension)) {
      this.swal('Warning', 'Only JPG/JPEG/PDF Are Allowed!', 'warning');
      $("#invest").css("border-color", "red");
      $('#investigationforslip').val('');
      this.nameoffile = "Select a file to upload";
      this.selectedFileinvestigation2 = null;
      return;
    } else
      this.selectedFileinvestigation2 = files.target.files[0];
    $("#invest").css("border-color", "green");
    this.lengthfile = files.target.files.length;
    this.nameoffile = this.selectedFileinvestigation2.name;
    if (Math.round(this.selectedFileinvestigation2.size / 1024) >= 8192) {
      this.swal('Warning', 'Please provide Investigation2 Slip  with Limited Size', 'warning');
      $("#invest").css("border-color", "red");
      $('#investigationforslip').val('');
      this.nameoffile = "Select a file to upload";
      this.selectedFileinvestigation2 = undefined;
    }
  }
  invdownload1() {
    if (this.selectedFile) {
      const file: File | null = this.selectedFile;
      if (file) {
        this.documentType = file.type;
        const blob = new Blob([file], { type: this.documentType });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    } else {
      this.swal('', 'please select file', 'warning');
    }

  }
  invdownload2() {
    if (this.selectedFileinvestigation2) {
      const file: File | null = this.selectedFileinvestigation2;
      if (file) {
        this.documentType = file.type;
        const blob = new Blob([file], { type: this.documentType });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    } else {
      this.swal('', 'please select file', 'warning');
    }
  }
  onsubmitinvestigation() {
    this.user =  this.sessionService.decryptSessionData("user");
    this.remarks = $('#remarks').val();
    var userId = this.user.userId;
    var investigation1 = this.selectedFile;
    var investigation2 = this.selectedFileinvestigation2;
    if (investigation1 == undefined || investigation1 == null || investigation1 == "") {
      this.swal('Warning', 'Please Provide investigation  Slip1 ', 'warning');
      return;
    }
    if (this.remarks == undefined || this.remarks == null || this.remarks == "") {
      this.swal('Warning', 'Please Enter Description', 'warning');
      return;
    }
    Swal.fire({
      title: 'Are You Sure To Claim?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('txnId', this.claimDetails.transactiondetailsid != undefined ? this.claimDetails.transactiondetailsid : "");
        formData.append('hospitalCode', this.claimDetails.HOSPITALCODE != undefined ? this.claimDetails.HOSPITALCODE : "");
        formData.append('URN', this.claimDetails.URN != undefined ? this.claimDetails.URN : "");
        formData.append('claimId', this.claimDetails.CLAIMID != undefined ? this.claimDetails.CLAIMID : "");
        formData.append('claimAmount', this.claimDetails.TOTALAMOUNTBLOCKED != undefined ? this.claimDetails.TOTALAMOUNTBLOCKED : "");
        formData.append('additionalDoc', this.claimDetails.ADITIONALDOCS != undefined ? this.claimDetails.ADITIONALDOCS : "");
        formData.append('additionalDoc1', this.claimDetails.ADITIONAL_DOC1 != undefined ? this.claimDetails.ADITIONAL_DOC1 : "");
        formData.append('additionalDoc2', this.claimDetails.ADITIONAL_DOC2 != undefined ? this.claimDetails.ADITIONAL_DOC2 : "");
        formData.append('dischargeSlip', this.claimDetails.DISCHARGESLIP != undefined ? this.claimDetails.DISCHARGESLIP : "");
        formData.append('preSurgery', this.claimDetails.PRESURGERYPHOTO != undefined ? this.claimDetails.PRESURGERYPHOTO : "");
        formData.append('postSurgery', this.claimDetails.POSTSURGERYPHOTO != undefined ? this.claimDetails.POSTSURGERYPHOTO : "");
        formData.append('intraSurgery', this.claimDetails.INTRA_SURGERY_PHOTO != undefined ? this.claimDetails.INTRA_SURGERY_PHOTO : "");
        formData.append('specimenRemoval', this.claimDetails.SPECIMEN_REMOVAL_PHOTO != undefined ? this.claimDetails.SPECIMEN_REMOVAL_PHOTO : "");
        formData.append('patientPhoto', this.claimDetails.PATIENT_PHOTO != undefined ? this.claimDetails.PATIENT_PHOTO : "");
        formData.append('investigation1', investigation1);
        formData.append('investigation2', investigation2 != undefined ? investigation2 : "");
        formData.append('dateOfAdmission', this.claimDetails.DATEOFADMISSION != undefined ? this.claimDetails.DATEOFADMISSION : "");
        formData.append('remarks', this.remarks);
        this.dcserviceService.investigation(formData).subscribe((data: any) => {
          if (data.statusCode == 200 && data.status == "Success") {
            this.swal("Success", data.message, "success");
            this.router.navigate(['/application/dcapproval']);
          } else if (data.statusCode == 500 && data.status == "Failed") {
            this.swal("Error", data.message, "error");
          }
        });
      }
    });
  }
  cancelbutton() {
    Swal.fire({
      title: 'Are You Sure To Cancel?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        $('#invest').val('');
        $('#investigation').val('');
        this.swal("error", "Process is Cancelled", "error");
        this.router.navigate(['/application/dcapproval']);
      }
    })
  }
  remarks: any;
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });
  keyPress(event: KeyboardEvent) {
    const pattern = /'/;
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
