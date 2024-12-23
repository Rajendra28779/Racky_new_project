import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { HeaderService } from '../../header.service';
import { ReportcountService } from '../../Services/reportcount.service';
import Swal from 'sweetalert2';
import { ThrowStmt } from '@angular/compiler';
declare let $: any;

@Component({
  selector: 'app-ceo-dashboard',
  templateUrl: './ceo-dashboard.component.html',
  styleUrls: ['./ceo-dashboard.component.scss'],
})
export class CeoDashboardComponent implements OnInit {
  currentPage: any;
  CustomScrollbarOptions: any;
  months: any = [];
  monthList: any = [];
  yearList: any = [];
  date: any;
  year: any;
  month: any;
  user: any;
  claimCount: any;

  constructor(
    public headerService: HeaderService,
    private userService: SnocreateserviceService,
    private sessionService: SessionStorageService,
    private reportCount: ReportcountService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Dashboard');
    this.user = this.sessionService.decryptSessionData('user');
    this.date = new Date();
    let monthId = this.date.getMonth() + 1;
    let checkMonth = monthId.toString();
    if (checkMonth.length == 1) {
      this.month = '0' + monthId;
    } else {
      this.month = monthId;
    }
    this.year = this.date.getFullYear();
    this.getMonth();

    this.createDonutEpanelment();
    // this.createDonutnew();
    // this.createDonutnew2();
    this.createDepartmentchart();
    this.createAuthenticatechart();
    this.createSpecialitychart();
    this.createProcedurechart();
    this.createGenderDetails();
    this.getCountDetails();
    this.getDischargeDetails();
    this.getAtttendanceReport();
  }

