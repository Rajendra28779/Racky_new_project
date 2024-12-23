import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { MessageServiceService } from '../../Services/message-service.service';
import Swal from 'sweetalert2';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-message-master',
  templateUrl: './message-master.component.html',
  styleUrls: ['./message-master.component.scss'],
})
export class MessageMasterComponent implements OnInit {
  public Editor = ClassicEditor;
  childmessage:any;
  showupdate:any=false
  maxChars = 500;
  maxChars1 = 500;
  user:any;
  editorvalue:any;
  status:any
  sendstatus:any=0;
res:any;
user1:any
getbyid={
  type:"",
  prps:"",
  cnct:"",
  cnctfmt:"",
  isactive:"",
  tempid:"",
  remarks:""
};


  constructor(private route:Router,public headerService:HeaderService,private service:MessageServiceService, private sessionService: SessionStorageService) {
    this.user1 = this.route.getCurrentNavigation().extras.state;
  }

  group=new FormGroup({
    // globalname:new FormControl(''),
    functiondescription:new FormControl(''),
    global:new FormControl(''),
    prps:new FormControl(''),
    temp:new FormControl(''),
    edit:new FormControl(''),
    remarks:new FormControl(''),
  });

  ngOnInit(): void {
    this.headerService.setTitle('Message Master');
    this.user = this.sessionService.decryptSessionData("user");
    if(this.user1!=undefined){
      this.getbyid.type=this.user1.user.messagetype
      this.getbyid.prps=this.user1.user.messageprps
      this.getbyid.cnct=this.user1.user.messagecontaint
      this.getbyid.tempid=this.user1.user.tempid
      this.getbyid.remarks=this.user1.user.remarks
      this.sendstatus=this.user1.user.smsstatus;
      this.getbyid.isactive=this.user1.user.statusflag
      this.status=this.user1.user.statusflag
      this.model.editorData=this.user1.user.messagecontaintformat;
      this.editorvalue=this.user1.user.messagecontaintformat;
      this.showupdate=true;

    }
  }

  public model = {
    editorData:""
};
public config = {
  placeholder: 'Type the content here!'
}

  yes($event: any) {
    this.status = 0;
  }

  no($event: any) {
    this.status = 1;
  }
  yes1($event: any) {
    this.sendstatus = 0;
  }

  no1($event: any) {
    this.sendstatus = 1;
  }



  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        // invalid character, prevent input
        event.preventDefault();
    }
}
  keyPress1(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        // invalid character, prevent input
        event.preventDefault();
    }
}

public onChange( { editor }: ChangeEvent ) {
  this.editorvalue = editor.getData();

}

swal(title: any, text: any, icon: any) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text
  });
}

submit(){
  let mtype=$('#global').val();
  let mpurps=$('#purpose').val();
  let mcont=$('#msgcontain').val();
  let temp=$('#temp').val();
  let remarks=$('#remarks').val();
  if (mtype==null || mtype== "" || mtype==undefined){
    this.swal("Info", "Please Select Message-Type !", 'info');
    return;
  }
  if (mpurps==null || mpurps== "" || mpurps==undefined){
    this.swal("Info", "Please Fill Message-Purpose !", 'info');
    return;
  }
  if (mcont==null || mcont== "" || mcont==undefined){
    this.swal("Info", "Please Fill Message-Content !", 'info');
    return;
  }
  if (this.editorvalue==null || this.editorvalue== "" || this.editorvalue==undefined){
    this.swal("Info", "Please Fill Message-Editor !", 'info');
    return;
  }
  if (remarks==null || remarks== "" || remarks==undefined){
    this.swal("Info", "Please Fill Remarks !", 'info');
    return;
  }
  Swal.fire({
    title: 'Are you sure?',
    // text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Save it!'
  }).then((result) => {
    if (result.isConfirmed) {
        let object={
          messagetype:mtype,
          messageprps:mpurps,
          messagecontaint:mcont,
          messagecontaintformat:this.editorvalue,
          createdby:this.user.userId,
          tempid:temp,
          remarks:remarks,
          smsstatus:this.sendstatus
        }
      this.service.savemessagedata(object).subscribe(data=>{
        this.res=data
        if(this.res.status=="Success"){
          this.swal("Success", this.res.message, "success");
          this.route.navigate(['/application/viewmessagemaster']);
        }else if(this.res.status=="Failed"){
          this.swal("Error",this.res.message, "error");
        }else{
          this.swal("Error","Something Went Wrong", "Info");
        }
        });
      }
  });
}
cancel(){
  this.route.navigate(['application/viewmessagemaster']);
}
update(){
  let mtype=$('#global').val();
  let mpurps=$('#purpose').val();
  let mcont=$('#msgcontain').val();
  let temp=$('#temp').val();
  let remarks=$('#remarks').val();
  if (mtype==null || mtype== "" || mtype==undefined){
    this.swal("Info", "Please Select Message-Type !", 'info');
    return;
  }
  if (mpurps==null || mpurps== "" || mpurps==undefined){
    this.swal("Info", "Please Fill Message-Purpose !", 'info');
    return;
  }
  if (mcont==null || mcont== "" || mcont==undefined){
    this.swal("Info", "Please Fill Message-Content !", 'info');
    return;
  }
  if (this.editorvalue==null || this.editorvalue== "" || this.editorvalue==undefined){
    this.swal("Info", "Please Fill Message-Editor !", 'info');
    return;
  }
  if (remarks==null || remarks== "" || remarks==undefined){
    this.swal("Info", "Please Fill Remarks !", 'info');
    return;
  }
  Swal.fire({
    title: 'Are you sure?',
    // text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Save it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.user1.user.messagetype=mtype
      this.user1.user.messageprps=mpurps
      this.user1.user.messagecontaint=mcont
      this.user1.user.statusflag=this.status
      this.user1.user.messagecontaintformat=this.editorvalue
      this.user1.user.remarks=remarks;
      this.user1.user.smsstatus=this.sendstatus;
      this.user1.user.updatedby=this.user.userId
      this.user1.user.tempid=temp

      this.service.updatemessage(this.user1.user).subscribe(data=>{
        this.res=data
        if(this.res.status=="Success"){
          this.swal("Success", this.res.message, "success");
          this.route.navigate(['/application/viewmessagemaster']);
        }else if(this.res.status=="Failed"){
          this.swal("Error",this.res.message, "error");
        }else{
          this.swal("Error","Something Went Wrong", "info");
        }
        });
      }
  });

}
}
