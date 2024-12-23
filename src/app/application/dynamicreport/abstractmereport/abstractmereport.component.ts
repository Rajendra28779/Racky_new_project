import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicreportService } from '../../Services/dynamicreport.service';
import { HeaderService } from '../../header.service';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/services/jwt.service';
import { CurrencyPipe, formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../../util/TableUtil';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-abstractmereport',
  templateUrl: './abstractmereport.component.html',
  styleUrls: ['./abstractmereport.component.scss']
})
export class AbstractmereportComponent implements OnInit {
  childmessage: any;
  user: any;
  flag: any;
  fromdate: any;
  todate: any;
  result: any;
  list: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount: any = 0;
  txtsearchDate: any;
  months: string;
  year: number;
  showdropdown: any;
  public snaDoctorList: any = [];
  snadoc: any;
  trigger:any;
  sum:any=0;
  sum1:any=0;
  sum2:any=0;

  constructor(public route: Router,
    private service: DynamicreportService,
    public headerService: HeaderService,
    private jwtService: JwtService,
    private snoService: SnocreateserviceService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Abstract M And E Report');
    this.user = this.sessionService.decryptSessionData("user");
    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // maxDate: new Date(),
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
    let date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth();
    this.months = this.getMonthFrom(month);
    this.year = year;
    let frstDay = date1 + '-' + this.months + '-' + this.year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    this.getTriggerList();
  }
  triggerList: any = [];
  getTriggerList() {
    this.service.findAllActiveTrigger().subscribe((data: any) => {
      this.triggerList = data;
    })
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

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  getlist() {
    this.fromdate = $('#datepicker1').val();
    this.todate = $('#datepicker2').val();
    this.trigger=$('#trigger').val();
    if (Date.parse(this.fromdate) > Date.parse(this.todate)) {
      this.swal('', ' From Date should be less than To Date', 'error');
      return;
    }
    if(this.trigger=="" || this.trigger==null || this.trigger==undefined){
      this.swal('', 'Please Select Trigger Name', 'error');
      return;
    }
    this.service.getmeabstractreport(this.fromdate, this.todate,this.trigger).subscribe((data: any) => {
      if(data.status==200){
        this.list = data.data;
          this.totalcount = this.list.length;
        if (this.totalcount > 0) {
          let sum=0;
          let sum1=0;
          let sum2=0;
          for(let i = 0; i < this.list.length; i++){
            sum+=parseInt(this.list[i].totalcase);
            sum1+=parseInt(this.list[i].pendingClaim);
            sum2+=parseInt(this.list[i].actionTaken);
          }
          this.sum=sum;
          this.sum1=sum1;
          this.sum2=sum2;
          this.showPegi = true
          this.currentPage = 1
          this.pageElement = 100
        } else {
          this.showPegi = false
        }
      }else{
        this.swal("Error", "SomeThing Went Wrong", "error");
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

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  ResetField() {
    window.location.reload();
  }

  report: any = [];
  sno: any = {
    Slno: "",
    trigger: "",
    totalcase: "",
    pending: "",
    actiontaken: ""
  };
  heading = [['Sl#', 'Trigger Name','Total Case','Pending  Claim','Action Taken Claim']];


  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (let i = 0; i < this.list.length; i++) {
      sna=this.list[i];
      this.sno=[];
      this.sno.Slno=i+1;
      this.sno.trigger=sna.triggerName;
      this.sno.totalcase=sna.totalcase;
      this.sno.pending=sna.pendingClaim;
      this.sno.actiontaken=sna.actionTaken;
      this.report.push(this.sno);
    }
    this.sno=[];
      this.sno.trigger="Total";
      this.sno.totalcase=this.sum;
      this.sno.pending=this.sum1;
      this.sno.actiontaken=this.sum2;
      this.report.push(this.sno);

      let triggername="All";
    for(let j=0; j < this.triggerList.length;j++){
      if(this.triggerList[j].slno==this.trigger){
        triggername=this.triggerList[j].reportname;
      }
    }

    if(no==1){
      let filter =[];
      filter.push([['Actual Date Of Discharge From', this.fromdate]]);
        filter.push([['Actual Date Of Discharge To', this.todate]]);
        filter.push([['Trigger Name', triggername]]);
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'Abstract M And E Report',
          this.heading,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('p', 'mm',[297,210 ]);
      doc.setFontSize(20);
      doc.text("Abstract M And E Report", 80, 15);
      doc.setFontSize(12);
      doc.text('Actual Date Of Discharge From :- '+ this.fromdate,15,23);
      doc.text('Actual Date Of Discharge To :- '+ this.todate,110,23);
      doc.text('Trigger Name :- '+ triggername,15,31);
      doc.text('GeneratedOn :- '+generatedOn,15,39);
      doc.text('GeneratedBy :- '+generatedBy,110,39);
            let rows = [];
            for(let i=0;i<this.report.length;i++) {
              let clm = this.report[i];
              let pdf = [];
              pdf[0] = clm.Slno;
              pdf[1] = clm.trigger;
              pdf[2] = clm.totalcase;
              pdf[3] = clm.pending;
              pdf[4] = clm.actiontaken;
              rows.push(pdf);
            }
            autoTable(doc, {
              head: this.heading,
              body: rows,
              theme: 'grid',
              startY: 45,
              headStyles: {
                fillColor: [26, 99, 54]
              },
              columnStyles: {
                0: {cellWidth: 10},
                // 1: {cellWidth: 42},
                // 2: {cellWidth: 42},
                // 3: {cellWidth: 42},
                // 4: {cellWidth: 42},

              }
            });
            doc.save('Abstract_M_And_E_Report.pdf');
    }
  }
}
