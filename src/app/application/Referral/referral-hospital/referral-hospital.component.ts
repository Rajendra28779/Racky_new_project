import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { ReferralService } from '../../Services/referral.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-referral-hospital',
  templateUrl: './referral-hospital.component.html',
  styleUrls: ['./referral-hospital.component.scss']
})
export class ReferralHospitalComponent implements OnInit {
  isUpdateBtnInVisible:any=true;
  mobileformat=/[6-9][0-9]{9}$/;
  districtList: any=[];
  blocklist: any=[];
  hosptypelist:any=[];
  user:any;
  hospital:any;
  hosptypebyid:any;
 status:any;
 maxChars:any=250;
 maxChars1:any=100;


  constructor(private userService: ReferralService,private snoService: SnocreateserviceService,private route: Router, public headerService: HeaderService,private sessionService: SessionStorageService,) {
    this.hospital = this.route.getCurrentNavigation().extras.state;
   }

  ngOnInit(): void {
    this.headerService.setTitle('Create Referral Hospital');
    // this.user=JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.getdistlist();
    this.getreferralhospitaltype();
    if(this.hospital){
      this.gethospitalbyid(this.hospital.id);
    }
  }

  updatinglist={
    hospitalid:"",
    distcode:"",
    blockcode:"",
    hosptype:"",
    hospname:"",
    cnctname:"",
    cnctno:"",
    address:"",
    status:""
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

  gethospitalbyid(id:any){
    this.userService.gethospitalbyid(id).subscribe(
      (response) => {
        this.hosptypebyid = response;
        this.updatinglist.hospitalid=this.hosptypebyid.hospitalid
        this.updatinglist.distcode=this.hosptypebyid.distcode
        this.OnChangeDistrict(this.updatinglist.distcode)
        this.updatinglist.blockcode=this.hosptypebyid.blockcode
        this.updatinglist.hosptype=this.hosptypebyid.hospitaltype
        this.updatinglist.hospname=this.hosptypebyid.hospitalname
        this.updatinglist.cnctname=this.hosptypebyid.cnctperson
        this.updatinglist.cnctno=this.hosptypebyid.mobileno
        this.updatinglist.status=this.hosptypebyid.status
        this.status=this.hosptypebyid.status
        this.updatinglist.address=this.hosptypebyid.address
        this.isUpdateBtnInVisible=false;
      },
      (error) => console.log(error)
    )
  }
  getreferralhospitaltype(){
    this.userService.getreferralhospitaltype().subscribe(
      (response) => {
        this.hosptypelist = response;
      },
      (error) => console.log(error)
    )
  }

  getdistlist(){
    this.snoService.getDistrictListByStateId(21).subscribe(
      (response) => {
        this.districtList = response;
        // console.log(response);
      },
      (error) => console.log(error)
    )
  }

  OnChangeDistrict(id){
    this.snoService.getBlockbyDistrictId(id, 21).subscribe(
      (response) => {
        // console.log(response);
        this.blocklist = response;
      },
      (error) => console.log(error)
    )
  }

  validatePhoneNo() {
    let mobileNo=$('#mobile').val().toString();
    if(mobileNo.length<10){
      $("#mobile").focus();
      this.swal("Info", "Please Enter 10 digit Mobile No", 'info');
      return;
    }
    if (!mobileNo.match(this.mobileformat)) {
      $("#mobile").focus();
      this.swal("Info", "Please Provide Valid Mobile No", 'info');
      return;
    }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  SubmitCreate(){
    let distcode = $('#districtId').val().toString();
    let blockcode = $('#blockId').val().toString();
    let hospitaltype = $('#hosptype').val().toString();
    let hospitalname = $('#hospname').val().toString();
    let person = $('#personname').val().toString();
    let mobile = $('#mobile').val().toString();
    let address = $('#hospitaladd').val().toString();

    if (distcode==null || distcode== "" || distcode==undefined){
      $("#districtId").focus();
      this.swal("Info", "Please Select District", 'info');
      return;
    }
    if (hospitaltype==null || hospitaltype== "" || hospitaltype==undefined){
      $("#hosptype").focus();
      this.swal("Info", "Please Select Hospital Type", 'info');
      return;
    }
    if (hospitalname==null || hospitalname== "" || hospitalname==undefined){
      $("#hospname").focus();
      this.swal("Info", "Please Enter Hospital Name", 'info');
      return;
    }
    if (mobile!=""){
      if (!(mobile.toString()).match(this.mobileformat)){
        $("#mobile").focus();
        this.swal("Info", "Please Enter Valid Mobile No", 'info');
        return;
      }
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
        let object={
          distcode:distcode,
          blockcode:blockcode,
          hospitaltype:hospitaltype,
          hospitalname:hospitalname,
          cnctperson:person,
          mobileno:mobile,
          address:address,
          createdby:this.user.userId
        }

        this.userService.savereferalhospital(object).subscribe((data:any)=>{
          console.log(data);
          if(data.status==200){
            this.swal("Success", data.message, 'success');
            $('#districtId').val('');
            $('#blockId').val('');
            $('#hosptype').val('');
            $('#hospname').val('');
            $('#personname').val('');
            $('#mobile').val('');
            $('#hospitaladd').val('');
            this.route.navigate(['application/referalhospitalview']);
          }else{
            this.swal("Error", data.message, 'error');
          }
        });
      }
    });

  }

  updategroup(){
    let distcode = $('#districtId').val().toString();
    let blockcode = $('#blockId').val().toString();
    let hospitaltype = $('#hosptype').val().toString();
    let hospitalname = $('#hospname').val().toString();
    let person = $('#personname').val().toString();
    let mobile = $('#mobile').val().toString();
    let address = $('#hospitaladd').val().toString();

    if (distcode==null || distcode== "" || distcode==undefined){
      $("#districtId").focus();
      this.swal("Info", "Please Select District", 'info');
      return;
    }
    if (hospitaltype==null || hospitaltype== "" || hospitaltype==undefined){
      $("#hosptype").focus();
      this.swal("Info", "Please Select Hospital Type", 'info');
      return;
    }
    if (hospitalname==null || hospitalname== "" || hospitalname==undefined){
      $("#hospname").focus();
      this.swal("Info", "Please Enter Hospital Name", 'info');
      return;
    }
    if (mobile!=""){
      if (!(mobile.toString()).match(this.mobileformat)){
        $("#mobile").focus();
        this.swal("Info", "Please Enter Valid Mobile No", 'info');
        return;
      }
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
        let object={
          hospitalid:this.updatinglist.hospitalid,
          distcode:distcode,
          blockcode:blockcode,
          hospitaltype:hospitaltype,
          hospitalname:hospitalname,
          cnctperson:person,
          mobileno:mobile,
          address:address,
          updatedby:this.user.userId,
          status:this.status
        }

        this.userService.updatereferalhospital(object).subscribe((data:any)=>{
          console.log(data);
          if(data.status==200){
            this.swal("Success", data.message, 'success');
            $('#districtId').val('');
            $('#blockId').val('');
            $('#hosptype').val('');
            $('#hospname').val('');
            $('#personname').val('');
            $('#mobile').val('');
            $('#hospitaladd').val('');
            this.route.navigate(['application/referalhospitalview']);
          }else{
            this.swal("Error", data.message, 'error');
          }
        });
      }
    });
  }

  yes($event: any) {
    this.status = 0;
  }

  no($event: any) {
    this.status = 1;
  }

  resetVal() {
    window.location.reload();
 }

 ResetForm(){
  this.route.navigate(['application/referalhospitalview']);
 }


}
