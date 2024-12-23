import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { PaymentfreezeserviceService } from '../Services/paymentfreezeservice.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { SnafloatgenerationserviceService } from '../snafloatgenerationservice.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-specialfloateverificationreport',
  templateUrl: './specialfloateverificationreport.component.html',
  styleUrls: ['./specialfloateverificationreport.component.scss']
})
export class SpecialfloateverificationreportComponent implements OnInit {
user:any
txtsearchDate:any;
list:any=[];
showPegi: boolean;
currentPage: any;
pageElement: any;
formdate:any
todate:any
totalcount:any=0;
snaid:any="";
snadoctorname: any="All";
snaDoctorList:any=[];
showdropdown:any=true;
keyword: any = 'fullName';

  constructor(private route:Router, public headerService: HeaderService,
    public snafloatgenerationservice:SnafloatgenerationserviceService,
    private snoService: SnocreateserviceService,
    private paymentfreeze:PaymentfreezeserviceService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("SpecialFloat Verification Report");
    this.user = this.sessionService.decryptSessionData("user");
    if(this.user.groupId==4){
      this.showdropdown=false;
      this.snaid = this.user.userId;
      this.snadoctorname = this.user.fullName;
    }
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
    var date = new Date();

    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth();

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
    var frstDay = date1 + '-' + month + '-' + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');

    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.getSNAList();
    this.Search();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  getSNAList() {
    this.snoService.getSNODetails().subscribe(
      (response) => {
        this.snaDoctorList = response;
      },
      (error) => console.log(error)
    );
  }

  selectEvent(item) {
    this.snaid = item.userId;
    this.snadoctorname = item.fullName;
  }
  onReset1() {
    this.snaid = "";
    this.snadoctorname = "All";
  }

  Search(){
    this.formdate = $('#formdate').val();
    this.todate = $('#todate').val();
    if (this.formdate==null || this.formdate== "" || this.formdate==undefined){
      this.swal("Warning", "Please Fill From Date", 'info');
      return;
    }
    if (this.todate==null || this.todate== "" || this.todate==undefined){
      this.swal("Warning", "Please Fill To Date", 'info');
      return;
    }
    if (Date.parse(this.formdate) > Date.parse(this.todate)) {
      this.swal('Warning', ' From Date should be less Than To Date', 'error');
      return;
    }
    this.snafloatgenerationservice.getspecialfloatereport(this.formdate, this.todate,this.user.userId,this.snaid).subscribe((data:any)=>{
     if(data.status==200){
      this.list=data.data;
      this.totalcount=this.list.length;
      if(this.totalcount>0){
        this.showPegi=true
        this.currentPage=1
        this.pageElement=100
      }else{
        this.showPegi=true
      }
     }else{
      this.swal("Error",data.message,"error")
     }
    },
    (error) => console.log(error)
    );
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'SNA Name','Special Float No']];
  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna=this.list[i];
      this.sno=[];
      this.sno.push(i+1);
      this.sno.push(sna.snaName);
      this.sno.push(sna.splflaote);
      this.report.push(this.sno);
    }
    if(no==1){
      let filter =[];
      filter.push([['Actual Date Of Discharge From', this.formdate]]);
      filter.push([['Actual Date Of Discharge To', this.todate]]);
      filter.push([['SNA Doctor Name', this.snadoctorname]]);
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'SpecialFolat Verification Report',
          this.heading,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm',[297,210 ]);
      doc.setFontSize(20);
      doc.text("SpecialFolat Verification Report", 65, 15);
      doc.setFontSize(13);
      doc.text('GeneratedOn :- '+generatedOn,15,25);
      doc.text('GeneratedBy :- '+generatedBy,15,33);
      doc.text('Actual Date Of Discharge From :- '+ this.formdate,15,41);
      doc.text('Actual Date Of Discharge To :- '+ this.todate,15,49);
      doc.text('SNA Doctor Name :- '+ this.snadoctorname,15,57);
        autoTable(doc, {
          head: this.heading,
          body: this.report,
          theme: 'grid',
          startY: 65,
          headStyles: {
            fillColor: [26, 99, 54]
          },
          columnStyles: {
            0: {cellWidth: 10},
          }
        });
        doc.save('SpecialFolat_Verification_Report.pdf');
    }
  }

  downlorfloatedoc(doc:any,float:any){
    if (doc != null && doc != '' && doc != undefined) {
      let data={
        floatDoc:doc,
        floateno:float
      }
      let img = this.paymentfreeze.downloadFloatFiles(data);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'There Is No File', 'info');
    }
  }

}
