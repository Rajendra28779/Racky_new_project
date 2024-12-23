import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { ForemarkService } from '../../Services/foremark.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-mdrmaster',
  templateUrl: './mdrmaster.component.html',
  styleUrls: ['./mdrmaster.component.scss']
})
export class MDRmasterComponent implements OnInit {
  showupdate:boolean;
  childmessage: any;
  user: any;
  user1: any;
  status:any;
  dataa:any;
  getbyid={
    docname:"",
    description:"",
    isactive:"",
  };
  id:any;

  constructor(private route:Router,public headerService:HeaderService,private foremarkservice:ForemarkService, private sessionService: SessionStorageService) {
    this.user1 = this.route.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.headerService.setTitle('MDR Document Master');
    this.user = this.sessionService.decryptSessionData("user");
    this.showupdate=false;
    if(this.user1!=undefined){
      this.showupdate=true
      this.getbyid.docname=this.user1.user.documentname;
      this.getbyid.isactive=this.user1.user.statusflag;
      this.status=this.user1.user.statusflag;
      this.id=this.user1.user.documentId;
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
    this.route.navigate(['/application/mdrdocumentmasterview']);
  }

  resetform(){
    $('#docname').val('');
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

save(){
  let docname = $('#docname').val().toString().trim();
  if (docname==null || docname== "" || docname==undefined){
    this.swal("Info", "Please Enter Document Name", 'info');
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
        documentname:docname,
        createdby:this.user.userId
      }
      this.foremarkservice.savemstdoc(object).subscribe(data=>{
        this.dataa=data;
        if (this.dataa.status == 200) {
          this.swal("Success", this.dataa.message, "success");
          this.route.navigate(['/application/mdrdocumentmasterview']);
        }else if(this.dataa.status == "400"){
          this.swal("Error",this.dataa.message, "error");
        }
      });
    }
  })
}

updateremark(){
  let docname = $('#docname').val().toString().trim();
  if (docname==null || docname== "" || docname==undefined){
    this.swal("Info", "Please Enter Document Name", 'info');
    return;
  }
  Swal.fire({
    title: 'Are you sure?',
    // text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Update it!'
  }).then((result) => {
    if (result.isConfirmed) {
      let object={
        documentname:docname,
        createdby:this.user.userId,
        documentId:this.id,
        statusflag:this.status
      }
      this.foremarkservice.updatemstdoc(object).subscribe(data=>{
        this.dataa=data;
        if (this.dataa.status == 200) {
          this.swal("Success", this.dataa.message, "success");
          this.route.navigate(['/application/mdrdocumentmasterview']);
        }else if(this.dataa.status == 400){
          this.swal("Error",this.dataa.message, "error");
        }
      });
    }
  })
}

}

