import { Component, OnInit } from '@angular/core';
import { ClaimsqueriedbySNOServive } from '../../Services/claimsqueriedbySNO.service';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-oldclaimquerybysnadetails',
  templateUrl: './oldclaimquerybysnadetails.component.html',
  styleUrls: ['./oldclaimquerybysnadetails.component.scss']
})
export class OldclaimquerybysnadetailsComponent implements OnInit {

  msg: string;
  urlPreSurgery: any = "./assets/img/male-profile.jpg";
  urlPostSurgery: any = "./assets/img/male-profile.jpg";
  URN: any;
  userdetailsByid: any;
  mimeType?: FileList;
  fileToUpload?: FileList;
  TreatmentDetails?: FileList;
  file?: FileList;
  postdetails?: FileList;
  predetails?: FileList;
  claimlist: any = [];
  actResponse: any = [];
  getClaimid: any;
  user: any;
  // patientName:any
  AdditionalDocuments: any;
  AdditionalDocument1s: any;
  selectedFile: any;
  selectedFileDocument: any;
  AdditionalDocument1Exists: any = false
  userName: any;
  claimLog: Array<any> = [];
  documentType: any
  childmessage: any;
  dtls: any;
  dataSno:any
  hospitalNav: string;
  constructor(private service: ClaimsqueriedbySNOServive, public router: Router, public headerService: HeaderService, private SnoCLaimDetailsServ: SnoCLaimDetailsService, private sessionService: SessionStorageService) {
  }
  ngOnInit() {
    this.dataSno = JSON.parse(localStorage.getItem("actionDataforsno")); 
    this.hospitalNav=localStorage.getItem("hospitalNav");
    this.getClaimid=this.dataSno.claimid;
    this.headerService.setTitle('Old Claims Queried by SNA');
    this.headerService.isIndicate(false);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.OngetFalsebackbutton();
    this.claimedQueryBySNOdetails();
    $("#appealDisposal").hide();
  }
  claimedQueryBySNOdetails() {
    var id = this.getClaimid;
    this.service.getOldDetails(id).subscribe((data: any) => {
      console.log(data[0])
      this.userdetailsByid = data[0];
      for (let j = 1; j < data.length; j++) {
        this.claimLog.push(data[j]);
        console.log("okk")
      }
    });
  }
  downloadActionforDischarge(event: any, fileName: any, hCode: any, dateOfAdm: any) {
    let target = event.target;
    //console.log(target.nodeName);
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
            console.log(error);
          }
        );
      }
    }
  }
  downloadAction(event: any, fileName: any, hCode: any, dateOfAdm: any) {
    let target = event.target;
    //console.log(target.nodeName);
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
        // let img = this.snoService.downloadFile(fileName, hCode, dateOfAdm);
        // window.open(img, '_blank');
        this.SnoCLaimDetailsServ.downloadFiles(fileName, hCode, dateOfAdm).subscribe(
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
  OlddownloadAction(event: any, fileName: any, hCode: any, year: any) {
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
        this.SnoCLaimDetailsServ.downloadOldFiles(fileName, hCode, year).subscribe(
          (response: any) => {
            var result = response;
            let blob = new Blob([result],{ type: result.type});
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
  length: any;
  filename :String ='';
  AdditionalDocumentfilename:any;
  AdditionalDocument(files: any) {
    this.AdditionalDocuments = files.target.files;
    $("#additionapicid").css("border-color", "green");
    for (var i = 0; i < this.AdditionalDocuments.length; i++){ 
      var filename = files.target.files[0];
      var extension = filename.name.split('.').pop();
      this.AdditionalDocumentfilename=filename.name.split('.').shift();
    }
    var allowedExtensions =/(\jpg|\jpeg|pdf)$/i;
    if (!allowedExtensions.exec(extension)) {
      this.swal('Warning', 'DOCX, DOC, EXE is Not allowed', 'warning');
      $("#additionapicid").css("border-color", "red");
      $('#ADD').val('');
      this.filename = "Select a file to upload";
      this.selectedFile=null;
      return;
  }else
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
    console.log(this.selectedFile);
  }
  lengthadd1: any;
  filenameadd1 :String ='';
  AdditionalDocument1filename:any;
  AdditionalDocument1(files: any) {
    this.AdditionalDocument1s = files.target.files;
    $("#add1pic").css("border-color", "green");
    for (var i = 0; i < this.AdditionalDocument1s.length; i++){ 
      var filename = files.target.files[0];
      var extension = filename.name.split('.').pop();
      this.AdditionalDocument1filename=filename.name.split('.').shift();
    }
    var allowedExtensions =/(\jpg|\jpeg|pdf)$/i;
    if (!allowedExtensions.exec(extension)) {
      this.swal('Warning', 'DOCX, DOC, EXE is Not allowed', 'warning');
      $("#add1pic").css("border-color", "red");
      $('#ADDC').val('');
      this.filenameadd1 = "Select a file to upload";
      this.selectedFileDocument=null;
      return;
  }else
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
  reClaimRaiseRequest() {
    var claimId = this.userdetailsByid.transactiondetailsid;
    this.userName = this.sessionService.decryptSessionData("user");
    var hospitalCode = this.userdetailsByid.hospitalcode;
    var Additionaldoc1 = this.selectedFile;
    var Additionaldoc2 = this.selectedFileDocument;
    var UrnNumber = this.userdetailsByid.URN;
    var dateofAdmission = this.userdetailsByid.dateofadmission;
    var transId = this.userdetailsByid.CLAIMID;
    var ClaimAmount = this.userdetailsByid.CURRENTTOTALAMOUNT;
    this.user = this.sessionService.decryptSessionData("user");
    var actionby = this.user.userId;
    if (Additionaldoc1 == undefined || Additionaldoc1 == null || Additionaldoc1 == "") {
      this.swal('Warning', 'Please Provide Additional Document Slip ', 'warning');
      return;
    }
    if(this.AdditionalDocumentfilename===this.AdditionalDocument1filename){
      this.swal('Warning', 'You Are Trying to Upload same Document Again ', 'warning');
      $("#add1pic").css("border-color", "red");
      $('#ADDC').val('');
      this.filenameadd1 = "Select a file to upload";
      this.selectedFileDocument = undefined;
      this.AdditionalDocument1filename="";
      return;
    }
    if (Additionaldoc2 == undefined) {
      Additionaldoc2="";
    }
    Swal.fire({
      title: 'Are you sure To Re-Claim?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        const Data = new FormData();
        Data.append('claimID', claimId);
        Data.append('userName', hospitalCode);
        Data.append('Additionaldoc1', Additionaldoc1);
        Data.append('Additionaldoc2', Additionaldoc2);
        Data.append('UrnNumber', UrnNumber);
        Data.append('dateofAdmission', dateofAdmission);
        Data.append('transId', transId);
        Data.append('ClaimAmount', ClaimAmount);
        Data.append('actionby', actionby);
        console.log(transId);
        this.service.queryOldclaimRequest(Data).subscribe(data => {
          if (data.status == "Success") {
            this.swal("Success", data.message, "success");
            localStorage.setItem("status", JSON.stringify("true"));
            this.router.navigate(['/application/oldclaimQueriedBySNA']);
          } else if (data.status == "Failed") {
            localStorage.setItem("status", JSON.stringify("true"));
            this.swal("Error", data.message, "error");
          }
        })
      }
    })
  }
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
  downloadfilehospitallbillforadd2() {
    if (this.selectedFileDocument) {
      const file: File | null = this.selectedFileDocument;
      console.log(this.selectedFileDocument);
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
  queryclaimRequest() {
    Swal.fire({
      title: 'Are you sure?',
      // text: "You Want To Re-Claim!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
    this.swal('error', 'Cancel Process Canceled', 'error');
    this.router.navigate(['/application/claimsqueriedbySNO']);
      }
    })
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
}
