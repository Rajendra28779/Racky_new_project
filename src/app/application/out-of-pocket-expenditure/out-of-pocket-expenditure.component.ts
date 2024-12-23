import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { OutOfPocketExpenditureServiceService } from '../Services/out-of-pocket-expenditure-service.service';

@Component({
  selector: 'app-out-of-pocket-expenditure',
  templateUrl: './out-of-pocket-expenditure.component.html',
  styleUrls: ['./out-of-pocket-expenditure.component.scss']
})
export class OutOfPocketExpenditureComponent implements OnInit {
  showupdate:boolean;
  childmessage: any;
  user: any;
  user1: any;
  status:any;
  dataa:any;
  getbyid={
    expname:"",
    description:"",
    isactive:"",
  };
  id:any;
  constructor(private outOfpocketexpenditureservice:OutOfPocketExpenditureServiceService,private route:Router,public headerService:HeaderService, private sessionService: SessionStorageService) {
    this.user1 = this.route.getCurrentNavigation().extras.state;

  }

  ngOnInit(): void {
    this.headerService.setTitle('Out Of Pocket Expenditure');
    this.user = this.sessionService.decryptSessionData("user");
    this.showupdate=false;
    if(this.user1!=undefined){
      this.showupdate=true
      this.getbyid.expname=this.user1.user.expenditurename;
      this.getbyid.isactive=this.user1.user.statusflag;
      this.status=this.user1.user.statusflag;
      this.id=this.user1.user.expenditureId;
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

  updatereset(){
    this.route.navigate(['/application/outOfpocketexpenditureview']);
  }
  resetform(){
    $('#expname').val('');
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  save(){
    let expname = $('#expname').val().toString().trim();
    if (expname==null || expname== "" || expname==undefined){
      this.swal("Info", "Please Enter Out of Pocket Expenditure", 'info');
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
          expenditurename:expname,
          createdby:this.user.userId
        }
        this.outOfpocketexpenditureservice.savemstdoc(object).subscribe(data=>{
          this.dataa=data;
          if (this.dataa.status == 200) {
            this.swal("Success", this.dataa.message, "success");
            this.route.navigate(['/application/outOfpocketexpenditureview']);
          }else if(this.dataa.status == "400"){
            this.swal("Error",this.dataa.message, "error");
          }
        });
      }
    })
  }
  update(){
    let expname = $('#expname').val().toString().trim();
    if (expname==null || expname== "" || expname==undefined){
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
          expenditurename:expname,
          createdby:this.user.userId,
          expenditureId:this.id,
          statusflag:this.status
        }
        this.outOfpocketexpenditureservice.update(object).subscribe(data=>{
          this.dataa=data;
          if (this.dataa.status == 200) {
            this.swal("Success", this.dataa.message, "success");
            this.route.navigate(['/application/outOfpocketexpenditureview']);
          }else if(this.dataa.status == 400){
            this.swal("Error",this.dataa.message, "error");
          }
        });
      }
    })
  }

}
