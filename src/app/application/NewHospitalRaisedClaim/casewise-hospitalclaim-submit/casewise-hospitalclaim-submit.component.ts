import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/services/shared-services/login.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-casewise-hospitalclaim-submit',
  templateUrl: './casewise-hospitalclaim-submit.component.html',
  styleUrls: ['./casewise-hospitalclaim-submit.component.scss']
})
export class CasewiseHospitalclaimSubmitComponent implements OnInit {
  urlPreSurgery: any = "./assets/img/gallery.png";
  urlPostSurgery: any = "./assets/img/gallery.png";
  urlIntraSurgery: any = "./assets/img/gallery.png";
  urlSpecimenRemoval: any = "./assets/img/gallery.png";
  PatientPhoto: any = "./assets/img/gallery.png";
  childmessage: any;
  deleteReason: string = '';
  isSubmitAttempted: boolean = false;
  isDisabled: boolean = false;
  itemToDelete: any;
  itemTobeupload: any;
  caseid: any;
  data: any;
  errorMessage: any;
  newClaimDetailsData: any[] = [];
  newClaimDetailsData1: any[] = [];
  selectedProcedureCode: any;
  selectedProcedureName: any;
  selectedPackageType: any;
  selectedPackageAmount: any;
  selectedspecialityCode: any;
  selectedPatientName: any;
  URN: any;
  userdetailsByid: any = [];
  userdetailsByid1: any
  mimeType: any;
  selectedFile: any;
  selectedFilehospital: any;
  fileToUpload: any;
  TreatmentDetails: any;
  file: any;
  documentType: any;
  postdetails: any;
  predetails: any;
  specimandetails: any;
  intadetails: any;
  patientpic: any;
  user: any;
  msg: string;
  hospitalNav: string;
  maxChars = 1000;
  selectedtransactiondetailsid: any;
  constructor(public headerService: HeaderService, private logser: ClaimRaiseServiceService, public router: Router, private loginService: LoginService, private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    document.querySelectorAll('[data-bs-toggle="tooltip"]');
    this.data = JSON.parse(localStorage.getItem("caseid"));
    this.hospitalNav = localStorage.getItem("hospitalNav");
    this.caseid = this.data.caseid;
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle('Casewise Hospital Claim Submit');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
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
    this.getClaimDetails();
  }