  private createDonutnew(): void {
    Highcharts.setOptions({
      colors: ['#F9CD5A', '#F9CD5A', '#F4714F'],
    });

    const chart = Highcharts.chart(
      'donutprice_chart' as any,
      {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          height: 112,
          margin: [-3, 0, 0, 0],
        },
        title: {
          text: '', // Modified title
          align: 'left',
        },

        credits: {
          enabled: false,
        },
        tooltip: {
          enabled: false, // Disable tooltip
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false, // Disable data labels
            },
            showInLegend: false, // Disable legend
          },
        },
        series: [
          {
            name: '',
            colorByPoint: true,
            depth: '40%',
            innerSize: '60%',
            data: [
              {
                name: 'NFSA',
                color: '#4AD991',
                y: 20,
              },
              {
                name: 'SFSA',
                color: '#F4714F',
                y: 20,
              },
              {
                name: 'Nabin',
                color: '#F9CD5A',
                y: 20,
              },
            ],
          },
        ],
      } as any
    );

    // Adjust chart size if needed
    function adjustChartSize() {
      // Additional size adjustments can be made here if necessary
    }

    // Call adjustChartSize on page load and window resize
    adjustChartSize();
    window.addEventListener('resize', adjustChartSize);
  }

  private createDonutnew2(): void {
    Highcharts.setOptions({
      colors: ['#F9CD5A', '#F9CD5A', '#F4714F'],
    });

    const chart = Highcharts.chart(
      'donutprice_chartnew' as any,
      {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          height: 112,
          margin: [-3, 0, 0, 0],
        },
        title: {
          text: '', // Modified title
          align: 'left',
        },

        credits: {
          enabled: false,
        },
        tooltip: {
          enabled: false, // Disable tooltip
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false, // Disable data labels
            },
            showInLegend: false, // Disable legend
          },
        },
        series: [
          {
            name: '',
            colorByPoint: true,
            depth: '40%',
            innerSize: '60%',
            data: [
              {
                name: 'NFSA',
                color: '#4AD991',
                y: 20,
              },
              {
                name: 'SFSA',
                color: '#F4714F',
                y: 20,
              },
              {
                name: 'Nabin',
                color: '#F9CD5A',
                y: 20,
              },
            ],
          },
        ],
      } as any
    );

    // Adjust chart size if needed
    function adjustChartSize() {
      // Additional size adjustments can be made here if necessary
    }

    // Call adjustChartSize on page load and window resize
    adjustChartSize();
    window.addEventListener('resize', adjustChartSize);
  }

  private createGenderDetails(): void {
    let date = new Date();
    const data: any[] = [];

    Highcharts.setOptions({
      colors: ['#01BAF2', '#71BF45', '#FAA74B'],
    });

    const chart = Highcharts.chart(
      'gender_chart' as any,
      {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          height: 310,
        },
        title: {
          text: '<h2 style="font-weight: bold; margin: 0; font-size: 1.6rem;">'+this.hosFamilyData?.totalMember+' </h2> <span style="color:#636363; font-weight:normal;">Total</span>',
          useHTML: true,
          align: 'center', // Center-align the title initially
          verticalAlign: 'middle', // Vertically center the title initially
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#000',
            fill: '000',
          },
        },
        legend: {
          enabled: true, // Enable the legend
          align: 'left', // Align legend to the center horizontally
          layout: 'horizontal', // Display legend items horizontally
          verticalAlign: 'bottom', // Align legend to the bottom
          itemMarginBottom: 4,
          itemStyle: {
            fontSize: '12px', // Set the font size
            fontWeight: 'normal',
          },
        },

        credits: {
          enabled: false,
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false,
              format: '<b>{point.name}</b>: {point.percentage:.0f}%', // Adjusted format
              style: {
                fontSize: '14px', // Adjust font size of data labels
                textOutline: '1px white', // Add text outline to data labels
              },
            },
            showInLegend: true,
          },
        },
        series: [
          {
            name: 'Composition',
            colorByPoint: true,
            depth: '30%',
            innerSize: '80%',

            data: [
              {
                name: 'Male :'+this.hosFamilyData?.totalMale, // Added "In Progress" text
                color: '#4AD991',
                y: this.hosFamilyData?.totalMale,
              },
              {
                name: 'Female :'+this.hosFamilyData?.totalFemale,
                color: '#FF9A75',
                y: this.hosFamilyData?.totalFemale,
              },
              {
                name: 'Other :'+this.hosFamilyData?.totalOthers,
                color: '#49AED4',
                y: this.hosFamilyData?.totalOthers,
              },
            ],
          },
        ],
      } as any
    );

    function adjustTitlePosition() {
      const screenWidth = window.innerWidth;

      if (screenWidth > 1440) {
        chart.setTitle({
          align: 'center',
          verticalAlign: 'middle',
          x: 0,
          y: -45,
          style: {
            textAlign: 'center',
          },
        });
      } else if (screenWidth < 1440) {
        chart.setTitle({
          align: 'center',
          verticalAlign: 'middle',
          x: 0,
          y: -45,
          style: {
            textAlign: 'center',
          },
        });
      } else {
        chart.setTitle({
          align: 'center',
          verticalAlign: 'middle',
          x: 0,
          y: -30,
          style: {
            textAlign: 'center',
          },
        });
      }

      if (screenWidth <= 1024) {
        chart.setTitle({
          align: 'center',
          verticalAlign: 'middle',
          x: 0,
          y: -20,
          style: {
            textAlign: 'center',
          },
        });
      }

      if (screenWidth <= 768) {
        chart.setTitle({
          align: 'center',
          verticalAlign: 'middle',
          x: 0,
          y: -5,
          style: {
            textAlign: 'center',
          },
        });
      }

      if (screenWidth <= 480) {
        chart.setTitle({
          align: 'center',
          verticalAlign: 'middle',
          x: 0,
          y: -40,
          style: {
            fontSize: '12px',
            textAlign: 'center',
          },
        });
      }

      if (screenWidth <= 375) {
        chart.setTitle({
          align: 'center',
          verticalAlign: 'middle',
          x: 0,
          y: -30,
          style: {
            fontSize: '12px',
            textAlign: 'center',
          },
        });
      }

      if (screenWidth <= 320) {
        chart.setTitle({
          align: 'center',
          verticalAlign: 'middle',
          x: 0,
          y: -35,
          style: {
            fontSize: '12px',
            textAlign: 'center',
          },
        });
      }
    }

    // Call adjustTitlePosition on page load and window resize
    adjustTitlePosition();
    window.addEventListener('resize', adjustTitlePosition);
  }
