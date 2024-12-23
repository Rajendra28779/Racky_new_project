import { CurrencyPipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { BenificiarydistrictwisedataService } from '../Services/benificiarydistrictwisedata.service';
import { TableUtil } from '../util/TableUtil';
declare let $: any;

@Component({
  selector: 'app-statedashboareddata',
  templateUrl: './statedashboareddata.component.html',
  styleUrls: ['./statedashboareddata.component.scss']
})
export class StatedashboareddataComponent implements OnInit {
  user:any;;
  list:any=[];
  record:any=0;
  showPegi:boolean=false;
  currentPage:any;
  pageElement:any;
  formdate:any;
  todate:any;
  txtsearchDate:any;
  sum:any=0;
  sum1:any=0;


  constructor(public headerService: HeaderService,
     public route: Router,
     private sesonservice:SessionStorageService,
     private beneficiarydistrictwiseserv:BenificiarydistrictwisedataService,) { }

  ngOnInit(): void {
    this.headerService.setTitle('State Dashboard Data');
    this.user = this.sesonservice.decryptSessionData("user");

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
      format: 'YYYY-MM-DD LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');

    this.Search();
  }

  Search(){
    this.formdate = $('#formdate').val();
    this.todate = $('#todate').val();
    this.beneficiarydistrictwiseserv.getstatedashboarddata(this.formdate,this.todate).subscribe((data:any)=>{
      if(data.status==200){
        this.list = data.data;
        this.record=this.list.length;
        if(this.record>0){
          let sum=0;
          let sum1=0;
            for(const element of this.list){
              sum+=parseInt(element.totaldischarge);
              sum1+=parseInt(element.totalamount);
            }
          this.sum=sum;
          this.sum1=sum1;
          this.showPegi=true;
          this.currentPage=1;
          this.pageElement=50
        }else{
          this.showPegi=false;
          // this.swal('Info',"NO Data Found !!",'info')
        }
      }else{
        this.swal('Error',"Something Went Wrong",'error')
      }
    });
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'Claim Submited Date','Total Discharged','Total Amount Claimed']];
  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna=this.list[i];
      this.sno=[];
      this.sno.push(i+1);
      this.sno.push(sna.createon);
      this.sno.push(sna.totaldischarge);
      this.sno.push(this.convertCurrency(sna.totalamount));
      this.report.push(this.sno);
    }
    this.sno=[];
    this.sno.push("");
    this.sno.push("Total");
    this.sno.push(this.sum);
    this.sno.push(this.convertCurrency(this.sum1));
    this.report.push(this.sno);

    if(no==1){
      let filter =[];
      filter.push([['Claim Submit From Date', this.formdate]]);
      filter.push([['Claim Submit To Date', this.todate]]);
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'State Dashboard Data Report',
          this.heading,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('p', 'mm',[297,210 ]);
      doc.setFontSize(20);
      doc.text("State Dashboard Data Report", 60, 15);
      doc.setFontSize(13);
      doc.text('GeneratedOn :- '+generatedOn,15,25);
      doc.text('Claim Submit From Date :- '+ this.formdate +' To Date :- '+ this.todate,15,41);
      doc.text('GeneratedBy :- '+generatedBy,15,33);
        autoTable(doc, {
          head: this.heading,
          body: this.report,
          theme: 'grid',
          startY: 50,
          headStyles: {
            fillColor: [26, 99, 54]
          },
          columnStyles: {
            0: {cellWidth: 10},
          }
        });
        doc.save('State Dashboard Data.pdf');
    }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  convertCurrency(amount: any){
    var formatter = new CurrencyPipe('en-IN');
    amount = formatter.transform(amount, '', '');
    return amount;
  }

}
