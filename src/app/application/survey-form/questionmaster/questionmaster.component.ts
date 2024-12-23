import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { SurverconfurationService } from '../../Services/surverconfuration.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-questionmaster',
  templateUrl: './questionmaster.component.html',
  styleUrls: ['./questionmaster.component.scss']
})
export class QuestionmasterComponent implements OnInit {
  maxChars = 500;
  user:any;
  mandtory:any=1;
  user1:any;
  updatebtn:boolean=false;
  updatedata={
    questionName:'',
    questionType:'',
    mandotoryRemark:'',
    statusFlag:'',
    id:''
  }
  statusval:any=0;

  constructor(public headerService: HeaderService,private route:Router,
    private surveyserv:SurverconfurationService,private sessionService: SessionStorageService) {
      this.user1 = this.route.getCurrentNavigation().extras.state;
    }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle("Question Master");
    if(this.user1){
      this.updatedata.questionName=this.user1.question
      this.updatedata.questionType=this.user1.questiontype
      this.updatedata.mandotoryRemark=this.user1.mandotory
      this.mandtory=this.user1.mandotory
      this.updatedata.statusFlag=this.user1.status
      this.statusval=this.user1.status
      this.updatedata.id=this.user1.id
      this.updatebtn=true;
    }
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
  }

  checked(val:any){
  this.mandtory=val;
  }
  status(val:any){
    this.statusval=val;
  }

  update(){
    let question=$('#question').val().trim();
    let qustype=$('#questiontype').val();
    if (question==null || question== "" || question==undefined){
      this.swal("Info", "Please Fill Question !", 'info');
      $('#questiontype').val('');
      return;
    }
    if (qustype==null || qustype== "" || qustype==undefined){
      this.swal("Info", "Please Fill Question Type !", 'info');
      return;
    }

    let data={
      questionName:question,
      questionType:qustype,
      mandotoryRemark:this.mandtory,
      statusFlag:this.statusval,
      questionId:this.updatedata.id,
      updatedBy:this.user.userId
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
            this.surveyserv.updatequestionmaster(data).subscribe((data:any) => {
              if(data.status==200){
                this.swal("Success", data.message, "success");
                this.route.navigate(['/application/viewquestionmstsurvey']);
              }else{
                this.swal("Error", data.message, "error");
              }
          });
        }
      });
  }

  submit(){
    let question=$('#question').val().trim();
    let qustype=$('#questiontype').val();
    if (question==null || question== "" || question==undefined){
      this.swal("Info", "Please Fill Question !", 'info');
      $('#questiontype').val('');
      return;
    }
    if (qustype==null || qustype== "" || qustype==undefined){
      this.swal("Info", "Please Fill Question Type !", 'info');
      return;
    }

    let data={
      questionName:question,
      questionType:qustype,
      mandotoryRemark:this.mandtory,
      createdBy:this.user.userId
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
            this.surveyserv.savequestionmaster(data).subscribe((data:any) => {
              if(data.status==200){
                this.swal("Success", data.message, "success");
                this.route.navigate(['/application/viewquestionmstsurvey']);
              }else{
                this.swal("Error", data.message, "error");
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

  Reset(){
window.location.reload();
  }
  cancel(){
    this.route.navigate(['/application/viewquestionmstsurvey']);
  }

}