private createDonutEpanelment(): void {
    let date = new Date();
    const data: any[] = [];

    Highcharts.setOptions({
      colors: ['#01BAF2', '#71BF45', '#FAA74B'],
    });

    const chart = Highcharts.chart(
      'empanelment_chart' as any,
      {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          height: 310,
        },
        title: {
          text: '<h2 style="font-weight: bold; margin: 2; font-size: 1.6rem;">'+this.atndResponseData?.total+' </h2> <span style="color:#636363; font-weight:normal;"> Total <br> Member </span>',
          useHTML: true,
          align: 'center', // Center-align the title initially
          verticalAlign: 'middle', // Vertically center the title initially
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#000',
            fill: '000',
          },
        },
        legend: {
          enabled: true, // Enable the legend
          align: 'left', // Align legend to the center horizontally
          layout: 'horizontal', // Display legend items horizontally
          verticalAlign: 'bottom', // Align legend to the bottom
          itemMarginBottom: 4,
          itemStyle: {
            fontSize: '12px', // Set the font size
            fontWeight: 'normal',
          },
        },

        credits: {
          enabled: false,
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false,
              format: '<b>{point.name}</b>: {point.percentage:.0f}%', // Adjusted format
              style: {
                fontSize: '14px', // Adjust font size of data labels
                textOutline: '1px white', // Add text outline to data labels
              },
            },
            showInLegend: true,
          },
        },
        series: [
          {
            name: 'Composition',
            colorByPoint: true,
            depth: '30%',
            innerSize: '80%',

            data: [
              {
                name: 'Present :' + this.atndResponseData?.present,
                color: '#10b11c',
                y: this.atndResponseData?.present,
              },
              {
                name: 'Absent :'+this.atndResponseData?.absent,
                color: '#FF9A75',
                y: this.atndResponseData?.absent,
              },

            ],
          },
        ],
      } as any
    );

    function adjustTitlePosition() {
      const screenWidth = window.innerWidth;

      if (screenWidth > 1440) {
        chart.setTitle({
          align: 'center',
          verticalAlign: 'middle',
          x: 0,
          y: -45,
          style: {
            textAlign: 'center',
          },
        });
      } else if (screenWidth < 1440) {
        chart.setTitle({
          align: 'center',
          verticalAlign: 'middle',
          x: 0,
          y: -45,
          style: {
            textAlign: 'center',
          },
        });
      } else {
        chart.setTitle({
          align: 'center',
          verticalAlign: 'middle',
          x: 0,
          y: -30,
          style: {
            textAlign: 'center',
          },
        });
      }

      if (screenWidth <= 1024) {
        chart.setTitle({
          align: 'center',
          verticalAlign: 'middle',
          x: 0,
          y: -20,
          style: {
            textAlign: 'center',
          },
        });
      }

      if (screenWidth <= 768) {
        chart.setTitle({
          align: 'center',
          verticalAlign: 'middle',
          x: 0,
          y: -5,
          style: {
            textAlign: 'center',
          },
        });
      }

      if (screenWidth <= 480) {
        chart.setTitle({
          align: 'center',
          verticalAlign: 'middle',
          x: 0,
          y: -40,
          style: {
            fontSize: '12px',
            textAlign: 'center',
          },
        });
      }

      if (screenWidth <= 375) {
        chart.setTitle({
          align: 'center',
          verticalAlign: 'middle',
          x: 0,
          y: -30,
          style: {
            fontSize: '12px',
            textAlign: 'center',
          },
        });
      }

      if (screenWidth <= 320) {
        chart.setTitle({
          align: 'center',
          verticalAlign: 'middle',
          x: 0,
          y: -35,
          style: {
            fontSize: '12px',
            textAlign: 'center',
          },
        });
      }
    }

    // Call adjustTitlePosition on page load and window resize
    adjustTitlePosition();
    window.addEventListener('resize', adjustTitlePosition);
  }

  private createDepartmentchart(): void {
    let date = new Date();
    const data: any[] = [];

    const chart = Highcharts.chart(
      'department_chart' as any,
      {
        chart: {
          type: 'column',
        },
        title: {
          text: '', // Modified title
          align: 'left',
        },
        subtitle: {
          text: '',
          align: 'left',
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          categories: [
            'SHAS CEO',
            'SNA',
            // 'FINANCE',
            'JOINT CEO',
            'FO',
            'AUDITOR',
            'DEP.CEO',
          ],
          crosshair: true,
          labels: {
            style: {
              fontSize: '12px', // Set the font size here
            },
          },
          accessibility: {
            description: '',
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: '',
          },
        },
        tooltip: {
          valueSuffix: '',
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
          },
          series: {
            showInLegend: false,
          },
        },
        series: [
          {
            name: '',
            color: '#49AED4',
            data: this.floatData,//[5000, 6545, 4521, 5785, 9858, 7452],
          },
        ],
      } as any
    );
  }

  private createAuthenticatechart(): void {
    let date = new Date();
    const data: any[] = [];

    const chart = Highcharts.chart(
      'authenticate_chart' as any,
      {
        chart: {
          type: 'column',
        },
        title: {
          text: '', // Modified title
          align: 'left',
        },
        subtitle: {
          text: '',
          align: 'left',
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          categories: ['OTP', 'IRIS', 'FINGER', 'FACE'],
          crosshair: true,
          labels: {
            style: {
              fontSize: '12px', // Set the font size here
            },
          },
          accessibility: {
            description: '',
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: '',
          },
        },
        tooltip: {
          valueSuffix: '',
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
          },
          series: {
            showInLegend: false,
          },
        },
        series: [
          {
            name: '',
            color: '#F4714F',
            data: this.authData, //[5000, 6545, 8885, 4521],
          },
        ],
      } as any
    );
  }

  private createSpecialitychart(): void {
    let date = new Date();
    const data: any[] = [];

    const chart = Highcharts.chart(
      'speciality_chart' as any,
      {
        chart: {
          type: 'column',
        },
        title: {
          text: '', // Modified title
          align: 'left',
        },
        subtitle: {
          text: '',
          align: 'left',
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          categories: this.specialityCode,
          crosshair: true,
          labels: {
            style: {
              fontSize: '12px', // Set the font size here
            },
          },
          accessibility: {
            description: '',
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: '',
          },
        },
        tooltip: {
          valueSuffix: '',
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
          },
          series: {
            showInLegend: false,
          },
        },
        series: [
          {
            name: '',
            color: '#D8AE4B',
            data: this.specialityAmount,
          },
        ],
      } as any
    );
  }

  private createProcedurechart(): void {
    let date = new Date();
    const data: any[] = [];

    const chart = Highcharts.chart(
      'procedure_chart' as any,
      {
        chart: {
          type: 'column',
        },
        title: {
          text: '', // Modified title
          align: 'left',
        },
        subtitle: {
          text: '',
          align: 'left',
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          categories: this.procedureCode,
          crosshair: true,
          labels: {
            style: {
              fontSize: '12px', // Set the font size here
            },
          },
          accessibility: {
            description: '',
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: '',
          },
        },
        tooltip: {
          valueSuffix: '',
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
          },
          series: {
            showInLegend: false,
          },
        },
        series: [
          {
            name: '',
            color: '#4AD991',
            data:this.procedureAmount,
          },
        ],
      } as any
    );
  }

  pageChanged(page: any) {
    this.currentPage = page;
  }

  public ngAfterViewInit(): void {}

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
            for (var i = 0; i < this.months.length; i++) {
              if (this.year == this.date.getFullYear()) {
                if (this.months[i].index <= this.date.getMonth()) {
                  this.monthList.push(this.months[i]);
                }
              } else {
                this.monthList.push(this.months[i]);
              }
            }
          },
          (error) => console.log(error)
        );
      },
      (error) => console.log(error)
    );
  }
  authData: any = [];
  topProcedure:any = [];
  topSpeciality:any = [];
  // eKYCFamily:any;
  // eKYCMember:any;
  specialityCode:any = [];
  specialityAmount:any = [];
  procedureCode:any = [];
  procedureAmount:any = [];
  hosFamilyData:any;
  // familyData:any;
  snaWiseClaim:any = [];
  hospitalVariation:any = [];
  floatData:any = [];
  getCountDetails() {
    // this.getDischargeDetails();
    // this.monthList = [];
    // for (var i = 0; i < this.months.length; i++) {
    //   if (this.year == this.date.getFullYear()) {
    //     if (this.months[i].index <= this.date.getMonth()) {
    //       this.monthList.push(this.months[i]);
    //     }
    //   } else {
    //     this.monthList.push(this.months[i]);
    //   }
    // }

    // if (this.year == this.date.getFullYear()) {
    //   if (parseInt(this.month) - 1 > this.date.getMonth()) {
    //     let monthId = this.date.getMonth() + 1;
    //     let checkMonth = monthId.toString();
    //     if (checkMonth.length == 1) {
    //       this.month = '0' + monthId;
    //     } else {
    //       this.month = monthId;
    //     }
    //   }
    // }
    // let month = this.month;
    // let year = this.year;

    // this.claimCount = '';
    // let requestData = {
    //   month: month,
    //   year: year,
    // };
    // console.log('req:');
    // console.log(requestData);
    this.reportCount.getceodashboardreport().subscribe(
      (data) => {
        this.claimCount = data;
        console.log(this.claimCount);
        // this.authData = Object.values(this.claimCount.authDetails);
        // this.authData = [
        //   this.claimCount.authDetails.otp,
        //   this.claimCount.authDetails.iris,
        //   this.claimCount.authDetails.finger,
        //   this.claimCount.authDetails.face,
        // ];
        // let eKYCData = this.claimCount.eKycData;
        // this.eKYCFamily=eKYCData.familyEycObj;
        // this.eKYCMember=eKYCData.memberEkycObj;
        // this.topProcedure = this.claimCount.topProcedure;
        // this.topSpeciality = this.claimCount.topSpeciality;
        // this.specialityCode = this.topSpeciality.map(item => item.packageHeader);
        // this.specialityAmount = this.topSpeciality.map(item => item.amount);
        // this.procedureCode = this.topProcedure.map(item => item.procedureCode);
        // this.procedureAmount = this.topProcedure.map(item => item.amount);
        this.hosFamilyData = this.claimCount.hosFamilyData;
        // this.familyData = this.claimCount.hosFamilyData.familyMemberDetails;
        // let snaWiseClaimHosVariation = this.claimCount.snaWiseClaimHosVariation;
        // this.snaWiseClaim = snaWiseClaimHosVariation.snaWiseClaim;
        // this.hospitalVariation = snaWiseClaimHosVariation.hospitalVariation;
        this.floatData = [
          this.claimCount.floatData.pendingCEO,
          this.claimCount.floatData.pendingSNA,
          this.claimCount.floatData.pendingJointCEO,
          this.claimCount.floatData.pendingFinance,
          this.claimCount.floatData.pendingIA,
          this.claimCount.floatData.pendingDYCEO
        ];
        // this.createAuthenticatechart();
        // this.createSpecialitychart();
        // this.createProcedurechart();
        this.createGenderDetails();
        this.createDepartmentchart();
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
  dischargeData:any;
  dischargeDetails:any;
  highestUsedProcedure:any;
  responseData:any;
  getDischargeDetails(){
    this.monthList = [];
    for (var i = 0; i < this.months.length; i++) {
      if (this.year == this.date.getFullYear()) {
        if (this.months[i].index <= this.date.getMonth()) {
          this.monthList.push(this.months[i]);
        }
      } else {
        this.monthList.push(this.months[i]);
      }
    }

    if (this.year == this.date.getFullYear()) {
      if (parseInt(this.month) - 1 > this.date.getMonth()) {
        let monthId = this.date.getMonth() + 1;
        let checkMonth = monthId.toString();
        if (checkMonth.length == 1) {
          this.month = '0' + monthId;
        } else {
          this.month = monthId;
        }
      }
    }
    let month = this.month;
    let year = this.year;

    let requestData = {
      month: month,
      year: year,
    };
    console.log(requestData);
    this.reportCount.getDischargeDetails(requestData).subscribe(
      (data) => {
        this.responseData = data;
        console.log(this.responseData);
        this.authData = [
          this.responseData.authDetails.otp,
          this.responseData.authDetails.iris,
          this.responseData.authDetails.finger,
          this.responseData.authDetails.face,
        ];
        this.dischargeDetails = this.responseData.dischargeDetails;
        this.highestUsedProcedure = this.responseData.highestUsedProcedure;
        let snaWiseClaimHosVariation = this.responseData.snaWiseClaimHosVariation;
        this.snaWiseClaim = snaWiseClaimHosVariation.snaWiseClaim;
        this.hospitalVariation = snaWiseClaimHosVariation.hospitalVariation;
        this.topProcedure = this.responseData.topProcedure;
        this.topSpeciality = this.responseData.topSpeciality;
        this.procedureCode = this.topProcedure.map(item => item.procedureCode);
        this.procedureAmount = this.topProcedure.map(item => item.amount);
        this.specialityCode = this.topSpeciality.map(item => item.packageHeader);
        this.specialityAmount = this.topSpeciality.map(item => item.amount);

        this.createAuthenticatechart();
        this.createSpecialitychart();
        this.createProcedurechart();
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }
  attendanceUser:any = 'DC';
  atndResponseData:any;
  getAtttendanceReport(){
    this.reportCount.getAtttendanceReport(this.attendanceUser).subscribe(
      (data) => {
        this.atndResponseData = data;
        console.log(this.atndResponseData);
        this.createDonutEpanelment();
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }
}
