import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { SchedularserviceService } from '../Services/schedularservice.service';
import { TableUtil } from '../util/TableUtil';
import { HeaderService } from './../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-dbscheduler-view',
  templateUrl: './dbscheduler-view.component.html',
  styleUrls: ['./dbscheduler-view.component.scss']
})
export class DbschedulerViewComponent implements OnInit {
  selectedTime: Date = new Date();
  totalcount:any=0;
  txtsearchDate:any;
  showPegi:any=false;
  currentPage:any;
  pageElement:any;
  list:any=[];
  user:any;
  remark: any;
  status:any;
  timedata = 60;

  constructor(public headerService: HeaderService,
    public schedularserv:SchedularserviceService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('DB-Scheduler Configuration');
    this.user=this.sessionService.decryptSessionData("user");
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    this.getschedulerlist();
  }

  getschedulerlist(){
    this.schedularserv.getallschedulerlist().subscribe((data:any)=>{
      this.list=data;
      this.totalcount=this.list.length;
      if(this.totalcount>0){
        this.showPegi=true
        this.currentPage=1
        this.pageElement=100
      }else{
        this.showPegi=true
      }
    },
    (error) => console.log(error)
    );
  }

  editeddata={
    procedurename:'',
    schedularname:'',
    runninginterval:'',
    runningtime:'',
    proceduredescrioption:'',
    status:0,
    id:'',
    updatedby:'',
    remark:''
  };
  maxChars:any=1000;
  maxChars1:any=500;
  edit(item:any){
    this.editeddata=item;
    this.status=this.editeddata.status;
    $('#editscheduler').show();
    $("#remarks").val('');
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
  }
  keyPress1(event: KeyboardEvent) {
    const pattern = /^[a-zA-Z_]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
  }
  keyPress2(event: KeyboardEvent) {
    const pattern = /^[a-zA-Z]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
  }

  yes($event: any) {
    this.status = 0;
  }

  no($event: any) {
    this.status = 1;
  }

  close(){$('#editscheduler').hide();}

  view(item:any){this.remark=item;}

