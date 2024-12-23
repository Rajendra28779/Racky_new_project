import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { PartiallfloatserviceService } from '../../Services/partiallfloatservice.service';

@Component({
  selector: 'app-partial-claim-dc-details',
  templateUrl: './partial-claim-dc-details.component.html',
  styleUrls: ['./partial-claim-dc-details.component.scss']
})
export class PartialClaimDcDetailsComponent implements OnInit {

  claimDetails:any;
  preAuth:any=[];
  claimLog:any=[];
  paymentData:any;
  partialactionlist:any=[];
  cardBalanceDetails:any;
  maxChars:any=1000;
  fileToUpload:any='';
  claimdata:any;
  user:any;
  claimId:any;
  transactionId:any;
  urn:any;
  childmessage:any;
  status:any;
  hideaction:any= false;

  constructor(private sessionService: SessionStorageService,
    public headerService: HeaderService,
    public partialclaimserv:PartiallfloatserviceService,
    public snoService: SnoCLaimDetailsService,
    private route:Router) {
    this.claimdata = this.route.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.headerService.setTitle("DC Approval");
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.isBack(false);
    if(this.claimdata){
      this.claimId=this.claimdata.claimId;
      this.transactionId=this.claimdata.transactionId;
      this.urn=this.claimdata.urn;
      this.status=this.claimdata.status;
      if(this.status == 1){
        this.hideaction=false;
      }else if(this.status == 2){
        this.hideaction=true;
      }
      this.getclaimdetails();
    }else{
      this.swal("Warning", "No Claim Data Found","warning");
      return;
    }
  }

  getclaimdetails(){
    this.partialclaimserv.getpartialclaimdetailsdc(this.transactionId,this.claimId,this.urn).subscribe(
      (data: any) => {
      if(data.status==200){
        this.claimDetails = data.claimdata;
        let procedureName = this.claimDetails.procedureName;
        if(procedureName!=null){
          if (procedureName.length > 30) {
            $('#procedureNameId').text(procedureName.substring(0, 30) + '...');
            $('#showMoreId').empty();
            $('#showMoreId').append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
          } else {
            $('#procedureNameId').text(procedureName);
          }
        }else{
          $('#procedureNameId').text("N/A");
        }
        this.claimLog = data.actionlog;
        this.cardBalanceDetails = data.cardbalance;
        this.preAuth = data.preauthlog;
        this.paymentData = data.paymentData;
        this.partialactionlist=data.partialactionlist;


      } else {
        this.swal('', 'Something went wrong.', 'error');
      }
    },(error) => {
      this.swal('', 'Something went wrong.', 'error');
      }
    );
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  showProcedureName() {
    $('#procedureNameId').text(this.claimDetails.procedureName);
    $('#showMoreId').empty()
    $('#showMoreId1').append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hideProcedureName() {
    let procedureName = this.claimDetails.procedureName;
    if (procedureName.length > 30) {
      $('#procedureNameId').text(procedureName.substring(0, 30) + '...');
      $('#showMoreId1').empty()
      $('#showMoreId').empty();
      $('#showMoreId').append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  handleFileInput(event:any){
    let file = event.target.files[0];
    if (file != null || file != undefined) {
      let extension = file.name.split('.').pop();
      let allowedExtensions = /^(pdf|jpg|jpeg)$/i;
      if (!allowedExtensions.exec(extension)){
        this.swal("Warning", "Only .pdf, .jpg, .jpeg File Are Allowed!","warning");
        return;
      }
      if (Math.round(file.size / 1024) >= 8192) {
        this.swal('Warning', ' Please Provide Document Size Less than 8MB', 'warning');
        return;
      } else {
        this.fileToUpload = event.target.files[0];
      }
    }
  }

  viewdoc(){
    let filedoc:any=this.fileToUpload;
    if (filedoc !="") {
      const file: File | null = filedoc;
      if (file) {
        let documentType = file.type;
        const blob = new Blob([file], { type: documentType });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    } else {
      this.swal('Info', 'Please Select File', 'info');
    }
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }



  OncancelClaimRAise(){
    Swal.fire({
      title: 'Are you sure?',
      text: "You Want to Cancel It ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Cancel it!',
      cancelButtonText: 'Exit',
    }).then((result) => {
      if (result.isConfirmed) {
        this.route.navigate(['/application/dcPartialClaim']);
      }
    });
  }

  documnetname: any = [];
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
      if (fileName != null) {
        this.snoService.downloadFiles(fileName, hCode, dateOfAdm).subscribe(
          (response: any) => {
            let result = response;
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
    $('#appealDisposal').show();
  }

  modalClose() {
    $('#appealDisposal').hide();
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  SubmitClaimRaise(){
    let remarks:any=$('#remarks').val();

    if(this.fileToUpload==null || this.fileToUpload==''|| this.fileToUpload==undefined){
      this.swal('Warning', 'Please Upload Document', 'warning');
      return;
    }
    if(remarks==null || remarks==''|| remarks==undefined){
      this.swal('Warning', 'Please Enter Remark', 'warning');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You Want to Submit It ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Submit it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const formData: FormData = new FormData();
        formData.append('hospitalCode', this.claimDetails?.hospitalCode) ;
        formData.append('file', this.fileToUpload) ;
        formData.append('claimId', this.claimId) ;
        formData.append('remark', remarks) ;
        formData.append('userId', this.user.userId) ;
        formData.append('urn', this.urn) ;
        formData.append('dateofdadm', this.claimDetails?.actualdateofadmission) ;
        this.partialclaimserv.dcpartialclaimsubmit(formData).subscribe((data:any)=>{
          if(data.status==200){
            this.swal('Success', 'Claim Submitted Successfully.', 'success');
            this.route.navigate(['/application/dcPartialClaim']);
          } else {
            this.swal('Error', 'Something went wrong.', 'error');
          }
        });
      }
    });
  }

}
