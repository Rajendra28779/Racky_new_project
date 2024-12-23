import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Highcharts from 'highcharts';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { DcClaimService } from '../../Services/dc-claim.service';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';
import { jsPDF } from 'jspdf';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;


@Component({
  selector: 'app-dc-dashboard',
  templateUrl: './dc-dashboard.component.html',
  styleUrls: ['./dc-dashboard.component.scss']
})
export class DcDashboardComponent implements OnInit {
  siteURL = environment.siteURL;
  graphToggleVal: number = 1;
  graphresolvedVal: number = 1;
  empaneltoggleVal: number = 1;
  user: any;
  months: any = [];
  monthList: any = [];
  yearList: any = [];
  month: any;
  year: any;
  date: any;
  userId: any;
  overmonth: any;
  overyear: any;
  dcyear: any;
  dcmonth: any;
  ovyear: any;
  ovmonth: any;
  date2: any;
  pageWidthAndHeight: number = 0;

  constructor(private dsService: DcClaimService, private userService: SnocreateserviceService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    window.addEventListener('resize', () => {
      const browserZoomLevel = (window.outerWidth - 8) / window.innerWidth;
      console.log(browserZoomLevel);
      this.pageWidthAndHeight = browserZoomLevel;
    })
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId;
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      maxDate: new Date()
    })
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('input[name="fromDate"]').val(this.changeDateFormat());
    $('input[name="toDate"]').val(this.changeDateFormat1());
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
    this.getCountDetails();
    this.getHospitalByUserId();
    this.getDCOverRideCount();
    this.getGrievanceCountDetails();
    this.getResolvedCountDetails();
    this.getGrievanceModeCount();
    this.getCCECountDetails();
    this.getEmpanelCountDetails();
    Highcharts.chart('column-chart', this.options);
    Highcharts.chart('column-chartnew', this.options_one);
    Highcharts.chart('line-chart', this.options_two);
    Highcharts.chart('pie-chart', this.options_pie);
    console.log(this.options_pie);
  }
  changeDateFormat() {
    var date1 = new Date();
    let year1 = date1.getFullYear();
    let date2 = '01';
    let months: any = date1.getMonth();
    if (months == -1) {
      this.overmonth = 'Dec';
      this.overyear = year1 - 1;
    } else {
      this.overmonth = this.getMonthFrom(months);
      this.overyear = year1;
    }
    var frstDay = date2 + '-' + this.overmonth + '-' + this.overyear;
    return frstDay;
  }
  changeDateFormat1() {
    var date1 = new Date();
    let year1 = date1.getFullYear();
    let date2 = date1.getDate();
    let months: any = date1.getMonth();
    if (months == -1) {
      this.overmonth = 'Dec';
      this.overyear = year1 - 1;
    } else {
      this.overmonth = this.getMonthFrom(months);
      this.overyear = year1;
    }
    var frstDay = date2 + '-' + this.overmonth + '-' + this.overyear;
    return frstDay;
  }
  getMonthFrom(month) {
    if (month == 0) {
      month = 'Jan';
    } else if (month == 1) {
      month = 'Feb';
    } else if (month == 2) {
      month = 'Mar';
    } else if (month == 3) {
      month = 'Apr';
    } else if (month == 4) {
      month = 'May';
    } else if (month == 5) {
      month = 'Jun';
    } else if (month == 6) {
      month = 'Jul';
    } else if (month == 7) {
      month = 'Aug';
    } else if (month == 8) {
      month = 'Sep';
    } else if (month == 9) {
      month = 'Oct';
    } else if (month == 10) {
      month = 'Nov';
    } else if (month == 11) {
      month = 'Dec';
    }
    return month;
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
        )
      },
      (error) => console.log(error)
    )
  }

  hospitalList: any = [];
  hospitalId: any = '';
  getHospitalByUserId() {
    this.userService.getHospitalById(this.userId).subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          let details = JSON.parse(resData.data);
          this.hospitalList = details;
        }
      },
      (error) => {
        console.log(error);
      }
    )

  }

  HospitalCount: any = [];
  totalWise: any;
  getCountDetails() {
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

    let userId = this.user.userId;
    let month = this.month;
    let year = this.year;
    let viewFlag = 'GR';
    let section = 'INV';
    let requestData = {
      userId: userId,
      month: month,
      year: year,
      viewFlag: viewFlag,
      sectionFlag: section
    };
    console.log(requestData);
    this.dsService.getDCInvestigationReport(requestData).subscribe(
      (data: any) => {
        let hospitalWise = data.HospitalWise;
        this.totalWise = data.TotalWise;
        this.options.xAxis.categories = [];
        this.options.series[2].data = [];
        this.options.series[1].data = [];
        this.options.series[0].data = [];
        for (let i = 0; i < hospitalWise.length; i++) {
          this.options.xAxis.categories.push(hospitalWise[i].hospitalName);
          this.options.series[0].data.push(hospitalWise[i].total);
          this.options.series[1].data.push(hospitalWise[i].approved);
          this.options.series[2].data.push(hospitalWise[i].pending);
          console.log(this.options);
        }
        Highcharts.chart('column-chart', this.options);
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }
  getDCOverRideCount() {
    let userId = this.user.userId;
    let fromDate = $('#fromDate').val();
    let toDate = $('#toDate').val();
    let hospitalCode = this.hospitalId;
    let viewFlag = 'GR';
    let section = 'OV';
    let requestData1 = {
      userId: userId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      hospitalCode: hospitalCode,
      viewFlag: viewFlag,
      sectionFlag: section
    };
    this.dsService.getDCOverRideReport(requestData1).subscribe(
      (data: any) => {
        this.DCOverrideTotal = data.TotalWise;
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }
  graphToggle(val: number) {
    this.graphToggleVal = val;
    if (this.graphToggleVal == 2) {
      this.date = new Date();
      let monthId = this.date.getMonth() + 1;
      let checkMonth = monthId.toString();
      if (checkMonth.length == 1) {
        this.ovmonth = '0' + monthId;
      } else {
        this.ovmonth = monthId;
      }
      this.ovyear = this.date.getFullYear();
      this.date2 = new Date();
      let monthId1 = this.date2.getMonth() + 1;
      let checkMonth1 = monthId.toString();
      if (checkMonth1.length == 1) {
        this.dcmonth = '0' + monthId1;
      } else {
        this.dcmonth = monthId1;
      }
      this.dcyear = this.date2.getFullYear();
      this.getTblCountDetails();
      this.getTblOverCountDetails();
    } if (this.graphToggleVal == 1) {
      $('input[name="fromDate"]').val(this.changeDateFormat());
      $('input[name="toDate"]').val(this.changeDateFormat1());
      this.date = new Date();
      let monthId = this.date.getMonth() + 1;
      let checkMonth = monthId.toString();
      if (checkMonth.length == 1) {
        this.month = '0' + monthId;
      } else {
        this.month = monthId;
      }
      this.year = this.date.getFullYear();
      this.getCountDetails();
      this.getHospitalByUserId();
      this.getDCOverRideCount();
    }
  }
  DCTblCount: any = [];
  getTblCountDetails() {
    this.monthList = [];
    for (var i = 0; i < this.months.length; i++) {
      if (this.dcyear == this.date2.getFullYear()) {
        if (this.months[i].index <= this.date2.getMonth()) {
          this.monthList.push(this.months[i]);
        }
      } else {
        this.monthList.push(this.months[i]);
      }
    }

    if (this.dcyear == this.date2.getFullYear()) {
      if (parseInt(this.dcmonth) - 1 > this.date.getMonth()) {
        let monthId = this.date2.getMonth() + 1;
        let checkMonth = monthId.toString();
        if (checkMonth.length == 1) {
          this.dcmonth = '0' + monthId;
        } else {
          this.dcmonth = monthId;
        }
      }
    }

    let userId = this.user.userId;
    let month = this.dcmonth;
    let year = this.dcyear;
    let viewFlag = 'TBL';
    let section = 'INV';
    let requestData2 = {
      userId: userId,
      month: month,
      year: year,
      viewFlag: viewFlag,
      sectionFlag: section
    };
    console.log(requestData2);
    this.dsService.getDCInvestigationReport(requestData2).subscribe(
      (data: any) => {
        this.DCTblCount = data.HospitalWise;
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }
  DCOverrideCount: any = [];
  DCOverrideTotal: any;
  getTblOverCountDetails() {
    this.monthList = [];
    for (var i = 0; i < this.months.length; i++) {
      if (this.ovyear == this.date.getFullYear()) {
        if (this.months[i].index <= this.date.getMonth()) {
          this.monthList.push(this.months[i]);
        }
      } else {
        this.monthList.push(this.months[i]);
      }
    }

    if (this.ovyear == this.date.getFullYear()) {
      if (parseInt(this.ovmonth) - 1 > this.date.getMonth()) {
        let monthId = this.date.getMonth() + 1;
        let checkMonth = monthId.toString();
        if (checkMonth.length == 1) {
          this.ovmonth = '0' + monthId;
        } else {
          this.ovmonth = monthId;
        }
      }
    }

    let userId = this.user.userId;
    let month = this.ovmonth;
    let year = this.ovyear;
    let viewFlag = 'TBL';
    let section = 'OV';
    let requestData2 = {
      userId: userId,
      month: month,
      year: year,
      viewFlag: viewFlag,
      sectionFlag: section
    };
    this.dsService.getDCOverRideReport(requestData2).subscribe(
      (data: any) => {
        console.log(data);
        this.DCOverrideCount = data.HospitalWise;
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }
  graphresolved(val: number) {
    this.graphresolvedVal = val;
    if (this.graphresolvedVal == 2) {
      this.getResolvedTblCountDetails();
    } if (this.graphresolvedVal == 1) {
      this.getResolvedCountDetails();
    }
  }
  getResolvedCountDetails() {
    let userId = this.user.userId;
    let viewFlag = 'GR';
    let section = 'RES';

    let requestData3 = {
      userId: userId,
      viewFlag: viewFlag,
      sectionFlag: section
    };
    this.dsService.getDCGrievanceResolveReport(requestData3).subscribe(
      (data: any) => {
        console.log(data);
        let IndividualWise = data.IndividualWise;
        this.options_two.xAxis[0].categories = [];
        this.options_two.series[1].data = [];
        this.options_two.series[0].data = [];
        for (let i = 0; i < IndividualWise.length; i++) {
          this.options_two.xAxis[0].categories.push(IndividualWise[i].GRIEVANCE_NAME);
          this.options_two.series[0].data.push(IndividualWise[i].total);
          this.options_two.series[1].data.push(IndividualWise[i].resolved);
        }
        Highcharts.chart('line-chart', this.options_two);
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }
  GrievanceResolvedTbl: any = [];
  getResolvedTblCountDetails() {
    let userId = this.user.userId;
    let viewFlag = 'TBL';
    let section = 'RES';

    let requestData3 = {
      userId: userId,
      viewFlag: viewFlag,
      sectionFlag: section
    };
    this.dsService.getDCGrievanceResolveReport(requestData3).subscribe(
      (data: any) => {
        console.log(data);
        this.GrievanceResolvedTbl = data.HospitalWise;
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }
  GrievanceMode: any;
  totalMode: any;
  getGrievanceModeCount() {
    let userId = this.user.userId;
    let section = 'MODE';
    let requestData3 = {
      userId: userId,
      sectionFlag: section
    };
    this.dsService.getDCGrievanceModeReport(requestData3).subscribe(
      (data: any) => {
        console.log(data);
        this.GrievanceMode = data.ModeWise;
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }
  getPromoStyles(value: any, total: any) {
    let percentage = (value / total) * 100;
    return 'width:' + percentage + '%';
  }
  empaneltoggle(val: number) {
    this.empaneltoggleVal = val;
    if (this.empaneltoggleVal == 2) {
      this.getGrievanceTblCountDetails();//for table
    } if (this.empaneltoggleVal == 1) {
      this.getGrievanceCountDetails(); //for graph
    }
  }
  DCGrievanceTblCount: any = [];
  DcGrievanceTotal: any;
  getGrievanceCountDetails() {
    let userId = this.user.userId;
    let viewFlag = 'GR';
    let section = 'GRV';

    let requestData3 = {
      userId: userId,
      viewFlag: viewFlag,
      sectionFlag: section
    };
    this.dsService.getDCGrievanceReport(requestData3).subscribe(
      (data: any) => {
        console.log(data);
        // console.log(this.options_one);
        let IndividualWise = data.IndividualWise;
        this.DcGrievanceTotal = data.TotalWise;
        this.options_one.xAxis.categories = [];
        this.options_one.series[1].data = [];
        this.options_one.series[0].data = [];
        for (let i = 0; i < IndividualWise.length; i++) {
          this.options_one.xAxis.categories.push(IndividualWise[i].GRIEVANCE_NAME);
          this.options_one.series[0].data.push(IndividualWise[i].action);
          this.options_one.series[1].data.push(IndividualWise[i].pending);
        }
        // console.log(this.options_one);
        Highcharts.chart('column-chartnew', this.options_one);
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }
  getGrievanceTblCountDetails() {
    let userId = this.user.userId;
    let viewFlag = 'TBL';
    let section = 'GRV';

    let requestData4 = {
      userId: userId,
      viewFlag: viewFlag,
      sectionFlag: section
    };
    this.dsService.getDCGrievanceReport(requestData4).subscribe(
      (data: any) => {
        console.log(data);
        this.DCGrievanceTblCount = data.IndividualWise;
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }
  CCECountTotal: any;
  getCCECountDetails() {
    let userId = this.user.userId;
    let section = 'CCE';
    let requestData4 = {
      userId: userId,
      sectionFlag: section
    };
    this.dsService.getCCECountReport(requestData4).subscribe(
      (data: any) => {
        console.log(data);
        this.CCECountTotal = data.CCETotal;
        this.options_pie.series[0].data[0].y = this.CCECountTotal.Support;
        this.options_pie.series[0].data[1].y = this.CCECountTotal.Behaviour;
        this.options_pie.series[0].data[2].y = this.CCECountTotal.Bribe;
        Highcharts.chart('pie-chart', this.options_pie);
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }
  EmpCountTotal: any;
  getEmpanelCountDetails() {
    let userId = this.user.userId;
    let section = 'EMP';
    let requestData4 = {
      userId: userId,
      sectionFlag: section
    };
    this.dsService.getEmpanelCountReport(requestData4).subscribe(
      (data: any) => {
        console.log(data);
        this.EmpCountTotal = data.EmpTotal;
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }
  // coloumn chart

  public options: any = {
    colors: [
      '#4DB2F7', '#2CD192', '#FFB800'
    ],


    chart: {
      type: 'column'
    },
    legend: { enabled: false },
    credits: {
      enabled: false,
    },

    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    xAxis: {
      categories: [
      ],
      crosshair: true,
      labels: {
        style: {
          fontSize: '14px',
          color: '#404040'
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [{
      name: '',
      data: []

    }, {
      name: '',
      data: []

    }, {
      name: '',
      data: []

    }]
  }

  // coloumn chart




  // coloumn chart stack new
  public options_one: any = {
    colors: [
      '#4DB2F7', '#FFB800'
    ],


    chart: {
      type: 'column'
    },

    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    title: {
      text: ''
    },
    xAxis: {
      categories: [],
      labels: {
        style: {
          fontSize: '14px',
          color: '#404040'
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      }
    },

    tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        stacking: 'percent',
        pointWidth: 45
      }
    },
    series: [{
      name: 'Action',
      data: [],
    }, {
      name: 'Pending',
      data: []
    }]



  }

  // coloumn chart stack new



  // line chart  new
  public options_two: any = {
    colors: [
      '#FFB800', '#4DB2F7'
    ],


    chart: {
      type: 'column'
    },
    credits: {
      enabled: false,
    },
    title: {
      text: '',
      align: 'left'
    },
    plotOptions: {
      column: {
        pointWidth: 30
      }
    },

    xAxis: [{
      categories: [],
      crosshair: true,
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#404040'
        }
      }
    }],



    tooltip: {
      shared: true
    },

    series: [{
      name: 'Grievance Received',
      type: 'column',
      data: [],
      tooltip: {
        valueSuffix: ''
      }

    }, {
      name: 'Grievance Resolved',
      type: 'spline',
      data: [],
      tooltip: {
        valueSuffix: ''
      }
    }]



  }

  // line chart  new




  // Pie chart  new
  public options_pie: any = {
    colors: ['#f2bd56 ', '#4DB2F7', '#68B984'],

    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
      margin: 0,
      spacingTop: 0,
      spacingBottom: 0,
      spacingLeft: 0,
      spacingRight: 0,
      width: 200,
      height: 150,
      style: {
        position: 'relative',
      },
    },
    title: {
      text: '',
      align: 'left'
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },

    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        center: ['50%', '50%'],
        dataLabels: {
          enabled: false,
          distance: -50,
          filter: {
            property: 'percentage',
            operator: '>',
            value: 3
          }
        },
        showInLegend: true
      }
    },

    legend: {
      enabled: false,
    },

    series: [{
      name: '',
      data: [
        { name: 'Support', y: 50 },
        { name: 'Behaviour', y: 27 },
        { name: 'Bribe', y: 13 }
      ]
    }]



  }

  // Pie chart  new

  ngAfterViewInit() {
    $('#fromDate,#toDate').datetimepicker().on('dp.change', (e) => {
      const selectedDate = $('input[name="fromDate"]').val();
      console.log('Selected date:', selectedDate);
      this.getDCOverRideCount();
    });
  }









  // all chart
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }



  // public openPDF(): void {
  //   let DATA: any = document.getElementById('contentData');

  //   html2canvas(DATA).then((canvas) => {

  //     let fileWidth = 230;
  //     let pageheight=273;
  //     let fileHeight = ((canvas.height * fileWidth) / canvas.width)+100;
  //     alert(fileHeight);
  //     //for full screen
  //     if(fileHeight==Number(392.13026819923374)){
  //     let heightleft = fileHeight;
  //     heightleft -= pageheight;
  //     const FILEURI = canvas.toDataURL('image/jpeg',1.0);
  //     let PDF = new jsPDF('p', 'mm', [280, 250]);
  //     PDF.setFontSize(15);
  //     PDF.text("DC Dashboard", 95, 9);
  //     PDF.setFontSize(12);
  //     PDF.text("Generated By: " + JSON.parse(sessionStorage.getItem('user')).fullName, 14, 16);
  //     PDF.text("Generated On: " + this.convertDate(new Date()), 14, 22);
  //     let position = 30;
  //     PDF.addImage(FILEURI, 'JPEG', 10, position, fileWidth, fileHeight+70,'',"FAST");
  //     while(heightleft >= 0){
  //       let position = (heightleft - fileHeight)+67;
  //       PDF.addPage();
  //       PDF.addImage(FILEURI, 'JPEG', 10, position, fileWidth, fileHeight,'',"FAST");
  //       heightleft -= pageheight;
  //     }

  //     PDF.save('DC Dashboard Data.pdf');

  //     }
  //     //for half screen
  //     else{

  //     let heightleft = fileHeight;
  //     heightleft -= pageheight;
  //     const FILEURI = canvas.toDataURL('image/jpeg',1.0);
  //     let PDF = new jsPDF('p', 'mm', [280, 250]);
  //     PDF.setFontSize(15);
  //     PDF.text("DC Dashboard", 97, 9);
  //     PDF.setFontSize(12);
  //     PDF.text("Generated By: " + JSON.parse(sessionStorage.getItem('user')).fullName, 14, 16);
  //     PDF.text("Generated On: " + this.convertDate(new Date()), 14, 22);
  //     let position = 25;
  //     PDF.addImage(FILEURI, 'JPEG', 10, position, fileWidth, fileHeight,'',"FAST");
  //     while(heightleft >= 0){
  //       let position = (heightleft - fileHeight)+25;
  //       PDF.addPage();
  //       PDF.addImage(FILEURI, 'JPEG', 10, position, fileWidth, fileHeight,'',"FAST");
  //       heightleft -= pageheight;
  //     }
  //     // PDF.prin
  //     //PDF.output('dataurlnewwindow');
  //     PDF.save('DC Dashboard Data.pdf');
  //     //PDF.restore();

  //     }
  //   });
  // }


  // convertDate(date) {
  //   var datePipe = new DatePipe("en-US");
  //   date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
  //   return date;
  // }




  // public openPDF(): void {
  //   let DATA: any = document.getElementById('contentData');

  //   html2canvas(DATA).then((canvas) => {

  //     //let pageDetails = this.dynamicPageSizeCalculation(this.pageWidthAndHeight);
  //     // let fileWidth = 230;
  //     // let pageheight = 273;
  //     let fileWidth = 230;
  //     let pageheight = 200;
  //     let fileHeight = ((canvas.height * fileWidth) / canvas.width);
  //     const FILEURI = canvas.toDataURL('image/jpeg',1.0);
  //     let PDF = new jsPDF('p', 'mm', [280, 250]);
  //     PDF.setFontSize(15);
  //     PDF.text("DC Dashboard", 95, 9);
  //     PDF.setFontSize(12);
  //     PDF.text("Generated By: " + JSON.parse(sessionStorage.getItem('user')).fullName, 14, 16);
  //     PDF.text("Generated On: " + this.convertDate(new Date()), 14, 22);
  //     let position = 30;
  //     PDF.addImage(FILEURI, 'JPEG', 10, position, fileWidth, fileHeight,'',"FAST");

  //     let heightleft = fileHeight;
  //     heightleft -= pageheight;
  //     while(heightleft >= 0){
  //       let position = (heightleft - fileHeight);
  //       PDF.addPage();
  //       PDF.addImage(FILEURI, 'JPEG', 10, position, fileWidth, fileHeight,'',"FAST");
  //       heightleft -= pageheight;
  //     }

  //     PDF.output('dataurlnewwindow');
  //   // PDF.save('DC Dashboard Data.pdf');

  //   });
  // }


  //window.jsPDF = window.jspdf.jsPDF;
  //    openPDF() {
  //     let jsPdf = new jsPDF('p', 'pt','a4');
  //     jsPdf.setFontSize(15);
  //     jsPdf.text("DC Dashboard", 270, 14);
  //     jsPdf.setFontSize(12);
  //     jsPdf.text("Generated By: " + JSON.parse(sessionStorage.getItem('user')).fullName, 45, 26);
  //     jsPdf.text("Generated On: " + this.convertDate(new Date()), 45, 46);
  //     //let jsPdf = new jsPDF('p', 'mm', [280, 250]);
  //     var htmlElement = document.getElementById('contentData');
  //     // you need to load html2canvas (and dompurify if you pass a string to html)
  //     const opt = {
  //         callback: function (jsPdf) {
  //             jsPdf.save("DC Dashboard.pdf");
  //             // to open the generated PDF in browser window
  //             //window.open(jsPdf.output('bloburl'));
  //         },
  //         margin: [60, 45, 45, 45],
  //         autoPaging: true,
  //         html2canvas: {
  //             allowTaint: true,
  //             backgroundColor: '#ffffff',
  //             dpi: 300,
  //             letterRendering: true,
  //             logging: false,
  //             scale: .5,
  //             useCORS: true,
  //             scrollX: 0,
  //             scrollY: 0,
  //             //foreignObjectRendering: true
  //         }
  //     };

  //     jsPdf.html(htmlElement,opt);
  // }




  //    openPDF() {
  //     let jsPdf = new jsPDF('p', 'pt','a4');
  //     jsPdf.setFontSize(15);
  //     jsPdf.text("DC Dashboard", 270, 14);
  //     jsPdf.setFontSize(12);
  //     jsPdf.text("Generated By: " + JSON.parse(sessionStorage.getItem('user')).fullName, 45, 26);
  //     jsPdf.text("Generated On: " + this.convertDate(new Date()), 45, 46);
  //     //let jsPdf = new jsPDF('p', 'mm', [280, 250]);
  //     var htmlElement = document.getElementById('contentData');
  //     // you need to load html2canvas (and dompurify if you pass a string to html)
  //     const opt = {
  //         callback: function (jsPdf) {
  //             jsPdf.save("DC Dashboard.pdf");
  //             // to open the generated PDF in browser window
  //             //window.open(jsPdf.output('bloburl'));
  //         },
  //         margin: [60, 45, 45, 45],
  //         autoPaging: true,
  //         html2canvas: {
  //             allowTaint: true,
  //             backgroundColor: '#ffffff',
  //             dpi: 300,
  //             letterRendering: true,
  //             logging: false,
  //             scale: .5,
  //             useCORS: true,
  //             scrollX: 0,
  //             scrollY: 0,
  //             //foreignObjectRendering: true
  //         }
  //     };

  //     jsPdf.html(htmlElement,opt);
  // }

  @ViewChild('contentData', { static: false })
  contentData: ElementRef;

  // openPDF() {

  //  // const doc = new jsPDF('p', 'mm', [280, 250]);
  //   const doc = new jsPDF();

  //   const specialElementHandlers = {
  //     '#demo': function (element, renderer) {
  //       return true;
  //     }
  //   };

  //   const contentData = this.contentData.nativeElement;

  //   doc.html(contentData.innerHTML,{
  //     width: 190,
  //     // 'elementHandlers': specialElementHandlers
  //   });

  //   doc.save('tableToPdf.pdf');
  // }

  // openPDF(){
  //   // Get the element to capture
  //   const element = this.contentData.nativeElement;

  //   // Use html2canvas to capture the element as an image
  //   html2canvas(element).then((canvas) => {
  //     // Convert the captured image to a data URL
  //     const imgData = canvas.toDataURL('image/png');

  //     // Create a new jsPDF instance
  //     const pdf = new jsPDF();

  //     // Calculate the aspect ratio to fit the image in the PDF page
  //     const imgWidth = 210; // Width of A4 page in mm
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //     // Add the image to the PDF
  //     pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  //     // Save the PDF
  //     pdf.save('screenshot.pdf');
  //   });
  // }

  // openPDF(){
  //   const dashboard =document.getElementById('contentData');

  //   const dashboardHeight = dashboard.clientHeight;
  //   const dashboardWidth = dashboard.clientWidth;
  //   const options = { background: 'white', width: dashboardWidth, height: dashboardHeight };

  //   domtoimage.toPng(dashboard, options).then((imgData) => {
  //        const doc = new jsPDF(dashboardWidth > dashboardHeight ? 'l' : 'p', 'mm', [dashboardWidth, dashboardHeight]);
  //        const imgProps = doc.getImageProperties(imgData);
  //        const pdfWidth = doc.internal.pageSize.getWidth();
  //        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //        doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //        doc.save('Dashboard for hyperpanels.pdf');
  //   });

  // }












  dynamicPageSizeCalculation(data: number) {
    switch (data) {
      case 0.2485358711566618:
        data = 25;
        break;

      case 0.3313811615422157:
        data = 33;
        break;

      case 0.4970717423133236:
        data = 50;
        break;

      case 0.6627623230844314:
        data = 67;
        break;

      case 0.7457440966501923:
        data = 75;
        break;

      case 0.7955477445811365:
        data = 80;
        break;

      case 0.8951878707976269:
        data = 90;
        break;

      case 0.9941434846266471:
        data = 100;
        break;

      case 1.0933977455716586:
        data = 110;
        break;

      case 0.2485358711566618:
        data = 125;
        break;

      case 1.4906695938529089:
        data = 150;
        break;

      case 1.741025641025641:
        data = 175;
        break;

      case 1.9882869692532943:
        data = 200;
        break;

      default:
        break;
    }
    return data;
  }






  // openPDF() {
  //   const content = this.getContentToConvert();
  //   const pdf = new jsPDF('p', 'mm', 'a4');

  //   pdf.html(content, {
  //     callback: (pdf) => {
  //       pdf.save('output.pdf');
  //     },
  //   });
  // }

  // private getContentToConvert() {
  //   const contentToConvert = document.getElementById('contentData');
  //   return contentToConvert.innerHTML;
  // }



  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }

  height: number;
  width: number;
  heighthandwidth() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    alert(this.height);
    alert(this.width);
  }

}
