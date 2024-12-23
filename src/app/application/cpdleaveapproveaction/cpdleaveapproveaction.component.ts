import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../header.service';
import { CpdleaveService } from '../Services/cpdleave.service';
import Swal from 'sweetalert2';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-cpdleaveapproveaction',
  templateUrl: './cpdleaveapproveaction.component.html',
  styleUrls: ['./cpdleaveapproveaction.component.scss']
})
export class CpdleaveapproveactionComponent implements OnInit {
user:any;
dataa:any;
  childmessage: any;
  cpddetails: any;
  hospital: any;
  cpduserId: any;
  userId: any;
  status: any;
  leavehistory: any;
  countleavehistory: any;
  currentPage1:any;
  pageElement1:any;
  showPegi:boolean;
  show:boolean;
  hos: any;
  constructor(public headerService: HeaderService,private cpdleaveservice:CpdleaveService,public route:Router,private sessionService: SessionStorageService)
   {this.user = this.route.getCurrentNavigation().extras.state; }

  ngOnInit(): void {
    this.status=this.user.status
    this.headerService.setTitle("CPD Details");
    this.headerService.isBack(false)
    this.getcpddetails();
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  getcpddetails(){
    this.cpdleaveservice.getcpddetails(this.user.user).subscribe(data=>{
      this.cpddetails=data;
      this.cpduserId=this.cpddetails.cpduserId;
      console.log(this.cpduserId);

      this.cpdleaveservice.getcpdmappingdetails(this.user.user).subscribe(data=>{
        console.log(data);

      this.hospital=data;
      this.hos=this.hospital.length;
      if(this.hos>0){
        this.show=true;
      }else{
        this.show=false
      }
      console.log(this.hos);
      })

      this.cpdleaveservice.getcpdleavehistory(this.user.user).subscribe(data=>{
        this.leavehistory=data;
        this.countleavehistory=this.leavehistory.length;
        console.log(data);
        if(this.countleavehistory>5){
          this.currentPage1 = 1;
          this.pageElement1= 5;
          this.showPegi=true;
        }
        })
    })
  }
  Action(item:any){

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
        // this.userId =JSON.parse(sessionStorage.getItem("user"));
        this.userId = this.sessionService.decryptSessionData("user");
        this.cpdleaveservice.Approvedetails(this.userId.userId,this.user.user,item).subscribe(data=>{
          this.dataa=data;
          console.log(data);
          if (this.dataa.status == "Success") {
            this.swal("Success", this.dataa.message, "success");
            this.route.navigate(['/application/cpdleaveapprove']);

          }else if(this.dataa.status == "Failed"){
            this.swal("Error", this.dataa.message, "error");
          }
        })
      }
    })
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
}
