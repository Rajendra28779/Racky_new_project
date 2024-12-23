import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { SchedularserviceService } from '../Services/schedularservice.service';
import { HeaderService } from './../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;
@Component({
  selector: 'app-dbscheduler-add',
  templateUrl: './dbscheduler-add.component.html',
  styleUrls: ['./dbscheduler-add.component.scss']
})
export class DbschedulerAddComponent implements OnInit {
  selectedTime: Date = new Date();
  addForm:any;
  maxChars:any=1000;
  timedata = 60;
  user:any

  constructor(public headerService: HeaderService,public fb: FormBuilder,
    public schedularserv:SchedularserviceService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('DB-Scheduler Configuration');
    this.headerService.isIndicate(false);
    this.user= this.sessionService.decryptSessionData("user");
    $('.timepicker').datetimepicker({
      format: 'LT',
      // daysOfWeekDisabled: ['', 7],
    });
    this.addForm = this.fb.group({
      procedurename: [''],
      schedularname: [''],
      runninginterval: [''],
      runningtime: [''],
      proceduredescrioption: [''],
      createdby: [''],
      status:['']
    });
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

  valiadte(){
    let runningtime=$("#runningtime").val();
    this.addForm.value.runningtime=runningtime;
    if (this.addForm.value.procedurename==null || this.addForm.value.procedurename== "" || this.addForm.value.procedurename==undefined){
      $("#procedurename").focus();
      this.swal("Info", "Please Enter Procedure Name", 'info');
      return;
    }
    if (this.addForm.value.schedularname==null || this.addForm.value.schedularname== "" || this.addForm.value.schedularname==undefined){
      $("#schedularname").focus();
      this.swal("Info", "Please Enter Schedular Name", 'info');
      return;
    }
    if (this.addForm.value.runninginterval==null || this.addForm.value.runninginterval== "" || this.addForm.value.runninginterval==undefined){
      $("#runninginterval").focus();
      this.swal("Info", "Please Enter Running Interval", 'info');
      return;
    }
    if (this.addForm.value.runningtime==null || this.addForm.value.runningtime== "" || this.addForm.value.runningtime==undefined){
      $("#runningtime").focus();
      this.swal("Info", "Please Enter Running Time", 'info');
      return;
    }
    if (this.addForm.value.proceduredescrioption==null || this.addForm.value.proceduredescrioption== "" || this.addForm.value.proceduredescrioption==undefined){
      $("#proceduredescrioption").focus();
      this.swal("Info", "Please Enter Description", 'info');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
       text: "You want to Save this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.generateotp();
      }
    });
  }

  submit(){
    this.addForm.value.createdby=this.user.userId;
    this.schedularserv.savescheduler(this.addForm.value).subscribe((data:any) => {
      if (data.status == 200) {
        this.swal("Success", data.message, "success");
        this.addForm.reset();
        // this.route.navigate(['application/smuserview']);
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

  userDetails:any;
  otpvalidate:any;
  generateotp(){
    this.schedularserv.generateotp().subscribe((data:any)=>{
      this.userDetails=data;
        if(this.userDetails.status=='success'){
          $('#exampleOtpModal').show();
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
          this.submit();
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
