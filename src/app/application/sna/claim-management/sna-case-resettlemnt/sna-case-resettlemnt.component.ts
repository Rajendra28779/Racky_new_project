import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/application/header.service';
import { FreshCaseAllocationService } from 'src/app/application/Services/freshcaseallocation.service';
import { HospitalPackageMappingService } from 'src/app/application/Services/hospital-package-mapping.service';
import { SnoCLaimDetailsService } from 'src/app/application/Services/sno-claim-details.service';
import { SnoFressClaimApprovalService } from 'src/app/application/Services/sno-fress-claim-approval.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
declare let $: any;
@Component({
  selector: 'app-sna-case-resettlemnt',
  templateUrl: './sna-case-resettlemnt.component.html',
  styleUrls: ['./sna-case-resettlemnt.component.scss']
})
export class SnaCaseResettlemntComponent implements OnInit {

  show: boolean = false;
  user: any;
  isDisableBtn: boolean = false;
  allocateCaseList: any = [];
  responseData: any;

  fromDate: any;
  toDate: any;

  stateData: any = [];
  statusCPD: any = 0;
  stateId:any;
  distId:any;
  hospitalId:any;
  authMode:any;
  amountFlag:any;
  mortality:any;
  highend:any;
  searchtype:any;
  filter:any;
  trigger:any;
  implant:any;
  wardList:any;
  packageList:any;
  description:any;
  currentPage: any = 1;
  pageElement: any = 100;
  elementTo: any;
  record1: any;
  showPagination: boolean;

  constructor(    
    public headerService: HeaderService,
    private sessionService: SessionStorageService,
    public allocateService: FreshCaseAllocationService,
    public route: Router,
   public snoClaimApprovalService:SnoFressClaimApprovalService,
   public encryptedService:EncryptionService,
   public snoService: SnoCLaimDetailsService,
   private hospitalService: HospitalPackageMappingService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('SNA Case Resettlement');
    this.user = this.sessionService.decryptSessionData('user');
    localStorage.removeItem('actionData');

    this.fromDate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();


    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });

    this.fromDate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();

    let reqData={
      userId:this.user?.userId,
      fromDate:this.fromDate,
      toDate:this.toDate,
      caseNo:''
    };

    this.getClaimSnaReSettelmentCase(reqData);
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  onAction(id: any, urn: any, caseNo: any) {
    let state = {
      caseId: id,
      urn: urn,
      caseNo: caseNo,
    };
    localStorage.setItem('actionData', JSON.stringify(state));
    this.route.navigate(['/application/snaCaseResettlementDeatils']);
  }

  getClaimSnaReSettelmentCase(reqData:any){
    reqData= this.encryptedService.encryptRequest(reqData);
    this.snoClaimApprovalService.getSNAReSettelmemtCase(reqData).subscribe(
      (data: any) => {
        if(data.length >0){
         this.allocateCaseList=data;
         this.record1 = this.allocateCaseList.length;
         this.showPagination=true;
         this.show=true;
        }else{
          this.showPagination=false;
          this.allocateCaseList=[];
          this.show=false;
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong', 'error');
        this.showPagination=false;
        this.allocateCaseList=[];
        this.show=false;
      }
    );
  }

  getSnoClaimDetails() {
    let userId = this.user.userId;
    let requestData = {
      userId: userId,
    };
    this.allocateService.getCPDAllocateCase(requestData).subscribe(
      (response) => {
        this.responseData = response;
        if (this.responseData.status == 'success') {
          this.allocateCaseList = this.responseData.data;
          if (this.allocateCaseList.length != 0) {

            this.show = true;
            this.isDisableBtn = true;
          } else {
            this.show = false;
            this.isDisableBtn = false;
          }
        } else {
          this.swal('Error', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }

  onClickSearch(){

    this.fromDate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    let caseNo=$('#caseNo').val();

    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('Info', ' From Date should be less than To Date', 'info');
      return;
    }

    
    let reqData={
      userId:this.user?.userId,
      fromDate:this.fromDate,
      toDate:this.toDate,
      caseNo:caseNo
    };

  this.getClaimSnaReSettelmentCase(reqData);

  }
  ResetField(){
    window.location.reload();
  }



  pageItemChange() {
    this.currentPage = 1;
    if ((<HTMLInputElement>document.getElementById("pageItem")).value == "All") {
      this.pageElement = this.record1;
      this.elementTo = this.record1;
    }
    else {
      this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
      this.elementTo = this.pageElement;
      if (this.record1 < this.elementTo) this.elementTo = this.record1;
    }
  }

  pageChange(current:any) {
    this.currentPage = current;
    let total = this.currentPage * this.pageElement;
    let istotal = this.compare(total, this.record1);
    if (istotal) this.elementTo = total;
    else this.elementTo = this.record1;

  }

  compare(first: number, second: number) {
    if (first > second)
     return false;
    else return true;
  }

}
