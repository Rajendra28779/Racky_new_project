import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { RejectRequestService } from '../../Services/reject-request.service';
declare let $: any;

@Component({
  selector: 'app-snanoncompliancequeryrequestdetails',
  templateUrl: './snanoncompliancequeryrequestdetails.component.html',
  styleUrls: ['./snanoncompliancequeryrequestdetails.component.scss']
})
export class SnanoncompliancequeryrequestdetailsComponent implements OnInit {
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
  actionCode: any;
  dateOfAdm: any;
  hospitalCode: any;
  constructor(private jwtService: JwtService, public rejectedrequest: RejectRequestService, public headerService: HeaderService, public route: Router) { }

  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem("noncompliancequeryData"));
    this.txnId = this.data.transactionId;
    this.urnNo = this.data.URN;
    this.actionCode = Number(this.data.actionType);
    console.log(this.data)
    this.packageCode = this.data.packageCode;
    // if (this.actionCode === 3) {
    //   this.headerService.setTitle('Non-Compliance Query CPD Request Approval');
    // }
    // if (this.actionCode === 4) {
      this.headerService.setTitle('SNA Non-Compliance Query Request Approval');
    // }
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
      // endDate: '0d',
      //minDate: new Date(),
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
    console.log(this.txnId);
    this.rejectedrequest.getNonComplianceDetailsById(this.txnId).subscribe((data: any) => {
      let resData = data;
      //console.log(data);
      if (resData.status == "success") {
        let details = JSON.parse(resData.details);
        this.claimDetails = details.actionData;
        this.claimLog = details.actionLog;
        this.claimBy = this.convertDateFormat(this.claimDetails.CLAIMRAISEDBY);
        console.log(details.preAuthHist);
        console.log(details.actionData);
        console.log(details.actionLog);
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
    // alert(raisedBy)
    let year = raisedBy.substring(0, 4);
    let month: any = Number(raisedBy.substring(5, 7));
    let day = raisedBy.substring(8, 10);
    // alert(year)
    // alert(month)
    // alert(day)
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
    //alert(frstDay)
    return frstDay;
  }
  claimStatus: any;
  snaRemark: any;
  claimRaisedBy: any;
  sysRejStatus: any
  TakeAction(event: any, rejId: any, transId: any) {
    this.snaRemark = $('#remarks').val();
    this.claimRaisedBy = $('#datepicker').val();
    let fromDate = Date.parse(this.claimRaisedBy);
    let today = Date.parse(this.convertDateFormat(this.claimDetails.CLAIMRAISEDBY));
    this.dateOfAdm=this.claimDetails.DATEOFADMISSION;
    this.hospitalCode=this.claimDetails.HOSPITALCODE;
    //alert(this.claimDetails.CLAIMRAISEDBY)
    let today1 = Date.parse(new Date().toLocaleString());
    if (this.claimRaisedBy == null || this.claimRaisedBy == '') {
      this.swal('', ' Date should not be blank', 'error');
      return;
    }
    if (fromDate < today) {
      this.swal('', ' Re Claim Raise Extend upto should be greater than Last Query Date', 'error');
      return;
    }
    if (event.target.id == 'Approve') {
      if (fromDate < today1) {
        this.swal('', ' Re Claim Raise Extend upto should be greater than Today', 'error');
        return;
      }
    }


    if (event.target.id == 'Approve') {
      this.claimStatus = 1;
      this.sysRejStatus = 0;
    } if (event.target.id == 'Reject') {
      this.claimStatus = 2;
      this.sysRejStatus = 0;
      this.claimRaisedBy = this.convertDateFormat(this.claimDetails.CLAIMRAISEDBY);
    }
    // alert(this.claimRaisedBy);
    // alert(this.snaRemark)
    // alert(this.claimStatus)
    // alert(rejId)
    // alert(transId)
    // alert(this.actionRemarkId)
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
    //   'sysRejStatus': this.sysRejStatus
    // }
    //console.log(data);
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
        Data.append('snaRemark',this.snaRemark);
        Data.append('sysRejStatus',this.sysRejStatus);
        Data.append('ApproveDoc', this.selectedFile);
        Data.append('hospitalCode', this.hospitalCode);
        Data.append('dateOfAdm', this.dateOfAdm);
        Data.append('urn', this.urnNo);
        this.rejectedrequest.saveNonComplianceAction(Data)
          .subscribe((data: any) => {
            if (data.status == "Success") {
              if (event.target.id == 'Approve') {
                this.swal("Success", data.message, "success");
              } else if (event.target.id == 'Reject') {
                this.swal("Success", data.message, "success");
              }
              this.route.navigate(['/application/Non-complianceQueryRequest']);
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
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  AdditionalDocuments: any;
  selectedFile: any;
  documentType: any;
  // AdditionalDocument(files: any) {
  //   this.AdditionalDocuments = files.target.files;
  //   this.selectedFile = files.target.files[0];
  //   if (Math.round(this.selectedFile.size / 1024) >= 3100) {
  //     this.swal('Warning', 'Please provide  Additional Slip1 with Limited Size', 'warning');
  //     $('#ADD').val('');
  //     this.selectedFile = undefined;
  //     return;
  //   }
  //   console.log(this.selectedFile);
  // }
  shortLink: string = '';
  lengthforfile: any;
  AdditionalDocument(files: any) {
    this.AdditionalDocuments = files.target.files;
    $("#noncompliance").css("border-color", "green");
    for (var i = 0; i < this.AdditionalDocuments.length; i++){
      var filename = files.target.files[0];
      var extension = filename.name.split('.').pop();
      console.log(extension);
    }
    var allowedExtensions =/(\jpg|\jpeg|pdf)$/i;
    if (!allowedExtensions.exec(extension)) {
      this.swal('Warning', 'DOCX, DOC, EXE is Not allowed', 'warning');
      $("#noncompliance").css("border-color", "red");
      $('#ADD').val('');
      this.shortLink = "Select a file to upload";
      this.selectedFile=null;
      return;
  }else
   this.selectedFile = files.target.files[0];
   $("#noncompliance").css("border-color", "green");
   this.lengthforfile = files.target.files.length;
   this.shortLink = this.selectedFile.name;
    if (Math.round(this.selectedFile.size / 1024) >= 3100) {
      this.swal('Warning', 'Please provide  Approval Document with Limited Size', 'warning');
      $("#noncompliance").css("border-color", "red");
      $('#ADD').val('');
      this.shortLink = "Select a file to upload";
      this.selectedFile = undefined;
      return;
    }
    console.log(this.selectedFile);
  }
  // downloadfilehospitallbill() {
  //   if (this.selectedFile) {
  //     const file: File | null = this.selectedFile;
  //     console.log(this.selectedFile);
  //     if (file) {
  //       console.log("Current File is Present");
  //       this.documentType = file.type;
  //       const blob = new Blob([file], { type: this.documentType });
  //       const url = window.URL.createObjectURL(blob);
  //       window.open(url);
  //     }
  //   } else {
  //     this.swal('Warning', 'please select file', 'warning');
  //   }
  // }
  downloadfilehospitallbill() {
    if (this.selectedFile) {
      const file: File | null = this.selectedFile;
      console.log(this.selectedFile);
      if (file) {
        console.log("Current File is Present");
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
