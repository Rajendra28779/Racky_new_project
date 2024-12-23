import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { NotificationService } from '../../Services/notification.service';
import { ReportcountService } from '../../Services/reportcount.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-cpd-dashboard',
  templateUrl: './cpd-dashboard.component.html',
  styleUrls: ['./cpd-dashboard.component.scss']
})
export class CpdDashboardComponent implements OnInit {
  user:any;
  months: any = [];
  monthList: any = [];
  yearList: any = [];
  month: any;
  year: any;
  mobileformat=/[6-9][0-9]{9}$/;
  claimCount: any;
  date: any;
  list: any = [];

  constructor(public headerService: HeaderService, public router: Router, private reportCount: ReportcountService,
    private notificationservice: NotificationService, private userService: SnocreateserviceService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Dashboard');
    this.user = this.sessionService.decryptSessionData("user");
    let Mobile=this.user.phone;
    this.date = new Date();
    let monthId = this.date.getMonth()+1;
    let checkMonth = monthId.toString();
    if(checkMonth.length == 1) {
      this.month = '0'+ monthId;
    }else{
      this.month = monthId;
    }
    this.year = this.date.getFullYear();
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
          this.profile();
        }
      });
    }

    $('.selectpicker').selectpicker();

    $('.months').datetimepicker({
      format: 'MMM',
      // endDate: '0d',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.years').datetimepicker({
      format: 'YYYY',
      // endDate: '0d',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
      // onSelect: alert('date')
    });
    this.getMonth();
    this.getCountDetails();
  }

  getMonth() {
    this.userService.getMonths().subscribe(
      (response) => {
        this.months = response;
        console.log(this.months);
        this.userService.getYears().subscribe(
          (data) => {
            this.yearList = data;
            console.log(data);
            // for(var x=this.year;x>=1990;--x) {
            //   this.yearList.push(x);
            // }
            this.monthList = [];
            for(var i=0;i<this.months.length;i++) {
              if(this.year == this.date.getFullYear()) {
                if(this.months[i].index<=this.date.getMonth()) {
                  this.monthList.push(this.months[i]);
                }
              } else {
                this.monthList.push(this.months[i]);
              }
            }
          },
          (error) => console.log(error)
        )
      },
      (error) => console.log(error)
    )
  }

  profile() {
    this.router.navigateByUrl('/application/cpdprofile');
  }

  getCountDetails() {
    this.monthList = [];
    for(var i=0;i<this.months.length;i++) {
      if(this.year == this.date.getFullYear()) {
        if(this.months[i].index<=this.date.getMonth()) {
          this.monthList.push(this.months[i]);
        }
      } else {
        this.monthList.push(this.months[i]);
      }
    }

    if(this.year == this.date.getFullYear()) {
      if(parseInt(this.month)-1>this.date.getMonth()) {
        let monthId = this.date.getMonth()+1;
        let checkMonth = monthId.toString();
        if(checkMonth.length == 1) {
          this.month = '0'+ monthId;
        }else{
          this.month = monthId;
        }
      }
    }

    let userId = this.user.userId;
    let month = this.month;
    let year = this.year;

    this.claimCount = '';
    let requestData = {
      userId: userId,
      month: month,
      year: year
    };
    console.log('req:')
    console.log(requestData);
    this.reportCount.getCpdDashboardReport(requestData).subscribe(
      (data) => {
        this.claimCount = data;
        console.log("CPD Dashboard Report:");
        console.log(this.claimCount);
        // if (this.claimCount.freshCountPending > 0) {
        //   Swal.fire({
        //     title: 'You Have ' + this.claimCount.freshCountPending + ' Pending Claims!',
        //     text: "Excluding This Month's Claims",
        //     icon: 'info',
        //   });
        // }
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
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

  notification(){
    let groupid=this.user.groupId;
    this.notificationservice.getnotification(groupid).subscribe((respnse: any)=>{
      if(respnse.status == "success")
        this.list = respnse.data;
    })
  }

  downlordnotification(event: any,docpath:any) {
    console.log('file: '+docpath);
    if (docpath != null && docpath != '' && docpath != undefined) {
      let img = this.notificationservice.downloadFile(docpath);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'There Is No File', 'info');
    }
  }

}
