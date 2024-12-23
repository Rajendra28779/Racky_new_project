import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { CpdleaveService } from '../../Services/cpdleave.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
declare let $: any;

@Component({
  selector: 'app-sna-leave-apply',
  templateUrl: './sna-leave-apply.component.html',
  styleUrls: ['./sna-leave-apply.component.scss']
})
export class SnaLeaveApplyComponent implements OnInit {
  showdropdown:any=false;
  user:any;
  snaDoctorList:any=[];
  snadoctor:any="";
  keyword: any = 'fullName';
  maxChars:any=500;
  diffDays:any=1;

  constructor(private sessionService: SessionStorageService,private cpdleaveservice:CpdleaveService,
    public headerService: HeaderService,private snoService: SnocreateserviceService,
    private route:Router) { }

  ngOnInit(): void {
    this.headerService.setTitle('SNA Leave Apply');
    this.user =  this.sessionService.decryptSessionData("user");

    let date = new Date();
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      minDate: today,
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
    $('input[name="todate"]').attr('placeholder', 'To Date *');
    if(this.user.groupId==4){
      this.showdropdown=false;
      this.snadoctor=this.user.userId;
    }else{
      this.showdropdown=true;
      this.getSNAList();
    }


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
  onReset1() {
    this.snadoctor = "";
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  calculateDays(event: any){
    const fromdate = $('#formdate').val();
    const todate = $('#todate').val();
    if (Date.parse(fromdate) > Date.parse(todate)) {
      this.swal('Warning', ' From Date should be less Than To Date', 'error');
      return;
    }
    const diffTime = Math.abs(new Date(fromdate).getTime() - new Date(todate).getTime());
    this.diffDays = Math.ceil((diffTime / (1000 * 60 * 60 * 24))+1);
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  Reset(){
    window.location.reload();
  }

  saveLeave(){
    if (this.snadoctor == null || this.snadoctor == "" || this.snadoctor == undefined) {
      this.swal("Info", "Please Select SNA Doctor", 'info');
      return;
    }
    const fromdate = $('#formdate').val();
    const todate = $('#todate').val();
    if (Date.parse(fromdate) > Date.parse(todate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    if (this.diffDays > 365) {
      this.swal('', 'You can Apply maximum 365 days', 'error');
      return;
    }
    const remarks = $('#remarks').val();
    if (remarks == null || remarks == "" || remarks == undefined) {
      this.swal("Info", "Please Enter Description", 'info');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Apply For Leave!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!!'
    }).then((result) => {
      if (result.isConfirmed) {

          let object ={
            snaId:this.snadoctor,
            sfromDate:fromdate,
            stoDate:todate,
            noofDays:this.diffDays,
            remarks:remarks,
            createdBy:this.user.userId
          }
          this.cpdleaveservice.savesnaleaveApply(object).subscribe((data:any) => {
            if(data.status == 200){
              this.swal('Success', 'Leave Applied Successfully', 'success');
              this.route.navigate(['/application/snaleaveapplyview']);
            }else if(data.status == 401){
              this.swal('Error', 'Leave Already Applied', 'error');
            }else{
              this.swal('Error', 'Something Went Wrong', 'error');
            }
          });
      }
    });
  }

}
