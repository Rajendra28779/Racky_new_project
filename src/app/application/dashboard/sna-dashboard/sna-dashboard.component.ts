import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import * as Highcharts from 'highcharts';
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { NotificationService } from '../../Services/notification.service';
import { ReportcountService } from '../../Services/reportcount.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import {data} from "jquery";
import {DatePipe} from "@angular/common";
import { SessionStorageService } from 'src/app/services/session-storage.service';
// HighchartsMore(Highcharts);
// HighchartsSolidGauge(Highcharts);
declare let $: any;
@Component({
  selector: 'app-sna-dashboard',
  templateUrl: './sna-dashboard.component.html',
  styleUrls: ['./sna-dashboard.component.scss'],
})
export class SnaDashboardComponent implements OnInit {
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
  totalCount: any;
  hospitalWiseTreatmentList: any = [];
  orderBy: any = 1;
  totalCountP: any;
  totalCountC: any;
  totalOthers: any;
  completePer: number = 0;
  pendingPer: number = 0;
  hospitalList: any = [];

  constructor(public headerService: HeaderService, public router: Router, private reportCount: ReportcountService, private datePipe: DatePipe,
    private notificationservice: NotificationService, private userService: SnocreateserviceService,private sessionService: SessionStorageService) {}

  // public ngAfterViewInit(): void {
  //   // this.createChartGauge();
  //   this.createChartPie();
  //   // this.createChartColumn();
  //   // this.createChartLine();
  // }

  // private getRandomNumber(min: number, max: number): number {
  //   return Math.floor(Math.random() * (max - min + 1) + min);
  // }

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
    // this.months = [
    //   { monthId: '01', monthName: 'JANUARY', index: 0 },
    //   { monthId: '02', monthName: 'FEBRUARY', index: 1 },
    //   { monthId: '03', monthName: 'MARCH', index: 2 },
    //   { monthId: '04', monthName: 'APRIL', index: 3 },
    //   { monthId: '05', monthName: 'MAY', index: 4 },
    //   { monthId: '06', monthName: 'JUNE', index: 5 },
    //   { monthId: '07', monthName: 'JULY', index: 6 },
    //   { monthId: '08', monthName: 'AUGUST', index: 7 },
    //   { monthId: '09', monthName: 'SEPTEMBER', index: 8 },
    //   { monthId: '10', monthName: 'OCTOBER', index: 9 },
    //   { monthId: '11', monthName: 'NOVEMBER', index: 10 },
    //   { monthId: '12', monthName: 'DECEMBER', index: 11 },
    // ];
    this.getMonth();
    this.getCountDetails();
    // this.getHospitalListClaimsNotVerified();

    this.searchFilter();
  }

  // private createChartPie(): void {
  //   let date = new Date();
  //   const data: any[] = [];

  //   for (let i = 0; i < 1; i++) {
  //     date.setDate(new Date().getDate() + i);
  //     data.push({
  //       name: `${date.getDate()}/${date.getMonth() + 1}`,
  //       y: this.getRandomNumber(0, 1000),
  //     });
  //   }

  //   const chart = Highcharts.chart('chart-pie', {
  //     chart: {
  //       plotBackgroundColor: null,
  //       plotBorderWidth: null,
  //       plotShadow: false,
  //       type: 'pie',
  //       width: 160,
  //       height: 150,
  //     },
  //     title: {
  //       text: '',
  //       align: 'top',
  //     },
  //     credits: {
  //       enabled: false,
  //     },
  //     tooltip: {
  //       pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
  //     },
  //     accessibility: {
  //       point: {
  //         valueSuffix: '%',
  //       },
  //     },
  //     plotOptions: {
  //       pie: {
  //         allowPointSelect: true,
  //         cursor: 'pointer',
  //         colors: ['#ECA00D', '#1f723f'],
  //         dataLabels: {
  //           enabled: false,
  //         },
  //         //showInLegend: true
  //       },
  //     },

  //     series: [
  //       {
  //         type: 'pie',
  //         data: [1, 2],
  //         lineWidth: 5,
  //         threshold: 99,
  //         step: 'center',
  //         color: ['#ECA00D', '#1f723f'],
  //       },
  //     ],
  //   } as any);

  //   // setInterval(() => {
  //   //   date.setDate(date.getDate() + 1);
  //   //   chart.series[0].addPoint({
  //   //     name: `${date.getDate()}/${date.getMonth() + 1}`,
  //   //     y: this.getRandomNumber(0, 1000),
  //   //   }, true, true);
  //   // }, 1500);
  // }

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
    this.router.navigateByUrl('/application/userprofile');
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
    this.reportCount.getSnaDashboardReport(requestData).subscribe(
      (data) => {
        this.claimCount = data;
        console.log(this.claimCount);
        this.totalCount = this.claimCount.fresh + this.claimCount.querycomplied + this.claimCount.query + this.claimCount.approve + this.claimCount.reject + this.claimCount.autoapprove + this.claimCount.autoreject +this.claimCount.expired + this.claimCount.cancelled;
        this.totalCountP = this.claimCount.fresh + this.claimCount.querycomplied;
        this.totalCountC = this.claimCount.approve + this.claimCount.reject + this.claimCount.autoapprove + this.claimCount.query + this.claimCount.autoreject + this.claimCount.expired + this.claimCount.cancelled;
        this.totalOthers =  this.claimCount.autoapprove + this.claimCount.autoreject + this.claimCount.expired + this.claimCount.cancelled;
        this.pendingPer = ((this.totalCountP)/this.totalCount) * 100
        this.completePer = ((this.totalCountC)/this.totalCount) * 100
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
    this.searchFilter();
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
      if(respnse.status == "success"){
        this.list = respnse.data;
      }
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

  getHospitalListClaimsNotVerified() {
    this.notificationservice.getHospitalListClaimsNotVerified(this.user.userId, 0, 60).subscribe((response) => {
        if (response.statusCode == 200 && response.status == 'success') {
          this.hospitalList = response.data;
          if (this.hospitalList.length > 0) {
            // $('#modalButton').click();
            sessionStorage.removeItem('data');
          }
        }
    }, (error) => {
      console.log(error);
    });
  }

  getPendingClaimsOfHospital(hospitalCode: any, actionCode: any, days: any) {
    let data = {
      userId: this.user.userId,
      hospitalCode: hospitalCode,
      actionCode: actionCode,
      days: days
    }
    sessionStorage.setItem('data', btoa(JSON.stringify(data)));
    $('#closeModal').click();

    this.router.navigate(['/pendingHospitalClaims']);
  }

  searchFilter() {
    this.hospitalWiseTreatmentList = [];

  const fromDate = this.datePipe.transform(new Date(this.year, this.month - 1, 1), 'dd-MMM-yyyy');
  const endDate = this.datePipe.transform( new Date(this.year, this.month, 0), 'dd-MMM-yyyy');

    let data = {
      userId: this.user.userId,
      orderBy: this.orderBy,
      fromDate: fromDate,
      toDate: endDate
    }

    this.userService.getHospitalWiseTreatment(data).subscribe((response: any) => {
      if (response.statusCode === 200 && response.status === 'success') {
        this.hospitalWiseTreatmentList = response.data;
        if (this.hospitalWiseTreatmentList.length == 0)
          console.log('No data found');
      }else
        console.log(response.message)
    }, error => {
      console.log(error.message)
    });
  }

  changeOrderBy() {
    this.orderBy = this.orderBy === 1 ? 0 : 1;
    $('#orderBySpan').toggleClass('bi-arrow-down bi-arrow-up');
    this.searchFilter();
  }
}