  update(){
    let runningtime=$("#runningtime").val();
    this.editeddata.runningtime=runningtime;
    this.editeddata.remark=$("#remarks").val();
    if (this.editeddata.procedurename==null || this.editeddata.procedurename== "" || this.editeddata.procedurename==undefined){
      $("#procedurename").focus();
      this.swal("Info", "Please Enter Procedure Name", 'info');
      return;
    }
    if (this.editeddata.schedularname==null || this.editeddata.schedularname== "" || this.editeddata.schedularname==undefined){
      $("#schedularname").focus();
      this.swal("Info", "Please Enter Schedular Name", 'info');
      return;
    }
    if (this.editeddata.runninginterval==null || this.editeddata.runninginterval== "" || this.editeddata.runninginterval==undefined){
      $("#runninginterval").focus();
      this.swal("Info", "Please Enter Running Interval", 'info');
      return;
    }
    if (this.editeddata.runningtime==null || this.editeddata.runningtime== "" || this.editeddata.runningtime==undefined){
      $("#runningtime").focus();
      this.swal("Info", "Please Enter Running Time", 'info');
      return;
    }
    if (this.editeddata.proceduredescrioption==null || this.editeddata.proceduredescrioption== "" || this.editeddata.proceduredescrioption==undefined){
      $("#proceduredescrioption").focus();
      this.swal("Info", "Please Enter Description", 'info');
      return;
    }
    if (this.editeddata.remark==null || this.editeddata.remark== "" || this.editeddata.remark==undefined){
      $("#remarks").focus();
      this.swal("Info", "Please Enter Remark", 'info');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
       text: "You want to Update this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.generateotp();
      }
    });
  }

  updatequery(){
    this.editeddata.updatedby=this.user.userId;
    this.editeddata.status=this.status;
    this.schedularserv.updatescheduler(this.editeddata).subscribe((data:any) => {
      if (data.status == 200) {
        this.swal("Success", data.message, "success");
        $('#editscheduler').hide();
        this.getschedulerlist();
      }else {
        this.swal("Error", data.message, "error");
      }
    });
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
    procdure: "",
    scheduler: "",
    runninterval: "",
    runntime: "",
    remark: "",
    status: "",
  };
  heading = [['Sl#', 'Procedure Name','Scheduler Name','Running Interval', 'Running Time','Remark','Status']];

  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna=this.list[i];
      this.sno=[];
      this.sno.Slno=i+1;
      this.sno.procdure=sna.procedurename;
      this.sno.scheduler=sna.schedularname;
      this.sno.runninterval=sna.runninginterval;
      this.sno.runntime=sna.runningtime;
      this.sno.remark=sna.proceduredescrioption;
      this.sno.status=sna.statusflag;
      this.report.push(this.sno);
    }
    if(no==1){
      let filter =[];
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'Scheduler List',
          this.heading,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm',[297,210 ]);
      doc.setFontSize(20);
      doc.text("Scheduler List", 120, 15);
      doc.setFontSize(12);
      doc.text('GeneratedOn :- '+generatedOn,180,23);
      doc.text('GeneratedBy :- '+generatedBy,15,23);
            var rows = [];
            for(var i=0;i<this.report.length;i++) {
              var clm = this.report[i];
              var pdf = [];
              pdf[0] = clm.Slno;
              pdf[1] = clm.procdure;
              pdf[2] = clm.scheduler;
              pdf[3] = clm.runninterval;
              pdf[4] = clm.runntime;
              pdf[5] = clm.remark;
              pdf[6] = clm.status;
              rows.push(pdf);
            }
            autoTable(doc, {
              head: this.heading,
              body: rows,
              theme: 'grid',
              startY: 30,
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
            doc.save('Scheduler List.pdf');
    }
  }


  userDetails:any;
  otpvalidate:any;
  generateotp(){
    this.schedularserv.generateotp().subscribe((data:any)=>{
      this.timedata=60
      this.userDetails=data;
        if(this.userDetails.status=='success'){
          $('#exampleOtpModal').show();
          $('#otpId').val('');
          $('#sendId').show();
              $('#reSendId').hide();
              $('#timeCounter').show();
              $('#timerdivId').show();
              $('#mobileNoId').show();
              $('#phoneId').show();
          let phoneNo = this.userDetails.phone;
          let timeleft = this.timedata;
          let downloadTimer = setInterval(function() {
            if (timeleft <= 0) {
              clearInterval(downloadTimer);
              // document.getElementById("countdown").innerHTML = "Finished";
              $('#sendId').hide();
              $('#reSendId').show();
              $('#timeCounter').hide();
              $('#timerdivId').hide();
              $('#mobileNoId').hide();
              $('#phoneId').hide();
            } else {
              $('#timeCounter').val(timeleft + " seconds remaining");
              $('#mobileNoId').val("OTP is sent to your " +phoneNo+ " mobile number" );
            }
            timeleft -= 1;
          }, 1000);
        }else{
          this.swal('Error',this.userDetails.message,'error')
        }
    },
    (error) => console.log(error)
    );
  }

  closemodeal(){
    $('#exampleOtpModal').hide();
  }
  validateOtp() {
    let otp=$('#otpId').val();
    if(otp=='' || otp==null || otp==undefined){
      this.swal('', 'Please Provide Otp !', 'error');
      return;
    }
    this.schedularserv.validateotpforscheduler(otp).subscribe((data:any)=>{
        this.otpvalidate=data;
        if(this.otpvalidate.status=='success'){
          $('#exampleOtpModal').hide();
          this.updatequery();
        }else{
          this.swal('Error',this.otpvalidate.message,'error')
        }
    },
    (error) => console.log(error)
    );
  }
  onResendOtp() {
    this.generateotp();
  }

}
