import { Component, OnInit } from '@angular/core';
declare let $: any;
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { NotificationService } from '../../Services/notification.service';
import { SurverconfurationService } from '../../Services/surverconfuration.service';
import { UsercreateService } from '../../Services/usercreate.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-surveymaster',
  templateUrl: './surveymaster.component.html',
  styleUrls: ['./surveymaster.component.scss']
})
export class SurveymasterComponent implements OnInit {
  groupList:any;
  maxChars = 500;
  user:any;
  user1:any;
  showbth: boolean=false;
  status: any;
  updatedata={
    surveyname:'',
    fromdate:'',
    todate:'',
    statusFlag:'',
    id:''
  }

  constructor( public headerService: HeaderService,private route:Router,
    private surveyserv:SurverconfurationService,private sessionService: SessionStorageService) {
    this.user1 = this.route.getCurrentNavigation().extras.state;
   }


  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle("Survey Master");
    let date=new Date();
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1);
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
    if(this.user1!=undefined){
      this.updatedata.surveyname=this.user1.surveyname
      this.updatedata.fromdate=this.user1.fromdate
      $('input[name="fromDate"]').val(this.updatedata.fromdate);
      this.updatedata.todate=this.user1.todate
      $('input[name="toDate"]').val(this.updatedata.todate);
      this.updatedata.statusFlag=this.user1.status
      this.status=this.user1.status
      this.updatedata.id=this.user1.id
      this.showbth=true;
    }
  }
  yes(val: any) {
    this.status = val;
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {;
        event.preventDefault();
    }
}
submit(){
  let fromdate=$('#fromDate').val();
  let todate=$('#toDate').val();
  let survey=$('#survey').val().trim();
  if (fromdate==null || fromdate== "" || fromdate==undefined){
    this.swal("Info", "Please Fill From Date !", 'info');
    return;
  }
  if (todate==null || todate== "" || todate==undefined){
    this.swal("Info", "Please Fill To Date !", 'info');
    return;
  }
  if (Date.parse(fromdate) > Date.parse(todate)) {
    this.swal('Warning', ' From Date should be less Than To Date !', 'error');
    return;
  }
  if (survey==null || survey== "" || survey==undefined){
    this.swal("Info", "Please Fill Survey Name !", 'info');
    $('#survey').val('');
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
        let data={
          surveyName:survey,
          sfromdate:fromdate,
          stodate:todate,
          createdBy:this.user.userId
        }
        this.surveyserv.savesurveymst(data).subscribe((survey:any) => {
          if(survey.status==200){
            this.swal("Success", survey.message, "success");
            this.route.navigate(['/application/viewsurveymater']);
          }else{
            this.swal("Error", survey.message, "error");
          }
        });
    }
  });
}
Reset(){
  window.location.reload();
}
cancel(){
  this.route.navigate(['application/viewsurveymater']);
}
update(){
  let fromdate=$('#fromDate').val();
  let todate=$('#toDate').val();
  let survey=$('#survey').val().trim();
  if (fromdate==null || fromdate== "" || fromdate==undefined){
    this.swal("Info", "Please Fill Form Date !", 'info');
    return;
  }
  if (todate==null || todate== "" || todate==undefined){
    this.swal("Info", "Please Fill To Date !", 'info');
    return;
  }
  if (Date.parse(fromdate) > Date.parse(todate)) {
    this.swal('Warning', ' From Date should be less To Date !', 'error');
    $('#survey').val('');
    return;
  }
  if (survey==null || survey== "" || survey==undefined){
    this.swal("Info", "Please Fill Survey Name !", 'info');
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
      let data={
        surveyName:survey,
        sfromdate:fromdate,
        stodate:todate,
        updatedBy:this.user.userId,
        surveyId:this.user1.id,
        statusFlag:this.status
      }
      this.surveyserv.updatesurveymst(data).subscribe((survey:any) => {
        if(survey.status==200){
          this.swal("Success", survey.message, "success");
          this.route.navigate(['/application/viewsurveymater']);
        }else{
          this.swal("Error", survey.message, "error");
        }
      });
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
}
