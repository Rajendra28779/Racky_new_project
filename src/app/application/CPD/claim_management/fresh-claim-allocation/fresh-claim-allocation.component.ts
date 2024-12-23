import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/application/header.service';
import { FreshCaseAllocationService } from 'src/app/application/Services/freshcaseallocation.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fresh-claim-allocation',
  templateUrl: './fresh-claim-allocation.component.html',
  styleUrls: ['./fresh-claim-allocation.component.scss'],
})
export class FreshClaimAllocationComponent implements OnInit {
  user: any;
  allocateCaseList: any = [];
  isDisableBtn: boolean = false;
  show: boolean = false;
  constructor(
    public headerService: HeaderService,
    private sessionService: SessionStorageService,
    public allocateService: FreshCaseAllocationService,
    public route: Router,
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Fresh Allocation');
    this.user = this.sessionService.decryptSessionData('user');
    localStorage.removeItem('actionData')
    this.getSnoClaimDetails();
    setInterval(() => this.formatTime(null), 1000);
  }
  allocateCase() {
    let reqData = {
      userId: this.user.userId,
    };
    Swal.fire({
      title: '',
      text: 'Do you want to Allocate?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.allocateService.allocationRequest(reqData).subscribe(
          (data: any) => {
            if (data.status == 'Success') {
              this.swal('Info', data.message, 'info');
              this.getSnoClaimDetails();
            } else if (data.status == 'Failed') {
              this.swal('Error', data.message, 'error');
            }
          },
          (error) => {
            console.log(error);
            this.swal('', 'Something went wrong', 'error');
          }
        );
      } else {
      }
    });
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  responseData: any;
  leftTime: any;
  takenTime: any;
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
            this.takenTime = new Date(this.allocateCaseList[0].actionBy);
            let date =this.takenTime;
            const currentDate = new Date();
            const timeDifference = date.getTime() - currentDate.getTime();
            this.formatTime(date);
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
  formatTime(date) {
    const currentDate = new Date();
    let difference;
    if (date != null && date!= "" && date != undefined) {
      difference = date.getTime() - currentDate.getTime();
    }else{
      difference = this.takenTime.getTime() - currentDate.getTime();
    }
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    this.leftTime = `${hours}h ${minutes}m ${seconds}s`;
    if(hours == 0 && minutes == 0 && seconds == 0){
      window.location.reload();
    }
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
}
