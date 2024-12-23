import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QueryByCpdService } from '../../Services/query-by-cpd.service';
import { HeaderService } from '../../header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
declare let $: any;
@Component({
  selector: 'app-casewise-queriedbycpdsubmit',
  templateUrl: './casewise-queriedbycpdsubmit.component.html',
  styleUrls: ['./casewise-queriedbycpdsubmit.component.scss']
})
export class CasewiseQueriedbycpdsubmitComponent implements OnInit {
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
  constructor(private service: QueryByCpdService, public headerService: HeaderService, private activatedRoute: ActivatedRoute, public router: Router, private SnoCLaimDetailsServ: SnoCLaimDetailsService, private sessionService: SessionStorageService) {
  }

  ngOnInit(): void {
    this.dataCpd = JSON.parse(localStorage.getItem("actionDataforcpd"));
    this.hospitalNav = localStorage.getItem("hospitalNav");
    this.user = this.sessionService.decryptSessionData("user");
    this.caseid = this.dataCpd.caseid;
    this.headerService.setTitle('Case Queried by CPD');
    this.headerService.isIndicate(false);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.OngetFalsebackbutton();
    this.getcpdquerytohospitaldetails()
    this.getActiontakenhistory();

  }
  errorMessage: any;
  cpdqueryhsptldtls: any[] = [];
  cpdqueryhsptldtls1: any[] = [];
  getcpdquerytohospitaldetails() {
    this.cpdqueryhsptldtls1=[];
    let caseid = this.caseid;
    this.service.getcpdquerytohospitaldetails(caseid).subscribe({
      next: (response: any) => {
        if (response && response.status === 200 && response.data) {
          this.cpdqueryhsptldtls = response?.data?.data;
          this.cpdqueryhsptldtls1 = response?.data?.data1;
          this.cpdqueryhsptldtls1.forEach(item => {
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
    if (!this.cpdqueryhsptldtls1 || this.cpdqueryhsptldtls1.length === 0) {
      console.log('No data available for summing');
      return 0; // Return 0 if no data is available
    }

    return this.cpdqueryhsptldtls1
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


  submitreclaim() {
    let updatedby = this.user.userId;
    let Hospitalcode = this.user.userName;
    let caseno = this.cpdqueryhsptldtls[0]?.caseNumber;
    let urn = this.cpdqueryhsptldtls[0]?.urn;
    let remark = $('#cremarks').val();
    let caseid = this.caseid
    let allData = this.cpdqueryhsptldtls1
      .map(item => `${item.transactiondetailsId}#${item.modifiedAmount}`)
      .join(',');

    // for (let item of this.cpdqueryhsptldtls1) {
    //   if (item.deletedstatus !== '1' && item.docuploadedstatus !== '1') {
    //     this.swal('Warning', `Document not uploaded for this Speciality Code: ${item.specialityCode}`, 'warning');
    //     return;
    //   }
    // }

    let documentUploaded = false;
    for (let item of this.cpdqueryhsptldtls1) {
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
        this.service.getcasewisecpdquerytohospitalsubmit(formdata1).subscribe(data => {
          if (data.status == "Success") {
            Swal.fire({
              title: 'Success',
              text: data.message,
              icon: 'success',
              allowOutsideClick: false  // Disable outside click
            }).then((result) => {
              if (result.isConfirmed) {
                // Your navigation logic
                if (this.hospitalNav == 'N') {
                  this.router.navigate(['/application/casewiseClaimQueriedByCPD']);
                } else {
                  localStorage.setItem("status", JSON.stringify("true"));
                  this.router.navigate(['/application/casewiseClaimQueriedByCPD']);
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
    this.selectedPatientName = this.cpdqueryhsptldtls[0]?.patientName;

    $('#uploadModalcpdquery').show();
  }


  confirmSubmission() {
    var additionaldoc1 = this.selectedFile;
    var additionaldoc2 = this.selectedFileinvestication;
    let transactiondetailsid = this.transactiondetailsid;
    let updatedby = this.user.userId;
    let urn = this.urn;
    let year = this.year;
    let hospitalCode = this.hospitalCode;
    if (additionaldoc1 == undefined || additionaldoc1 == null || additionaldoc1 == "") {
      this.swal('Warning', 'Please Provide Additional Document Slip ', 'warning');
      return;
    }
    if (this.investigationdoc1filename === this.InvestigationDocforcpd2filename) {
      this.swal('Warning', 'You Are Trying to Upload same Document Again ', 'warning');
      $("#additional").css("border-color", "red");
      $('#ADDC').val('');
      this.InvestigationDocforcpdval = "Select a file to upload";
      this.selectedFileinvestication = undefined;
      this.InvestigationDocforcpd2filename = "";
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
        this.service.getselectedcpdtohospitalquerydocumentUpload(formData).subscribe(data => {
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
                this.getcpdquerytohospitaldetails();
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
    this.selectedFile = undefined;
    this.traetmentvalue = "Select a file to upload";
    this.selectedFileinvestication = undefined;
    this.InvestigationDocforcpdval = "Select a file to upload";
    $("#additional").css("border-color", "#d1e2d1");
    $("#Discharge").css("border-color", "#d1e2d1");
    $('#ADD').val('');
    $('#ADDC').val('');
    $('#uploadModalcpdquery').hide();
  }



  OngetFalsebackbutton() {
    this.headerService.isBack(false);
    localStorage.setItem("status", JSON.stringify("true"));
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

  lengthforfilevalue: any;
  traetmentvalue: string = '';
  investigationdoc1filename: any;
  InvestigationDocforcpd1(files: any) {
    this.InvestigationDoc1 = files.target.files;
    $("#Discharge").css("border-color", "green");
    for (var i = 0; i < this.InvestigationDoc1.length; i++) {
      var filename = files.target.files[0];
      var extension = filename.name.split('.').pop();
      this.investigationdoc1filename = filename.name.split('.').shift();
    }
    var allowedExtensions = /(\jpg|\jpeg|pdf)$/i;
    if (!allowedExtensions.exec(extension)) {
      this.swal('Warning', 'DOCX, DOC, EXE is Not allowed', 'warning');
      $("#Discharge").css("border-color", "red");
      this.traetmentvalue = "Select a file to upload";
      $('#ADD').val('');
      this.selectedFile = null;
      return;
    } else
      this.selectedFile = files.target.files[0];
    $("#Discharge").css("border-color", "green");
    this.lengthforfilevalue = files.target.files.length;
    this.traetmentvalue = this.selectedFile.name;
    if (Math.round(this.selectedFile.size / 1024) >= 8192) {
      this.swal('Warning', 'Additional Slip1  FILE Size  is Not allowed', 'warning');
      $("#Discharge").css("border-color", "red");
      $('#ADD').val('');
      this.traetmentvalue = "Select a file to upload";
      this.selectedFile = undefined;
      return;
    }
  }
  lengthforInvestigationDocforcpd2: any;
  InvestigationDocforcpdval: string = '';
  InvestigationDocforcpd2filename: any;
  InvestigationDocforcpd2(files: any) {
    this.InvestigationDoc2 = files.target.files;
    $("#additional").css("border-color", "green");
    for (var i = 0; i < this.InvestigationDoc2.length; i++) {
      var filename = files.target.files[0];
      var extension = filename.name.split('.').pop();
      this.InvestigationDocforcpd2filename = filename.name.split('.').shift();
    }
    var allowedExtensions = /(\jpg|\jpeg|pdf)$/i;
    if (!allowedExtensions.exec(extension)) {
      this.swal('Warning', 'DOCX, DOC, EXE is Not allowed', 'warning');
      $("#additional").css("border-color", "red");
      $('#ADDC').val('');
      this.InvestigationDocforcpdval = "Select a file to upload";
      this.selectedFileinvestication = null;
      return;
    } else
      this.selectedFileinvestication = files.target.files[0];
    $("#additional").css("border-color", "green");
    this.lengthforInvestigationDocforcpd2 = files.target.files.length;
    this.InvestigationDocforcpdval = this.selectedFileinvestication.name;
    if (Math.round(this.selectedFileinvestication.size / 1024) >= 8192) {
      this.swal('Warning', 'Additional Slip2  FILE Size  is Not allowed', 'warning');
      $("#additional").css("border-color", "red");
      $('#ADDC').val('');
      this.InvestigationDocforcpdval = "Select a file to upload";
      this.selectedFileinvestication = undefined;
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
  downloadfilehospitallbillInvestigationDocforcpd2() {
    if (this.selectedFileinvestication) {
      const file: File | null = this.selectedFileinvestication;
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

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
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
  getactiontakenData: any[] = [];
  getActiontakenhistory() {
    let id = this.caseid;
    this.service.getgetActiontakenhistory(id).subscribe({
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
}
