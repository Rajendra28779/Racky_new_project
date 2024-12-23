import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/application/header.service';
import { FreshCaseAllocationService } from 'src/app/application/Services/freshcaseallocation.service';
import { SnoFressClaimApprovalService } from 'src/app/application/Services/sno-fress-claim-approval.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-sna-cpd-investigatedlist',
  templateUrl: './sna-cpd-investigatedlist.component.html',
  styleUrls: ['./sna-cpd-investigatedlist.component.scss']
})
export class SnaCpdInvestigatedlistComponent implements OnInit {

  user: any;
  allocateCaseList: any = [];
  fromDate: any;
  toDate: any;
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount: any = 0;
  txtsearchDate:any;


  constructor(
    public headerService: HeaderService,
    private sessionService: SessionStorageService,
    public allocateService: FreshCaseAllocationService,
    public route: Router,
   public snoClaimApprovalService:SnoFressClaimApprovalService,
   public encryptedService:EncryptionService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('CPD Investigate Case');
    this.user = this.sessionService.decryptSessionData('user');

    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      minDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'YYYY-MM-DD LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('input[name="todate"]').attr('placeholder', 'To Date *');
    // this.getClaimCPDApprovalCase(reqData);
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
    this.route.navigate(['/application/cpdfreshcasedetails']);
  }

  getClaimCPDApprovalCase(){
    this.fromDate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    this.snoClaimApprovalService.getCPDinvestigateCase(this.fromDate,this.toDate).subscribe(
      (data: any) => {
        if(data.status ==200){
         this.allocateCaseList=data;
         this.totalcount=this.allocateCaseList.length;
         if(this.totalcount>=0){
          this.pageElement=100;
          this.currentPage=1;
          this.showPegi=true;
         }else { this.showPegi=true;}
        }else{
          this.swal('', 'No Data Found', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong', 'error');
      }
    );
  }

  getSnoClaimDetails() {
    let userId = this.user.userId;
    let requestData = {
      userId: userId,
    };
    this.allocateService.getCPDAllocateCase(requestData).subscribe(
      (response:any) => {
        if (response.status == 'success') {
          this.allocateCaseList = response.data;
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

  reset(){
    window.location.reload();
  }

  downloadList(no:any){

  }
}
