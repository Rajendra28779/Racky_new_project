import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimRaiseServiceService } from 'src/app/application/Services/claim-raise-service.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { JwtService } from 'src/app/services/jwt.service';
import { CreatecpdserviceService } from '../../Services/createcpdservice.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/services/shared-services/login.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { Console } from 'console';
import { FormControl, FormGroup } from '@angular/forms';
declare let $: any;


@Component({
  selector: 'app-claimraisedetails',
  templateUrl: './claimraisedetails.component.html',
  styleUrls: ['./claimraisedetails.component.scss']
})
export class ClaimraisedetailsComponent implements OnInit {
  msg: string;
  urlPreSurgery: any = "./assets/img/gallery.png";
  urlPostSurgery: any = "./assets/img/gallery.png";
  urlIntraSurgery: any = "./assets/img/gallery.png";
  urlSpecimenRemoval: any = "./assets/img/gallery.png";
  PatientPhoto: any = "./assets/img/gallery.png";
  childmessage: any;
  URN: any;
  userdetailsByid: any = [];
  userdetailsByid1: any
  mimeType: any;
  selectedFile: any;
  selectedFilehospital: any;
  fileToUpload: any;
  TreatmentDetails: any;
  file: any;
  getid: any
  data: BlobPart;
  documentType: any;
  postdetails: any;
  predetails: any;
  specimandetails: any;
  intadetails: any;
  patientpic: any;
  user: any
  hospitalBillExists: any = false
  urnNo: any
  preAuth: any;
  check: boolean = false;
  authorized: any;
  Hospital: any;
  preAuthdata: any;
  dataClaim: any
  datavalue: any;
  query: boolean = false;
  currentPageNum: any;
  hospitalNav: string;
  procedureNameStatus: boolean = false;
  maxChars = 500;
  description: string = '';
  remarks: any;
  remarksstatus: boolean = false;
  constructor(public headerService: HeaderService, private logser: ClaimRaiseServiceService, private loginService: LoginService, public router: Router,
    public snoService: SnoCLaimDetailsService, private jwtService: JwtService, private cpdService: CreatecpdserviceService, private sessionService: SessionStorageService) {
  }
  ngOnInit() {
    this.dataClaim = JSON.parse(localStorage.getItem("actionDataforclaim"));
    this.hospitalNav = localStorage.getItem("hospitalNav");
    this.getid = this.dataClaim.Action;
    this.urnNo = this.dataClaim.URN;
    this.authorized = this.dataClaim.Authroziedcode;
    this.Hospital = this.dataClaim.Hospitalcode;
    this.headerService.setTitle('Claim Raise Details');
    this.headerService.isIndicate(false);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
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
    let month: any
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
    var frstDay = date1 + "-" + month + "-" + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.OngetFalsebackbutton();
    this.onSearchFilterClaimDetails();
    this.ongetpreAuthdata();
  }

