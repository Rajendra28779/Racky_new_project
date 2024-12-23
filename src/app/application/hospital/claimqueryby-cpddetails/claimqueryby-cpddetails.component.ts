import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { QueryByCpdService } from '../../Services/query-by-cpd.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-claimqueryby-cpddetails',
  templateUrl: './claimqueryby-cpddetails.component.html',
  styleUrls: ['./claimqueryby-cpddetails.component.scss']
})
export class ClaimquerybyCPDdetailsComponent implements OnInit {
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
  getid: any
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
  constructor(private service: QueryByCpdService, public headerService: HeaderService, private activatedRoute: ActivatedRoute, public router: Router, private SnoCLaimDetailsServ: SnoCLaimDetailsService,private sessionService: SessionStorageService) {
  }
  ngOnInit(): void {
    this.dataCpd = JSON.parse(localStorage.getItem("actionDataforcpd"));
    this.hospitalNav = localStorage.getItem("hospitalNav");
    this.getid = this.dataCpd.claimID;
    this.headerService.setTitle('Claims Queried by CPD');
    this.headerService.isIndicate(false);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.OngetFalsebackbutton();
    this.claimedQueryBySNOdetails();
    $("#appealDisposal").hide();
  }
  claimedQueryBySNOdetails() {
    var claimID = this.getid;
    this.service.getDetails(claimID).subscribe((data: any) => {
      this.userdetails = data[0];
      let procedureName = this.userdetails.procedureName1;
      if (procedureName.length > 40) {
        $('#procedureNameId').text(procedureName.substring(0, 40) + '...');
        $('#showMoreId').empty();
        $('#showMoreId').append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
      } else {
        $('#procedureNameId').text(procedureName);
      }
      for (let j = 1; j < data.length; j++) {
        this.claimLogforcpd.push(data[j]);
      }
    });
  }
  SubmitClaimRaise() {
    var transactiondetailsid = this.userdetails.transactiondetailsid;
    var actualdateofdischarge = this.dataCpd.actualdateofdischrge;
    var hospitalCode = this.userdetails.hospitalcode;
    var investicationdoc1 = this.selectedFile;
    var investicationdocforcpd2 = this.selectedFileinvestication;
    var urnno = this.userdetails.urn;
    var dateofadmissio = this.userdetails.dateofadmission;
    var ClaimId = this.userdetails.claimid;
    var ClaimAmount = this.userdetails.currenttotalamount;
    this.user = this.sessionService.decryptSessionData("user");
    var actionby = this.user.userId;
    let dischrageslip = this.userdetails.dischargeslip;
    let additionaldocs = this.userdetails.addtional_doc;
    let PreSurgerypic = this.userdetails.presurgeryphoto;
    let PostSurgerypic = this.userdetails.postsurgeryphoto;
    let intrasurgerypic = this.userdetails.intra_surgery_photo;
    let specimenremoval = this.userdetails.specimen_removal_photo;
    let patientpic = this.userdetails.patient_photo;
    if (investicationdoc1 == undefined || investicationdoc1 == null || investicationdoc1 == "") {
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
    if (investicationdocforcpd2 == undefined) {
      investicationdocforcpd2 = "";
    }
    if (dischrageslip == undefined) {
      dischrageslip = "";

    } if (additionaldocs == undefined) {
      additionaldocs = "";

    } if (PreSurgerypic == undefined) {
      PreSurgerypic = "";
    }
    if (intrasurgerypic == undefined) {
      intrasurgerypic = "";
    }
    if (specimenremoval == undefined) {
      specimenremoval = "";
    }
    if (patientpic == undefined) {
      patientpic = "";
    }
    if (PostSurgerypic == undefined) {
      PostSurgerypic = "";
    }
    Swal.fire({
      title: 'Are you sure?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        const Data = new FormData();
        Data.append('transactiondetailsid', transactiondetailsid);
        Data.append('actualdateofdiscahrge', actualdateofdischarge);
        Data.append('hospitalCode', hospitalCode);
        Data.append('investicationdoc1', investicationdoc1);
        Data.append('investicationdocforcpd2', investicationdocforcpd2);
        Data.append('urnno', urnno);
        Data.append('dateofadmissio', dateofadmissio);
        Data.append('ClaimId', ClaimId);
        Data.append('ClaimAmount', ClaimAmount);
        Data.append('actionby', actionby);
        Data.append('dischrageslip', dischrageslip);
        Data.append('additionaldocs', additionaldocs);
        Data.append('PreSurgerypic', PreSurgerypic);
        Data.append('PostSurgerypic', PostSurgerypic);
        Data.append('intrasurgerypic', intrasurgerypic);
        Data.append('specimenremoval', specimenremoval);
        Data.append('patientpic', patientpic);
        this.service.queryclaimRequest(Data).subscribe(data => {
          if (data.status == "Success") {
            this.swal("Success", data.message, "success");
            if (this.hospitalNav == 'N') {
              this.router.navigate(['/application/claimQueryByCPD']);
            } else {
              localStorage.setItem("status", JSON.stringify("true"));
              this.router.navigate(['/application/claimquerybycpd']);
            }
          } else if (data.status == "Failed") {
            this.swal("Error", data.message, "error");
            localStorage.setItem("status", JSON.stringify("true"));
          }
        })
      }
    })
  }
  OncancelClaimRAise() {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.swal('error', 'Cancel Process Canceled', 'error');
        this.router.navigate(['/application/claimquerybycpd']);
      }
    })

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
  downloadActionforDischarge(event: any, fileName: any, hCode: any, dateOfAdm: any) {
    let target = event.target;
    if ((target.nodeName == "A" || target.nodeName == "a") || (target.nodeName == "IMG" || target.nodeName == "img") || (target.nodeName == "I" || target.nodeName == "i")) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (fileName != null) {
        this.SnoCLaimDetailsServ.downloadFiles(fileName, hCode, dateOfAdm).subscribe(
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
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  modalClose() {
    $("#appealDisposal").hide();
  }
  viewDescription(descriptinDtls) {
    this.dtls = descriptinDtls;
    $("#appealDisposal").show();
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

  showProcedureName() {
    $('#procedureNameId').text(this.userdetails.procedureName1);
    $('#showMoreId').empty()
    $('#showMoreId1').append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hideProcedureName() {
    let procedureName = this.userdetails.procedureName1;
    if (procedureName.length > 40) {
      this.procedureNameStatus = true;
      $('#procedureNameId').text(procedureName.substring(0, 40) + '...');
      $('#showMoreId1').empty()
      $('#showMoreId').empty();
      $('#showMoreId').append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

}
