import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { NotificationService } from '../../Services/notification.service';
import { ReportcountService } from '../../Services/reportcount.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import {DatePipe} from "@angular/common";
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $:any;

@Component({
  selector: 'app-shasceo-dashboard',
  templateUrl: './shasceo-dashboard.component.html',
  styleUrls: ['./shasceo-dashboard.component.scss']
})
export class ShasceoDashboardComponent implements OnInit {
  month:any;
  monthname:any;
  year:any;
  user:any;
  notice:any=[];
  mobileformat=/[6-9][0-9]{9}$/;
  hospitalWiseTreatmentList:any=[];
  monthsarr:any = [ "","January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  constructor(public headerService: HeaderService, public router: Router, private reportCount: ReportcountService, private datePipe: DatePipe,
    private notificationservice: NotificationService, private userService: SnocreateserviceService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Dashboard');
    this.user = this.sessionService.decryptSessionData("user");
    let Mobile=this.user.phone;

    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
      maxDate: new Date(),
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

    let date = new Date();
    this.month = date.getMonth()+1;
    this.monthname=this.monthsarr[this.month];
    this.year = date.getFullYear();
    this.notification();

    if (Mobile==null || Mobile== "" || Mobile==undefined || !(Mobile.toString()).match(this.mobileformat)){
      Swal.fire({
        title: 'Kindly Add/Correct Your Mobile Number',
        text: "",
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigateByUrl('/application/userprofile');
        }
      });
    }
  }

  notification(){
    let groupid=this.user.groupId;
    this.notificationservice.getnotification(groupid).subscribe((respnse: any)=>{
      if(respnse.status == "success"){
        this.notice = respnse.data;
      }
    })
  }

  getCountDetails(){

  }

  changeOrderBy(){

  }

}