  selectFile(event: any, type: string) {
    if (!event[0] || event[0].length == 0) {
      return;
    }
    var mimeType = event[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.swal('', 'Only JPG/JPEG Are Allowed!', 'error');
      if (type == "pre") {
        $('#pree').val('');
        this.urlPreSurgery = "./assets/img/gallery.png";
      } if (type == "post") {
        $('#post').val('');
        this.urlPostSurgery = "./assets/img/gallery.png";
      }
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(event[0]);
    reader.onload = (_event) => {
      this.msg = "";
      if (type == 'pre') {
        this.urlPreSurgery = reader.result;
      } else if (type == 'post') {
        this.urlPostSurgery = reader.result;
      }
    }
  }
  selectFileintspce(event: any, type: string) {
    if (!event[0] || event[0].length == 0) {
      return;
    }
    var mimeType = event[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.swal('', 'Only JPG/JPEG Are Allowed!', 'error');
      if (type == "ppic") {
        $('#ppic').val('');
        this.PatientPhoto = "./assets/img/gallery.png";
      } if (type == "Specimen") {
        $('#Specim').val('');
        this.urlSpecimenRemoval = "./assets/img/gallery.png";
      } if (type == "intra") {
        $('#intra').val('');
        this.urlIntraSurgery = "./assets/img/gallery.png";
        this.PatientPhoto = "./assets/img/gallery.png";
      } if (type == "Specimen") {
        $('#Specim').val('');
        this.urlSpecimenRemoval = "./assets/img/gallery.png";
      } if (type == "intra") {
        $('#intra').val('');
        this.urlIntraSurgery = "./assets/img/gallery.png";
      }
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(event[0]);
    reader.onload = (_event) => {
      this.msg = "";
      if (type == 'intra') {
        this.urlIntraSurgery = reader.result;
      } else if (type == 'Specimen') {
        this.urlSpecimenRemoval = reader.result;
      } else if (type == 'ppic') {
        this.PatientPhoto = reader.result;
      }
    }
  }
  onSearchFilterClaimDetails() {
    var check = this.getid;
    this.logser.getiduserDetails(check).subscribe(data => {
      this.userdetailsByid = data;
      for (let i = 0; i < this.userdetailsByid.length; i++) {
        this.userdetailsByid1 = this.userdetailsByid[i];
        let procedureName = this.userdetailsByid1.procedureName;
        if (procedureName.length > 40) {
          $('#procedureNameId').text(procedureName.substring(0, 40) + '...');
          $('#showMoreId').empty();
          $('#showMoreId').append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
        } else {
          $('#procedureNameId').text(procedureName);
        }
        if (this.userdetailsByid.length > 0) {
          $('#modalButton1').click();
        }
      }
    })
  }
  ongetpreAuthdata() {
    var URNnumber = this.urnNo;
    var Authroziedcode = this.authorized;
    var Hospitalcode = this.Hospital;
    this.cpdService.getPreAuthHistory(URNnumber, Authroziedcode, Hospitalcode).subscribe(data => {
      this.preAuth = data;
      this.datavalue = this.preAuth.preAuthLogList;
      if (this.preAuth.preAuthLogList.length > 0) {
        this.query = true;
      } else {
        this.query = false;
      }
    },
      error => {
      }
    );
  }

  fileUpaloadMsg(msg: string, id: any) {
    let defaultFile = "./assets/img/gallery.png";
    this.swal('Warning', "The file name shouldn't contain " + msg + " please re-name the file.", 'warning');

    $('#' + id).val('');

    if (id == "post")
      this.urlPostSurgery = defaultFile;
    else if (id == "pree")
      this.urlPreSurgery = defaultFile;
    else if (id == "intra")
      this.urlIntraSurgery = defaultFile;
    else if (id == "Specim")
      this.urlSpecimenRemoval = defaultFile;
    else if (id == "ppic")
      this.PatientPhoto = defaultFile;
    else if (id == "Treatment")
      this.selectedFile = undefined;
    else if (id == "Hospital")
      this.selectedFilehospital = undefined;
  }

  PostSurgry(files: any, fileType = 'post') {
    for (var i = 0; i < files.length; i++) {
      let filename = files[0].name;
      let data = this.loginService.fileExtensionCheck(filename);
      if (data.status != "success") {
        this.fileUpaloadMsg(data.message, "post");
        return;
      }
      let ext = filename.split('.').pop();
      if (ext != 'jpg' && ext != 'jpeg') {
        this.swal('Warning', 'Only JPG/JPEG Are Allowed!', 'warning');
        $('#post').val('');
        this.urlPostSurgery = "./assets/img/gallery.png";
        return;
      }
    }
    if (Math.round(files[0].size / 1024) >= 1024) {
      this.swal('Warning', 'FILE Size Not allowed', 'warning');
      $('#post').val('');
      return;
    } else {
      this.selectFile(files, fileType);
    }
    this.postdetails = files.item(0);
  }
  PreSurgery(files: any, filetype: any) {
    for (var i = 0; i < files.length; i++) {
      let filename = files[0].name;
      let data = this.loginService.fileExtensionCheck(filename);
      if (data.status != "success") {
        this.fileUpaloadMsg(data.message, "pree");
        return;
      }
      let ext = filename.split('.').pop();
      if (ext != 'jpg' && ext != 'jpeg') {
        this.swal('Warning', 'Only JPG/JPEG Are Allowed!', 'warning');
        $('#pree').val('');
        this.urlPreSurgery = "./assets/img/gallery.png";
        return;
      }
    }
    if (Math.round(files[0].size / 1024) >= 1024) {
      this.swal('Warning', 'FILE Size  is Not allowed ', 'warning');
      $('#pree').val('');
      return;
    } else {
      this.selectFile(files, filetype);
    }
    this.predetails = files.item(0);
  }

  IntraSurgery(files: any, filetype = 'intra') {
    for (var i = 0; i < files.length; i++) {
      var filename = files[0].name;
      let data = this.loginService.fileExtensionCheck(filename);
      if (data.status != "success") {
        this.fileUpaloadMsg(data.message, "intra");
        return;
      }
      let ext = filename.split('.').pop();
      if (ext != 'jpg' && ext != 'jpeg') {
        this.swal('Warning', 'Only JPG/JPEG Are Allowed!', 'warning');
        $('#intra').val('');
        this.urlIntraSurgery = "./assets/img/gallery.png";
        return;
      }
    }
    if (Math.round(files[0].size / 1024) >= 1024) {
      this.swal('Warning', 'FILE Size  is Not allowed ', 'warning');
      $('#intra').val('');
      return;
    } else {
      this.selectFileintspce(files, filetype);
    }
    this.intadetails = files.item(0);
  }
  SpecimenRemoval(files: any, filetype = 'Specimen') {
    for (var i = 0; i < files.length; i++) {
      var filename = files[0].name;
      let data = this.loginService.fileExtensionCheck(filename);
      if (data.status != "success") {
        this.fileUpaloadMsg(data.message, "Specim");
        return;
      }
      let ext = filename.split('.').pop();
      if (ext != 'jpg' && ext != 'jpeg') {
        this.swal('Warning', 'Only JPG/JPEG Are Allowed!', 'warning');
        $('#Specim').val('');
        this.urlSpecimenRemoval = "./assets/img/gallery.png";
        return;
      }
    }
    if (Math.round(files[0].size / 1024) >= 1024) {
      this.swal('Warning', 'FILE Size  is Not allowed ', 'warning');
      $('#Specim').val('');
      return;
    } else {
      this.selectFileintspce(files, filetype);
    }
    this.specimandetails = files.item(0);
  }
  PatientPhotoPic(files: any, filetype = 'ppic') {
    for (var i = 0; i < files.length; i++) {
      var filename = files[0].name;
      let data = this.loginService.fileExtensionCheck(filename);
      if (data.status != "success") {
        this.fileUpaloadMsg(data.message, "ppic");
        return;
      }
      let ext = filename.split('.').pop();
      if (ext != 'jpg' && ext != 'jpeg') {
        this.swal('Warning', 'Only JPG/JPEG Are Allowed!', 'warning');
        $('#ppic').val('');
        this.PatientPhoto = "./assets/img/gallery.png";
        return;
      }
    }
    if (Math.round(files[0].size / 1024) >= 1024) {
      this.swal('Warning', 'FILE Size  is Not allowed ', 'warning');
      $('#ppic').val('');
      return;
    } else {
      this.selectFileintspce(files, filetype);
    }
    this.patientpic = files.item(0);
  }
  lengthforfilevalue: any;
  traetmentvalue: string = '';
  TreatmentDetailsSlipfilename: any
  TreatmentDetailsSlip(files: any) {
    this.TreatmentDetails = files.target.files;
    $("#tratemnet").css("border-color", "green");
    for (var i = 0; i < this.TreatmentDetails.length; i++) {
      var filename = files.target.files[0].name;
      let data = this.loginService.fileExtensionCheck(filename);
      if (data.status != "success") {
        this.fileUpaloadMsg(data.message, "Treatment");
        return;
      }
      var extension = filename.split('.').pop();
      this.TreatmentDetailsSlipfilename = filename.split('.').shift();
    }
    var allowedExtensions = /(\jpg|\jpeg|pdf)$/i;
    if (!allowedExtensions.exec(extension)) {
      this.swal('Warning', 'Only JPG/JPEG/PDF Are Allowed!', 'warning');
      $("#tratemnet").css("border-color", "red");
      $('#Treatment').val('');
      this.traetmentvalue = "Select a file to upload";
      this.selectedFile = null;
      return;
    } else
      this.selectedFile = files.target.files[0];
    $("#tratemnet").css("border-color", "green");
    this.lengthforfilevalue = files.target.files.length;
    this.traetmentvalue = this.selectedFile.name;
    if (Math.round(this.selectedFile.size / 1024) >= 8192) {
      this.swal('Warning', 'Please provide Discharge Slip  with Limited Size', 'warning');
      $("#tratemnet").css("border-color", "red");
      $('#Treatment').val('');
      this.traetmentvalue = "Select a file to upload";
      this.selectedFile = undefined;
    }
  }
  shortLink: string = '';
  lengthforfile: any;
  HospitalBillfilename: any
  // randomColor: [style.background]="'green'";
  HospitalBill(files: any) {
    this.fileToUpload = files.target.files;
    $("#valuedf").css("border-color", "green");
    for (var i = 0; i < this.fileToUpload.length; i++) {
      var filename = files.target.files[0].name;
      let data = this.loginService.fileExtensionCheck(filename);
      if (data.status != "success") {
        this.fileUpaloadMsg(data.message, "Hospital");
        return;
      }
      var extension = filename.split('.').pop();
      this.HospitalBillfilename = filename.split('.').shift();
    }
    var allowedExtensions = /(\jpg|\jpeg|pdf)$/i;
    if (!allowedExtensions.exec(extension)) {
      this.swal('Warning', 'Only JPG/JPEG/PDF Are Allowed!', 'warning');
      $("#valuedf").css("border-color", "red");
      $('#Hospital').val('');
      this.shortLink = "Select a file to upload";
      this.selectedFilehospital = null;
      return;
    } else
      this.selectedFilehospital = files.target.files[0];
    $("#valuedf").css("border-color", "green");
    this.lengthforfile = files.target.files.length;
    this.shortLink = this.selectedFilehospital.name;
    if (Math.round(this.selectedFilehospital.size / 1024) >= 8192) {
      this.swal('Warning', ' Please provide Additional Slip  with Limited Size', 'warning');
      $("#valuedf").css("border-color", "red");
      $('#Hospital').val('');
      this.shortLink = "Select a file to upload";
      this.selectedFilehospital = undefined;
    }
  }
  claimbilldate: any
  SubmitClaimRaise() {
    var casenumber = $('#casenumber').val().toString().trim();
    var billnumber = $('#billnumber').val().toString().trim();
    var refractionid = this.userdetailsByid[0].transactiondetailsid;
    this.user = this.sessionService.decryptSessionData("user");
    var hospitalCode = this.Hospital;
    var updatedby = this.user.userId;
    var UrnNumber = $('#UrnNumber').html();
    var invoiceNumber = $('#Invoice').html();
    let claimbilldate = $('#date').val();
    var dateofadmisssion = this.userdetailsByid[0].dateofadmission;
    var packageCode = this.userdetailsByid[0].packageCode;
    var TreatmentDetailsSlip = this.selectedFile;
    var HospitalBill = this.selectedFilehospital
    var presurgry = this.predetails;
    var postsurgery = this.postdetails;
    var intasurgery = this.intadetails;
    var specimansurgery = this.specimandetails;
    var patientpic = this.patientpic;
    var tmsdischargedocumnet = this.userdetailsByid[0].discharge_doc;
    if (tmsdischargedocumnet == null || tmsdischargedocumnet == undefined || tmsdischargedocumnet == "") {
      if (TreatmentDetailsSlip == undefined || TreatmentDetailsSlip == null || TreatmentDetailsSlip == "") {
        this.swal('Warning', 'Please Provide Discharge  Slip ', 'warning');
        return;
      }
      if (this.TreatmentDetailsSlipfilename === this.HospitalBillfilename) {
        this.swal('Warning', 'You Are Trying to Upload same Document Again', 'warning');
        $("#valuedf").css("border-color", "red");
        $('#Hospital').val('');
        this.shortLink = "Select a file to upload";
        this.selectedFilehospital = undefined;
        this.HospitalBillfilename = "";
        return;
      }
    }
    if (claimbilldate != null || claimbilldate != undefined || claimbilldate != '') {
      this.claimbilldate = claimbilldate;
    } else {
      this.claimbilldate = '';
    }
    //----------------------------------------------------------------------------Amount Modification-------------------------------------------------------------------------------------------------
    let claimamount = this.userdetailsByid[0].totalamountclaimed;
    let blockamount = this.userdetailsByid[0].totalamountblocked;
    let amountValue = $('#amount').val();
    this.remarks = $('#remarks').val();
    if (amountValue == null || amountValue == undefined || amountValue == '') {
      this.swal('', 'Enter Claim amount cannot be Blank', 'error');
      return;
    }
    if (claimamount !== null && claimamount !== undefined && claimamount !== '' && Number(amountValue) <= Number(claimamount)) {
      if (blockamount !== null && blockamount !== undefined && blockamount !== '' && Number(amountValue) <= Number(blockamount)) {
        if (this.remarks != null && this.remarks.length > 0) {
          if (/\'/.test(this.remarks)) {
            this.swal('', ' Special character is not allowed', 'error');
            return;
          }
        } else {
          if (Number(claimamount) === Number(amountValue)) {
            amountValue = amountValue;
          } else {
            this.swal('', 'Please Provide Remark', 'error');
            return;
          }
        }
      } else {
        this.swal('', 'You Can Not Enter More Than Package Amount', 'error');
        return;
      }
    } else {
      this.swal('', 'You Can Not Enter More Than Claimed Amount', 'error');
      return;
    }
    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    console.log(amountValue + "final Amount");
    console.log(this.remarks + "Remark--->");
    if (Number(claimamount) === Number(amountValue)) {
      this.remarksstatus = false;
      Swal.fire({
        title: `<span class="swal2-title-lg">Do You Want To Change Your Claim Amount?</span>`, // Use the correct Swal class for title
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          $('#amount').focus();
          this.remarksstatus = true;
        } else {
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
              formData.append('refractionid', refractionid);
              formData.append('hospitalCode', hospitalCode);
              formData.append('updatedby', updatedby);
              formData.append('UrnNumber', UrnNumber);
              formData.append('invoiceNumber', invoiceNumber);
              formData.append('dateofAdmission', dateofadmisssion);
              formData.append('packageCode', packageCode);
              formData.append('TreatmentDetailsSlip', TreatmentDetailsSlip);
              formData.append('HospitalBill', HospitalBill);
              formData.append('presurgry', presurgry);
              formData.append('postsurgery', postsurgery);
              formData.append('casenumber', casenumber);
              formData.append('billnumber', billnumber);
              formData.append('intasurgery', intasurgery);
              formData.append('specimansurgery', specimansurgery);
              formData.append('patientpic', patientpic);
              formData.append('TMSdischargedocumnet', tmsdischargedocumnet);
              formData.append('claimbilldate', this.claimbilldate);
              formData.append('amountValue', amountValue);
              formData.append('remarks', this.remarks);
              this.logser.getainserteddata(formData).subscribe(data => {
                if (data.status == "Success") {
                  this.swal("Success", data.message, "success");
                  if (this.hospitalNav == 'Y') {
                    this.router.navigate(['/application/claimToRaise']);
                  } else {
                    localStorage.setItem("status", JSON.stringify("true"));
                    this.router.navigate(['/application/claimraise']);
                  }
                } else if (data.status == "Failed") {
                  this.swal("Error", data.message, "error");
                  localStorage.setItem("status", JSON.stringify("true"));
                } else if (data.status == "Snanotmapped") {
                  this.swal("Info", data.message, "info");
                  localStorage.setItem("status", JSON.stringify("true"));
                } else if (data.status == "DC") {
                  this.swal("Info", data.message, "info");
                  localStorage.setItem("status", JSON.stringify("true"));
                } else if (data.status == "amount") {
                  this.swal("Info", data.message, "info");
                  localStorage.setItem("status", JSON.stringify("true"));
                }else if (data.status == "claimBill") {
                  this.swal("Info", data.message, "info");
                  localStorage.setItem("status", JSON.stringify("true"));
                }
              },
                (error) => {
                  this.swal('', 'Something went wrong.', 'error');
                });
            }
          })
        }
      })
    } else {
      const difference = this.calculateDifference(amountValue, claimamount);
      this.remarksstatus = true;
      Swal.fire({
        title: `<span class="swal2-title-lg">Your Previous Claim amount is <span style="color: red; font-weight: bold;">₹${claimamount}</span> and Your Current Claim amount is <span style="color: red; font-weight: bold;">₹${amountValue}</span><br> The difference is <span style="color: green; font-weight: bold;">₹${difference} </span></span>.`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
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
              formData.append('refractionid', refractionid);
              formData.append('hospitalCode', hospitalCode);
              formData.append('updatedby', updatedby);
              formData.append('UrnNumber', UrnNumber);
              formData.append('invoiceNumber', invoiceNumber);
              formData.append('dateofAdmission', dateofadmisssion);
              formData.append('packageCode', packageCode);
              formData.append('TreatmentDetailsSlip', TreatmentDetailsSlip);
              formData.append('HospitalBill', HospitalBill);
              formData.append('presurgry', presurgry);
              formData.append('postsurgery', postsurgery);
              formData.append('casenumber', casenumber);
              formData.append('billnumber', billnumber);
              formData.append('intasurgery', intasurgery);
              formData.append('specimansurgery', specimansurgery);
              formData.append('patientpic', patientpic);
              formData.append('TMSdischargedocumnet', tmsdischargedocumnet);
              formData.append('claimbilldate', this.claimbilldate);
              formData.append('amountValue', amountValue);
              formData.append('remarks', this.remarks);
              this.logser.getainserteddata(formData).subscribe(data => {
                if (data.status == "Success") {
                  this.swal("Success", data.message, "success");
                  if (this.hospitalNav == 'Y') {
                    this.router.navigate(['/application/claimToRaise']);
                  } else {
                    localStorage.setItem("status", JSON.stringify("true"));
                    this.router.navigate(['/application/claimraise']);
                  }
                } else if (data.status == "Failed") {
                  this.swal("Error", data.message, "error");
                  localStorage.setItem("status", JSON.stringify("true"));
                } else if (data.status == "Snanotmapped") {
                  this.swal("Info", data.message, "info");
                  localStorage.setItem("status", JSON.stringify("true"));
                } else if (data.status == "DC") {
                  this.swal("Info", data.message, "info");
                  localStorage.setItem("status", JSON.stringify("true"));
                } else if (data.status == "amount") {
                  this.swal("Info", data.message, "info");
                  localStorage.setItem("status", JSON.stringify("true"));
                }else if (data.status == "claimBill") {
                  this.swal("Info", data.message, "info");
                  localStorage.setItem("status", JSON.stringify("true"));
                }
              },
                (error) => {
                  this.swal('', 'Something went wrong.', 'error');
                });
            }
          })
        }
      })
    }
  }
  OncancelClaimRAise() {
    Swal.fire({
      title: 'Are You Sure To Cancel?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        $('#Hospital').val('');
        $('#Treatment').val('');
        $('#ppic').val('');
        $('#Specim').val('');
        $('#intra').val('');
        $('#pree').val('');
        $('#post').val('');
        this.swal("error", "Claim is Cancelled", "error");
        this.router.navigate(['/application/claimraise']);
      }
    })
  }
  downloadfiletreatmentbill() {
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
  downloadfilehospitallbill() {
    if (this.selectedFilehospital) {
      const file: File | null = this.selectedFilehospital;
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
  downloadActionforauthdata(event: any, fileName: any, hCode: any, dateOfAdm: any) {
    let target = event.target;
    if ((target.nodeName == "A" || target.nodeName == "a") || (target.nodeName == "IMG" || target.nodeName == "img") || (target.nodeName == "I" || target.nodeName == "i") || (target.nodeName == "SPAN" || target.nodeName == "span")) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (fileName != null) {
        let img = this.snoService.downloadFile(fileName, hCode, dateOfAdm);
        window.open(img, '_blank')
      }
    }
  }
  keyFunc1(e) {
    if (e.value[0] == "@") {
      $('#casenumber').val('');
    } else if (e.value[0] == "(") {
      $('#casenumber').val('')
    }
    else if (e.value[0] == ")") {
      $('#casenumber').val('')
    }
    else if (e.value[0] == ' ') {
      $('#casenumber').val('')
    }
    else if (e.value[0] == "-") {
      $('#casenumber').val('')
    }
    else if (e.value[0] == "_") {
      $('#casenumber').val('')
    }
    else if (e.value[0] == ".") {
      $('#casenumber').val('')
    } else if (e.value[0] == "/") {
      $('#casenumber').val('')
    }
  }
  keyFunc2(e) {
    if (e.value[0] == "@") {
      $('#billnumber').val('');

    } else if (e.value[0] == "(") {
      $('#billnumber').val('')
    }
    else if (e.value[0] == ")") {
      $('#billnumber').val('')
    }
    else if (e.value[0] == ' ') {
      $('#billnumber').val('')
    }
    else if (e.value[0] == "-") {
      $('#billnumber').val('')
    }
    else if (e.value[0] == "_") {
      $('#billnumber').val('')
    }
    else if (e.value[0] == ".") {
      $('#billnumber').val('')
    } else if (e.value[0] == "/") {
      $('#billnumber').val('')
    }
  }
  downloadAction(event: any, fileName: any, hCode: any, dateOfAdm: any) {
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
        this.snoService.downloadFiles(fileName, hCode, dateOfAdm).subscribe(
          (response: any) => {
            var result = response;
            let blob = new Blob([result], { type: result.type });
            let url = window.URL.createObjectURL(blob);
            window.open(url);
          },
          (error) => {
          }
        );
      }
    }
  }
  preauthLogDetails() {
    var URNnumber = this.urnNo;
    var Authroziedcode = this.authorized;
    var Hospitalcode = this.Hospital;
    localStorage.setItem("urn", URNnumber);
    localStorage.setItem("authorizedCode", Authroziedcode);
    localStorage.setItem("hospitalCode", Hospitalcode);
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.router.navigate([]).then(result => { window.open(environment.routingUrl + '/preauthhistory'); });
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  OngetFalsebackbutton() {
    this.headerService.isBack(false);
    localStorage.setItem("status", JSON.stringify("true"));
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  downloadActionforDischarge(event: any, fileName: any, hCode: any, dateOfAdm: String) {
    dateOfAdm = dateOfAdm.substring(0, 2) + "-" + dateOfAdm.substring(2, 4) + "-" + dateOfAdm.substring(4, 8);
    let target = event.target;
    if ((target.nodeName == "A" || target.nodeName == "a") || (target.nodeName == "IMG" || target.nodeName == "img") || (target.nodeName == "I" || target.nodeName == "i")) {
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
          }
        );
      }
    }
  }

  showProcedureName() {
    $('#procedureNameId').text(this.userdetailsByid1.procedureName);
    $('#showMoreId').empty()
    $('#showMoreId1').append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hideProcedureName() {
    let procedureName = this.userdetailsByid1.procedureName;
    if (procedureName.length > 40) {
      this.procedureNameStatus = true;
      $('#procedureNameId').text(procedureName.substring(0, 40) + '...');
      $('#showMoreId1').empty()
      $('#showMoreId').empty();
      $('#showMoreId').append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });
  approved_Amount(event: KeyboardEvent) {
    const pattern = /^[0-9\b]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPress(event: KeyboardEvent) {
    const pattern = /'/;
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  calculateDifference(currentAmount, previousAmount) {
    return Number(previousAmount) - Number(currentAmount);
  }
}


