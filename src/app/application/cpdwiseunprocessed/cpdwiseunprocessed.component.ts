import { Component, OnInit } from '@angular/core';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { HeaderService } from '../header.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../util/TableUtil';
import { formatDate } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-cpdwiseunprocessed',
  templateUrl: './cpdwiseunprocessed.component.html',
  styleUrls: ['./cpdwiseunprocessed.component.scss']
})
export class CpdwiseunprocessedComponent implements OnInit {
  selectedItems: any = [];
  stateList: any = [];
  districtList: any = []
  hospitalList: any = []
  months: string;
  year: number;
  formdate: any;
  toDate: any;
  data: any;
  state: any;
  dist: any;
  hosp: any;
  user: any
  txtsearchDate: any;
  pageElement: any;
  currentPage: any;
  length: any;
  showPegi: any;
  constructor(private snoService: SnocreateserviceService, public headerService: HeaderService, public route: Router,private sessionService: SessionStorageService,) { }

  ngOnInit(): void {
    this.headerService.setTitle('CPD Wise Unprocessed Claim');
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let date2 = date.getDate();
    let month: any = date.getMonth() - 1;
    if (month == -1) {
      this.months = 'Dec';
      this.year = year - 1;
    } else {
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    var frstDay = date1 + '-' + this.months + '-' + this.year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('#excel').hide();
    $('#pdf').hide();
    this.getStateList();
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
  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }
  OnChangeState(id) {
    $("#districtId").val("");
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }
  OnChangeDistrict(id) {
    this.selectedItems = [];
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {

        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }
  sum: any = 0;
  sum1: any = 0;
  sum2: any = 0;
  sum3: any = 0;
  Searchcpdwiseunprocessed() {
    this.formdate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    this.state = $('#stateId').val();
    this.dist = $('#districtId').val();
    this.hosp = $('#hospital').val();
    if (this.formdate == '' || this.formdate == null || this.formdate == undefined) {
      this.swal('', 'From Date should not be blank', 'error');
      return;
    }
    if (this.toDate == '' || this.toDate == null || this.toDate == undefined) {
      this.swal('', 'To Date should not be blank', 'error');
      return;
    }
    if (Date.parse(this.formdate) > Date.parse(this.toDate)) {
      this.swal('', ' From Date should be less than To Date', 'error');
      return;
    }
    if (this.state == '' || this.state == null || this.state == undefined) {
      this.state = '';
    }
    if (this.dist == '' || this.dist == null || this.dist == undefined) {
      this.dist = '';
    }
    if (this.hosp == '' || this.hosp == null || this.hosp == undefined) {
      this.hosp = '';
    }
    this.data = {
      "fromDate": this.formdate,
      "toDate": this.toDate,
      "stateCode": this.state,
      "districtCode": this.dist,
      "hospitalCode": this.hosp,
      "userId": this.user.userId,
    }
    this.snoService.getcpdwiseunprocessed(this.data).subscribe(
      (response: any) => {
        this.data = response;
        this.length = this.data.length;
        if (this.length > 0) {
          $('#excel').show();
          $('#pdf').show();
          let sum = 0;
          let sum1 = 0;
          let sum2 = 0;
          let sum3 = 0;
          for (let i = 0; i < this.data.length; i++) {
            sum += parseInt(this.data[i].patcpdfess);
            sum1 += parseInt(this.data[i].patcpdresettelment);
            sum3 += parseInt(this.data[i].cpdquery7);
          }
          this.sum = sum;
          this.sum1 = sum1;
          this.sum3 = sum3;
          this.pageElement = 100;
          this.currentPage = 1;
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      },
      (error) => console.log(error)
    )
  }

  ResetField() {
    window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  report: any = [];
  sno: any = {
    Slno: "",
    sna: "",
    pcpdf: "",
    pcpdr: "",
    phosp: "",
  };
  heading = [['Sl#', 'CPD Doctor Name','Pending At CPD (Fresh)','Pending At CPD (Re-Settlement)', 'Pending At Hospital For Recomply(With in 7 Days After CPD Query)']];
  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    // let generatedBy = JSON.parse(sessionStorage.getItem('user')).fullName;
    let generatedBy = this.sessionService.decryptSessionData("user").fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.data.length; i++) {
      sna=this.data[i];
      this.sno=[];
      this.sno.Slno=i+1;
      this.sno.sna=sna.username;
      this.sno.pcpdf=sna.patcpdfess;
      this.sno.pcpdr=sna.patcpdresettelment;
      this.sno.phosp=sna.cpdquery7;
      this.report.push(this.sno);
    }
    this.sno=[];
    this.sno.sna="Total";
      this.sno.pcpdf=this.sum;
      this.sno.pcpdr=this.sum1;
      this.sno.phosp=this.sum3;
      this.report.push(this.sno);
    let staten="All";
    let distn="All";
    let hospn="All";
    for(let j=0; j < this.stateList.length;j++){
      if(this.stateList[j].stateCode==this.state){
        staten=this.stateList[j].stateName;
      }
    }
    for(let j=0; j < this.districtList.length;j++){
      if(this.districtList[j].districtcode==this.dist){
        distn=this.districtList[j].districtname;
      }
    }
    for(let j=0; j < this.hospitalList.length;j++){
      if(this.hospitalList[j].hospitalCode==this.hosp){
        hospn=this.hospitalList[j].hospitalName;
      }
    }
if(no==1){
    let filter =[];
    filter.push([['Actual Date Of Discharge From', this.formdate]]);
      filter.push([['Actual Date Of Discharge To', this.toDate]]);
      filter.push([['State', staten]]);
      filter.push([['District', distn]]);
      filter.push([['Hospital', hospn]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'CPD Wise Unprocessed Claim',
        this.heading,filter
      );
  }else{
    if(this.report==null || this.report.length==0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    var doc = new jsPDF('p', 'mm',[297,210 ]);
          doc.setFontSize(12);
          doc.text("CPD Wise Unprocessed Claim", 80, 10);
          doc.text('Actual Date Of Discharge From :- '+ this.formdate,8,18);
          doc.text('Actual Date Of Discharge To :- '+ this.toDate,110,18);
          doc.text('State :- '+ staten,8,26);
          doc.text('District :- '+ distn,110,26);
          doc.text('Hospital :- '+ hospn,8,34);
          doc.text('GeneratedOn :- '+generatedOn,8,42);
          doc.text('GeneratedBy :- '+generatedBy,110,42);
          var rows = [];
          for(var i=0;i<this.report.length;i++) {
            var clm = this.report[i];
            var pdf = [];
            pdf[0] = clm.Slno;
            pdf[1] = clm.sna;
            pdf[2] = clm.pcpdf;
            pdf[3] = clm.pcpdr;
            pdf[4] = clm.phosp;
            rows.push(pdf);
          }
          autoTable(doc, {
            head: this.heading,
            body: rows,
            theme: 'grid',
            startY: 50,
            headStyles: {
              fillColor: [26, 99, 54]
            },
            columnStyles: {
              0: {cellWidth: 10},
              1: {cellWidth: 30},
              2: {cellWidth: 30},
              3: {cellWidth: 30},
              4: {cellWidth: 50},
            }
          });
          doc.save('CPD_Wise_Unprocessed_Claim.pdf');
      }
  }

  inner(snoid: any, action: any, name: any, no: any, userid: any) {
    if (no == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    } else {
      let staten = "All";
      let distn = "All";
      let hospn = "All";
      for (let j = 0; j < this.stateList.length; j++) {
        if (this.stateList[j].stateCode == this.state) {
          staten = this.stateList[j].stateName;
        }
      }
      for (let j = 0; j < this.districtList.length; j++) {
        if (this.districtList[j].districtcode == this.dist) {
          distn = this.districtList[j].districtname;
        }
      }
      for (let j = 0; j < this.hospitalList.length; j++) {
        if (this.hospitalList[j].hospitalCode == this.hosp) {
          hospn = this.hospitalList[j].hospitalName;
        }
      }
      let state = {
        fdate: this.formdate,
        tdate: this.toDate,
        state: this.state,
        dist: this.dist,
        hospital: this.hosp,
        snoid: snoid,
        action: action,
        staten: staten,
        distn: distn,
        hospitaln: hospn,
        snoname: name,
        userid: userid,
      }
      localStorage.setItem("cpdunprocessed", JSON.stringify(state));
      this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/cpdwiseunprocesseddetails'); });
    }
  }

}
