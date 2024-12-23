import { Component, OnInit } from '@angular/core';
import { ClaimsqueriedbySNOServive } from '../../Services/claimsqueriedbySNO.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { HeaderService } from '../../header.service';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
import Swal from 'sweetalert2';
import { QueryByCpdService } from '../../Services/query-by-cpd.service';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
declare let $: any;

@Component({
  selector: 'app-casewise-queriedbysnasubmit',
  templateUrl: './casewise-queriedbysnasubmit.component.html',
  styleUrls: ['./casewise-queriedbysnasubmit.component.scss']
})
export class CasewiseQueriedbysnasubmitComponent implements OnInit {
  maxChars = 1000;
  childmessage: any
  msg: string;
  urlPreSurgery: any = "./assets/img/male-profile.jpg";
  urlPostSurgery: any = "./assets/img/male-profile.jpg";
  URN: any;
  userdetailsByid: any = [];
  mimeType?: FileList;
  fileToUpload?: FileList;
  TreatmentDetails?: FileList;
  file?: FileList;
  postdetails?: FileList;
  predetails?: FileList;
  claimlist: any = [];
  caseid: any
  claimLogforcpd: Array<any> = [];
  userdetails: any;
  InvestigationDoc1: any;
  InvestigationDoc2: any;
  selectedFile: any;
  selectedFileinvestication: any
  investigation: any = false
  documentType: any;
  user: any;
  javaIntro: any
  procedureNameStatus: boolean = false;
  dtls: any;
  dataCpd: any;
  currentPageNumber: any;
  hospitalNav: string;
  selectedProcedureCode: any;
  selectedProcedureName: any;
  selectedPackageType: any;
  selectedPackageAmount: any;
  selectedspecialityCode: any;
  selectedPatientName: any;
  AdditionalDocuments: any;
  AdditionalDocument1s: any;
  selectedFileDocument: any;
  AdditionalDocument1Exists: any = false
  constructor(private service: ClaimsqueriedbySNOServive, private cpdservice: QueryByCpdService, public router: Router, private http: HttpClient, private headerService
    : HeaderService, private LoginServ: ClaimRaiseServiceService, private sessionService: SessionStorageService, public packageDetailsMasterService: PackageDetailsMasterService, private encryptionService: EncryptionService) { }

  ngOnInit(): void {
    this.dataCpd = JSON.parse(localStorage.getItem("actionDataforsna"));
    this.hospitalNav = localStorage.getItem("hospitalNav");
    this.user = this.sessionService.decryptSessionData("user");
    this.caseid = this.dataCpd.caseid;
    this.headerService.setTitle('Case Queried by SNA');
    this.headerService.isIndicate(false);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.OngetFalsebackbutton();
    this.getsnaquerytohospitaldetails();
    this.getActiontakenhistory();
  }
  OngetFalsebackbutton() {
    this.headerService.isBack(false);
    localStorage.setItem("status", JSON.stringify("true"));
  }

