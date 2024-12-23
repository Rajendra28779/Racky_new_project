import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { ForemarkService } from '../../Services/foremark.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-foremark',
  templateUrl: './foremark.component.html',
  styleUrls: ['./foremark.component.scss']
})
export class ForemarkComponent implements OnInit {
  showupdate:boolean;
  maxChars = 200;
  childmessage: any;
  globallink!: FormGroup;
  user: any;
  user1: any;
  update: any;
  status:any;
  dataa:any;
  getbyid={
    remark:"",
    description:"",
    isactive:"",
  };
  id:any;

  constructor(private route:Router,public headerService:HeaderService,private foremarkservice:ForemarkService, private sessionService: SessionStorageService) {
    this.user1 = this.route.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.headerService.setTitle('FO Remark');
    this.user = this.sessionService.decryptSessionData("user");
    this.showupdate=false;
    // console.log(this.user1);
    if(this.user1!=undefined){
      this.showupdate=true
      this.getbyid.remark=this.user1.user.remark;
      this.getbyid.description=this.user1.user.description;
      this.getbyid.isactive=this.user1.user.status;
      this.status=this.user1.user.status;
      this.id=this.user1.user.remarkid;
    }
  }

  yes($event: any) {
    this.status = 0;
  }

  no($event: any) {
    this.status = 1;
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  reset(){
    this.route.navigate(['/application/foremarkview']);
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  group=new FormGroup({
    remark:new FormControl(''),
    description:new FormControl(''),
  });

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        // invalid character, prevent input
        event.preventDefault();
    }
}

save(){
  var remark = $('#globalname').val().toString().trim();
  var description = $('#globaldescription').val().toString().trim();
  if (remark==null || remark== "" || remark==undefined){
    this.swal("Info", "Please Fill FO Remark", 'info');
    return;
  }
  if (description==null || description== "" || description==undefined){
    this.swal("Info", "Please Fill Description", 'info');
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
        remark:remark,
        createdBy:this.user.userId,
        description:description,
      }
      this.foremarkservice.save(object).subscribe(data=>{
       // console.log(data)
        this.dataa=data;
        if (this.dataa.status == 200) {
          this.swal("Success", this.dataa.message, "success");
          this.group.reset();
          this.route.navigate(['/application/foremarkview']);
        }else if(this.dataa.status == "400"){
          this.swal("Error",this.dataa.message, "error");
        }

      });
    }
  })
}

updateremark(){
  var remark = $('#globalname').val().toString().trim();
  var description = $('#globaldescription').val().toString().trim();
  if (remark==null || remark== "" || remark==undefined){
    this.swal("Info", "Please Fill FO Remark", 'info');
    return;
  }
  if (description==null || description== "" || description==undefined){
    this.swal("Info", "Please Fill Description", 'info');
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
        remark:remark,
        createdBy:this.user.userId,
        description:description,
        remarkid:this.id,
        status:this.status
      }
      this.foremarkservice.update(object).subscribe(data=>{
       console.log(data)
        this.dataa=data;
        if (this.dataa.status == 200) {
          this.swal("Success", this.dataa.message, "success");
          this.group.reset();
          this.route.navigate(['/application/foremarkview']);
        }else if(this.dataa.status == 400){
          this.swal("Error",this.dataa.message, "error");
        }

      });
    }
  })
}

}
