import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { CpdleaveService } from '../../Services/cpdleave.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { TableUtil } from '../../util/TableUtil';
declare let $: any;

@Component({
  selector: 'app-sna-leave-view',
  templateUrl: './sna-leave-view.component.html',
  styleUrls: ['./sna-leave-view.component.scss']
})
export class SnaLeaveViewComponent implements OnInit {
  user: any
  txtsearchDate: any;
  list: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount: any = 0;
  fromdate: any;
  todate: any;
  showdropdown:any=false;
  snadoctor:any="";
  keyword: any = 'fullName';
  snaDoctorList:any=[];

  constructor(private sessionService: SessionStorageService,private cpdleaveservice:CpdleaveService,
    public headerService: HeaderService,private snoService: SnocreateserviceService,
    private route:Router) { }

  ngOnInit(): void {
    this.headerService.setTitle('SNA Leave Apply');
    this.user =  this.sessionService.decryptSessionData("user");

    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // minDate: new Date(),
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
    $('input[name="todate1"]').attr('placeholder', 'To Date *');
    if(this.user.groupId==4){
      this.showdropdown=false;
    }else{
      this.showdropdown=true;
      this.getSNAList();
    }

    this.getlist();

  }

  getSNAList() {
    this.snoService.getSNODetails().subscribe(
      (response) => {
        this.snaDoctorList = response;
      },
      (error) => console.log(error)
    )
  }

  selectEvent(item) {
    this.snadoctor = item.userId;
  }
  onReset() {
    this.snadoctor = "";
  }

  getlist(){
    this.fromdate = $('#formdate1').val();
    this.todate = $('#todate1').val();
    if (Date.parse(this.fromdate) > Date.parse(this.todate)) {
      this.swal('Warning', ' From Date should be less Than To Date', 'error');
      return;
    }

    this.cpdleaveservice.getsnappliedleavelist(this.fromdate,this.todate,this.snadoctor,this.user.userId).subscribe((data:any) => {
      if (data.status == 200) {
        this.list = data.data;
        this.totalcount = this.list.length;
        if (this.totalcount > 0) {
          this.showPegi = true
          this.currentPage = 1
          this.pageElement = 100
        } else {
          this.showPegi = false
        }
      } else {
        this.showPegi = false
        this.swal("Error", 'Something Went Wrong', "error");
      }
    });
  }


  Reset(){
    window.location.reload();
  }


  report: any = [];
  heading = [
    ['Sl#', 'SNA Doctor Name', 'From Date', 'To Date', 'No Of Days',
     'Remark', 'Applied By', 'Applied On','Status']
  ];
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];

    for (let i = 0; i < this.list.length; i++) {
      let v = this.list[i];
      let sno = [];
      sno.push(i + 1); // Sl# (handles pagination)
      sno.push(v.snaName); // SNA Doctor Name
      sno.push(v.fromDate); // From Date
      sno.push(v.toDate); // To Date
      sno.push(v.noofDays); // No Of Days
      sno.push(v.remark); // Remark
      sno.push(v.createdBy); // Applied By
      sno.push(v.createdOn); // Applied On
      sno.push(v.status); // status
      this.report.push(sno);
    }

    if (no == 1) {
      let filter = [];
      filter.push([['From Date', this.fromdate]]);
      filter.push([['To Date', this.todate]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'SNA Leave Report',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("SNA Leave Report", 70, 15);
      doc.setFontSize(13);
      doc.text('From Date:- ' + this.fromdate, 15, 25);
      doc.text('To Date:- ' + this.todate, 15, 32);
      doc.text('GeneratedOn :- ' + generatedOn, 15, 39);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 46);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 50,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('SNA_Leave_Report.pdf');
    }
  }


  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  cancelLeave(leaveId:any){

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!!'
    }).then((result) => {
      if (result.isConfirmed) {
          this.cpdleaveservice.cancelsnaleaveApply(leaveId,this.user.userId).subscribe((data:any) => {
            if(data.status == 200){
              this.swal('Success', 'Leave Canceled Successfully', 'success');
              this.getlist();
            }else{
              this.swal('Error', 'Something Went Wrong', 'error');
            }
          });
      }
    });
  }

  showPreDoc1(text, index) {
    $('#proceduredescription' + index).text(text);
    $('#showMoreId6' + index).empty()
    $('#showMoreId7' + index).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hidePreDoc1(text, index) {
    if (text.length > 30) {
      $('#proceduredescription' + index).text(text.substring(0, 30) + '...');
      $('#showMoreId7' + index).empty()
      $('#showMoreId6' + index).empty();
      $('#showMoreId6' + index).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
}