  getClaimDetails() {
    let id = this.caseid;
    this.logser.getClaimDetailsthroughid(id).subscribe({
      next: (response: any) => {
        if (response && response.status === 200 && response.data) {
          console.log(response.data);
          this.newClaimDetailsData = response?.data?.data;
          this.newClaimDetailsData1 = response?.data?.data1;
          this.newClaimDetailsData1.forEach(item => {
            item.originalAmount = item.hospitalDischargeAmount; // Store original value
            item.modifiedAmount = item.hospitalDischargeAmount; // Initialize modified amount
          });
        } else {
          this.errorMessage = response.message || 'An error occurred while fetching claim details.';
        }
      },
      error: () => {
        this.errorMessage = 'An error occurred while fetching claim details.';
      }
    });
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  openDeleteModal(item) {
    this.selectedProcedureCode = '';
    this.selectedProcedureName = '';
    this.selectedPackageType = '';
    this.selectedPackageAmount = '';
    this.selectedtransactiondetailsid = '';
    this.deleteReason = '';  // Reset reason
    this.isSubmitAttempted = false;  // Reset submission flag\
    this.selectedspecialityCode = item.specialityCode;
    this.selectedProcedureCode = item.procedureCode;
    this.selectedProcedureName = item.procedureName;
    this.selectedPackageType = item.packageType;
    if (this.selectedPackageType === 'S') {
      this.selectedPackageType = 'Surgical'
    } else if (this.selectedPackageType === 'M') {
      this.selectedPackageType = 'Medical'
    } else {
      this.selectedPackageType = 'N/A'
    }
    this.selectedPackageAmount = item.packageAmount;
    this.selectedtransactiondetailsid = item.transactiondetailsId
    this.selectedPatientName = this.newClaimDetailsData[0]?.patientName
    $('#deleteModal').show();
  }

  deleteModal() {
    $('#deleteModal').hide();
  }

  onReasonInput() {
    // Handle any additional logic on textarea input (if needed)
  }

  confirmDeletion() {
    this.isSubmitAttempted = true;
    let userid = this.user.userId;

    if (!this.deleteReason || this.deleteReason.trim().length === 0) {
      this.swal('error', 'Please Provide Reason for Deletion', 'error');
      return;
    }
    if (this.deleteReason.trim().length < 100) {
      this.swal('error', 'Please Provide 100 characters are required.', 'error');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this record?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.logser.getdeletedRecord(this.selectedtransactiondetailsid, this.deleteReason, userid)
          .subscribe((data: any) => {
            if (data && data.status === "200") {
              Swal.fire({
                title: 'Success',
                text: 'Record Deleted Successfully',
                icon: 'success',
                confirmButtonText: 'OK',
                allowOutsideClick: false  // Prevent closing when clicking outside
              }).then((result) => {
                if (result.isConfirmed) {
                  this.deleteModal();
                  this.newClaimDetailsData1.forEach(element => {
                    if (element.transactiondetailsId === this.selectedtransactiondetailsid) {
                      element.deletedstatus = '1';
                    }
                  });
                  // this.getClaimDetails();  // Refresh the claim details
                }
              });
            } else {
              this.swal("Error", 'Failed to delete the record.', 'error');
            }
          },
            (error) => {
              this.swal('', 'Something went wrong.', 'error');
            });
      }
    });
  }


  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,#%<>()-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  keyPress1(event: KeyboardEvent) {
    const pattern = /^[0-9]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  currentPage: any;
  openDetails(transactiondetailsId: any, urn: any, authorizedCode: any, hospitalCode: any) {
    let state = {
      Action: transactiondetailsId,
      URN: urn,
      Authroziedcode: authorizedCode,
      Hospitalcode: hospitalCode
    }
    console.log(state);
    localStorage.setItem("actionDataforclaim", JSON.stringify(state));
    localStorage.setItem("currentPageNum", JSON.stringify(this.currentPage));
    this.router.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/Hospitalclaimwisepatienttreatmentdetails');
    });
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
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }


  urn: any = '';
  year: any = '';
  hospitalCode: any = '';
  transactiondetailsid: any = 0;
  openUploadModal(item) {
    this.urn = item.urn;
    this.year = item.dateofadmission.substring(4, 8);
    this.hospitalCode = item.hospitalCode;
    this.transactiondetailsid = item.transactiondetailsId;
    this.selectedspecialityCode = item.specialityCode;
    this.selectedProcedureCode = item.procedureCode;
    this.selectedProcedureName = item.procedureName;
    this.selectedPackageType = item.packageType;
    if (this.selectedPackageType === 'S') {
      this.selectedPackageType = 'Surgical'
    } else if (this.selectedPackageType === 'M') {
      this.selectedPackageType = 'Medical'
    } else {
      this.selectedPackageType = 'N/A'
    }
    this.selectedPackageAmount = item.packageAmount;
    this.selectedtransactiondetailsid = item.transactiondetailsId
    this.selectedPatientName = this.newClaimDetailsData[0]?.patientName
    $('#uploadModal').show();
  }
  confirmSubmission(): void {
    let transactiondetailsid = this.transactiondetailsid;
    let updatedby = this.user.userId;
    let urn = this.urn;
    let year = this.year;
    let hospitalCode = this.hospitalCode;
    let TreatmentDetailsSlip = this.selectedFile;
    let HospitalBill = this.selectedFilehospital
    let presurgry = this.predetails;
    let postsurgery = this.postdetails;
    let intasurgery = this.intadetails;
    let specimansurgery = this.specimandetails;
    let patientpic = this.patientpic;
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
    Swal.fire({
      title: 'Are You Sure Want To Upload The Documents?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('transactiondetailsid', transactiondetailsid);
        formData.append('hospitalCode', hospitalCode);
        formData.append('updatedby', updatedby);
        formData.append('urn', urn);
        formData.append('year', year);
        formData.append('TreatmentDetailsSlip', TreatmentDetailsSlip);
        formData.append('HospitalBill', HospitalBill);
        formData.append('presurgry', presurgry);
        formData.append('postsurgery', postsurgery);
        formData.append('intasurgery', intasurgery);
        formData.append('specimansurgery', specimansurgery);
        formData.append('patientpic', patientpic);
        this.logser.getselecteddocumentUpload(formData).subscribe(data => {
          if (data.status === "Success") {
            Swal.fire({
              title: 'Success',
              text: data.message,
              icon: 'success',
              confirmButtonText: 'OK',
              allowOutsideClick: false  // Prevent closing when clicking outside
            }).then((result) => {
              if (result.isConfirmed) {
                $('#uploadModal').hide();
                this.resetModal();
                this.newClaimDetailsData1.forEach(element => {
                  if (element.transactiondetailsId === transactiondetailsid) {
                    element.docuploadedstatus = '1';
                  }
                });
                console.log(this.newClaimDetailsData1);
                // this.getClaimDetails();
              }
            });
          } else if (data.status == "Failed") {
            this.swal("Error", data.message, "error");
          }
        },
          (error) => {
            this.swal('', 'Something went wrong.', 'error');
          });
      }
    })
  }


  resetModal() {
    this.urlPreSurgery = "./assets/img/gallery.png";
    this.urlPostSurgery = "./assets/img/gallery.png";
    this.urlIntraSurgery = "./assets/img/gallery.png";
    this.urlSpecimenRemoval = "./assets/img/gallery.png";
    this.PatientPhoto = "./assets/img/gallery.png";
    this.traetmentvalue = "Select a file to upload";
    this.selectedFile = undefined;
    this.shortLink = "Select a file to upload";
    this.selectedFilehospital = undefined;
    $("#valuedf").css("border-color", "#d1e2d1");
    $("#tratemnet").css("border-color", "#d1e2d1");
    $('#Hospital').val('');
    $('#Treatment').val('');
    $('#ppic').val('');
    $('#Specim').val('');
    $('#intra').val('');
    $('#pree').val('');
    $('#post').val('');
    $('#uploadModal').hide();
  }

  // Method to gather data from all input fields
  claimbilldate: any;
  submitCasewiseData() {
    let updatedby = this.user.userId;
    let Hospitalcode = this.user.userName;
    let caseno = this.newClaimDetailsData[0].caseNumber;
    let urn = this.newClaimDetailsData[0].urn;
    let caseid = this.caseid
    let remark = $('#cremarks').val();
    var casenumber = $('#casenumber').val().toString().trim();
    var billnumber = $('#billnumber').val().toString().trim();
    let claimbilldate = $('#date').val();
    let allData = this.newClaimDetailsData1
      .map(item => `${item.transactiondetailsId}#${item.modifiedAmount}`)
      .join(',');

    for (let item of this.newClaimDetailsData1) {
      if (item.deletedstatus !== '1' && item.docuploadedstatus !== '1') {
        this.swal('Warning', `Document not uploaded for this Procedure Code: ${item.procedureCode}`, 'warning');
        return;
      }
    }
    if (remark == undefined || remark == null || remark == "") {
      this.swal('Warning', 'Please Provide Remark', 'warning');
      return;
    }

    if (claimbilldate != null || claimbilldate != undefined || claimbilldate != '') {
      this.claimbilldate = claimbilldate;
    } else {
      this.claimbilldate = '';
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
        const formdata1 = new FormData();
        formdata1.append('caseno', caseno);
        formdata1.append('caseid', caseid);
        formdata1.append('updatedby', updatedby);
        formdata1.append('remark', remark);
        formdata1.append('allData', allData);
        formdata1.append('Hospitalcode', Hospitalcode);
        formdata1.append('urn', urn);
        formdata1.append('casenumber', casenumber);
        formdata1.append('billnumber', billnumber);
        formdata1.append('claimbilldate', this.claimbilldate);
        this.logser.getcasewiseclaimSubmite(formdata1).subscribe(data => {
          if (data.status == "Success") {
            this.swal("Success", data.message, "success");
            if (this.hospitalNav == 'Y') {
              this.router.navigate(['/application/CasewiseHospClaimraise']);
            } else {
              localStorage.setItem("status", JSON.stringify("true"));
              this.router.navigate(['/application/CasewiseHospClaimraise']);
            }
          } else if (data.status == "Failed") {
            this.swal("Error", data.message, "error");
            localStorage.setItem("status", JSON.stringify("true"));
          } else if (data.status == "wrong") {
            this.swal("error", data.message, "error");
          }
        },
          (error) => {
            this.swal('', 'Something went wrong.', 'error');
          });
      }
    })

  }


  getChangedAmount(item: any) {
    const claimedAmount = parseFloat(item.modifiedAmount);
    if (!item.modifiedAmount || isNaN(claimedAmount)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: `Claimed amount for this Speciality Code <strong style="color: #000;">${item.specialityCode}</strong> cannot be blank.`,
        confirmButtonText: 'OK'
      }).then((result) => {
        item.modifiedAmount = item.originalAmount;
      });
      return;
    }

    const hospitalDischargeAmount = parseFloat(item.originalAmount);

    if (claimedAmount > hospitalDischargeAmount) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Amount',
        html: `Claimed amount for this Speciality Code: <strong style="color: #000;">${item.specialityCode}</strong> cannot be more than the hospital discharge amount.`,
        confirmButtonText: 'OK'
      }).then((result) => {
        item.modifiedAmount = item.originalAmount;
      });
    }
  }


  cremarks: any;
  myGroup = new FormGroup({
    cremarks: new FormControl(),
  });

  getSum(field: string): number {
    if (!this.newClaimDetailsData1 || this.newClaimDetailsData1.length === 0) {
      console.log('No data available for summing');
      return 0; // Return 0 if no data is available
    }

    return this.newClaimDetailsData1
      .filter(item => item.deletedstatus !== '1') // Ignore deleted rows
      .reduce((acc, item) => {
        console.log('inside');
        // Handle undefined or null field values
        const value = item[field] !== undefined && item[field] !== null ? parseFloat(item[field]) : 0;

        console.log(`Summing field: ${field}, Value: ${value}, Accumulated: ${acc}`);

        // Return accumulated sum
        return acc + value;
      }, 0);
  }




  OngetFalsebackbutton() {
    this.headerService.isBack(false);
    localStorage.setItem("status", JSON.stringify("true"));
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
}