  errorMessage: any;
  snaqueryhsptldtls: any[] = [];
  snaqueryhsptldtls1: any[] = [];
  getsnaquerytohospitaldetails() {
    let caseid = this.caseid;
    this.service.getsnaquerytohospitaldetails(caseid).subscribe({
      next: (response: any) => {
        if (response && response.status === 200 && response.data) {
          this.snaqueryhsptldtls = response?.data?.data;
          this.snaqueryhsptldtls1 = response?.data?.data1;
          this.snaqueryhsptldtls1.forEach(item => {
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


  getSum(field: string): number {
    if (!this.snaqueryhsptldtls1 || this.snaqueryhsptldtls1.length === 0) {
      console.log('No data available for summing');
      return 0; // Return 0 if no data is available
    }

    return this.snaqueryhsptldtls1
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

  length: any;
  filename: String = '';
  AdditionalDocumentfilename: any;
  AdditionalDocument(files: any) {
    this.AdditionalDocuments = files.target.files;
    $("#additionapicid").css("border-color", "green");
    for (var i = 0; i < this.AdditionalDocuments.length; i++) {
      var filename = files.target.files[0];
      var extension = filename.name.split('.').pop();
      this.AdditionalDocumentfilename = filename.name.split('.').shift();
    }
    var allowedExtensions = /(\jpg|\jpeg|pdf)$/i;
    if (!allowedExtensions.exec(extension)) {
      this.swal('Warning', 'DOCX, DOC, EXE is Not allowed', 'warning');
      $("#additionapicid").css("border-color", "red");
      $('#ADD').val('');
      this.filename = "Select a file to upload";
      this.selectedFile = null;
      return;
    } else
      this.selectedFile = files.target.files[0];
    $("#tratemnet").css("border-color", "green");
    this.length = files.target.files.length;
    this.filename = this.selectedFile.name;
    if (Math.round(this.selectedFile.size / 1024) >= 8192) {
      this.swal('Warning', 'Please provide  Additional Slip1 with Limited Size', 'warning');
      $("#additionapicid").css("border-color", "red");
      $('#ADD').val('');
      this.filename = "Select a file to upload";
      this.selectedFile = undefined;
      return;
    }
  }
  lengthadd1: any;
  filenameadd1: String = '';
  AdditionalDocument1filename: any;
  AdditionalDocument1(files: any) {
    this.AdditionalDocument1s = files.target.files;
    $("#add1pic").css("border-color", "green");
    for (var i = 0; i < this.AdditionalDocument1s.length; i++) {
      var filename = files.target.files[0];
      var extension = filename.name.split('.').pop();
      this.AdditionalDocument1filename = filename.name.split('.').shift();
    }
    var allowedExtensions = /(\jpg|\jpeg|pdf)$/i;
    if (!allowedExtensions.exec(extension)) {
      this.swal('Warning', 'DOCX, DOC, EXE is Not allowed', 'warning');
      $("#add1pic").css("border-color", "red");
      $('#ADDC').val('');
      this.filenameadd1 = "Select a file to upload";
      this.selectedFileDocument = null;
      return;
    } else
      this.selectedFileDocument = files.target.files[0];
    $("#add1pic").css("border-color", "green");
    this.lengthadd1 = files.target.files.length;
    this.filenameadd1 = this.selectedFileDocument.name;
    if (Math.round(this.selectedFileDocument.size / 1024) >= 8192) {
      this.swal('Warning', 'Please provide  Additional Slip2  with Limited Size',
        'warning');
      $("#add1pic").css("border-color", "red");
      $('#ADDC').val('');
      this.filenameadd1 = "Select a file to upload";
      this.selectedFileDocument = undefined;
      return;
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
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
  downloadfilehospitallbillforadd2() {
    if (this.selectedFileDocument) {
      const file: File | null = this.selectedFileDocument;
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

  resetModal() {
    this.selectedFile = undefined;
    this.filename = "Select a file to upload";
    this.selectedFileDocument = undefined;
    this.filenameadd1 = "Select a file to upload";
    $("#additionapicid").css("border-color", "#d1e2d1");
    $("#add1pic").css("border-color", "#d1e2d1");
    $('#ADD').val('');
    $('#ADDC').val('');
    $('#uploadModalcpdquery').hide();
  }


  confirmSubmission() {
    var additionaldoc1 = this.selectedFile;
    var additionaldoc2 = this.selectedFileDocument;
    let transactiondetailsid = this.transactiondetailsid;
    let updatedby = this.user.userId;
    let urn = this.urn;
    let year = this.year;
    let hospitalCode = this.hospitalCode;
    if (additionaldoc1 == undefined || additionaldoc1 == null || additionaldoc1 == "") {
      this.swal('Warning', 'Please Provide Additional Document Slip ', 'warning');
      return;
    }
    if (this.selectedFile === this.selectedFileDocument) {
      this.swal('Warning', 'You Are Trying to Upload same Document Again ', 'warning');
      $("#additional").css("border-color", "red");
      $('#ADDC').val('');
      this.filenameadd1 = "Select a file to upload";
      this.selectedFileDocument = undefined;
      this.selectedFileDocument = "";
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
        formData.append('additionaldoc1', additionaldoc1);
        formData.append('additionaldoc2', additionaldoc2);
        this.cpdservice.getselectedcpdtohospitalquerydocumentUpload(formData).subscribe(data => {
          if (data.status === "Success") {
            Swal.fire({
              title: 'Success',
              text: data.message,
              icon: 'success',
              confirmButtonText: 'OK',
              allowOutsideClick: false  // Prevent closing when clicking outside
            }).then((result) => {
              if (result.isConfirmed) {
                $('#uploadModalcpdquery').hide();
                this.resetModal();
                this.getsnaquerytohospitaldetails();
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



  submitreclaim() {
    let updatedby = this.user.userId;
    let Hospitalcode = this.user.userName;
    let caseno = this.snaqueryhsptldtls[0]?.caseNumber;
    let urn = this.snaqueryhsptldtls[0]?.urn;
    let remark = $('#cremarks').val();
    let caseid = this.caseid
    let allData = this.snaqueryhsptldtls1
      .map(item => `${item.transactiondetailsId}#${item.modifiedAmount}`)
      .join(',');

    // for (let item of this.cpdqueryhsptldtls1) {
    //   if (item.deletedstatus !== '1' && item.docuploadedstatus !== '1') {
    //     this.swal('Warning', `Document not uploaded for this Speciality Code: ${item.specialityCode}`, 'warning');
    //     return;
    //   }
    // }

    let documentUploaded = false;
    for (let item of this.snaqueryhsptldtls1) {
      // Check if the item is not deleted and a document is uploaded
      if (item.deletedstatus !== '1' && item.docuploadedstatus === '1') {
        documentUploaded = true; // At least one document is uploaded
        break; // No need to continue checking once one document is uploaded
      }
    }

    if (!documentUploaded) {
      this.swal('Warning', `Document not uploaded for any Speciality Code`, 'warning');
      return;
    }


    if (remark == undefined || remark == null || remark == "") {
      this.swal('Warning', 'Please Provide Remark', 'warning');
      return;
    }

    Swal.fire({
      title: 'Are You Sure To Re-Claim?',
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
        this.service.getcasewisesnaquerytohospitalsubmit(formdata1).subscribe(data => {
          if (data.status == "Success") {
            Swal.fire({
              title: 'Success',
              text: data.message,
              icon: 'success',
              allowOutsideClick: false  // Disable outside click
            }).then((result) => {
              if (result.isConfirmed) {
                if (this.hospitalNav == 'N') {
                  this.router.navigate(['/application/casewiseClaimQueriedBySNA']);
                } else {
                  localStorage.setItem("status", JSON.stringify("true"));
                  this.router.navigate(['/application/casewiseClaimQueriedBySNA']);
                }
              } else {
                this.swal("Error", data.message, "error");
                localStorage.setItem("status", JSON.stringify("true"));
              }
            });
          } else if (data.status == "Failed") {
            this.swal("Error", data.message, "error");
            localStorage.setItem("status", JSON.stringify("true"));
          }
        },
          (error) => {
            this.swal('', 'Something went wrong.', 'error');
          });
      }
    })
  }

  getactiontakenData: any[] = [];
  getActiontakenhistory() {
    let id = this.caseid;
    this.cpdservice.getgetActiontakenhistory(id).subscribe({
      next: (response: any) => {
        if (response && response.status === 200 && response.data) {
          console.log(response.data);
          this.getactiontakenData = response?.data?.data;
        } else {
          this.errorMessage = response.message || 'An error occurred while fetching claim details.';
        }
      },
      error: () => {
        this.errorMessage = 'An error occurred while fetching claim details.';
      }
    });
  }
  cremarks: any;
  myGroup = new FormGroup({
    cremarks: new FormControl(),
  });

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,#%<>()-_ \\s]+$/;
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
  urn: any = '';
  year: any = '';
  hospitalCode: any = '';
  transactiondetailsid: any = 0;
  openUploadModal(item) {
    console.log(item);
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
    this.selectedPatientName = this.snaqueryhsptldtls[0]?.patientName;
    $('#uploadModalcpdquery').show();
  }

}
