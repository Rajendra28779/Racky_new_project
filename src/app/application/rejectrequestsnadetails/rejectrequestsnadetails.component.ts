import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { RejectRequestService } from '../Services/reject-request.service';
declare let $: any;

@Component({
  selector: 'app-rejectrequestsnadetails',
  templateUrl: './rejectrequestsnadetails.component.html',
  styleUrls: ['./rejectrequestsnadetails.component.scss']
})
export class RejectrequestsnadetailsComponent implements OnInit {
  data: any;
  txnId: any;
  urnNo: any;
  packageCode: any;
  claimLog: Array<any> = [];
  claimDetails: any;
  check: boolean = false;
  preAuth: any;
  multiPackList: any = [];
  multiFlag: boolean = false;
  childmessage: any;
  claimBy: any;
  dateOfAdm: any;
  hospitalCode: any;
  constructor(private jwtService: JwtService, public rejectedrequest: RejectRequestService, public headerService: HeaderService, public route: Router) { }

  ngOnInit(): void {
    this.headerService.setTitle('System Rejected Request Approval');
    this.data = JSON.parse(localStorage.getItem("RejectedData"));
    this.txnId = this.data.transactionId;
    this.urnNo = this.data.URN;
    this.packageCode = this.data.packageCode;
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    $("#appealDisposal").hide();
    this.getSnoDetailsById();
    this.getDateSelect();
  }
  getDateSelect() {
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
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

  }
  getSnoDetailsById() {
    this.rejectedrequest.getDetailsById(this.txnId).subscribe((data: any) => {
      let resData = data;
      if (resData.status == "success") {
        let details = JSON.parse(resData.details);
        this.claimDetails = details.actionData;
        this.claimLog = details.actionLog;
        this.claimBy = this.convertDateFormat(this.claimDetails.CLAIMRAISEDBY);
        this.dateOfAdm = this.claimDetails.DATEOFADMISSION;
        this.hospitalCode = this.claimDetails.HOSPITALCODE;
        this.preAuth = details.preAuthHist;
        if (this.preAuth.length != 0) {
          this.check = true;
        }
      } else {
        this.swal('', 'Something went wrong.', 'error');
      }
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  dtls: any;
  viewDescription(descriptinDtls) {
    this.dtls = descriptinDtls;
    $("#appealDisposal").show();
  }
  modalClose() {
    $("#appealDisposal").hide();
  }
  remarks: any
  myGroup = new FormGroup({
    remarks: new FormControl()
  });
  maxChars = 500;
  preAuthLogDetail(urn: any, authCode: any, hosCode: any) {
    let authCodes = authCode;
    localStorage.setItem("urn", urn);
    localStorage.setItem("authorizedCode", authCodes);
    localStorage.setItem("hospitalCode", hosCode);
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/preauthhistory'); });
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  convertDateFormat(raisedBy: any) {
    let year = raisedBy.substring(0, 4);
    let month: any = Number(raisedBy.substring(5, 7));
    let day = raisedBy.substring(8, 10);
    if (month == 1) {
      month = 'Jan';
    } else if (month == 2) {
      month = 'Feb';
    } else if (month == 3) {
      month = 'Mar';
    } else if (month == 4) {
      month = 'Apr';
    } else if (month == 5) {
      month = 'May';
    } else if (month == 6) {
      month = 'Jun';
    } else if (month == 7) {
      month = 'Jul';
    } else if (month == 8) {
      month = 'Aug';
    } else if (month == 9) {
      month = 'Sep';
    } else if (month == 10) {
      month = 'Oct';
    } else if (month == 11) {
      month = 'Nov';
    } else if (month == 12) {
      month = 'Dec';
    }
    var frstDay = day + "-" + month + "-" + year;
    return frstDay;
  }
  claimStatus: any;
  snaRemark: any;
  claimRaisedBy: any;
  sysRejStatus: any
  TakeAction(event: any, rejId: any, transId: any) {
    this.snaRemark = $('#remarks').val();
    this.claimRaisedBy = $('#datepicker2').val();
    let ApproveDoc = this.selectedFile;
    if (event.target.id == 'Approve') {
      this.claimStatus = 1;
      this.sysRejStatus = 0;
    } if (event.target.id == 'Reject') {
      this.claimStatus = 2;
      this.sysRejStatus = 0;
      this.claimRaisedBy = this.convertDateFormat(this.claimDetails.CLAIMRAISEDBY);
    }

    if (event.target.id == 'Approve') {
      if (ApproveDoc == undefined) {
        this.swal('Warning', 'Please Provide Approve Document Slip ', 'warning');
        return;
      }
    }
    let fromDate = Date.parse(this.claimRaisedBy);
    let today = Date.parse(this.claimDetails.CLAIMRAISEDBY);
    let today1 = Date.parse(new Date().toLocaleString());
    if (this.claimRaisedBy == null || this.claimRaisedBy == '') {
      this.swal('', ' Date should not be blank', 'error');
      return;
    }
    if (fromDate < today) {
      this.swal('', ' Claim Raised By should be greater than Last Claim Raised By', 'error');
      return;
    }
    if (event.target.id == 'Approve') {
      if (fromDate < today1) {
        this.swal('', ' Claim Raised By should be greater than Today', 'error');
        return;
      }
    }
    if (this.snaRemark == '' || this.snaRemark == null) {
      this.swal('', 'Remark should not be left blank', 'error');
      return;
    }
    // if (this.snaRemark != '' && this.snaRemark != null) {
    //   let pattern = /^[a-z A-Z0-9&?,._-]+$/;
    //   if (!pattern.test(this.snaRemark)) {
    //     this.swal('', ' Special character is not allowed', 'error');
    //     return;
    //   }
    // }
    // let data = {
    //   'rejectionId': rejId,
    //   'claimBy': this.claimRaisedBy,
    //   'transactionDetailsId': transId,
    //   'statusflag': this.claimStatus,
    //   'snaRemark': this.snaRemark,
    //   'sysRejStatus': this.sysRejStatus,
    //   'ApproveDoc':ApproveDoc
    // }
    Swal.fire({
      title: '',
      text: "Are you sure To " + event.target.id + "?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        const Data = new FormData();
        Data.append('rejectionId', rejId);
        Data.append('claimBy', this.claimRaisedBy);
        Data.append('transactionDetailsId', transId);
        Data.append('statusflag', this.claimStatus);
        Data.append('snaRemark', this.snaRemark);
        Data.append('sysRejStatus', this.sysRejStatus);
        Data.append('ApproveDoc', this.selectedFile);
        Data.append('hospitalCode', this.hospitalCode);
        Data.append('dateOfAdm', this.dateOfAdm);
        Data.append('urn', this.urnNo);
        this.rejectedrequest.saveRejectAction(Data)
          .subscribe((data: any) => {
            if (data.status == "Success") {
              if (event.target.id == 'Approve') {
                this.swal("Success", data.message, "success");
              } else if (event.target.id == 'Reject') {
                this.swal("Success", data.message, "success");
              }
              this.route.navigate(['/application/SystemRejectedClaimRequest']);
            }
            else if (data.status == "Failed") {
              this.swal("Error", data.message, "error");
            }
          },
            (error) => {
              console.log(error);
              this.swal('', 'Something went wrong.', 'error');
            })
      }
    })
  }
  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  AdditionalDocuments: any;
  selectedFile: any;
  documentType: any;
  shortLink: string = '';
  lengthforfile: any;
  AdditionalDocument(files: any) {
    this.AdditionalDocuments = files.target.files;
    $("#rejected").css("border-color", "green");
    for (var i = 0; i < this.AdditionalDocuments.length; i++) {
      var filename = files.target.files[0];
      var extension = filename.name.split('.').pop();
    }
    var allowedExtensions = /(\jpg|\jpeg|pdf)$/i;
    if (!allowedExtensions.exec(extension)) {
      this.swal('Warning', 'DOCX, DOC, EXE is Not allowed', 'warning');
      $("#rejected").css("border-color", "red");
      this.shortLink = "Select a file to upload";
      $('#ADD').val('');
      this.selectedFile = null;
      return;
    } else
      this.selectedFile = files.target.files[0];
    $("#rejected").css("border-color", "green");
    this.lengthforfile = files.target.files.length;
    this.shortLink = this.selectedFile.name;
    if (Math.round(this.selectedFile.size / 1024) >= 3100) {
      this.swal('Warning', 'Please provide  Approval Document with Limited Size', 'warning');
      $("#rejected").css("border-color", "red");
      this.shortLink = "Select a file to upload";
      $('#ADD').val('');
      this.selectedFile = undefined;
      return;
    }
  }
  downloadfilehospitallbill() {
    if (this.selectedFile) {
      const file: File | null = this.selectedFile;
      if (file) {
        this.documentType = file.type;
        const blob = new Blob([file], { type: this.documentType });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    } else {
      this.swal('Warning', 'please select file', 'warning');
    }
  }
}
