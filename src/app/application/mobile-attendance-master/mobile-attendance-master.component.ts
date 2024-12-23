import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { DcCdmomappingService } from '../Services/dc-cdmomapping.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';

@Component({
  selector: 'app-mobile-attendance-master',
  templateUrl: './mobile-attendance-master.component.html',
  styleUrls: ['./mobile-attendance-master.component.scss']
})
export class MobileAttendanceMasterComponent implements OnInit {
  stateList:any=[];
  districtList:any=[];
  user:any;
  isedit:any=false;
  state: any="";
  dist: any="";
  location: any="";
  locationId:any;
  data:any;


  constructor(private dcService: DcCdmomappingService,
    private sessionService: SessionStorageService,
    public headerService: HeaderService,
    private snoService: SnocreateserviceService,
    private route:Router) {
      this.data = this.route.getCurrentNavigation().extras.state;
    }

  ngOnInit(): void {
    this.headerService.setTitle('Mobile Attendance Location');
    this.user =  this.sessionService.decryptSessionData("user");
    this.getStateList();
    if(this.data){
      this.state=this.data.state;
      this.OnChangeState(this.state);
      this.dist=this.data.dist;
      this.location=this.data.location;
      this.locationId=this.data.locationid;
      this.isedit=true;
    }
  }

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    $("#districtId").val("");
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }

  ResetForm(){
    this.route.navigate(['application/mobileattendancemasterview']);
  }

  resetVal(){
    window.location.reload();
  }

  Submit(){
    this.state=$('#stateId').val();
    if (this.state == null || this.state == "" || this.state == undefined) {
      $("#stateId").focus();
      this.swal("Info", "Please Enter State Name", 'info');
      return;
    }
    this.dist=$('#districtId').val();
    if (this.dist == null || this.dist == "" || this.dist == undefined) {
      $("#districtId").focus();
      this.swal("Info", "Please Enter District Name", 'info');
      return;
    }
    this.location=$('#locationname').val();
    if (this.location == null || this.location == "" || this.location == undefined) {
      $("#locationname").focus();
      this.swal("Info", "Please Enter Location Name", 'info');
      return;
    }

    let object={
      stateCode:this.state,
      districtCode:this.dist,
      locationName:this.location,
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
          this.dcService.savemobileattendancemaster(object).subscribe((data:any)=>{
            if(data.status==200){
              this.swal("Success","Record submitted Successfully","success");
              this.route.navigate(['application/mobileattendancemasterview']);
            }else{
              this.swal("Error","Something Went Wrong !!","error");
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

  update(){
    this.state=$('#stateId').val();
    if (this.state == null || this.state == "" || this.state == undefined) {
      $("#stateId").focus();
      this.swal("Info", "Please Enter State Name", 'info');
      return;
    }
    this.dist=$('#districtId').val();
    if (this.dist == null || this.dist == "" || this.dist == undefined) {
      $("#districtId").focus();
      this.swal("Info", "Please Enter District Name", 'info');
      return;
    }
    this.location=$('#locationname').val();
    if (this.location == null || this.location == "" || this.location == undefined) {
      $("#locationname").focus();
      this.swal("Info", "Please Enter Location Name", 'info');
      return;
    }
    let object={
      stateCode:this.state,
      districtCode:this.dist,
      locationName:this.location,
      createdBy:this.user.userId,
      locationId:this.locationId
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
          this.dcService.updatemobileattendancemaster(object).subscribe((data:any)=>{
            if(data.status==200){
              this.swal("Success","Record Updated Successfully","success");
              this.route.navigate(['application/mobileattendancemasterview']);
            }else{
              this.swal("Error","Something Went Wrong !!","error");
            }
          });
        }
      });
  }

}
